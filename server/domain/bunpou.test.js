import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MODUL_BUNPOU,
  LEVEL_BUNPOU,
  MIN_FOKUS_BACAAN,
  polaBunpou,
  cariPolaBunpou,
  ringkasanPolaBunpou,
  polaBunpouLevel,
  alasanTagBunpou,
  periksaModulBunpou,
  periksaBankBunpou,
} from './bunpou.js';
import { BUNPOU_N4 } from './bankSoal/bunpouN4.js';
import { DOKKAI_N4_LEVEL } from './bankSoal/dokkaiN4.js';
import { DOKKAI_LEVEL } from './bankSoal/dokkaiN5.js';
import { KANJI_DIPELAJARI, bankSoalTes, buatSoalTes, furiganaLengkap, poolDokkai, soalTanpaKunci } from './tesOnline.js';
import { panduanPolaDokkai } from '../ai/dokkaiAi.js';

const salin = (v) => JSON.parse(JSON.stringify(v));

test('Bunpou N4 module: 104 patterns in 12 categories, every one with a formula, an example and a dokkai level', () => {
  assert.deepEqual(periksaModulBunpou(BUNPOU_N4), []);
  assert.equal(MODUL_BUNPOU.N4, BUNPOU_N4);
  assert.equal(BUNPOU_N4.kategori.length, 12);
  const pola = polaBunpou('N4');
  assert.equal(pola.length, 104);
  assert.equal(new Set(pola.map((p) => p.nomor)).size, 104);
  assert.deepEqual(
    Object.fromEntries(LEVEL_BUNPOU.map((l) => [l, pola.filter((p) => p.level === l).length])),
    { L1: 20, L2: 20, L3: 21, L4: 22, L5: 21 }
  );
  // The module's 105-111 repeat keigo patterns of category 10: folded into those, not patterns of their own.
  assert.deepEqual(Object.keys(BUNPOU_N4.gabungan).map(Number), [105, 106, 107, 108, 109, 110, 111]);
  assert.equal(cariPolaBunpou('N4', 105), null);
  assert.equal(cariPolaBunpou('N4', 20).pola, '～なければならない');
  assert.equal(cariPolaBunpou('N4', 20).kategori, 3);
  assert.deepEqual(Object.keys(ringkasanPolaBunpou('N4')[0]), ['nomor', 'pola', 'arti', 'level']);
  // A pattern level without a module has no patterns.
  assert.deepEqual(polaBunpou('N5'), []);
  assert.deepEqual(ringkasanPolaBunpou('N3'), []);
});

test('A module with gaps is refused: missing example, furigana, level, repeated number, merge to nowhere', () => {
  const rusak = salin(BUNPOU_N4);
  const [a, b, c] = rusak.kategori[0].pola;
  a.contoh = [];
  b.contoh[0].jp = '雨が降{ふ}る。';
  c.level = 'L6';
  rusak.kategori[1].pola[0].nomor = rusak.kategori[0].pola[0].nomor;
  rusak.gabungan[112] = 999;
  const salah = periksaModulBunpou(rusak).join('\n');
  assert.match(salah, new RegExp(`pola ${a.nomor}: tanpa contoh`));
  assert.match(salah, new RegExp(`pola ${b.nomor} contoh 1: ada kanji tanpa furigana`));
  assert.match(salah, new RegExp(`pola ${c.nomor}: level harus`));
  assert.match(salah, /nomor harus naik dan tidak berulang/);
  assert.match(salah, /gabungan 112: pola tujuan 999 tidak ada/);

  const sedikit = salin(BUNPOU_N4);
  sedikit.kategori.forEach((k) => k.pola.forEach((p) => { if (p.level === 'L5') p.level = 'L4'; }));
  assert.match(periksaModulBunpou(sedikit).join('\n'), /level L5: 0 pola, minimal 6/);
});

test('A dokkai level works with its own patterns, may use the easier ones and leaves the harder ones', () => {
  const l1 = polaBunpouLevel('N4', 'L1');
  assert.equal(l1.fokus.length, 20);
  assert.equal(l1.boleh.length, 0);
  assert.equal(l1.nanti.length, 84);
  const l3 = polaBunpouLevel('N4', 'L3');
  assert.deepEqual([l3.fokus.length, l3.boleh.length, l3.nanti.length], [21, 40, 43]);
  assert.equal(polaBunpouLevel('N4', 'L5').nanti.length, 0);
  assert.equal(polaBunpouLevel('N4', 'SEMUA'), null);
  assert.equal(polaBunpouLevel('N5', 'L1'), null);
});

test('Pattern tag of a bank passage: 2-4 unique module numbers, two of its own level, none from a harder level', () => {
  // L2: 20 ～なければならない, 45 ～までに, 51 ～ので; L1: 3 つもりだ; L3: 5 ことにする; L5: 78 めしあがる.
  assert.equal(MIN_FOKUS_BACAAN, 2);
  assert.equal(alasanTagBunpou('N4', 'L2', [20, 45]), null);
  assert.equal(alasanTagBunpou('N4', 'L2', [20, 45, 51, 3]), null);
  assert.equal(alasanTagBunpou('N4', 'L2', [20, 3]), 'fokus');
  assert.equal(alasanTagBunpou('N4', 'L2', [20, 45, 5]), 'level');
  assert.equal(alasanTagBunpou('N4', 'L2', [20, 45, 105]), 'nomor');
  assert.equal(alasanTagBunpou('N4', 'L2', [20, 20]), 'bentuk');
  assert.equal(alasanTagBunpou('N4', 'L2', [20, 45, 51, 3, 1]), 'bentuk');
  assert.equal(alasanTagBunpou('N4', 'L2', undefined), 'bentuk');
  assert.equal(alasanTagBunpou('N4', 'L2', ['20', '45']), 'bentuk');
  assert.equal(alasanTagBunpou('N5', 'L2', [20, 45]), 'tanpa_modul');
});

test('Dokkai N4 bank: 25 passages per level, tagged with module patterns, every pattern practised at its level', () => {
  assert.deepEqual(DOKKAI_N4_LEVEL.map((l) => [l.kode, l.bacaan.length]), LEVEL_BUNPOU.map((l) => [l, 25]));
  assert.deepEqual(periksaBankBunpou('N4', DOKKAI_N4_LEVEL), []);

  const semua = DOKKAI_N4_LEVEL.flatMap((l) => l.bacaan.map((b) => ({ ...b, level: l.kode })));
  assert.equal(semua.length, 125);
  assert.equal(semua.reduce((n, b) => n + b.soal.length, 0), 250);
  assert.equal(new Set(semua.map((b) => b.id)).size, 125);
  assert.equal(new Set(semua.map((b) => b.judul)).size, 125);
  const idN5 = new Set(DOKKAI_LEVEL.flatMap((l) => l.bacaan.map((b) => b.id)));
  for (const [i, b] of semua.entries()) {
    assert.equal(b.id, `N4${b.level}-${(i % 25) + 1}`);
    assert.ok(!idN5.has(b.id), b.id);
    assert.equal(b.soal.length, 2, b.id);
    for (const [j, s] of b.soal.entries()) {
      assert.equal(s.id, `${b.id}-${j + 1}`);
      assert.equal(s.opsi.length, 3, s.id);
      assert.ok(s.opsi[s.benar], s.id);
    }
    // A code with the default kanji volumes shows the passage as written, and the official paper has no furigana:
    // only kanji from the volumes peserta study may be left.
    for (const teks of [b.judul, b.teks, ...b.soal.flatMap((s) => [s.tanya, ...s.opsi])]) {
      assert.ok(furiganaLengkap(teks), `${b.id}: ${teks}`);
      for (const c of teks.replace(/\{[^}]*\}/g, '').match(/[㐀-鿿]/g) || []) assert.ok(KANJI_DIPELAJARI.has(c), `${b.id}: ${c}`);
    }
  }
});

test('Pattern tags are for staff: the bank view carries them, a paper does not', () => {
  const bank = bankSoalTes({ jenis: 'dokkai', materi: 'L4', jlpt: 'N4' });
  assert.equal(bank.items.length, 25);
  assert.ok(bank.items.every((b) => b.sumber === 'bank' && b.jlpt === 'N4' && b.bunpou.length >= 2));
  // Fewer kanji volumes turn words into kana but keep the tag.
  const sederhana = bankSoalTes({ jenis: 'dokkai', materi: 'L4', jlpt: 'N4', kanjiVolume: ['DASAR'] });
  assert.deepEqual(sederhana.items.map((b) => b.bunpou), bank.items.map((b) => b.bunpou));

  const kertas = buatSoalTes({ jenis: 'dokkai', materi: 'L4', jumlah: 5, pool: poolDokkai('L4', [], 'N4') });
  assert.equal(kertas.length, 5);
  assert.ok(kertas.every((b) => b.id.startsWith('N4L4-') && !('bunpou' in b)));
  assert.ok(soalTanpaKunci('dokkai', kertas).every((b) => !('bunpou' in b)));
});

test('AI guidance for N4 comes from the module: the level\'s patterns to practise, the harder ones forbidden', () => {
  const l2 = panduanPolaDokkai('N4', 'L2');
  assert.match(l2, /Pola fokus level ini/);
  assert.match(l2, /20\. ～なければならない = /);
  const [, boleh] = l2.match(/Pola level sebelumnya, boleh dipakai: (.*)\./);
  const [, jangan] = l2.match(/Pola level berikutnya, JANGAN dipakai[^:]*: (.*)\./);
  assert.ok(boleh.includes('V つもりだ'));
  assert.ok(jangan.includes('V ことにする') && jangan.includes('まいる'));
  assert.ok(!jangan.includes('～なければならない') && !boleh.includes('～なければならない'));
  // Every pattern of the module is named exactly once at every level.
  for (const level of LEVEL_BUNPOU) {
    const teks = panduanPolaDokkai('N4', level);
    const set = polaBunpouLevel('N4', level);
    for (const p of set.fokus) assert.ok(teks.includes(`  ${p.nomor}. ${p.pola} = `), `${level}: ${p.nomor}`);
    assert.equal(/Pola level sebelumnya/.test(teks), set.boleh.length > 0);
    assert.equal(/Pola level berikutnya/.test(teks), set.nanti.length > 0);
  }
  // Pattern levels without a module keep their fixed guidance.
  assert.ok(!panduanPolaDokkai('N5', 'L2').includes('Modul bunpou'));
  assert.ok(!panduanPolaDokkai('N3', 'L2').includes('Modul bunpou'));
  assert.equal(panduanPolaDokkai('N4', 'SEMUA'), null);
  assert.equal(panduanPolaDokkai('N2', 'L1'), null);
});
