import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  bisaMulaiBos,
  bisaMulaiTahap,
  buatKlienBunpou,
  i18nStatusKey,
  jumlahPolaSesi,
  judulVolume,
  kotakSoal,
  labelTahap,
  polaDikuasaiSesi,
  ringkasProgresBunpou,
  statusBos,
  statusTahap,
  statusVolume,
  susunKalimat,
  ukuranRondeBos,
} from './bunpouAdventure.js';

const t = (kunci, p = {}) => `${kunci}|${JSON.stringify(p)}`;

test('statusVolume: selesai menang atas segera, segera menang atas terkunci', () => {
  assert.equal(statusVolume({ dirilis: true, progres: { selesai: true }, terkunci: true }), 'selesai');
  assert.equal(statusVolume({ dirilis: false, progres: {}, terkunci: false }), 'segera');
  assert.equal(statusVolume({ dirilis: false, progres: {}, terkunci: true }), 'segera');
  assert.equal(statusVolume({ dirilis: true, progres: {}, terkunci: true }), 'terkunci');
  assert.equal(statusVolume({ dirilis: true, progres: {}, terkunci: false }), 'tersedia');
});

test('statusTahap dan statusBos memakai status dari server', () => {
  assert.equal(statusTahap({ status: 'selesai' }), 'selesai');
  assert.equal(statusTahap({ status: 'aneh' }), 'terkunci');
  assert.equal(statusBos({ status: 'tersedia' }), 'tersedia');
  assert.equal(statusBos(null), 'terkunci');
});

test('bisaMulaiTahap menolak volume terkunci atau belum dirilis, tahap selesai boleh diulang', () => {
  assert.equal(bisaMulaiTahap({ dirilis: true, terkunci: false }, { status: 'tersedia' }), true);
  assert.equal(bisaMulaiTahap({ dirilis: true, terkunci: false }, { status: 'selesai' }), true);
  assert.equal(bisaMulaiTahap({ dirilis: true, terkunci: false }, { status: 'terkunci' }), false);
  assert.equal(bisaMulaiTahap({ dirilis: true, terkunci: true }, { status: 'tersedia' }), false);
  assert.equal(bisaMulaiTahap({ dirilis: false, terkunci: false }, { status: 'tersedia' }), false);
});

test('bisaMulaiBos hanya terbuka bila volume dirilis dan terbuka dan bos tersedia', () => {
  assert.equal(bisaMulaiBos({ dirilis: true, terkunci: false }, { status: 'tersedia' }), true);
  assert.equal(bisaMulaiBos({ dirilis: false, terkunci: false }, { status: 'tersedia' }), false);
  assert.equal(bisaMulaiBos({ dirilis: true, terkunci: true }, { status: 'tersedia' }), false);
  assert.equal(bisaMulaiBos({ dirilis: true, terkunci: false }, { status: 'selesai' }), false);
});

test('i18nStatusKey memetakan status ke kunci tampilan', () => {
  assert.equal(i18nStatusKey('selesai', 'tahap'), 'portal.bunpouAdventure.tahapSelesai');
  assert.equal(i18nStatusKey('terkunci', 'bos'), 'portal.bunpouAdventure.tahapTerkunci');
  assert.equal(i18nStatusKey('segera', 'volume'), 'portal.bunpouAdventure.volumeSegera');
  assert.equal(i18nStatusKey('x', 'volume'), 'portal.bunpouAdventure.tahapTerkunci');
});

test('judulVolume dan labelTahap dibangun dari angka respons, bukan teks Indonesia dari server', () => {
  assert.equal(
    judulVolume({ jlpt: 'N5', nomor: 4, bab: [16, 21], judul: 'x' }, t),
    'portal.bunpouAdventure.volumeJudul|{"jlpt":"N5","n":4,"dari":16,"sampai":21}'
  );
  assert.equal(judulVolume({ judul: 'N5 Vol 4' }, t), 'N5 Vol 4');
  assert.equal(labelTahap({ babDari: 16, babSampai: 16, bagian: 1, jumlahBagian: 1 }, t), 'portal.bunpouAdventure.babSatu|{"n":16}');
  assert.equal(
    labelTahap({ babDari: 37, babSampai: 38, bagian: 1, jumlahBagian: 1 }, t),
    'portal.bunpouAdventure.babRentang|{"dari":37,"sampai":38}'
  );
  assert.match(labelTahap({ babDari: 49, babSampai: 49, bagian: 1, jumlahBagian: 2 }, t), / \(1\/2\)$/);
});

test('ringkasProgresBunpou memakai pola dikuasai dan menyisakan 100% untuk volume selesai', () => {
  assert.deepEqual(ringkasProgresBunpou({ dikuasai: 10, bos: 2 }, { jumlahPola: 40 }), {
    selesai: false,
    persen: 25,
    dikuasai: 10,
    jumlah: 40,
    bos: 2,
  });
  assert.equal(ringkasProgresBunpou({ dikuasai: 40 }, { jumlahPola: 40 }).persen, 99);
  assert.equal(ringkasProgresBunpou({ selesai: true, dikuasai: 40 }, { jumlahPola: 40 }).persen, 100);
  assert.equal(ringkasProgresBunpou({ dikuasai: 3 }, {}).persen, 0);
});

test('pola sesi: dikuasai = pola berbeda dikurangi sisa', () => {
  const soal = [{ pola: 'a' }, { pola: 'a' }, { pola: 'b' }, { pola: 'c' }];
  assert.equal(jumlahPolaSesi(soal), 3);
  assert.equal(polaDikuasaiSesi(soal, 1), 2);
  assert.equal(polaDikuasaiSesi(soal, 9), 0);
  assert.equal(polaDikuasaiSesi(soal, undefined), 3);
});

test('ukuranRondeBos dibatasi 10 pola', () => {
  assert.equal(ukuranRondeBos(14), 10);
  assert.equal(ukuranRondeBos(4), 4);
  assert.equal(ukuranRondeBos(0), 0);
});

test('kotakSoal menandai kotak bintang dan susunKalimat menyusun urutan benar', () => {
  const kertas = {
    bintang: 1,
    baris: [
      { pembicara: 'A', sebelum: 'すみません、つぎの', sesudah: 'まがってください。' },
      { pembicara: 'B', teks: 'はい。' },
    ],
    pilihan: [
      { nomor: 1, teks: 'に' },
      { nomor: 2, teks: 'しんごう' },
      { nomor: 3, teks: '右' },
      { nomor: 4, teks: 'を' },
    ],
    benar: 4,
    urutan: [2, 4, 3, 1],
  };
  assert.deepEqual(kotakSoal(kertas).map((k) => k.bintang), [false, true, false, false]);
  const k = susunKalimat(kertas);
  assert.equal(k.sebelum, 'すみません、つぎの');
  assert.deepEqual(k.bagian.map((b) => b.teks), ['しんごう', 'を', '右', 'に']);
  assert.deepEqual(k.bagian.map((b) => b.bintang), [false, true, false, false]);
});

test('klien memanggil endpoint portal dengan method, body, dan query yang benar', async () => {
  const dipanggil = [];
  const request = async (path, opsi) => {
    dipanggil.push({ path, opsi });
    return { ok: true };
  };
  const klien = buatKlienBunpou({ request });
  await klien.daftarVolume();
  await klien.bacaVolume('n5-v1');
  await klien.mulai({ volume: 'n5-v1', tahapIndex: 0 });
  await klien.mulai({ volume: 'n5-v1', mode: 'bos' });
  await klien.detak('s1', { detikAktif: 15 });
  await klien.nilai('s1', { x: 2 }, { detikAktif: 30 });
  await klien.riwayat({ dari: '2026-01-01' });
  assert.deepEqual(dipanggil, [
    { path: '/bunpou-adventure/volume', opsi: {} },
    { path: '/bunpou-adventure/volume/n5-v1', opsi: {} },
    { path: '/bunpou-adventure/mulai', opsi: { method: 'POST', body: { volume: 'n5-v1', tahapIndex: 0 } } },
    { path: '/bunpou-adventure/mulai', opsi: { method: 'POST', body: { volume: 'n5-v1', mode: 'bos' } } },
    { path: '/bunpou-adventure/detak', opsi: { method: 'POST', body: { sesiId: 's1', detikAktif: 15 }, diam: true, keepalive: undefined } },
    { path: '/bunpou-adventure/nilai', opsi: { method: 'POST', body: { sesiId: 's1', jawaban: { x: 2 }, detikAktif: 30 } } },
    { path: '/bunpou-adventure/riwayat?dari=2026-01-01', opsi: {} },
  ]);
});

test('detak: keepalive dan diam menjadi opsi permintaan, bukan isi JSON', async () => {
  const dipanggil = [];
  const klien = buatKlienBunpou({ request: async (path, opsi) => { dipanggil.push({ path, opsi }); return {}; } });
  await klien.detak('s1', { detikAktif: 15, selesai: true, keepalive: true });
  assert.deepEqual(dipanggil[0].opsi, { method: 'POST', body: { sesiId: 's1', detikAktif: 15, selesai: true }, diam: true, keepalive: true });
});

test('endpoint sensei memakai jalur staff /monitor-latihan', async () => {
  const staff = [];
  const klien = buatKlienBunpou({
    request: async () => ({}),
    requestStaff: async (path, opsi) => {
      staff.push({ path, opsi });
      return {};
    },
  });
  await klien.monitorPeserta(7, { periode: '7' });
  assert.deepEqual(staff, [{ path: '/monitor-latihan/bunpou-adventure/peserta/7?periode=7', opsi: {} }]);
});

test('URL akhir klien tidak boleh dobel /portal', async () => {
  const fetchAsli = globalThis.fetch;
  const storageAsli = globalThis.localStorage;
  const diminta = [];
  globalThis.localStorage = { getItem: () => '', setItem() {}, removeItem() {} };
  globalThis.fetch = async (url) => {
    diminta.push(url);
    return { ok: false, status: 401, headers: { get: () => null }, json: async () => ({ error: 'UNAUTHORIZED' }) };
  };
  try {
    const klien = buatKlienBunpou();
    let err = null;
    try {
      await klien.daftarVolume();
    } catch (e) {
      err = e;
    }
    assert.deepEqual(diminta, ['/api/portal/bunpou-adventure/volume']);
    assert.equal(err?.code, 'UNAUTHORIZED');
  } finally {
    globalThis.fetch = fetchAsli;
    globalThis.localStorage = storageAsli;
  }
});
