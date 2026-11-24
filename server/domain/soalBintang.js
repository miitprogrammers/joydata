// Soal bintang (並べ替え / 文の組み立て): satu kalimat dengan 4 kotak, satu bertanda ★, dan 4 potongan.
// Peserta memilih nomor potongan yang jatuh di ★. Modul murni: tanpa DB, jam, atau sesi.

import { furiganaLengkap, kanjiTingkat, tanpaFurigana } from './tesOnline.js';
import { polaDiAtasTingkat } from './aturanDokkai.js';

export const JUMLAH_KOTAK = 4;
// Panjang kalimat utuh (tanpa furigana dan spasi) per tingkat.
export const PANJANG_MAKS = { N5: 40, N4: 55, N3: 70 };
const HURUF_KANJI = /[㐀-鿿々〆ヶ]/g;
const TANDA_BACA = /^[\s\p{P}\p{S}]+$/u;
const HURUF_LATIN = /[A-Za-zＡ-Ｚａ-ｚ]/; // termasuk huruf Latin lebar penuh
const HURUF_LATIN_SEMUA = /[A-Za-z]/g;
// Potongan tidak boleh diawali huruf yang tak bisa memulai kata (tanda potongan di tengah kata).
const TIDAK_BISA_AWAL = /^[ぁぃぅぇぉっゃゅょゎァィゥェォッャュョんンー]/;
// ん di awal potongan sah bila itu ～んです (pola Bab 26): んです, んでした, んでしょう, んじゃ.
const AWAL_N_SAH = /^ん(です|でした|でしょう|じゃ)/;
const PARTIKEL_TUNGGAL = new Set([...'はがをにへでともやのかねよ']);
const SATU_KANA = /^[ぁ-ゖァ-ヺ]$/;
// Akhiran konjugasi yang terputus dari batangnya di batas potongan: ま|しょ|う, くだ|さい, まし|た, いけま|せん,
// でし|た, で|す, で|しょう. で|した TIDAK ditolak: で adalah partikel + した (としょかんで｜した, Minna Bab 20).
// いけ|ません tidak tertangkap (batangnya いけ ada di luar daftar); hanya akhiran yang lepas dari ま/まし/ませ.
const BATAS = String.raw`(?:\||$|[。、？！])`;
const TERPUTUS = new RegExp(
  String.raw`(?:ま|まし|ませ|ましょ|くだ|くださ)\|(?:す|した|た|せん|ん|しょう?|う|さい|い)${BATAS}`
  + String.raw`|(?:でし)\|た${BATAS}`
  + String.raw`|(?:で)\|(?:す|しょう)${BATAS}`,
);
const STATUS_SAH = ['draf', 'ditinjau'];
const MIN_LATIN_TERJEMAHAN = 10;
const MIN_LATIN_PEMBAHASAN = 15;
const hurufLatin = (s) => (String(s).match(HURUF_LATIN_SEMUA) || []).length;
const permutasiValid = (u) => Array.isArray(u) && u.length === JUMLAH_KOTAK
  && [...u].sort((a, b) => a - b).every((n, i) => n === i);

const teksAda = (v) => typeof v === 'string' && v.trim() !== '';
const tanpaSpasi = (s) => String(s).replace(/\s+/g, '');

/** Semua teks Jepang satu soal (dengan furigana), untuk pemeriksaan huruf. */
function semuaTeks(soal) {
  const daftar = [];
  if (typeof soal.situasi === 'string') daftar.push(soal.situasi);
  for (const b of soal.baris || []) {
    for (const kunci of ['teks', 'sebelum', 'sesudah']) {
      if (typeof b?.[kunci] === 'string') daftar.push(b[kunci]);
    }
  }
  for (const p of soal.potongan || []) if (typeof p === 'string') daftar.push(p);
  return daftar;
}

/** Kalimat utuh (baris soal) dengan potongan dalam urutan kunci. Memakai furigana; pakai tanpaFurigana untuk teks polos. */
export function kalimatUtuh(soal) {
  const baris = (soal.baris || []).find((b) => b && b.teks === undefined);
  const bagian = [baris?.sebelum, ...(soal.potongan || []), baris?.sesudah]
    .filter((s) => typeof s === 'string' && s !== '');
  return bagian.join(' ').replace(/ ([。、！？」』）])/g, '$1');
}

/** Masalah mekanis satu soal; [] = lolos. Dipakai npm test dan gate skill. */
export function validasiSoalBintang(soal, { katalog, jlpt }) {
  const masalah = [];
  const tambah = (m) => masalah.push(m);
  if (!soal || typeof soal !== 'object') return ['soal bukan objek'];

  const nomorId = typeof soal.id === 'string' ? soal.id.match(/-(\d+)$/)?.[1] : undefined;
  if (!nomorId || soal.id !== `${jlpt}-${soal.pola}-${nomorId}`) {
    tambah(`id harus berformat ${jlpt}-<pola>-<n>: ${soal.id}`);
  }
  const entri = (katalog || []).find((e) => e.id === soal.pola);
  if (!entri) tambah(`pola tidak ada di katalog: ${soal.pola}`);
  else if (entri.tingkat !== jlpt) tambah(`pola ${soal.pola} bertingkat ${entri.tingkat}, bukan ${jlpt}`);

  const baris = Array.isArray(soal.baris) ? soal.baris : [];
  const barisSoal = baris.filter((b) => b && b.teks === undefined);
  if (barisSoal.length !== 1) tambah('harus tepat satu baris soal (punya sebelum/sesudah, tanpa teks)');
  for (const b of baris) {
    if (!b || typeof b !== 'object') { tambah('baris bukan objek'); continue; }
    if (b.teks !== undefined) {
      if (!teksAda(b.teks)) tambah('baris biasa dengan teks kosong');
      if (b.sebelum !== undefined || b.sesudah !== undefined) tambah('baris punya teks sekaligus sebelum/sesudah');
    } else if (typeof b.sebelum !== 'string' || typeof b.sesudah !== 'string') {
      tambah('baris soal harus punya sebelum dan sesudah (boleh string kosong)');
    }
  }

  const potongan = Array.isArray(soal.potongan) ? soal.potongan : [];
  if (potongan.length !== JUMLAH_KOTAK) tambah(`harus ${JUMLAH_KOTAK} potongan, bukan ${potongan.length}`);
  if (potongan.some((p) => !teksAda(p))) tambah('ada potongan kosong');
  else {
    const polos = potongan.map((p) => tanpaSpasi(tanpaFurigana(p)));
    if (new Set(polos).size !== polos.length) tambah('potongan kembar');
    if (polos.some((p) => TANDA_BACA.test(p))) tambah('potongan hanya tanda baca');
    for (const p of polos) {
      if ((TIDAK_BISA_AWAL.test(p) && !AWAL_N_SAH.test(p)) || p.startsWith('って')) tambah(`potongan dipotong di tengah kata: ${p}`);
      if (SATU_KANA.test(p) && !PARTIKEL_TUNGGAL.has(p)) tambah(`potongan satu kana yang bukan partikel: ${p}`);
    }
    if (barisSoal.length === 1) {
      const gabung = [barisSoal[0].sebelum, ...potongan, barisSoal[0].sesudah]
        .map((x) => tanpaSpasi(tanpaFurigana(typeof x === 'string' ? x : ''))).join('|');
      const m = gabung.match(TERPUTUS);
      if (m) tambah(`kata terputus di batas potongan: ${m[0]}`);
    }
  }

  if (!Number.isInteger(soal.bintang) || soal.bintang < 0 || soal.bintang >= JUMLAH_KOTAK) {
    tambah('bintang harus bilangan bulat 0-3');
  } else if (potongan.length === JUMLAH_KOTAK && Array.isArray(soal.urutanLain)) {
    const terlihat = new Set();
    for (const u of soal.urutanLain) {
      if (!permutasiValid(u)) { tambah(`urutanLain bukan permutasi 0-3: ${JSON.stringify(u)}`); continue; }
      if (terlihat.has(u.join(','))) tambah(`urutanLain kembar: ${JSON.stringify(u)}`);
      terlihat.add(u.join(','));
      if (u.every((n, i) => n === i)) tambah('urutanLain sama dengan urutan kunci');
      else if (potongan[u[soal.bintang]] !== potongan[soal.bintang]) {
        tambah(`urutanLain ${JSON.stringify(u)} menjatuhkan potongan lain di ★`);
      }
    }
  }
  if (soal.urutanLain !== undefined && !Array.isArray(soal.urutanLain)) tambah('urutanLain harus array');

  const kanjiBoleh = kanjiTingkat(jlpt);
  for (const teks of semuaTeks(soal)) {
    if (!furiganaLengkap(teks)) tambah(`furigana kurang: ${teks}`);
    const polos = tanpaFurigana(teks);
    if (HURUF_LATIN.test(polos)) tambah(`huruf Latin: ${teks}`);
    for (const k of polos.match(HURUF_KANJI) || []) {
      if (!kanjiBoleh.has(k)) tambah(`kanji di luar tingkat ${jlpt}: ${k} (${teks})`);
    }
  }

  const utuh = tanpaSpasi(tanpaFurigana(kalimatUtuh(soal)));
  const maks = PANJANG_MAKS[jlpt];
  if (maks && utuh.length > maks) tambah(`kalimat utuh ${utuh.length} karakter, maks ${maks}`);

  // Soal bintang tidak punya level L1-L5. L5 = paling longgar: hanya pola yang jelas di atas tingkat yang ditolak.
  const teksPemeriksa = tanpaSpasi(tanpaFurigana(
    [...baris.filter((b) => b?.teks !== undefined).map((b) => b.teks), kalimatUtuh(soal)].join(' '),
  ));
  for (const { nama } of polaDiAtasTingkat(teksPemeriksa, jlpt, 'L5')) {
    tambah(`pola di atas tingkat ${jlpt}: ${nama}`);
  }

  if (!teksAda(soal.terjemahan)) tambah('terjemahan kosong');
  else if (hurufLatin(soal.terjemahan) < MIN_LATIN_TERJEMAHAN) tambah('terjemahan harus berupa kalimat bahasa Indonesia (min 10 huruf Latin)');
  if (!teksAda(soal.pembahasan)) tambah('pembahasan kosong');
  else if (hurufLatin(soal.pembahasan) < MIN_LATIN_PEMBAHASAN) tambah('pembahasan harus berisi penjelasan bahasa Indonesia (min 15 huruf Latin)');
  if (!STATUS_SAH.includes(soal.status)) tambah(`status harus draf atau ditinjau: ${soal.status}`);
  return masalah;
}

/**
 * Masalah tingkat bank: id unik, kalimat utuh tidak kembar, sebaran posisi ★ (dan masalah tiap soal).
 * `kelompok` = daftar kelompok id pola (mis. pola per volume); tanpa itu seluruh bank satu kelompok.
 */
export function validasiBankBintang(bank, { katalog, jlpt, kelompok = null } = {}) {
  const masalah = [];
  const ids = new Set();
  const utuh = new Map();
  for (const soal of bank || []) {
    if (ids.has(soal.id)) masalah.push(`id kembar: ${soal.id}`);
    ids.add(soal.id);
    const kunci = tanpaSpasi(tanpaFurigana(kalimatUtuh(soal)));
    if (utuh.has(kunci)) masalah.push(`kalimat utuh kembar: ${soal.id} dan ${utuh.get(kunci)}`);
    else utuh.set(kunci, soal.id);
    for (const m of validasiSoalBintang(soal, { katalog, jlpt })) masalah.push(`${soal.id}: ${m}`);
  }
  const semuaPola = [...new Set((bank || []).map((s) => s.pola))];
  for (const pola of semuaPola) {
    const posisi = (bank || []).filter((s) => s.pola === pola).map((s) => s.bintang);
    if (posisi.length >= 3 && new Set(posisi).size < 2) masalah.push(`posisi ★ sama di semua varian pola ${pola}`);
  }
  for (const grup of kelompok || [semuaPola]) {
    const soalGrup = (bank || []).filter((s) => grup.includes(s.pola));
    if (soalGrup.length < 8) continue;
    for (let p = 0; p < JUMLAH_KOTAK; p += 1) {
      const bagian = soalGrup.filter((s) => s.bintang === p).length / soalGrup.length;
      if (bagian > 0.6) masalah.push(`sebaran ★ miring: ${Math.round(bagian * 100)}% di kotak ${p + 1}`);
    }
  }
  return masalah;
}

function acak(daftar, rng) {
  const hasil = [...daftar];
  for (let i = hasil.length - 1; i > 0; i -= 1) {
    const j = Math.min(i, Math.floor(rng() * (i + 1)));
    [hasil[i], hasil[j]] = [hasil[j], hasil[i]];
  }
  return hasil;
}

/**
 * Kertas untuk peserta. Urutan potongan diacak, lalu diberi nomor 1-4.
 * `benar` dan `urutan` ikut dikirim agar umpan balik langsung tampil (seperti KanjiRunner);
 * server tetap menilai ulang dari kertas yang disimpan.
 */
export function kertasSoalBintang(soal, rng = Math.random) {
  // tampil[k] = indeks potongan (urutan kunci) yang tampil sebagai nomor k+1
  const tampil = acak([0, 1, 2, 3], rng);
  const nomorDari = new Map(tampil.map((asli, k) => [asli, k + 1]));
  return {
    id: soal.id,
    pola: soal.pola,
    situasi: soal.situasi ?? null,
    baris: soal.baris,
    bintang: soal.bintang,
    pilihan: tampil.map((asli, k) => ({ nomor: k + 1, teks: soal.potongan[asli] })),
    benar: nomorDari.get(soal.bintang),
    urutan: [0, 1, 2, 3].map((asli) => nomorDari.get(asli)),
    terjemahan: soal.terjemahan,
    pembahasan: soal.pembahasan,
  };
}

export function nilaiSoalBintang(kertas, nomorDipilih) {
  if (typeof nomorDipilih !== 'number' && typeof nomorDipilih !== 'string') return false; // Number(true) === 1
  const n = Number(nomorDipilih);
  return Number.isInteger(n) && n === kertas.benar;
}
