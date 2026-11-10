// Step 1: prepare the work folder.
//   node siapkan.mjs --kerja <folder> --bacaan 25 [--level L1,L3]
// Writes rencana.json (which ids each level gets), the furigana reference taken from the bank, the titles
// already in use, and recent bank passages per level as style examples.
import fs from 'fs';
import path from 'path';
import { BATAS_LEVEL, argumen, dirKerja, muatBank, petaFurigana, polos } from './_umum.mjs';

const arg = argumen();
const kerja = dirKerja(arg);
const jumlah = Number(arg.bacaan);
if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 60) {
  console.log('Wajib: --bacaan <jumlah bacaan baru per level, 1–60> (tiap bacaan = 2 soal)');
  process.exit(2);
}

const bank = await muatBank();
const semuaKode = bank.map((l) => l.kode);
const minta = arg.level && arg.level !== true ? String(arg.level).split(',').map((x) => x.trim().toUpperCase()) : semuaKode;
const asing = minta.filter((l) => !semuaKode.includes(l) || !BATAS_LEVEL[l]);
if (asing.length) {
  console.log(`Level tidak dikenal: ${asing.join(', ')} (ada: ${semuaKode.join(', ')})`);
  process.exit(2);
}

const fileRencana = path.join(kerja, 'rencana.json');
if (fs.existsSync(fileRencana) && !arg.timpa) {
  console.log(`${fileRencana} sudah ada. Pakai folder kerja baru, atau tambahkan --timpa bila memang mau mulai ulang.`);
  process.exit(2);
}
for (const d of ['gen', 'blind', 'review', 'gate']) fs.mkdirSync(path.join(kerja, d), { recursive: true });

const rencana = { dibuat: new Date().toISOString(), soalPerBacaan: 2, level: {} };
for (const l of bank) {
  if (!minta.includes(l.kode)) continue;
  rencana.level[l.kode] = {
    mulai: l.bacaan.length + 1,
    jumlah,
    deskripsi: l.deskripsi,
    panjang: BATAS_LEVEL[l.kode].pjg,
    kalimat: BATAS_LEVEL[l.kode].kal,
  };
  // The newest ten passages of the level: the style the generator has to match.
  fs.writeFileSync(path.join(kerja, `contoh-${l.kode}.json`), JSON.stringify(l.bacaan.slice(-10), null, 2));
}
fs.writeFileSync(fileRencana, JSON.stringify(rencana, null, 2));

const bacaan = bank.flatMap((l) => l.bacaan);
const peta = petaFurigana(bacaan);
const baris = [...peta].sort((a, b) => a[0].localeCompare(b[0], 'ja')).map(([kata, set]) => `${kata}\t${[...set].join(' / ')}`);
fs.writeFileSync(
  path.join(kerja, 'referensi-furigana.txt'),
  `# Cara baca yang sudah dipakai bank (kata<TAB>bacaan). Pakai bacaan yang sama untuk kata yang sama.\n${baris.join('\n')}\n`,
);
fs.writeFileSync(
  path.join(kerja, 'judul-terpakai.txt'),
  `# Judul bacaan yang sudah ada di bank — judul baru tidak boleh sama, topik sebaiknya tidak mengulang.\n${bank
    .map((l) => `## ${l.kode} — ${l.deskripsi}\n${l.bacaan.map((b) => `${b.id}\t${polos(b.judul)}`).join('\n')}`)
    .join('\n\n')}\n`,
);

console.log(`Folder kerja: ${kerja}`);
for (const [kode, r] of Object.entries(rencana.level)) {
  console.log(`  ${kode} (${r.deskripsi}): ${r.jumlah} bacaan baru → ${kode}-${r.mulai} … ${kode}-${r.mulai + r.jumlah - 1} (${r.jumlah * 2} soal), ${r.panjang.join('–')} huruf, ${r.kalimat.join('–')} kalimat`);
}
console.log(`Referensi: referensi-furigana.txt (${baris.length} kata), judul-terpakai.txt, contoh-<level>.json`);
