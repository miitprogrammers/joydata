// Step 5: write the new passages into server/domain/bankSoal/dokkaiN5.js — only when both gates pass.
//   node inject.mjs --kerja <folder> --uji     dry run: re-checks everything, writes nothing
//   node inject.mjs --kerja <folder>           writes the bank file
// It re-runs gate 1 and gate 2 itself, so a passage edited after its review can never slip in.
import fs from 'fs';
import path from 'path';
import { FILE_BANK, ROOT, argumen, bacaRencana, dirKerja, muatBank, periksaGate, periksaTinjauan } from './_umum.mjs';

const arg = argumen();
const kerja = dirKerja(arg);
const rencana = bacaRencana(kerja);
const levels = Object.keys(rencana.level);

const bankLama = await muatBank();
const masalah = [];
const baru = {};
for (const level of levels) {
  const rc = rencana.level[level];
  const ada = bankLama.find((l) => l.kode === level)?.bacaan.length ?? -1;
  if (ada !== rc.mulai - 1) {
    masalah.push(`${level}: bank berisi ${ada} bacaan, rencana dibuat saat ${rc.mulai - 1} — bank sudah berubah (atau sudah di-inject); buat folder kerja baru dengan siapkan.mjs`);
    continue;
  }
  const g = await periksaGate(kerja, level, rencana);
  if (g.error.length) {
    masalah.push(`${level}: gate mekanis gagal (${g.error.length} error) — node gate.mjs --kerja … ${level}`);
    continue;
  }
  const t = periksaTinjauan(kerja, level, g.daftar);
  const tahan = t.hasil.filter((h) => h.status !== 'LOLOS');
  if (tahan.length) {
    masalah.push(`${level}: ${tahan.length} bacaan belum lolos tinjauan (${tahan.map((h) => `${h.id} ${h.status}`).join(', ')}) — node banding.mjs --kerja …`);
    continue;
  }
  baru[level] = g.daftar;
}
if (masalah.length) {
  console.log('INJECT DITOLAK — gate belum lolos:');
  for (const m of masalah) console.log(`  - ${m}`);
  process.exit(1);
}

// Same hand-written style as the rest of the file: single quotes, one question per line.
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n')}'`;
const tulisBacaan = (b) =>
  [
    '      {',
    `        id: ${q(b.id)},`,
    `        judul: ${q(b.judul)},`,
    `        teks: ${q(b.teks)},`,
    `        terjemahan: ${q(b.terjemahan)},`,
    '        soal: [',
    ...b.soal.map(
      (s) =>
        `          { id: ${q(s.id)}, tanya: ${q(s.tanya)}, tanyaId: ${q(s.tanyaId)}, opsi: [${s.opsi.map(q).join(', ')}], benar: ${s.benar}, pembahasan: ${q(s.pembahasan)} },`,
    ),
    '        ],',
    '      },',
  ].join('\n');

const asli = fs.readFileSync(FILE_BANK, 'utf8');
const eol = asli.includes('\r\n') ? '\r\n' : '\n';
let teks = asli.replace(/\r\n/g, '\n');
for (const level of levels) {
  const awal = teks.indexOf(`    kode: '${level}',`);
  if (awal < 0) {
    console.log(`INJECT DITOLAK — blok level ${level} tidak ditemukan di ${FILE_BANK}`);
    process.exit(1);
  }
  // The level block ends at the first "    ],\n  }," after its header: passages are indented deeper than that.
  const tutup = teks.indexOf('\n    ],\n  },', awal);
  if (tutup < 0 || !teks.slice(awal, tutup).endsWith('      },')) {
    console.log(`INJECT DITOLAK — akhir blok ${level} tidak berbentuk seperti yang diharapkan; sisipkan manual atau perbaiki skrip.`);
    process.exit(1);
  }
  teks = `${teks.slice(0, tutup)}\n${baru[level].map(tulisBacaan).join('\n')}${teks.slice(tutup)}`;
}
const hasil = teks.replace(/\n/g, eol);

const hitung = (bank) => ({
  perLevel: Object.fromEntries(bank.map((l) => [l.kode, l.bacaan.length])),
  bacaan: bank.reduce((n, l) => n + l.bacaan.length, 0),
  soal: bank.reduce((n, l) => n + l.bacaan.reduce((m, b) => m + b.soal.length, 0), 0),
});
const tambahan = levels.reduce((n, l) => n + baru[l].length, 0);

if (arg.uji) {
  const lama = hitung(bankLama);
  console.log(`UJI (tidak menulis apa pun): kedua gate lolos untuk ${levels.join(', ')}.`);
  console.log(`Akan menambah ${tambahan} bacaan / ${tambahan * 2} soal → total ${lama.bacaan + tambahan} bacaan / ${lama.soal + tambahan * 2} soal.`);
  process.exit(0);
}

fs.writeFileSync(FILE_BANK, hasil);
// Read the file back as the app does; anything that differs from what was reviewed → restore the old file.
let salah = '';
try {
  const bankBaru = await muatBank();
  for (const level of levels) {
    const lv = bankBaru.find((l) => l.kode === level);
    const rc = rencana.level[level];
    const ekor = lv.bacaan.slice(rc.mulai - 1);
    if (JSON.stringify(ekor) !== JSON.stringify(baru[level])) salah = `${level}: isi yang tertulis berbeda dari naskah yang ditinjau`;
    const lama = bankLama.find((l) => l.kode === level).bacaan;
    if (JSON.stringify(lv.bacaan.slice(0, rc.mulai - 1)) !== JSON.stringify(lama)) salah = `${level}: bacaan lama ikut berubah`;
  }
  if (!salah) {
    const h = hitung(bankBaru);
    console.log(`INJECT SELESAI: +${tambahan} bacaan / +${tambahan * 2} soal → ${path.relative(ROOT, FILE_BANK)}`);
    console.log(`Bank sekarang: ${h.bacaan} bacaan / ${h.soal} soal (${Object.entries(h.perLevel).map(([k, n]) => `${k} ${n}`).join(', ')}).`);
    console.log('Lanjutkan:');
    console.log('  1. Perbarui komentar kepala dokkaiN5.js (jumlah bacaan per level).');
    console.log(`  2. npm test — tes yang gagal menunjukkan angka lama di server/domain/tesOnline.test.js: jumlah per level, total ${h.bacaan} bacaan, ${h.soal} soal, perJlpt, dan pool "bank + 1 bacaan AI" (jumlah per level + 1).`);
    console.log('  3. npm test lagi sampai lolos semua.');
  }
} catch (e) {
  salah = `file bank tidak bisa dimuat: ${e.message}`;
}
if (salah) {
  fs.writeFileSync(FILE_BANK, asli);
  console.log(`INJECT DIBATALKAN, file bank dikembalikan seperti semula — ${salah}`);
  process.exit(1);
}
