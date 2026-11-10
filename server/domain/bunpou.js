// Bunpou modules: JOYdata's official list of sentence patterns per JLPT level, and what dokkai does with it.
// A module is data only (bankSoal/bunpou<JLPT>.js); registering it here is what makes the AI writer follow it
// and lets the fixed dokkai bank of that level tag its passages with pattern numbers.

import { BUNPOU_N4 } from './bankSoal/bunpouN4.js';
import { furiganaLengkap } from './tesOnline.js';

export const MODUL_BUNPOU = { N4: BUNPOU_N4 };

// Dokkai levels in rising order; a pattern's `level` is the first level that uses it.
export const LEVEL_BUNPOU = ['L1', 'L2', 'L3', 'L4', 'L5'];
// Fewer patterns than this at one level and its passages would all practise the same few.
export const MIN_POLA_PER_LEVEL = 6;
// How many patterns of its own level a bank passage must practise, and how many numbers a tag may list.
export const MIN_FOKUS_BACAAN = 2;
export const MAKS_TAG_BACAAN = 4;

const DAFTAR = Object.fromEntries(
  Object.entries(MODUL_BUNPOU).map(([jlpt, modul]) => [
    jlpt,
    modul.kategori.flatMap((k) => k.pola.map((p) => ({ ...p, kategori: k.nomor, kategoriJudul: k.judul }))),
  ])
);

/** Every pattern of a level's module in module order; [] when that level has no module. */
export const polaBunpou = (jlpt) => DAFTAR[jlpt] || [];

export const cariPolaBunpou = (jlpt, nomor) => polaBunpou(jlpt).find((p) => p.nomor === nomor) || null;

/** The patterns in short, for lists and chips (staff bank view). */
export const ringkasanPolaBunpou = (jlpt) => polaBunpou(jlpt).map(({ nomor, pola, arti, level }) => ({ nomor, pola, arti, level }));

/**
 * What a dokkai level works with: fokus = the patterns of that level, boleh = those of easier levels (already
 * known), nanti = those of harder levels (not used yet). null when the level has no module.
 */
export function polaBunpouLevel(jlpt, level) {
  const urut = LEVEL_BUNPOU.indexOf(level);
  const semua = polaBunpou(jlpt);
  if (urut < 0 || !semua.length) return null;
  const posisi = (p) => LEVEL_BUNPOU.indexOf(p.level);
  return {
    fokus: semua.filter((p) => posisi(p) === urut),
    boleh: semua.filter((p) => posisi(p) < urut),
    nanti: semua.filter((p) => posisi(p) > urut),
  };
}

/**
 * Why the pattern tag of a bank passage is not valid, or null. `bunpou` lists the module numbers the passage
 * practises: unique numbers of that module, none from a harder level, at least MIN_FOKUS_BACAAN of its own level.
 */
export function alasanTagBunpou(jlpt, level, bunpou) {
  const set = polaBunpouLevel(jlpt, level);
  if (!set) return 'tanpa_modul';
  if (!Array.isArray(bunpou) || !bunpou.length || bunpou.length > MAKS_TAG_BACAAN) return 'bentuk';
  if (!bunpou.every(Number.isInteger) || new Set(bunpou).size !== bunpou.length) return 'bentuk';
  if (bunpou.some((n) => !cariPolaBunpou(jlpt, n))) return 'nomor';
  if (bunpou.some((n) => set.nanti.some((p) => p.nomor === n))) return 'level';
  if (bunpou.filter((n) => set.fokus.some((p) => p.nomor === n)).length < MIN_FOKUS_BACAAN) return 'fokus';
  return null;
}

const teks = (v) => typeof v === 'string' && v.trim() === v && v.length > 0;
const ADA_JEPANG = /[぀-ヿ㐀-鿿]/;

/** Everything wrong with a module's data, as readable lines; [] = the module can be registered. */
export function periksaModulBunpou(modul) {
  const salah = [];
  const catat = (di, pesan) => salah.push(`${di}: ${pesan}`);
  if (!/^N[1-5]$/.test(modul?.jlpt || '')) catat('modul', 'jlpt harus N1–N5');
  for (const k of ['judul', 'sumber']) if (!teks(modul?.[k])) catat('modul', `${k} kosong`);
  const kategori = Array.isArray(modul?.kategori) ? modul.kategori : [];
  if (!kategori.length) catat('modul', 'kategori kosong');

  const nomorPola = [];
  kategori.forEach((k, i) => {
    if (k?.nomor !== i + 1) catat(`kategori ke-${i + 1}`, `nomor harus ${i + 1}`);
    if (!teks(k?.judul)) catat(`kategori ${k?.nomor}`, 'judul kosong');
    if (!Array.isArray(k?.pola) || !k.pola.length) catat(`kategori ${k?.nomor}`, 'tanpa pola');
    for (const p of k?.pola || []) {
      const di = `pola ${p?.nomor}`;
      if (!Number.isInteger(p?.nomor) || p.nomor <= 0) catat(di, 'nomor harus bilangan bulat positif');
      else nomorPola.push(p.nomor);
      for (const f of ['pola', 'arti', 'penjelasan']) if (!teks(p?.[f])) catat(di, `${f} kosong atau berspasi di ujung`);
      if (!LEVEL_BUNPOU.includes(p?.level)) catat(di, `level harus salah satu ${LEVEL_BUNPOU.join('/')}`);
      if (!Array.isArray(p?.rumus) || !p.rumus.length || !p.rumus.every(teks)) catat(di, 'rumus harus daftar teks');
      if (!Array.isArray(p?.contoh) || !p.contoh.length) catat(di, 'tanpa contoh');
      for (const [j, c] of (p?.contoh || []).entries()) {
        const dc = `${di} contoh ${j + 1}`;
        if (!teks(c?.jp) || !ADA_JEPANG.test(c.jp)) catat(dc, 'kalimat Jepang kosong');
        else {
          if (!furiganaLengkap(c.jp)) catat(dc, 'ada kanji tanpa furigana 漢字{かな}');
          if (/[\s　]/.test(c.jp)) catat(dc, 'kalimat Jepang memuat spasi');
          if (/[0-9０-９A-Za-z]/.test(c.jp)) catat(dc, 'angka ditulis dengan kanji, tanpa huruf Latin');
        }
        if (!teks(c?.id) || /[{}]/.test(c.id)) catat(dc, 'terjemahan kosong atau memuat {}');
      }
    }
  });
  nomorPola.forEach((n, i) => {
    if (i && n <= nomorPola[i - 1]) catat(`pola ${n}`, 'nomor harus naik dan tidak berulang');
  });

  const semua = kategori.flatMap((k) => k?.pola || []);
  for (const level of LEVEL_BUNPOU) {
    const n = semua.filter((p) => p?.level === level).length;
    if (n < MIN_POLA_PER_LEVEL) catat(`level ${level}`, `${n} pola, minimal ${MIN_POLA_PER_LEVEL}`);
  }

  const ada = new Set(nomorPola);
  const gabungan = modul?.gabungan || {};
  for (const [dari, ke] of Object.entries(gabungan)) {
    if (ada.has(Number(dari))) catat(`gabungan ${dari}`, 'nomor ini masih ada sebagai pola');
    if (!ada.has(ke)) catat(`gabungan ${dari}`, `pola tujuan ${ke} tidak ada`);
  }
  for (const [i, k] of (modul?.koreksi || []).entries()) {
    if (k?.nomor !== 0 && !ada.has(k?.nomor)) catat(`koreksi ke-${i + 1}`, `pola ${k?.nomor} tidak ada`);
    if (!teks(k?.catatan)) catat(`koreksi ke-${i + 1}`, 'catatan kosong');
  }
  return salah;
}

/**
 * Everything wrong with the fixed dokkai bank of a level against its module: every passage tagged validly and
 * every pattern of the module practised by at least one passage of its own level. levels: [{ kode, bacaan }].
 */
export function periksaBankBunpou(jlpt, levels) {
  const salah = [];
  const dipakai = new Set();
  for (const l of levels) {
    for (const b of l.bacaan) {
      const alasan = alasanTagBunpou(jlpt, l.kode, b.bunpou);
      if (alasan) salah.push(`${b.id}: tag bunpou tidak sah (${alasan})`);
      else b.bunpou.filter((n) => cariPolaBunpou(jlpt, n).level === l.kode).forEach((n) => dipakai.add(n));
    }
  }
  // Coverage only counts once a level has passages: a bank may be filled one level at a time.
  const terisi = new Set(levels.filter((l) => l.bacaan.length).map((l) => l.kode));
  for (const p of polaBunpou(jlpt)) {
    if (terisi.has(p.level) && !dipakai.has(p.nomor)) salah.push(`pola ${p.nomor} (${p.pola}) belum dipakai bacaan ${p.level}`);
  }
  return salah;
}
