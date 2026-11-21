import test from 'node:test';
import assert from 'node:assert/strict';
import { normalisasi, skorMateri, cariMateri, kelompokkan } from './cariBunpou.js';

const m = (o) => ({ varian: [], kataKunci: [], padanan: [], status: 'draf', kategoriModul: null, ...o, sumber: { minnaBab: [], modulN4: [], ...o.sumber } });
const FIX = [
  m({ id: 'tara', pola: '～たら', varian: ['もし～たら'], romaji: 'tara', arti: 'kalau … / setelah …', kataKunci: ['kalau', 'jika'], padanan: ['jika', 'setelah', 'kalau'], tingkat: 'N5', sumber: { minnaBab: [25], modulN4: [11] }, kategoriModul: 2 }),
  m({ id: 'to', pola: '～と', romaji: 'to', arti: 'kalau / begitu …', padanan: ['begitu', 'kalau'], tingkat: 'N5', sumber: { minnaBab: [23], modulN4: [13] }, kategoriModul: 2 }),
  m({ id: 'ba', pola: '～ば', romaji: 'ba', arti: 'jika …', padanan: ['jika', 'kalau'], tingkat: 'N4', sumber: { minnaBab: [35], modulN4: [12] }, kategoriModul: 2 }),
  m({ id: 'te-kudasai', pola: '～てください', romaji: 'te kudasai', arti: 'tolong …', padanan: ['tolong'], tingkat: 'N5', sumber: { minnaBab: [14] } }),
  m({ id: 'te-oku', pola: '～ておきます', romaji: 'te okimasu', arti: '… dulu', padanan: ['dulu'], tingkat: 'N4', status: 'belum', sumber: { minnaBab: [30], modulN4: [7] }, kategoriModul: 1 }),
  m({ id: 'yotei', pola: '～予定{よてい}です', romaji: 'yotei desu', arti: 'berencana', padanan: ['berencana'], tingkat: 'N4', sumber: { modulN4: [5] }, kategoriModul: 1 }),
];

test('normalisasi', () => {
  assert.equal(normalisasi('タラ'), 'たら');
  assert.equal(normalisasi('～たら'), 'たら');
  assert.equal(normalisasi('降{ふ}ったら'), '降ったら');
  assert.equal(normalisasi('[[降{ふ}ったら]]'), '降ったら');
  assert.equal(normalisasi('Te  Kudasai'), 'tekudasai');
  assert.equal(normalisasi('て・ください-'), 'てください');
  assert.equal(normalisasi(null), '');
});

test('kalau finds tara first', () => {
  const h = cariMateri(FIX, 'kalau');
  assert.equal(h[0].id, 'tara');
  assert.deepEqual(h.map((x) => x.id), ['tara', 'to', 'ba']);
});

test('exact pattern, prefix, romaji, kana-for-kanji', () => {
  assert.equal(skorMateri(FIX[0], 'たら'), 100);
  assert.equal(skorMateri(FIX[0], 'タラ'), 100);
  assert.equal(skorMateri(FIX[0], 'もしたら'), 85);
  assert.equal(skorMateri(FIX[0], 'tar'), 76);
  assert.equal(skorMateri(FIX[3], 'te kudasai'), 82);
  assert.equal(skorMateri(FIX[5], 'よてい'), 90);
  assert.ok(skorMateri(FIX[5], '予定') > 0);
  assert.equal(skorMateri(FIX[0], 'xyz'), 0);
});

test('bab and modul queries', () => {
  assert.deepEqual(cariMateri(FIX, 'bab 25').map((x) => x.id), ['tara']);
  assert.deepEqual(cariMateri(FIX, 'b35').map((x) => x.id), ['ba']);
  assert.deepEqual(cariMateri(FIX, '#11').map((x) => x.id), ['tara']);
  assert.deepEqual(cariMateri(FIX, 'modul 7').map((x) => x.id), ['te-oku']);
  assert.deepEqual(cariMateri(FIX, 'm13').map((x) => x.id), ['to']);
});

test('tingkat filter', () => {
  assert.deepEqual(cariMateri(FIX, 'kalau', { tingkat: 'N4' }).map((x) => x.id), ['ba']);
});

test('belum scores lower', () => {
  const a = skorMateri({ ...FIX[4], status: 'draf' }, 'dulu');
  const b = skorMateri(FIX[4], 'dulu');
  assert.equal(a - b, 8);
});

test('kelompokkan by bab and modul', () => {
  const bab = kelompokkan(FIX, 'bab');
  assert.deepEqual(bab.map((g) => g.kunci), [14, 23, 25, 30, 35, 'tanpa']);
  assert.equal(bab[0].label, 'Bab 14');
  assert.equal(bab.at(-1).materi[0].id, 'yotei');
  const modul = kelompokkan(FIX, 'modul', [{ nomor: 1, judul: 'Niat' }, { nomor: 2, judul: 'Syarat' }]);
  assert.deepEqual(modul.map((g) => g.kunci), [1, 2, 'tidak']);
  assert.equal(modul[1].label, 'Syarat');
  assert.deepEqual(modul[1].materi.map((x) => x.id), ['tara', 'ba', 'to']);
});

test('real server catalog: kalau ranks tara first', async () => {
  const { ringkasanMateri } = await import('../../server/domain/materiBunpou/index.js');
  const hasil = cariMateri(ringkasanMateri(), 'kalau');
  assert.ok(hasil.length > 1);
  assert.equal(hasil[0].id, 'tara');
});

test('catalog kataKunci outranks content padanan', () => {
  const a = m({ id: 'a', pola: '～あ', romaji: 'a', arti: 'x', kataKunci: ['kalau'], padanan: ['jika'], tingkat: 'N5', sumber: { minnaBab: [30] } });
  const b = m({ id: 'b', pola: '～び', romaji: 'b', arti: 'x', kataKunci: ['lain'], padanan: ['jika', 'x', 'y', 'kalau'], tingkat: 'N5', sumber: { minnaBab: [20] } });
  assert.equal(skorMateri(a, 'kalau'), 66);
  assert.equal(skorMateri(b, 'kalau'), 64);
  assert.equal(cariMateri([b, a], 'kalau')[0].id, 'a');
});
