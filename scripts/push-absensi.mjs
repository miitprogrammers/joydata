/**
 * JOYdata push:absensi — imports generated absensi JSON files (absensi.json, absensi-joy2.json,
 * absensi-joy3.json) into the `absensi` table.
 *
 * - Target follows the app engine: Postgres/Supabase when DATABASE_URL is valid & reachable,
 *   otherwise the local store .data/joydata-db.json.
 * - Kelas is resolved by mancationClassId and peserta by mancationAkunId in the TARGET database,
 *   so differing serial ids between local and Postgres do not matter.
 * - Upsert on (peserta_id, kelas_id, tanggal): re-running is idempotent and overwrites status/keterangan.
 * - One transaction per file (Postgres); rows whose peserta/kelas are missing are skipped and reported.
 *
 * Usage:
 *   node scripts/push-absensi.mjs                       # all three default files
 *   node scripts/push-absensi.mjs absensi-joy3.json     # specific file(s)
 *   node scripts/push-absensi.mjs --dry-run             # validate only, no writes
 *   node scripts/push-absensi.mjs --local               # force local store
 *   node scripts/push-absensi.mjs --force               # local mode even if dev server is running
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

const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--')));
const dryRun = flags.has('--dry-run');
const forced = flags.has('--force');
const forceLocal = flags.has('--local');
const DEFAULT_FILES = ['absensi.json', 'absensi-joy2.json', 'absensi-joy3.json'];
const files = argv.filter((a) => !a.startsWith('--'));
const inputFiles = (files.length ? files : DEFAULT_FILES).map((f) => path.resolve(projectRoot, f));
const VALID_STATUS = new Set(['hadir', 'sakit', 'izin', 'alfa']);
const AUDIT_ACTION = 'IMPORT_ABSENSI_CHAT';

// ---------- load & validate source files ----------
function loadSource(file) {
  if (!fs.existsSync(file)) throw new Error(`File tidak ditemukan: ${file}`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const { kelas, peserta, absensi } = data;
  if (!kelas?.mancationClassId || !Array.isArray(peserta) || !Array.isArray(absensi)) {
    throw new Error(`Format tidak dikenali (butuh kelas.mancationClassId, peserta[], absensi[]): ${file}`);
  }
  const akunBySourceId = new Map(peserta.map((p) => [p.id, p.mancationAkunId]));
  const rows = [];
  const invalid = [];
  for (const r of absensi) {
    const akun = akunBySourceId.get(r.pesertaId);
    const ok = akun && /^\d{4}-\d{2}-\d{2}$/.test(r.tanggal || '') && VALID_STATUS.has(r.status);
    if (!ok) { invalid.push(r); continue; }
    rows.push({ akun, tanggal: r.tanggal, status: r.status, keterangan: String(r.keterangan ?? '') });
  }
  return {
    file: path.basename(file),
    namaKelas: kelas.namaKelas,
    mancationClassId: kelas.mancationClassId,
    senseiId: kelas.sensei?.id ?? null,
    rows,
    invalid,
  };
}

function summarizeRows(rows) {
  const c = { hadir: 0, sakit: 0, izin: 0, alfa: 0 };
  for (const r of rows) c[r.status] += 1;
  const dates = [...new Set(rows.map((r) => r.tanggal))].sort();
  return `${rows.length} baris, ${dates.length} hari (${dates[0] ?? '-'}..${dates.at(-1) ?? '-'}) ` +
    `hadir ${c.hadir} / sakit ${c.sakit} / izin ${c.izin} / alfa ${c.alfa}`;
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
  const staffRes = src.senseiId ? await pool.query('SELECT id, nama FROM staff WHERE id = $1', [src.senseiId]) : { rows: [] };
  const staff = staffRes.rows[0] ?? null;

  const ready = src.rows.filter((r) => pesertaByAkun.has(r.akun));
  const missingAkun = akuns.filter((a) => !pesertaByAkun.has(a));
  report(src, kelasId, ready, missingAkun);
  if (dryRun || !ready.length) return 0;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const CHUNK = 500;
    for (let i = 0; i < ready.length; i += CHUNK) {
      const part = ready.slice(i, i + CHUNK);
      const values = [];
      const params = [];
      part.forEach((r, j) => {
        const b = j * 6;
        values.push(`($${b + 1}, $${b + 2}, $${b + 3}, $${b + 4}, $${b + 5}, $${b + 6}, NOW())`);
        params.push(pesertaByAkun.get(r.akun), kelasId, r.tanggal, r.status, r.keterangan, staff?.id ?? null);
      });
      await client.query(
        `INSERT INTO absensi (peserta_id, kelas_id, tanggal, status, keterangan, diinput_oleh_staff_id, updated_at)
         VALUES ${values.join(', ')}
         ON CONFLICT (peserta_id, kelas_id, tanggal) DO UPDATE SET
           status = EXCLUDED.status,
           keterangan = EXCLUDED.keterangan,
           diinput_oleh_staff_id = EXCLUDED.diinput_oleh_staff_id,
           updated_at = NOW()`,
        params
      );
    }
    await client.query(
      `INSERT INTO audit_log (staff_id, staff_nama, aksi, entitas, entitas_id, detail)
       VALUES ($1, $2, $3, 'absensi', $4, $5)`,
      [null, 'System (push-absensi)', AUDIT_ACTION, String(kelasId),
        JSON.stringify({ sumber: src.file, kelasId, totalBaris: ready.length })]
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
  const staffOk = src.senseiId && (db.staff || []).some((s) => s.id === src.senseiId);
  const akuns = [...new Set(src.rows.map((r) => r.akun))];
  const ready = src.rows.filter((r) => pesertaByAkun.has(r.akun));
  report(src, kelas.id, ready, akuns.filter((a) => !pesertaByAkun.has(a)));
  if (dryRun) return 0;

  db.absensi ||= [];
  db.seq ||= {};
  db.seq.absensi = Math.max(db.seq.absensi || 1, db.absensi.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1);
  const index = new Map(db.absensi.map((r) => [`${r.pesertaId}|${r.kelasId}|${r.tanggalAbsensi}`, r]));
  const now = new Date().toISOString();
  for (const r of ready) {
    const pesertaId = pesertaByAkun.get(r.akun);
    const key = `${pesertaId}|${kelas.id}|${r.tanggal}`;
    const existing = index.get(key);
    if (existing) {
      Object.assign(existing, { status: r.status, description: r.keterangan, penilaiId: staffOk ? src.senseiId : existing.penilaiId, updatedAt: now });
    } else {
      const row = { id: db.seq.absensi++, pesertaId, kelasId: kelas.id, tanggalAbsensi: r.tanggal, status: r.status,
        description: r.keterangan, penilaiId: staffOk ? src.senseiId : null, updatedAt: now };
      db.absensi.push(row);
      index.set(key, row);
    }
  }
  db.auditLog ||= [];
  db.seq.auditLog = Math.max(db.seq.auditLog || 1, db.auditLog.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1);
  db.auditLog.push({ id: db.seq.auditLog++, staffId: null, staffNama: 'System (push-absensi)', aksi: AUDIT_ACTION,
    entitas: 'absensi', entitasId: String(kelas.id), detail: { sumber: src.file, kelasId: kelas.id, totalBaris: ready.length }, createdAt: now });
  return ready.length;
}

function report(src, kelasId, ready, missingAkun) {
  console.log(`\n[${src.file}] ${src.namaKelas} -> kelas_id ${kelasId}`);
  console.log(`  siap: ${summarizeRows(ready)}`);
  if (src.invalid.length) console.log(`  ! dilewati (data tidak valid): ${src.invalid.length} baris`);
  if (missingAkun.length) console.log(`  ! peserta tidak ada di DB (mancationAkunId): ${missingAkun.join(', ')}`);
}

// ---------- main ----------
async function main() {
  console.log(`JOYdata push:absensi${dryRun ? ' (dry-run)' : ''}`);
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

  console.log(dryRun ? '\nSelesai (dry-run, tidak ada perubahan).' : `\nSelesai: ${total} baris absensi di-upsert.`);
}

main().catch((err) => {
  console.error(`\npush:absensi gagal: ${err.message}`);
  process.exit(1);
});
