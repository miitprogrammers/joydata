import bcrypt from 'bcryptjs';
import { ensureInitialized, getMode, getPool, readLocalState, saveLocalState, appendAudit } from './engine.js';
import { formatPersonName } from '../domain/nameFormat.js';

// Peserta portal accounts: login with the Mancation email. Until a peserta sets a password, the password is the
// birth date as ddmmyy and must be changed on the first login. Postgres table peserta_akun, local state.pesertaAkun.
const MAX_GAGAL_LOGIN = 5;
const KUNCI_MENIT = 15;
const MIN_PANJANG_SANDI = 8;
// Compared against when the email is unknown, so a wrong email costs the same time as a wrong password.
const DUMMY_HASH = bcrypt.hashSync('joydata-portal-dummy-password', 10);

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

/** Default password from a YYYY-MM-DD birth date: ddmmyy, or null when the birth date is unknown. */
export function defaultPortalPassword(tanggalLahir) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(tanggalLahir || ''));
  return m ? `${m[3]}${m[2]}${m[1].slice(2)}` : null;
}

function toAccountView(row) {
  return {
    pesertaId: Number(row.pesertaId),
    nama: formatPersonName(row.nama) || `Peserta #${row.pesertaId}`,
    email: row.email || '',
    namaKelas: row.namaKelas || '',
    tanggalLahir: row.tanggalLahir || null,
    passwordHash: row.passwordHash || null,
    wajibGantiSandi: row.wajibGantiSandi ?? true,
    aktif: row.aktif ?? true,
    terkunciSampai: row.terkunciSampai ? new Date(row.terkunciSampai).toISOString() : null,
    versiToken: Number(row.versiToken || 0),
    loginTerakhir: row.loginTerakhir ? new Date(row.loginTerakhir).toISOString() : null,
  };
}

const PG_ACCOUNT_SELECT = `
  SELECT p.id AS "pesertaId", c.nama, lower(trim(c.email)) AS email, k.nama_kelas AS "namaKelas",
         COALESCE(c.tanggal_lahir, p.tanggal_lahir_lokal)::text AS "tanggalLahir",
         a.password_hash AS "passwordHash", a.wajib_ganti_sandi AS "wajibGantiSandi", a.aktif,
         a.terkunci_sampai AS "terkunciSampai", a.versi_token AS "versiToken", a.login_terakhir AS "loginTerakhir"
  FROM peserta p
  LEFT JOIN mancation_peserta_cache c ON c.mancation_akun_id = p.mancation_akun_id
  LEFT JOIN kelas k ON k.id = p.kelas_id AND k.deleted_at IS NULL
  LEFT JOIN peserta_akun a ON a.peserta_id = p.id`;

function localAccounts(db) {
  db.pesertaAkun ||= [];
  const cacheByAkun = new Map((db.mancationPesertaCache || []).map((c) => [Number(c.mancationAkunId), c]));
  return (db.peserta || []).map((p) => {
    const c = cacheByAkun.get(Number(p.mancationAkunId));
    const a = db.pesertaAkun.find((x) => x.pesertaId === p.id);
    const kelas = (db.kelas || []).find((k) => k.id === p.kelasId && !k.deletedAt);
    return {
      pesertaId: p.id,
      nama: c?.nama,
      email: normalizeEmail(c?.email),
      namaKelas: kelas?.namaKelas,
      tanggalLahir: c?.tanggalLahir || p.tanggalLahirLokal || null,
      ...(a || {}),
    };
  });
}

async function findAccountByEmail(email) {
  if (getMode() === 'postgres') {
    const res = await getPool().query(`${PG_ACCOUNT_SELECT} WHERE lower(trim(c.email)) = $1 LIMIT 2`, [email]);
    return res.rows.length === 1 ? toAccountView(res.rows[0]) : null;
  }
  const rows = localAccounts(readLocalState()).filter((r) => r.email && r.email === email);
  return rows.length === 1 ? toAccountView(rows[0]) : null;
}

async function findAccountById(pesertaId) {
  const id = Number(pesertaId);
  if (!Number.isInteger(id) || id <= 0) return null;
  if (getMode() === 'postgres') {
    const res = await getPool().query(`${PG_ACCOUNT_SELECT} WHERE p.id = $1`, [id]);
    return res.rows[0] ? toAccountView(res.rows[0]) : null;
  }
  const row = localAccounts(readLocalState()).find((r) => r.pesertaId === id);
  return row ? toAccountView(row) : null;
}

/** Applies a change to the peserta's account row, creating it on first use. Returns the updated account. */
async function saveAccount(pesertaId, changes) {
  if (getMode() === 'postgres') {
    const cols = Object.keys(changes);
    const params = cols.map((c) => changes[c]);
    const setSql = cols.map((c, i) => `${c} = $${i + 2}`).join(', ');
    await getPool().query(
      `INSERT INTO peserta_akun (peserta_id, ${cols.join(', ')}) VALUES ($1, ${cols.map((_, i) => `$${i + 2}`).join(', ')})
       ON CONFLICT (peserta_id) DO UPDATE SET ${setSql}, updated_at = NOW()`,
      [pesertaId, ...params]
    );
    return findAccountById(pesertaId);
  }
  const db = readLocalState();
  db.pesertaAkun ||= [];
  let row = db.pesertaAkun.find((a) => a.pesertaId === pesertaId);
  if (!row) {
    row = { pesertaId, passwordHash: null, wajibGantiSandi: true, aktif: true, gagalLogin: 0, terkunciSampai: null, versiToken: 0 };
    db.pesertaAkun.push(row);
  }
  const camel = {
    password_hash: 'passwordHash', wajib_ganti_sandi: 'wajibGantiSandi', aktif: 'aktif', gagal_login: 'gagalLogin',
    terkunci_sampai: 'terkunciSampai', versi_token: 'versiToken', login_terakhir: 'loginTerakhir', sandi_diubah_at: 'sandiDiubahAt',
  };
  for (const [col, value] of Object.entries(changes)) row[camel[col]] = value;
  saveLocalState();
  return findAccountById(pesertaId);
}

async function passwordMatches(account, password) {
  if (account.passwordHash) return bcrypt.compare(String(password), account.passwordHash);
  const awal = defaultPortalPassword(account.tanggalLahir);
  return awal !== null && String(password).trim() === awal;
}

async function recordFailedLogin(account) {
  const id = account.pesertaId;
  if (getMode() === 'postgres') {
    await getPool().query(
      `INSERT INTO peserta_akun (peserta_id, gagal_login) VALUES ($1, 1)
       ON CONFLICT (peserta_id) DO UPDATE SET
         gagal_login = CASE WHEN peserta_akun.gagal_login + 1 >= $2 THEN 0 ELSE peserta_akun.gagal_login + 1 END,
         terkunci_sampai = CASE WHEN peserta_akun.gagal_login + 1 >= $2 THEN NOW() + make_interval(mins => $3) ELSE NULL END,
         updated_at = NOW()`,
      [id, MAX_GAGAL_LOGIN, KUNCI_MENIT]
    );
    return;
  }
  const db = readLocalState();
  db.pesertaAkun ||= [];
  const row = db.pesertaAkun.find((a) => a.pesertaId === id);
  const gagal = (row?.gagalLogin || 0) + 1;
  const locked = gagal >= MAX_GAGAL_LOGIN;
  await saveAccount(id, {
    gagal_login: locked ? 0 : gagal,
    terkunci_sampai: locked ? new Date(Date.now() + KUNCI_MENIT * 60000).toISOString() : null,
  });
}

/** Session data the portal needs about the logged-in peserta (no password hash). */
function toSession(account) {
  return {
    id: account.pesertaId,
    nama: account.nama,
    email: account.email,
    namaKelas: account.namaKelas,
    wajibGantiSandi: account.wajibGantiSandi,
    aktif: account.aktif,
    versiToken: account.versiToken,
  };
}

export async function authenticatePeserta(email, password) {
  await ensureInitialized();
  const account = await findAccountByEmail(normalizeEmail(email));
  if (!account) {
    await bcrypt.compare(String(password || ''), DUMMY_HASH);
    throw new Error('INVALID_CREDENTIALS');
  }
  if (account.terkunciSampai && new Date(account.terkunciSampai) > new Date()) throw new Error('PORTAL_ACCOUNT_LOCKED');
  if (!account.aktif) throw new Error('PORTAL_DISABLED');

  if (!(await passwordMatches(account, password || ''))) {
    await recordFailedLogin(account);
    throw new Error('INVALID_CREDENTIALS');
  }
  const now = getMode() === 'postgres' ? new Date() : new Date().toISOString();
  const updated = await saveAccount(account.pesertaId, { gagal_login: 0, terkunci_sampai: null, login_terakhir: now });
  return toSession(updated);
}

export async function getPesertaPortalSession(pesertaId) {
  await ensureInitialized();
  const account = await findAccountById(pesertaId);
  return account ? toSession(account) : null;
}

export async function changePesertaPassword(pesertaId, oldPassword, newPassword) {
  await ensureInitialized();
  const account = await findAccountById(pesertaId);
  if (!account) throw new Error('NOT_FOUND');
  if (!(await passwordMatches(account, oldPassword || ''))) throw new Error('INVALID_OLD_PASSWORD');

  const baru = String(newPassword || '');
  if (baru.length < MIN_PANJANG_SANDI) throw new Error('PORTAL_PASSWORD_TOO_SHORT');
  if (baru === String(oldPassword) || baru === defaultPortalPassword(account.tanggalLahir)) {
    throw new Error('PORTAL_PASSWORD_SAME');
  }
  const now = getMode() === 'postgres' ? new Date() : new Date().toISOString();
  const updated = await saveAccount(account.pesertaId, {
    password_hash: await bcrypt.hash(baru, 10),
    wajib_ganti_sandi: false,
    sandi_diubah_at: now,
    versi_token: account.versiToken + 1,
  });
  return toSession(updated);
}

/** Staff view of a peserta's portal account (Data Peserta detail). */
export async function getPortalAccountStatus(pesertaId) {
  await ensureInitialized();
  const account = await findAccountById(pesertaId);
  if (!account) throw new Error('NOT_FOUND');
  return {
    email: account.email,
    punyaTanggalLahir: defaultPortalPassword(account.tanggalLahir) !== null,
    pakaiSandiAwal: !account.passwordHash,
    wajibGantiSandi: account.wajibGantiSandi,
    aktif: account.aktif,
    terkunciSampai: account.terkunciSampai && new Date(account.terkunciSampai) > new Date() ? account.terkunciSampai : null,
    loginTerakhir: account.loginTerakhir,
  };
}

/** Back to the birth-date password (forgotten password); also lifts a lock and signs out every device. */
export async function resetPesertaPortalPassword(pesertaId, actor) {
  await ensureInitialized();
  const account = await findAccountById(pesertaId);
  if (!account) throw new Error('NOT_FOUND');
  if (defaultPortalPassword(account.tanggalLahir) === null) throw new Error('PORTAL_NO_BIRTH_DATE');
  await saveAccount(account.pesertaId, {
    password_hash: null,
    wajib_ganti_sandi: true,
    gagal_login: 0,
    terkunci_sampai: null,
    versi_token: account.versiToken + 1,
  });
  await appendAudit(actor, 'RESET_SANDI_PORTAL', 'peserta', account.pesertaId, { email: account.email });
  return getPortalAccountStatus(account.pesertaId);
}

export async function setPesertaPortalAktif(pesertaId, aktif, actor) {
  await ensureInitialized();
  const account = await findAccountById(pesertaId);
  if (!account) throw new Error('NOT_FOUND');
  const next = Boolean(aktif);
  await saveAccount(account.pesertaId, { aktif: next, versi_token: account.versiToken + (next ? 0 : 1) });
  await appendAudit(actor, next ? 'AKTIFKAN_PORTAL' : 'NONAKTIFKAN_PORTAL', 'peserta', account.pesertaId, { email: account.email });
  return getPortalAccountStatus(account.pesertaId);
}
