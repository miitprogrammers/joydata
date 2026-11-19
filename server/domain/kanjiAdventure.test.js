import test from 'node:test';
import assert from 'node:assert/strict';
import {
  UKURAN_CHUNK,
  MAKS_RIWAYAT,
  URUTAN_VOLUME,
  itemVolume,
  pecahChunk,
  susunSoalChunk,
  nilaiChunk,
  evaluasiProgres,
  volumeTersedia,
  rencanaSesiAdventure,
} from './kanjiAdventure.js';
import { kanjiItems } from './tesOnline.js';

// Seeded generator so a failing paper can be reproduced.
function rngDari(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function progresAwal(materi = 'DASAR', itemIds) {
  const ids = itemIds || itemVolume(materi).map((i) => i.id);
  return {
    materi,
    itemIds: ids,
    chunk_count: pecahChunk(ids).length,
    chunk_terbuka: 0,
    dikuasai: [],
    bosses: [],
    boss_ronde: 0,
    selesai: false,
    perlu_perhatian: false,
    riwayat: [],
  };
}

function jawabanBenar(soal) {
  return Object.fromEntries(soal.map((s) => [s.id, { bacaan: s.bacaan.benar, arti: s.arti.benar }]));
}

function jawabanSalah(soal, ids) {
  const jawaban = jawabanBenar(soal);
  for (const id of ids) {
    const s = soal.find((x) => x.id === id);
    assert.ok(s, `soal ${id} harus ada`);
    jawaban[id] = {
      bacaan: s.bacaan.benar === 0 ? 1 : 0,
      arti: s.arti.benar === 0 ? 1 : 0,
    };
  }
  return jawaban;
}

test('volume order follows unlock order and rejects unknown volumes', () => {
  assert.deepEqual(URUTAN_VOLUME.slice(0, 6), ['DASAR', 'VOL1', 'VOL2', 'VOL3', 'VOL4', 'VOL5']);
  assert.equal(URUTAN_VOLUME[6], 'N4VOL1');
  assert.equal(itemVolume('DASAR').length, 80);
  assert.equal(itemVolume('N4VOL5').length, 56);
  assert.throws(() => itemVolume('N3'), /VOLUME_KANJI_TIDAK_VALID/);
});

test('chunks are consecutive slices of ten and cover every item exactly once', () => {
  const items = itemVolume('DASAR');
  const chunks = pecahChunk(items.map((i) => i.id));
  assert.equal(chunks.length, 8);
  assert.equal(chunks[0].itemIds.length, UKURAN_CHUNK);
  assert.equal(chunks[7].itemIds.length, 10);
  assert.deepEqual(chunks.flatMap((c) => c.itemIds), items.map((i) => i.id));
  assert.equal(pecahChunk(itemVolume('N4VOL5').map((i) => i.id)).at(-1).itemIds.length, 6);
});

test('a saved chunk renders the same paper twice and keeps its item ids in order', () => {
  const items = itemVolume('DASAR');
  const itemIds = pecahChunk(items.map((i) => i.id))[0].itemIds;
  const a = susunSoalChunk(items, itemIds, { mode: 'reguler', rng: rngDari(7) });
  const b = susunSoalChunk(items, itemIds, { mode: 'boss', rng: rngDari(7) });
  assert.deepEqual(a, b); // mode changes progress, never the paper
  assert.deepEqual(a.map((s) => s.id), itemIds);
  assert.ok(a.every((s) => s.bacaan.opsi.length === 4 && s.arti.opsi.length === 4));
  assert.throws(() => susunSoalChunk(items, ['DASAR:tidak-ada'], { rng: rngDari(7) }), /ITEM_CHUNK_HILANG/);
  assert.throws(() => susunSoalChunk(items, itemIds, { mode: 'aneh', rng: rngDari(7) }), /MODE_ADVENTURE_TIDAK_VALID/);
});

test('nilaiChunk grades reading and meaning and lists the exact failed items', () => {
  const items = itemVolume('DASAR');
  const itemIds = pecahChunk(items.map((i) => i.id))[0].itemIds;
  const soal = susunSoalChunk(items, itemIds, { rng: rngDari(11) });
  const salah = itemIds[3];
  const benar = nilaiChunk(soal, jawabanBenar(soal));
  assert.equal(benar.benar, 10);
  assert.equal(benar.total, 10);
  assert.equal(benar.lulus, true);
  assert.equal(benar.skor, 100);
  assert.deepEqual(benar.itemSalah, []);
  const gagal = nilaiChunk(soal, jawabanSalah(soal, [salah]));
  assert.equal(gagal.benar, 9);
  assert.equal(gagal.lulus, false);
  assert.ok(gagal.skor < 100 && gagal.skor > 80);
  assert.deepEqual(gagal.itemSalah, [salah]);
  assert.equal(gagal.detail.find((d) => d.itemId === salah).bacaanOk, false);
});

test('a failed chunk opens a boss entry and does not advance the chunk', () => {
  const items = itemVolume('DASAR');
  const p = progresAwal();
  const soal = susunSoalChunk(items, pecahChunk(p.itemIds)[0].itemIds, { rng: rngDari(3) });
  const itemSalah = soal[2].id;
  const hasil = nilaiChunk(soal, jawabanSalah(soal, [itemSalah]));
  const waktu = '2026-11-19T04:00:00.000Z';
  const next = evaluasiProgres(p, hasil, { chunkIndex: 0, sekarang: waktu });
  assert.equal(next.chunk_terbuka, 0);
  assert.equal(next.bosses.length, 1);
  assert.deepEqual({ id: next.bosses[0].id, salah: next.bosses[0].salah, terakhirSalah: next.bosses[0].terakhirSalah }, {
    id: itemSalah, salah: 1, terakhirSalah: waktu,
  });
  assert.equal(next.selesai, false);
  assert.equal(p.bosses.length, 0); // pure
  assert.equal(p.dikuasai.length, 0);
});

test('mastered items leave the boss list and the chunk advances', () => {
  const items = itemVolume('DASAR');
  const p = progresAwal();
  const soal = susunSoalChunk(items, pecahChunk(p.itemIds)[0].itemIds, { rng: rngDari(5) });
  const itemSalah = soal[2].id;
  const pertama = evaluasiProgres(
    p,
    nilaiChunk(soal, jawabanSalah(soal, [itemSalah])),
    { chunkIndex: 0, sekarang: '2026-11-19T04:00:00.000Z' }
  );
  const kedua = evaluasiProgres(
    pertama,
    nilaiChunk(soal, jawabanBenar(soal)),
    { chunkIndex: 0, sekarang: '2026-11-19T04:05:00.000Z' }
  );
  assert.equal(kedua.dikuasai.length, 10);
  assert.deepEqual(kedua.bosses, []);
  assert.equal(kedua.chunk_terbuka, 1);
  assert.equal(kedua.selesai, false);
});

test('boss rounds need a perfect round to finish; needing attention is only a marker', () => {
  const items = itemVolume('DASAR');
  const ids = items.map((i) => i.id);
  const itemBoss = ids[0];
  const p = {
    ...progresAwal('DASAR', ids),
    chunk_terbuka: pecahChunk(ids).length, // all regular chunks done
    dikuasai: ids.filter((id) => id !== itemBoss),
    bosses: [{ id: itemBoss, salah: 2, terakhirSalah: '2026-11-19T03:00:00.000Z' }],
  };
  const soal = susunSoalChunk(items, [itemBoss], { mode: 'boss', rng: rngDari(9) });
  const gagal = evaluasiProgres(
    p,
    nilaiChunk(soal, jawabanSalah(soal, [itemBoss])),
    { chunkIndex: -1, sekarang: '2026-11-19T04:10:00.000Z' }
  );
  assert.equal(gagal.boss_ronde, 1);
  assert.equal(gagal.bosses[0].salah, 3);
  assert.equal(gagal.perlu_perhatian, true);
  assert.equal(gagal.selesai, false); // the marker never replaces the replay

  const lolos = evaluasiProgres(
    gagal,
    nilaiChunk(soal, jawabanBenar(soal)),
    { chunkIndex: -1, sekarang: '2026-11-19T04:15:00.000Z' }
  );
  assert.equal(lolos.boss_ronde, 2);
  assert.deepEqual(lolos.bosses, []);
  assert.equal(lolos.selesai, true);
  assert.equal(lolos.dikuasai.length, ids.length);
});

test('riwayat keeps only the last MAKS_RIWAYAT sessions', () => {
  const items = itemVolume('DASAR');
  const soal = susunSoalChunk(items, pecahChunk(items.map((i) => i.id))[0].itemIds, { rng: rngDari(13) });
  const hasil = nilaiChunk(soal, jawabanBenar(soal));
  let p = progresAwal();
  for (let i = 0; i < MAKS_RIWAYAT + 5; i += 1) {
    p = evaluasiProgres(p, hasil, { chunkIndex: 0, sekarang: `2026-11-19T05:${String(i).padStart(2, '0')}:00.000Z` });
  }
  assert.equal(p.riwayat.length, MAKS_RIWAYAT);
  assert.equal(p.riwayat.at(-1).waktu, `2026-11-19T05:${String(MAKS_RIWAYAT + 4).padStart(2, '0')}:00.000Z`);
});

test('a volume unlocks only after the previous one is finished', () => {
  assert.equal(volumeTersedia([], 'DASAR'), true);
  assert.equal(volumeTersedia([], 'VOL1'), false);
  assert.equal(volumeTersedia([{ materi: 'DASAR', selesai: false }], 'VOL1'), false);
  assert.equal(volumeTersedia([{ materi: 'DASAR', selesai: true }], 'VOL1'), true);
  assert.equal(volumeTersedia([{ materi: 'VOL5', selesai: true }], 'N4VOL1'), true);
  assert.equal(volumeTersedia([], 'N3VOL1'), false);
});

test('the snapshot ids stay aligned with the kanji catalogue after a data change', () => {
  for (const materi of URUTAN_VOLUME) {
    const ids = itemVolume(materi).map((i) => i.id);
    assert.deepEqual(ids, kanjiItems(materi).map((i) => i.id));
    assert.equal(new Set(ids).size, ids.length, `${materi} tidak boleh mengandung id ganda`);
  }
});

test('session plan hands out only the unlocked chunk with its answer key', () => {
  const p = progresAwal();
  const rencana = rencanaSesiAdventure(p, 'DASAR', { chunkIndex: 0 });
  assert.equal(rencana.mode, 'reguler');
  assert.equal(rencana.chunkIndex, 0);
  assert.equal(rencana.ronde, 0);
  assert.equal(rencana.soal.length, 10);
  assert.deepEqual(rencana.itemIds, pecahChunk(p.itemIds)[0].itemIds);
  assert.deepEqual(rencana.soal.map((s) => s.id), rencana.itemIds);
  assert.ok(rencana.soal.every((s) => s.bacaan.benar !== undefined && s.arti.benar !== undefined));
});

test('session plan rejects locked chunks, bad indexes, and boss before the regular chunks finish', () => {
  const p = progresAwal();
  assert.throws(() => rencanaSesiAdventure(p, 'DASAR', { chunkIndex: 1 }), /CHUNK_TERKUNCI/);
  assert.throws(() => rencanaSesiAdventure(p, 'DASAR', { chunkIndex: 8 }), /CHUNK_TIDAK_VALID/);
  assert.throws(() => rencanaSesiAdventure(p, 'DASAR', { chunkIndex: 'nol' }), /CHUNK_TIDAK_VALID/);
  assert.throws(() => rencanaSesiAdventure(p, 'DASAR', { mode: 'boss' }), /CHUNK_TERKUNCI/);
});

test('boss plan uses only boss ids and advances the round', () => {
  const p = progresAwal();
  p.chunk_terbuka = pecahChunk(p.itemIds).length;
  const bosses = [p.itemIds[0], p.itemIds[5]];
  p.bosses = bosses.map((id) => ({ id, salah: 0 }));
  p.boss_ronde = 2;
  const rencana = rencanaSesiAdventure(p, 'DASAR', { mode: 'boss' });
  assert.equal(rencana.mode, 'boss');
  assert.equal(rencana.chunkIndex, -1);
  assert.equal(rencana.ronde, 3);
  assert.deepEqual(rencana.itemIds, bosses);
  assert.deepEqual(rencana.soal.map((s) => s.id), bosses);
});

