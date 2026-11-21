import test from 'node:test';
import assert from 'node:assert/strict';
import {
  KATALOG,
  ISI,
  validasiKatalog,
  validasiIsi,
  cakupanModul,
  ringkasanMateri,
  ambilMateri,
  kategoriModul,
} from './index.js';
import { cariPolaBunpou, LEVEL_BUNPOU } from '../bunpou.js';

const salin = (v) => JSON.parse(JSON.stringify(v));
const tampil = (masalah) => masalah.map((m) => `${m.id} ${m.field} [${m.kode}] ${m.pesan}`).join('\n');

// Small fixtures: the rule tests must not depend on the real data.
const KAT = [
  { id: 'tara', pola: '～たら', varian: ['もし～たら'], romaji: 'tara', arti: 'kalau … / setelah …', kataKunci: ['kalau', 'jika'], tingkat: 'N5', sumber: { minnaBab: [25], modulN4: [11] } },
  { id: 'to', pola: '～と', romaji: 'to', arti: 'kalau / begitu …', tingkat: 'N5', sumber: { minnaBab: [23], modulN4: [13] } },
  { id: 'ba', pola: '～ば', romaji: 'ba', arti: 'jika … (syarat)', tingkat: 'N4', sumber: { minnaBab: [35], modulN4: [12] } },
  { id: 'nara', pola: '～なら', romaji: 'nara', arti: 'kalau (soal) …', tingkat: 'N4', sumber: { minnaBab: [], modulN4: [14, 15] } },
];

const contoh = (tempat, makna, jp = '雨{あめ}が[[降{ふ}ったら]]、行{い}きません。') => ({
  tempat, makna, situasi: 'Di kantor.', catatan: 'Catatan.',
  baris: [{ penutur: 'Sensei', jp, id: 'Kalau hujan, tidak pergi.' }],
});
const ISI_BAIK = () => ({
  id: 'tara', status: 'draf', inti: 'Kalau sudah terjadi, baru berikutnya.',
  rumusKolom: { dasar: 'Bentuk dasar', antara: 'Bentuk た', hasil: 'Hasil' },
  rumus: [
    { jenis: 'Kata kerja', dasar: '降{ふ}る', antara: '降{ふ}った', hasil: '降{ふ}[[ったら]]', catatan: 'bentuk た' },
    { jenis: '', dasar: '高{たか}い', antara: '高{たか}かった', hasil: '高{たか}[[かったら]]' },
  ],
  makna: [
    { judul: 'Kalau', penjelasan: 'Syarat.', padanan: ['kalau …', 'jika'], contohMini: { jp: '[[降{ふ}ったら]]', id: 'Kalau hujan' } },
    { judul: 'Setelah', penjelasan: 'Urutan.', padanan: ['setelah'] },
  ],
  contoh: [contoh('kerja', 0), contoh('asrama', 1), contoh('kerja', 0)],
  bandingkan: {
    kolom: [{ id: 'tara', pola: '～たら', sub: 'Bab 25' }, { id: 'to', pola: '～と', sub: 'Bab 23' }, { id: null, pola: '～ば', sub: 'Bab 35', lanjutan: true }],
    baris: [{ label: 'Rasa', isi: ['bebas', 'otomatis', 'syarat'] }, { label: 'Contoh', jp: true, isi: ['[[降{ふ}ったら]]', '[[降{ふ}ると]]', '[[降{ふ}れば]]'] }],
    kaki: 'Ringkas.',
  },
  kesalahan: [{ salah: '雨{あめ}が降{ふ}るたら', benar: '雨{あめ}が[[降{ふ}ったら]]', alasan: 'Pakai bentuk た.' }],
  latihan: [{ tanya: 'Ubah.', jp: '降{ふ}る', jawabJp: '降{ふ}った[[ら]]' }, { tanya: 'Arti?', jawab: 'Kalau.' }],
  ringkasan: ['Bentuk た + ら.', 'Dua makna.'],
  terkait: ['to', 'ba'],
  catatanSensei: ['Tekankan urutan.'],
});

const kodeDari = (isi, kode) => validasiIsi([isi], KAT, {}).filter((m) => m.kode === kode);
const ubah = (fn) => {
  const m = ISI_BAIK();
  fn(m);
  return m;
};

test('real catalog and real content pass the validators', () => {
  assert.deepEqual(validasiKatalog(KATALOG), [], tampil(validasiKatalog(KATALOG)));
  const masalah = validasiIsi(ISI, KATALOG);
  assert.deepEqual(masalah, [], tampil(masalah));
});

test('real catalog: every module number exists and cakupanModul lists only valid numbers', () => {
  const sisa = cakupanModul(KATALOG);
  assert.ok(sisa.every((n) => cariPolaBunpou('N4', n)));
  if (KATALOG.length > 50) assert.deepEqual(sisa, [], `modul belum masuk katalog: ${sisa.join(',')}`);
});

test('cakupanModul lists module numbers no entry points to', () => {
  const sisa = cakupanModul(KAT);
  assert.equal(sisa.length, 104 - 5);
  assert.ok(!sisa.includes(11) && !sisa.includes(15) && sisa.includes(1));
});

test('fixtures: the good catalog and lesson are valid', () => {
  assert.deepEqual(validasiKatalog(KAT), []);
  assert.deepEqual(validasiIsi([ISI_BAIK()], KAT, {}), []);
});

test('validasiKatalog rejects bad entries', () => {
  const kode = (fn) => {
    const k = salin(KAT);
    fn(k);
    return validasiKatalog(k).map((m) => m.kode);
  };
  assert.ok(kode((k) => (k[0].id = 'Tara_X')).includes('id'));
  assert.ok(kode((k) => (k[1].id = 'tara')).includes('duplikat'));
  assert.ok(kode((k) => (k[0].arti = 'x'.repeat(41))).includes('panjang'));
  assert.ok(kode((k) => (k[0].arti = '雨 kalau')).includes('kanji_di_id'));
  assert.ok(kode((k) => (k[0].arti = 'kalau {x}')).includes('penanda_di_id'));
  assert.ok(kode((k) => (k[0].pola = '～降ったら')).includes('furigana'));
  assert.ok(kode((k) => (k[0].kataKunci = Array(9).fill('a'))).includes('jumlah'));
  assert.ok(kode((k) => (k[0].tingkat = 'N3')).includes('enum'));
  assert.ok(kode((k) => (k[0].tingkat = 'N4')).includes('tingkat'));
  assert.ok(kode((k) => (k[2].tingkat = 'N5')).includes('tingkat'));
  assert.ok(kode((k) => (k[3].tingkat = 'N5')).includes('tingkat'));
  assert.ok(kode((k) => (k[0].sumber.modulN4 = [999])).includes('modul'));
  assert.ok(kode((k) => (k[1].sumber.modulN4 = [11])).includes('modul'));
  assert.ok(kode((k) => delete k[0].romaji).includes('wajib'));
  assert.ok(kode((k) => (k[0].romaji = '   ')).includes('wajib'));
  assert.ok(kode((k) => (k[0].arti = '   ')).includes('wajib'));
  assert.ok(kode((k) => (k[0].sumber.jlptsensei = { N4: 88 })).includes('bentuk'));
  assert.ok(kode((k) => (k[0].sumber.jlptsensei = { N2: [1] })).includes('bentuk'));
  assert.ok(kode((k) => (k[0].sumber.jlptsensei = { N4: [0] })).includes('bentuk'));
  assert.ok(kode((k) => (k[0].sumber.jlptsensei = [88])).includes('bentuk'));
  assert.ok(!kode((k) => (k[0].sumber.jlptsensei = { N4: [88], N3: [] })).includes('bentuk'));
});

test('validasiIsi: whitespace-only required text fails, rumus catatan rejects [[ ]]', () => {
  assert.ok(kodeDari(ubah((m) => (m.inti = '   ')), 'wajib').length);
  assert.ok(kodeDari(ubah((m) => (m.contoh[0].situasi = ' ')), 'wajib').length);
  assert.ok(kodeDari(ubah((m) => (m.rumus[0].catatan = 'bentuk [[た]]')), 'penanda_di_id').length);
});

test('validasiIsi: structure, counts, enums and required fields', () => {
  assert.ok(kodeDari(ubah((m) => (m.id = 'tidak-ada')), 'id').length);
  assert.ok(validasiIsi([ISI_BAIK(), ISI_BAIK()], KAT, {}).some((m) => m.kode === 'duplikat'));
  assert.ok(kodeDari(ubah((m) => (m.status = 'final')), 'enum').length);
  assert.ok(kodeDari(ubah((m) => (m.inti = '')), 'wajib').length);
  assert.ok(kodeDari(ubah((m) => (m.inti = 'x'.repeat(61))), 'panjang').length);
  assert.ok(kodeDari(ubah((m) => (m.rumus = m.rumus.slice(0, 1))), 'jumlah').length);
  assert.ok(kodeDari(ubah((m) => (m.contoh = m.contoh.slice(0, 2))), 'jumlah').length);
  assert.ok(kodeDari(ubah((m) => (m.latihan = [m.latihan[0]])), 'jumlah').length);
  assert.ok(kodeDari(ubah((m) => (m.ringkasan = ['satu'])), 'jumlah').length);
  assert.ok(kodeDari(ubah((m) => (m.makna[0].padanan = [])), 'jumlah').length);
  assert.ok(kodeDari(ubah((m) => (m.contoh[0].tempat = 'pasar')), 'enum').length);
  assert.ok(kodeDari(ubah((m) => (m.latihan[1] = { tanya: 'Arti?' })), 'wajib').length);
  assert.ok(kodeDari(ubah((m) => (m.contoh[0].baris[0].penutur = 'x'.repeat(17))), 'panjang').length);
  assert.ok(kodeDari(ubah((m) => (m.contoh[0].catatan = 'x'.repeat(161))), 'panjang').length);
  assert.ok(kodeDari(ubah((m) => delete m.rumusKolom.antara), 'wajib').length);
  assert.ok(kodeDari(ubah((m) => m.rumus.forEach((r) => delete r.antara)), 'rujukan').length);
});

test('validasiIsi: furigana on every Japanese field, no kanji or markers in Indonesian fields', () => {
  assert.ok(kodeDari(ubah((m) => (m.rumus[0].dasar = '降る')), 'furigana').length);
  assert.ok(kodeDari(ubah((m) => (m.contoh[0].baris[0].jp = '雨が[[降ったら]]')), 'furigana').length);
  assert.ok(kodeDari(ubah((m) => (m.bandingkan.baris[1].isi[0] = '[[降ったら]]')), 'furigana').length);
  assert.ok(kodeDari(ubah((m) => (m.kesalahan[0].salah = '降る')), 'furigana').length);
  assert.ok(kodeDari(ubah((m) => (m.makna[0].contohMini.jp = '降')), 'furigana').length);
  assert.ok(kodeDari(ubah((m) => (m.inti = 'Kalau 雨')), 'kanji_di_id').length);
  assert.ok(kodeDari(ubah((m) => (m.contoh[0].baris[0].id = '雨 deras')), 'kanji_di_id').length);
  assert.ok(kodeDari(ubah((m) => (m.ringkasan[0] = 'pakai {kana}')), 'penanda_di_id').length);
  assert.ok(kodeDari(ubah((m) => (m.contoh[0].situasi = 'di [[kantor]]')), 'penanda_di_id').length);
  assert.equal(kodeDari(ubah((m) => (m.inti = 'Pakai ～たら dan bentuk た')), 'kanji_di_id').length, 0);
});

test('validasiIsi: highlight rules', () => {
  assert.ok(kodeDari(ubah((m) => (m.rumus[0].hasil = '降{ふ}ったら')), 'sorot').length, 'hasil needs [[ ]]');
  assert.ok(kodeDari(ubah((m) => (m.rumus[0].hasil = '降{ふ}[[]]')), 'sorot').length, 'empty');
  assert.ok(kodeDari(ubah((m) => (m.rumus[0].hasil = '[[降{ふ}った、ら]]')), 'sorot').length, 'no 、 inside');
  assert.ok(kodeDari(ubah((m) => (m.rumus[0].hasil = '[[降{ふ}[[った]]ら]]')), 'sorot').length, 'nested');
  assert.ok(kodeDari(ubah((m) => (m.rumus[0].hasil = '[[降{ふ}った')), 'sorot').length, 'unclosed');
  assert.ok(kodeDari(ubah((m) => (m.contoh[0].baris[0].jp = '雨{あめ}が降{ふ}ったら。')), 'sorot').length, 'one line per contoh');
  assert.ok(kodeDari(ubah((m) => (m.kesalahan[0].benar = '雨{あめ}が降{ふ}ったら')), 'sorot').length, 'benar needs [[ ]]');
  assert.equal(kodeDari(ubah((m) => (m.rumus[0].hasil = '[[降{ふ}ったら]]')), 'sorot').length, 0, 'furigana inside is fine');
});

test('validasiIsi: visible Japanese length of an example line ignores furigana and markers', () => {
  const pendek = 'あ'.repeat(38) + '[[ら]]'; // 39 visible
  assert.equal(kodeDari(ubah((m) => (m.contoh[0].baris[0].jp = pendek)), 'panjang').length, 0);
  const berfurigana = '降{ふ}'.repeat(20) + '[[降{ふ}]]'; // 21 visible, long in raw text
  assert.equal(kodeDari(ubah((m) => (m.contoh[0].baris[0].jp = berfurigana)), 'panjang').length, 0);
  assert.ok(kodeDari(ubah((m) => (m.contoh[0].baris[0].jp = 'あ'.repeat(41) + '[[ら]]')), 'panjang').length);
});

test('validasiIsi: makna index, unused makna and place variety', () => {
  assert.ok(kodeDari(ubah((m) => (m.contoh[0].makna = 5)), 'rujukan').length);
  assert.ok(kodeDari(ubah((m) => (m.contoh[1].makna = 0)), 'makna_tak_dipakai').length);
  assert.ok(kodeDari(ubah((m) => m.contoh.forEach((c) => (c.tempat = 'kerja'))), 'tempat_seragam').length);
});

test('validasiIsi: references in terkait and bandingkan', () => {
  assert.ok(kodeDari(ubah((m) => (m.terkait = ['hilang'])), 'rujukan').length);
  assert.ok(kodeDari(ubah((m) => (m.terkait = ['tara'])), 'rujukan').length, 'self');
  assert.ok(kodeDari(ubah((m) => (m.terkait = ['to', 'to'])), 'duplikat').length);
  assert.ok(kodeDari(ubah((m) => (m.terkait = ['to', 'ba', 'nara', 'to', 'ba', 'nara', 'to'])), 'jumlah').length);
  assert.ok(kodeDari(ubah((m) => (m.bandingkan.kolom[1].id = 'hilang')), 'rujukan').length);
  assert.ok(kodeDari(ubah((m) => (m.bandingkan.baris[0].isi = ['a', 'b'])), 'jumlah').length);
  assert.ok(kodeDari(ubah((m) => (m.bandingkan.kolom = [m.bandingkan.kolom[0]])), 'jumlah').length);
});

test('validasiIsi: lesson level must match its file and the catalog level', () => {
  const salah = validasiIsi([ISI_BAIK()], KAT, { tara: 'N4' });
  assert.ok(salah.some((m) => m.kode === 'tingkat'));
  assert.deepEqual(validasiIsi([ISI_BAIK()], KAT, { tara: 'N5' }), []);
});

test('ringkasanMateri: status, level, kategoriModul, padanan and order', () => {
  const isi = [ISI_BAIK()];
  const daftar = ringkasanMateri(KAT, isi);
  assert.deepEqual(daftar.map((d) => d.id), ['to', 'tara', 'ba', 'nara']); // bab 23, 25, 35, then no bab last
  const tara = daftar.find((d) => d.id === 'tara');
  assert.equal(tara.status, 'draf');
  assert.deepEqual(tara.padanan, ['kalau', 'jika', 'setelah']);
  assert.deepEqual(tara.varian, ['もし～たら']);
  assert.deepEqual(tara.sumber, { minnaBab: [25], modulN4: [11] });
  assert.equal(tara.level, cariPolaBunpou('N4', 11).level);
  assert.equal(tara.kategoriModul, cariPolaBunpou('N4', 11).kategori);
  const nara = daftar.find((d) => d.id === 'nara');
  assert.equal(nara.status, 'belum');
  assert.deepEqual(nara.padanan, []);
  const terendah = Math.min(...[14, 15].map((n) => LEVEL_BUNPOU.indexOf(cariPolaBunpou('N4', n).level)));
  assert.equal(nara.level, LEVEL_BUNPOU[terendah]);
  assert.equal(nara.kategoriModul, cariPolaBunpou('N4', 14).kategori);
  const tanpaModul = ringkasanMateri([{ ...KAT[0], sumber: { minnaBab: [25], modulN4: [] } }], [])[0];
  assert.equal(tanpaModul.level, null);
  assert.equal(tanpaModul.kategoriModul, null);
  assert.equal(ringkasanMateri().length, KATALOG.length);
});

test('ringkasanMateri orders by smallest module number within the same chapter', () => {
  const kat = [
    { ...KAT[0], id: 'a', sumber: { minnaBab: [25], modulN4: [20] } },
    { ...KAT[0], id: 'b', sumber: { minnaBab: [25], modulN4: [5] } },
  ];
  assert.deepEqual(ringkasanMateri(kat, []).map((d) => d.id), ['b', 'a']);
});

test('ambilMateri: null for unknown ids and unwritten lessons, ringkas covers every reference', () => {
  const isi = [ISI_BAIK()];
  assert.equal(ambilMateri('tidak-ada', KAT, isi), null);
  assert.equal(ambilMateri('ba', KAT, isi), null);
  const hasil = ambilMateri('tara', KAT, isi);
  assert.equal(hasil.materi.id, 'tara');
  assert.equal(hasil.materi.pola, '～たら');
  assert.equal(hasil.materi.status, 'draf');
  assert.equal(hasil.materi.level, cariPolaBunpou('N4', 11).level);
  assert.deepEqual(Object.keys(hasil.ringkas).sort(), ['ba', 'tara', 'to']); // bandingkan's first column is the lesson itself
  assert.deepEqual(hasil.ringkas.to, { id: 'to', pola: '～と', arti: 'kalau / begitu …', status: 'belum' });
});

test('kategoriModul lists the 12 module categories', () => {
  const k = kategoriModul();
  assert.equal(k.length, 12);
  assert.deepEqual(Object.keys(k[0]).sort(), ['judul', 'nomor']);
});
