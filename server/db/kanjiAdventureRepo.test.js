import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Mode lokal: pastikan tidak ada Postgres yang terpakai dan state ditulis di folder scratch.
delete process.env.DATABASE_URL;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ka-repo-'));
process.chdir(tmp);

const repo = await import('./kanjiAdventureRepo.js');

test('progres awal peserta kosong', async () => {
  assert.equal(await repo.bacaProgresAdventure(1, 'DASAR'), null);
  assert.deepEqual(await repo.daftarProgresAdventure(1), []);
});

test('pastikanProgresAdventure mengunci snapshot itemIds dan idempoten', async () => {
  const a = await repo.pastikanProgresAdventure(1, 'DASAR', ['D1', 'D2', 'D3']);
  assert.deepEqual(a.itemIds, ['D1', 'D2', 'D3']);
  assert.equal(a.chunk_terbuka, 0);
  assert.equal(a.selesai, false);
  const b = await repo.pastikanProgresAdventure(1, 'DASAR', ['X', 'Y']);
  assert.deepEqual(b.itemIds, ['D1', 'D2', 'D3']);
  assert.equal(b.pesertaId, 1);
});

test('simpanProgresAdventure memperbarui field dan dibaca kembali', async () => {
  const awal = await repo.bacaProgresAdventure(1, 'DASAR');
  const hasil = await repo.simpanProgresAdventure(1, 'DASAR', {
    ...awal,
    dikuasai: ['D1', 'D2'],
    bosses: [{ id: 'D3', salah: 1 }],
    boss_ronde: 2,
    chunk_terbuka: 1,
    perlu_perhatian: true,
  });
  assert.equal(hasil.chunk_terbuka, 1);
  assert.equal(hasil.perlu_perhatian, true);
  const baca = await repo.bacaProgresAdventure(1, 'DASAR');
  assert.deepEqual(baca.dikuasai, ['D1', 'D2']);
  assert.equal(baca.boss_ronde, 2);
});

test('repo menggabung attempt boss duplikat dan menormalkan boss lawas saat dibaca', async () => {
  await repo.simpanProgresAdventure(7, 'VOL1', {
    itemIds: ['V1', 'V2', 'V3'],
    dikuasai: ['V1'],
    bosses: [
      'V2',
      { id: 'V2', salah: 2, terakhirSalah: '2026-11-20T00:00:00.000Z' },
      { id: 'V3', salah: 1 },
      null,
    ],
    boss_ronde: 4,
    chunk_terbuka: 3,
    selesai: false,
    perlu_perhatian: false,
    riwayat: [],
  });

  const baca = await repo.bacaProgresAdventure(7, 'VOL1');
  assert.deepEqual(baca.bosses, [
    { id: 'V2', salah: 2, terakhirSalah: '2026-11-20T00:00:00.000Z' },
    { id: 'V3', salah: 1, terakhirSalah: null },
  ]);
  assert.equal(baca.boss_ronde, 4);
});

test('daftarProgresAdventure mengurutkan sesuai URUTAN_VOLUME', async () => {
  await repo.pastikanProgresAdventure(1, 'N4VOL1', ['N1']);
  const semua = await repo.daftarProgresAdventure(1);
  assert.deepEqual(semua.map((p) => p.materi), ['DASAR', 'N4VOL1']);
  assert.deepEqual(await repo.daftarProgresAdventure(2), []);
});

test('tambahSesiAdventure mencatat latihan practice', async () => {
  const aktivitasId = await repo.tambahSesiAdventure(1, {
    materi: 'DASAR', judul: 'Dasar', jlpt: 'N5', jumlahItem: 3,
  });
  assert.ok(aktivitasId, 'aktivitasId harus terisi');
});

test('sesi adventure disimpan, hanya bisa dibaca pemiliknya, lalu dihapus', async () => {
  const kedaluwarsaPada = new Date(Date.now() + 60_000).toISOString();
  const tersimpan = await repo.simpanSesiAdventure({
    id: 'sesi-repo-1',
    pesertaId: 1,
    materi: 'DASAR',
    mode: 'reguler',
    chunkIndex: 0,
    ronde: 1,
    aktivitasId: 123,
    itemIds: ['D1', 'D2'],
    soal: [{ id: 'D1', bacaan: { benar: 'x' }, arti: { benar: 'y' } }],
    kedaluwarsaPada,
  });
  assert.ok(tersimpan, 'sesi harus tersimpan di state lokal');
  assert.equal(tersimpan.mode, 'reguler');

  const baca = await repo.bacaSesiAdventure('sesi-repo-1', 1);
  assert.equal(baca.chunkIndex, 0);
  assert.equal(baca.aktivitasId, 123);
  assert.deepEqual(baca.itemIds, ['D1', 'D2']);
  assert.equal(baca.soal.length, 1);
  assert.equal(await repo.bacaSesiAdventure('sesi-repo-1', 2), null);

  await repo.hapusSesiAdventure('sesi-repo-1', 1);
  assert.equal(await repo.bacaSesiAdventure('sesi-repo-1', 1), null);
});

test('sesi adventure yang kedaluwarsa dianggap tidak ada', async () => {
  await repo.simpanSesiAdventure({
    id: 'sesi-repo-lewat',
    pesertaId: 1,
    materi: 'DASAR',
    mode: 'reguler',
    chunkIndex: 0,
    itemIds: ['D1'],
    soal: [{ id: 'D1' }],
    kedaluwarsaPada: new Date(Date.now() - 60_000).toISOString(),
  });
  assert.equal(await repo.bacaSesiAdventure('sesi-repo-lewat', 1), null);
});

test('pastikanProgresAdventure tidak pernah mereset progres yang sudah ada', async () => {
  await repo.pastikanProgresAdventure(21, 'DASAR', ['D1', 'D2']);
  await repo.simpanProgresAdventure(21, 'DASAR', {
    itemIds: ['D1', 'D2'], dikuasai: ['D1'], bosses: [{ id: 'D2', salah: 2 }],
    boss_ronde: 1, chunk_terbuka: 1, selesai: true, perlu_perhatian: false, riwayat: [],
  });
  const lagi = await repo.pastikanProgresAdventure(21, 'DASAR', ['X']);
  assert.deepEqual(lagi.dikuasai, ['D1']);
  assert.equal(lagi.selesai, true);
  assert.equal(lagi.bosses[0].salah, 2);
});

async function siapkanSesi(id, pesertaId) {
  await repo.simpanProgresAdventure(pesertaId, 'DASAR', {
    itemIds: ['D1', 'D2'], dikuasai: ['D1'], bosses: [], boss_ronde: 0,
    chunk_terbuka: 0, selesai: false, perlu_perhatian: false, riwayat: [],
  });
  await repo.simpanSesiAdventure({
    id, pesertaId, materi: 'DASAR', mode: 'reguler', chunkIndex: 0,
    itemIds: ['D1', 'D2'], soal: [{ id: 'D1' }],
    kedaluwarsaPada: new Date(Date.now() + 60_000).toISOString(),
  });
}

test('nilaiSesiAdventureAtomik menilai sekali: yang kedua SESI_TIDAK_ADA, hanya pemilik yang bisa', async () => {
  await siapkanSesi('sesi-atomik-1', 5);
  const evaluasi = (sesi, progres) => ({ hasil: { ok: true }, progresBaru: { ...progres, chunk_terbuka: 1 } });
  await assert.rejects(repo.nilaiSesiAdventureAtomik(6, 'sesi-atomik-1', evaluasi), /SESI_TIDAK_ADA/);
  const [a, b] = await Promise.allSettled([
    repo.nilaiSesiAdventureAtomik(5, 'sesi-atomik-1', evaluasi),
    repo.nilaiSesiAdventureAtomik(5, 'sesi-atomik-1', evaluasi),
  ]);
  assert.deepEqual([a.status, b.status].sort(), ['fulfilled', 'rejected']);
  assert.equal((await repo.bacaProgresAdventure(5, 'DASAR')).chunk_terbuka, 1);
  assert.equal(await repo.bacaSesiAdventure('sesi-atomik-1', 5), null);
});

test('nilaiSesiAdventureAtomik: gerbang yang gagal membiarkan kertas dan progres utuh', async () => {
  await siapkanSesi('sesi-atomik-2', 8);
  const sebelum = await repo.bacaProgresAdventure(8, 'DASAR');
  await assert.rejects(
    repo.nilaiSesiAdventureAtomik(8, 'sesi-atomik-2', () => { throw new Error('VOLUME_TERKUNCI'); }),
    /VOLUME_TERKUNCI/,
  );
  assert.ok(await repo.bacaSesiAdventure('sesi-atomik-2', 8));
  const sesudah = await repo.bacaProgresAdventure(8, 'DASAR');
  assert.deepEqual(sesudah, sebelum);
});

test('pastikanProgresAdventure mengisi itemIds kosong tanpa menyentuh dikuasai dan bosses', async () => {
  await repo.simpanProgresAdventure(22, 'DASAR', {
    itemIds: [], dikuasai: ['D1'], bosses: [{ id: 'D2', salah: 3 }],
    boss_ronde: 2, chunk_terbuka: 1, selesai: false, perlu_perhatian: true, riwayat: [],
  });
  const hasil = await repo.pastikanProgresAdventure(22, 'DASAR', ['D1', 'D2', 'D3']);
  assert.deepEqual(hasil.itemIds, ['D1', 'D2', 'D3']);
  assert.deepEqual(hasil.dikuasai, ['D1']);
  assert.equal(hasil.bosses[0].salah, 3);
  assert.equal(hasil.boss_ronde, 2);
  const baca = await repo.bacaProgresAdventure(22, 'DASAR');
  assert.deepEqual(baca.itemIds, ['D1', 'D2', 'D3']);
  assert.deepEqual(baca.dikuasai, ['D1']);
});
