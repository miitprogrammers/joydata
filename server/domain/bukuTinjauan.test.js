// Setiap soal di bank bintang harus punya bukti tinjauan buta untuk isinya SEKARANG (sidik isi), dan buku tinjauan
// (docs/bunpou-adventure/tinjauan/) harus bisa dihitung ulang. Menambah daftar pilot-pra-buku = perubahan tes yang terlihat.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
import { SOAL_BINTANG_N5 } from './bankSoal/bintangN5.js';
import { SOAL_BINTANG_N4 } from './bankSoal/bintangN4.js';
import { BUKU_BAWAAN, hashSoal } from '../../.claude/skills/tulis-soal-bintang/scripts/_umum.mjs';
import { bacaBukuTerverifikasi, bacaTerima, bacaPilot, masalahBukti } from '../../.claude/skills/tulis-soal-bintang/scripts/_penilaian.mjs';

// 52 soal pilot, 6 di antaranya sudah ditinjau di buku (putaran 4 dan 5): 46 ditinjau sebelum buku ada (putaran 1-3).
const PANJANG_PILOT_PRA_BUKU = 46;
// Sidik isi pilot-pra-buku.json. Mengubah daftar (juga dengan sidik soal yang disesuaikan) mengubah sidik ini, jadi
// konstanta ini harus ikut diubah: perubahan tes yang terlihat dan perlu persetujuan user (AGENTS.md).
const SIDIK_PILOT_PRA_BUKU = 'c97c31702b58fc2386a169cd64c26d900e0c2429e6f8d2db87b69e10e3efbbe4';
const sidikBerkas = (berkas) => crypto.createHash('sha256').update(fs.readFileSync(berkas)).digest('hex');
/** Soal berstatus ditinjau tanpa catatan persetujuan untuk sidik isinya sekarang. */
const tanpaPersetujuan = (bank, persetujuan) => bank
  .filter((s) => s.status === 'ditinjau' && !persetujuan.some((x) => x.id === s.id && x.hash === hashSoal(s)))
  .map((s) => s.id);
const bacaPersetujuan = (buku) => {
  const berkas = path.join(buku, 'persetujuan.json');
  return fs.existsSync(berkas) ? JSON.parse(fs.readFileSync(berkas, 'utf8')) : [];
};
const BANK = [...SOAL_BINTANG_N5, ...SOAL_BINTANG_N4];

test('buku tinjauan: setiap putaran lengkap dan hasilnya sama dengan hitung ulang dari buta + jawaban + peta', () => {
  const folder = fs.readdirSync(BUKU_BAWAAN).filter((n) => fs.statSync(path.join(BUKU_BAWAAN, n)).isDirectory());
  assert.ok(folder.length >= 2);
  const { galat, baris } = bacaBukuTerverifikasi(BUKU_BAWAAN);
  assert.deepEqual(galat, []);
  assert.ok(baris.length > 0);
});

test('setiap soal di bank punya bukti tinjauan untuk sidik isinya sekarang (tanpa GAGAL; LOLOS, CATATAN yang diterima, atau pilot-pra-buku)', () => {
  const { baris } = bacaBukuTerverifikasi(BUKU_BAWAAN);
  const ctx = { baris, terimaBaru: new Set(), terima: bacaTerima(BUKU_BAWAAN), pilot: bacaPilot(BUKU_BAWAAN) };
  const masalah = BANK.flatMap((s) => masalahBukti(s, ctx));
  assert.deepEqual(masalah, []);
});

test('pilot-pra-buku.json: panjang dipatok, sidik cocok dengan bank, dan tidak tumpang tindih dengan bukti di buku', () => {
  const pilot = bacaPilot(BUKU_BAWAAN);
  assert.equal(pilot.length, PANJANG_PILOT_PRA_BUKU);
  const { baris } = bacaBukuTerverifikasi(BUKU_BAWAAN);
  assert.equal(new Set(pilot.map((p) => p.id)).size, pilot.length);
  for (const p of pilot) {
    const soal = BANK.find((s) => s.id === p.id);
    assert.ok(soal, `${p.id} tidak ada di bank`);
    assert.equal(hashSoal(soal), p.hash, `${p.id}: isi berubah sejak daftar dibuat`);
    assert.ok(!baris.some((b) => b.id === p.id && b.hash === p.hash), `${p.id} sudah punya bukti di buku; keluarkan dari daftar`);
  }
});

test('terima.json: tiap keputusan punya alasan dan merujuk baris CATATAN di buku dengan sidik yang sama', () => {
  const { baris } = bacaBukuTerverifikasi(BUKU_BAWAAN);
  const terima = bacaTerima(BUKU_BAWAAN);
  assert.ok(terima.length >= 3);
  for (const t of terima) {
    assert.match(t.tanggal, /^\d{4}-\d\d-\d\d$/);
    assert.ok(typeof t.alasan === 'string' && t.alasan.trim().length > 10, t.id);
    assert.ok(baris.some((b) => b.id === t.id && b.hash === t.hash && b.status === 'CATATAN'), `${t.id}: tidak ada baris CATATAN`);
  }
});

test('pilot-pra-buku.json dipatok isinya (sha256), bukan hanya panjangnya', () => {
  const berkas = path.join(BUKU_BAWAAN, 'pilot-pra-buku.json');
  assert.equal(sidikBerkas(berkas), SIDIK_PILOT_PRA_BUKU);
  // Negatif pada salinan: mengubah satu sidik soal (walau panjang tetap) mengubah sidik berkas.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pilot-uji-'));
  const salinan = path.join(dir, 'pilot-pra-buku.json');
  const daftar = JSON.parse(fs.readFileSync(berkas, 'utf8'));
  daftar[0] = { ...daftar[0], hash: '0000000000000000' };
  fs.writeFileSync(salinan, JSON.stringify(daftar, null, 2));
  assert.equal(JSON.parse(fs.readFileSync(salinan, 'utf8')).length, PANJANG_PILOT_PRA_BUKU);
  assert.notEqual(sidikBerkas(salinan), SIDIK_PILOT_PRA_BUKU);
});

test('setiap soal berstatus ditinjau punya persetujuan untuk sidik isinya sekarang (persetujuan.json boleh belum ada)', () => {
  assert.deepEqual(tanpaPersetujuan(BANK, bacaPersetujuan(BUKU_BAWAAN)), []);
  // Negatif pada salinan: tanpa catatan, atau catatan untuk isi lama, soal ditinjau ditolak.
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'setuju-uji-'));
  assert.deepEqual(bacaPersetujuan(dir), []);
  const soal = { ...BANK[0], status: 'ditinjau' };
  assert.deepEqual(tanpaPersetujuan([soal], bacaPersetujuan(dir)), [soal.id]);
  assert.deepEqual(tanpaPersetujuan([soal], [{ id: soal.id, hash: 'basi' }]), [soal.id]);
  assert.deepEqual(tanpaPersetujuan([soal], [{ id: soal.id, hash: hashSoal(soal) }]), []);
  assert.deepEqual(tanpaPersetujuan([{ ...soal, status: 'draf' }], []), []);
});
