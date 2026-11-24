// Menilai jawaban peninjau buta terhadap kunci draf.
// Pakai: node bandingkan.mjs <draf.json> <jawaban.json> --keluar <folder yang sama dengan buat-buta>
// jawaban.json: [{ kode, bintang: nomor, urutan: [n,n,n,n], urutanLain: [[n,n,n,n]...], kewajaran, tingkat, catatan }]
// Hasil: <folder>/hasil-banding.json = [{ id, status: LOLOS|CATATAN|GAGAL, ... }]. Salin id berstatus LOLOS
// (setelah cek teks untuk CATATAN) ke berkas tinjauan untuk inject-bintang.mjs.
import path from 'node:path';
import { bacaArgumen, bacaJson, tulisJson } from './_umum.mjs';

const { _: [berkasDraf, berkasJawaban], opsi } = bacaArgumen(process.argv.slice(2));
if (!berkasDraf || !berkasJawaban || !opsi.keluar) { console.error('Pakai: node bandingkan.mjs <draf.json> <jawaban.json> --keluar <folder>'); process.exit(2); }
const draf = new Map(bacaJson(berkasDraf).map((s) => [s.id, s]));
const peta = bacaJson(path.join(opsi.keluar, 'peta-rahasia.json'));
const jawaban = bacaJson(berkasJawaban);

const sama = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
const hasil = [];
const dijawab = new Set();
for (const j of jawaban) {
  const p = peta[j.kode];
  if (!p) { hasil.push({ kode: j.kode, status: 'GAGAL', masalah: ['kode tidak dikenal'] }); continue; }
  dijawab.add(j.kode);
  const s = draf.get(p.id);
  const keIndeks = (nomor) => nomor.map((n) => p.urutanTampil[n - 1]);
  const kunci = s.potongan[s.bintang];
  const sah = [[0, 1, 2, 3], ...(s.urutanLain || [])];
  const masalah = [];

  const pilihan = s.potongan[p.urutanTampil[j.bintang - 1]];
  if (pilihan !== kunci) masalah.push(`★ peninjau "${pilihan}" != kunci "${kunci}"`);
  const utama = keIndeks(j.urutan || []);
  if (utama.length === 4 && s.potongan[utama[s.bintang]] !== pilihan) masalah.push('urutan peninjau tidak cocok dengan pilihan ★-nya sendiri');
  const baru = [];
  for (const u of [utama, ...(j.urutanLain || []).map(keIndeks)]) {
    if (u.length !== 4) continue;
    if (s.potongan[u[s.bintang]] !== kunci) masalah.push(`urutan sah menurut peninjau [${u.map((i) => s.potongan[i]).join(' / ')}] memberi ★ lain`);
    else if (!sah.some((v) => sama(v, u))) baru.push(u);
  }
  const catatan = [j.kewajaran, j.tingkat].filter((x) => x && x !== 'ok');
  hasil.push({
    kode: j.kode, id: p.id,
    status: masalah.length ? 'GAGAL' : catatan.length ? 'CATATAN' : 'LOLOS',
    masalah, urutanLainBaru: baru, kewajaran: j.kewajaran, tingkat: j.tingkat, catatan: j.catatan,
  });
}
for (const [kode, p] of Object.entries(peta)) {
  if (!dijawab.has(kode)) hasil.push({ kode, id: p.id, status: 'GAGAL', masalah: ['tidak dijawab peninjau'] });
}
const hitung = (st) => hasil.filter((h) => h.status === st).length;
console.log(`LOLOS ${hitung('LOLOS')} · CATATAN ${hitung('CATATAN')} · GAGAL ${hitung('GAGAL')} · dari ${hasil.length}`);
tulisJson(path.join(opsi.keluar, 'hasil-banding.json'), hasil);
for (const h of hasil.filter((x) => x.status !== 'LOLOS')) {
  console.log(`\n${h.status} ${h.id} (${h.kode})`);
  for (const m of h.masalah) console.log(`  - ${m}`);
  if (h.kewajaran && h.kewajaran !== 'ok') console.log(`  kewajaran: ${h.kewajaran}`);
  if (h.tingkat && h.tingkat !== 'ok') console.log(`  tingkat: ${h.tingkat}`);
  if (h.catatan) console.log(`  catatan: ${h.catatan}`);
}
const tambahan = hasil.filter((h) => h.urutanLainBaru?.length);
if (tambahan.length) console.log(`\nUrutan sah baru (★ sama) untuk ditambahkan ke urutanLain: ${tambahan.map((h) => h.id).join(', ')}`);
process.exit(hitung('GAGAL') ? 1 : 0);
