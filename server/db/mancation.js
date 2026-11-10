import mysql from 'mysql2/promise';
import {
  isDemoSeedEnabled,
  SEED_MANCATION_CLASSES,
  SEED_MANCATION_STUDENTS,
  SEED_MANCATION_OUTSIDE_CANDIDATES,
} from './seedData.js';

function snapshotClasses(snapshotFallback) {
  if (snapshotFallback?.classes?.length) return snapshotFallback.classes;
  return isDemoSeedEnabled() ? SEED_MANCATION_CLASSES : [];
}

function snapshotStudents(snapshotFallback) {
  if (snapshotFallback?.students?.length) return snapshotFallback.students;
  return isDemoSeedEnabled() ? SEED_MANCATION_STUDENTS : [];
}

let mysqlPool = null;
let lastSyncMeta = {
  source: 'snapshot',
  configured: false,
  syncedAt: new Date().toISOString(),
  errorMessage: null,
};

function isMysqlConfigured() {
  return Boolean(
    process.env.host_name &&
      process.env.db_name &&
      process.env.db_user &&
      process.env.db_password
  );
}

function getMysqlPool() {
  if (!isMysqlConfigured()) return null;
  if (!mysqlPool) {
    mysqlPool = mysql.createPool({
      host: process.env.host_name,
      database: process.env.db_name,
      user: process.env.db_user,
      password: process.env.db_password,
      waitForConnections: true,
      connectionLimit: 3,
      queueLimit: 0,
      connectTimeout: 4500,
    });
  }
  return mysqlPool;
}

function normalizeDate(val) {
  if (!val) return null;
  if (val instanceof Date) {
    if (Number.isNaN(val.getTime())) return null;
    const iso = val.toISOString().slice(0, 10);
    return iso.startsWith('0000') ? null : iso;
  }
  const str = String(val).trim().slice(0, 10);
  if (!str || str === '0000-00-00' || str.startsWith('0000')) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : null;
}

// t_datapeserta stores agama and region as IDs; the joins turn them into names (agama_nama, des_nama, ...).
const DATAPESERTA_SELECT = `
  SELECT dp.*, ag.nama_agama AS agama_nama,
         ds.nama AS des_nama, kc.nama AS kec_nama, kt.nama AS kota_nama, pv.nama AS prof_nama
  FROM t_datapeserta dp
  LEFT JOIN t_agama ag ON ag.id_agama = dp.data_agama
  LEFT JOIN desa ds ON ds.id = dp.data_des
  LEFT JOIN kecamatan kc ON kc.id = dp.data_kec
  LEFT JOIN kota kt ON kt.id = dp.data_kota
  LEFT JOIN provinsi pv ON pv.id = dp.data_prof`;

// t_datapeserta.data_kelamin follows t_jk: 1 = Laki-laki, 2 = Perempuan (Evaluasi Fisik needs it).
const JENIS_KELAMIN = { 1: 'L', 2: 'P' };

// status_pernikahan has no lookup table in mancation; the codes follow the KTP marital status order.
const STATUS_PERNIKAHAN = {
  0: 'Belum Menikah',
  1: 'Menikah',
  2: 'Cerai Hidup',
  3: 'Cerai Mati',
};

function buildDaerahAsal(dp) {
  if (!dp) return '';
  const parts = [dp.des_nama, dp.kec_nama, dp.kota_nama, dp.prof_nama]
    .map((x) => (x == null ? '' : String(x).trim()))
    .filter(Boolean);
  return parts.join(', ');
}

// Pas foto uploaded in Mancation: each upload adds a doclist row for the "foto" document (dokumen_sarat.nama_file)
// and is stored at resources/uploads/doc_{akun}/{akun}_foto.jpeg on the Mancation web app (t_profil.prof_url of cli 9).
// The newest doclist id is kept as the photo version, so a re-upload gets a new URL instead of a cached old photo.
const MANCATION_FOTO_BASE_URL = (process.env.MANCATION_FOTO_BASE_URL || 'https://app.mizunosb.com/resources/uploads').replace(/\/+$/, '');

export function mancationFotoUrl(akunId, fotoVersi) {
  const id = Number(akunId);
  if (!Number.isInteger(id) || id <= 0 || !fotoVersi) return null;
  return `${MANCATION_FOTO_BASE_URL}/doc_${id}/${id}_foto.jpeg?v=${Number(fotoVersi)}`;
}

// Map akun_id → photo version (accounts without a photo are left out), or null when Mancation could not be read.
async function fetchFotoVersiByAkun(pool, akunIds) {
  const map = new Map();
  if (akunIds.length === 0) return map;
  try {
    const [rows] = await pool.query(
      `SELECT dl.akun_id, MAX(dl.id) AS versi
       FROM doclist dl JOIN dokumen_sarat ds ON ds.id = dl.doc_id AND ds.nama_file = 'foto'
       WHERE dl.akun_id IN (?) GROUP BY dl.akun_id`,
      [akunIds]
    );
    for (const r of rows) map.set(Number(r.akun_id), Number(r.versi));
    return map;
  } catch {
    return null; // photos are optional: the roster still loads without them
  }
}

/** Photo versions of any accounts (also those outside the JOY classes); null when Mancation is unavailable. */
export async function fetchMancationFotoVersi(akunIds) {
  const pool = getMysqlPool();
  if (!pool) return null;
  const ids = [...new Set(akunIds.map(Number).filter((n) => Number.isInteger(n) && n > 0))];
  return fetchFotoVersiByAkun(pool, ids);
}

function mapMancationStudentRow(akun, dp, fotoVersi = null) {
  const akunId = Number(akun.akun_id ?? akun.id);
  const classId = Number(akun.id_kelas ?? 0);
  return {
    mancationAkunId: akunId,
    mancationClassId: classId,
    cliId: Number(akun.cli_id ?? 9),
    nama: String(akun.akun_nama ?? akun.nama ?? `Akun #${akunId}`).trim(),
    email: String(akun.akun_email ?? akun.email ?? '').trim(),
    whatsapp: String(dp?.data_hp ?? dp?.no_hp ?? akun.akun_hp ?? '').trim(),
    tanggalLahir: normalizeDate(dp?.data_tl),
    statusPernikahan: STATUS_PERNIKAHAN[dp?.status_pernikahan] ?? '',
    jumlahAnak: dp?.anak != null && dp?.anak !== '' ? Number(dp.anak) : null,
    agama: String(dp?.agama_nama ?? '').trim(),
    daerahAsal: buildDaerahAsal(dp),
    jenisKelamin: JENIS_KELAMIN[Number(dp?.data_kelamin)] || '',
    fotoVersi: fotoVersi || null,
    hasDatapeserta: Boolean(dp),
  };
}

/**
 * Fetches live classes and student roster for JOY (cli_id = 9, classIds e.g. [139, 142, 144]).
 * Strictly READ-ONLY against MySQL mancation; falls back cleanly to snapshot cache on timeout/unconfigured.
 */
export async function fetchMancationRoster(classIds = [139, 142, 144], snapshotFallback = null) {
  const cleanClassIds = [...new Set(classIds.map(Number).filter((n) => Number.isInteger(n) && n > 0))];
  const pool = getMysqlPool();

  if (!pool) {
    lastSyncMeta = {
      source: 'snapshot',
      configured: false,
      syncedAt: snapshotFallback?.syncedAt || new Date().toISOString(),
      errorMessage: null,
    };
    return {
      ...lastSyncMeta,
      classes: snapshotClasses(snapshotFallback),
      students: snapshotStudents(snapshotFallback).filter(
        (s) => cleanClassIds.length === 0 || cleanClassIds.includes(Number(s.mancationClassId))
      ),
    };
  }

  try {
    const [kelasRows] = await pool.query(
      'SELECT * FROM t_kelas WHERE cli_id = 9 ORDER BY id ASC'
    );
    const classes = kelasRows.map((row) => ({
      mancationClassId: Number(row.id ?? row.kel_id),
      namaKelas: String(row.kel_nama ?? row.nama_kelas ?? `Kelas #${row.id}`).trim(),
      programStudi: String(row.kel_ket ?? '').trim(),
      classStat: Number(row.kel_stat ?? 1),
    }));

    let students = [];
    if (cleanClassIds.length > 0) {
      const placeholders = cleanClassIds.map(() => '?').join(',');
      const [akunRows] = await pool.query(
        `SELECT * FROM t_akun WHERE cli_id = 9 AND id_kelas IN (${placeholders}) ORDER BY akun_nama ASC`,
        cleanClassIds
      );

      const akunIds = akunRows.map((r) => Number(r.akun_id)).filter(Boolean);
      const dpByAkun = new Map();

      if (akunIds.length > 0) {
        try {
          const dpPlaceholders = akunIds.map(() => '?').join(',');
          const [dpRows] = await pool.query(
            `${DATAPESERTA_SELECT} WHERE dp.akun_id IN (${dpPlaceholders})`,
            akunIds
          );
          for (const dp of dpRows) {
            dpByAkun.set(Number(dp.akun_id), dp);
          }
        } catch {
          // t_datapeserta optional enrichment if column layout varies
        }
      }

      const fotoByAkun = await fetchFotoVersiByAkun(pool, akunIds);
      students = akunRows.map((akun) =>
        mapMancationStudentRow(akun, dpByAkun.get(Number(akun.akun_id)), fotoByAkun?.get(Number(akun.akun_id)))
      );
    }

    const nowIso = new Date().toISOString();
    lastSyncMeta = {
      source: 'live',
      configured: true,
      syncedAt: nowIso,
      errorMessage: null,
    };

    return {
      ...lastSyncMeta,
      classes,
      students,
    };
  } catch (err) {
    const safeMsg = err?.code || 'MYSQL_UNREACHABLE';
    lastSyncMeta = {
      source: 'snapshot',
      configured: true,
      syncedAt: snapshotFallback?.syncedAt || new Date().toISOString(),
      errorMessage: safeMsg,
    };
    return {
      ...lastSyncMeta,
      classes: snapshotClasses(snapshotFallback),
      students: snapshotStudents(snapshotFallback).filter(
        (s) => cleanClassIds.length === 0 || cleanClassIds.includes(Number(s.mancationClassId))
      ),
    };
  }
}

/**
 * Looks up a single t_akun account by akun_id for Peserta Luar Kelas manual entry (§14.1 mainIdea.md).
 */
export async function lookupMancationAccountById(akunId, snapshotFallback = null) {
  const numericId = Number(akunId);
  if (!Number.isInteger(numericId) || numericId <= 0) return null;

  const pool = getMysqlPool();
  if (pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM t_akun WHERE akun_id = ? LIMIT 1', [numericId]);
      if (!rows || rows.length === 0) return null;
      const akun = rows[0];
      let dp = null;
      try {
        const [dpRows] = await pool.query(`${DATAPESERTA_SELECT} WHERE dp.akun_id = ? LIMIT 1`, [numericId]);
        dp = dpRows?.[0] || null;
      } catch {
        dp = null;
      }
      const fotoByAkun = await fetchFotoVersiByAkun(pool, [numericId]);
      return mapMancationStudentRow(akun, dp, fotoByAkun?.get(numericId));
    } catch {
      // Fallback to snapshot pool below if MySQL query times out
    }
  }

  const allFallback = [
    ...(snapshotFallback?.students || (isDemoSeedEnabled() ? SEED_MANCATION_STUDENTS : [])),
    ...(isDemoSeedEnabled() ? SEED_MANCATION_OUTSIDE_CANDIDATES : []),
  ];
  return allFallback.find((s) => Number(s.mancationAkunId) === numericId) || null;
}

/**
 * Finds JOY accounts (cli_id = 9) by name or akun_id for the class formation page, with their current Mancation class.
 */
export async function searchMancationAccounts(query, limit = 30) {
  const pool = getMysqlPool();
  if (!pool) throw new Error('MANCATION_UNAVAILABLE');
  const q = String(query || '').trim();
  const escaped = q.replace(/[\\%_]/g, (c) => `\\${c}`);
  const akunId = /^\d+$/.test(q) ? Number(q) : 0;
  let rows;
  try {
    // Names starting with the query first, then a word starting with it, then any other match.
    [rows] = await pool.query(
      `SELECT a.akun_id, a.akun_nama, a.akun_email, a.id_kelas, a.time_add, k.kel_nama
       FROM t_akun a LEFT JOIN t_kelas k ON k.id = a.id_kelas
       WHERE a.cli_id = 9 AND (a.akun_nama LIKE ? OR a.akun_id = ?)
       ORDER BY a.akun_id = ? DESC,
                CASE WHEN TRIM(a.akun_nama) LIKE ? THEN 0 WHEN a.akun_nama LIKE ? THEN 1 ELSE 2 END,
                TRIM(a.akun_nama) ASC
       LIMIT ?`,
      [`%${escaped}%`, akunId, akunId, `${escaped}%`, `% ${escaped}%`, limit]
    );
  } catch {
    throw new Error('MANCATION_UNAVAILABLE');
  }
  return rows.map((r) => ({
    mancationAkunId: Number(r.akun_id),
    nama: String(r.akun_nama ?? '').trim(),
    email: String(r.akun_email ?? '').trim(),
    mancationClassId: Number(r.id_kelas) || 0,
    namaKelasMancation: String(r.kel_nama ?? '').trim(),
    terdaftar: normalizeDate(r.time_add),
  }));
}

/**
 * The one write JOYdata makes to Mancation, from the class formation page: sets t_akun.id_kelas of JOY accounts
 * (cli_id = 9; 0 = no class) in one transaction. Every account must still be in the class JOYdata expects
 * (dariMancationClassId), so a roster changed in Mancation meanwhile is refused instead of overwritten.
 */
export async function moveMancationAccounts(moves) {
  const pool = getMysqlPool();
  if (!pool) throw new Error('MANCATION_UNAVAILABLE');
  let conn;
  try {
    conn = await pool.getConnection();
  } catch {
    throw new Error('MANCATION_UNAVAILABLE');
  }
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT akun_id, id_kelas FROM t_akun WHERE cli_id = 9 AND akun_id IN (?) FOR UPDATE', [
      moves.map((m) => m.mancationAkunId),
    ]);
    const currentByAkun = new Map(rows.map((r) => [Number(r.akun_id), Number(r.id_kelas) || 0]));
    for (const m of moves) {
      if (!currentByAkun.has(m.mancationAkunId)) throw new Error('MANCATION_ACCOUNT_NOT_FOUND');
      if (currentByAkun.get(m.mancationAkunId) !== m.dariMancationClassId) throw new Error('FORMASI_KELAS_BERUBAH');
    }
    const byTarget = new Map();
    for (const m of moves) byTarget.set(m.keMancationClassId, [...(byTarget.get(m.keMancationClassId) || []), m.mancationAkunId]);
    for (const [classId, akunIds] of byTarget) {
      await conn.query('UPDATE t_akun SET id_kelas = ? WHERE cli_id = 9 AND akun_id IN (?)', [classId, akunIds]);
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback().catch(() => {});
    if (err?.message === 'MANCATION_ACCOUNT_NOT_FOUND' || err?.message === 'FORMASI_KELAS_BERUBAH') throw err;
    throw new Error('MANCATION_UNAVAILABLE');
  } finally {
    conn.release();
  }
}

export function getMancationStatusMeta() {
  return {
    ...lastSyncMeta,
    configured: isMysqlConfigured(),
  };
}
