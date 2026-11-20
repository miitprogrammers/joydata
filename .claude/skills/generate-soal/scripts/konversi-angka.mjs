// Revision helper (D4): kanji numerals with a counter become Arabic numerals, furigana kept on the counter.
//   node siapkan.mjs --kerja <folder> --jlpt N5 --revisi-dari docs/kb-dokkai/data/dampak-bank.json --kategori angka
//   node konversi-angka.mjs --kerja <folder> [L1 …]
// Rewrites gen/<level>.json in place (title, text, questions, options; the explanation quotes follow the text) and
// writes laporan-angka.md: every change, and every number it could not convert safely marked PERIKSA.
//   六時{ろくじ} → 6時{じ} · 六本{ろっぽん} → 6本{ぽん} · 三百円{さんびゃくえん} → 300円{えん} · 二十日{はつか} → 20日{はつか}
//   三{さん}か月{げつ} → 3か月{げつ} · 一人{ひとり}, 二人{ふたり}, 一緒, 一度, 一番, 十分{じゅうぶん}, 一{ひと}つ: unchanged
import fs from 'fs';
import path from 'path';
import { argumen, bacaGen, bacaRencana, dirKerja, kanonik, levelDipilih, polos } from './_umum.mjs';

const ANGKA = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
const SATUAN = { 十: 10, 百: 100, 千: 1000 };
/** 三百五十 → 350, 二万 → 20000; null when it is not a well-formed kanji number. */
export function angkaDariKanji(s) {
  let total = 0;
  let bagian = 0;
  let digit = null;
  for (const c of s) {
    if (c in ANGKA) {
      if (digit !== null) return null;
      digit = ANGKA[c];
    } else if (c in SATUAN) {
      bagian += (digit ?? 1) * SATUAN[c];
      digit = null;
    } else if (c === '万') {
      total += (bagian + (digit ?? 0) || 1) * 10000;
      bagian = 0;
      digit = null;
    } else return null;
  }
  return total + bagian + (digit ?? 0);
}

const BACA_SATU = { 1: ['いち', 'いっ'], 2: ['に'], 3: ['さん'], 4: ['よん', 'よ', 'し'], 5: ['ご'], 6: ['ろく', 'ろっ'], 7: ['なな', 'しち'], 8: ['はち', 'はっ'], 9: ['きゅう', 'く'] };
const BACA_SATU_BAKU = { 1: 'いち', 2: 'に', 3: 'さん', 4: 'よん', 5: 'ご', 6: 'ろく', 7: 'なな', 8: 'はち', 9: 'きゅう' };
const BACA_RATUS = { 1: 'ひゃく', 2: 'にひゃく', 3: 'さんびゃく', 4: 'よんひゃく', 5: 'ごひゃく', 6: 'ろっぴゃく', 7: 'ななひゃく', 8: 'はっぴゃく', 9: 'きゅうひゃく' };
const BACA_RIBU = { 1: 'せん', 2: 'にせん', 3: 'さんぜん', 4: 'よんせん', 5: 'ごせん', 6: 'ろくせん', 7: 'ななせん', 8: 'はっせん', 9: 'きゅうせん' };
/** Every way the number itself may be read before a counter (sound changes on the last part). */
export function bacaanAngka(n) {
  if (!Number.isInteger(n) || n <= 0 || n >= 100000000) return [];
  const bagian = [];
  const man = Math.floor(n / 10000);
  const sisa = n % 10000;
  const ribu = Math.floor(sisa / 1000);
  const ratus = Math.floor((sisa % 1000) / 100);
  const puluh = Math.floor((sisa % 100) / 10);
  const satu = sisa % 10;
  if (man) bagian.push([`${bacaanAngka(man).find((x) => !/っ$/.test(x)) ?? ''}まん`]);
  if (ribu) bagian.push([BACA_RIBU[ribu], ...(ribu === 1 ? ['いっせん'] : [])]);
  if (ratus) bagian.push([BACA_RATUS[ratus]]);
  if (puluh) {
    const awal = puluh === 1 ? '' : BACA_SATU_BAKU[puluh];
    bagian.push([`${awal}じゅう`, `${awal}じゅっ`, `${awal}じっ`]);
  }
  if (satu) bagian.push(BACA_SATU[satu]);
  // Only the last part takes a sound change; the others are read the standard way.
  let hasil = [''];
  bagian.forEach((varian, i) => {
    const pakai = i === bagian.length - 1 ? varian : [varian[0]];
    hasil = hasil.flatMap((h) => pakai.map((v) => h + v));
  });
  return [...new Set(hasil)];
}

const PENGHITUNG = ['時間', '週間', 'ページ', '年生', '番線', '時', '分', '円', '人', '本', '枚', '冊', '日', '月', '年', '回', '階', '番', '歳', '才', '個', '台', '杯', '度', '号', '名', '匹', '着', '足', '軒', '件', '秒', '点'];
const HARI_KHUSUS = { 1: 'ついたち', 2: 'ふつか', 3: 'みっか', 4: 'よっか', 5: 'いつか', 6: 'むいか', 7: 'なのか', 8: 'ようか', 9: 'ここのか', 10: 'とおか', 14: 'じゅうよっか', 20: 'はつか', 24: 'にじゅうよっか' };
// Fixed words that only look like numbers, by text and reading.
const TETAP = [['一人', null], ['二人', null], ['一緒', null], ['一度', null], ['一番', 'いちばん'], ['十分', 'じゅうぶん'], ['一日', 'いちにち'], ['一日中', null], ['一年中', null], ['一生懸命', null], ['八百屋', null], ['七夕', null], ['一般', null], ['一部', null]];
const tetap = (base, baca) => TETAP.some(([k, b]) => base === k && (b === null || b === baca));

const RUN = /([㐀-鿿々]+)\{([^{}]*)\}/g;
const ANGKA_KANJI = '一二三四五六七八九十百千万';
// What may follow the counters inside one furigana block: 6時半, 3年間, 3日後, 2年目, 1年中, 3名様.
const AKHIRAN = { 半: ['はん'], 間: ['かん'], 前: ['まえ'], 後: ['ご', 'あと'], 目: ['め'], 中: ['じゅう', 'ちゅう'], 様: ['さま'] };
const PENGHITUNG_PANJANG = [...PENGHITUNG].sort((a, b) => b.length - a.length);

/**
 * A block made of number + counter parts and an optional ending (七時十分{しちじじゅっぷん}, 三日間{みっかかん}). Returns
 * the Arabic form with furigana on the counters and the ending (7時{じ}10分{ぷん}, 3日{みっか}間{かん}), or null when the
 * block is not of that shape or its reading splits in more than one way.
 */
function konversiGabungan(base, baca) {
  const bagian = [];
  let i = 0;
  while (i < base.length) {
    const awalan = base.slice(i).match(new RegExp(`^[${ANGKA_KANJI}]+`))?.[0];
    if (!awalan) break;
    const nilai = angkaDariKanji(awalan);
    const satuan = PENGHITUNG_PANJANG.find((p) => base.startsWith(p, i + awalan.length));
    if (nilai === null || !satuan) return null;
    bagian.push({ nilai, satuan });
    i += awalan.length + satuan.length;
  }
  const akhiran = base.slice(i);
  if (!bagian.length || (akhiran && (akhiran.length !== 1 || !AKHIRAN[akhiran]))) return null;
  if (bagian.length === 1 && !akhiran) return null; // the plain case is handled by konversiTeks itself
  const hasil = [];
  const cari = (k, sisa, susun) => {
    if (k === bagian.length) {
      if (!akhiran && !sisa) hasil.push(susun.join(''));
      for (const r of akhiran ? AKHIRAN[akhiran] : []) if (sisa === r) hasil.push(`${susun.join('')}${akhiran}{${r}}`);
      return;
    }
    const { nilai, satuan } = bagian[k];
    // 3日 read みっか keeps the whole reading on 日, as the plain conversion does.
    if (satuan === '日' && HARI_KHUSUS[nilai] && sisa.startsWith(HARI_KHUSUS[nilai])) {
      cari(k + 1, sisa.slice(HARI_KHUSUS[nilai].length), [...susun, `${nilai}日{${HARI_KHUSUS[nilai]}}`]);
      return;
    }
    for (const b of bacaanAngka(nilai)) {
      if (!sisa.startsWith(b)) continue;
      for (let n = 1; b.length + n <= sisa.length; n++) {
        cari(k + 1, sisa.slice(b.length + n), [...susun, `${nilai}${satuan}{${sisa.slice(b.length, b.length + n)}}`]);
      }
    }
  };
  cari(0, baca, []);
  const unik = [...new Set(hasil)];
  return unik.length === 1 ? unik[0] : null;
}

/** Converts one field. Returns { teks, ubah: [[lama, baru]], periksa: [pesan] }. */
/** pakaiMan = write round ten-thousands with 万 (15万円); false = full digits (150000円). */
export function konversiTeks(teks, { pakaiMan = true } = {}) {
  const ubah = [];
  const periksa = [];
  const hasil = String(teks).replace(RUN, (utuh, base, baca, offset, semua) => {
    const awalan = base.match(new RegExp(`^[${ANGKA_KANJI}]+`))?.[0] || '';
    if (!awalan || tetap(base, baca)) return utuh;
    const nilai = angkaDariKanji(awalan);
    const sisa = base.slice(awalan.length);
    if (nilai === null) {
      periksa.push(`${utuh}: bentuk angka tidak dikenal`);
      return utuh;
    }
    const sesudah = semua.slice(offset + utuh.length, offset + utuh.length + 1);
    if (!sisa) {
      // 一{ひと}つ … 九つ stay; 三{さん}か月, 三{さん}ページ become 3か月, 3ページ.
      if (sesudah === 'つ') return utuh;
      const baru = String(nilai);
      ubah.push([utuh, baru]);
      return baru;
    }
    const satuan = PENGHITUNG.find((p) => sisa === p);
    const gabungan = satuan ? null : konversiGabungan(base, baca);
    if (gabungan) {
      ubah.push([utuh, gabungan]);
      return gabungan;
    }
    if (!satuan) {
      periksa.push(`${utuh}: bukan angka + satuan yang dikenal — biarkan atau ubah manual`);
      return utuh;
    }
    let bacaSatuan = null;
    if (satuan === '日' && HARI_KHUSUS[nilai] === baca) bacaSatuan = baca;
    else if (satuan === '歳' && nilai === 20 && baca === 'はたち') bacaSatuan = baca;
    else {
      const cocok = bacaanAngka(nilai).filter((b) => baca.startsWith(b) && baca.length > b.length).sort((a, b) => b.length - a.length)[0];
      if (cocok) bacaSatuan = baca.slice(cocok.length);
    }
    if (!bacaSatuan) {
      periksa.push(`${utuh}: bacaan satuan tidak bisa dipisah dari bacaan angka — tulis manual`);
      return utuh;
    }
    // Round ten-thousands keep 万, as Japanese prices do: 15万円{まんえん}, not 150000円.
    const baru = pakaiMan && nilai >= 10000 && nilai % 10000 === 0
      ? `${nilai / 10000}万${satuan}{まん${bacaSatuan}}`
      : `${nilai}${satuan}{${bacaSatuan}}`;
    ubah.push([utuh, baru]);
    return baru;
  });
  return { teks: hasil, ubah, periksa };
}

/**
 * Converts every field of a passage; the explanation quotes get the same replacements as the text. Amounts of 10000
 * and more get one format per passage: with 万 only when every such amount is a round ten-thousand.
 */
export function konversiBacaan(b, { pakaiMan = true } = {}) {
  const ubah = [];
  const periksa = [];
  const k = (t) => {
    const r = konversiTeks(t, { pakaiMan });
    ubah.push(...r.ubah);
    periksa.push(...r.periksa);
    return r.teks;
  };
  const baru = {
    ...b,
    judul: k(b.judul),
    teks: k(b.teks),
    soal: b.soal.map((s) => ({ ...s, tanya: k(s.tanya), opsi: s.opsi.map(k) })),
  };
  // Plain-text replacements, longest first: 三百円 → 300円 in the explanations, as in the text.
  const peta = [...new Map(ubah.map(([lama, br]) => [polos(lama), polos(br)]))].sort((a, b) => b[0].length - a[0].length);
  baru.soal = baru.soal.map((s) => ({ ...s, pembahasan: peta.reduce((t, [lama, br]) => t.split(lama).join(br), s.pembahasan) }));
  const sisaKanji = [...`${baru.judul} ${baru.teks} ${baru.soal.map((s) => [s.tanya, ...s.opsi].join(' ')).join(' ')}`.replace(RUN, '$1').replace(/一年中|一日中/g, '').matchAll(new RegExp(`(?<![0-9])[${ANGKA_KANJI}]+(時|分|円|人|本|枚|冊|日|月|年|回|階)`, 'g'))]
    .map((m) => m[0])
    .filter((x) => !['一人', '二人', '一日', '一度', '一番', '十分'].includes(x));
  if (sisaKanji.length) periksa.push(`masih ada angka kanji tanpa furigana: ${[...new Set(sisaKanji)].join(', ')}`);
  const polosSemua = [baru.judul, baru.teks, ...baru.soal.flatMap((s) => [s.tanya, ...s.opsi])].map(polos).join(' ');
  if (pakaiMan && /[0-9]+万円/.test(polosSemua) && /(?<![0-9])[0-9]{5,}円/.test(polosSemua)) return konversiBacaan(b, { pakaiMan: false });
  return { bacaan: kanonik(baru), ubah, periksa };
}

const arg = argumen();
if (!arg.kerja) {
  // Imported by a test or another script.
} else {
  const kerja = dirKerja(arg);
  const rencana = bacaRencana(kerja);
  if (rencana.mode !== 'revisi') {
    console.log('konversi-angka.mjs hanya untuk folder kerja mode revisi (siapkan.mjs --revisi / --revisi-dari).');
    process.exit(2);
  }
  const laporan = ['# Laporan konversi angka', ''];
  let jumlahUbah = 0;
  let jumlahPeriksa = 0;
  for (const level of levelDipilih(arg, rencana)) {
    const gen = bacaGen(kerja, level);
    if (gen.galat) {
      console.log(`${level}: ${gen.galat}`);
      continue;
    }
    laporan.push(`## ${level}`, '');
    const hasil = gen.data.map((b) => {
      const r = konversiBacaan(b);
      if (r.ubah.length || r.periksa.length) {
        laporan.push(`- **${b.id}**: ${[...new Set(r.ubah.map(([a, c]) => `${a} → ${c}`))].join(' · ') || '(tidak ada perubahan)'}`);
        for (const p of r.periksa) laporan.push(`  - PERIKSA: ${p}`);
      }
      jumlahUbah += r.ubah.length;
      jumlahPeriksa += r.periksa.length;
      return r.bacaan;
    });
    fs.writeFileSync(gen.file, `${JSON.stringify(hasil, null, 2)}\n`);
    laporan.push('');
  }
  fs.writeFileSync(path.join(kerja, 'laporan-angka.md'), `${laporan.join('\n')}\n`);
  console.log(`Konversi selesai: ${jumlahUbah} angka diubah, ${jumlahPeriksa} catatan PERIKSA → laporan-angka.md`);
}
