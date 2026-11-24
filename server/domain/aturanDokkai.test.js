import test from 'node:test';
import assert from 'node:assert/strict';
import { peringatanBacaanDokkai, kataHindariN5, polaDiAtasTingkat } from './aturanDokkai.js';

const bacaan = (teks, opsi = ['あ', 'い', 'う']) => ({
  judul: 'テスト',
  teks,
  soal: [{ tanya: '何{なに}をしますか。', opsi }],
});

test('N5 warnings: words to avoid (kanji or kana) and patterns of Minna lessons 26-50, furigana ignored', () => {
  const b = bacaan('工場{こうじょう}で働{はたら}きます。雨{あめ}なので、うちにいます。', ['せんぱいと話{はな}します', 'い', 'う']);
  const p = peringatanBacaanDokkai(b, 'N5', 'L3');
  assert.deepEqual(p.filter((x) => x.jenis === 'kata').map((x) => x.isi), ['工場', 'せんぱい']);
  const pola = p.filter((x) => x.jenis === 'pola');
  assert.equal(pola.length, 1);
  assert.match(pola[0].isi, /ので/);
  assert.match(pola[0].contoh, /雨なので/);
  // Lessons 17, 18, 24, 25 are allowed at N5; ～のです is not ～ので.
  assert.deepEqual(peringatanBacaanDokkai(bacaan('日本語{にほんご}を話{はな}すことができます。雨{あめ}が降{ふ}ったら、行{い}きません。これは本{ほん}なのです。'), 'N5', 'L5'), []);
  assert.deepEqual(kataHindariN5('会社で働きます'), []);
});

test('N4 warnings follow the module levels: keigo is fine from L5, N3 patterns are flagged everywhere', () => {
  const b = bacaan('部長{ぶちょう}がいらっしゃいます。わたしにとって、大切{たいせつ}な日{ひ}です。');
  assert.deepEqual(peringatanBacaanDokkai(b, 'N4', 'L3').map((x) => x.isi), ['～にとって (N3)', 'keigo']);
  assert.deepEqual(peringatanBacaanDokkai(b, 'N4', 'L5').map((x) => x.isi), ['～にとって (N3)']);
  // No N5 word list at N4: 工場 is N4 vocabulary.
  assert.deepEqual(peringatanBacaanDokkai(bacaan('工場{こうじょう}で働{はたら}きます。'), 'N4', 'L1'), []);
});

test('N3 warnings: N2 patterns that slip into N3 passages', () => {
  assert.deepEqual(polaDiAtasTingkat('熱が出るおそれがある。', 'N3', 'L3').map((x) => x.nama), ['～おそれがある (N2) → ～かもしれない']);
  assert.deepEqual(polaDiAtasTingkat('熱が出るかもしれない。', 'N3', 'L3'), []);
});

test('～んです: nama pekerjaan berakhir いん + です bukan pola; ～んです sungguhan tetap ditandai', () => {
  const ada = (t) => polaDiAtasTingkat(t, 'N5', 'L1').some((x) => /んです/.test(x.nama));
  for (const t of ['かいしゃいんです。', 'ぎんこういんです。', 'てんいんです。']) assert.equal(ada(t), false, t);
  for (const t of ['このりょうりはおいしいんです。', 'まいにちいくんです。', 'きのうやすんだんですか。']) assert.equal(ada(t), true, t);
});

test('～んです: nama benda berakhir ん + です (kana) dikecualikan; いいんです/かわいいんです tetap ditandai', () => {
  const ada = (t) => polaDiAtasTingkat(t, 'N5', 'L1').some((x) => /んです/.test(x.nama));
  for (const t of ['これはごはんです。', 'これはふとんです。', 'これはかびんです。', 'これはゆうびんです。', 'かれはえきいんです。', 'かれはかいいんです。', 'かれはだいがくいんです。', 'あれはびょういんです。']) assert.equal(ada(t), false, t);
  for (const t of ['これでいいんです。', 'この花はかわいいんです。', 'この犬はおおきいんです。', 'まいにちいくんです。']) assert.equal(ada(t), true, t);
});
