// Kanji Adventure: a saved, deterministic journey through the kanji volumes.
// This is pure domain logic: it never touches the database, the clock or the session store directly.

import { kanjiItems, nilaiTes, susunSoalKanjiDariItems, VOLUME_KANJI } from './tesOnline.js';

export const UKURAN_CHUNK = 10;
export const MAKS_RIWAYAT = 20;
export const AMBANG_PERHATIAN = 3;
// DASAR, VOL1..VOL5, N4VOL1..N4VOL5. Order is the unlock order, not an alphabetical sort.
export const URUTAN_VOLUME = [...VOLUME_KANJI];

const unik = (daftar) => [...new Set(daftar)];

/** Every stable item id of a volume in source order. An unknown volume is rejected. */
export function itemVolume(materi) {
  if (!URUTAN_VOLUME.includes(materi)) throw new Error('VOLUME_KANJI_TIDAK_VALID');
  return kanjiItems(materi);
}

/** Consecutive chunks of ten; the last chunk may be shorter. */
export function pecahChunk(itemIds) {
  const chunks = [];
  for (let i = 0; i < itemIds.length; i += UKURAN_CHUNK) {
    chunks.push({ index: chunks.length, itemIds: itemIds.slice(i, i + UKURAN_CHUNK) });
  }
  return chunks;
}

/**
 * Render a saved chunk. The ids are looked up in the volume snapshot and never reshuffled or redrawn, so a
 * repeated session asks the exact same questions. The paper shape is identical to the ordinary kanji test.
 */
export function susunSoalChunk(items, itemIds, { mode = 'reguler', rng = Math.random } = {}) {
  if (!['reguler', 'boss'].includes(mode)) throw new Error('MODE_ADVENTURE_TIDAK_VALID');
  const dikenal = new Map(items.map((i) => [i.id, i]));
  const dipilih = itemIds.map((id) => {
    const item = dikenal.get(id);
    if (!item) throw new Error(`ITEM_CHUNK_HILANG: ${id}`);
    return item;
  });
  return susunSoalKanjiDariItems(items, dipilih, rng);
}

/** Grade a chunk with the same rules as the official kanji test (half a point per reading and meaning). */
export function nilaiChunk(soal, jawaban) {
  const hasil = nilaiTes('kanji', soal, jawaban);
  // The whole graded row is kept (kanji, chosen and correct answers) so the result screen can explain a miss,
  // while itemId/benar stay the stable fields progress is built from.
  const detail = hasil.detail.map((d) => ({
    ...d,
    itemId: d.id,
    bacaanOk: d.bacaanOk,
    artiOk: d.artiOk,
    benar: d.bacaanOk && d.artiOk,
  }));
  return {
    detail,
    skor: hasil.skor,
    benar: hasil.benar,
    total: hasil.total,
    lulus: hasil.total > 0 && hasil.benar === hasil.total,
    itemSalah: detail.filter((d) => !d.benar).map((d) => d.itemId),
  };
}

function entriBoss(b) {
  if (typeof b === 'string') return { id: b, salah: 0, terakhirSalah: null };
  if (!b || typeof b !== 'object' || typeof b.id !== 'string') return null;
  const salah = Number(b.salah);
  return {
    id: b.id,
    salah: Number.isFinite(salah) && salah > 0 ? Math.floor(salah) : 0,
    terakhirSalah: typeof b.terakhirSalah === 'string' ? b.terakhirSalah : null,
  };
}

/**
 * Boss list from any saved shape: older sessions stored plain id strings.
 * Duplicate ids are merged so the count reflects every failed attempt.
 */
export function daftarBossAdventure(progres) {
  const gabungan = new Map();
  for (const mentah of progres?.bosses || []) {
    const boss = entriBoss(mentah);
    if (!boss) continue;
    const sebelumnya = gabungan.get(boss.id);
    if (!sebelumnya) {
      gabungan.set(boss.id, boss);
      continue;
    }
    gabungan.set(boss.id, {
      id: boss.id,
      salah: sebelumnya.salah + boss.salah,
      terakhirSalah: [sebelumnya.terakhirSalah, boss.terakhirSalah].filter(Boolean).sort().at(-1) || null,
    });
  }
  return [...gabungan.values()].sort((a, b) => b.salah - a.salah || a.id.localeCompare(b.id));
}

/**
 * Fold one graded session into the saved progress. Pure: neither argument is mutated.
 * `opsi.chunkIndex` is -1 for a boss round, otherwise the regular chunk that was played.
 */
export function evaluasiProgres(progres, hasil, {
  chunkIndex = progres.chunk_terbuka,
  sekarang = new Date().toISOString(),
} = {}) {
  const dikuasai = unik([
    ...(progres.dikuasai || []),
    ...hasil.detail.filter((d) => d.benar).map((d) => d.itemId),
  ]);

  const chunks = pecahChunk(progres.itemIds || []);
  const chunkSekarang = chunkIndex >= 0 ? chunks[chunkIndex] : null;
  const chunkLulus = Boolean(chunkSekarang) && chunkSekarang.itemIds.every((id) => dikuasai.includes(id));

  let bosses = daftarBossAdventure(progres);
  for (const id of hasil.itemSalah) {
    const ada = bosses.find((b) => b.id === id);
    bosses = ada
      ? bosses.map((b) => (b.id === id ? { ...b, salah: b.salah + 1, terakhirSalah: sekarang } : b))
      : [...bosses, { id, salah: 1, terakhirSalah: sekarang }];
  }
  // An item that is now fully mastered is no longer a boss, wherever it was answered.
  bosses = bosses.filter((b) => !dikuasai.includes(b.id));

  const chunkTerbuka = chunkIndex >= 0 && chunkLulus
    ? Math.max(progres.chunk_terbuka || 0, chunkIndex + 1)
    : progres.chunk_terbuka || 0;
  const semuaRegulerTuntas = chunkTerbuka >= chunks.length;
  const bossRonde = chunkIndex < 0 ? (progres.boss_ronde || 0) + 1 : progres.boss_ronde || 0;
  const selesai = semuaRegulerTuntas && bosses.length === 0;
  // Whether the played step is now fully mastered across all attempts. A single session can be imperfect while
  // the chunk as a whole is complete, so the result screen must not decide from this session's score alone.
  const chunkTuntas = chunkIndex < 0 ? bosses.length === 0 : chunkLulus;

  return {
    ...progres,
    dikuasai,
    bosses,
    boss_ronde: bossRonde,
    chunk_terbuka: chunkTerbuka,
    chunk_tuntas: chunkTuntas,
    selesai,
    perlu_perhatian: bossRonde >= AMBANG_PERHATIAN || bosses.some((b) => b.salah >= AMBANG_PERHATIAN),
    riwayat: [
      ...(progres.riwayat || []),
      { chunkIndex, ronde: bossRonde, benar: hasil.benar, total: hasil.total, lulus: hasil.lulus, waktu: sekarang },
    ].slice(-MAKS_RIWAYAT),
  };
}

/** The first volume is always open; every later one needs the previous volume finished. */
export function volumeTersedia(semuaProgres, materi) {
  const index = URUTAN_VOLUME.indexOf(materi);
  if (index < 0) return false;
  if (index === 0) return true;
  const sebelumnya = (semuaProgres || []).find((p) => p.materi === URUTAN_VOLUME[index - 1]);
  return Boolean(sebelumnya && sebelumnya.selesai);
}

/**
 * Rencana satu sesi: chunk reguler yang masih terbuka, atau boss setelah semua chunk reguler tuntas.
 * Melempar CHUNK_TIDAK_VALID / CHUNK_TERKUNCI supaya rute cukup menerjemahkan kode ke status HTTP.
 */
export function rencanaSesiAdventure(progres, materi, input = {}) {
  const itemIds = progres?.itemIds?.length ? progres.itemIds : itemVolume(materi).map((item) => item.id);
  const chunks = pecahChunk(itemIds);
  const mintaBoss = input?.mode === 'boss' || input?.chunkIndex === -1 || input?.chunkIndex === '-1';
  const terbuka = Number(progres?.chunk_terbuka) || 0;

  if (mintaBoss) {
    const regularTuntas = chunks.length > 0 && terbuka >= chunks.length;
    const bosses = daftarBossAdventure(progres).map((b) => b.id);
    if (!regularTuntas || bosses.length === 0) throw new Error('CHUNK_TERKUNCI');
    const byId = new Map(itemVolume(materi).map((item) => [item.id, item]));
    if (bosses.some((id) => !byId.has(id))) throw new Error('CHUNK_TERKUNCI');
    const items = bosses.map((id) => byId.get(id));
    return {
      mode: 'boss',
      chunkIndex: -1,
      ronde: (Number(progres?.boss_ronde) || 0) + 1,
      itemIds: bosses,
      soal: susunSoalChunk(items, bosses, { mode: 'boss' }),
    };
  }

  const index = Number(input?.chunkIndex);
  if (!Number.isInteger(index) || index < 0 || index >= chunks.length) throw new Error('CHUNK_TIDAK_VALID');
  if (index > terbuka) throw new Error('CHUNK_TERKUNCI');
  const ids = chunks[index].itemIds;
  return {
    mode: 'reguler',
    chunkIndex: index,
    ronde: 0,
    itemIds: ids,
    soal: susunSoalChunk(itemVolume(materi), ids),
  };
}
