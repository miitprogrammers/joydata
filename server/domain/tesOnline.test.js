import test from 'node:test';
import assert from 'node:assert/strict';
import {
  daftarMateriTes,
  buatSoalTes,
  soalTanpaKunci,
  nilaiTes,
  catatanHasilTes,
  validateSesiTes,
  buatKodeTes,
  normalisasiKodeTes,
  alasanKodeTidakBerlaku,
  artiBeririsan,
  PANJANG_KODE,
} from './tesOnline.js';
import { KANJI_DASAR } from './bankSoal/kanjiN5.js';
import { DOKKAI_LEVEL } from './bankSoal/dokkaiN5.js';

// Small seeded generator so a failing paper can be reproduced.
function rngDari(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test('Tes online catalogue: 80 kanji dasar, five volumes, and the dokkai levels', () => {
  const { kanji, dokkai } = daftarMateriTes();
  const byKode = Object.fromEntries(kanji.map((m) => [m.kode, m.jumlah]));
  assert.equal(byKode.DASAR, 80);
  assert.equal(byKode.VOL1, 84);
  assert.equal(byKode.SEMUA, 417); // 服 is in VOL4 and VOL5 but asked once
  assert.equal(dokkai.find((m) => m.kode === 'L1').jumlah, 3);
  assert.deepEqual(
    dokkai.find((m) => m.kode === 'SEMUA'),
    { kode: 'SEMUA', judul: 'Gabungan semua level', jumlah: 15, jumlahSoal: 30, saranNamaUjian: 'DK-ALL' }
  );
});

test('Kanji paper: random subset per attempt, four distinct options, and the key points at the right answer', () => {
  const a = buatSoalTes({ jenis: 'kanji', materi: 'VOL1', jumlah: 20 }, rngDari(1));
  const b = buatSoalTes({ jenis: 'kanji', materi: 'VOL1', jumlah: 20 }, rngDari(2));
  assert.equal(a.length, 20);
  assert.equal(new Set(a.map((s) => s.id)).size, 20);
  assert.notDeepEqual(a.map((s) => s.id), b.map((s) => s.id));

  for (const s of a) {
    for (const bagian of [s.bacaan, s.arti]) {
      assert.equal(bagian.opsi.length, 4);
      assert.equal(new Set(bagian.opsi).size, 4);
    }
    const artiBenar = s.arti.opsi[s.arti.benar];
    for (const opsi of s.arti.opsi) {
      if (opsi !== artiBenar) assert.equal(artiBeririsan(artiBenar, opsi), false, `${s.kanji}: ${opsi}`);
    }
  }
  const atsui = buatSoalTes({ jenis: 'kanji', materi: 'VOL1' }, rngDari(3)).find((s) => s.kanji === '暑い');
  assert.equal(atsui.bacaan.opsi[atsui.bacaan.benar], 'あつい');
  assert.equal(atsui.arti.opsi[atsui.arti.benar], 'Panas (cuaca)');
});

test('Kanji paper never offers another valid reading or an overlapping meaning as a wrong option', () => {
  for (let seed = 1; seed <= 40; seed++) {
    const paper = buatSoalTes({ jenis: 'kanji', materi: 'SEMUA' }, rngDari(seed));
    const soto = paper.find((s) => s.kanji === '外');
    assert.ok(!soto.bacaan.opsi.includes('ほか'));
    const samui = paper.find((s) => s.kanji === '寒い');
    assert.ok(!samui.arti.opsi.includes('Dingin (benda/sentuhan)'));
  }
  assert.equal(artiBeririsan('Makan malam', 'Makan malam (santai)'), true);
  assert.equal(artiBeririsan('Bekerja', 'Bekerja di (suatu tempat)'), true);
  assert.equal(artiBeririsan('Musim semi', 'Musim panas'), false);
});

test('Kanji dasar asks one main reading, with distractors in the same script that are not readings of that kanji', () => {
  const dasar = new Map(KANJI_DASAR.map(([k, on, kun]) => [k, new Set([...on, ...kun])]));
  for (let seed = 1; seed <= 10; seed++) {
    for (const s of buatSoalTes({ jenis: 'kanji', materi: 'DASAR' }, rngDari(seed))) {
      const benar = s.bacaan.opsi[s.bacaan.benar];
      const katakana = /^[゠-ヿ]/.test(benar);
      assert.ok(dasar.get(s.kanji).has(benar));
      for (const opsi of s.bacaan.opsi) {
        assert.equal(/^[゠-ヿ]/.test(opsi), katakana, `${s.kanji}: ${opsi}`);
        if (opsi !== benar) assert.ok(!dasar.get(s.kanji).has(opsi), `${s.kanji}: ${opsi}`);
      }
      assert.ok(s.semuaBacaan);
    }
  }
});

test('Dokkai paper shuffles passages and options but keeps every answer key right', () => {
  const asli = new Map(DOKKAI_LEVEL.flatMap((l) => l.bacaan.flatMap((b) => b.soal)).map((s) => [s.id, s.opsi[s.benar]]));
  const paper = buatSoalTes({ jenis: 'dokkai', materi: 'SEMUA', jumlah: 5 }, rngDari(7));
  assert.equal(paper.length, 5);
  for (const b of paper) for (const s of b.soal) assert.equal(s.opsi[s.benar], asli.get(s.id));
  const urutan = (seed) => buatSoalTes({ jenis: 'dokkai', materi: 'SEMUA' }, rngDari(seed)).map((b) => b.id).join();
  assert.notEqual(urutan(1), urutan(2));
});

test('Official paper hides the key, translation and explanation', () => {
  const kanji = soalTanpaKunci('kanji', buatSoalTes({ jenis: 'kanji', materi: 'VOL2', jumlah: 3 }, rngDari(1)));
  assert.equal(kanji[0].bacaan.benar, undefined);
  assert.equal(kanji[0].arti.benar, undefined);
  assert.equal(kanji[0].semuaBacaan, undefined);
  const dokkai = soalTanpaKunci('dokkai', buatSoalTes({ jenis: 'dokkai', materi: 'L2' }, rngDari(1)));
  assert.equal(dokkai[0].terjemahan, undefined);
  assert.equal(dokkai[0].soal[0].benar, undefined);
  assert.equal(dokkai[0].soal[0].pembahasan, undefined);
});

test('Grading: kanji reading and meaning are half a point each, dokkai one point per question', () => {
  const kanji = buatSoalTes({ jenis: 'kanji', materi: 'VOL3', jumlah: 2 }, rngDari(5));
  const [k1, k2] = kanji;
  const hasilKanji = nilaiTes('kanji', kanji, {
    [k1.id]: { bacaan: k1.bacaan.benar, arti: k1.arti.benar },
    [k2.id]: { bacaan: k2.bacaan.benar, arti: (k2.arti.benar + 1) % 4 },
  });
  assert.equal(hasilKanji.skor, 75);
  assert.equal(hasilKanji.benar, 1);
  assert.equal(hasilKanji.benarBacaan, 2);
  assert.equal(hasilKanji.benarArti, 1);
  assert.match(catatanHasilTes({ jenis: 'kanji', materiJudul: 'Volume 3', kode: 'ABC234' }, hasilKanji), /Bacaan 2\/2 · Arti 1\/2 · Perlu diulang: /);

  const dokkai = buatSoalTes({ jenis: 'dokkai', materi: 'L1' }, rngDari(5));
  const semuaSoal = dokkai.flatMap((b) => b.soal);
  const jawaban = Object.fromEntries(semuaSoal.map((s, i) => [s.id, i % 2 === 0 ? s.benar : (s.benar + 1) % 3]));
  const hasilDokkai = nilaiTes('dokkai', dokkai, jawaban);
  assert.equal(hasilDokkai.total, 6);
  assert.equal(hasilDokkai.skor, 50);
  assert.equal(nilaiTes('dokkai', dokkai, {}).skor, 0);
});

test('Test codes: six unambiguous characters, typed in any case', () => {
  const kode = buatKodeTes((n) => Math.floor(Math.random() * n));
  assert.equal(kode.length, PANJANG_KODE);
  assert.match(kode, /^[A-HJKMNP-Z2-9]+$/);
  assert.equal(normalisasiKodeTes(' k7m-2qx '), 'K7M2QX');

  const now = new Date('2026-11-02T10:00:00Z');
  assert.equal(alasanKodeTidakBerlaku(null, now), 'TES_KODE_TIDAK_DITEMUKAN');
  assert.equal(alasanKodeTidakBerlaku({ status: 'ditutup' }, now), 'TES_KODE_DITUTUP');
  assert.equal(alasanKodeTidakBerlaku({ status: 'aktif', berlakuSampai: '2026-11-02T09:00:00Z' }, now), 'TES_KODE_DITUTUP');
  assert.equal(alasanKodeTidakBerlaku({ status: 'aktif', berlakuSampai: null }, now), null);
});

test('Opening a test code: class, material and exam code are required; a count of all questions means "all"', () => {
  const ok = validateSesiTes({ kelasId: 3, jenis: 'kanji', materi: 'VOL1', jumlahSoal: 20, tanggalUjian: '2026-11-05', namaUjian: 'kj-v1' });
  assert.equal(ok.ok, true);
  assert.equal(ok.normalized.namaUjian, 'KJ-V1');
  assert.equal(ok.normalized.jumlahSoal, 20);
  assert.equal(validateSesiTes({ kelasId: 3, jenis: 'kanji', materi: 'VOL1', jumlahSoal: 84, tanggalUjian: '2026-11-05', namaUjian: 'X' }).normalized.jumlahSoal, null);
  assert.equal(validateSesiTes({ kelasId: 3, jenis: 'dokkai', materi: 'VOL1', tanggalUjian: '2026-11-05', namaUjian: 'X' }).code, 'INVALID_TES_ONLINE');
  assert.equal(validateSesiTes({ kelasId: 3, jenis: 'kanji', materi: 'VOL1', tanggalUjian: '', namaUjian: 'X' }).code, 'INVALID_TES_ONLINE');
  assert.equal(validateSesiTes({ kelasId: 3, jenis: 'kanji', materi: 'VOL1', jumlahSoal: 0, tanggalUjian: '2026-11-05', namaUjian: 'X' }).code, 'INVALID_TES_ONLINE');
});
