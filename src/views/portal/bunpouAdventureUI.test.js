import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import idLocale from '../../locales/id.js';
import jaLocale from '../../locales/ja.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const baca = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const rute = baca('src/router/index.js');
const layout = baca('src/views/portal/PortalLayout.vue');

test('rute portal bunpou adventure terdaftar di samping kanji adventure', () => {
  assert.match(rute, /path: 'bunpou-adventure'/);
  assert.match(rute, /name: 'portal-bunpou-adventure'/);
  assert.match(rute, /PortalBunpouAdventureView/);
  assert.match(rute, /portalTitle: 'portal\.menu\.bunpouAdventure'/);
  assert.doesNotMatch(rute, /path: '\/portal\/bunpou-adventure'/);
});

test('menu samping portal memuat tautan bunpou adventure dengan ikon bintang', () => {
  assert.match(layout, /key: 'bunpouAdventure'/);
  assert.match(layout, /to: '\/portal\/bunpou-adventure'/);
  assert.match(layout, /mdi-star-four-points/);
});

test('terjemahan menu, halaman, monitor, label jenis dan galat ada di dua bahasa', () => {
  for (const [nama, loc] of [['id', idLocale], ['ja', jaLocale]]) {
    assert.ok(loc.portal.menu.bunpouAdventure, `${nama}: portal.menu.bunpouAdventure`);
    assert.ok(loc.portal.bunpouAdventure.judul, `${nama}: portal.bunpouAdventure.judul`);
    assert.ok(loc.portal.latihanHariIni.bunpou, `${nama}: latihanHariIni.bunpou`);
    assert.ok(loc.monitorLatihan.jenisBunpou, `${nama}: jenisBunpou`);
    assert.ok(loc.monitorLatihan.bunpouJudul, `${nama}: bunpouJudul`);
    for (const kode of ['TAHAP_TERKUNCI', 'VOLUME_BELUM_DIRILIS', 'INVALID_BUNPOU_VOLUME', 'TAHAP_TIDAK_VALID', 'GAGAL_SESI_BUNPOU']) {
      assert.ok(loc.messages[kode], `${nama}: messages.${kode}`);
    }
  }
  assert.equal(idLocale.portal.menu.bunpouAdventure, 'Bunpou Adventure');
  assert.equal(jaLocale.portal.menu.bunpouAdventure, '文法アドベンチャー');
  assert.equal(idLocale.monitorLatihan.jenisBunpou, 'Bunpou');
  assert.equal(jaLocale.monitorLatihan.jenisBunpou, '文法');
});

test('kunci portal.bunpouAdventure sama persis di kedua bahasa', () => {
  const kunci = (o) => Object.keys(o).sort();
  assert.deepEqual(kunci(jaLocale.portal.bunpouAdventure), kunci(idLocale.portal.bunpouAdventure));
  const monitor = (loc) => Object.keys(loc.monitorLatihan).filter((k) => k.startsWith('bunpou')).sort();
  assert.deepEqual(monitor(jaLocale), monitor(idLocale));
});

test('semua kunci i18n yang dipakai komponen bunpou ada di kamus', () => {
  const berkas = [
    'src/views/portal/PortalBunpouAdventureView.vue',
    'src/components/portal/bunpou/SoalBintang.vue',
    'src/components/portal/bunpou/BintangRunner.vue',
    'src/components/monitor/MonitorBunpouAdventure.vue',
    'src/services/bunpouAdventure.js',
  ];
  const ada = (loc, kunciPenuh) => kunciPenuh.split('.').reduce((o, k) => (o ? o[k] : undefined), loc) !== undefined;
  for (const rel of berkas) {
    const isi = baca(rel);
    for (const m of isi.matchAll(/['"`]((?:portal\.bunpouAdventure|monitorLatihan\.bunpou)\.[A-Za-z]+)['"`]/g)) {
      assert.ok(ada(idLocale, m[1]), `${rel}: ${m[1]} tidak ada di id`);
      assert.ok(ada(jaLocale, m[1]), `${rel}: ${m[1]} tidak ada di ja`);
    }
  }
  // kunci status yang dibentuk di helper
  for (const kunci of ['tahapSelesai', 'tahapTersedia', 'tahapTerkunci', 'volumeSelesai', 'volumeTersedia', 'volumeTerkunci', 'volumeSegera', 'bosTerkunci']) {
    assert.ok(idLocale.portal.bunpouAdventure[kunci], `id: ${kunci}`);
    assert.ok(jaLocale.portal.bunpouAdventure[kunci], `ja: ${kunci}`);
  }
});

test('halaman memakai layout portal, runner bintang, dan semua endpoint yang dibutuhkan', () => {
  const halaman = baca('src/views/portal/PortalBunpouAdventureView.vue');
  assert.match(halaman, /joy-surface/);
  assert.doesNotMatch(halaman, /<v-container/);
  assert.match(halaman, /BintangRunner/);
  assert.doesNotMatch(halaman, /sessionStorage/);
  assert.match(halaman, /buatKlienBunpou/);
  for (const fn of ['daftarVolume', 'bacaVolume', 'mulai', 'nilai', 'riwayat']) {
    assert.match(halaman, new RegExp(`\\.${fn}\\(`));
  }
  assert.match(baca('src/components/portal/bunpou/BintangRunner.vue'), /\.detak\(/);
  assert.match(baca('src/components/portal/bunpou/BintangRunner.vue'), /useDetakAktivitas/);
  assert.match(baca('src/components/portal/bunpou/BintangRunner.vue'), /mulai\(0, 'bunpou'\)/);
});

test('volume belum dirilis tampil Segera dan tombol mulai dikunci lewat helper', () => {
  const halaman = baca('src/views/portal/PortalBunpouAdventureView.vue');
  assert.match(halaman, /volumeSegera|segeraInfo/);
  assert.match(halaman, /bisaMulaiTahap\(volumeAktif, item\)/);
  assert.match(halaman, /bisaMulaiBos\(volumeAktif/);
});

test('soal bintang: kotak ★, 4 tombol jawaban besar, tombol 1-4, umpan balik, dan teks Jepang tidak diterjemahkan', () => {
  const soal = baca('src/components/portal/bunpou/SoalBintang.vue');
  assert.match(soal, /★/);
  assert.match(soal, /min-h-\[56px\]/);
  assert.match(soal, /\[1-4\]/);
  assert.match(soal, /role="status"/);
  assert.match(soal, /FuriganaText/);
  assert.match(soal, /kertas\.terjemahan/);
  assert.match(soal, /kertas\.pembahasan/);
  // setiap elemen dengan lang="ja" juga translate="no"
  for (const rel of ['src/components/portal/bunpou/SoalBintang.vue', 'src/views/portal/PortalBunpouAdventureView.vue', 'src/components/monitor/MonitorBunpouAdventure.vue']) {
    const isi = baca(rel);
    for (const tag of isi.match(/<[^>]*lang="ja"[^>]*>/g) || []) {
      assert.match(tag, /translate="no"/, `${rel}: ${tag}`);
    }
  }
});

test('kirim nilai hanya sekali: penjaga di halaman dan sekali-jalan di runner', () => {
  const halaman = baca('src/views/portal/PortalBunpouAdventureView.vue');
  assert.ok(halaman.includes('if (!sesi.value?.sesiId || mengirim.value) return;'));
  const runner = baca('src/components/portal/bunpou/BintangRunner.vue');
  assert.ok(runner.includes('let sudahKirim = false'));
  assert.ok(runner.includes('else if (!sudahKirim)'));
  assert.ok(runner.indexOf('sudahKirim = true;') < runner.indexOf("emit('selesai'"));
  // tombol 1-4 dan Enter mengabaikan Ctrl/Alt/Meta
  assert.ok(baca('src/components/portal/bunpou/SoalBintang.vue').includes('e.ctrlKey || e.altKey || e.metaKey'));
  assert.ok(runner.includes('!e.ctrlKey && !e.altKey && !e.metaKey'));
});

test('SESI_TIDAK_ADA saat menilai menghentikan detak tanpa sinyal akhir dan kembali ke peta', () => {
  const halaman = baca('src/views/portal/PortalBunpouAdventureView.vue');
  const i = halaman.indexOf("err?.code === 'SESI_TIDAK_ADA'");
  assert.ok(i > 0);
  const blok = halaman.slice(i, i + 500);
  assert.ok(blok.includes('berhenti({ kirimAkhir: false })'));
  assert.ok(blok.includes("tahap.value = 'peta'"));
});

test('monitor latihan memuat panel bunpou dari endpoint staf dan tautan materi hanya untuk yang berhak', () => {
  const monitor = baca('src/views/MonitorLatihanView.vue');
  assert.match(monitor, /MonitorBunpouAdventure/);
  const panel = baca('src/components/monitor/MonitorBunpouAdventure.vue');
  assert.match(panel, /monitorPeserta/);
  assert.match(panel, /canAccess\('materi-bunpou'\)/);
  assert.match(panel, /\/materi-bunpou\//);
  assert.match(panel, /polaLemah/);
});

test('jenis bunpou muncul di rincian latihan harian portal dan dasbor', () => {
  assert.match(baca('src/services/latihanHariIni.js'), /bunpou: 0/);
  assert.match(baca('src/components/portal/LatihanHariIni.vue'), /kode: 'bunpou'/);
  assert.match(baca('src/components/dashboard/DashLatihanHarian.vue'), /key: 'bunpou'/);
  assert.match(baca('src/views/OverviewView.vue'), /bunpou: t\('monitorLatihan\.jenisBunpou'\)/);
});
