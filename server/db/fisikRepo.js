// Evaluasi Fisik: one test per peserta per date, typed in one peserta at a time by a sensei (like Mensetsu
// Renshuu). Only the raw results are stored; scores come from domain/evaluasiFisik.js with the current settings.
import { ensureInitialized, getMode, getPool, readLocalState, saveLocalState, appendAudit, appendLocalAudit } from './engine.js';
import { loadAcademicLookups } from './akademikRepo.js';
import { getSystemSettings } from './fase3Repo.js';
import { aturanFisik, hitungNilaiFisik, validateNilaiFisikInput, JENIS_KELAMIN } from '../domain/evaluasiFisik.js';

const KOLOM = `id, peserta_id AS "pesertaId", kelas_id AS "kelasId", tanggal::text AS tanggal, jenis_kelamin AS "jenisKelamin",
  push_up AS "pushUp", plank_detik AS "plankDetik", sit_up AS "sitUp", karung_bolak_balik::float AS "karungBolakBalik",
  lintasan_m::float AS "lintasanM", catatan, diinput_oleh_staff_id AS "penilaiId", created_at AS "createdAt",
  updated_at AS "updatedAt"`;

const bulanIni = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date()).slice(0, 7);

async function bacaBaris({ ym = null, kelasId = null, id = null } = {}) {
  if (getMode() === 'postgres') {
    const where = [];
    const params = [];
    if (ym) where.push(`TO_CHAR(tanggal, 'YYYY-MM') = $${params.push(ym)}`);
    if (kelasId) where.push(`kelas_id = $${params.push(kelasId)}`);
    if (id) where.push(`id = $${params.push(id)}`);
    const res = await getPool().query(
      `SELECT ${KOLOM} FROM nilai_fisik ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY tanggal DESC, id DESC`,
      params
    );
    return res.rows;
  }
  return (readLocalState().nilaiFisik || [])
    .filter((r) => (!ym || String(r.tanggal).startsWith(ym)) && (!kelasId || Number(r.kelasId) === kelasId) && (!id || r.id === id))
    .sort((a, b) => String(b.tanggal).localeCompare(String(a.tanggal)) || b.id - a.id);
}

/** A stored test with the peserta, class and staff names and its scores. */
function tampilan(row, lookups, settings) {
  const p = lookups.pesertaById.get(Number(row.pesertaId));
  return {
    ...row,
    pesertaNama: p?.nama || `Peserta #${row.pesertaId}`,
    mancationAkunId: p?.mancationAkunId || null,
    fotoUrl: p?.fotoUrl || null,
    kelasNama: lookups.kelasById.get(Number(row.kelasId))?.namaKelas || '-',
    penilaiNama: lookups.staffById.get(Number(row.penilaiId))?.nama || '-',
    skor: hitungNilaiFisik(row, settings),
  };
}

/** Tests of one month (optionally one class), each roster peserta's latest test of that month, and the summary. */
export async function listNilaiFisik({ periode, kelasId, search } = {}) {
  await ensureInitialized();
  const ym = /^\d{4}-\d{2}$/.test(String(periode || '')) ? String(periode) : bulanIni();
  const kId = kelasId && kelasId !== 'all' ? Number(kelasId) : null;
  const q = String(search || '').trim().toLowerCase();
  const [lookups, settings, rows] = await Promise.all([loadAcademicLookups(), getSystemSettings(), bacaBaris({ ym, kelasId: kId })]);

  const cocok = (nama, akunId) => !q || String(nama || '').toLowerCase().includes(q) || String(akunId || '').includes(q);
  const items = rows.map((r) => tampilan(r, lookups, settings)).filter((r) => cocok(r.pesertaNama, r.mancationAkunId));

  const roster = kId ? lookups.rosterItems.filter((p) => Number(p.kelasId) === kId) : lookups.rosterItems;
  const terakhir = new Map();
  for (const r of items) if (!terakhir.has(Number(r.pesertaId))) terakhir.set(Number(r.pesertaId), r); // rows are newest first
  const studentSummary = roster
    .filter((p) => cocok(p.nama, p.mancationAkunId))
    .map((p) => ({
      pesertaId: p.id,
      pesertaNama: p.nama,
      mancationAkunId: p.mancationAkunId,
      fotoUrl: p.fotoUrl || null,
      kelasId: p.kelasId,
      kelasNama: p.namaKelas || '-',
      jenisKelamin: p.jenisKelamin || '',
      terakhir: terakhir.get(Number(p.id)) || null,
    }));

  const lengkap = [...terakhir.values()].filter((r) => r.skor.nilaiFisik !== null);
  const rata = lengkap.length ? Math.round((lengkap.reduce((n, r) => n + r.skor.nilaiFisik, 0) / lengkap.length) * 10) / 10 : null;
  return {
    periode: ym,
    syncMeta: lookups.syncMeta,
    aturan: aturanFisik(settings),
    // With aturan, the form scores its preview with the same formula (domain/evaluasiFisik.js) as the server.
    batasGrade: settings.batas_grade,
    metrics: {
      totalPeserta: roster.length,
      jumlahDites: roster.filter((p) => terakhir.has(Number(p.id))).length,
      jumlahTes: rows.length,
      rataNilaiFisik: rata,
      jumlahLengkap: lengkap.length,
      jumlahLulus: lengkap.filter((r) => r.skor.lulusKkm).length,
    },
    studentSummary,
    items,
    kelasOptions: lookups.kelasOptions,
    rosterOptions: lookups.rosterItems.map((p) => ({
      id: p.id,
      nama: p.nama,
      kelasId: p.kelasId,
      namaKelas: p.namaKelas,
      jenisKelamin: JENIS_KELAMIN.includes(p.jenisKelamin) ? p.jenisKelamin : '',
    })),
  };
}

/**
 * Validates a test from the form. The gender comes from Mancation whenever it knows it (the form only asks when
 * it does not), and the class defaults to the peserta's current class.
 */
async function siapkan(payload) {
  const lookups = await loadAcademicLookups();
  const peserta = lookups.pesertaById.get(Number(payload?.pesertaId));
  if (!peserta) throw new Error('NOT_FOUND');
  const dariMancation = JENIS_KELAMIN.includes(peserta.jenisKelamin) ? peserta.jenisKelamin : null;
  const check = validateNilaiFisikInput({
    ...payload,
    jenisKelamin: dariMancation || payload?.jenisKelamin,
    kelasId: payload?.kelasId ?? peserta.kelasId ?? null,
  });
  if (!check.ok) throw new Error(check.code);
  return check.normalized;
}

const SUDAH_ADA = (err) => err?.code === '23505';

export async function createNilaiFisik(payload, actor) {
  await ensureInitialized();
  const d = await siapkan(payload);
  // The track length of the test is the one set in Pengaturan when it is typed in.
  const lintasanM = aturanFisik(await getSystemSettings()).lintasanM;
  if (getMode() === 'postgres') {
    let res;
    try {
      res = await getPool().query(
        `INSERT INTO nilai_fisik (peserta_id, kelas_id, tanggal, jenis_kelamin, push_up, plank_detik, sit_up, karung_bolak_balik,
                                  lintasan_m, catatan, diinput_oleh_staff_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING ${KOLOM}`,
        [d.pesertaId, d.kelasId, d.tanggal, d.jenisKelamin, d.pushUp, d.plankDetik, d.sitUp, d.karungBolakBalik, lintasanM, d.catatan, actor?.id || null]
      );
    } catch (err) {
      if (SUDAH_ADA(err)) throw new Error('FISIK_SUDAH_ADA');
      throw err;
    }
    await appendAudit(actor, 'CREATE_NILAI_FISIK', 'nilai_fisik', res.rows[0].id, { dataBaru: { ...d, lintasanM } });
    return res.rows[0];
  }
  const db = readLocalState();
  db.nilaiFisik = db.nilaiFisik || [];
  if (db.nilaiFisik.some((r) => r.pesertaId === d.pesertaId && r.tanggal === d.tanggal)) throw new Error('FISIK_SUDAH_ADA');
  const now = new Date().toISOString();
  const created = { id: db.seq.nilaiFisik++, ...d, lintasanM, penilaiId: actor?.id || null, createdAt: now, updatedAt: now };
  db.nilaiFisik.push(created);
  appendLocalAudit(db, actor, 'CREATE_NILAI_FISIK', 'nilai_fisik', created.id, { dataBaru: { ...d, lintasanM } });
  saveLocalState();
  return created;
}

export async function updateNilaiFisik(idRaw, payload, actor) {
  await ensureInitialized();
  const id = Number(idRaw);
  if (!Number.isInteger(id) || id <= 0) throw new Error('VALIDATION_ERROR');
  const d = await siapkan(payload);
  if (getMode() === 'postgres') {
    const [lama] = await bacaBaris({ id });
    if (!lama) throw new Error('NOT_FOUND');
    let res;
    try {
      // The track length stays the one of the test day.
      res = await getPool().query(
        `UPDATE nilai_fisik SET peserta_id = $1, kelas_id = $2, tanggal = $3, jenis_kelamin = $4, push_up = $5, plank_detik = $6,
                sit_up = $7, karung_bolak_balik = $8, catatan = $9, diinput_oleh_staff_id = $10, updated_at = NOW()
         WHERE id = $11 RETURNING ${KOLOM}`,
        [d.pesertaId, d.kelasId, d.tanggal, d.jenisKelamin, d.pushUp, d.plankDetik, d.sitUp, d.karungBolakBalik, d.catatan, actor?.id || null, id]
      );
    } catch (err) {
      if (SUDAH_ADA(err)) throw new Error('FISIK_SUDAH_ADA');
      throw err;
    }
    await appendAudit(actor, 'UPDATE_NILAI_FISIK', 'nilai_fisik', id, { dataLama: lama, dataBaru: d });
    return res.rows[0];
  }
  const db = readLocalState();
  const row = (db.nilaiFisik || []).find((r) => r.id === id);
  if (!row) throw new Error('NOT_FOUND');
  if (db.nilaiFisik.some((r) => r.id !== id && r.pesertaId === d.pesertaId && r.tanggal === d.tanggal)) throw new Error('FISIK_SUDAH_ADA');
  const dataLama = { ...row };
  Object.assign(row, d, { penilaiId: actor?.id || row.penilaiId, updatedAt: new Date().toISOString() });
  appendLocalAudit(db, actor, 'UPDATE_NILAI_FISIK', 'nilai_fisik', id, { dataLama, dataBaru: d });
  saveLocalState();
  return row;
}

export async function deleteNilaiFisik(idRaw, actor) {
  await ensureInitialized();
  const id = Number(idRaw);
  if (!Number.isInteger(id) || id <= 0) throw new Error('VALIDATION_ERROR');
  if (getMode() === 'postgres') {
    const res = await getPool().query(`DELETE FROM nilai_fisik WHERE id = $1 RETURNING ${KOLOM}`, [id]);
    if (!res.rows.length) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'DELETE_NILAI_FISIK', 'nilai_fisik', id, { dataLama: res.rows[0] });
    return { ok: true };
  }
  const db = readLocalState();
  const idx = (db.nilaiFisik || []).findIndex((r) => r.id === id);
  if (idx < 0) throw new Error('NOT_FOUND');
  const [removed] = db.nilaiFisik.splice(idx, 1);
  appendLocalAudit(db, actor, 'DELETE_NILAI_FISIK', 'nilai_fisik', id, { dataLama: removed });
  saveLocalState();
  return { ok: true };
}
