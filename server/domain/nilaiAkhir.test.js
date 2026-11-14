import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_NILAI_AKHIR,
  aturanNilaiAkhir,
  normalizeNilaiAkhirSettings,
  kualitasSesi,
  poinGrade,
  hitungNilaiAkhir,
} from './nilaiAkhir.js';

const batas = { A: 90, B: 75, C: 60 };

test('Kualitas kaiwa: every session counts, each grade at the middle of its band (A 95, B 82.5, C 67.5)', () => {
  assert.deepEqual(poinGrade(batas), { A: 95, B: 82.5, C: 67.5 });
  assert.deepEqual(kualitasSesi(['A', 'A'], batas), { nilai: 95, grade: 'A', jumlah: 2, distribusi: { A: 2, B: 0, C: 0 } });
  assert.deepEqual([kualitasSesi(['A', 'B'], batas).nilai, kualitasSesi(['A', 'B'], batas).grade], [88.8, 'B']);
  assert.deepEqual([kualitasSesi(['B', 'B', 'B'], batas).nilai, kualitasSesi(['B', 'B', 'B'], batas).grade], [82.5, 'B']);
  // Mostly B with some C stays B; mostly C is C.
  assert.deepEqual([kualitasSesi(['B', 'B', 'B', 'B', 'C'], batas).nilai, kualitasSesi(['B', 'B', 'B', 'B', 'C'], batas).grade], [79.5, 'B']);
  assert.deepEqual([kualitasSesi(['B', 'C', 'C'], batas).nilai, kualitasSesi(['B', 'C', 'C'], batas).grade], [72.5, 'C']);
  assert.equal(kualitasSesi(['C'], batas).nilai, 67.5);
  // The last session alone no longer decides.
  assert.equal(kualitasSesi(['A', 'A', 'A', 'A', 'A', 'C'], batas).grade, 'A');
  assert.equal(kualitasSesi(['C', 'C', 'C', 'A'], batas).grade, 'C');
  // The points follow the grade bands in Pengaturan.
  assert.deepEqual(poinGrade({ A: 85, B: 70, C: 55 }), { A: 92.5, B: 77.5, C: 62.5 });
  assert.deepEqual(kualitasSesi([], batas), { nilai: null, grade: null, jumlah: 0, distribusi: { A: 0, B: 0, C: 0 } });
  assert.equal(kualitasSesi(['A', 'X'], batas).jumlah, 1);
});

const semua = {
  ujian: { nilai: 90 },
  kehadiran: { nilai: 80 },
  sikap: { nilai: 75 },
  kaiwa: { nilai: 80 },
  mensetsu: { nilai: 100 },
  kaiwaCard: { nilai: 50 },
  latihan: { nilai: 95 },
  fisik: { nilai: 70 },
};

test('Nilai Akhir: weighted mean of every factor with the default weights', () => {
  const r = hitungNilaiAkhir(semua, DEFAULT_NILAI_AKHIR, batas);
  // (25·90 + 15·80 + 15·75 + 10·80 + 10·100 + 5·50 + 10·95 + 10·70) / 100 = 82.75
  assert.equal(r.nilai, 82.8);
  assert.equal(r.grade, 'B');
  assert.equal(r.dinilai, 8);
  assert.equal(r.rincian.find((x) => x.faktor === 'ujian').bobotEfektif, 25);
  assert.equal(r.rincian.find((x) => x.faktor === 'ujian').kontribusi, 22.5);
});

test('Nilai Akhir: a factor without data is left out and the other weights are shared out again', () => {
  const tanpa = { ...semua, mensetsu: null, fisik: { nilai: null } };
  const r = hitungNilaiAkhir(tanpa, DEFAULT_NILAI_AKHIR, batas);
  // Weights left: 80. (2250 + 1200 + 1125 + 800 + 250 + 950) / 80 = 82.2
  assert.equal(r.nilai, 82.2);
  assert.equal(r.dinilai, 6);
  assert.equal(r.rincian.find((x) => x.faktor === 'ujian').bobotEfektif, 31.3);
  assert.equal(r.rincian.find((x) => x.faktor === 'mensetsu').bobotEfektif, null);
  const total = r.rincian.reduce((n, x) => n + (x.kontribusi || 0), 0);
  assert.ok(Math.abs(total - r.nilai) < 0.3);
});

test('Nilai Akhir: fewer than three factors give no grade; a weight of 0 leaves the factor out', () => {
  const r = hitungNilaiAkhir({ ujian: { nilai: 90 }, sikap: { nilai: 75 } }, DEFAULT_NILAI_AKHIR, batas);
  assert.equal(r.nilai, null);
  assert.equal(r.grade, null);
  assert.equal(r.dinilai, 2);
  const tanpaFisik = { bobot: { ...DEFAULT_NILAI_AKHIR.bobot, fisik: 0, ujian: 35 } };
  assert.equal(hitungNilaiAkhir(semua, tanpaFisik, batas).dinilai, 7);
});

test('Nilai Akhir settings: defaults fill gaps; Pengaturan needs whole weights adding up to 100', () => {
  assert.deepEqual(aturanNilaiAkhir({}), DEFAULT_NILAI_AKHIR);
  assert.equal(aturanNilaiAkhir({ nilai_akhir: { bobot: { ujian: 40 } } }).bobot.ujian, 40);
  assert.equal(normalizeNilaiAkhirSettings(DEFAULT_NILAI_AKHIR).ok, true);
  assert.equal(normalizeNilaiAkhirSettings({ bobot: { ...DEFAULT_NILAI_AKHIR.bobot, ujian: 30 } }).ok, false);
  assert.equal(normalizeNilaiAkhirSettings({ bobot: { ...DEFAULT_NILAI_AKHIR.bobot, ujian: 24.5, sikap: 15.5 } }).ok, false);
  assert.equal(normalizeNilaiAkhirSettings({ bobot: { ...DEFAULT_NILAI_AKHIR.bobot, fisik: undefined } }).ok, false);
});
