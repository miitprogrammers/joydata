import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  bisaMulaiBoss,
  bisaMulaiChunk,
  buatKlienAdventure,
  i18nStatusKey,
  ringkasProgresAdventure,
  statusBoss,
  statusChunk,
  statusVolume,
} from './kanjiAdventure.js';

test('statusVolume memakai selesai lebih dulu daripada terkunci', () => {
  assert.equal(statusVolume({ progres: { selesai: true }, terkunci: false }), 'selesai');
  assert.equal(statusVolume({ progres: { selesai: false }, terkunci: true }), 'terkunci');
  assert.equal(statusVolume({ progres: { selesai: false }, terkunci: false }), 'tersedia');
});

test('statusChunk dan statusBoss memakai status dari server', () => {
  assert.equal(statusChunk({ status: 'selesai' }), 'selesai');
  assert.equal(statusChunk({ status: 'tersedia' }), 'tersedia');
  assert.equal(statusChunk({ status: 'terkunci' }), 'terkunci');
  assert.equal(statusBoss({ status: 'terkunci' }), 'terkunci');
});

test('bisaMulaiChunk menolak volume terkunci dan chunk bukan tersedia', () => {
  assert.equal(bisaMulaiChunk({ terkunci: false }, { status: 'tersedia' }), true);
  assert.equal(bisaMulaiChunk({ terkunci: true }, { status: 'tersedia' }), false);
  assert.equal(bisaMulaiChunk({ terkunci: false }, { status: 'selesai' }), false);
});

test('bisaMulaiBoss hanya terbuka bila volume terbuka dan boss tersedia', () => {
  assert.equal(bisaMulaiBoss({ terkunci: false }, { status: 'tersedia' }), true);
  assert.equal(bisaMulaiBoss({ terkunci: true }, { status: 'tersedia' }), false);
  assert.equal(bisaMulaiBoss({ terkunci: false }, { status: 'terkunci' }), false);
});

test('i18nStatusKey memetakan status ke kunci tampilan', () => {
  assert.equal(i18nStatusKey('selesai', 'chunk'), 'portal.kanjiAdventure.chunkSelesai');
  assert.equal(i18nStatusKey('tersedia', 'chunk'), 'portal.kanjiAdventure.chunkTersedia');
  assert.equal(i18nStatusKey('terkunci', 'chunk'), 'portal.kanjiAdventure.chunkTerkunci');
  assert.equal(i18nStatusKey('selesai', 'volume'), 'portal.kanjiAdventure.volumeSelesai');
});

test('ringkasProgresAdventure membulatkan persentase dan menjaga batas 0-100', () => {
  assert.deepEqual(ringkasProgresAdventure({ chunk_terbuka: 2, chunkCount: 8, dikuasai: 15, bosses: 0 }), {
    selesai: false,
    persen: 25,
    dikuasai: 15,
    bosses: 0,
  });
  assert.equal(ringkasProgresAdventure({ chunk_terbuka: 99, chunkCount: 8 }).persen, 100);
  assert.equal(ringkasProgresAdventure({ chunk_terbuka: 2, chunkCount: 0 }).persen, 0);
  assert.equal(ringkasProgresAdventure({ selesai: true, chunk_terbuka: 8, chunkCount: 8 }).selesai, true);
});

test('klien adventure memanggil endpoint portal dengan method dan body yang benar', async () => {
  const dipanggil = [];
  const request = async (path, opsi) => {
    dipanggil.push({ path, opsi });
    return { ok: true, path };
  };
  const klien = buatKlienAdventure({ request });

  assert.deepEqual(await klien.daftarVolume(), { ok: true, path: '/kanji-adventure/volume' });
  await klien.bacaVolume('N5');
  await klien.mulai({ materi: 'N5', mode: 'chunk', chunkIndex: 2 });
  await klien.riwayat({ dari: '2026-01-01' });

  assert.deepEqual(dipanggil, [
    { path: '/kanji-adventure/volume', opsi: {} },
    { path: '/kanji-adventure/volume/N5', opsi: {} },
    {
      path: '/kanji-adventure/mulai',
      opsi: { method: 'POST', body: { materi: 'N5', mode: 'chunk', chunkIndex: 2 } },
    },
    { path: '/kanji-adventure/riwayat', opsi: { query: { dari: '2026-01-01' } } },
  ]);
});

test('URL akhir klien adventure tidak boleh dobel /portal', async () => {
  // Meniru server nyata: rute yang benar butuh token (UNAUTHORIZED), path dobel
  // dijawab Express dengan HTML 404 sehingga portalApi menghasilkan GENERIC_ERROR.
  const fetchAsli = globalThis.fetch;
  const storageAsli = globalThis.localStorage;
  const diminta = [];
  globalThis.localStorage = { getItem: () => '', setItem() {}, removeItem() {} };
  globalThis.fetch = async (url) => {
    diminta.push(url);
    if (url === '/api/portal/kanji-adventure/volume') {
      return {
        ok: false,
        status: 401,
        headers: { get: () => null },
        json: async () => ({ error: 'UNAUTHORIZED' }),
      };
    }
    return {
      ok: false,
      status: 404,
      headers: { get: () => null },
      json: async () => {
        throw new Error('bukan JSON');
      },
    };
  };

  try {
    const klien = buatKlienAdventure();
    let err = null;
    try {
      await klien.daftarVolume();
    } catch (e) {
      err = e;
    }
    assert.deepEqual(diminta, ['/api/portal/kanji-adventure/volume']);
    assert.equal(err?.code, 'UNAUTHORIZED');
  } finally {
    globalThis.fetch = fetchAsli;
    globalThis.localStorage = storageAsli;
  }
});
