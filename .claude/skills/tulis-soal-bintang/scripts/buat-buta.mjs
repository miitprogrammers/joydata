// Membuat kertas tanpa kunci untuk peninjau buta, plus peta rahasia untuk menilai jawabannya.
// Pakai: node buat-buta.mjs <draf.json> --tingkat N5 --keluar <folder> [--subset id1,id2]
// Berkas yang diberikan ke peninjau: <folder>/buta.json SAJA. peta-rahasia.json jangan dibuka peninjau.
import path from 'node:path';
import fs from 'node:fs';
import { bacaArgumen, bacaJson, tulisJson, tingkatSah, babDariPola } from './_umum.mjs';

const { _: [berkas], opsi } = bacaArgumen(process.argv.slice(2));
if (!berkas || !opsi.keluar) { console.error('Pakai: node buat-buta.mjs <draf.json> --tingkat N5|N4 --keluar <folder> [--subset ids]'); process.exit(2); }
tingkatSah(opsi.tingkat);
const draf = bacaJson(berkas);
const pilih = opsi.subset ? new Set(opsi.subset.split(',')) : null;
fs.mkdirSync(opsi.keluar, { recursive: true });

// mulberry32 dengan benih tetap: ulang jalan memberi kertas yang sama.
let benih = 20261122;
const acak = () => {
  benih = (benih + 0x6d2b79f5) | 0;
  let t = Math.imul(benih ^ (benih >>> 15), 1 | benih);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const kocok = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i -= 1) {
    const j = Math.floor(acak() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

const buta = [];
const peta = {};
kocok(draf.filter((s) => !pilih || pilih.has(s.id))).forEach((s, i) => {
  const kode = `S${String(i + 1).padStart(2, '0')}`;
  const urutanTampil = kocok([0, 1, 2, 3]); // nomor n (1-based) = potongan[urutanTampil[n-1]]
  buta.push({
    kode,
    bab: babDariPola(s.pola),
    situasi: s.situasi,
    baris: s.baris.map((b) => (b.teks === undefined
      ? { pembicara: b.pembicara ?? null, sebelum: b.sebelum, kotak: [0, 1, 2, 3].map((j) => (j === s.bintang ? '★' : '＿＿')), sesudah: b.sesudah }
      : { pembicara: b.pembicara ?? null, teks: b.teks })),
    pilihan: urutanTampil.map((idx, n) => ({ nomor: n + 1, teks: s.potongan[idx] })),
  });
  peta[kode] = { id: s.id, urutanTampil };
});

tulisJson(path.join(opsi.keluar, 'buta.json'), buta);
tulisJson(path.join(opsi.keluar, 'peta-rahasia.json'), peta);
console.log(`${buta.length} soal -> ${opsi.keluar}/buta.json (tanpa kunci); peta-rahasia.json jangan diberikan ke peninjau`);
