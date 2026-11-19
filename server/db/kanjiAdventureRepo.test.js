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
