// Gate mekanis untuk draf soal bintang (dipakai penulis sebelum meminta peninjau).
// Pakai: node periksa-bintang.mjs <draf.json> --tingkat N5 [--varian 4]
// --varian n: setiap pola dalam draf harus punya tepat n soal (bawaan: tidak diperiksa).
import { SB, katalog, bacaArgumen, bacaJson, tingkatSah, kelompokTingkat, babDariPola } from './_umum.mjs';

const { _: [berkas], opsi } = bacaArgumen(process.argv.slice(2));
if (!berkas) { console.error('Pakai: node periksa-bintang.mjs <draf.json> --tingkat N5|N4 [--varian n]'); process.exit(2); }
const jlpt = tingkatSah(opsi.tingkat);
const draf = bacaJson(berkas);
const masalah = [];

if (opsi.varian) {
  const n = Number(opsi.varian);
  const hitung = new Map();
  for (const s of draf) hitung.set(s.pola, (hitung.get(s.pola) || 0) + 1);
  for (const [pola, ada] of hitung) if (ada !== n) masalah.push(`${pola}: ${ada} varian, bukan ${n}`);
}
// validasiBankBintang memeriksa tiap soal, id/kalimat kembar, dan sebaran ★ (draf dianggap satu bank).
masalah.push(...SB.validasiBankBintang(draf, { katalog, jlpt, kelompok: kelompokTingkat(jlpt) }));

const uniq = [...new Set(masalah)];
const pola = [...new Set(draf.map((s) => s.pola))];
console.log(`${draf.length} soal, ${pola.length} pola: ${pola.map((p) => `${p} (bab ${babDariPola(p)})`).join(', ')}`);
const h = [0, 1, 2, 3].map((i) => draf.filter((s) => s.bintang === i).length);
console.log(`sebaran ★ kotak 1-4: ${h.join(', ')}`);
console.log(uniq.length ? uniq.join('\n') : 'ok');
console.log(`Masalah: ${uniq.length}`);
process.exit(uniq.length ? 1 : 0);
