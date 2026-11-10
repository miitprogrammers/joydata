// Gate 2 (independent review): compare the reviewers' blind answers with the keys and list their objections.
//   node banding.mjs --kerja <folder> [L1 …]
// Reads review/*.json (the newest file wins for the same passage text), writes gate/tinjauan.json,
// exits 1 while any passage is BLOKIR or BELUM.
import fs from 'fs';
import path from 'path';
import { argumen, bacaRencana, dirKerja, levelDipilih, periksaGate, periksaTinjauan } from './_umum.mjs';

const arg = argumen();
const kerja = dirKerja(arg);
const rencana = bacaRencana(kerja);
const ringkas = {};
let gagal = false;

for (const level of levelDipilih(arg, rencana)) {
  const g = await periksaGate(kerja, level, rencana);
  if (g.error.length) {
    console.log(`\n=== TINJAUAN ${level}: gate mekanis gagal (${g.error.length} error) — jalankan gate.mjs ===`);
    gagal = true;
    continue;
  }
  const t = periksaTinjauan(kerja, level, g.daftar);
  const n = (s) => t.hasil.filter((h) => h.status === s).length;
  ringkas[level] = t;
  console.log(`\n=== TINJAUAN ${level}: LOLOS ${n('LOLOS')}, BLOKIR ${n('BLOKIR')}, BELUM ${n('BELUM')} (dari ${t.hasil.length}) ===`);
  for (const r of t.rusak) console.log(`  file tinjauan rusak: ${r}`);
  for (const h of t.hasil.filter((x) => x.status !== 'LOLOS')) {
    console.log(`  ${h.status} ${h.id}${h.file ? ` (${h.file})` : ''}`);
    for (const a of h.alasan) console.log(`      - ${a}`);
  }
  const kesamping = t.hasil.filter((h) => h.dikesampingkan);
  if (kesamping.length) {
    console.log('  Keberatan yang dikesampingkan (putusan.json):');
    for (const h of kesamping) console.log(`      ${h.id}: ${h.dikesampingkan.keberatan.join(' | ')}  ⇒ ${h.dikesampingkan.alasan}`);
  }
  const minor = t.hasil.filter((h) => h.minor.length);
  if (minor.length) {
    console.log('  Catatan minor (tidak memblokir; perbaiki bila setuju — bacaan yang diubah harus ditinjau ulang):');
    for (const h of minor) for (const m of h.minor) console.log(`      ${m}`);
  }
  if (n('LOLOS') !== t.hasil.length) gagal = true;
}
fs.writeFileSync(path.join(kerja, 'gate', 'tinjauan.json'), JSON.stringify(ringkas, null, 2));
console.log(gagal ? '\nHASIL: BELUM LOLOS — perbaiki yang BLOKIR, lalu buta.mjs --ulang untuk yang berubah.' : '\nHASIL: SEMUA LOLOS gate tinjauan.');
process.exit(gagal ? 1 : 0);
