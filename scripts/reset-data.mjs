/**
 * JOYdata data reset — wipes demo/transactional data and leaves a clean baseline.
 *
 * Keeps (master): role, page, access, settings, program, sikap_kategori, and the admin account.
 * Clears: staff (non-admin), kelas, peserta, nilai_ujian, nilai_kaiwa, nilai_sikap,
 *         absensi, peserta_penempatan, peserta_status_log, audit_log, mancation caches, push logs.
 *
 * Safety guards (override with --force only when you are sure):
 *   - Requires JOY_SEED_DEMO="false", otherwise the store is partly re-seeded with demo data.
 *   - Refuses a non-local DATABASE_URL unless RESET_ALLOW="true".
 *   - Refuses to run while the dev server is listening, since it re-persists its in-memory state.
 *
 * Usage: npm run reset:data [-- --dry-run] [-- --force]   (restart the dev server afterwards)
 */
import 'dotenv/config';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (path.resolve(process.cwd()) !== projectRoot) process.chdir(projectRoot);

const { createInitialLocalState, LOCAL_DB_PATH, writeLocalStateFile } = await import(
  '../server/db/engine.js'
);
const { isDemoSeedEnabled } = await import('../server/db/seedData.js');

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const forced = args.has('--force') || process.env.RESET_FORCE === 'true';

const CLEAR_TABLES = [
  'nilai_ujian',
  'nilai_kaiwa',
  'nilai_sikap',
  'absensi',
  'peserta_penempatan',
  'peserta_status_log',
  'peserta',
  'kelas',
  'mancation_kelas_cache',
  'mancation_peserta_cache',
  'push_subscription',
  'push_log',
  'audit_log',
];

const MASTER_COLLECTIONS = ['roles', 'pages', 'access', 'settings', 'programs', 'sikapKategori'];

function summarize(state) {
  const n = (arr) => (Array.isArray(arr) ? arr.length : 0);
  return {
    staff: n(state.staff),
    kelas: n(state.kelas),
    peserta: n(state.peserta),
    nilaiUjian: n(state.nilaiUjian),
    nilaiKaiwa: n(state.nilaiKaiwa),
    nilaiSikap: n(state.nilaiSikap),
    absensi: n(state.absensi),
    penempatan: n(state.pesertaPenempatan),
    statusLog: n(state.pesertaStatusLog),
  };
}

function printSummary(label, summary) {
  console.log(`  ${label}:`);
  for (const [key, value] of Object.entries(summary)) {
    console.log(`    ${key.padEnd(12)} ${value}`);
  }
}

function nextId(rows, fallback) {
  const max = (rows || []).reduce((acc, row) => Math.max(acc, Number(row?.id) || 0), 0);
  return Math.max(max + 1, fallback);
}

function hasValidPostgresUrl() {
  const url = process.env.DATABASE_URL || '';
  if (!url.startsWith('postgres')) return false;
  if (url.includes('YOUR_DB_PASSWORD') || url.includes('your-project-ref')) return false;
  return true;
}

function postgresHost() {
  try {
    return new URL(process.env.DATABASE_URL).hostname;
  } catch {
    return '';
  }
}

function isPortOpen(port, host = '127.0.0.1', timeout = 700) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;
    const finish = (open) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(open);
    };
    socket.setTimeout(timeout);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect(port, host);
  });
}

function readExistingLocal() {
  if (!fs.existsSync(LOCAL_DB_PATH)) return { raw: null, state: null };
  const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
  try {
    return { raw, state: JSON.parse(raw) };
  } catch {
    return { raw, state: null };
  }
}

/**
 * Rebuilds the local store while preserving user-edited master data, so a reset does not
 * silently discard settings/programs/kategori/roles/pages/access edits.
 */
function buildCleanLocalState(existing) {
  const clean = createInitialLocalState({ demo: false });
  if (!existing) return clean;

  for (const key of MASTER_COLLECTIONS) {
    if (existing[key] !== undefined && existing[key] !== null) clean[key] = existing[key];
  }

  if (Array.isArray(existing.staff)) {
    const adminRoleId = (existing.roles || []).find((r) => r.kode === 'admin')?.id;
    const admins = existing.staff.filter(
      (s) => s.username === 'admin' || (adminRoleId != null && s.roleId === adminRoleId)
    );
    if (admins.length > 0) clean.staff = admins;
  }

  clean.seq.role = nextId(clean.roles, clean.seq.role);
  clean.seq.staff = nextId(clean.staff, clean.seq.staff);
  clean.seq.program = nextId(clean.programs, clean.seq.program);
  clean.seq.sikapKategori = nextId(clean.sikapKategori, clean.seq.sikapKategori);

  return clean;
}

async function resetLocal() {
  const { raw: beforeRaw, state: before } = readExistingLocal();
  const clean = buildCleanLocalState(before);
  const summary = summarize(clean);

  console.log(`Local store: ${LOCAL_DB_PATH}`);
  if (before) printSummary('Sebelum', summarize(before));
  else console.log('  Sebelum: (file tidak ada / tidak valid)');
  printSummary(dryRun ? 'Rencana (dry-run)' : 'Sesudah', summary);

  if (dryRun) {
    console.log('  dry-run: tidak ada perubahan yang ditulis.');
    return;
  }

  const nowRaw = readExistingLocal().raw;
  if (nowRaw !== beforeRaw) {
    throw new Error('Store berubah saat reset berjalan; proses lain menulis file. Ulangi setelah server dihentikan.');
  }

  writeLocalStateFile(clean);
}

async function resetPostgres(pool) {
  const counts = async () => {
    const [staff, kelas, peserta] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS c FROM staff'),
      pool.query('SELECT COUNT(*)::int AS c FROM kelas'),
      pool.query('SELECT COUNT(*)::int AS c FROM peserta'),
    ]);
    return { staff: staff.rows[0].c, kelas: kelas.rows[0].c, peserta: peserta.rows[0].c };
  };

  const before = await counts();
  console.log(`Postgres/Supabase store: ${postgresHost()}`);
  console.log(`  staff ${before.staff}, kelas ${before.kelas}, peserta ${before.peserta}`);
  console.log(`  ${dryRun ? 'akan menghapus' : 'menghapus'}: ${CLEAR_TABLES.join(', ')} + staf non-admin`);

  if (dryRun) {
    console.log('  dry-run: tidak ada perubahan yang dihapus.');
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const table of CLEAR_TABLES) {
      await client.query(`DELETE FROM ${table}`);
    }
    await client.query(`DELETE FROM staff WHERE role_id <> (SELECT id FROM role WHERE kode = 'admin')`);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  const after = await counts();
  console.log('  Sesudah:');
  console.log(`    staff    ${before.staff} -> ${after.staff}`);
  console.log(`    kelas    ${before.kelas} -> ${after.kelas}`);
  console.log(`    peserta  ${before.peserta} -> ${after.peserta}`);
}

function assertDemoSeedDisabled() {
  if (isDemoSeedEnabled() && !forced) {
    throw new Error(
      'JOY_SEED_DEMO belum "false": store akan diisi ulang dengan data contoh. ' +
        'Set JOY_SEED_DEMO=false di .env, atau jalankan dengan --force.'
    );
  }
}

async function assertServerStopped() {
  if (dryRun) return;
  const port = Number(process.env.PORT || 3000);
  if (await isPortOpen(port)) {
    if (forced) {
      console.warn(`! Server terdeteksi di port ${port}; dilanjutkan karena --force.`);
      console.warn('  State di memori server dapat menimpa hasil reset — hentikan lalu restart.');
      return;
    }
    throw new Error(
      `Server dev masih berjalan di port ${port}. Hentikan dulu, karena state di memori akan menimpa hasil reset. ` +
        'Jalankan ulang setelah server mati, atau paksa dengan --force.'
    );
  }
}

function assertPostgresAllowed() {
  const host = postgresHost();
  const isLocalHost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  if (isLocalHost || dryRun || forced) return;
  if (process.env.RESET_ALLOW !== 'true') {
    throw new Error(
      `DATABASE_URL menunjuk host non-lokal (${host}). Reset akan menghapus data di sana secara permanen. ` +
        'Set RESET_ALLOW=true untuk konfirmasi, atau pakai --dry-run untuk melihat dampaknya.'
    );
  }
}

async function main() {
  console.log(`JOYdata reset:data${dryRun ? ' (dry-run)' : ''}${forced ? ' (force)' : ''}`);

  assertDemoSeedDisabled();

  let mode = 'local';
  let pool = null;
  if (hasValidPostgresUrl()) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    });
    try {
      await pool.query('SELECT 1');
      mode = 'postgres';
    } catch (err) {
      console.warn(`! Postgres tidak dapat dihubungi (${err.message}); memakai store lokal.`);
      await pool.end();
      pool = null;
    }
  } else {
    console.log('  DATABASE_URL tidak valid/placeholder; memakai store lokal.');
  }

  try {
    if (mode === 'postgres') {
      assertPostgresAllowed();
      await resetPostgres(pool);
    } else {
      await assertServerStopped();
      await resetLocal();
    }
  } finally {
    if (pool) await pool.end();
  }

  console.log(`\nSelesai${dryRun ? ' (dry-run, tanpa perubahan)' : ''}. Restart server development agar state di memori ikut ter-refresh.`);
}

main().catch((err) => {
  console.error(`\nreset:data dibatalkan: ${err.message}`);
  process.exit(1);
});
