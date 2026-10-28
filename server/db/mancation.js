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

function mapMancationStudentRow(akun, dp) {
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

      students = akunRows.map((akun) =>
        mapMancationStudentRow(akun, dpByAkun.get(Number(akun.akun_id)))
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
      return mapMancationStudentRow(akun, dp);
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

export function getMancationStatusMeta() {
  return {
    ...lastSyncMeta,
    configured: isMysqlConfigured(),
  };
}
