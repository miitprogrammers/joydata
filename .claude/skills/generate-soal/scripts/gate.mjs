// Gate 1 (mechanical): format, furigana, length, key balance, evidence quotes, duplicates.
//   node gate.mjs --kerja <folder> [L1 L2 …]      (no level = every level in rencana.json)
// Reads gen/<level>.json, writes gate/<level>.json, exits 1 when any level has an ERROR.
import fs from 'fs';
import path from 'path';
import { argumen, bacaRencana, dirKerja, levelDipilih, periksaGate } from './_umum.mjs';

const arg = argumen();
const kerja = dirKerja(arg);
const rencana = bacaRencana(kerja);
let gagal = false;

for (const level of levelDipilih(arg, rencana)) {
  const h = await periksaGate(kerja, level, rencana);
  // The report never contains the passages themselves: reviewers read this file for the new-furigana list.
  const { daftar, ...laporan } = h;
  fs.writeFileSync(path.join(kerja, 'gate', `${level}.json`), JSON.stringify(laporan, null, 2));

  console.log(`\n=== GATE ${level}: ${h.jumlahBacaan ?? 0} bacaan, ${h.jumlahSoal ?? 0} soal, kunci 0/1/2 = ${h.kunci.join('/')} ===`);
  console.log(`ERROR: ${h.error.length}`);
  for (const e of h.error) console.log(`  [${e.id}] ${e.pesan}`);
  console.log(`PERINGATAN: ${h.peringatan.length}`);
  for (const w of h.peringatan) console.log(`  [${w.id}] ${w.pesan}`);
  console.log(`FURIGANA BARU (belum pernah dipakai bank — pastikan benar): ${h.furiganaBaru.length}`);
  for (const f of h.furiganaBaru) {
    console.log(`  ${f.kata}{${f.baca}}${f.diBank ? `  ← bank memakai: ${f.diBank.join(' / ')}` : ''}  (${f.di.join(', ')})`);
  }
  console.log(h.error.length ? `HASIL ${level}: GAGAL` : `HASIL ${level}: LOLOS gate mekanis`);
  if (h.error.length) gagal = true;
}
process.exit(gagal ? 1 : 0);
