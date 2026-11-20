import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SISTEM,
  TOPIK_DOKKAI,
  TOPIK_KERJA_N4,
  panduanLevel,
  panduanPolaDokkai,
  topikDokkai,
  ukuranPermintaan,
  rencanaPermintaan,
  PANDUAN_INFO,
} from './dokkaiAi.js';

// The rules come from docs/kb-dokkai/17-aturan-final.md; these tests pin the parts that were decided there.

test('Level guidance per sentence-pattern level carries the decided lengths', () => {
  assert.match(panduanLevel('N5', 'L1'), /30–58/);
  assert.match(panduanLevel('N5', 'L5'), /150–250/);
  assert.match(panduanLevel('N4', 'L5'), /250–450/);
  assert.match(panduanLevel('N3', 'L1'), /150–200/);
  assert.match(panduanLevel('N3', 'L3'), /300–350/);
  assert.match(panduanLevel('N3', 'L5'), /500–550/);
  assert.match(panduanLevel('N3', 'L5'), /長文/);
  assert.equal(panduanLevel('N2', 'L1'), null);
  assert.equal(panduanLevel('N5', 'SEMUA'), null);
});

test('N5 grammar follows Minna lessons 1-25', () => {
  const n5 = panduanPolaDokkai('N5', 'L2');
  const [, boleh] = n5.match(/- BOLEH: ([\s\S]*?)\n- Penjelas/);
  const [, jangan] = n5.match(/- JANGAN \(diajarkan setelah Bab 25\): ([\s\S]*?)\n- Kosakata/);
  // Lesson 17, 18, 24, 25: allowed now (D2, Q3).
  for (const p of ['～なければなりません', '～ことができます', '～たら', '～ても', '～てもらいます', '～に行{い}きます (tujuan)']) {
    assert.ok(boleh.includes(p), p);
  }
  // D1 and lessons 26-50.
  for (const p of ['～ので', '～つもり', '～んです', 'まだ～ていません', '～ほうがいい', '～すぎます']) assert.ok(jangan.includes(p), p);
  assert.ok(!boleh.includes('～ので') && !boleh.includes('～つもり'));
  // D3: 工場 goes to N4.
  assert.match(n5, /JANGAN kata ini[\s\S]*工場 \(pakai 会社/);
  assert.ok(!n5.includes('Modul bunpou'));
});

test('N4 allows ～ようにする (Minna lesson 36) and keeps the patterns outside Minna and the module out', () => {
  const n4 = panduanPolaDokkai('N4', 'L3');
  const [, jangan] = n4.match(/- JANGAN \(di luar Minna dan modul\): ([\s\S]*?)\n- Kosakata/);
  assert.ok(!jangan.includes('～ようにする'));
  assert.ok(jangan.includes('～させられる') && jangan.includes('～によって'));
  assert.match(n4, /～ようにする/);
  assert.match(n4, /Modul bunpou N4/);
  assert.match(n4, /工場\{こうじょう\}/);
});

test('N3: real N3 patterns as examples, plain-form questions and (注) notes', () => {
  const n3 = panduanPolaDokkai('N3', 'L2');
  assert.ok(!n3.includes('～ようにする'));
  assert.ok(!/kausatif-pasif/.test(n3));
  assert.match(n3, /（注）/);
  assert.match(n3, /bentuk biasa/);
  assert.ok(!n3.includes('Modul bunpou'));
  assert.equal(panduanPolaDokkai('N3', 'L6'), null);
});

test('Topics: factory, garbage and pay topics never go to N5', () => {
  const n5 = topikDokkai('N5');
  for (const t of TOPIK_KERJA_N4) assert.ok(!n5.includes(t), t);
  assert.ok(n5.includes('yang boleh dan tidak boleh di asrama'));
  assert.deepEqual(topikDokkai('N4'), TOPIK_DOKKAI);
  assert.deepEqual(topikDokkai('N3'), TOPIK_DOKKAI);
});

test('Long passages are asked for two at a time', () => {
  assert.equal(ukuranPermintaan('N5', 'L1'), 4);
  assert.equal(ukuranPermintaan('N4', 'L2'), 4);
  assert.equal(ukuranPermintaan('N5', 'L5'), 2);
  assert.equal(ukuranPermintaan('N4', 'L5'), 2);
  assert.equal(ukuranPermintaan('N3', 'L3'), 2);
  assert.equal(ukuranPermintaan('N3', 'L1'), 4);
});

test('The system prompt asks for Arabic numerals, frame sentences and distractors from the passage', () => {
  assert.match(SISTEM, /angka Arab/);
  assert.match(SISTEM, /kalimat bingkai/);
  assert.match(SISTEM, /Dua pengecoh diambil dari isi bacaan/);
  assert.match(SISTEM, /tepat 3 pilihan/);
  assert.match(SISTEM, /Minna no Nihongo/);
});

test('D7 stage 2: one 情報検索 passage per call at L5 of N5 and N4, in the first request', () => {
  assert.deepEqual(rencanaPermintaan('N5', 'L5', 8), [{ n: 2, info: 2 }, { n: 2, info: null }, { n: 2, info: null }, { n: 2, info: null }]);
  assert.deepEqual(rencanaPermintaan('N4', 'L5', 3), [{ n: 2, info: 2 }, { n: 1, info: null }]);
  // One passage asked: an ordinary one. Other levels and N3: none.
  assert.deepEqual(rencanaPermintaan('N5', 'L5', 1), [{ n: 1, info: null }]);
  assert.ok(rencanaPermintaan('N5', 'L4', 8).every((r) => r.info === null));
  assert.ok(rencanaPermintaan('N3', 'L5', 4).every((r) => r.info === null));
  assert.match(PANDUAN_INFO, /情報検索/);
  assert.match(PANDUAN_INFO, /「・」/);
  assert.match(PANDUAN_INFO, /kalimat bingkai/);
});
