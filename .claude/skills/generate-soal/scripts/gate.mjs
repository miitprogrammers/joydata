// Gate 1 (mechanical): format, furigana, length, numerals, key balance, evidence quotes, duplicates, vocabulary.
//   node gate.mjs --kerja <folder> [L1 L2 …]           (no level = every level in rencana.json)
//   node gate.mjs --audit --jlpt N4 [--level L3] [--keluar laporan.json]
// Reads gen/<level>.json, writes gate/<level>.json, exits 1 when any level has an ERROR.
// --audit runs the same checks on the passages already in the bank (no work folder of yours): the basis for choosing
// which passages to revise and the evidence that a revised bank is clean.
import fs from 'fs';
import os from 'os';
import path from 'path';
import { argumen, bacaRencana, dirKerja, kanonik, levelDipilih, muatBank, periksaGate, tingkat } from './_umum.mjs';

const arg = argumen();

function cetak(level, h) {
  console.log(`\n=== GATE ${level}: ${h.jumlahBacaan ?? 0} bacaan, ${h.jumlahSoal ?? 0} soal, kunci 0/1/2 = ${h.kunci.join('/')} ===`);
  console.log(`ERROR: ${h.error.length}`);
  for (const e of h.error) console.log(`  [${e.id}] ${e.pesan}`);
  console.log(`PERINGATAN: ${h.peringatan.length}`);
  for (const w of h.peringatan) console.log(`  [${w.id}] ${w.pesan}`);
}

if (arg.audit) {
  const jlpt = arg.jlpt && arg.jlpt !== true ? String(arg.jlpt).toUpperCase() : 'N5';
  tingkat(jlpt);
  const bank = await muatBank(jlpt);
  const minta = arg.level && arg.level !== true ? String(arg.level).split(',').map((x) => x.trim().toUpperCase()) : bank.map((l) => l.kode);
  // A throwaway work folder in revision mode: each passage is checked as a revision of itself.
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'audit-dokkai-'));
  const rencana = { dibuat: new Date().toISOString(), jlpt, mode: 'revisi', audit: true, soalPerBacaan: 2, level: {} };
  for (const d of ['gen', 'asli']) fs.mkdirSync(path.join(tmp, d));
  for (const l of bank.filter((x) => minta.includes(x.kode))) {
    const daftar = l.bacaan.map(kanonik);
    rencana.level[l.kode] = { ids: daftar.map((b) => b.id), jumlah: daftar.length, deskripsi: l.deskripsi, alasan: {} };
    fs.writeFileSync(path.join(tmp, 'gen', `${l.kode}.json`), JSON.stringify(daftar));
    fs.writeFileSync(path.join(tmp, 'asli', `${l.kode}.json`), JSON.stringify(daftar));
  }
  fs.writeFileSync(path.join(tmp, 'rencana.json'), JSON.stringify(rencana));
  const laporan = {};
  let jumlahError = 0;
  for (const level of Object.keys(rencana.level)) {
    const { daftar, furiganaBaru, ...h } = await periksaGate(tmp, level, rencana);
    // Similarity with other bank passages is not a fault of an existing passage.
    h.peringatan = h.peringatan.filter((w) => !/^teks mirip/.test(w.pesan));
    laporan[level] = h;
    jumlahError += h.error.length;
    cetak(level, h);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  if (arg.keluar && arg.keluar !== true) fs.writeFileSync(path.resolve(arg.keluar), JSON.stringify({ jlpt, dibuat: rencana.dibuat, laporan }, null, 2));
  console.log(`\nAUDIT ${jlpt}: ${jumlahError} error di ${Object.keys(laporan).join(', ')}`);
  process.exit(0);
}

const kerja = dirKerja(arg);
const rencana = bacaRencana(kerja);
let gagal = false;

for (const level of levelDipilih(arg, rencana)) {
  const h = await periksaGate(kerja, level, rencana);
  // The report never contains the passages themselves: reviewers read this file for the new-furigana list.
  const { daftar, ...laporan } = h;
  fs.writeFileSync(path.join(kerja, 'gate', `${level}.json`), JSON.stringify(laporan, null, 2));

  cetak(level, h);
  console.log(`FURIGANA BARU (belum pernah dipakai bank — pastikan benar): ${h.furiganaBaru.length}`);
  for (const f of h.furiganaBaru) {
    console.log(`  ${f.kata}{${f.baca}}${f.diBank ? `  ← bank memakai: ${f.diBank.join(' / ')}` : ''}  (${f.di.join(', ')})`);
  }
  console.log(h.error.length ? `HASIL ${level}: GAGAL` : `HASIL ${level}: LOLOS gate mekanis`);
  if (h.error.length) gagal = true;
}
process.exit(gagal ? 1 : 0);
