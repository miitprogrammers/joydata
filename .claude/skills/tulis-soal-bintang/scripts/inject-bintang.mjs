// Memasukkan soal bintang yang SUDAH lolos gate dan peninjau buta ke server/domain/bankSoal/bintang<N5|N4>.js.
// Pakai: node inject-bintang.mjs <draf.json> --tingkat N5 [--terima id1,id2 --alasan "<teks>"] [--ganti] [--uji]
//   Bukti tinjauan dibaca SENDIRI dari buku tinjauan di repo: docs/bunpou-adventure/tinjauan/<putaran>/ (semua putaran).
//   Tiap putaran harus berisi buta.json, jawaban.json, peta-rahasia.json, hasil-banding.json; inject MENGHITUNG ULANG status
//   tiap baris dengan fungsi penilai yang sama dengan bandingkan.mjs dan menolak seluruh inject bila ada yang tak cocok.
//   Soal ditolak bila:
//     - tidak ada baris penilaian dengan sidik isi dan id yang sama (belum ditinjau, atau diedit sesudah ditinjau);
//     - ADA baris GAGAL mana pun dengan sidik isi yang sama (id apa pun);
//     - baris terakhir bukan LOLOS, atau CATATAN yang idnya tidak ada di --terima.
//   --terima id1,id2  menerima baris CATATAN (setelah cek teks); WAJIB disertai --alasan. Keputusan dicatat ke terima.json.
//   --ganti  ganti soal berid sama yang sudah ada di bank. Status `ditinjau` dipertahankan bila sidik isi tidak berubah,
//            kalau isi berubah dikembalikan ke `draf`. Soal baru harus berstatus `draf`.
//   --uji    periksa saja, tidak menulis.
//   --bank / --buku  KHUSUS TES: di bawah os.tmpdir(), dan --buku hanya bersama --bank. Dengan bank asli, buku repo selalu dipakai.
// Menolak SELURUH batch bila satu soal gagal. Penulisan lewat berkas sementara yang diimpor ulang dan dibandingkan.
import fs from 'node:fs';
import path from 'node:path';
import { SB, katalog, bacaArgumen, bacaJson, tulisJson, tingkatSah, kelompokTingkat, urutSoal, hashSoal, KUNCI_SOAL, KUNCI_BARIS, jalurKerja, muatBank, tulisBankAman } from './_umum.mjs';
import { bacaBukuTerverifikasi, bacaTerima, masalahBukti } from './_penilaian.mjs';

const { _: [berkas], opsi } = bacaArgumen(process.argv.slice(2), ['ganti', 'uji']);
if (!berkas) {
  console.error('Pakai: node inject-bintang.mjs <draf.json> --tingkat N5|N4 [--terima ids --alasan "..."] [--ganti] [--uji]');
  process.exit(2);
}
const jlpt = tingkatSah(opsi.tingkat);
const draf = bacaJson(berkas);
const terimaBaru = new Set((opsi.terima || '').split(',').filter(Boolean));
if (terimaBaru.size && !(typeof opsi.alasan === 'string' && opsi.alasan.trim())) { console.error('--terima wajib disertai --alasan "<teks>"'); process.exit(2); }
const { bank: berkasBank, buku } = jalurKerja(opsi, jlpt);
const { baris: buktiSemua, galat: galatBuku } = bacaBukuTerverifikasi(buku);
if (galatBuku.length) {
  console.error(`DITOLAK: buku tinjauan tidak sah (${galatBuku.length} masalah):\n${galatBuku.join('\n')}`);
  process.exit(1);
}

const namaEkspor = `SOAL_BINTANG_${jlpt}`;
const bankLama = await muatBank(berkasBank, namaEkspor);
const soalLama = new Map(bankLama.map((s) => [s.id, s]));

const tolak = [];
const idDraf = new Set();
const siap = [];
const diterima = [];
for (const s of draf) {
  if (idDraf.has(s.id)) tolak.push(`${s.id}: id kembar di draf`);
  idDraf.add(s.id);
  const hash = hashSoal(s);
  tolak.push(...masalahBukti(s, { baris: buktiSemua, terimaBaru, terima: [], pilot: null }));
  const akhir = buktiSemua.filter((b) => b.hash === hash && b.id === s.id).pop();
  if (akhir?.status === 'CATATAN' && terimaBaru.has(s.id)) diterima.push({ id: s.id, hash });
  if (s.status !== 'draf') tolak.push(`${s.id}: soal baru harus berstatus 'draf', bukan ${s.status}`);
  const lebih = Object.keys(s).filter((k) => !KUNCI_SOAL.includes(k));
  if (lebih.length) tolak.push(`${s.id}: kunci di luar bentuk soal: ${lebih.join(', ')}`);
  for (const b of Array.isArray(s.baris) ? s.baris : []) {
    const x = Object.keys(b || {}).filter((k) => !KUNCI_BARIS.includes(k));
    if (x.length) tolak.push(`${s.id}: kunci baris di luar bentuk soal: ${x.join(', ')}`);
  }
  if (opsi.ganti && !soalLama.has(s.id)) tolak.push(`${s.id}: --ganti hanya untuk id yang sudah ada di bank`);
  if (!opsi.ganti && soalLama.has(s.id)) tolak.push(`${s.id}: sudah ada di bank (pakai --ganti untuk menggantinya)`);
  for (const m of SB.validasiSoalBintang(s, { katalog, jlpt })) tolak.push(`${s.id}: ${m}`);
  // Status bank: ditinjau dipertahankan hanya bila isi yang ditinjau sama persis.
  const lama = soalLama.get(s.id);
  const status = opsi.ganti && lama?.status === 'ditinjau' && hashSoal(lama) === hash ? 'ditinjau' : 'draf';
  siap.push({ ...s, status });
}
const bankBaru = [...bankLama.filter((s) => !(opsi.ganti && idDraf.has(s.id))), ...siap].sort(urutSoal);
if (!tolak.length) tolak.push(...SB.validasiBankBintang(bankBaru, { katalog, jlpt, kelompok: kelompokTingkat(jlpt) }));
if (tolak.length) {
  console.error(`DITOLAK, tidak ada yang ditulis (${tolak.length} masalah):\n${[...new Set(tolak)].join('\n')}`);
  process.exit(1);
}
if (opsi.uji) { console.log(`lolos: ${draf.length} soal akan ${opsi.ganti ? 'diganti' : 'ditambah'}; bank jadi ${bankBaru.length}`); process.exit(0); }

const galat = await tulisBankAman(berkasBank, namaEkspor, bankBaru);
if (galat) { console.error(`GAGAL menulis bank, bank tidak diubah: ${galat}`); process.exit(1); }
if (diterima.length) {
  const tanggal = new Date().toISOString().slice(0, 10);
  fs.mkdirSync(buku, { recursive: true });
  tulisJson(path.join(buku, 'terima.json'), [...bacaTerima(buku), ...diterima.map((d) => ({ ...d, tanggal, alasan: opsi.alasan.trim() }))]);
}
console.log(`${draf.length} soal ${opsi.ganti ? 'diganti' : 'ditambah'}; ${namaEkspor} sekarang ${bankBaru.length} soal${diterima.length ? `; ${diterima.length} CATATAN dicatat di terima.json` : ''}. Commit bank + buku tinjauan bersama. Jalankan npm test.`);
