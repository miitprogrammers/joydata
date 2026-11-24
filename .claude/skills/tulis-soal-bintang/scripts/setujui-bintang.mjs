// Persetujuan sensei: mengubah status soal bank dari `draf` ke `ditinjau` dan mencatat penyetuju + tanggal.
// Pakai: node setujui-bintang.mjs --id N5-wa-desu-1,N5-wa-desu-2 --oleh "Nama Sensei"
// JALANKAN HANYA bila user berkata bahwa sensei telah menyetujui soal-soal itu. Catatan: docs/bunpou-adventure/tinjauan/persetujuan.json.
// Semua id dan tingkat divalidasi dulu; tiap soal harus punya bukti tinjauan (baris terakhir LOLOS dengan sidik yang sama,
// atau CATATAN yang tercatat di terima.json, atau ada di pilot-pra-buku.json) dan tanpa baris GAGAL. Penulisan atomik:
// kedua bank dan persetujuan.json ditulis semua, atau tidak sama sekali.
// --bank / --buku KHUSUS TES: di bawah os.tmpdir(), --buku hanya bersama --bank (hanya untuk satu tingkat: N5).
import fs from 'node:fs';
import path from 'node:path';
import { bacaArgumen, bacaJson, hashSoal, jalurKerja, muatBank, siapkanBank, terapkanBank, buangBank } from './_umum.mjs';
import { bacaBukuTerverifikasi, bacaTerima, bacaPilot, masalahBukti } from './_penilaian.mjs';

const { opsi } = bacaArgumen(process.argv.slice(2));
const ids = (opsi.id || '').split(',').filter(Boolean);
if (!ids.length || !opsi.oleh || !opsi.oleh.trim()) {
  console.error('Pakai: node setujui-bintang.mjs --id a,b,c --oleh "<nama sensei>"');
  process.exit(2);
}
const tingkatId = (id) => id.match(/^(N5|N4)-/)?.[1];
const salah = ids.filter((id) => !tingkatId(id));
if (salah.length) { console.error(`id bukan N5-/N4-: ${salah.join(', ')}`); process.exit(2); }
if (new Set(ids).size !== ids.length) { console.error('id kembar di --id'); process.exit(2); }

const perTingkat = new Map();
for (const id of ids) perTingkat.set(tingkatId(id), [...(perTingkat.get(tingkatId(id)) || []), id]);
if (opsi.bank && perTingkat.size > 1) { console.error('--bank (tes) hanya untuk satu tingkat'); process.exit(2); }

// Tahap 1: validasi semua tanpa menulis apa pun.
const rencana = [];
const masalah = [];
let buku;
for (const [jlpt, daftar] of perTingkat) {
  const jalur = jalurKerja(opsi, jlpt);
  buku = jalur.buku;
  const namaEkspor = `SOAL_BINTANG_${jlpt}`;
  const bank = await muatBank(jalur.bank, namaEkspor);
  rencana.push({ jlpt, daftar, namaEkspor, berkasBank: jalur.bank, bank });
}
const { baris, galat: galatBuku } = bacaBukuTerverifikasi(buku);
if (galatBuku.length) masalah.push(...galatBuku.map((g) => `buku tinjauan tidak sah: ${g}`));
const ctx = { baris, terimaBaru: new Set(), terima: bacaTerima(buku), pilot: bacaPilot(buku) };
const rekam = [];
const tanggal = new Date().toISOString().slice(0, 10);
for (const r of rencana) {
  for (const id of r.daftar) {
    const soal = r.bank.find((s) => s.id === id);
    if (!soal) { masalah.push(`${id}: tidak ada di bank ${r.jlpt}`); continue; }
    masalah.push(...masalahBukti(soal, ctx));
    rekam.push({ id, hash: hashSoal(soal), oleh: opsi.oleh.trim(), tanggal });
  }
}
if (masalah.length) { console.error(`DITOLAK, tidak ada yang ditulis (${masalah.length} masalah):\n${masalah.join('\n')}`); process.exit(1); }

// Tahap 2: siapkan semua berkas sementara; baru ganti nama bila semuanya siap.
const siap = [];
for (const r of rencana) {
  const baru = r.bank.map((s) => (r.daftar.includes(s.id) ? { ...s, status: 'ditinjau' } : s));
  const h = await siapkanBank(r.berkasBank, r.namaEkspor, baru);
  siap.push(h);
  if (h.galat) { siap.forEach(buangBank); console.error(`GAGAL menyiapkan bank ${r.jlpt}, tidak ada yang diubah: ${h.galat}`); process.exit(1); }
}
const berkasPersetujuan = path.join(buku, 'persetujuan.json');
fs.mkdirSync(buku, { recursive: true });
const sementaraP = `${berkasPersetujuan}.tmp-${process.pid}`;
try {
  const lama = fs.existsSync(berkasPersetujuan) ? bacaJson(berkasPersetujuan) : [];
  fs.writeFileSync(sementaraP, JSON.stringify([...lama, ...rekam], null, 2));
} catch (e) {
  siap.forEach(buangBank); fs.rmSync(sementaraP, { force: true });
  console.error(`GAGAL menyiapkan persetujuan.json, tidak ada yang diubah: ${e.message}`);
  process.exit(1);
}
siap.forEach(terapkanBank);
fs.renameSync(sementaraP, berkasPersetujuan);
console.log(`${rekam.length} soal berstatus ditinjau, disetujui ${opsi.oleh.trim()} (${tanggal}); dicatat di ${berkasPersetujuan}`);
