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
import { tulisBacaanDokkai } from '../ai/dokkaiAi.js';
import {
  JENIS_TES,
  JLPT_DOKKAI,
  VOLUME_KANJI,
  daftarMateriTes,
  cariMateri,
  poolDokkai,
  buatSoalTes,
  soalTanpaKunci,
  nilaiTes,
  catatanHasilTes,
  skorNilaiUjian,
  buatKodeTes,
  normalisasiKodeTes,
  validateSesiTes,
  alasanKodeTidakBerlaku,
  validasiBacaanAi,
  kanjiDariVolume,
  tanpaFurigana,
} from '../domain/tesOnline.js';

// ---------------------------------------------------------------------------------------------------------------
// Data access (Postgres or the local store); everything below works on the same plain objects.

const iso = (v) => (v ? new Date(v).toISOString() : null);

const SESI_SELECT = `
  SELECT s.id, s.kode, s.kelas_id AS "kelasId", k.nama_kelas AS "namaKelas", s.jenis, s.materi,
         s.jumlah_soal AS "jumlahSoal", s.tanggal_ujian::text AS "tanggalUjian", s.nama_ujian AS "namaUjian",
         s.berlaku_sampai AS "berlakuSampai", s.status, s.sumber, s.jlpt, s.kanji_volume AS "kanjiVolume",
         s.bacaan, s.dibuat_oleh_staff_id AS "dibuatOlehStaffId", st.nama AS "dibuatOleh", s.created_at AS "createdAt"
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
    sumber: row.sumber || 'bank',
    jlpt: row.jlpt || 'N5',
    kanjiVolume: row.kanjiVolume ?? null,
    bacaan: row.bacaan ?? null,
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
  // An AI code waits as a draft until a sensei has reviewed its passages.
  const status = d.sumber === 'ai' ? 'draf' : 'aktif';
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `INSERT INTO tes_online_sesi
         (kode, kelas_id, jenis, materi, jumlah_soal, tanggal_ujian, nama_ujian, berlaku_sampai, status, sumber, jlpt,
          kanji_volume, dibuat_oleh_staff_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (kode) DO NOTHING RETURNING id`,
      [
        kode,
        d.kelasId,
        d.jenis,
        d.materi,
        d.jumlahSoal,
        d.tanggalUjian,
        d.namaUjian,
        d.berlakuSampai,
        status,
        d.sumber,
        d.jlpt,
        d.kanjiVolume ? JSON.stringify(d.kanjiVolume) : null,
        actor?.id || null,
      ]
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
    status,
    bacaan: null,
    dibuatOlehStaffId: actor?.id || null,
    createdAt: new Date().toISOString(),
  });
  saveLocalState();
  return id;
}

const KOLOM_SESI = { status: 'status', berlakuSampai: 'berlaku_sampai', bacaan: 'bacaan' };

async function patchSesi(id, changes) {
  const keys = Object.keys(changes).filter((k) => KOLOM_SESI[k]);
  if (getMode() === 'postgres') {
    const params = keys.map((k) => (k === 'bacaan' ? JSON.stringify(changes[k]) : changes[k]));
    await getPool().query(
      `UPDATE tes_online_sesi SET ${keys.map((k, i) => `${KOLOM_SESI[k]} = $${i + 1}`).join(', ')} WHERE id = $${keys.length + 1}`,
      [...params, id]
    );
    return;
  }
  const db = readLocalState();
  const row = db.tesOnlineSesi.find((s) => s.id === id);
  for (const k of keys) row[k] = changes[k];
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

// AI passages a sensei approved, as pool entries ({ ...passage, level, jlpt }).
async function queryBacaanAi() {
  if (getMode() === 'postgres') {
    const res = await getPool().query(`SELECT id, level, jlpt, data FROM dokkai_bacaan_ai ORDER BY created_at, id`);
    return res.rows.map((r) => ({ ...r.data, id: r.id, level: r.level, jlpt: r.jlpt }));
  }
  return readLocalState().dokkaiBacaanAi.map((r) => ({ ...r.data, id: r.id, level: r.level, jlpt: r.jlpt }));
}

async function insertBacaanAi(bacaan, { level, jlpt, sesiId }, actor) {
  if (getMode() === 'postgres') {
    for (const b of bacaan) {
      await getPool().query(
        `INSERT INTO dokkai_bacaan_ai (id, level, jlpt, data, sesi_id, disetujui_oleh_staff_id)
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
        [b.id, level, jlpt, JSON.stringify(b), sesiId, actor?.id || null]
      );
    }
    return;
  }
  const db = readLocalState();
  for (const b of bacaan) {
    if (db.dokkaiBacaanAi.some((r) => r.id === b.id)) continue;
    db.dokkaiBacaanAi.push({
      id: b.id,
      level,
      jlpt,
      data: b,
      sesiId,
      disetujuiOlehStaffId: actor?.id || null,
      createdAt: new Date().toISOString(),
    });
  }
  saveLocalState();
}

// ---------------------------------------------------------------------------------------------------------------
// What a code tests: material title, its passage pool and the kanji its passages may show.

function materiJudul(sesi) {
  const judul = cariMateri(sesi.jenis, sesi.materi)?.judul || sesi.materi;
  return sesi.jenis === 'dokkai' && sesi.jlpt !== 'N5' ? `${judul} · ${sesi.jlpt}` : judul;
}

const kanjiBolehSesi = (sesi) => (sesi.kanjiVolume ? kanjiDariVolume(sesi.kanjiVolume) : null);

function poolSesi(sesi, tambahan) {
  if (sesi.jenis !== 'dokkai') return null;
  if (sesi.sumber === 'ai') return (sesi.bacaan || []).map((b) => ({ ...b, level: sesi.materi, jlpt: sesi.jlpt }));
  return poolDokkai(sesi.materi, tambahan, sesi.jlpt);
}

// The approved AI passages are only read when a bank dokkai code needs them.
async function tambahanUntuk(sesi) {
  return sesi.jenis === 'dokkai' && sesi.sumber === 'bank' ? queryBacaanAi() : [];
}

function denganStatus(sesi) {
  const { bacaan, ...rest } = sesi;
  return {
    ...rest,
    materiJudul: materiJudul(sesi),
    jumlahBacaanAi: sesi.sumber === 'ai' ? (bacaan || []).length : null,
    bisaDipakai: alasanKodeTidakBerlaku(sesi) === null,
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Staff: open, review, close and follow test codes (page tes-online).

export async function listSesiTes() {
  await ensureInitialized();
  const [sesi, percobaan, kelasData, tambahan] = await Promise.all([querySesi(), queryPercobaan(), listKelas(), queryBacaanAi()]);
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
    materi: daftarMateriTes(tambahan),
    jlptOptions: JLPT_DOKKAI,
    volumeKanji: VOLUME_KANJI,
  };
}

/** One code with its AI passages and their keys (staff review). */
export async function getSesiTes(idRaw) {
  await ensureInitialized();
  const [sesi] = await querySesi({ id: Number(idRaw) });
  if (!sesi) throw new Error('NOT_FOUND');
  return { ...denganStatus(sesi), bacaan: sesi.bacaan || [] };
}

// Scores are stored per peserta + class + date + exam code, so a second code (or a paper exam) with the same exam
// code on the same day would overwrite the first one's scores.
async function kodeUjianDipakai({ kelasId, tanggalUjian, namaUjian }) {
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `SELECT 1 FROM tes_online_sesi WHERE kelas_id = $1 AND tanggal_ujian = $2 AND UPPER(nama_ujian) = $3
       UNION ALL
       SELECT 1 FROM nilai_ujian WHERE kelas_id = $1 AND tanggal_ujian = $2 AND UPPER(nama_ujian) = $3
       LIMIT 1`,
      [kelasId, tanggalUjian, namaUjian]
    );
    return res.rows.length > 0;
  }
  const db = readLocalState();
  const sama = (r, kode) => Number(r.kelasId) === kelasId && r.tanggalUjian === tanggalUjian && String(kode).toUpperCase() === namaUjian;
  return db.tesOnlineSesi.some((s) => sama(s, s.namaUjian)) || db.nilaiUjian.some((n) => sama(n, n.codeUjian));
}

export async function createSesiTes(payload, actor) {
  await ensureInitialized();
  const check = validateSesiTes(payload, { tambahanDokkai: await queryBacaanAi() });
  if (!check.ok) throw new Error(check.code);
  const d = check.normalized;
  const kelasData = await listKelas();
  if (!kelasData.items.some((k) => Number(k.id) === d.kelasId)) throw new Error('INVALID_TES_ONLINE');
  if (await kodeUjianDipakai(d)) throw new Error('TES_KODE_UJIAN_DIPAKAI');

  for (let i = 0; i < 8; i++) {
    const kode = buatKodeTes(crypto.randomInt);
    const id = await insertSesi(d, kode, actor);
    if (id) {
      await appendAudit(actor, 'CREATE_TES_ONLINE', 'tes_online_sesi', id, { kode, ...d });
      return getSesiTes(id);
    }
  }
  throw new Error('TES_KODE_GAGAL_DIBUAT');
}

async function sesiDrafAi(idRaw) {
  const [sesi] = await querySesi({ id: Number(idRaw) });
  if (!sesi) throw new Error('NOT_FOUND');
  if (sesi.sumber !== 'ai' || sesi.status !== 'draf') throw new Error('TES_SESI_BUKAN_DRAF');
  return sesi;
}

const MAKS_BACAAN_AI_PER_PERMINTAAN = 8;
const tanpaFurigana = (s) => String(s || '').replace(/\{[^{}]*\}/g, '');

/** Asks the AI for new passages for a draft code; only passages that pass validasiBacaanAi are added. */
export async function tambahBacaanAi(idRaw, payload, actor) {
  await ensureInitialized();
  const sesi = await sesiDrafAi(idRaw);
  const jumlah = Math.max(1, Math.min(MAKS_BACAAN_AI_PER_PERMINTAAN, Number(payload?.jumlah) || MAKS_BACAAN_AI_PER_PERMINTAAN));
  const ada = sesi.bacaan || [];
  const kanjiBoleh = kanjiBolehSesi(sesi) ?? undefined;

  let mentah;
  try {
    mentah = await tulisBacaanDokkai({
      level: sesi.materi,
      jlpt: sesi.jlpt,
      jumlah,
      hindariJudul: ada.map((b) => tanpaFurigana(b.judul)),
      kanjiBoleh,
    });
  } catch (err) {
    // AI_FAILED reads "could not write the resume" (Smart Report); this one is about the passages.
    throw new Error(err.message === 'AI_FAILED' ? 'TES_AI_GAGAL' : err.message);
  }

  let nomor = ada.reduce((max, b) => Math.max(max, Number(String(b.id).split('-')[1]) || 0), 0);
  const baru = [];
  const alasanDitolak = [];
  for (const raw of mentah.bacaan) {
    const v = validasiBacaanAi(raw, `AI${sesi.id}-${nomor + 1}`, { jlpt: sesi.jlpt, kanjiBoleh });
    if (v.ok) {
      nomor += 1;
      baru.push(v.bacaan);
    } else {
      alasanDitolak.push(v.alasan);
    }
  }
  if (!baru.length) throw new Error('TES_AI_GAGAL');

  await patchSesi(sesi.id, { bacaan: [...ada, ...baru] });
  await appendAudit(actor, 'TAMBAH_BACAAN_AI', 'tes_online_sesi', sesi.id, {
    kode: sesi.kode,
    dibuat: baru.length,
    ditolak: alasanDitolak,
    model: mentah.model,
  });
  return { sesi: await getSesiTes(sesi.id), dibuat: baru.length, ditolak: alasanDitolak.length };
}

export async function hapusBacaanAi(idRaw, bacaanId, actor) {
  await ensureInitialized();
  const sesi = await sesiDrafAi(idRaw);
  const bacaan = (sesi.bacaan || []).filter((b) => b.id !== bacaanId);
  if (bacaan.length === (sesi.bacaan || []).length) throw new Error('NOT_FOUND');
  await patchSesi(sesi.id, { bacaan });
  await appendAudit(actor, 'HAPUS_BACAAN_AI', 'tes_online_sesi', sesi.id, { kode: sesi.kode, bacaanId });
  return getSesiTes(sesi.id);
}

/** A sensei correcting the key of one AI question during the review. */
export async function ubahKunciBacaanAi(idRaw, bacaanId, payload, actor) {
  await ensureInitialized();
  const sesi = await sesiDrafAi(idRaw);
  const benar = Number(payload?.benar);
  let ketemu = false;
  const bacaan = (sesi.bacaan || []).map((b) =>
    b.id !== bacaanId
      ? b
      : {
          ...b,
          soal: b.soal.map((s) => {
            if (s.id !== payload?.soalId) return s;
            if (!Number.isInteger(benar) || benar < 0 || benar >= s.opsi.length) throw new Error('INVALID_TES_ONLINE');
            ketemu = true;
            return { ...s, benar };
          }),
        }
  );
  if (!ketemu) throw new Error('NOT_FOUND');
  await patchSesi(sesi.id, { bacaan });
  await appendAudit(actor, 'UBAH_KUNCI_BACAAN_AI', 'tes_online_sesi', sesi.id, {
    kode: sesi.kode,
    bacaanId,
    soalId: payload.soalId,
    benar,
  });
  return getSesiTes(sesi.id);
}

export async function updateSesiTes(idRaw, payload, actor) {
  await ensureInitialized();
  const id = Number(idRaw);
  const [sesi] = await querySesi({ id });
  if (!sesi) throw new Error('NOT_FOUND');

  const status = payload?.status ?? sesi.status;
  // A draft can only be activated (or deleted); afterwards a code moves between aktif and ditutup.
  const bolehStatus = sesi.status === 'draf' ? ['draf', 'aktif'] : ['aktif', 'ditutup'];
  if (!bolehStatus.includes(status)) throw new Error('INVALID_TES_ONLINE');
  let berlakuSampai = sesi.berlakuSampai;
  if (payload && 'berlakuSampai' in payload) {
    berlakuSampai = payload.berlakuSampai ? new Date(payload.berlakuSampai) : null;
    if (berlakuSampai && Number.isNaN(berlakuSampai.getTime())) throw new Error('INVALID_TES_ONLINE');
    berlakuSampai = berlakuSampai ? berlakuSampai.toISOString() : null;
  }

  // Activating an AI draft: the reviewed passages also join the bank for practice and bank codes.
  if (sesi.status === 'draf' && status === 'aktif' && sesi.sumber === 'ai') {
    if (!sesi.bacaan?.length) throw new Error('TES_AI_BELUM_ADA_BACAAN');
    await insertBacaanAi(sesi.bacaan, { level: sesi.materi, jlpt: sesi.jlpt, sesiId: sesi.id }, actor);
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
      : hasil.detail.filter((d) => !d.ok).map((d) => `${d.tanyaId} → ${tanpaFurigana(d.jawabanBenar)}`);
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
  const [percobaan, sesi, tambahan] = await Promise.all([queryPercobaan({ pesertaId }), querySesi(), queryBacaanAi()]);
  const sesiById = new Map(sesi.map((s) => [s.id, s]));
  const riwayat = percobaan
    .filter((p) => p.selesaiAt && sesiById.has(p.sesiId))
    .map((p) => {
      const s = sesiById.get(p.sesiId);
      return {
        id: p.id,
        kode: s.kode,
        jenis: s.jenis,
        materiJudul: materiJudul(s),
        namaUjian: s.namaUjian,
        tanggalUjian: s.tanggalUjian,
        skor: p.skor,
        selesaiAt: p.selesaiAt,
      };
    })
    .sort((a, b) => b.selesaiAt.localeCompare(a.selesaiAt));
  return { materi: daftarMateriTes(tambahan), jlptOptions: JLPT_DOKKAI, riwayat };
}

export async function getLatihanTes({ jenis, materi, jumlah, jlpt }) {
  await ensureInitialized();
  const info = cariMateri(jenis, materi);
  const pola = jenis === 'dokkai' ? jlpt || 'N5' : 'N5';
  if (!info || !JLPT_DOKKAI.includes(pola)) throw new Error('INVALID_TES_ONLINE');
  const pool = jenis === 'dokkai' ? poolDokkai(materi, await queryBacaanAi(), pola) : null;
  if (pool && !pool.length) throw new Error('INVALID_TES_ONLINE');
  const n = Number(jumlah);
  const soal = buatSoalTes({ jenis, materi, jumlah: Number.isInteger(n) && n > 0 ? n : null, pool });
  return { jenis, materi, materiJudul: materiJudul({ jenis, materi, jlpt: pola }), soal };
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

function ringkasanSesiUntukPeserta(sesi, tambahan) {
  const pool = poolSesi(sesi, tambahan);
  const total = pool ? pool.length : cariMateri(sesi.jenis, sesi.materi)?.jumlah ?? null;
  return {
    kode: sesi.kode,
    jenis: sesi.jenis,
    materi: sesi.materi,
    materiJudul: materiJudul(sesi),
    jumlah: sesi.jumlahSoal && total !== null ? Math.min(sesi.jumlahSoal, total) : total,
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
  return { ...ringkasanSesiUntukPeserta(sesi, await tambahanUntuk(sesi)), sudahDimulai: Boolean(percobaan) };
}

export async function mulaiTes(pesertaId, kodeInput) {
  await ensureInitialized();
  const { sesi, percobaan } = await sesiUntukPeserta(pesertaId, kodeInput);
  const tambahan = await tambahanUntuk(sesi);
  const p =
    percobaan ||
    (await insertPercobaan(
      sesi.id,
      pesertaId,
      buatSoalTes({
        jenis: sesi.jenis,
        materi: sesi.materi,
        jumlah: sesi.jumlahSoal,
        pool: poolSesi(sesi, tambahan),
        kanjiBoleh: kanjiBolehSesi(sesi),
      })
    ));
  return {
    percobaanId: p.id,
    mulaiAt: p.mulaiAt,
    sesi: ringkasanSesiUntukPeserta(sesi, tambahan),
    soal: soalTanpaKunci(sesi.jenis, p.soal),
  };
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

  const info = ringkasanSesiUntukPeserta(sesi, await tambahanUntuk(sesi));
  try {
    await upsertNilaiUjian(
      {
        pesertaId,
        kelasId: sesi.kelasId,
        tanggalUjian: sesi.tanggalUjian,
        codeUjian: sesi.namaUjian,
        ...skorNilaiUjian(sesi.jenis, hasil.skor),
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
