/**
 * Kanji Adventure progress repository.
 * Sama seperti repo lain: Postgres bila DATABASE_URL valid, selain itu state JSON lokal.
 * Client tidak pernah menulis itemIds, dikuasai, bosses, maupun selesai secara langsung.
 */
import { ensureInitialized, getMode, getPool, readLocalState, saveLocalState } from './engine.js';
import { catatLatihanBaru } from './latihanRepo.js';
import * as domain from '../domain/kanjiAdventure.js';

const KOLOM = `peserta_id AS "pesertaId", materi, item_ids AS "itemIds", dikuasai, bosses,
  boss_ronde, chunk_terbuka, selesai, perlu_perhatian, riwayat, updated_at AS "updatedAt"`;
const MAKS_RIWAYAT = domain.MAKS_RIWAYAT ?? 20;
const URUTAN_VOLUME = domain.URUTAN_VOLUME ?? [];

const list = (v) => (Array.isArray(v) ? [...v] : []);
const iso = (v) => (v ? new Date(v).toISOString() : null);

async function tanpaGagal(fn, cadangan) {
  try {
    return await fn();
  } catch (err) {
    console.error('Kanji Adventure repo:', err.message);
    return cadangan;
  }
}

function progresView(r) {
  if (!r) return null;
  return {
    pesertaId: Number(r.pesertaId),
    materi: r.materi,
    itemIds: list(r.itemIds),
    dikuasai: list(r.dikuasai),
    bosses: list(r.bosses),
    boss_ronde: Number(r.boss_ronde) || 0,
    chunk_terbuka: Number(r.chunk_terbuka) || 0,
    selesai: Boolean(r.selesai),
    perlu_perhatian: Boolean(r.perlu_perhatian),
    riwayat: list(r.riwayat).slice(-MAKS_RIWAYAT),
    updatedAt: iso(r.updatedAt),
  };
}

function urutanMateri(a, b) {
  const ia = URUTAN_VOLUME.indexOf(a.materi);
  const ib = URUTAN_VOLUME.indexOf(b.materi);
  return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
}

export async function bacaProgresAdventure(pesertaId, materi) {
  await ensureInitialized();
  return tanpaGagal(async () => {
    if (getMode() === 'postgres') {
      const { rows } = await getPool().query(
        `SELECT ${KOLOM} FROM kanji_adventure_progres WHERE peserta_id = $1 AND materi = $2`,
        [pesertaId, materi],
      );
      return progresView(rows[0]);
    }
    const baris = (readLocalState().kanjiAdventureProgres || []).find(
      (p) => Number(p.pesertaId) === Number(pesertaId) && p.materi === materi,
    );
    return progresView(baris);
  }, null);
}

export async function daftarProgresAdventure(pesertaId) {
  await ensureInitialized();
  return tanpaGagal(async () => {
    let semua;
    if (getMode() === 'postgres') {
      const { rows } = await getPool().query(
        `SELECT ${KOLOM} FROM kanji_adventure_progres WHERE peserta_id = $1`,
        [pesertaId],
      );
      semua = rows.map(progresView);
    } else {
      semua = (readLocalState().kanjiAdventureProgres || [])
        .filter((p) => Number(p.pesertaId) === Number(pesertaId))
        .map(progresView);
    }
    return semua.sort(urutanMateri);
  }, []);
}

export async function simpanProgresAdventure(pesertaId, materi, progres) {
  await ensureInitialized();
  return tanpaGagal(async () => {
    const data = progresView({
      pesertaId,
      materi,
      itemIds: progres?.itemIds,
      dikuasai: progres?.dikuasai,
      bosses: progres?.bosses,
      boss_ronde: progres?.boss_ronde,
      chunk_terbuka: progres?.chunk_terbuka,
      selesai: progres?.selesai,
      perlu_perhatian: progres?.perlu_perhatian,
      riwayat: progres?.riwayat,
      updatedAt: new Date().toISOString(),
    });
    if (getMode() === 'postgres') {
      await getPool().query(
        `INSERT INTO kanji_adventure_progres
           (peserta_id, materi, item_ids, dikuasai, bosses, boss_ronde,
            chunk_terbuka, selesai, perlu_perhatian, riwayat, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
         ON CONFLICT (peserta_id, materi) DO UPDATE SET
           item_ids = EXCLUDED.item_ids,
           dikuasai = EXCLUDED.dikuasai,
           bosses = EXCLUDED.bosses,
           boss_ronde = EXCLUDED.boss_ronde,
           chunk_terbuka = EXCLUDED.chunk_terbuka,
           selesai = EXCLUDED.selesai,
           perlu_perhatian = EXCLUDED.perlu_perhatian,
           riwayat = EXCLUDED.riwayat,
           updated_at = NOW()`,
        [data.pesertaId, data.materi, JSON.stringify(data.itemIds), JSON.stringify(data.dikuasai),
          JSON.stringify(data.bosses), data.boss_ronde, data.chunk_terbuka, data.selesai,
          data.perlu_perhatian, JSON.stringify(data.riwayat)],
      );
      return data;
    }
    const db = readLocalState();
    db.kanjiAdventureProgres ||= [];
    const indeks = db.kanjiAdventureProgres.findIndex(
      (p) => Number(p.pesertaId) === data.pesertaId && p.materi === data.materi,
    );
    if (indeks >= 0) db.kanjiAdventureProgres[indeks] = data;
    else db.kanjiAdventureProgres.push(data);
    saveLocalState();
    return data;
  }, null);
}

export async function pastikanProgresAdventure(pesertaId, materi, itemIds) {
  await ensureInitialized();
  return tanpaGagal(async () => {
    const ada = await bacaProgresAdventure(pesertaId, materi);
    if (ada?.itemIds?.length) return ada;
    return simpanProgresAdventure(pesertaId, materi, {
      itemIds: list(itemIds),
      dikuasai: [],
      bosses: [],
      boss_ronde: 0,
      chunk_terbuka: 0,
      selesai: false,
      perlu_perhatian: false,
      riwayat: [],
    });
  }, null);
}

export async function tambahSesiAdventure(pesertaId, { materi, judul, jlpt = null, jumlahItem = 0 } = {}) {
  await ensureInitialized();
  return tanpaGagal(
    () => catatLatihanBaru(pesertaId, {
      jenis: 'kanji',
      materi: 'adventure',
      materiJudul: `Kanji Adventure · ${judul || materi}`,
      jlpt,
      jumlahItem: Number(jumlahItem) || 0,
    }),
    null,
  );
}
