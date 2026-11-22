import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Mode lokal: pastikan tidak ada Postgres yang terpakai dan state ditulis di folder scratch.
delete process.env.DATABASE_URL;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ba-repo-'));
process.chdir(tmp);

const repo = await import('./bunpouAdventureRepo.js');
const engine = await import('./engine.js');

const TAHAP = [
  { index: 0, babDari: 1, babSampai: 1, bagian: 1, jumlahBagian: 1, pola: ['p1', 'p2'] },
  { index: 1, babDari: 2, babSampai: 2, bagian: 1, jumlahBagian: 1, pola: ['p3'] },
];

test('state lokal baru punya kedua kunci Bunpou Adventure', async () => {
  await repo.daftarProgresBunpou(1);
  const state = engine.readLocalState();
  assert.deepEqual(state.bunpouAdventureProgres, []);
  assert.deepEqual(state.bunpouAdventureSesi, []);
});

test('progres awal peserta kosong', async () => {
  assert.equal(await repo.bacaProgresBunpou(1, 'BN5V1'), null);
  assert.deepEqual(await repo.daftarProgresBunpou(1), []);
});

test('snapshot tahap dibuat sekali dan tidak berubah saat dipanggil ulang', async () => {
  const a = await repo.pastikanProgresBunpou(1, 'BN5V1', TAHAP);
  assert.deepEqual(a.tahap, TAHAP);
  assert.equal(a.tahap_terbuka, 0);
  assert.equal(a.selesai, false);
  assert.deepEqual(a.benar, {});
  const b = await repo.pastikanProgresBunpou(1, 'BN5V1', [{ index: 0, babDari: 9, babSampai: 9, pola: ['x'] }]);
  assert.deepEqual(b.tahap, TAHAP);
  assert.equal(b.pesertaId, 1);
});

test('simpanProgresBunpou memperbarui semua field dan dibaca kembali', async () => {
  const awal = await repo.bacaProgresBunpou(1, 'BN5V1');
  await repo.simpanProgresBunpou(1, 'BN5V1', {
    ...awal,
    tahap_terbuka: 1,
    benar: { p1: ['N5-p1-1', 'N5-p1-2'] },
    dikuasai: ['p1'],
    bosses: [{ id: 'p2', salah: 2, terakhirSalah: '2026-11-21T00:00:00.000Z' }],
    salah: { p2: 2 },
    jejak: { p2: [{ soal: 'N5-p2-1', waktu: '2026-11-21T00:00:00.000Z', benar: false }] },
    bos_ronde: 1,
    perlu_perhatian: true,
    riwayat: [{ tahapIndex: 0, ronde: 0, benar: 1, total: 2, lulus: false, waktu: 'w' }],
  });
  const baca = await repo.bacaProgresBunpou(1, 'BN5V1');
  assert.equal(baca.tahap_terbuka, 1);
  assert.deepEqual(baca.benar, { p1: ['N5-p1-1', 'N5-p1-2'] });
  assert.deepEqual(baca.dikuasai, ['p1']);
  assert.deepEqual(baca.bosses, [{ id: 'p2', salah: 2, terakhirSalah: '2026-11-21T00:00:00.000Z' }]);
  assert.deepEqual(baca.salah, { p2: 2 });
  assert.equal(baca.jejak.p2[0].soal, 'N5-p2-1');
  assert.equal(baca.bos_ronde, 1);
  assert.equal(baca.perlu_perhatian, true);
  assert.deepEqual(baca.tahap, TAHAP, 'tahap tidak ikut berubah');
  // pastikan tidak menimpa progres yang sudah ada.
  assert.equal((await repo.pastikanProgresBunpou(1, 'BN5V1', TAHAP)).tahap_terbuka, 1);
});

test('daftarProgresBunpou mengurutkan sesuai urutan volume dan memisahkan peserta', async () => {
  await repo.pastikanProgresBunpou(1, 'BN4V1', TAHAP);
  await repo.pastikanProgresBunpou(1, 'BN5V2', TAHAP);
  const semua = await repo.daftarProgresBunpou(1);
  assert.deepEqual(semua.map((p) => p.volume), ['BN5V1', 'BN5V2', 'BN4V1']);
  assert.deepEqual(await repo.daftarProgresBunpou(2), []);
});

test('bentuk objek sama untuk baris Postgres (jsonb, tanggal Date, id string) dan state lokal', () => {
  const lokal = {
    pesertaId: 3, volume: 'BN5V1', tahap: TAHAP, tahap_terbuka: 1, benar: { p1: ['a'] }, dikuasai: ['p1'],
    bosses: [{ id: 'p2', salah: 1, terakhirSalah: null }], salah: { p2: 1 }, jejak: {}, bos_ronde: 0,
    selesai: false, perlu_perhatian: false, riwayat: [], updatedAt: '2026-11-21T00:00:00.000Z',
  };
  const pg = { ...lokal, pesertaId: '3', tahap_terbuka: '1', updatedAt: new Date('2026-11-21T00:00:00.000Z'), bosses: ['p2'] };
  const a = repo.progresBunpouView(lokal);
  const b = repo.progresBunpouView(pg);
  assert.deepEqual(Object.keys(a), Object.keys(b));
  assert.equal(b.pesertaId, 3);
  assert.equal(b.updatedAt, a.updatedAt);
  assert.deepEqual(b.bosses, [{ id: 'p2', salah: 0, terakhirSalah: null }]);
  assert.deepEqual(repo.progresBunpouView({ pesertaId: 1, volume: 'x' }).tahap, []);
  assert.equal(repo.progresBunpouView(null), null);

  const sesiLokal = {
    id: 's', pesertaId: 3, volume: 'BN5V1', mode: 'tahap', tahapIndex: 0, ronde: 0, aktivitasId: 5,
    polaIds: ['p1'], soal: [], dibuatPada: '2026-11-21T00:00:00.000Z', kedaluwarsaPada: '2026-11-21T00:30:00.000Z',
  };
  const sesiPg = { ...sesiLokal, pesertaId: '3', tahapIndex: '0', aktivitasId: '5', kedaluwarsaPada: new Date('2026-11-21T00:30:00.000Z') };
  assert.deepEqual(repo.sesiBunpouView(sesiPg), repo.sesiBunpouView(sesiLokal));
});

test('tambahSesiBunpou mencatat latihan jenis bunpou mode latihan', async () => {
  const aktivitasId = await repo.tambahSesiBunpou(1, { volume: 'BN5V1', judul: 'N5 Vol 1 · Bab 1', jlpt: 'N5', jumlahItem: 4 });
  assert.ok(aktivitasId, 'aktivitasId harus terisi');
  const sesi = engine.readLocalState().latihanSesi.find((s) => s.id === aktivitasId);
  assert.equal(sesi.jenis, 'bunpou');
  assert.equal(sesi.mode, 'latihan');
  assert.equal(sesi.materi, 'adventure');
  assert.equal(sesi.materiJudul, 'Bunpou Adventure · N5 Vol 1 · Bab 1');
});

test('sesi disimpan, hanya bisa dibaca pemiliknya, lalu dihapus', async () => {
  const kedaluwarsaPada = new Date(Date.now() + 60_000).toISOString();
  const tersimpan = await repo.simpanSesiBunpou({
    id: 'sesi-1', pesertaId: 1, volume: 'BN5V1', mode: 'tahap', tahapIndex: 0, ronde: 0, aktivitasId: 123,
    polaIds: ['p1'], soal: [{ id: 'N5-p1-1', benar: 2, pilihan: [] }], kedaluwarsaPada,
  });
  assert.ok(tersimpan);
  const baca = await repo.bacaSesiBunpou('sesi-1', 1);
  assert.equal(baca.tahapIndex, 0);
  assert.equal(baca.aktivitasId, 123);
  assert.deepEqual(baca.polaIds, ['p1']);
  assert.equal(baca.soal[0].benar, 2, 'kunci tersimpan di server');
  assert.equal(await repo.bacaSesiBunpou('sesi-1', 2), null);
  await repo.hapusSesiBunpou('sesi-1', 1);
  assert.equal(await repo.bacaSesiBunpou('sesi-1', 1), null);
});

test('sesi yang kedaluwarsa tidak terbaca dan dibersihkan', async () => {
  await repo.simpanSesiBunpou({
    id: 'sesi-lewat', pesertaId: 1, volume: 'BN5V1', mode: 'tahap', tahapIndex: 0, polaIds: ['p1'],
    kedaluwarsaPada: new Date(Date.now() - 1000).toISOString(),
  });
  assert.equal(await repo.bacaSesiBunpou('sesi-lewat', 1), null);
  assert.equal(engine.readLocalState().bunpouAdventureSesi.some((s) => s.id === 'sesi-lewat'), false);
  // Sesi bersih ditolak walau disuntik `sekarang` yang lebih awal dari kedaluwarsa.
  await repo.simpanSesiBunpou({
    id: 'sesi-segar', pesertaId: 1, volume: 'BN5V1', mode: 'bos', tahapIndex: -1, polaIds: ['p1'],
    kedaluwarsaPada: new Date(Date.now() + 5000).toISOString(),
  });
  assert.ok(await repo.bacaSesiBunpou('sesi-segar', 1));
  assert.equal(await repo.bacaSesiBunpou('sesi-segar', 1, { sekarang: Date.now() + 10_000 }), null);
});

// ── penilaian atomik ──
const evaluasiTambah = (sesi, progres) => ({ hasil: { n: sesi.soal.length }, progresBaru: { ...progres, bos_ronde: progres.bos_ronde + 1 } });

async function siapkanSesi(id, pesertaId = 11) {
  await repo.pastikanProgresBunpou(pesertaId, 'BN5V1', TAHAP);
  await repo.simpanSesiBunpou({
    id, pesertaId, volume: 'BN5V1', mode: 'tahap', tahapIndex: 0, polaIds: ['p1'], soal: [{ id: 'N5-p1-1', benar: 2 }],
  });
}

test('nilaiSesiBunpouAtomik: kertas dipakai habis, progres tersimpan, dan kertas yang sama tidak bisa dinilai dua kali', async () => {
  await siapkanSesi('atomik-1');
  const [a, b] = await Promise.allSettled([
    repo.nilaiSesiBunpouAtomik(11, 'atomik-1', evaluasiTambah),
    repo.nilaiSesiBunpouAtomik(11, 'atomik-1', evaluasiTambah),
  ]);
  assert.equal([a, b].filter((r) => r.status === 'fulfilled').length, 1);
  const gagal = [a, b].find((r) => r.status === 'rejected');
  assert.equal(gagal.reason.message, 'SESI_TIDAK_ADA');
  assert.equal((await repo.bacaProgresBunpou(11, 'BN5V1')).bos_ronde, 1, 'dinilai sekali');
  assert.equal(await repo.bacaSesiBunpou('atomik-1', 11), null);
});

test('nilaiSesiBunpouAtomik: galat evaluasi (gerbang) membiarkan kertas dan progres utuh', async () => {
  await siapkanSesi('atomik-2');
  const sebelum = await repo.bacaProgresBunpou(11, 'BN5V1');
  await assert.rejects(
    repo.nilaiSesiBunpouAtomik(11, 'atomik-2', () => { throw new Error('TAHAP_TERKUNCI'); }),
    /TAHAP_TERKUNCI/,
  );
  assert.ok(await repo.bacaSesiBunpou('atomik-2', 11), 'kertas masih ada');
  assert.deepEqual(await repo.bacaProgresBunpou(11, 'BN5V1'), sebelum);
});

test('nilaiSesiBunpouAtomik: kertas orang lain atau kedaluwarsa = SESI_TIDAK_ADA; evaluasi menerima semua progres', async () => {
  await siapkanSesi('atomik-3');
  await assert.rejects(repo.nilaiSesiBunpouAtomik(12, 'atomik-3', evaluasiTambah), /SESI_TIDAK_ADA/);
  let dilihat = null;
  await repo.pastikanProgresBunpou(11, 'BN4V1', TAHAP);
  await repo.nilaiSesiBunpouAtomik(11, 'atomik-3', (s, p, semua) => { dilihat = semua.map((x) => x.volume); return evaluasiTambah(s, p); });
  assert.deepEqual(dilihat, ['BN5V1', 'BN4V1']);
  await repo.simpanSesiBunpou({
    id: 'atomik-lewat', pesertaId: 11, volume: 'BN5V1', mode: 'tahap', tahapIndex: 0, kedaluwarsaPada: new Date(Date.now() - 1000).toISOString(),
  });
  await assert.rejects(repo.nilaiSesiBunpouAtomik(11, 'atomik-lewat', evaluasiTambah), /SESI_TIDAK_ADA/);
});

test('daftarProgresBunpouKetat membaca seperti daftarProgresBunpou', async () => {
  assert.deepEqual(await repo.daftarProgresBunpouKetat(11), await repo.daftarProgresBunpou(11));
});
