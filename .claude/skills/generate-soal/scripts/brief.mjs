// Fills the prompt templates in references/ so every agent gets the same brief, with real paths.
//   node brief.mjs --kerja <folder> --penulis [L1 …]    → prompt/gen-<level>.md       (one writer per level)
//   node brief.mjs --kerja <folder> --peninjau [L1 …]   → prompt/tinjau-<level>.md    (output review/<level>.json)
//   node brief.mjs --kerja <folder> --peninjau --ulang  → prompt/tinjau-ulang-<n>.md  (output review/ulang-<n>.json,
//                                                         n = first number not used yet)
// Give the agent the file's text as its prompt, or tell it to read that one file and follow it.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { argumen, bacaRencana, dirKerja, levelDipilih } from './_umum.mjs';

const arg = argumen();
const kerja = dirKerja(arg);
const rencana = bacaRencana(kerja);
const SKILL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const posix = (p) => p.replace(/\\/g, '/');

if (!arg.penulis === !arg.peninjau) {
  console.log('Pilih satu: --penulis atau --peninjau (lihat komentar di awal skrip).');
  process.exit(2);
}
// --penulis L1 parses as penulis='L1': put a level given right after the flag back into the level list.
for (const k of ['penulis', 'peninjau', 'ulang']) if (typeof arg[k] === 'string') arg._.unshift(arg[k]);

const templat = (nama) => {
  const t = fs.readFileSync(path.join(SKILL, 'references', nama), 'utf8');
  return t.slice(t.indexOf('\n---') + 4).trim(); // the brief is everything after the first --- line
};
const isi = (t, nilai) => {
  const hasil = t.replace(/\{\{([A-Z]+)\}\}/g, (m, k) => (k in nilai ? String(nilai[k]) : m));
  const sisa = hasil.match(/\{\{[A-Z]+\}\}/);
  if (sisa) throw new Error(`placeholder ${sisa[0]} tidak terisi`);
  return `${hasil}\n`;
};
const dirPrompt = path.join(kerja, 'prompt');
fs.mkdirSync(dirPrompt, { recursive: true });
const simpan = (nama, teks) => {
  fs.writeFileSync(path.join(dirPrompt, nama), teks);
  console.log(`prompt/${nama}`);
};
const dasar = { KERJA: posix(kerja), SKILL: posix(SKILL) };

if (arg.penulis) {
  const t = templat('brief-generator.md');
  for (const level of levelDipilih(arg, rencana)) {
    const rc = rencana.level[level];
    simpan(`gen-${level}.md`, isi(t, { ...dasar, LEVEL: level, JUMLAH: rc.jumlah, DESKRIPSI: rc.deskripsi, MULAI: rc.mulai, AKHIR: rc.mulai + rc.jumlah - 1 }));
  }
} else if (arg.ulang) {
  if (!fs.existsSync(path.join(kerja, 'blind', 'ulang.json'))) {
    console.log('blind/ulang.json belum ada — jalankan buta.mjs --ulang dulu.');
    process.exit(1);
  }
  let n = 1;
  while (fs.existsSync(path.join(kerja, 'review', `ulang-${n}.json`))) n++;
  simpan(`tinjau-ulang-${n}.md`, isi(templat('brief-peninjau.md'), { ...dasar, NAMA: 'ulang', KELUARAN: `review/ulang-${n}.json` }));
} else {
  const t = templat('brief-peninjau.md');
  for (const level of levelDipilih(arg, rencana)) {
    if (!fs.existsSync(path.join(kerja, 'blind', `${level}.json`))) {
      console.log(`blind/${level}.json belum ada — jalankan buta.mjs dulu.`);
      process.exit(1);
    }
    simpan(`tinjau-${level}.md`, isi(t, { ...dasar, NAMA: level, KELUARAN: `review/${level}.json` }));
  }
}
