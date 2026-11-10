#!/usr/bin/env node
// Checks a bunpou module (server/domain/bankSoal/bunpou<JLPT>.js) and how far it is wired into the app.
//   node periksa-modul.mjs --jlpt N4          a module registered in MODUL_BUNPOU
//   node periksa-modul.mjs --file <path>      a module file, registered or not (path from the repo root)
//   --daftar     list the patterns per dokkai level, to review the spread
//   --bacaan N   passages per level planned for the fixed bank: a level can hold at most 2N patterns
// Exit code 1 when the module data is not valid or the bank's pattern tags do not match the module.
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const DIR_SKRIP = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(DIR_SKRIP, '../../../..');
const FILE_UMUM = '.claude/skills/generate-soal/scripts/_umum.mjs';
const muat = (rel) => import(pathToFileURL(path.join(ROOT, rel)).href);

const arg = process.argv.slice(2);
const nilai = (nama) => (arg.includes(nama) ? arg[arg.indexOf(nama) + 1] : null);
const berhenti = (pesan) => {
  console.log(pesan);
  process.exit(2);
};

const { MODUL_BUNPOU, LEVEL_BUNPOU, periksaModulBunpou, periksaBankBunpou } = await muat('server/domain/bunpou.js');

const file = nilai('--file');
const jlptArg = nilai('--jlpt');
const bacaan = Number(nilai('--bacaan')) || 0;
if (!file && !jlptArg) {
  berhenti(
    [
      'Pakai: node periksa-modul.mjs --jlpt <N5|N4|N3> | --file <path> [--daftar] [--bacaan <per level>]',
      `Modul terdaftar: ${Object.keys(MODUL_BUNPOU).join(', ') || '(belum ada)'}`,
    ].join('\n')
  );
}

let modul;
if (file) {
  const abs = path.resolve(ROOT, file);
  if (!fs.existsSync(abs)) berhenti(`File tidak ada: ${abs}`);
  const isi = await import(pathToFileURL(abs).href);
  modul = Object.values(isi).find((v) => v && typeof v === 'object' && Array.isArray(v.kategori));
  if (!modul) berhenti(`${file} tidak mengekspor modul (objek dengan daftar \`kategori\`).`);
} else {
  modul = MODUL_BUNPOU[jlptArg];
  if (!modul) {
    berhenti(
      `Modul ${jlptArg} belum terdaftar di MODUL_BUNPOU (ada: ${Object.keys(MODUL_BUNPOU).join(', ') || '-'}). ` +
        'File yang belum didaftarkan diperiksa dengan --file.'
    );
  }
}

const jlpt = modul.jlpt;
const kategori = Array.isArray(modul.kategori) ? modul.kategori : [];
const pola = kategori.flatMap((k) => (k?.pola || []).map((p) => ({ ...p, kategori: k.nomor })));
const nomor = pola.map((p) => p.nomor).filter(Number.isInteger);
const gabungan = modul.gabungan || {};
const perLevel = Object.fromEntries(LEVEL_BUNPOU.map((l) => [l, pola.filter((p) => p.level === l)]));

console.log(`Modul ${jlpt} — ${modul.judul}`);
console.log(`  Sumber    : ${modul.sumber}`);
console.log(`  Kategori  : ${kategori.length}`);
console.log(`  Pola      : ${pola.length}${nomor.length ? ` (nomor ${Math.min(...nomor)}–${Math.max(...nomor)})` : ''}`);
console.log(`  Per level : ${LEVEL_BUNPOU.map((l) => `${l} ${perLevel[l].length}`).join(' · ')}`);
console.log(`  Gabungan  : ${Object.keys(gabungan).length ? Object.entries(gabungan).map(([a, b]) => `${a}→${b}`).join(', ') : '-'}`);
console.log(`  Koreksi   : ${(modul.koreksi || []).length} catatan`);

if (arg.includes('--daftar')) {
  for (const l of LEVEL_BUNPOU) {
    console.log(`\n${l} — ${perLevel[l].length} pola`);
    for (const p of perLevel[l]) console.log(`  ${String(p.nomor).padStart(3)}. ${p.pola} = ${p.arti}  [kategori ${p.kategori}]`);
  }
}

// 1. The data itself: the same check the app's test runs.
const salah = periksaModulBunpou(modul);
console.log(salah.length ? `\nDATA MODUL: ${salah.length} kesalahan` : '\nDATA MODUL: sah');
for (const s of salah) console.log(`  - ${s}`);

// 2. What the data check cannot know: things that are probably a slip, for a person to judge.
const awas = [];
const terpakai = new Set([...nomor, ...Object.keys(gabungan).map(Number)]);
const hilang = [];
for (let n = 1; n <= Math.max(0, ...terpakai); n++) if (!terpakai.has(n)) hilang.push(n);
if (hilang.length) awas.push(`nomor ${hilang.join(', ')} tidak ada sebagai pola maupun di gabungan — terlewat saat menyalin?`);
const namaPola = new Map();
for (const p of pola) namaPola.set(p.pola, [...(namaPola.get(p.pola) || []), p.nomor]);
for (const [nama, daftar] of namaPola) if (daftar.length > 1) awas.push(`pola ${daftar.join(' dan ')} sama-sama bernama "${nama}" — beri pembeda, atau lebur lewat gabungan`);
const jumlah = LEVEL_BUNPOU.map((l) => perLevel[l].length);
if (Math.min(...jumlah) > 0 && Math.max(...jumlah) > 2 * Math.min(...jumlah)) {
  awas.push(`sebaran level timpang (${jumlah.join('/')}) — level terbesar lebih dari dua kali level terkecil`);
}
if (bacaan) {
  for (const l of LEVEL_BUNPOU) {
    if (perLevel[l].length > bacaan * 2) {
      awas.push(`${l}: ${perLevel[l].length} pola tidak muat di ${bacaan} bacaan (dua pola tugas per bacaan = ${bacaan * 2}) — pindahkan pola atau tambah bacaan`);
    }
  }
}
for (const p of pola) {
  for (const [i, c] of (p.contoh || []).entries()) {
    if (typeof c?.jp === 'string' && !/[。？！」）]$/.test(c.jp)) awas.push(`pola ${p.nomor} contoh ${i + 1}: tidak diakhiri tanda baca — terpotong?`);
  }
}
if (awas.length) {
  console.log(`\nPERLU DILIHAT: ${awas.length}`);
  for (const a of awas) console.log(`  - ${a}`);
}

// 3. How far the module is wired in. A module used as reference only ("acuan saja") stops after the AI guidance.
const { JLPT_DOKKAI, daftarMateriTes, poolDokkai } = await muat('server/domain/tesOnline.js');
const { panduanPolaDokkai } = await muat('server/ai/dokkaiAi.js');
const { TINGKAT, muatBank } = fs.existsSync(path.join(ROOT, FILE_UMUM)) ? await muat(FILE_UMUM) : { TINGKAT: {} };

const terdaftar = MODUL_BUNPOU[jlpt];
const samaIsi = terdaftar && JSON.stringify(terdaftar) === JSON.stringify(modul);
const panduan = panduanPolaDokkai(jlpt, 'L1');
// N5 always has a bank; other levels show theirs by the level titles the catalogue carries for them.
const adaBank = jlpt === 'N5' || Boolean(daftarMateriTes([]).dokkai.find((m) => m.kode === 'L1')?.judulPerJlpt?.[jlpt]);
const cfg = TINGKAT[jlpt];
const levels = cfg ? await muatBank(jlpt) : null;
const isiBank = levels ? levels.map((l) => `${l.kode} ${l.bacaan.length}`).join(' · ') : '';
const diAplikasi = poolDokkai('SEMUA', [], jlpt).length;
const diFile = levels ? levels.reduce((n, l) => n + l.bacaan.length, 0) : 0;

const baris = (ok, teks) => console.log(`  [${ok ? 'x' : ' '}] ${teks}`);
console.log('\nPEMASANGAN');
baris(terdaftar, `terdaftar di MODUL_BUNPOU (server/domain/bunpou.js)${terdaftar && !samaIsi ? ' — TETAPI isinya berbeda dari file yang diperiksa' : ''}`);
baris(JLPT_DOKKAI.includes(jlpt), 'bisa dipilih sensei sebagai pola kalimat (JLPT_DOKKAI, server/domain/tesOnline.js)');
baris(panduan?.includes('Modul bunpou'), `panduan AI memuat pola modul per level (server/ai/dokkaiAi.js)${panduan ? '' : ` — PANDUAN_JLPT.${jlpt} belum ada`}`);
console.log('  Bank tetap (hanya bila modul ini juga dipakai untuk bank):');
baris(adaBank, `bank terpasang di aplikasi (BANK_DOKKAI, server/domain/tesOnline.js)${adaBank ? `: ${diAplikasi} bacaan` : ''}`);
baris(cfg, `skill generate-soal mengenal tingkat ini (TINGKAT, ${FILE_UMUM})${cfg ? `: ${isiBank}` : ''}`);
if (cfg) baris(cfg.modul, 'bacaan bank ditandai pola modul (TINGKAT.modul)');

const salahBank = [];
if (cfg && adaBank && diFile !== diAplikasi) salahBank.push(`file bank berisi ${diFile} bacaan tetapi aplikasi membaca ${diAplikasi} — ekspor di BANK_DOKKAI dan TINGKAT.${jlpt} berbeda?`);
if (cfg && !adaBank && diFile) salahBank.push(`file bank berisi ${diFile} bacaan tetapi belum dipasang di BANK_DOKKAI`);
// The bank is checked against the module under review, which only works once that module is the registered one.
if (cfg?.modul && samaIsi) salahBank.push(...periksaBankBunpou(jlpt, levels));
if (cfg?.modul && diFile) {
  if (samaIsi) baris(!salahBank.length, 'tag bunpou bank cocok dengan modul, tiap pola dipakai di levelnya');
  else console.log('  [?] tag bunpou bank belum bisa diperiksa: daftarkan dulu modul ini di MODUL_BUNPOU');
}
if (salahBank.length) {
  console.log(`\nBANK: ${salahBank.length} kesalahan`);
  for (const s of salahBank) console.log(`  - ${s}`);
}

console.log(`\nHASIL: ${salah.length || salahBank.length ? 'ADA KESALAHAN — perbaiki sebelum lanjut' : 'modul sah'}${awas.length ? `, ${awas.length} hal perlu dilihat` : ''}`);
process.exit(salah.length || salahBank.length ? 1 : 0);
