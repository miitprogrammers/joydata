import crypto from 'node:crypto';
import {
  ensureInitialized,
  getMode,
  getPool,
  readLocalState,
  saveLocalState,
  appendAudit,
} from './engine.js';
import { listKelas, listPeserta } from './pesertaRepo.js';
import { upsertNilaiUjian } from './akademikRepo.js';
import {
  JENIS_TES,
  daftarMateriTes,
  cariMateri,
  buatSoalTes,
  soalTanpaKunci,
  nilaiTes,
  catatanHasilTes,
  buatKodeTes,
  normalisasiKodeTes,
  validateSesiTes,
  alasanKodeTidakBerlaku,
} from '../domain/tesOnline.js';

// ---------------------------------------------------------------------------------------------------------------
// Data access (Postgres or the local store); everything below works on the same plain objects.

const iso = (v) => (v ? new Date(v).toISOString() : null);

const SESI_SELECT = `
  SELECT s.id, s.kode, s.kelas_id AS "kelasId", k.nama_kelas AS "namaKelas", s.jenis, s.materi,
         s.jumlah_soal AS "jumlahSoal", s.tanggal_ujian::text AS "tanggalUjian", s.nama_ujian AS "namaUjian",
         s.berlaku_sampai AS "berlakuSampai", s.status, s.dibuat_oleh_staff_id AS "dibuatOlehStaffId",
         st.nama AS "dibuatOleh", s.created_at AS "createdAt"
  FROM tes_online_sesi s
  LEFT JOIN kelas k ON k.id = s.kelas_id
  LEFT JOIN staff st ON st.id = s.dibuat_oleh_staff_id`;

function sesiView(row) {
  return {
    ...row,
    id: Number(row.id),
    kelasId: Number(row.kelasId),
    jumlahSoal: row.jumlahSoal == null ? null : Number(row.jumlahSoal),
    berlakuSampai: iso(row.berlakuSampai),
    createdAt: iso(row.createdAt),
    namaKelas: row.namaKelas || '',
    dibuatOleh: row.dibuatOleh || '',
  };
}

async function querySesi({ id = null, kode = null } = {}) {
  if (getMode() === 'postgres') {
    const where = [];
    const params = [];
    if (id !== null) where.push(`s.id = $${params.push(id)}`);
    if (kode !== null) where.push(`s.kode = $${params.push(kode)}`);
    const res = await getPool().query(
      `${SESI_SELECT} ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY s.created_at DESC, s.id DESC`,
      params
    );
    return res.rows.map(sesiView);
  }
  const db = readLocalState();
  return db.tesOnlineSesi
    .filter((s) => (id === null || s.id === id) && (kode === null || s.kode === kode))
    .map((s) => {
      const kelas = db.kelas.find((k) => k.id === s.kelasId);
      const staff = db.staff.find((st) => st.id === s.dibuatOlehStaffId);
      return sesiView({ ...s, namaKelas: kelas?.namaKelas, dibuatOleh: staff?.nama });
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);
}

async function insertSesi(d, kode, actor) {
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `INSERT INTO tes_online_sesi
         (kode, kelas_id, jenis, materi, jumlah_soal, tanggal_ujian, nama_ujian, berlaku_sampai, dibuat_oleh_staff_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (kode) DO NOTHING RETURNING id`,
      [kode, d.kelasId, d.jenis, d.materi, d.jumlahSoal, d.tanggalUjian, d.namaUjian, d.berlakuSampai, actor?.id || null]
    );
    return res.rows[0] ? Number(res.rows[0].id) : null;
  }
  const db = readLocalState();
  if (db.tesOnlineSesi.some((s) => s.kode === kode)) return null;
  const id = db.seq.tesOnlineSesi++;
  db.tesOnlineSesi.push({
    id,
    kode,
    ...d,
    status: 'aktif',
    dibuatOlehStaffId: actor?.id || null,
    createdAt: new Date().toISOString(),
  });
  saveLocalState();
  return id;
}

async function patchSesi(id, { status, berlakuSampai }) {
  if (getMode() === 'postgres') {
    await getPool().query(`UPDATE tes_online_sesi SET status = $1, berlaku_sampai = $2 WHERE id = $3`, [status, berlakuSampai, id]);
    return;
  }
  const db = readLocalState();
  Object.assign(db.tesOnlineSesi.find((s) => s.id === id), { status, berlakuSampai });
  saveLocalState();
}

async function removeSesi(id) {
  if (getMode() === 'postgres') {
    await getPool().query(`DELETE FROM tes_online_sesi WHERE id = $1`, [id]);
    return;
  }
  const db = readLocalState();
  db.tesOnlineSesi = db.tesOnlineSesi.filter((s) => s.id !== id);
  db.tesOnlinePercobaan = db.tesOnlinePercobaan.filter((p) => p.sesiId !== id);
  saveLocalState();
}

function percobaanView(row) {
  return {
    id: Number(row.id),
    sesiId: Number(row.sesiId),
    pesertaId: Number(row.pesertaId),
    soal: row.soal,
    jawaban: row.jawaban ?? null,
    skor: row.skor == null ? null : Number(row.skor),
    hasil: row.hasil ?? null,
    mulaiAt: iso(row.mulaiAt),
    selesaiAt: iso(row.selesaiAt),
  };
}

async function queryPercobaan({ id = null, sesiId = null, pesertaId = null } = {}) {
  if (getMode() === 'postgres') {
    const where = [];
    const params = [];
    if (id !== null) where.push(`id = $${params.push(id)}`);
    if (sesiId !== null) where.push(`sesi_id = $${params.push(sesiId)}`);
    if (pesertaId !== null) where.push(`peserta_id = $${params.push(pesertaId)}`);
    const res = await getPool().query(
      `SELECT id, sesi_id AS "sesiId", peserta_id AS "pesertaId", soal, jawaban, skor, hasil,
              mulai_at AS "mulaiAt", selesai_at AS "selesaiAt"
       FROM tes_online_percobaan ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY mulai_at DESC`,
      params
    );
    return res.rows.map(percobaanView);
  }
  return readLocalState()
    .tesOnlinePercobaan.filter(
      (p) => (id === null || p.id === id) && (sesiId === null || p.sesiId === sesiId) && (pesertaId === null || p.pesertaId === pesertaId)
    )
    .map(percobaanView);
}

// One attempt per peserta per code: a second start (refresh, other device) gets the attempt that already exists.
async function insertPercobaan(sesiId, pesertaId, soal) {
  if (getMode() === 'postgres') {
    await getPool().query(
      `INSERT INTO tes_online_percobaan (sesi_id, peserta_id, soal) VALUES ($1, $2, $3)
       ON CONFLICT (sesi_id, peserta_id) DO NOTHING`,
      [sesiId, pesertaId, JSON.stringify(soal)]
    );
  } else {
    const db = readLocalState();
    if (!db.tesOnlinePercobaan.some((p) => p.sesiId === sesiId && p.pesertaId === pesertaId)) {
      db.tesOnlinePercobaan.push({
        id: db.seq.tesOnlinePercobaan++,
        sesiId,
        pesertaId,
        soal,
        jawaban: null,
        skor: null,
        hasil: null,
        mulaiAt: new Date().toISOString(),
        selesaiAt: null,
      });
      saveLocalState();
    }
  }
  return (await queryPercobaan({ sesiId, pesertaId }))[0];
}

// Claims the attempt for this submission; false when it was already submitted (double click, second tab).
async function finishPercobaan(id, { jawaban, skor, hasil }) {
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `UPDATE tes_online_percobaan SET jawaban = $1, skor = $2, hasil = $3, selesai_at = NOW()
       WHERE id = $4 AND selesai_at IS NULL RETURNING id`,
      [JSON.stringify(jawaban), skor, JSON.stringify(hasil), id]
    );
    return res.rows.length > 0;
  }
  const db = readLocalState();
  const row = db.tesOnlinePercobaan.find((p) => p.id === id);
  if (!row || row.selesaiAt) return false;
  Object.assign(row, { jawaban, skor, hasil, selesaiAt: new Date().toISOString() });
  saveLocalState();
  return true;
}

async function reopenPercobaan(id) {
  if (getMode() === 'postgres') {
    await getPool().query(
      `UPDATE tes_online_percobaan SET jawaban = NULL, skor = NULL, hasil = NULL, selesai_at = NULL WHERE id = $1`,
      [id]
    );
    return;
  }
  const db = readLocalState();
  Object.assign(db.tesOnlinePercobaan.find((p) => p.id === id), { jawaban: null, skor: null, hasil: null, selesaiAt: null });
  saveLocalState();
}

async function pesertaKelasId(pesertaId) {
  if (getMode() === 'postgres') {
    const res = await getPool().query(`SELECT kelas_id FROM peserta WHERE id = $1`, [pesertaId]);
    return res.rows[0]?.kelas_id ? Number(res.rows[0].kelas_id) : null;
  }
  return readLocalState().peserta.find((p) => p.id === pesertaId)?.kelasId ?? null;
}

// ---------------------------------------------------------------------------------------------------------------
// Staff: open, close and follow test codes (page tes-online).

function materiJudul(jenis, materi) {
  return cariMateri(jenis, materi)?.judul || materi;
}

function denganStatus(sesi) {
  return {
    ...sesi,
    materiJudul: materiJudul(sesi.jenis, sesi.materi),
    bisaDipakai: alasanKodeTidakBerlaku(sesi) === null,
  };
}

export async function listSesiTes() {
  await ensureInitialized();
  const [sesi, percobaan, kelasData] = await Promise.all([querySesi(), queryPercobaan(), listKelas()]);
  const rosterPerKelas = new Map(kelasData.items.map((k) => [Number(k.id), Number(k.jumlahPeserta) || 0]));

  const items = sesi.map((s) => {
    const milik = percobaan.filter((p) => p.sesiId === s.id);
    const selesai = milik.filter((p) => p.selesaiAt);
    return {
      ...denganStatus(s),
      jumlahPeserta: rosterPerKelas.get(s.kelasId) ?? 0,
      jumlahSelesai: selesai.length,
      jumlahBerjalan: milik.length - selesai.length,
      rataSkor: selesai.length ? Math.round((selesai.reduce((n, p) => n + p.skor, 0) / selesai.length) * 100) / 100 : null,
    };
  });

  return {
    items,
    kelasOptions: kelasData.items.map((k) => ({ id: Number(k.id), namaKelas: k.namaKelas, status: k.status })),
    materi: daftarMateriTes(),
  };
}

export async function createSesiTes(payload, actor) {
  await ensureInitialized();
  const check = validateSesiTes(payload);
  if (!check.ok) throw new Error(check.code);
  const d = check.normalized;
  const kelasData = await listKelas();
  if (!kelasData.items.some((k) => Number(k.id) === d.kelasId)) throw new Error('INVALID_TES_ONLINE');

  for (let i = 0; i < 8; i++) {
    const kode = buatKodeTes(crypto.randomInt);
    const id = await insertSesi(d, kode, actor);
    if (id) {
      await appendAudit(actor, 'CREATE_TES_ONLINE', 'tes_online_sesi', id, { kode, ...d });
      return denganStatus((await querySesi({ id }))[0]);
    }
  }
  throw new Error('TES_KODE_GAGAL_DIBUAT');
}

export async function updateSesiTes(idRaw, payload, actor) {
  await ensureInitialized();
  const id = Number(idRaw);
  const [sesi] = await querySesi({ id });
  if (!sesi) throw new Error('NOT_FOUND');

  const status = payload?.status ?? sesi.status;
  if (!['aktif', 'ditutup'].includes(status)) throw new Error('INVALID_TES_ONLINE');
  let berlakuSampai = sesi.berlakuSampai;
  if (payload && 'berlakuSampai' in payload) {
    berlakuSampai = payload.berlakuSampai ? new Date(payload.berlakuSampai) : null;
    if (berlakuSampai && Number.isNaN(berlakuSampai.getTime())) throw new Error('INVALID_TES_ONLINE');
    berlakuSampai = berlakuSampai ? berlakuSampai.toISOString() : null;
  }

  await patchSesi(id, { status, berlakuSampai });
  await appendAudit(actor, 'UPDATE_TES_ONLINE', 'tes_online_sesi', id, { kode: sesi.kode, status, berlakuSampai });
  return denganStatus((await querySesi({ id }))[0]);
}

export async function deleteSesiTes(idRaw, actor) {
  await ensureInitialized();
  const id = Number(idRaw);
  const [sesi] = await querySesi({ id });
  if (!sesi) throw new Error('NOT_FOUND');
  // Scores already in Rekap Nilai Ujian keep their source: such a code can only be closed.
  if ((await queryPercobaan({ sesiId: id })).some((p) => p.selesaiAt)) throw new Error('TES_SESI_SUDAH_ADA_HASIL');
  await removeSesi(id);
  await appendAudit(actor, 'DELETE_TES_ONLINE', 'tes_online_sesi', id, { kode: sesi.kode });
  return { deleted: true };
}

function ringkasHasil(sesi, hasil) {
  if (!hasil) return null;
  const salah =
    sesi.jenis === 'kanji'
      ? hasil.detail.filter((d) => !d.bacaanOk || !d.artiOk).map((d) => `${d.kanji} ${d.bacaanBenar} · ${d.artiBenar}`)
      : hasil.detail.filter((d) => !d.ok).map((d) => `${d.tanyaId} → ${d.jawabanBenar}`);
  return {
    total: hasil.total,
    benar: hasil.benar,
    benarBacaan: hasil.benarBacaan ?? null,
    benarArti: hasil.benarArti ?? null,
    salah,
  };
}

export async function getHasilSesiTes(idRaw) {
  await ensureInitialized();
  const id = Number(idRaw);
  const [sesi] = await querySesi({ id });
  if (!sesi) throw new Error('NOT_FOUND');
  const [percobaan, roster, luar] = await Promise.all([
    queryPercobaan({ sesiId: id }),
    listPeserta({ sumber: 'roster' }),
    listPeserta({ sumber: 'manual' }),
  ]);
  const namaById = new Map([...roster.items, ...luar.items].map((p) => [p.id, p.nama]));
  const percobaanByPeserta = new Map(percobaan.map((p) => [p.pesertaId, p]));
  // Everyone now in the class, plus whoever took the test and has since moved.
  const pesertaIds = [
    ...new Set([...roster.items.filter((p) => p.kelasId === sesi.kelasId).map((p) => p.id), ...percobaanByPeserta.keys()]),
  ];

  const rank = { selesai: 0, berjalan: 1, belum: 2 };
  const rows = pesertaIds
    .map((pesertaId) => {
      const p = percobaanByPeserta.get(pesertaId);
      const status = !p ? 'belum' : p.selesaiAt ? 'selesai' : 'berjalan';
      return {
        pesertaId,
        nama: namaById.get(pesertaId) || `Peserta #${pesertaId}`,
        status,
        skor: p?.skor ?? null,
        mulaiAt: p?.mulaiAt ?? null,
        selesaiAt: p?.selesaiAt ?? null,
        durasiDetik: p?.selesaiAt ? Math.round((new Date(p.selesaiAt) - new Date(p.mulaiAt)) / 1000) : null,
        ringkasan: ringkasHasil(sesi, p?.hasil),
      };
    })
    .sort((a, b) => rank[a.status] - rank[b.status] || (b.skor ?? 0) - (a.skor ?? 0) || a.nama.localeCompare(b.nama));

  return { sesi: denganStatus(sesi), rows };
}

// ---------------------------------------------------------------------------------------------------------------
// Peserta portal: practice without a code, official test with one.

export async function getTesPortal(pesertaId) {
  await ensureInitialized();
  const [percobaan, sesi] = await Promise.all([queryPercobaan({ pesertaId }), querySesi()]);
  const sesiById = new Map(sesi.map((s) => [s.id, s]));
  const riwayat = percobaan
    .filter((p) => p.selesaiAt && sesiById.has(p.sesiId))
    .map((p) => {
      const s = sesiById.get(p.sesiId);
      return {
        id: p.id,
        kode: s.kode,
        jenis: s.jenis,
        materiJudul: materiJudul(s.jenis, s.materi),
        namaUjian: s.namaUjian,
        tanggalUjian: s.tanggalUjian,
        skor: p.skor,
        selesaiAt: p.selesaiAt,
      };
    })
    .sort((a, b) => b.selesaiAt.localeCompare(a.selesaiAt));
  return { materi: daftarMateriTes(), riwayat };
}

export function getLatihanTes({ jenis, materi, jumlah }) {
  const info = cariMateri(jenis, materi);
  if (!info) throw new Error('INVALID_TES_ONLINE');
  const n = Number(jumlah);
  const soal = buatSoalTes({ jenis, materi, jumlah: Number.isInteger(n) && n > 0 ? n : null });
  return { jenis, materi, materiJudul: info.judul, soal };
}

// Practice: the paper (with its key) lives in the browser and nothing is stored; the server only grades it,
// so practice and official results are counted the same way.
export function nilaiLatihanTes(jenis, soal, jawaban) {
  if (!JENIS_TES.includes(jenis) || !Array.isArray(soal) || soal.length === 0 || soal.length > 500) {
    throw new Error('INVALID_TES_ONLINE');
  }
  try {
    return { ...nilaiTes(jenis, soal, jawabanBersih(jenis, soal, jawaban)), jenis };
  } catch {
    throw new Error('INVALID_TES_ONLINE');
  }
}

function ringkasanSesiUntukPeserta(sesi) {
  const info = cariMateri(sesi.jenis, sesi.materi);
  return {
    kode: sesi.kode,
    jenis: sesi.jenis,
    materi: sesi.materi,
    materiJudul: info?.judul || sesi.materi,
    jumlah: sesi.jumlahSoal ?? info?.jumlah ?? null,
    namaUjian: sesi.namaUjian,
    tanggalUjian: sesi.tanggalUjian,
    namaKelas: sesi.namaKelas,
    berlakuSampai: sesi.berlakuSampai,
  };
}

async function sesiUntukPeserta(pesertaId, kodeInput) {
  const kode = normalisasiKodeTes(kodeInput);
  const [sesi] = kode ? await querySesi({ kode }) : [];
  const alasan = alasanKodeTidakBerlaku(sesi);
  if (alasan) throw new Error(alasan);
  if ((await pesertaKelasId(pesertaId)) !== sesi.kelasId) throw new Error('TES_KODE_BEDA_KELAS');
  const [percobaan] = await queryPercobaan({ sesiId: sesi.id, pesertaId });
  if (percobaan?.selesaiAt) throw new Error('TES_SUDAH_DIKERJAKAN');
  return { sesi, percobaan };
}

export async function cekKodeTes(pesertaId, kodeInput) {
  await ensureInitialized();
  const { sesi, percobaan } = await sesiUntukPeserta(pesertaId, kodeInput);
  return { ...ringkasanSesiUntukPeserta(sesi), sudahDimulai: Boolean(percobaan) };
}

export async function mulaiTes(pesertaId, kodeInput) {
  await ensureInitialized();
  const { sesi, percobaan } = await sesiUntukPeserta(pesertaId, kodeInput);
  const p =
    percobaan ||
    (await insertPercobaan(sesi.id, pesertaId, buatSoalTes({ jenis: sesi.jenis, materi: sesi.materi, jumlah: sesi.jumlahSoal })));
  return {
    percobaanId: p.id,
    mulaiAt: p.mulaiAt,
    sesi: ringkasanSesiUntukPeserta(sesi),
    soal: soalTanpaKunci(sesi.jenis, p.soal),
  };
}

// Only answers to questions on this paper are kept.
function jawabanBersih(jenis, soal, jawaban) {
  const j = jawaban && typeof jawaban === 'object' ? jawaban : {};
  const angka = (v) => (Number.isInteger(v) ? v : null);
  if (jenis === 'kanji') {
    return Object.fromEntries(soal.map((s) => [s.id, { bacaan: angka(j[s.id]?.bacaan), arti: angka(j[s.id]?.arti) }]));
  }
  return Object.fromEntries(soal.flatMap((b) => b.soal).map((s) => [s.id, angka(j[s.id])]));
}

export async function selesaiTes(pesertaId, percobaanIdRaw, jawaban) {
  await ensureInitialized();
  const [p] = await queryPercobaan({ id: Number(percobaanIdRaw), pesertaId });
  if (!p) throw new Error('TES_PERCOBAAN_TIDAK_ADA');
  if (p.selesaiAt) throw new Error('TES_SUDAH_DIKERJAKAN');
  const [sesi] = await querySesi({ id: p.sesiId });
  if (!sesi) throw new Error('TES_PERCOBAAN_TIDAK_ADA');

  const bersih = jawabanBersih(sesi.jenis, p.soal, jawaban);
  const hasil = nilaiTes(sesi.jenis, p.soal, bersih);
  if (!(await finishPercobaan(p.id, { jawaban: bersih, skor: hasil.skor, hasil }))) throw new Error('TES_SUDAH_DIKERJAKAN');

  const info = ringkasanSesiUntukPeserta(sesi);
  try {
    await upsertNilaiUjian(
      {
        pesertaId,
        kelasId: sesi.kelasId,
        tanggalUjian: sesi.tanggalUjian,
        codeUjian: sesi.namaUjian,
        pola: 'tunggal',
        nilaiTunggal: hasil.skor,
        catatan: catatanHasilTes({ jenis: sesi.jenis, materiJudul: info.materiJudul, kode: sesi.kode }, hasil),
      },
      { id: sesi.dibuatOlehStaffId, nama: `Tes Online (kode ${sesi.kode})` }
    );
  } catch (err) {
    // Without a stored score the attempt is not finished: the peserta can send the answers again.
    await reopenPercobaan(p.id);
    throw err;
  }
  return { ...hasil, jenis: sesi.jenis, sesi: info, tersimpan: true };
}
