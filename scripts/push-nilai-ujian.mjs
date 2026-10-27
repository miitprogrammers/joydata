/**
 * JOYdata push:nilai-ujian — imports nilai ujian JSON files (nilai-ujian-joy1.json, ...) transcribed
 * from photos of exam papers into the `nilai_ujian` table.
 *
 * Source format: { kelas: { namaKelas, mancationClassId }, nilai: [{ mancationAkunId, nama, namaDiKertas,
 *   codeUjian, tanggalUjian, pola, nilaiTunggal | nilaiMojiGoi/nilaiBunpou/nilaiDokkai/nilaiChoukai, catatan }] }
 *
 * - Target follows the app engine: Postgres/Supabase when DATABASE_URL is valid & reachable,
 *   otherwise the local store .data/joydata-db.json.
 * - Kelas is resolved by mancationClassId and peserta by mancationAkunId in the TARGET database.
 * - Every row is checked with the app's own validateAndNormalizeNilaiUjian (server/domain/rules.js).
 * - One score per peserta per exam code: when a file holds several papers for the same code (remedial,
 *   other variant) only the highest is pushed, and a stored row with that code under another date is replaced.
 * - Upsert on (peserta_id, kelas_id, tanggal_ujian, nama_ujian): re-running is idempotent and overwrites scores.
 * - One transaction per file (Postgres); rows whose peserta/kelas are missing are skipped and reported.
 *
 * Usage:
 *   node scripts/push-nilai-ujian.mjs                          # all nilai-ujian-*.json in the project root
 *   node scripts/push-nilai-ujian.mjs nilai-ujian-joy1.json    # specific file(s)
 *   node scripts/push-nilai-ujian.mjs --dry-run                # validate only, no writes
 *   node scripts/push-nilai-ujian.mjs --local                  # force local store
 *   node scripts/push-nilai-ujian.mjs --force                  # local mode even if dev server is running
 */
import 'dotenv/config';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (path.resolve(process.cwd()) !== projectRoot) process.chdir(projectRoot);
const { LOCAL_DB_PATH, writeLocalStateFile } = await import('../server/db/engine.js');
const { validateAndNormalizeNilaiUjian } = await import('../server/domain/rules.js');

const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--')));
const dryRun = flags.has('--dry-run');
const forced = flags.has('--force');
const forceLocal = flags.has('--local');
const files = argv.filter((a) => !a.startsWith('--'));
const defaultFiles = () => fs.readdirSync(projectRoot).filter((f) => /^nilai-ujian-.+\.json$/.test(f)).sort();
const inputFiles = (files.length ? files : defaultFiles()).map((f) => path.resolve(projectRoot, f));
const AUDIT_ACTION = 'IMPORT_NILAI_UJIAN_FOTO';

// ---------- load & validate source files ----------
function loadSource(file) {
  if (!fs.existsSync(file)) throw new Error(`File tidak ditemukan: ${file}`);
  const { kelas, nilai } = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!kelas?.mancationClassId || !Array.isArray(nilai)) {
    throw new Error(`Format tidak dikenali (butuh kelas.mancationClassId, nilai[]): ${file}`);
  }
  const best = new Map();
  const invalid = [];
  const superseded = [];
  for (const r of nilai) {
    const akun = Number(r.mancationAkunId);
    // peserta/kelas ids are resolved per target later; placeholders let the domain rules check the rest
    const check = validateAndNormalizeNilaiUjian({ ...r, pesertaId: 1, kelasId: 1 });
    if (!Number.isInteger(akun) || akun <= 0 || !check.ok) {
      invalid.push({ nama: r.nama, codeUjian: r.codeUjian, alasan: check.ok ? 'mancationAkunId tidak valid' : check.code });
      continue;
    }
    const { pesertaId, kelasId, ...d } = check.normalized;
    const row = { akun, nama: r.nama, ...d };
    // remedial/variant papers for the same exam code compete; the highest score is kept
    const key = `${akun}|${d.codeUjian.toLowerCase()}`;
    const current = best.get(key);
    if (current && (current.nilaiAvg ?? -1) >= (row.nilaiAvg ?? -1)) {
      superseded.push(row);
    } else {
      if (current) superseded.push(current);
      best.set(key, row);
    }
  }
  return {
    file: path.basename(file),
    namaKelas: kelas.namaKelas,
    mancationClassId: kelas.mancationClassId,
    rows: [...best.values()],
    invalid,
    superseded,
  };
}

function summarizeRows(rows) {
  const codes = [...new Set(rows.map((r) => r.codeUjian))].sort();
  const dates = [...new Set(rows.map((r) => r.tanggalUjian))].sort();
  return `${rows.length} baris, ujian ${codes.join(', ') || '-'}, tanggal ${dates[0] ?? '-'}..${dates.at(-1) ?? '-'}`;
}

// ---------- helpers ----------
function hasValidPostgresUrl() {
  const url = process.env.DATABASE_URL || '';
  return url.startsWith('postgres') && !url.includes('YOUR_DB_PASSWORD') && !url.includes('your-project-ref');
}

function isPortOpen(port, host = '127.0.0.1', timeout = 700) {
  return new Promise((resolve) => {
    const s = new net.Socket();
    let done = false;
    const finish = (v) => { if (!done) { done = true; s.destroy(); resolve(v); } };
    s.setTimeout(timeout);
    s.once('connect', () => finish(true));
    s.once('timeout', () => finish(false));
    s.once('error', () => finish(false));
    s.connect(port, host);
  });
}

// ---------- Postgres ----------
async function pushPostgres(pool, src) {
  const kelasRes = await pool.query(
    'SELECT id, nama_kelas FROM kelas WHERE mancation_class_id = $1 AND deleted_at IS NULL',
    [src.mancationClassId]
  );
  if (!kelasRes.rows.length) throw new Error(`[${src.file}] kelas mancation ${src.mancationClassId} tidak ada di DB`);
  const kelasId = kelasRes.rows[0].id;

  const akuns = [...new Set(src.rows.map((r) => r.akun))];
  const pesRes = await pool.query(
    'SELECT id, mancation_akun_id FROM peserta WHERE mancation_akun_id = ANY($1::int[])',
    [akuns]
  );
  const pesertaByAkun = new Map(pesRes.rows.map((p) => [p.mancation_akun_id, p.id]));
  const ready = src.rows.filter((r) => pesertaByAkun.has(r.akun));
  const existing = await pool.query(
    'SELECT id, peserta_id, nama_ujian, tanggal_ujian::text AS tanggal FROM nilai_ujian WHERE kelas_id = $1 AND peserta_id = ANY($2::int[])',
    [kelasId, ready.map((r) => pesertaByAkun.get(r.akun))]
  );
  const staleIds = existing.rows
    .filter((e) => ready.some((r) => pesertaByAkun.get(r.akun) === e.peserta_id
      && r.codeUjian.toLowerCase() === e.nama_ujian.toLowerCase() && r.tanggalUjian !== e.tanggal))
    .map((e) => e.id);
  report(src, kelasId, ready, akuns.filter((a) => !pesertaByAkun.has(a)), staleIds.length);
  if (dryRun || !ready.length) return 0;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (staleIds.length) await client.query('DELETE FROM nilai_ujian WHERE id = ANY($1::int[])', [staleIds]);
    const CHUNK = 300;
    for (let i = 0; i < ready.length; i += CHUNK) {
      const part = ready.slice(i, i + CHUNK);
      const values = [];
      const params = [];
      part.forEach((r, j) => {
        const b = j * 11;
        values.push(`(${Array.from({ length: 11 }, (_, k) => `$${b + k + 1}`).join(', ')}, NULL)`);
        params.push(pesertaByAkun.get(r.akun), kelasId, r.tanggalUjian, r.codeUjian, r.pola, r.nilaiTunggal,
          r.nilaiMojiGoi, r.nilaiBunpou, r.nilaiDokkai, r.nilaiChoukai, r.catatan);
      });
      await client.query(
        `INSERT INTO nilai_ujian
           (peserta_id, kelas_id, tanggal_ujian, nama_ujian, tipe_penilaian, nilai_tunggal,
            moji_goi, bunpou, dokkai, choukai, catatan, diinput_oleh_staff_id)
         VALUES ${values.join(', ')}
         ON CONFLICT (peserta_id, kelas_id, tanggal_ujian, nama_ujian) DO UPDATE SET
           tipe_penilaian = EXCLUDED.tipe_penilaian,
           nilai_tunggal = EXCLUDED.nilai_tunggal,
           moji_goi = EXCLUDED.moji_goi,
           bunpou = EXCLUDED.bunpou,
           dokkai = EXCLUDED.dokkai,
           choukai = EXCLUDED.choukai,
           catatan = EXCLUDED.catatan`,
        params
      );
    }
    await client.query(
      `INSERT INTO audit_log (staff_id, staff_nama, aksi, entitas, entitas_id, detail)
       VALUES ($1, $2, $3, 'nilai_ujian', $4, $5)`,
      [null, 'System (push-nilai-ujian)', AUDIT_ACTION, String(kelasId),
        JSON.stringify({ sumber: src.file, kelasId, totalBaris: ready.length, diganti: staleIds.length })]
    );
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
  return ready.length;
}

// ---------- Local store ----------
function pushLocal(db, src) {
  const kelas = (db.kelas || []).find((k) => Number(k.mancationClassId) === Number(src.mancationClassId) && !k.deletedAt);
  if (!kelas) throw new Error(`[${src.file}] kelas mancation ${src.mancationClassId} tidak ada di store lokal`);
  const pesertaByAkun = new Map((db.peserta || []).map((p) => [Number(p.mancationAkunId), p.id]));
  const akuns = [...new Set(src.rows.map((r) => r.akun))];
  const ready = src.rows.filter((r) => pesertaByAkun.has(r.akun));
  const isStale = (e) => Number(e.kelasId) === kelas.id && ready.some((r) => pesertaByAkun.get(r.akun) === Number(e.pesertaId)
    && r.codeUjian.toLowerCase() === String(e.codeUjian).toLowerCase() && r.tanggalUjian !== e.tanggalUjian);
  const staleCount = (db.nilaiUjian || []).filter(isStale).length;
  report(src, kelas.id, ready, akuns.filter((a) => !pesertaByAkun.has(a)), staleCount);
  if (dryRun) return 0;

  db.nilaiUjian = (db.nilaiUjian || []).filter((e) => !isStale(e));
  db.seq ||= {};
  db.seq.nilaiUjian = Math.max(db.seq.nilaiUjian || 1, db.nilaiUjian.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1);
  const keyOf = (pesertaId, kelasId, tanggal, code) => `${pesertaId}|${kelasId}|${tanggal}|${String(code).toLowerCase()}`;
  const index = new Map(db.nilaiUjian.map((r) => [keyOf(r.pesertaId, r.kelasId, r.tanggalUjian, r.codeUjian), r]));
  const now = new Date().toISOString();
  for (const r of ready) {
    const pesertaId = pesertaByAkun.get(r.akun);
    const key = keyOf(pesertaId, kelas.id, r.tanggalUjian, r.codeUjian);
    const scores = { pola: r.pola, codeUjian: r.codeUjian, nilaiTunggal: r.nilaiTunggal, nilaiMojiGoi: r.nilaiMojiGoi,
      nilaiBunpou: r.nilaiBunpou, nilaiDokkai: r.nilaiDokkai, nilaiChoukai: r.nilaiChoukai, catatan: r.catatan };
    const existing = index.get(key);
    if (existing) {
      Object.assign(existing, scores);
    } else {
      const row = { id: db.seq.nilaiUjian++, pesertaId, kelasId: kelas.id, tanggalUjian: r.tanggalUjian, ...scores,
        penilaiId: null, createdAt: now };
      db.nilaiUjian.push(row);
      index.set(key, row);
    }
  }
  db.auditLog ||= [];
  db.seq.auditLog = Math.max(db.seq.auditLog || 1, db.auditLog.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1);
  db.auditLog.push({ id: db.seq.auditLog++, staffId: null, staffNama: 'System (push-nilai-ujian)', aksi: AUDIT_ACTION,
    entitas: 'nilai_ujian', entitasId: String(kelas.id), detail: { sumber: src.file, kelasId: kelas.id, totalBaris: ready.length, diganti: staleCount }, createdAt: now });
  return ready.length;
}

function report(src, kelasId, ready, missingAkun, staleCount) {
  console.log(`\n[${src.file}] ${src.namaKelas} -> kelas_id ${kelasId}`);
  console.log(`  siap: ${summarizeRows(ready)}`);
  for (const r of ready) {
    const skor = r.pola === 'tunggal'
      ? r.nilaiTunggal
      : `MG ${r.nilaiMojiGoi ?? '-'} / B ${r.nilaiBunpou ?? '-'} / D ${r.nilaiDokkai ?? '-'} / C ${r.nilaiChoukai ?? '-'} (avg ${r.nilaiAvg})`;
    console.log(`    ${r.tanggalUjian}  ${r.codeUjian.padEnd(6)} ${String(r.nama ?? r.akun).padEnd(28)} ${skor}`);
  }
  for (const r of src.superseded) {
    console.log(`  - tidak dipakai, ada nilai ${r.codeUjian} lebih tinggi: ${r.nama ?? r.akun} ${r.tanggalUjian} ${r.nilaiAvg}`);
  }
  if (staleCount) console.log(`  ~ diganti: ${staleCount} baris lama dengan kode ujian sama tapi tanggal lain`);
  for (const r of src.invalid) console.log(`  ! dilewati: ${r.nama ?? '?'} ${r.codeUjian ?? ''} (${r.alasan})`);
  if (missingAkun.length) console.log(`  ! peserta tidak ada di DB (mancationAkunId): ${missingAkun.join(', ')}`);
}

// ---------- main ----------
async function main() {
  console.log(`JOYdata push:nilai-ujian${dryRun ? ' (dry-run)' : ''}`);
  if (!inputFiles.length) throw new Error('Tidak ada file nilai-ujian-*.json');
  const sources = inputFiles.map(loadSource);

  let pool = null;
  if (!forceLocal && hasValidPostgresUrl()) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    });
    try {
      await pool.query('SELECT 1');
    } catch (err) {
      console.warn(`! Postgres tidak dapat dihubungi (${err.message}); memakai store lokal.`);
      await pool.end();
      pool = null;
    }
  }

  let total = 0;
  if (pool) {
    console.log(`Target: Postgres/Supabase (${new URL(process.env.DATABASE_URL).hostname})`);
    try {
      for (const src of sources) total += await pushPostgres(pool, src);
    } finally {
      await pool.end();
    }
  } else {
    console.log(`Target: store lokal ${LOCAL_DB_PATH}`);
    const port = Number(process.env.PORT || 3000);
    if (!dryRun && !forced && (await isPortOpen(port))) {
      throw new Error(`Server dev berjalan di port ${port}; state di memori akan menimpa hasil import. Hentikan dulu atau pakai --force.`);
    }
    const db = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
    for (const src of sources) total += pushLocal(db, src);
    if (!dryRun) writeLocalStateFile(db);
  }

  console.log(dryRun ? '\nSelesai (dry-run, tidak ada perubahan).' : `\nSelesai: ${total} baris nilai ujian di-upsert.`);
}

main().catch((err) => {
  console.error(`\npush:nilai-ujian gagal: ${err.message}`);
  process.exit(1);
});
