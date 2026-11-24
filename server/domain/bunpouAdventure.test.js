import test from 'node:test';
import assert from 'node:assert/strict';
import { KATALOG_MATERI } from './materiBunpou/katalog.js';
import * as ba from './bunpouAdventure.js';

function rngBenih(benih) {
  let a = benih >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── fixture ──
const entri = (id, bab, tingkat = 'N5', modul = []) => ({ id, pola: id, arti: id, tingkat, sumber: { minnaBab: bab === null ? [] : [bab], modulN4: modul } });
const soal = (pola, n, bintang = n % 4) => ({
  id: `N5-${pola}-${n}`,
  pola,
  situasi: null,
  baris: [{ sebelum: 'a', sesudah: 'b' }],
  potongan: [`${pola}${n}a`, `${pola}${n}b`, `${pola}${n}c`, `${pola}${n}d`],
  bintang,
  urutanLain: [],
  terjemahan: 't',
  pembahasan: 'p',
});
const bankUntuk = (polaIds, jumlah = 4) => polaIds.flatMap((p) => Array.from({ length: jumlah }, (_, i) => soal(p, i + 1)));

// ── tahapVolume / polaVolume ──
test('tahapVolume: jumlah pola dan tahap tiap volume nyata sesuai keputusan F1', () => {
  const diharapkan = {
    BN5V1: [10, 3], BN5V2: [13, 5], BN5V3: [16, 5], BN5V4: [19, 5], BN5V5: [8, 3],
    BN4V1: [14, 5], BN4V2: [19, 5], BN4V3: [13, 4], BN4V4: [19, 5], BN4V5: [32, 7],
  };
  for (const v of ba.VOLUME_BUNPOU) {
    const pola = ba.polaVolume(v.kode);
    const tahap = ba.tahapVolume(v.kode);
    assert.deepEqual([pola.length, tahap.length], diharapkan[v.kode], v.kode);
    // setiap pola volume tercakup tepat sekali, dan tahap tidak melebihi batas
    assert.deepEqual(tahap.flatMap((t) => t.pola), pola, v.kode);
    for (const t of tahap) {
      assert.ok(t.pola.length >= 1 && t.pola.length <= ba.MAKS_POLA_TAHAP, `${v.kode} tahap ${t.index}`);
    }
    assert.deepEqual(tahap.map((t) => t.index), tahap.map((_, i) => i));
  }
});

test('tahapVolume: N4 Vol 5 memecah Bab 49 dan Bab 50 masing-masing menjadi 2 tahap', () => {
  const tahap = ba.tahapVolume('BN4V5');
  const per = (bab) => tahap.filter((t) => t.babDari === bab && t.babSampai === bab);
  assert.equal(per(49).length, 2);
  assert.equal(per(50).length, 2);
  assert.deepEqual(per(49).map((t) => t.pola.length), [5, 4]);
  assert.deepEqual(per(50).map((t) => t.pola.length), [6, 5]);
  assert.deepEqual(per(49).map((t) => [t.bagian, t.jumlahBagian]), [[1, 2], [2, 2]]);
});

test('tahapVolume: bab 1 pola digabung ke bab berikutnya (Bab 3-4, 10-11, 37-38)', () => {
  const rentang = (kode) => ba.tahapVolume(kode).map((t) => [t.babDari, t.babSampai]);
  assert.deepEqual(rentang('BN5V1'), [[1, 1], [2, 2], [3, 4]]);
  assert.ok(rentang('BN5V3').some(([a, b]) => a === 10 && b === 11));
  assert.ok(rentang('BN4V3').some(([a, b]) => a === 37 && b === 38));
});

test('tahapVolume: gabung bab 1 pola, bab terakhir 1 pola ke sebelumnya, dan pecah bab > 6 pola (katalog fixture)', () => {
  const katalog = [
    entri('a1', 1),
    entri('b1', 2), entri('b2', 2),
    ...Array.from({ length: 8 }, (_, i) => entri(`c${i}`, 3)),
    entri('d1', 4),
  ];
  const tahap = ba.tahapVolume('BN5V1', { katalog });
  // Bab 1 (1 pola) + Bab 2 = 3 pola; Bab 3 (8) + Bab 4 (terakhir, 1 pola) = 9 pola dipecah rata 5 + 4.
  assert.deepEqual(tahap.map((t) => [t.babDari, t.babSampai, t.bagian, t.jumlahBagian, t.pola.length]), [
    [1, 2, 1, 1, 3],
    [3, 4, 1, 2, 5],
    [3, 4, 2, 2, 4],
  ]);
  assert.deepEqual(tahap.flatMap((t) => t.pola).sort(), katalog.map((e) => e.id).sort());
});

test('babPola: setiap pola N4 punya bab (Minna atau BAB_MODUL) dan 19 pola modul-saja dipetakan', () => {
  const n4 = KATALOG_MATERI.filter((e) => e.tingkat === 'N4');
  for (const e of n4) assert.notEqual(ba.babPola(e), null, e.id);
  const tanpaBab = n4.filter((e) => e.sumber.minnaBab.length === 0);
  assert.equal(tanpaBab.length, 19);
  assert.deepEqual(tanpaBab.map((e) => e.id).sort(), Object.keys(ba.BAB_MODUL).sort());
  assert.equal(ba.babPola({ id: 'x', sumber: { minnaBab: [7, 5, 9] } }), 5);
  assert.equal(ba.babPola({ id: 'mama', sumber: { minnaBab: [] } }), 34);
  assert.equal(ba.babPola({ id: 'tak-ada', sumber: { minnaBab: [] } }), null);
});

test('polaVolume menolak volume yang tidak dikenal', () => {
  assert.throws(() => ba.polaVolume('XX'), /INVALID_BUNPOU_VOLUME/);
});

// ── statusRilis / volumeTersedia ──
test('statusRilis: dirilis hanya bila setiap pola punya >= MIN_VARIAN soal', () => {
  const pola = ba.polaVolume('BN5V1');
  assert.equal(ba.statusRilis('BN5V1', { bank: bankUntuk(pola, ba.MIN_VARIAN) }).dirilis, true);
  const kurang = ba.statusRilis('BN5V1', { bank: bankUntuk(pola, ba.MIN_VARIAN - 1) });
  assert.equal(kurang.dirilis, false);
  assert.equal(kurang.kurang.length, pola.length);
  assert.deepEqual(kurang.kurang[0], { pola: pola[0], ada: ba.MIN_VARIAN - 1 });
  // Bank nyata baru berisi pilot (6 dari 10 pola Vol 1, 7 dari 19 pola Vol 4): tidak ada volume yang dirilis.
  const v1 = ba.statusRilis('BN5V1', {});
  assert.equal(v1.dirilis, false);
  assert.equal(v1.kurang.length, 4);
  assert.equal(ba.statusRilis('BN5V4', {}).dirilis, false);
  for (const k of ba.URUTAN_VOLUME_BUNPOU) assert.equal(ba.statusRilis(k, {}).dirilis, false, k);
});

test('volumeTersedia: Vol 1 tiap tingkat terbuka (N4 tanpa N5); Vol n perlu Vol n-1 selesai', () => {
  assert.equal(ba.volumeTersedia([], 'BN5V1'), true);
  assert.equal(ba.volumeTersedia([], 'BN4V1'), true);
  assert.equal(ba.volumeTersedia([], 'BN5V2'), false);
  assert.equal(ba.volumeTersedia([{ volume: 'BN5V1', selesai: false }], 'BN5V2'), false);
  assert.equal(ba.volumeTersedia([{ volume: 'BN5V1', selesai: true }], 'BN5V2'), true);
  // Selesai di N5 tidak membuka N4 Vol 2; urutan per tingkat.
  assert.equal(ba.volumeTersedia([{ volume: 'BN5V5', selesai: true }], 'BN4V2'), false);
  assert.equal(ba.volumeTersedia([{ volume: 'BN4V1', selesai: true }], 'BN4V2'), true);
  assert.equal(ba.volumeTersedia([], 'TIDAK-ADA'), false);
});

// ── pilihVarian ──
test('pilihVarian: tidak memberi varian yang sudah benar dan tidak mengulang percobaan terakhir', () => {
  const s = bankUntuk(['p']);
  const hasil = ba.pilihVarian(s, [{ soal: 'N5-p-2', waktu: 't', benar: false }], { jumlah: 2, benarIds: ['N5-p-1'] });
  assert.deepEqual(hasil.map((x) => x.id), ['N5-p-3', 'N5-p-4']);
});

test('pilihVarian: belum pernah dilihat dulu, lalu paling lama tidak dilihat, deterministik', () => {
  const s = bankUntuk(['p']);
  const jejak = [
    { soal: 'N5-p-3', waktu: 't1', benar: false },
    { soal: 'N5-p-1', waktu: 't2', benar: false },
    { soal: 'N5-p-4', waktu: 't3', benar: false },
  ];
  const a = ba.pilihVarian(s, jejak, { jumlah: 3 });
  // p-2 belum pernah dilihat; p-3 paling lama; p-1 berikutnya; p-4 (terakhir) tidak ikut.
  assert.deepEqual(a.map((x) => x.id), ['N5-p-2', 'N5-p-3', 'N5-p-1']);
  assert.deepEqual(ba.pilihVarian(s, jejak, { jumlah: 3 }), a);
});

test('pilihVarian: calon kurang diisi varian yang dibuang, percobaan terakhir paling akhir; tanpa duplikat', () => {
  const s = bankUntuk(['p']);
  const jejak = [{ soal: 'N5-p-4', waktu: 't', benar: true }];
  const hasil = ba.pilihVarian(s, jejak, { jumlah: 4, benarIds: ['N5-p-1', 'N5-p-4'] });
  assert.deepEqual(hasil.map((x) => x.id), ['N5-p-2', 'N5-p-3', 'N5-p-1', 'N5-p-4']);
  assert.equal(new Set(hasil.map((x) => x.id)).size, hasil.length);
  // Bank kecil: tidak melebihi yang ada.
  assert.equal(ba.pilihVarian(s.slice(0, 2), [], { jumlah: 5 }).length, 2);
  // Percobaan terakhir tetap dipakai bila itu satu-satunya pilihan.
  assert.deepEqual(ba.pilihVarian(s.slice(0, 1), [{ soal: 'N5-p-1', waktu: 't', benar: false }], { jumlah: 1 }).map((x) => x.id), ['N5-p-1']);
});

// ── simulasi perjalanan ──
function progresFixture() {
  const tahap = [
    { index: 0, babDari: 1, babSampai: 1, bagian: 1, jumlahBagian: 1, pola: ['p1', 'p2'] },
    { index: 1, babDari: 2, babSampai: 2, bagian: 1, jumlahBagian: 1, pola: ['p3', 'p4'] },
  ];
  return ba.progresAwal('BN5V1', tahap);
}
const BANK = bankUntuk(['p1', 'p2', 'p3', 'p4']);

/** Main satu sesi; `salahPola` = pola yang dijawab salah. */
function main(progres, input, { salahPola = [], tgl = '2026-11-21T00:00:00.000Z', seed = 1 } = {}) {
  const rencana = ba.rencanaSesi(progres, 'BN5V1', input, { bank: BANK, rng: rngBenih(seed) });
  const jawaban = Object.fromEntries(rencana.kertas.map((k) => [
    k.id,
    salahPola.includes(k.pola) ? [1, 2, 3, 4].find((n) => n !== k.benar) : k.benar,
  ]));
  const hasil = ba.nilaiSesi(rencana.kertas, jawaban);
  const baru = ba.evaluasiProgres(progres, hasil, { tahapIndex: rencana.tahapIndex, sekarang: tgl });
  return { rencana, hasil, progres: baru };
}

test('rencanaSesi tahap: pola belum dikuasai mendapat 2 varian berbeda, diselang-seling', () => {
  const { rencana } = main(progresFixture(), { tahapIndex: 0 });
  assert.equal(rencana.mode, 'tahap');
  assert.equal(rencana.ronde, 0);
  assert.deepEqual(rencana.kertas.map((k) => k.pola), ['p1', 'p2', 'p1', 'p2']);
  const idP1 = rencana.kertas.filter((k) => k.pola === 'p1').map((k) => k.id);
  assert.equal(new Set(idP1).size, 2);
  assert.deepEqual(rencana.polaIds, ['p1', 'p2']);
});

test('pola dikuasai hanya setelah 2 jawaban benar pada 2 varian berbeda', () => {
  const p = progresFixture();
  const hasilSatu = { benar: 1, total: 1, lulus: true, detail: [{ soalId: 'N5-p1-1', pola: 'p1', benar: true }] };
  const a = ba.evaluasiProgres(p, hasilSatu, { tahapIndex: 0 });
  assert.deepEqual(a.dikuasai, []);
  // Varian yang sama dijawab benar lagi: tetap 1 varian.
  const b = ba.evaluasiProgres(a, hasilSatu, { tahapIndex: 0 });
  assert.deepEqual(b.benar.p1, ['N5-p1-1']);
  assert.deepEqual(b.dikuasai, []);
  // Varian berbeda: dikuasai.
  const c = ba.evaluasiProgres(b, { ...hasilSatu, detail: [{ soalId: 'N5-p1-2', pola: 'p1', benar: true }] }, { tahapIndex: 0 });
  assert.deepEqual(c.dikuasai, ['p1']);
  assert.equal(c.tahap_terbuka, 0, 'p2 belum dikuasai, tahap belum lulus');
  // Argumen tidak dimutasi.
  assert.deepEqual(p.benar, {});
});

test('ulangan tahap hanya memuat pola yang belum dikuasai dan sisa varian yang dibutuhkan', () => {
  let { progres } = main(progresFixture(), { tahapIndex: 0 });
  assert.equal(progres.tahap_terbuka, 1);
  const p0 = progresFixture();
  // p1 sudah benar pada 1 varian, p2 belum sama sekali.
  const awal = ba.evaluasiProgres(p0, { benar: 1, total: 1, lulus: true, detail: [{ soalId: 'N5-p1-1', pola: 'p1', benar: true }] }, { tahapIndex: 0 });
  const r = ba.rencanaSesi(awal, 'BN5V1', { tahapIndex: 0 }, { bank: BANK, rng: rngBenih(2) });
  assert.deepEqual(r.kertas.map((k) => k.pola), ['p1', 'p2', 'p2']);
  assert.ok(!r.kertas.some((k) => k.id === 'N5-p1-1'), 'varian yang sudah benar tidak muncul lagi');
  progres = awal;
});

test('tahap yang sudah dikuasai semua = latihan bebas: 1 varian per pola', () => {
  const { progres } = main(progresFixture(), { tahapIndex: 0 });
  const r = ba.rencanaSesi(progres, 'BN5V1', { tahapIndex: 0 }, { bank: BANK, rng: rngBenih(3) });
  assert.equal(r.latihan, true);
  assert.deepEqual(r.kertas.map((k) => k.pola), ['p1', 'p2']);
});

test('gerbang: tahap terkunci, tahap tidak valid, dan bos sebelum waktunya ditolak', () => {
  const p = progresFixture();
  const coba = (input) => () => ba.rencanaSesi(p, 'BN5V1', input, { bank: BANK });
  assert.throws(coba({ tahapIndex: 1 }), /TAHAP_TERKUNCI/);
  assert.throws(coba({ tahapIndex: 2 }), /TAHAP_TIDAK_VALID/);
  assert.throws(coba({ tahapIndex: -2 }), /TAHAP_TIDAK_VALID/);
  assert.throws(coba({ tahapIndex: 'abc' }), /TAHAP_TIDAK_VALID/);
  assert.throws(coba({}), /TAHAP_TIDAK_VALID/);
  assert.throws(coba({ mode: 'bos' }), /TAHAP_TERKUNCI/);
  // Semua tahap lulus tetapi tidak ada bos: bos tetap terkunci.
  const bersih = { ...p, tahap_terbuka: 2 };
  assert.throws(() => ba.rencanaSesi(bersih, 'BN5V1', { mode: 'bos' }, { bank: BANK }), /TAHAP_TERKUNCI/);
});

test('volume bersih melewati bos dan langsung selesai', () => {
  let { progres } = main(progresFixture(), { tahapIndex: 0 });
  assert.equal(progres.selesai, false);
  ({ progres } = main(progres, { tahapIndex: 1 }));
  assert.equal(progres.tahap_terbuka, 2);
  assert.deepEqual(progres.bosses, []);
  assert.equal(progres.selesai, true);
  assert.equal(progres.bos_ronde, 0);
  assert.throws(() => ba.rencanaSesi(progres, 'BN5V1', { mode: 'bos' }, { bank: BANK }), /TAHAP_TERKUNCI/);
});

test('volume dengan kesalahan selalu berakhir di ronde bos, dan benar di tahap tidak mengeluarkan dari bos', () => {
  let { progres } = main(progresFixture(), { tahapIndex: 0 }, { salahPola: ['p1'] });
  assert.deepEqual(progres.bosses.map((b) => b.id), ['p1']);
  assert.equal(progres.salah.p1, 2, 'p1 salah pada 2 soal');
  assert.equal(progres.tahap_terbuka, 0, 'p1 belum dikuasai');

  // Ulang tahap 0 dengan benar: p1 dikuasai, tahap lulus, tetapi p1 TETAP bos.
  ({ progres } = main(progres, { tahapIndex: 0 }, { seed: 2 }));
  assert.equal(progres.tahap_terbuka, 1);
  assert.ok(progres.dikuasai.includes('p1'));
  assert.deepEqual(progres.bosses.map((b) => b.id), ['p1']);

  ({ progres } = main(progres, { tahapIndex: 1 }));
  assert.equal(progres.tahap_terbuka, 2);
  assert.equal(progres.selesai, false, 'masih ada bos: wajib ronde bos');

  const sesiBos = main(progres, { mode: 'bos' });
  assert.equal(sesiBos.rencana.mode, 'bos');
  assert.equal(sesiBos.rencana.tahapIndex, -1);
  assert.equal(sesiBos.rencana.ronde, 1);
  assert.deepEqual(sesiBos.rencana.polaIds, ['p1']);
  assert.equal(sesiBos.rencana.kertas.length, 1);
  progres = sesiBos.progres;
  assert.deepEqual(progres.bosses, []);
  assert.equal(progres.bos_ronde, 1);
  assert.equal(progres.selesai, true);
});

test('bos yang dijawab salah tetap bos dan ronde berikutnya memakai varian lain', () => {
  let { progres } = main(progresFixture(), { tahapIndex: 0 }, { salahPola: ['p2'] });
  ({ progres } = main(progres, { tahapIndex: 0 }, { seed: 2 }));
  ({ progres } = main(progres, { tahapIndex: 1 }));
  const dipakai = [];
  for (let ronde = 1; ronde <= 3; ronde += 1) {
    const s = main(progres, { mode: 'bos' }, { salahPola: ['p2'], seed: 10 + ronde });
    assert.equal(s.rencana.ronde, ronde);
    dipakai.push(s.rencana.kertas[0].id);
    progres = s.progres;
    assert.equal(progres.selesai, false);
    assert.deepEqual(progres.bosses.map((b) => b.id), ['p2']);
  }
  assert.ok(dipakai.every((id, i) => i === 0 || id !== dipakai[i - 1]), 'varian bos tidak berulang berturutan');
  assert.equal(progres.bos_ronde, 3);
  assert.equal(progres.perlu_perhatian, true, 'bos >= 3 ronde');
  const akhir = main(progres, { mode: 'bos' });
  assert.equal(akhir.progres.selesai, true);
});

test('ronde bos memuat maksimal 10 pola, salah terbanyak dulu', () => {
  const ids = Array.from({ length: 14 }, (_, i) => `q${i}`);
  const tahap = [{ index: 0, babDari: 1, babSampai: 1, bagian: 1, jumlahBagian: 1, pola: ids }];
  const progres = {
    ...ba.progresAwal('BN5V1', tahap),
    tahap_terbuka: 1,
    bosses: ids.map((id, i) => ({ id, salah: i + 1, terakhirSalah: null })),
  };
  const r = ba.rencanaSesi(progres, 'BN5V1', { mode: 'bos' }, { bank: bankUntuk(ids) });
  assert.equal(r.kertas.length, ba.MAKS_POLA_BOS);
  assert.deepEqual(r.polaIds, ids.slice().reverse().slice(0, 10));
  // Tiap pola satu varian.
  assert.equal(new Set(r.kertas.map((k) => k.pola)).size, 10);
});

test('selesai tetap: mengulang tahap di volume selesai tidak menguncinya dan tidak menambah bos', () => {
  let { progres } = main(progresFixture(), { tahapIndex: 0 });
  ({ progres } = main(progres, { tahapIndex: 1 }));
  assert.equal(progres.selesai, true);
  const s = main(progres, { tahapIndex: 0 }, { salahPola: ['p1', 'p2'] });
  assert.equal(s.progres.selesai, true);
  assert.deepEqual(s.progres.bosses, []);
  assert.ok(s.progres.salah.p1 >= 1, 'kesalahan tetap dicatat untuk sensei');
  assert.ok(s.progres.dikuasai.includes('p1'), 'dikuasai tidak berkurang');
});

test('sesi berulang tidak pernah memakai ulang varian percobaan terakhir untuk pola yang sama', () => {
  let progres = progresFixture();
  for (let i = 0; i < 8; i += 1) {
    const terakhir = {};
    for (const [pola, jejak] of Object.entries(progres.jejak)) terakhir[pola] = jejak.at(-1).soal;
    const s = main(progres, { tahapIndex: 0 }, { salahPola: ['p1', 'p2'], seed: i + 1 });
    for (const k of s.rencana.kertas) {
      assert.notEqual(k.id, terakhir[k.pola], `sesi ${i}: ${k.id} dipakai ulang`);
    }
    assert.equal(new Set(s.rencana.kertas.map((k) => k.id)).size, s.rencana.kertas.length);
    progres = s.progres;
  }
  assert.ok(progres.jejak.p1.length <= ba.MAKS_JEJAK);
});

// ── nilaiSesi / ringkas ──
test('nilaiSesi: dinilai dari kertas, nomor aneh dihitung salah', () => {
  const r = ba.rencanaSesi(progresFixture(), 'BN5V1', { tahapIndex: 0 }, { bank: BANK, rng: rngBenih(5) });
  const [k1, k2, k3, k4] = r.kertas;
  const hasil = ba.nilaiSesi(r.kertas, { [k1.id]: String(k1.benar), [k2.id]: true, [k3.id]: 99, extra: 1 });
  assert.equal(hasil.total, 4);
  assert.equal(hasil.benar, 1);
  assert.equal(hasil.skor, 25);
  assert.equal(hasil.lulus, false);
  assert.equal(hasil.detail[1].dipilih, null);
  assert.equal(hasil.detail[3].soalId, k4.id);
  assert.equal(hasil.detail[0].kunci, k1.benar);
  assert.deepEqual(hasil.detail[0].urutan, k1.urutan);
  const semua = ba.nilaiSesi(r.kertas, Object.fromEntries(r.kertas.map((k) => [k.id, k.benar])));
  assert.deepEqual([semua.benar, semua.skor, semua.lulus], [4, 100, true]);
  assert.equal(ba.nilaiSesi([], {}).skor, 0);
  assert.equal(ba.nilaiSesi(r.kertas, null).benar, 0);
});

test('ringkasProgres dan perlu_perhatian', () => {
  assert.deepEqual(ba.ringkasProgres(null), { tahap_terbuka: 0, dikuasai: 0, bos: 0, selesai: false, perlu_perhatian: false });
  let { progres } = main(progresFixture(), { tahapIndex: 0 }, { salahPola: ['p1'] });
  assert.deepEqual(ba.ringkasProgres(progres), { tahap_terbuka: 0, dikuasai: 1, bos: 1, selesai: false, perlu_perhatian: false });
  // Satu pola salah >= 3 kali menandai perhatian.
  for (let i = 0; i < 2; i += 1) ({ progres } = main(progres, { tahapIndex: 0 }, { salahPola: ['p1'], seed: 20 + i }));
  assert.equal(progres.perlu_perhatian, true);
});

test('daftarBossBunpou menggabung duplikat dan menormalkan bentuk lama', () => {
  const daftar = ba.daftarBossBunpou({
    bosses: ['a', { id: 'a', salah: 2, terakhirSalah: '2026-11-20T00:00:00.000Z' }, { id: 'b', salah: 1 }, null, 7],
  });
  assert.deepEqual(daftar, [
    { id: 'a', salah: 2, terakhirSalah: '2026-11-20T00:00:00.000Z' },
    { id: 'b', salah: 1, terakhirSalah: null },
  ]);
});

// ── snapshot beku vs bank hidup ──
test('statusRilis dengan progres menilai pola snapshot tahap (dan bos-nya), bukan katalog hidup', () => {
  const progres = { ...progresFixture(), bosses: [{ id: 'hantu', salah: 1, terakhirSalah: null }] };
  const bank = bankUntuk(['p1', 'p2', 'p3', 'p4']);
  // Tanpa progres: katalog hidup BN5V1, banknya tidak punya pola itu.
  assert.equal(ba.statusRilis('BN5V1', { bank }).dirilis, false);
  // Dengan progres: yang dinilai p1-p4, tetapi bos 'hantu' tidak punya varian.
  const r = ba.statusRilis('BN5V1', { bank, progres });
  assert.equal(r.dirilis, false);
  assert.deepEqual(r.kurang, [{ pola: 'hantu', ada: 0 }]);
  assert.equal(ba.statusRilis('BN5V1', { bank: [...bank, ...bankUntuk(['hantu'])], progres }).dirilis, true);
});

test('rencanaSesi menolak (VOLUME_BELUM_DIRILIS) alih-alih membuang pola tanpa varian cukup', () => {
  const p = progresFixture();
  const tanpaP2 = BANK.filter((s) => s.pola !== 'p2');
  assert.throws(() => ba.rencanaSesi(p, 'BN5V1', { tahapIndex: 0 }, { bank: tanpaP2 }), /VOLUME_BELUM_DIRILIS/);
  // Satu varian saja tidak cukup untuk 2 jawaban benar pada 2 varian berbeda.
  const satu = [...tanpaP2, soal('p2', 1)];
  assert.throws(() => ba.rencanaSesi(p, 'BN5V1', { tahapIndex: 0 }, { bank: satu }), /VOLUME_BELUM_DIRILIS/);
  // Bos tanpa varian tidak dilewati diam-diam.
  const bos = { ...p, tahap_terbuka: 2, bosses: [{ id: 'p1', salah: 1, terakhirSalah: null }] };
  assert.throws(() => ba.rencanaSesi(bos, 'BN5V1', { mode: 'bos' }, { bank: BANK.filter((s) => s.pola !== 'p1') }), /VOLUME_BELUM_DIRILIS/);
});
