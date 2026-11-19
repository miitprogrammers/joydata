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
  return isi.slice(mulai, mulai + 1400);
};

test('rute portal kanji adventure terdaftar dan mengikuti pola rute portal lain', () => {
  const router = baca('src/router/index.js');
  assert.match(router, /path: 'kanji-adventure'/);
  assert.match(router, /PortalKanjiAdventureView/);
  assert.doesNotMatch(router, /path: '\/portal\/kanji-adventure'/);
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

test('halaman adventure memakai layout portal dan menjalankan latihan tanpa sessionStorage', () => {
  const halaman = baca('src/views/portal/PortalKanjiAdventureView.vue');
  assert.match(halaman, /joy-surface/);
  assert.doesNotMatch(halaman, /<v-container/);
  assert.match(halaman, /KanjiRunner/);
  assert.doesNotMatch(halaman, /sessionStorage|kanjiAdventureSesi/);
});

test('halaman adventure memakai semua endpoint yang dibutuhkan', () => {
  const halaman = baca('src/views/portal/PortalKanjiAdventureView.vue');
  assert.match(halaman, /buatKlienAdventure/);
  assert.match(halaman, /\.daftarVolume\(/);
  assert.match(halaman, /\.bacaVolume\(/);
  assert.match(halaman, /\.mulai\(/);
  assert.match(halaman, /\.nilai\(/);
  assert.match(halaman, /\.detak\(/);
  assert.match(halaman, /\.riwayat\(/);
});

test('monitor latihan memuat panel adventure dan boss dari endpoint staff', () => {
  const monitor = baca('src/views/MonitorLatihanView.vue');
  assert.match(monitor, /buatKlienAdventure/);
  assert.match(monitor, /monitorPeserta/);
  assert.match(monitor, /monitorLatihan\.adventureJudul/);
  assert.match(monitor, /boss\.items/);
  assert.match(baca('src/locales/id.js'), /VOLUME_TERKUNCI:/);
  assert.match(baca('src/locales/ja.js'), /VOLUME_TERKUNCI:/);
});
