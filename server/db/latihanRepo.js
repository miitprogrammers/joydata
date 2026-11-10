import { ensureInitialized, getMode, getPool, readLocalState, saveLocalState } from './engine.js';
import { listKelas } from './pesertaRepo.js';
import { mancationFotoUrl } from './mancation.js';
import { formatPersonName } from '../domain/nameFormat.js';
import {
  VOLUME_FLASHCARD,
  kartuVolume,
  judulVolumeFlashcard,
  lengkapiAcak,
  urutanKartu,
  bersihkanWaktu,
  ringkasProgres,
} from '../domain/flashcard.js';
import { jlptKanji } from '../domain/tesOnline.js';
import {
  DETIK_AKTIF,
  sedangAktif,
  terapkanDetak,
  statusSesi,
  rentangPeriode,
  statistikLatihan,
} from '../domain/aktivitasLatihan.js';

const iso = (v) => (v ? new Date(v).toISOString() : null);

// ---------------------------------------------------------------------------------------------------------------
// Flashcard progress: one row per peserta and volume (Postgres or the local store).

async function queryProgres(pesertaId, volume) {
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `SELECT acak, waktu, putaran FROM flashcard_progres WHERE peserta_id = $1 AND volume = $2`,
      [pesertaId, volume]
    );
    const r = res.rows[0];
    return r ? { acak: r.acak || [], waktu: r.waktu || {}, putaran: Number(r.putaran) || 0 } : null;
  }
  const r = (readLocalState().flashcardProgres || []).find((x) => x.pesertaId === pesertaId && x.volume === volume);
  return r ? { acak: r.acak, waktu: r.waktu || {}, putaran: r.putaran || 0 } : null;
}

async function queryProgresPeserta(pesertaId) {
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `SELECT volume, acak, waktu, putaran, updated_at AS "updatedAt" FROM flashcard_progres WHERE peserta_id = $1`,
      [pesertaId]
    );
    return res.rows.map((r) => ({ volume: r.volume, acak: r.acak || [], waktu: r.waktu || {}, putaran: Number(r.putaran) || 0, updatedAt: iso(r.updatedAt) }));
  }
  return (readLocalState().flashcardProgres || []).filter((x) => x.pesertaId === pesertaId);
}

async function simpanProgres(pesertaId, volume, { acak, waktu, putaran }) {
  if (getMode() === 'postgres') {
    await getPool().query(
      `INSERT INTO flashcard_progres (peserta_id, volume, acak, waktu, putaran, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (peserta_id, volume) DO UPDATE SET
         acak = EXCLUDED.acak, waktu = EXCLUDED.waktu, putaran = EXCLUDED.putaran, updated_at = NOW()`,
      [pesertaId, volume, JSON.stringify(acak), JSON.stringify(waktu), putaran]
    );
    return;
  }
  const db = readLocalState();
  db.flashcardProgres ||= [];
  const row = db.flashcardProgres.find((x) => x.pesertaId === pesertaId && x.volume === volume);
  const data = { acak, waktu, putaran, updatedAt: new Date().toISOString() };
  if (row) Object.assign(row, data);
  else db.flashcardProgres.push({ pesertaId, volume, ...data });
  saveLocalState();
}

// ---------------------------------------------------------------------------------------------------------------
// Practice sessions (latihan_sesi).

const SESI_KOLOM = `id, peserta_id AS "pesertaId", kelas_id AS "kelasId", jenis, mode, materi, materi_judul AS "materiJudul",
  jlpt, percobaan_id AS "percobaanId", jumlah_item AS "jumlahItem", item_selesai AS "itemSelesai", posisi,
  detik_aktif AS "detikAktif", skor, mulai_at AS "mulaiAt", terakhir_at AS "terakhirAt", selesai_at AS "selesaiAt"`;

function sesiView(r) {
  return {
    id: Number(r.id),
    pesertaId: Number(r.pesertaId),
    kelasId: r.kelasId == null ? null : Number(r.kelasId),
    jenis: r.jenis,
    mode: r.mode,
    materi: r.materi,
    materiJudul: r.materiJudul,
    jlpt: r.jlpt || null,
    percobaanId: r.percobaanId == null ? null : Number(r.percobaanId),
    jumlahItem: Number(r.jumlahItem) || 0,
    itemSelesai: Number(r.itemSelesai) || 0,
    posisi: r.posisi == null ? null : Number(r.posisi),
    detikAktif: Number(r.detikAktif) || 0,
    skor: r.skor == null ? null : Number(r.skor),
    mulaiAt: iso(r.mulaiAt),
    terakhirAt: iso(r.terakhirAt),
    selesaiAt: iso(r.selesaiAt),
  };
}

async function querySesiLatihan({ id = null, pesertaId = null, percobaanId = null, sejak = null, sebelum = null, terbuka = false, limit = null } = {}) {
  if (getMode() === 'postgres') {
    const where = [];
    const params = [];
    if (id !== null) where.push(`id = $${params.push(id)}`);
    if (pesertaId !== null) where.push(`peserta_id = $${params.push(pesertaId)}`);
    if (percobaanId !== null) where.push(`percobaan_id = $${params.push(percobaanId)}`);
    if (sejak !== null) where.push(`mulai_at >= $${params.push(sejak)}`);
    if (sebelum !== null) where.push(`mulai_at < $${params.push(sebelum)}`);
    if (terbuka) where.push(`selesai_at IS NULL AND terakhir_at >= NOW() - ($${params.push(DETIK_AKTIF)}::int * INTERVAL '1 second')`);
    const res = await getPool().query(
      `SELECT ${SESI_KOLOM} FROM latihan_sesi ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
       ORDER BY mulai_at DESC, id DESC ${limit ? `LIMIT ${Number(limit)}` : ''}`,
      params
    );
    return res.rows.map(sesiView);
  }
  const now = new Date();
  const rows = (readLocalState().latihanSesi || [])
    .filter(
      (s) =>
        (id === null || s.id === id) &&
        (pesertaId === null || s.pesertaId === pesertaId) &&
        (percobaanId === null || s.percobaanId === percobaanId) &&
        (sejak === null || s.mulaiAt >= sejak) &&
        (sebelum === null || s.mulaiAt < sebelum) &&
        (!terbuka || sedangAktif(s, now))
    )
    .map(sesiView)
    .sort((a, b) => b.mulaiAt.localeCompare(a.mulaiAt) || b.id - a.id);
  return limit ? rows.slice(0, limit) : rows;
}

async function kelasPeserta(pesertaId) {
  if (getMode() === 'postgres') {
    const res = await getPool().query(`SELECT kelas_id FROM peserta WHERE id = $1`, [pesertaId]);
    return res.rows[0]?.kelas_id ? Number(res.rows[0].kelas_id) : null;
  }
  return readLocalState().peserta.find((p) => p.id === pesertaId)?.kelasId ?? null;
}

async function insertSesiLatihan(d) {
  const kelasId = await kelasPeserta(d.pesertaId);
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `INSERT INTO latihan_sesi (peserta_id, kelas_id, jenis, mode, materi, materi_judul, jlpt, percobaan_id, jumlah_item)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING ${SESI_KOLOM}`,
      [d.pesertaId, kelasId, d.jenis, d.mode, d.materi, String(d.materiJudul).slice(0, 120), d.jlpt || null, d.percobaanId || null, d.jumlahItem || 0]
    );
    return sesiView(res.rows[0]);
  }
  const db = readLocalState();
  db.latihanSesi ||= [];
  db.seq.latihanSesi ||= db.latihanSesi.length + 1;
  const now = new Date().toISOString();
  const row = {
    id: db.seq.latihanSesi++,
    pesertaId: d.pesertaId,
    kelasId,
    jenis: d.jenis,
    mode: d.mode,
    materi: d.materi,
    materiJudul: String(d.materiJudul).slice(0, 120),
    jlpt: d.jlpt || null,
    percobaanId: d.percobaanId || null,
    jumlahItem: d.jumlahItem || 0,
    itemSelesai: 0,
    posisi: null,
    detikAktif: 0,
    skor: null,
    mulaiAt: now,
    terakhirAt: now,
    selesaiAt: null,
  };
  db.latihanSesi.push(row);
  saveLocalState();
  return sesiView(row);
}

const KOLOM_SESI = {
  itemSelesai: 'item_selesai',
  posisi: 'posisi',
  detikAktif: 'detik_aktif',
  skor: 'skor',
  terakhirAt: 'terakhir_at',
  selesaiAt: 'selesai_at',
};

async function patchSesiLatihan(id, changes) {
  const keys = Object.keys(changes).filter((k) => KOLOM_SESI[k]);
  if (!keys.length) return;
  if (getMode() === 'postgres') {
    await getPool().query(
      `UPDATE latihan_sesi SET ${keys.map((k, i) => `${KOLOM_SESI[k]} = $${i + 1}`).join(', ')} WHERE id = $${keys.length + 1}`,
      [...keys.map((k) => changes[k]), id]
    );
    return;
  }
  const row = (readLocalState().latihanSesi || []).find((s) => s.id === id);
  if (!row) return;
  for (const k of keys) row[k] = changes[k];
  saveLocalState();
}

// Name, photo and class of peserta, straight from the tables and the Mancation cache: the live monitor asks every
// few seconds, so no Mancation sync here.
async function infoPeserta(ids = null) {
  const pilih = ids ? new Set(ids.map(Number)) : null;
  let rows;
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `SELECT p.id, p.mancation_akun_id AS "akunId", p.kelas_id AS "kelasId", p.sumber, k.nama_kelas AS "namaKelas",
              c.nama, c.foto_versi::float8 AS "fotoVersi"
       FROM peserta p
       LEFT JOIN kelas k ON k.id = p.kelas_id AND k.deleted_at IS NULL
       LEFT JOIN mancation_peserta_cache c ON c.mancation_akun_id = p.mancation_akun_id
       ${pilih ? 'WHERE p.id = ANY($1::int[])' : ''}`,
      pilih ? [[...pilih]] : []
    );
    rows = res.rows;
  } else {
    const db = readLocalState();
    const kelas = new Map(db.kelas.filter((k) => !k.deletedAt).map((k) => [k.id, k]));
    const cache = new Map((db.mancationPesertaCache || []).map((c) => [Number(c.mancationAkunId), c]));
    rows = db.peserta
      .filter((p) => !pilih || pilih.has(p.id))
      .map((p) => {
        const c = cache.get(Number(p.mancationAkunId));
        return { id: p.id, akunId: p.mancationAkunId, kelasId: p.kelasId, sumber: p.sumber, namaKelas: kelas.get(p.kelasId)?.namaKelas, nama: c?.nama, fotoVersi: c?.fotoVersi };
      });
  }
  return new Map(
    rows.map((r) => [
      Number(r.id),
      {
        pesertaId: Number(r.id),
        nama: formatPersonName(r.nama) || `Peserta #${r.akunId}`,
        fotoUrl: mancationFotoUrl(r.akunId, r.fotoVersi),
        kelasId: r.kelasId ? Number(r.kelasId) : null,
        namaKelas: r.namaKelas || '',
        sumber: r.sumber,
      },
    ])
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Sessions started by Tes Online (practice papers and tests with a code).

/** A practice paper (kanji or dokkai) just handed to a peserta. */
export async function catatLatihanBaru(pesertaId, { jenis, materi, materiJudul, jlpt, jumlahItem }) {
  const sesi = await insertSesiLatihan({ pesertaId, jenis, mode: 'latihan', materi, materiJudul, jlpt, jumlahItem });
  return sesi.id;
}

/**
 * A test with a code: one session per attempt, opened again when the peserta comes back to it. detikAwal = the
 * active time already counted, so the app continues from there.
 */
export async function catatTesResmi(pesertaId, { percobaanId, jenis, materi, materiJudul, jlpt, jumlahItem }) {
  const [ada] = await querySesiLatihan({ percobaanId, pesertaId });
  if (ada && !ada.selesaiAt) {
    await patchSesiLatihan(ada.id, { terakhirAt: new Date().toISOString() });
    return { aktivitasId: ada.id, detikAwal: ada.detikAktif };
  }
  const sesi = await insertSesiLatihan({ pesertaId, jenis, mode: 'resmi', materi, materiJudul, jlpt, percobaanId, jumlahItem });
  return { aktivitasId: sesi.id, detikAwal: 0 };
}

async function sesiMilik(pesertaId, idRaw) {
  const id = Number(idRaw);
  if (!Number.isInteger(id) || id <= 0) return null;
  const [sesi] = await querySesiLatihan({ id, pesertaId });
  return sesi || null;
}

/** A paper handed in: its score, every item done, the session closed. */
export async function tutupLatihan(pesertaId, idRaw, { skor, itemSelesai, detikAktif = null }) {
  const sesi = await sesiMilik(pesertaId, idRaw);
  if (!sesi || sesi.selesaiAt) return;
  const now = new Date();
  const detak = terapkanDetak(sesi, { detikAktif, itemSelesai }, now);
  await patchSesiLatihan(sesi.id, { ...detak, skor, selesaiAt: now.toISOString() });
}

export async function tutupTesResmi(pesertaId, percobaanId, { skor, itemSelesai }) {
  const [sesi] = await querySesiLatihan({ percobaanId, pesertaId });
  if (sesi) await tutupLatihan(pesertaId, sesi.id, { skor, itemSelesai });
}

// ---------------------------------------------------------------------------------------------------------------
// Peserta portal.

/**
 * A signal from a running practice or test: { detikAktif, itemSelesai, posisi, selesai }. selesai = the peserta left
 * (the session closes without a score). A closed or someone else's session is ignored.
 */
export async function detakAktivitas(pesertaId, idRaw, body) {
  await ensureInitialized();
  const sesi = await sesiMilik(pesertaId, idRaw);
  if (!sesi || sesi.selesaiAt) return { ok: false };
  const now = new Date();
  await patchSesiLatihan(sesi.id, { ...terapkanDetak(sesi, body, now), ...(body?.selesai ? { selesaiAt: now.toISOString() } : {}) });
  return { ok: true };
}

function kartuBerurutan(kartu, urutan) {
  const byId = new Map(kartu.map((k) => [k.id, k]));
  return urutan.map((id) => byId.get(id));
}

/** The volumes with flashcards and how far this peserta is in each. */
export async function getFlashcardPortal(pesertaId) {
  await ensureInitialized();
  const progres = new Map((await queryProgresPeserta(pesertaId)).map((p) => [p.volume, p]));
  const volume = VOLUME_FLASHCARD.map((v) => {
    const ids = kartuVolume(v).map((k) => k.id);
    const p = progres.get(v);
    return { kode: v, jlpt: jlptKanji(v), judul: judulVolumeFlashcard(v), putaran: p?.putaran || 0, ...ringkasProgres(ids, p?.waktu) };
  });
  return { volume };
}

/**
 * Opens a volume: the stored random order (made now the first time), the cards sorted by their last display time,
 * and a new practice session for the monitor.
 */
export async function mulaiFlashcard(pesertaId, volume) {
  await ensureInitialized();
  const kartu = kartuVolume(volume);
  if (!kartu) throw new Error('INVALID_FLASHCARD');
  const ids = kartu.map((k) => k.id);
  const ada = await queryProgres(pesertaId, volume);
  const acak = lengkapiAcak(ada?.acak, ids);
  const waktu = bersihkanWaktu(ada?.waktu, ids);
  const putaran = ada?.putaran || 0;
  if (!ada || acak.length !== ada.acak.length || acak.some((id, i) => id !== ada.acak[i])) {
    await simpanProgres(pesertaId, volume, { acak, waktu, putaran });
  }
  const sesi = await insertSesiLatihan({
    pesertaId,
    jenis: 'flashcard',
    mode: 'latihan',
    materi: volume,
    materiJudul: judulVolumeFlashcard(volume),
    jlpt: jlptKanji(volume),
    jumlahItem: kartu.length,
  });
  return {
    aktivitasId: sesi.id,
    volume,
    judul: judulVolumeFlashcard(volume),
    putaran,
    progres: ringkasProgres(ids, waktu),
    waktu,
    kartu: kartuBerurutan(kartu, urutanKartu(acak, waktu)),
  };
}

/**
 * Saves display times ({ cardId: ms in this round }) and the session signal. putaranSelesai = the last card of the
 * round was swiped: the round count goes up and the cards come back in their new order.
 */
export async function simpanFlashcard(pesertaId, volume, body) {
  await ensureInitialized();
  const kartu = kartuVolume(volume);
  if (!kartu) throw new Error('INVALID_FLASHCARD');
  const ids = kartu.map((k) => k.id);
  const ada = await queryProgres(pesertaId, volume);
  if (!ada) throw new Error('INVALID_FLASHCARD');
  const acak = lengkapiAcak(ada.acak, ids);
  const waktu = { ...bersihkanWaktu(ada.waktu, ids), ...bersihkanWaktu(body?.waktu, ids) };
  const putaran = ada.putaran + (body?.putaranSelesai ? 1 : 0);
  await simpanProgres(pesertaId, volume, { acak, waktu, putaran });

  if (body?.aktivitasId) {
    await detakAktivitas(pesertaId, body.aktivitasId, {
      detikAktif: body.detikAktif,
      itemSelesai: body.kartuDilihat,
      posisi: body.posisi,
      selesai: body.selesai,
    });
  }
  return {
    putaran,
    progres: ringkasProgres(ids, waktu),
    ...(body?.putaranSelesai ? { waktu, kartu: kartuBerurutan(kartu, urutanKartu(acak, waktu)) } : {}),
  };
}

// ---------------------------------------------------------------------------------------------------------------
// Staff: live monitor and practice history (page monitor-latihan).


function denganPeserta(info, pesertaId) {
  return info.get(pesertaId) || { pesertaId, nama: `Peserta #${pesertaId}`, fotoUrl: null, kelasId: null, namaKelas: '' };
}

/** Everyone practising right now (last signal under a minute old), longest running first. */
export async function getMonitorLive() {
  await ensureInitialized();
  const sesi = await querySesiLatihan({ terbuka: true });
  const info = await infoPeserta([...new Set(sesi.map((s) => s.pesertaId))]);
  const now = new Date();
  return {
    serverTime: now.toISOString(),
    detikAktif: DETIK_AKTIF,
    items: sesi
      .map((s) => ({ ...s, ...denganPeserta(info, s.pesertaId), status: statusSesi(s, now) }))
      .sort((a, b) => a.mulaiAt.localeCompare(b.mulaiAt)),
  };
}

/**
 * Practice per peserta in a period (one chosen day, 7 days, 30 days or all time, WIB), most diligent first. Everyone in a class
 * is listed, also without practice; kelasId = only peserta now in that class.
 */
export async function getStatistikLatihan(query = {}) {
  await ensureInitialized();
  const { periode, tanggal, dari, sampai } = rentangPeriode(query);
  const kelasId = query.kelasId && query.kelasId !== 'all' ? Number(query.kelasId) : null;
  const [sesi, info, kelasData] = await Promise.all([querySesiLatihan({ sejak: dari, sebelum: sampai }), infoPeserta(), listKelas()]);
  const roster = [...info.values()].filter((p) => p.sumber === 'roster' && p.kelasId).map((p) => p.pesertaId);
  const rows = statistikLatihan(sesi, roster, { dari, sampai })
    .map((r) => ({ ...r, ...denganPeserta(info, r.pesertaId) }))
    .filter((r) => !kelasId || r.kelasId === kelasId)
    .map((r, i) => ({ ...r, peringkat: i + 1 }));
  return {
    periode,
    tanggal,
    dari,
    sampai,
    items: rows,
    kelasOptions: kelasData.items.map((k) => ({ id: Number(k.id), namaKelas: k.namaKelas, status: k.status })),
  };
}

/** One peserta: totals for the period, recent sessions and flashcard progress with the hardest cards. */
export async function getRiwayatLatihanPeserta(pesertaIdRaw, query = {}) {
  await ensureInitialized();
  const pesertaId = Number(pesertaIdRaw);
  const info = await infoPeserta([pesertaId]);
  if (!info.has(pesertaId)) throw new Error('NOT_FOUND');
  const { periode, tanggal, dari, sampai } = rentangPeriode(query);
  const [semua, progres] = await Promise.all([
    querySesiLatihan({ pesertaId, sejak: dari, sebelum: sampai }),
    queryProgresPeserta(pesertaId),
  ]);
  const now = new Date();
  const [ringkasan] = statistikLatihan(semua, [pesertaId], { dari, sampai });
  const flashcard = progres
    .map((p) => {
      const kartu = kartuVolume(p.volume);
      if (!kartu) return null;
      const byId = new Map(kartu.map((k) => [k.id, k]));
      const waktu = bersihkanWaktu(p.waktu, [...byId.keys()]);
      const tersulit = urutanKartu(Object.keys(waktu), waktu)
        .slice(0, 8)
        .map((id) => ({ kanji: byId.get(id).kanji, bacaan: byId.get(id).bacaan || byId.get(id).kun?.[0] || byId.get(id).on?.[0] || '', ms: waktu[id] }));
      return { volume: p.volume, judul: judulVolumeFlashcard(p.volume), putaran: p.putaran, updatedAt: p.updatedAt, ...ringkasProgres([...byId.keys()], waktu), tersulit };
    })
    .filter(Boolean)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  return {
    peserta: info.get(pesertaId),
    periode,
    tanggal,
    ringkasan,
    sesi: semua.slice(0, 200).map((s) => ({ ...s, status: statusSesi(s, now) })),
    flashcard,
  };
}
