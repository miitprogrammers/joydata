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
const KOLOM_SESI = `id, peserta_id AS "pesertaId", materi, mode, chunk_index AS "chunkIndex", ronde,
  aktivitas_id AS "aktivitasId", item_ids AS "itemIds", soal,
  dibuat_pada AS "dibuatPada", kedaluwarsa_pada AS "kedaluwarsaPada"`;
const MAKS_RIWAYAT = domain.MAKS_RIWAYAT ?? 20;
const URUTAN_VOLUME = domain.URUTAN_VOLUME ?? [];
const SESI_ADVENTURE_MAX_MS = 30 * 60 * 1000;

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
    bosses: domain.daftarBossAdventure({ bosses: r.bosses }),
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

function sesiView(r) {
  if (!r) return null;
  return {
    id: r.id,
    pesertaId: Number(r.pesertaId),
    materi: r.materi,
    mode: r.mode,
    chunkIndex: Number(r.chunkIndex),
    ronde: Number(r.ronde) || 1,
    aktivitasId: r.aktivitasId == null ? null : Number(r.aktivitasId),
    itemIds: list(r.itemIds),
    soal: Array.isArray(r.soal) ? r.soal : [],
    dibuatPada: iso(r.dibuatPada),
    kedaluwarsaPada: iso(r.kedaluwarsaPada),
  };
}

function masihBerlaku(sesi, sekarang = Date.now()) {
  return Boolean(sesi?.kedaluwarsaPada) && new Date(sesi.kedaluwarsaPada).getTime() > sekarang;
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
    const kosong = {
      itemIds: list(itemIds),
      dikuasai: [],
      bosses: [],
      boss_ronde: 0,
      chunk_terbuka: 0,
      selesai: false,
      perlu_perhatian: false,
      riwayat: [],
    };
    if (getMode() === 'postgres') {
      // Never overwrite: a failed read must not be mistaken for "no row" and wipe saved progress.
      await getPool().query(
        `INSERT INTO kanji_adventure_progres
           (peserta_id, materi, item_ids, dikuasai, bosses, boss_ronde,
            chunk_terbuka, selesai, perlu_perhatian, riwayat, updated_at)
         VALUES ($1, $2, $3, '[]', '[]', 0, 0, false, false, '[]', NOW())
         ON CONFLICT (peserta_id, materi) DO UPDATE
           SET item_ids = EXCLUDED.item_ids, updated_at = NOW()
           WHERE jsonb_array_length(kanji_adventure_progres.item_ids) = 0`,
        [pesertaId, materi, JSON.stringify(kosong.itemIds)],
      );
      const { rows } = await getPool().query(
        `SELECT ${KOLOM} FROM kanji_adventure_progres WHERE peserta_id = $1 AND materi = $2`,
        [pesertaId, materi],
      );
      return progresView(rows[0]);
    }
    const baris = (readLocalState().kanjiAdventureProgres || []).find(
      (p) => Number(p.pesertaId) === Number(pesertaId) && p.materi === materi,
    );
    if (baris) {
      // Repair an empty snapshot only; every other field stays as saved.
      if (!list(baris.itemIds).length && kosong.itemIds.length) {
        baris.itemIds = kosong.itemIds;
        saveLocalState();
      }
      return progresView(baris);
    }
    return simpanProgresAdventure(pesertaId, materi, kosong);
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

/**
 * The paper handed to one peserta, stored so grading survives a restart or another server instance.
 * The answer key stays on the server; only this row carries it.
 */
export async function simpanSesiAdventure({
  id,
  pesertaId,
  materi,
  mode,
  chunkIndex,
  ronde = 1,
  aktivitasId = null,
  itemIds = [],
  soal = [],
  kedaluwarsaPada = null,
}) {
  await ensureInitialized();
  return tanpaGagal(async () => {
    const data = sesiView({
      id,
      pesertaId,
      materi,
      mode,
      chunkIndex,
      ronde,
      aktivitasId,
      itemIds,
      soal,
      dibuatPada: new Date().toISOString(),
      kedaluwarsaPada: kedaluwarsaPada || new Date(Date.now() + SESI_ADVENTURE_MAX_MS).toISOString(),
    });
    if (getMode() === 'postgres') {
      await getPool().query(`DELETE FROM kanji_adventure_sesi WHERE kedaluwarsa_pada < NOW()`);
      await getPool().query(
        `INSERT INTO kanji_adventure_sesi
           (id, peserta_id, materi, mode, chunk_index, ronde, aktivitas_id, item_ids, soal, kedaluwarsa_pada)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [data.id, data.pesertaId, data.materi, data.mode, data.chunkIndex, data.ronde,
          data.aktivitasId, JSON.stringify(data.itemIds), JSON.stringify(data.soal), data.kedaluwarsaPada],
      );
      return data;
    }
    const db = readLocalState();
    db.kanjiAdventureSesi ||= [];
    const sekarang = Date.now();
    db.kanjiAdventureSesi = db.kanjiAdventureSesi.filter(
      (s) => masihBerlaku(sesiView(s), sekarang),
    );
    db.kanjiAdventureSesi.push(data);
    saveLocalState();
    return data;
  }, null);
}

export async function bacaSesiAdventure(id, pesertaId, { sekarang = Date.now() } = {}) {
  await ensureInitialized();
  return tanpaGagal(async () => {
    let sesi;
    if (getMode() === 'postgres') {
      const { rows } = await getPool().query(
        `SELECT ${KOLOM_SESI} FROM kanji_adventure_sesi
         WHERE id = $1 AND peserta_id = $2 AND kedaluwarsa_pada > NOW()`,
        [id, pesertaId],
      );
      sesi = sesiView(rows[0]);
    } else {
      const baris = (readLocalState().kanjiAdventureSesi || []).find(
        (s) => s.id === id && Number(s.pesertaId) === Number(pesertaId),
      );
      sesi = sesiView(baris);
    }
    if (!sesi) return null;
    if (!masihBerlaku(sesi, sekarang)) {
      await hapusSesiAdventure(sesi.id, pesertaId);
      return null;
    }
    return sesi;
  }, null);
}

/**
 * Grade one paper atomically. `evaluasi(sesi, progres, semuaProgres)` is a pure callback that runs the gates and
 * returns `{ hasil, progresBaru }`; if it throws, nothing is written and the paper is kept. Postgres: one
 * transaction (claim the paper, lock the progress row, update). Local mode: no await between read and write.
 * Errors are not swallowed: a transient failure rolls back and the paper survives for a retry.
 */
export async function nilaiSesiAdventureAtomik(pesertaId, sesiId, evaluasi) {
  await ensureInitialized();
  let galatEvaluasi = null;
  const jalankan = (sesi, progres, semua) => {
    try {
      return evaluasi(sesi, progres, semua);
    } catch (err) {
      galatEvaluasi = err;
      throw err;
    }
  };
  const bungkus = (err) => {
    if (err === galatEvaluasi || err.message === 'SESI_TIDAK_ADA') return err;
    console.error('Kanji Adventure repo:', err.message);
    return new Error('GAGAL_SESI_ADVENTURE');
  };

  try {
    if (getMode() === 'postgres') {
      const client = await getPool().connect();
      try {
        await client.query('BEGIN');
        const { rows: sesiRows } = await client.query(
          `DELETE FROM kanji_adventure_sesi WHERE id = $1 AND peserta_id = $2 AND kedaluwarsa_pada > NOW()
           RETURNING ${KOLOM_SESI}`,
          [sesiId, pesertaId],
        );
        const sesi = sesiView(sesiRows[0]);
        if (!sesi) throw new Error('SESI_TIDAK_ADA');
        const { rows: kunci } = await client.query(
          `SELECT ${KOLOM} FROM kanji_adventure_progres WHERE peserta_id = $1 AND materi = $2 FOR UPDATE`,
          [pesertaId, sesi.materi],
        );
        const progres = progresView(kunci[0]);
        if (!progres) throw new Error('SESI_TIDAK_ADA');
        const { rows: semuaRows } = await client.query(
          `SELECT ${KOLOM} FROM kanji_adventure_progres WHERE peserta_id = $1`,
          [pesertaId],
        );
        const hasil = jalankan(sesi, progres, semuaRows.map(progresView).sort(urutanMateri));
        const p = progresView({ ...hasil.progresBaru, pesertaId, materi: sesi.materi });
        await client.query(
          `UPDATE kanji_adventure_progres SET item_ids = $3, dikuasai = $4, bosses = $5, boss_ronde = $6,
             chunk_terbuka = $7, selesai = $8, perlu_perhatian = $9, riwayat = $10, updated_at = NOW()
           WHERE peserta_id = $1 AND materi = $2`,
          [pesertaId, sesi.materi, JSON.stringify(p.itemIds), JSON.stringify(p.dikuasai), JSON.stringify(p.bosses),
            p.boss_ronde, p.chunk_terbuka, p.selesai, p.perlu_perhatian, JSON.stringify(p.riwayat)],
        );
        await client.query('COMMIT');
        return { sesi, progres, ...hasil };
      } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        throw err;
      } finally {
        client.release();
      }
    }

    // Local mode: no await between read and write, so another request cannot interleave.
    const db = readLocalState();
    const sesi = sesiView((db.kanjiAdventureSesi || []).find(
      (s) => s.id === sesiId && Number(s.pesertaId) === Number(pesertaId),
    ));
    if (!sesi || !masihBerlaku(sesi)) throw new Error('SESI_TIDAK_ADA');
    const semua = (db.kanjiAdventureProgres || [])
      .filter((p) => Number(p.pesertaId) === Number(pesertaId))
      .map(progresView)
      .sort(urutanMateri);
    const progres = semua.find((p) => p.materi === sesi.materi);
    if (!progres) throw new Error('SESI_TIDAK_ADA');
    const hasil = jalankan(sesi, progres, semua);
    const p = progresView({
      ...hasil.progresBaru, pesertaId, materi: sesi.materi, updatedAt: new Date().toISOString(),
    });
    const indeks = db.kanjiAdventureProgres.findIndex(
      (x) => Number(x.pesertaId) === Number(pesertaId) && x.materi === sesi.materi,
    );
    db.kanjiAdventureProgres[indeks] = p;
    db.kanjiAdventureSesi = db.kanjiAdventureSesi.filter((s) => s.id !== sesiId);
    saveLocalState();
    return { sesi, progres, ...hasil };
  } catch (err) {
    throw bungkus(err);
  }
}

export async function hapusSesiAdventure(id, pesertaId = null) {
  await ensureInitialized();
  return tanpaGagal(async () => {
    if (getMode() === 'postgres') {
      const params = pesertaId == null ? [id] : [id, pesertaId];
      const filter = pesertaId == null ? 'id = $1' : 'id = $1 AND peserta_id = $2';
      await getPool().query(`DELETE FROM kanji_adventure_sesi WHERE ${filter}`, params);
      return true;
    }
    const db = readLocalState();
    const sebelum = (db.kanjiAdventureSesi || []).length;
    db.kanjiAdventureSesi = (db.kanjiAdventureSesi || []).filter(
      (s) => s.id !== id || (pesertaId != null && Number(s.pesertaId) !== Number(pesertaId)),
    );
    if (db.kanjiAdventureSesi.length !== sebelum) saveLocalState();
    return db.kanjiAdventureSesi.length !== sebelum;
  }, false);
}
