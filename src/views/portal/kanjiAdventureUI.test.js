import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const baca = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const blokAdventure = (rel) => {
  const isi = baca(rel);
  const mulai = isi.indexOf('kanjiAdventure: {');
  assert.notEqual(mulai, -1, `${rel} harus punya blok kanjiAdventure`);
  return isi.slice(mulai, mulai + 900);
};

test('rute portal kanji adventure terdaftar', () => {
  const router = baca('src/router/index.js');
  assert.match(router, /path: '\/portal\/kanji-adventure'/);
  assert.match(router, /KanjiAdventureMapView/);
});

test('menu samping portal memuat tautan kanji adventure', () => {
  const layout = baca('src/views/portal/PortalLayout.vue');
  assert.match(layout, /key: 'kanjiAdventure'/);
  assert.match(layout, /to: '\/portal\/kanji-adventure'/);
});

test('terjemahan menu dan judul adventure ada di dua bahasa', () => {
  const id = baca('src/locales/id.js');
  const ja = baca('src/locales/ja.js');
  assert.match(id, /kanjiAdventure:\s*'Kanji Adventure'/);
  assert.match(ja, /kanjiAdventure:\s*'漢字アドベンチャー'/);
  assert.match(blokAdventure('src/locales/id.js'), /judul:/);
  assert.match(blokAdventure('src/locales/ja.js'), /judul:/);
});

test('halaman peta memakai semua endpoint adventure yang dibutuhkan', () => {
  const halaman = baca('src/views/portal/KanjiAdventureMapView.vue');
  assert.match(halaman, /buatKlienAdventure/);
  assert.match(halaman, /\.daftarVolume\(/);
  assert.match(halaman, /\.bacaVolume\(/);
  assert.match(halaman, /\.mulai\(/);
  assert.match(halaman, /\.riwayat\(/);
});
