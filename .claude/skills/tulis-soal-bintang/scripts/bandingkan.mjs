// Menilai jawaban peninjau buta terhadap kunci draf.
// Pakai: node bandingkan.mjs <draf.json> <jawaban.json> --keluar <folder peninjau> [--rahasia <folder>]
//   --rahasia = folder yang dipakai buat-buta.mjs untuk peta rahasia (bawaan: `rahasia/` di samping --keluar).
//   Hasil ditulis ke <rahasia>/hasil-banding.json. Satu putaran = satu pasang folder; putaran ulang pakai folder baru.
// jawaban.json: [{ kode, bintang: nomor 1-4, urutan: [n,n,n,n], urutanLain: [[n,n,n,n]...], kewajaran, tingkat, gagal: [...], catatan }]
//   gagal: larik WAJIB ada (boleh kosong) dari ganda | bocor | tanda-baca | tidak-wajar | di-atas-bab. Isi apa pun = GAGAL.
//   Catatan lain (mis. "★ bisa ditempatkan dari bentuk pola") masuk kewajaran/catatan dan hanya menjadi CATATAN.
// Aturan lain: urutan harus permutasi 1-4, kewajaran dan tingkat wajib (jika tidak: GAGAL "jawaban tidak lengkap");
// bila tak satu pun urutan peninjau sama dengan urutan kunci: CATATAN; kode ganda di jawaban.json = galat.
// Baris hasil memuat `hash` isi yang ditinjau. Fungsi penilai ada di _penilaian.mjs (dipakai juga inject untuk hitung ulang).
// Setelah putaran selesai, salin buta.json, jawaban.json, peta-rahasia.json, hasil-banding.json ke
// docs/bunpou-adventure/tinjauan/<putaran>/.
import path from 'node:path';
import { bacaArgumen, bacaJson, tulisJson, rahasiaBawaan } from './_umum.mjs';
import { nilaiSemua } from './_penilaian.mjs';

const { _: [berkasDraf, berkasJawaban], opsi } = bacaArgumen(process.argv.slice(2));
if (!berkasDraf || !berkasJawaban || !(opsi.keluar || opsi.rahasia)) {
  console.error('Pakai: node bandingkan.mjs <draf.json> <jawaban.json> --keluar <folder peninjau> [--rahasia <folder>]');
  process.exit(2);
}
const rahasia = opsi.rahasia || rahasiaBawaan(opsi.keluar);
const draf = new Map(bacaJson(berkasDraf).map((s) => [s.id, s]));
const peta = bacaJson(path.join(rahasia, 'peta-rahasia.json'));
const jawaban = bacaJson(berkasJawaban);

let hasil;
try { hasil = nilaiSemua(draf, peta, jawaban, new Date().toISOString()); } catch (e) { console.error(e.message); process.exit(1); }
const hitung = (st) => hasil.filter((h) => h.status === st).length;
console.log(`LOLOS ${hitung('LOLOS')} · CATATAN ${hitung('CATATAN')} · GAGAL ${hitung('GAGAL')} · dari ${hasil.length}`);
tulisJson(path.join(rahasia, 'hasil-banding.json'), hasil);
for (const h of hasil.filter((x) => x.status !== 'LOLOS')) {
  console.log(`\n${h.status} ${h.id} (${h.kode})`);
  for (const m of h.masalah || []) console.log(`  - ${m}`);
  if (h.kewajaran && h.kewajaran !== 'ok') console.log(`  kewajaran: ${h.kewajaran}`);
  if (h.tingkat && h.tingkat !== 'ok') console.log(`  tingkat: ${h.tingkat}`);
  if (h.catatan) console.log(`  catatan: ${h.catatan}`);
}
const tambahan = hasil.filter((h) => h.urutanLainBaru?.length);
if (tambahan.length) console.log(`\nUrutan sah baru (★ sama) untuk ditambahkan ke urutanLain: ${tambahan.map((h) => h.id).join(', ')}`);
process.exit(hitung('GAGAL') ? 1 : 0);
