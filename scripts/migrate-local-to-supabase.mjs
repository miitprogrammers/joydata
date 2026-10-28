/**
 * JOYdata migrate:supabase — copies the whole local store (.data/joydata-db.json) into an EMPTY
 * Postgres/Supabase database, keeping every id so all relations stay intact.
 *
 * - One transaction: any error rolls everything back.
 * - Refuses when any target table already has rows (never overwrites existing Supabase data).
 * - Sequences are moved past the copied ids so rows created later by the app do not collide.
 * - Row counts are verified inside the transaction before COMMIT.
 * - --dry-run performs the full copy and verification, then rolls back.
 * - The local store is only read, never modified, so it stays as a backup.
 * - Settings are copied too, but the app still reads them from the local store (fase3Repo).
 *
 * Usage:
 *   node scripts/migrate-local-to-supabase.mjs --dry-run   # full trial run, rolled back
 *   node scripts/migrate-local-to-supabase.mjs             # real copy (stop the dev server first)
 *   node scripts/migrate-local-to-supabase.mjs --force     # even if the dev server is running
 */
import 'dotenv/config';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (path.resolve(process.cwd()) !== projectRoot) process.chdir(projectRoot);
const { LOCAL_DB_PATH } = await import('../server/db/engine.js');

const flags = new Set(process.argv.slice(2));
const dryRun = flags.has('--dry-run');
const forced = flags.has('--force');
const AUDIT_ACTION = 'MIGRASI_LOKAL_KE_SUPABASE';

const now = new Date().toISOString();
const str = (v) => (v == null ? '' : String(v));
const orNull = (v) => (v === '' || v === undefined ? null : v);
const num = (v) => (v === '' || v == null ? null : Number(v));
const ts = (v) => v || now;

// [table, local collection (or rows builder), has serial id, { column: (localRow) => value }] in FK order
const TABLES = [
  ['role', 'roles', true, {
    id: (r) => r.id, kode: (r) => r.kode, role_name_id: (r) => str(r.roleNameId), role_name_ja: (r) => str(r.roleNameJa),
    is_system: (r) => Boolean(r.isSystem), created_at: (r) => ts(r.createdAt),
  }],
  ['page', 'pages', true, {
    id: (r) => r.id, kode: (r) => r.kode, bar: (r) => str(r.bar), route_path: (r) => str(r.routePath),
    title_id: (r) => str(r.titleId), title_ja: (r) => str(r.titleJa), icon: (r) => str(r.icon),
    urutan: (r) => num(r.urutan) ?? 0, fase: (r) => num(r.fase) ?? 1,
  }],
  ['access', 'access', false, { role_id: (r) => r.roleId, page_id: (r) => r.pageId }],
  ['staff', 'staff', true, {
    id: (r) => r.id, nama: (r) => str(r.nama), username: (r) => r.username, password_hash: (r) => r.passwordHash,
    role_id: (r) => r.roleId, active: (r) => Boolean(r.active), deleted_at: (r) => orNull(r.deletedAt), created_at: (r) => ts(r.createdAt),
  }],
  ['program', 'programs', true, {
    id: (r) => r.id, nama_id: (r) => str(r.namaId), nama_ja: (r) => str(r.namaJa), urutan: (r) => num(r.urutan) ?? 0,
    aktif: (r) => Boolean(r.aktif), created_at: (r) => ts(r.createdAt),
  }],
  ['sikap_kategori', 'sikapKategori', true, {
    id: (r) => r.id, nama_id: (r) => str(r.namaId), nama_ja: (r) => str(r.namaJa), sentiment_default: (r) => str(r.sentimentDefault),
    bobot_default: (r) => num(r.bobotDefault) ?? 0, urutan: (r) => num(r.urutan) ?? 0, aktif: (r) => Boolean(r.aktif),
    created_at: (r) => ts(r.createdAt),
  }],
  ['kelas', 'kelas', true, {
    id: (r) => r.id, nama_kelas: (r) => str(r.namaKelas), program_id: (r) => orNull(r.programId), tanggal_start: (r) => r.tanggalStart,
    description: (r) => str(r.description), mancation_class_id: (r) => orNull(r.mancationClassId), sensei_id: (r) => orNull(r.senseiId),
    status: (r) => str(r.status), deleted_at: (r) => orNull(r.deletedAt), created_at: (r) => ts(r.createdAt),
  }],
  ['peserta', 'peserta', true, {
    id: (r) => r.id, mancation_akun_id: (r) => r.mancationAkunId, kelas_id: (r) => orNull(r.kelasId), status_tag: (r) => str(r.statusTag),
    sumber: (r) => str(r.sumber), keterangan_luar_kelas: (r) => orNull(r.keteranganLuarKelas), alasan: (r) => str(r.alasan),
    tanggal_masuk: (r) => orNull(r.tanggalMasuk), pendidikan_akhir: (r) => str(r.pendidikanAkhir),
    pendidikan_akhir_ja: (r) => str(r.pendidikanAkhirJa),
    tanggal_lahir_lokal: (r) => orNull(r.tanggalLahirLokal), status_pernikahan_lokal: (r) => str(r.statusPernikahanLokal),
    jumlah_anak_lokal: (r) => num(r.jumlahAnakLokal), agama_lokal: (r) => str(r.agamaLokal),
    daerah_asal_lokal: (r) => str(r.daerahAsalLokal), catatan_bebas: (r) => str(r.catatanBebas),
    created_at: (r) => ts(r.createdAt), updated_at: (r) => ts(r.updatedAt),
  }],
  ['absensi', 'absensi', true, {
    id: (r) => r.id, peserta_id: (r) => r.pesertaId, kelas_id: (r) => r.kelasId, tanggal: (r) => r.tanggalAbsensi,
    status: (r) => r.status, keterangan: (r) => str(r.description), diinput_oleh_staff_id: (r) => orNull(r.penilaiId),
    updated_at: (r) => ts(r.updatedAt),
  }],
  ['nilai_ujian', 'nilaiUjian', true, {
    id: (r) => r.id, peserta_id: (r) => r.pesertaId, kelas_id: (r) => orNull(r.kelasId), tanggal_ujian: (r) => r.tanggalUjian,
    nama_ujian: (r) => str(r.codeUjian), tipe_penilaian: (r) => r.pola, nilai_tunggal: (r) => num(r.nilaiTunggal),
    moji_goi: (r) => num(r.nilaiMojiGoi), bunpou: (r) => num(r.nilaiBunpou), dokkai: (r) => num(r.nilaiDokkai),
    choukai: (r) => num(r.nilaiChoukai), catatan: (r) => str(r.catatan), diinput_oleh_staff_id: (r) => orNull(r.penilaiId),
    created_at: (r) => ts(r.createdAt),
  }],
  ['audit_log', 'auditLog', true, {
    id: (r) => r.id, staff_id: (r) => orNull(r.staffId), staff_nama: (r) => str(r.staffNama), aksi: (r) => str(r.aksi),
    entitas: (r) => str(r.entitas), entitas_id: (r) => str(r.entitasId), detail: (r) => JSON.stringify(r.detail ?? {}),
    created_at: (r) => ts(r.createdAt),
  }],
  ['mancation_kelas_cache', 'mancationKelasCache', false, {
    mancation_class_id: (r) => r.mancationClassId, nama_kelas: (r) => str(r.namaKelas), program_studi: (r) => str(r.programStudi),
    class_stat: (r) => num(r.classStat) ?? 1, synced_at: (r) => ts(r.syncedAt),
  }],
  // same column mapping as pesertaRepo's Postgres cache write (daerahAsal lives in `alamat`)
  ['mancation_peserta_cache', 'mancationPesertaCache', false, {
    mancation_akun_id: (r) => r.mancationAkunId, mancation_class_id: (r) => orNull(r.mancationClassId), nama: (r) => str(r.nama),
    email: (r) => str(r.email), whatsapp: (r) => str(r.whatsapp), tanggal_lahir: (r) => orNull(r.tanggalLahir),
    status_pernikahan: (r) => str(r.statusPernikahan), jumlah_anak: (r) => num(r.jumlahAnak), agama: (r) => str(r.agama),
    alamat: (r) => str(r.daerahAsal), synced_at: (r) => ts(r.syncedAt),
  }],
  ['settings', (db) => Object.entries(db.settings || {}).map(([key, value]) => ({ key, value })), false, {
    key: (r) => r.key, value: (r) => JSON.stringify(r.value), updated_at: () => now,
  }],
];

// Collections this script has no verified mapping for yet; they must be empty locally.
const UNSUPPORTED = {
  pesertaPenempatan: 'peserta_penempatan',
  pesertaStatusLog: 'peserta_status_log',
  nilaiKaiwa: 'nilai_kaiwa',
  nilaiSikap: 'nilai_sikap',
  pushSubscriptions: 'push_subscription',
  pushLogs: 'push_log',
};

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

async function insertRows(client, table, mapping, rows) {
  const cols = Object.keys(mapping);
  const CHUNK = 500;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const params = [];
    const values = rows.slice(i, i + CHUNK).map((r) =>
      `(${cols.map((c) => { params.push(mapping[c](r)); return `$${params.length}`; }).join(', ')})`
    );
    await client.query(`INSERT INTO ${table} (${cols.join(', ')}) VALUES ${values.join(', ')}`, params);
  }
}

const countOf = async (client, table) => (await client.query(`SELECT COUNT(*)::int AS n FROM ${table}`)).rows[0].n;

// ---------- main ----------
async function main() {
  console.log(`JOYdata migrate:supabase${dryRun ? ' (dry-run, akan di-rollback)' : ''}`);
  if (!hasValidPostgresUrl()) throw new Error('DATABASE_URL belum diisi dengan benar.');
  const port = Number(process.env.PORT || 3000);
  if (!dryRun && !forced && (await isPortOpen(port))) {
    throw new Error(`Server dev berjalan di port ${port}; perubahan di aplikasi setelah migrasi akan tertinggal di store lokal. Hentikan dulu atau pakai --force.`);
  }

  const db = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf8'));
  console.log(`Sumber: store lokal ${LOCAL_DB_PATH}`);
  const leftovers = Object.keys(UNSUPPORTED).filter((k) => (db[k] || []).length);
  if (leftovers.length) throw new Error(`Koleksi lokal belum didukung script ini tapi berisi data: ${leftovers.join(', ')}`);
  const plan = TABLES.map(([table, source, serial, mapping]) => ({
    table, serial, mapping, rows: typeof source === 'function' ? source(db) : db[source] || [],
  }));

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  console.log(`Target: Postgres/Supabase (${new URL(process.env.DATABASE_URL).hostname})`);
  const client = await pool.connect();
  try {
    const targetTables = [...plan.map((p) => p.table), ...Object.values(UNSUPPORTED)];
    const filled = [];
    for (const t of targetTables) {
      const n = await countOf(client, t);
      if (n) filled.push(`${t} (${n})`);
    }
    if (filled.length) throw new Error(`Supabase tidak kosong, migrasi dibatalkan: ${filled.join(', ')}`);

    await client.query('BEGIN');
    for (const p of plan) {
      await insertRows(client, p.table, p.mapping, p.rows);
      if (p.serial && p.rows.length) {
        await client.query(`SELECT setval(pg_get_serial_sequence('public.${p.table}', 'id'), (SELECT MAX(id) FROM ${p.table}))`);
      }
    }
    const totals = Object.fromEntries(plan.map((p) => [p.table, p.rows.length]));
    await client.query(
      `INSERT INTO audit_log (staff_id, staff_nama, aksi, entitas, entitas_id, detail)
       VALUES (NULL, 'System (migrate-supabase)', $1, 'database', '', $2)`,
      [AUDIT_ACTION, JSON.stringify({ sumber: LOCAL_DB_PATH, totalBaris: totals })]
    );

    console.log('\n  tabel                    lokal  supabase');
    let mismatch = false;
    for (const p of plan) {
      const expected = p.rows.length + (p.table === 'audit_log' ? 1 : 0);
      const got = await countOf(client, p.table);
      if (got !== expected) mismatch = true;
      console.log(`  ${p.table.padEnd(24)} ${String(p.rows.length).padStart(5)}  ${String(got).padStart(8)}${got !== expected ? '  <- TIDAK COCOK' : ''}`);
    }
    console.log('  (audit_log +1 = catatan migrasi ini)');
    if (mismatch) throw new Error('Jumlah baris tidak cocok, semua perubahan dibatalkan.');

    await client.query(dryRun ? 'ROLLBACK' : 'COMMIT');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
  console.log(dryRun
    ? '\nSelesai (dry-run): semua data berhasil dimasukkan lalu di-rollback, Supabase tetap kosong.'
    : '\nSelesai: data lokal sudah dipindahkan ke Supabase. Restart server dev.');
}

main().catch((err) => {
  console.error(`\nmigrate:supabase gagal: ${err.message}`);
  process.exit(1);
});
