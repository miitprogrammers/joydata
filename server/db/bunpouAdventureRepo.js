/**
 * Bunpou Adventure progress repository.
 * Sama seperti Kanji Adventure: Postgres bila DATABASE_URL valid, selain itu state JSON lokal.
 * Client tidak pernah menulis tahap, benar, dikuasai, bosses, maupun selesai secara langsung.
 */
import { ensureInitialized, getMode, getPool, readLocalState, saveLocalState } from './engine.js';
import { catatLatihanBaru } from './latihanRepo.js';
import * as domain from '../domain/bunpouAdventure.js';

const KOLOM = `peserta_id AS "pesertaId", volume, tahap, tahap_terbuka, benar, dikuasai, bosses, salah, jejak,
  bos_ronde, selesai, perlu_perhatian, riwayat, updated_at AS "updatedAt"`;
const KOLOM_SESI = `id, peserta_id AS "pesertaId", volume, mode, tahap_index AS "tahapIndex", ronde,
  aktivitas_id AS "aktivitasId", pola_ids AS "polaIds", soal,
  dibuat_pada AS "dibuatPada", kedaluwarsa_pada AS "kedaluwarsaPada"`;
const SESI_BUNPOU_MAX_MS = 30 * 60 * 1000;

const list = (v) => (Array.isArray(v) ? [...v] : []);
const objek = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? { ...v } : {});
const iso = (v) => (v ? new Date(v).toISOString() : null);

async function tanpaGagal(fn, cadangan) {
  try {
    return await fn();
  } catch (err) {
    console.error('Bunpou Adventure repo:', err.message);
    return cadangan;
  }
}

/** Bentuk progres yang sama untuk baris Postgres maupun state lokal. */
export function progresBunpouView(r) {
  if (!r) return null;
  return {
    pesertaId: Number(r.pesertaId),
    volume: r.volume,
    tahap: list(r.tahap),
    tahap_terbuka: Number(r.tahap_terbuka) || 0,
    benar: objek(r.benar),
    dikuasai: list(r.dikuasai),
    bosses: domain.daftarBossBunpou({ bosses: r.bosses }),
    salah: objek(r.salah),
    jejak: objek(r.jejak),
    bos_ronde: Number(r.bos_ronde) || 0,
    selesai: Boolean(r.selesai),
    perlu_perhatian: Boolean(r.perlu_perhatian),
    riwayat: list(r.riwayat).slice(-domain.MAKS_RIWAYAT),
    updatedAt: iso(r.updatedAt),
  };
}

export function sesiBunpouView(r) {
  if (!r) return null;
  return {
    id: r.id,
    pesertaId: Number(r.pesertaId),
    volume: r.volume,
    mode: r.mode,
    tahapIndex: Number(r.tahapIndex),
    ronde: Number(r.ronde) || 0,
    aktivitasId: r.aktivitasId == null ? null : Number(r.aktivitasId),
    polaIds: list(r.polaIds),
    soal: list(r.soal),
    dibuatPada: iso(r.dibuatPada),
    kedaluwarsaPada: iso(r.kedaluwarsaPada),
  };
}

const urutanVolume = (a, b) => {
  const ia = domain.URUTAN_VOLUME_BUNPOU.indexOf(a.volume);
  const ib = domain.URUTAN_VOLUME_BUNPOU.indexOf(b.volume);
  return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
};

function masihBerlaku(sesi, sekarang = Date.now()) {
  return Boolean(sesi?.kedaluwarsaPada) && new Date(sesi.kedaluwarsaPada).getTime() > sekarang;
}

export async function bacaProgresBunpou(pesertaId, volume) {
  await ensureInitialized();
  return tanpaGagal(async () => {
    if (getMode() === 'postgres') {
      const { rows } = await getPool().query(
        `SELECT ${KOLOM} FROM bunpou_adventure_progres WHERE peserta_id = $1 AND volume = $2`,
        [pesertaId, volume],
      );
      return progresBunpouView(rows[0]);
    }
    const baris = (readLocalState().bunpouAdventureProgres || []).find(
      (p) => Number(p.pesertaId) === Number(pesertaId) && p.volume === volume,
    );
    return progresBunpouView(baris);
  }, null);
}

async function bacaDaftar(pesertaId) {
  let semua;
  if (getMode() === 'postgres') {
    const { rows } = await getPool().query(
      `SELECT ${KOLOM} FROM bunpou_adventure_progres WHERE peserta_id = $1`,
      [pesertaId],
    );
    semua = rows.map(progresBunpouView);
  } else {
    semua = (readLocalState().bunpouAdventureProgres || [])
      .filter((p) => Number(p.pesertaId) === Number(pesertaId))
      .map(progresBunpouView);
  }
  return semua.sort(urutanVolume);
}

/** Forgiving read for display routes: a failure shows as no progress. */
export async function daftarProgresBunpou(pesertaId) {
  await ensureInitialized();
  return tanpaGagal(() => bacaDaftar(pesertaId), []);
}

export async function simpanProgresBunpou(pesertaId, volume, progres) {
  await ensureInitialized();
  return tanpaGagal(async () => {
    const data = progresBunpouView({ ...progres, pesertaId, volume, updatedAt: new Date().toISOString() });
    if (getMode() === 'postgres') {
      await getPool().query(
        `INSERT INTO bunpou_adventure_progres
           (peserta_id, volume, tahap, tahap_terbuka, benar, dikuasai, bosses, salah, jejak,
            bos_ronde, selesai, perlu_perhatian, riwayat, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
         ON CONFLICT (peserta_id, volume) DO UPDATE SET
           tahap = EXCLUDED.tahap,
           tahap_terbuka = EXCLUDED.tahap_terbuka,
           benar = EXCLUDED.benar,
           dikuasai = EXCLUDED.dikuasai,
           bosses = EXCLUDED.bosses,
           salah = EXCLUDED.salah,
           jejak = EXCLUDED.jejak,
           bos_ronde = EXCLUDED.bos_ronde,
           selesai = EXCLUDED.selesai,
           perlu_perhatian = EXCLUDED.perlu_perhatian,
           riwayat = EXCLUDED.riwayat,
           updated_at = NOW()`,
        [data.pesertaId, data.volume, JSON.stringify(data.tahap), data.tahap_terbuka, JSON.stringify(data.benar),
          JSON.stringify(data.dikuasai), JSON.stringify(data.bosses), JSON.stringify(data.salah),
          JSON.stringify(data.jejak), data.bos_ronde, data.selesai, data.perlu_perhatian,
          JSON.stringify(data.riwayat)],
      );
      return data;
    }
    const db = readLocalState();
    db.bunpouAdventureProgres ||= [];
    const indeks = db.bunpouAdventureProgres.findIndex(
      (p) => Number(p.pesertaId) === data.pesertaId && p.volume === data.volume,
    );
    if (indeks >= 0) db.bunpouAdventureProgres[indeks] = data;
    else db.bunpouAdventureProgres.push(data);
    saveLocalState();
    return data;
  }, null);
}

/** Snapshot tahap dibuat sekali, saat volume pertama dibuka; pemanggilan berikutnya tidak mengubahnya. */
export async function pastikanProgresBunpou(pesertaId, volume, tahap) {
  await ensureInitialized();
  return tanpaGagal(async () => {
    if (getMode() === 'postgres') {
      // DO NOTHING, never DO UPDATE: a failed read must not be able to wipe saved progress.
      const awal = progresBunpouView({ ...domain.progresAwal(volume, list(tahap)), pesertaId });
      await getPool().query(
        `INSERT INTO bunpou_adventure_progres (peserta_id, volume, tahap)
         VALUES ($1, $2, $3) ON CONFLICT (peserta_id, volume) DO NOTHING`,
        [awal.pesertaId, volume, JSON.stringify(awal.tahap)],
      );
      const { rows } = await getPool().query(
        `SELECT ${KOLOM} FROM bunpou_adventure_progres WHERE peserta_id = $1 AND volume = $2`,
        [pesertaId, volume],
      );
      return progresBunpouView(rows[0]);
    }
    const db = readLocalState();
    db.bunpouAdventureProgres ||= [];
    const ada = db.bunpouAdventureProgres.find(
      (p) => Number(p.pesertaId) === Number(pesertaId) && p.volume === volume,
    );
    if (ada) return progresBunpouView(ada);
    const data = progresBunpouView({
      ...domain.progresAwal(volume, list(tahap)), pesertaId, updatedAt: new Date().toISOString(),
    });
    db.bunpouAdventureProgres.push(data);
    saveLocalState();
    return data;
  }, null);
}

/** Like daftarProgresBunpou but a read failure propagates (GAGAL_SESI_BUNPOU): gates must not read an outage as "locked". */
export async function daftarProgresBunpouKetat(pesertaId) {
  try {
    await ensureInitialized();
    return await bacaDaftar(pesertaId);
  } catch (err) {
    console.error('Bunpou Adventure repo:', err.message);
    throw new Error('GAGAL_SESI_BUNPOU');
  }
}

/**
 * Grade one paper atomically. The paper is consumed, the progress row locked, `evaluasi(sesi, progres, semuaProgres)`
 * (pure; may throw gate errors) decides the new progress, and everything commits together. A throw anywhere leaves
 * both the paper and the progress untouched. Returns { sesi, progres, ...whatever evaluasi returned (needs progresBaru) }.
 */
export async function nilaiSesiBunpouAtomik(pesertaId, sesiId, evaluasi) {
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
    console.error('Bunpou Adventure repo:', err.message);
    return new Error('GAGAL_SESI_BUNPOU');
  };

  if (getMode() === 'postgres') {
    let client = null;
    try {
      client = await getPool().connect();
      await client.query('BEGIN');
      const { rows: sesiRows } = await client.query(
        `DELETE FROM bunpou_adventure_sesi WHERE id = $1 AND peserta_id = $2 AND kedaluwarsa_pada > NOW()
         RETURNING ${KOLOM_SESI}`,
        [sesiId, pesertaId],
      );
      const sesi = sesiBunpouView(sesiRows[0]);
      if (!sesi) throw new Error('SESI_TIDAK_ADA');
      const { rows: kunci } = await client.query(
        `SELECT ${KOLOM} FROM bunpou_adventure_progres WHERE peserta_id = $1 AND volume = $2 FOR UPDATE`,
        [pesertaId, sesi.volume],
      );
      const progres = progresBunpouView(kunci[0]);
      if (!progres) throw new Error('SESI_TIDAK_ADA');
      const { rows: semuaRows } = await client.query(
        `SELECT ${KOLOM} FROM bunpou_adventure_progres WHERE peserta_id = $1`,
        [pesertaId],
      );
      const hasil = jalankan(sesi, progres, semuaRows.map(progresBunpouView).sort(urutanVolume));
      const b = progresBunpouView({ ...hasil.progresBaru, pesertaId, volume: sesi.volume });
      await client.query(
        `UPDATE bunpou_adventure_progres SET tahap = $3, tahap_terbuka = $4, benar = $5, dikuasai = $6,
           bosses = $7, salah = $8, jejak = $9, bos_ronde = $10, selesai = $11, perlu_perhatian = $12,
           riwayat = $13, updated_at = NOW()
         WHERE peserta_id = $1 AND volume = $2`,
        [pesertaId, sesi.volume, JSON.stringify(b.tahap), b.tahap_terbuka, JSON.stringify(b.benar),
          JSON.stringify(b.dikuasai), JSON.stringify(b.bosses), JSON.stringify(b.salah), JSON.stringify(b.jejak),
          b.bos_ronde, b.selesai, b.perlu_perhatian, JSON.stringify(b.riwayat)],
      );
      await client.query('COMMIT');
      return { sesi, progres, ...hasil };
    } catch (err) {
      await client?.query('ROLLBACK').catch(() => {});
      throw bungkus(err);
    } finally {
      client?.release();
    }
  }

  // Local mode: no await between read and write, so another request cannot interleave.
  try {
    const db = readLocalState();
    const sekarang = Date.now();
    const sesi = sesiBunpouView((db.bunpouAdventureSesi || []).find(
      (s) => s.id === sesiId && Number(s.pesertaId) === Number(pesertaId),
    ));
    if (!sesi || !masihBerlaku(sesi, sekarang)) throw new Error('SESI_TIDAK_ADA');
    const semua = (db.bunpouAdventureProgres || [])
      .filter((p) => Number(p.pesertaId) === Number(pesertaId))
      .map(progresBunpouView)
      .sort(urutanVolume);
    const progres = semua.find((p) => p.volume === sesi.volume);
    if (!progres) throw new Error('SESI_TIDAK_ADA');
    const hasil = jalankan(sesi, progres, semua);
    const b = progresBunpouView({
      ...hasil.progresBaru, pesertaId, volume: sesi.volume, updatedAt: new Date().toISOString(),
    });
    const indeks = db.bunpouAdventureProgres.findIndex(
      (p) => Number(p.pesertaId) === Number(pesertaId) && p.volume === sesi.volume,
    );
    db.bunpouAdventureProgres[indeks] = b;
    db.bunpouAdventureSesi = db.bunpouAdventureSesi.filter((s) => s.id !== sesiId);
    saveLocalState();
    return { sesi, progres, ...hasil };
  } catch (err) {
    throw bungkus(err);
  }
}

export async function tambahSesiBunpou(pesertaId, { volume, judul, jlpt = null, jumlahItem = 0 } = {}) {
  await ensureInitialized();
  return tanpaGagal(
    () => catatLatihanBaru(pesertaId, {
      jenis: 'bunpou',
      materi: 'adventure',
      materiJudul: `Bunpou Adventure · ${judul || volume}`,
      jlpt,
      jumlahItem: Number(jumlahItem) || 0,
    }),
    null,
  );
}

/**
 * Kertas yang diberikan ke satu peserta, disimpan agar penilaian bertahan walau server restart atau pindah
 * instance. Kunci jawaban hanya ada di baris ini.
 */
export async function simpanSesiBunpou({
  id, pesertaId, volume, mode, tahapIndex, ronde = 0, aktivitasId = null, polaIds = [], soal = [], kedaluwarsaPada = null,
}) {
  await ensureInitialized();
  return tanpaGagal(async () => {
    const data = sesiBunpouView({
      id,
      pesertaId,
      volume,
      mode,
      tahapIndex,
      ronde,
      aktivitasId,
      polaIds,
      soal,
      dibuatPada: new Date().toISOString(),
      kedaluwarsaPada: kedaluwarsaPada || new Date(Date.now() + SESI_BUNPOU_MAX_MS).toISOString(),
    });
    if (getMode() === 'postgres') {
      await getPool().query(`DELETE FROM bunpou_adventure_sesi WHERE kedaluwarsa_pada < NOW()`);
      await getPool().query(
        `INSERT INTO bunpou_adventure_sesi
           (id, peserta_id, volume, mode, tahap_index, ronde, aktivitas_id, pola_ids, soal, kedaluwarsa_pada)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [data.id, data.pesertaId, data.volume, data.mode, data.tahapIndex, data.ronde,
          data.aktivitasId, JSON.stringify(data.polaIds), JSON.stringify(data.soal), data.kedaluwarsaPada],
      );
      return data;
    }
    const db = readLocalState();
    db.bunpouAdventureSesi ||= [];
    const sekarang = Date.now();
    db.bunpouAdventureSesi = db.bunpouAdventureSesi.filter((s) => masihBerlaku(sesiBunpouView(s), sekarang));
    db.bunpouAdventureSesi.push(data);
    saveLocalState();
    return data;
  }, null);
}

export async function bacaSesiBunpou(id, pesertaId, { sekarang = Date.now() } = {}) {
  await ensureInitialized();
  return tanpaGagal(async () => {
    let sesi;
    if (getMode() === 'postgres') {
      const { rows } = await getPool().query(
        `SELECT ${KOLOM_SESI} FROM bunpou_adventure_sesi
         WHERE id = $1 AND peserta_id = $2 AND kedaluwarsa_pada > NOW()`,
        [id, pesertaId],
      );
      sesi = sesiBunpouView(rows[0]);
    } else {
      const baris = (readLocalState().bunpouAdventureSesi || []).find(
        (s) => s.id === id && Number(s.pesertaId) === Number(pesertaId),
      );
      sesi = sesiBunpouView(baris);
    }
    if (!sesi) return null;
    if (!masihBerlaku(sesi, sekarang)) {
      await hapusSesiBunpou(sesi.id, pesertaId);
      return null;
    }
    return sesi;
  }, null);
}

export async function hapusSesiBunpou(id, pesertaId = null) {
  await ensureInitialized();
  return tanpaGagal(async () => {
    if (getMode() === 'postgres') {
      const params = pesertaId == null ? [id] : [id, pesertaId];
      const filter = pesertaId == null ? 'id = $1' : 'id = $1 AND peserta_id = $2';
      await getPool().query(`DELETE FROM bunpou_adventure_sesi WHERE ${filter}`, params);
      return true;
    }
    const db = readLocalState();
    const sebelum = (db.bunpouAdventureSesi || []).length;
    db.bunpouAdventureSesi = (db.bunpouAdventureSesi || []).filter(
      (s) => s.id !== id || (pesertaId != null && Number(s.pesertaId) !== Number(pesertaId)),
    );
    if (db.bunpouAdventureSesi.length !== sebelum) saveLocalState();
    return db.bunpouAdventureSesi.length !== sebelum;
  }, false);
}
