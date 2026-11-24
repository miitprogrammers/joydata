import test from 'node:test';
import assert from 'node:assert/strict';
import { KATALOG_MATERI } from './materiBunpou/katalog.js';
import { tanpaFurigana } from './tesOnline.js';
import {
  JUMLAH_KOTAK,
  kalimatUtuh,
  kertasSoalBintang,
  nilaiSoalBintang,
  validasiBankBintang,
  validasiSoalBintang,
} from './soalBintang.js';
import { VOLUME_BUNPOU, polaVolume } from './bunpouAdventure.js';
import { SOAL_BINTANG_N5 } from './bankSoal/bintangN5.js';
import { SOAL_BINTANG_N4 } from './bankSoal/bintangN4.js';

const opsiN5 = { katalog: KATALOG_MATERI, jlpt: 'N5' };
const opsiN4 = { katalog: KATALOG_MATERI, jlpt: 'N4' };

function rngBenih(benih) {
  let a = benih >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Contoh dari plan.md §2.3. 思 tidak ada di kanjiTingkat('N5') aplikasi, jadi 思います ditulis kana.
const FUJISAN = {
  id: 'N5-ta-koto-ga-aru-1',
  pola: 'ta-koto-ga-aru',
  situasi: null,
  baris: [{ sebelum: 'わたしは', sesudah: '。' }],
  potongan: ['ふじさんに', 'のぼった', 'ことが', 'あります'],
  bintang: 2,
  urutanLain: [],
  terjemahan: 'Saya pernah mendaki Gunung Fuji.',
  pembahasan: '～たことがあります menyatakan pengalaman: bentuk た + ことが + あります.',
  status: 'draf',
};
const MIRA = {
  id: 'N5-to-omou-1',
  pola: 'to-omou',
  situasi: null,
  baris: [
    { pembicara: 'A', teks: 'ミラーさんは どこですか。' },
    { pembicara: 'B', sebelum: 'たぶん', sesudah: '。' },
  ],
  potongan: ['かいぎしつに', 'いる', 'と', 'おもいます'],
  bintang: 2,
  urutanLain: [],
  terjemahan: 'A: Pak Miller di mana? B: Mungkin dia ada di ruang rapat.',
  pembahasan: '～と思います mengutip isi pikiran: kalimat bentuk biasa + と + 思います.',
  status: 'draf',
};
// Pasif (Minna Bab 37) = N4. Dua urutan sah: 先生に さくぶんを / さくぶんを 先生に, ★ tetap di ほめられた.
const GURU = {
  id: 'N4-ukemi-1',
  pola: 'ukemi',
  situasi: null,
  baris: [{ sebelum: 'わたしは', sesudah: '' }],
  potongan: ['先生{せんせい}に', 'さくぶんを', 'ほめられた', 'ことが あります。'],
  bintang: 2,
  urutanLain: [[1, 0, 2, 3]],
  terjemahan: 'Saya pernah dipuji guru karena karangan saya.',
  pembahasan: 'Dua urutan sah; ★ tetap jatuh di ほめられた.',
  status: 'draf',
};
const FUJISAN2 = {
  ...FUJISAN,
  id: 'N5-ta-koto-ga-aru-2',
  potongan: ['にほんへ', 'いった', 'ことが', 'あります'],
  bintang: 1,
  terjemahan: 'Saya pernah pergi ke Jepang.',
};
const salin = (s, ubah) => ({ ...JSON.parse(JSON.stringify(s)), ...ubah });
const masalahDari = (s, opsi = opsiN5) => validasiSoalBintang(s, opsi).join(' | ');

test('soal contoh yang sah lolos validator', () => {
  assert.deepEqual(validasiSoalBintang(FUJISAN, opsiN5), []);
  assert.deepEqual(validasiSoalBintang(MIRA, opsiN5), []);
  assert.deepEqual(validasiSoalBintang(GURU, opsiN4), []);
});

test('validator menolak soal dengan 3 potongan (kasus no. 18 PDF)', () => {
  const s = salin(FUJISAN, { potongan: ['ふじさんに', 'のぼった', 'ことが'] });
  assert.match(masalahDari(s), /4 potongan/);
});

test('validator menolak potongan kembar, kosong, atau hanya tanda baca', () => {
  assert.match(masalahDari(salin(FUJISAN, { potongan: ['ふじさんに', 'のぼった', 'のぼった', 'あります'] })), /kembar/);
  assert.match(masalahDari(salin(FUJISAN, { potongan: ['ふじさんに', '', 'ことが', 'あります'] })), /kosong/);
  assert.match(masalahDari(salin(FUJISAN, { potongan: ['ふじさんに', 'のぼった', 'ことが', '。'] })), /tanda baca/);
});

test('validator menolak urutanLain yang tidak menjatuhkan potongan yang sama di ★', () => {
  assert.match(masalahDari(salin(GURU, { urutanLain: [[2, 1, 0, 3]] }), opsiN4), /menjatuhkan potongan lain/);
  assert.match(masalahDari(salin(GURU, { urutanLain: [[0, 1, 2]] }), opsiN4), /bukan permutasi/);
  assert.match(masalahDari(salin(GURU, { urutanLain: [[0, 1, 2, 3]] }), opsiN4), /sama dengan urutan kunci/);
});

test('urutanLain bukan array memberi pesan, bukan TypeError; urutan kembar ditolak', () => {
  for (const aneh of [5, {}, 'x']) assert.match(masalahDari(salin(FUJISAN, { urutanLain: aneh })), /urutanLain harus array/);
  assert.match(masalahDari(salin(GURU, { urutanLain: [[1, 0, 2, 3], [1, 0, 2, 3]] }), opsiN4), /urutanLain kembar/);
});

test('validator menolak huruf Latin lebar penuh', () => {
  assert.match(masalahDari(salin(FUJISAN, { baris: [{ sebelum: 'わたしは ＡＢ', sesudah: '。' }] })), /huruf Latin/);
  assert.match(masalahDari(salin(FUJISAN, { potongan: ['ふじさんに', 'のぼった', 'ことが', 'ａります'] })), /huruf Latin/);
});

test('validator menolak furigana kurang dan kanji di luar tingkat', () => {
  assert.match(masalahDari(salin(MIRA, { potongan: ['かいぎしつに', 'いる', 'と', '思います'] })), /furigana kurang/);
  assert.match(masalahDari(salin(MIRA, { potongan: ['かいぎしつに', 'いる', 'と', '憂鬱{ゆううつ}です'] })), /kanji di luar tingkat/);
});

test('validator menolak pola yang tidak ada di katalog, tingkat salah, dan id salah format', () => {
  assert.match(masalahDari(salin(FUJISAN, { id: 'N5-tidak-ada-1', pola: 'tidak-ada' })), /tidak ada di katalog/);
  assert.match(masalahDari(salin(FUJISAN, { id: 'N5-ta-koto-ga-aru-x' })), /id harus berformat/);
  assert.match(masalahDari(salin(FUJISAN), { katalog: KATALOG_MATERI, jlpt: 'N4' }), /bertingkat N5/);
});

test('validator menolak bintang di luar 0-3, baris soal ganda, huruf Latin, dan terjemahan kosong', () => {
  assert.match(masalahDari(salin(FUJISAN, { bintang: 4 })), /bintang/);
  assert.match(masalahDari(salin(FUJISAN, { baris: [{ sebelum: 'a', sesudah: 'b' }, { sebelum: 'c', sesudah: 'd' }] })), /tepat satu baris soal/);
  assert.match(masalahDari(salin(FUJISAN, { baris: [{ sebelum: 'わたしは ABC', sesudah: '。' }] })), /huruf Latin/);
  assert.match(masalahDari(salin(FUJISAN, { terjemahan: '' })), /terjemahan kosong/);
  assert.match(masalahDari(salin(FUJISAN, { pembahasan: ' ' })), /pembahasan kosong/);
});

test('validator menolak kalimat terlalu panjang dan pola di atas tingkat', () => {
  const panjang = 'あ'.repeat(41);
  assert.match(masalahDari(salin(FUJISAN, { baris: [{ sebelum: panjang, sesudah: '。' }] })), /kalimat utuh/);
  // ～ながら (Bab 28) tidak boleh dipakai di soal N5.
  const s = salin(FUJISAN, { baris: [{ sebelum: 'おんがくを ききながら', sesudah: '。' }] });
  assert.match(masalahDari(s), /pola di atas tingkat N5/);
});

test('validasiBankBintang: id kembar, kalimat kembar, posisi ★ seragam', () => {
  const kembar = [FUJISAN, salin(FUJISAN)];
  const m = validasiBankBintang(kembar, opsiN5).join(' | ');
  assert.match(m, /id kembar/);
  assert.match(m, /kalimat utuh kembar/);
  assert.deepEqual(validasiBankBintang([FUJISAN, FUJISAN2], opsiN5), []);
  const seragam = [1, 2, 3].map((n) => salin(FUJISAN, {
    id: `N5-ta-koto-ga-aru-${n}`,
    potongan: [`ふじさん${'あ'.repeat(n)}に`, 'のぼった', 'ことが', 'あります'],
  }));
  assert.match(validasiBankBintang(seragam, opsiN5).join(' | '), /posisi ★ sama/);
});

test('kalimatUtuh menyusun baris soal dengan urutan kunci', () => {
  assert.equal(tanpaFurigana(kalimatUtuh(FUJISAN)), 'わたしは ふじさんに のぼった ことが あります。');
  assert.equal(tanpaFurigana(kalimatUtuh(MIRA)), 'たぶん かいぎしつに いる と おもいます。');
});

test('kertas: nomor teracak tetapi benar selalu menunjuk potongan di ★ dan urutan membentuk kalimat kunci', () => {
  const urutanTerlihat = new Set();
  for (let benih = 1; benih <= 200; benih += 1) {
    const k = kertasSoalBintang(FUJISAN, rngBenih(benih));
    assert.deepEqual(k.pilihan.map((p) => p.nomor), [1, 2, 3, 4]);
    assert.equal(k.pilihan.length, JUMLAH_KOTAK);
    assert.deepEqual([...k.pilihan.map((p) => p.teks)].sort(), [...FUJISAN.potongan].sort());
    assert.equal(k.pilihan[k.benar - 1].teks, FUJISAN.potongan[FUJISAN.bintang]);
    // urutan = nomor dalam urutan kunci
    assert.deepEqual(k.urutan.map((n) => k.pilihan[n - 1].teks), FUJISAN.potongan);
    assert.equal(k.urutan[FUJISAN.bintang], k.benar);
    urutanTerlihat.add(k.pilihan.map((p) => p.teks).join('/'));
  }
  assert.ok(urutanTerlihat.size > 6, 'pengacakan harus bervariasi');
});

test('kertas tidak mengubah soal asli dan memakai rng yang disuntikkan secara deterministik', () => {
  const asli = JSON.stringify(MIRA);
  const a = kertasSoalBintang(MIRA, rngBenih(7));
  const b = kertasSoalBintang(MIRA, rngBenih(7));
  assert.deepEqual(a, b);
  assert.equal(JSON.stringify(MIRA), asli);
  assert.equal(a.id, MIRA.id);
  assert.equal(a.pola, MIRA.pola);
  assert.deepEqual(a.baris, MIRA.baris);
  assert.equal(a.terjemahan, MIRA.terjemahan);
});

test('nilaiSoalBintang membandingkan nomor, bukan teks, dan menolak nilai aneh', () => {
  const k = kertasSoalBintang(FUJISAN, rngBenih(3));
  assert.equal(nilaiSoalBintang(k, k.benar), true);
  assert.equal(nilaiSoalBintang(k, String(k.benar)), true);
  const salah = [1, 2, 3, 4].find((n) => n !== k.benar);
  assert.equal(nilaiSoalBintang(k, salah), false);
  for (const aneh of [null, undefined, '', true, [], {}, NaN, 99]) assert.equal(nilaiSoalBintang(k, aneh), false);
});

// Gate di npm test: setiap soal di bank nyata harus lolos validator (kosong = lolos sampai produksi bank).
test('bank bintang nyata lolos validator, termasuk sebaran ★ per volume', () => {
  for (const [bank, jlpt] of [[SOAL_BINTANG_N5, 'N5'], [SOAL_BINTANG_N4, 'N4']]) {
    const kelompok = VOLUME_BUNPOU.filter((v) => v.jlpt === jlpt).map((v) => polaVolume(v.kode));
    assert.deepEqual(validasiBankBintang(bank, { katalog: KATALOG_MATERI, jlpt, kelompok }), []);
  }
});

test('sebaran ★ miring dalam satu kelompok ditolak (pengaturan per volume)', () => {
  const bank = Array.from({ length: 8 }, (_, i) => salin(FUJISAN, {
    id: `N5-ta-koto-ga-aru-${i + 1}`,
    potongan: [`ふじ${'さ'.repeat(i + 1)}ん`, 'のぼった', 'ことが', 'あります'],
    bintang: i < 6 ? 2 : 1,
  }));
  const m = validasiBankBintang(bank, { ...opsiN5, kelompok: [['ta-koto-ga-aru']] }).join(' | ');
  assert.match(m, /sebaran ★ miring/);
});

test('validator menolak pembahasan tanpa penjelasan Indonesia (hanya kalimat Jepang)', () => {
  assert.match(masalahDari(salin(FUJISAN, { pembahasan: 'わたしは ふじさんに のぼった ことが あります。' })), /pembahasan harus berisi penjelasan/);
  assert.match(masalahDari(salin(FUJISAN, { pembahasan: '富士{ふじ}山{さん}、pendek.' })), /pembahasan harus berisi penjelasan/);
});

test('validator menolak potongan yang diawali huruf yang tak bisa memulai kata', () => {
  for (const awal of ['ゃくそく', 'っています', 'んだ', 'ーる', 'って', 'ょう', 'ン']) {
    assert.match(masalahDari(salin(FUJISAN, { potongan: ['ふじさんに', awal, 'ことが', 'あります'] })), /dipotong di tengah kata/);
  }
  assert.match(masalahDari(salin(FUJISAN, { potongan: ['ふじさんに', 'のぼった', 'ことが', '？'] })), /hanya tanda baca/);
});

test('validator menolak terjemahan kurang dari 10 huruf Latin dan status di luar draf/ditinjau', () => {
  assert.match(masalahDari(salin(FUJISAN, { terjemahan: '富士山' })), /terjemahan harus berupa kalimat/);
  assert.match(masalahDari(salin(FUJISAN, { terjemahan: 'Saya pergi.' })), /terjemahan harus berupa kalimat/);
  assert.match(masalahDari(salin(FUJISAN, { terjemahan: '', status: 'draf' })), /terjemahan kosong/);
  for (const status of ['final', undefined, '']) {
    assert.match(masalahDari(salin(FUJISAN, { status })), /status harus draf atau ditinjau/);
  }
  assert.equal(masalahDari(salin(FUJISAN, { status: 'ditinjau' })), '');
});

test('validator menolak kata terputus di batas potongan dan potongan satu kana bukan partikel', () => {
  const dgn = (potongan, sesudah = '。', sebelum = 'わたしは') => salin(FUJISAN, { baris: [{ sebelum, sesudah }], potongan });
  for (const p of [['がくせいで', 'す', 'ここに', 'いま'], ['いきま', 'しょ', 'う', 'ね'], ['ここに', 'くだ', 'さい', 'ね'], ['いきま', 'した', 'きのう', 'ここに'], ['いけま', 'せん', 'ここは', 'から']]) {
    assert.match(masalahDari(dgn(p)), /kata terputus|dipotong|satu kana/, p.join('/'));
  }
  assert.match(masalahDari(dgn(['がくせいで', 'す', 'ここに', 'いま'])), /kata terputus di batas potongan/);
  assert.match(masalahDari(dgn(['ここ', 'あ', 'いま', 'です'])), /satu kana yang bukan partikel/);
  assert.equal(masalahDari(dgn(['ここ', 'の', 'ほんが', 'あります'])), '');
});

test('potongan yang diawali ん sah bila ～んです / んでした / んでしょう / んじゃ', () => {
  const dgn = (p) => salin(FUJISAN, { potongan: ['ふじさんに', 'のぼった', p, 'ね'], baris: [{ sebelum: 'わたしは', sesudah: '。' }] });
  for (const p of ['んです', 'んでした', 'んでしょうか', 'んじゃない']) assert.doesNotMatch(masalahDari(dgn(p)), /dipotong di tengah kata/, p);
  assert.match(masalahDari(dgn('んだ')), /dipotong di tengah kata/);
});
