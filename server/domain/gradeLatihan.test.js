import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_GRADE_LATIHAN,
  aturanGradeLatihan,
  normalizeGradeLatihanSettings,
  hariDihitung,
  hitungGradeLatihan,
  urutkanRiwayatLatihan,
} from './gradeLatihan.js';

const batas = { A: 90, B: 75, C: 60 };

test('Days: from the latest start date to the end, both included', () => {
  assert.equal(hariDihitung({ dari: '2026-11-14', sampai: '2026-11-14' }), 1);
  assert.equal(hariDihitung({ dari: '2026-11-08', mulaiData: '2026-11-10', sampai: '2026-11-14' }), 5);
  // All time: no period start, from the first practice ever logged.
  assert.equal(hariDihitung({ dari: null, mulaiData: '2026-11-10', sampai: '2026-11-14' }), 5);
  // A peserta who joined during the period only counts from the day they joined.
  assert.equal(hariDihitung({ dari: '2026-11-08', mulaiData: '2026-11-10', tanggalMasuk: '2026-11-13', sampai: '2026-11-14' }), 2);
  assert.equal(hariDihitung({ dari: '2026-10-16', mulaiData: '2026-09-01', tanggalMasuk: '2026-07-07', sampai: '2026-11-14' }), 30);
  // Across a month end.
  assert.equal(hariDihitung({ dari: '2026-10-30', sampai: '2026-11-02' }), 4);
});

test('Days: none when the peserta started after the period or nothing gives a start', () => {
  assert.equal(hariDihitung({ dari: '2026-11-12', tanggalMasuk: '2026-11-13', sampai: '2026-11-12' }), 0);
  assert.equal(hariDihitung({ dari: null, mulaiData: null, sampai: '2026-11-14' }), 0);
});

test('Grade: half time against the daily target, half the average practice score', () => {
  // 5 days, 200 minutes = 40 min/day of 60 → 66.7; score 90 → (66.7 + 90) / 2 = 78.3 → B.
  const g = hitungGradeLatihan({ detikAktif: 200 * 60, rataSkor: 90 }, 5, DEFAULT_GRADE_LATIHAN, batas);
  assert.deepEqual(g, { hari: 5, menitPerHari: 40, skorWaktu: 66.7, skorNilai: 90, nilai: 78.3, grade: 'B' });
});

test('Grade: time above the target counts as 100, not more', () => {
  const g = hitungGradeLatihan({ detikAktif: 180 * 60, rataSkor: 84 }, 1, DEFAULT_GRADE_LATIHAN, batas);
  assert.equal(g.skorWaktu, 100);
  assert.equal(g.nilai, 92);
  assert.equal(g.grade, 'A');
});

test('Grade: without a scored practice paper (flashcard only) it is the time score alone', () => {
  const g = hitungGradeLatihan({ detikAktif: 45 * 60, rataSkor: null }, 1, DEFAULT_GRADE_LATIHAN, batas);
  assert.equal(g.skorNilai, null);
  assert.equal(g.nilai, 75);
  assert.equal(g.grade, 'B');
});

test('Grade: no practice at all is 0 and D; no day to count is no grade', () => {
  assert.equal(hitungGradeLatihan({ detikAktif: 0, rataSkor: null }, 7, DEFAULT_GRADE_LATIHAN, batas).grade, 'D');
  assert.equal(hitungGradeLatihan({ detikAktif: 0, rataSkor: null }, 7, DEFAULT_GRADE_LATIHAN, batas).nilai, 0);
  const none = hitungGradeLatihan({ detikAktif: 600, rataSkor: 90 }, 0, DEFAULT_GRADE_LATIHAN, batas);
  assert.equal(none.grade, null);
  assert.equal(none.nilai, null);
});

test('Grade: weight and target come from the settings, bands from batas_grade', () => {
  const aturan = { targetMenitHarian: 30, bobotWaktu: 30 };
  // 15 min/day of 30 → 50; 0.3 × 50 + 0.7 × 80 = 71 → C with the default bands, B with B ≥ 70.
  assert.equal(hitungGradeLatihan({ detikAktif: 15 * 60, rataSkor: 80 }, 1, aturan, batas).nilai, 71);
  assert.equal(hitungGradeLatihan({ detikAktif: 15 * 60, rataSkor: 80 }, 1, aturan, batas).grade, 'C');
  assert.equal(hitungGradeLatihan({ detikAktif: 15 * 60, rataSkor: 80 }, 1, aturan, { A: 85, B: 70, C: 50 }).grade, 'B');
});

test('Settings: defaults fill gaps; Pengaturan accepts whole numbers in range only', () => {
  assert.deepEqual(aturanGradeLatihan({}), DEFAULT_GRADE_LATIHAN);
  assert.deepEqual(aturanGradeLatihan({ grade_latihan: { targetMenitHarian: 0, bobotWaktu: 70 } }), { targetMenitHarian: 60, bobotWaktu: 70 });
  assert.deepEqual(normalizeGradeLatihanSettings({ targetMenitHarian: '45', bobotWaktu: 40 }), {
    ok: true,
    normalized: { targetMenitHarian: 45, bobotWaktu: 40 },
  });
  assert.equal(normalizeGradeLatihanSettings({ targetMenitHarian: 0, bobotWaktu: 50 }).ok, false);
  assert.equal(normalizeGradeLatihanSettings({ targetMenitHarian: 60, bobotWaktu: 101 }).ok, false);
  assert.equal(normalizeGradeLatihanSettings({ targetMenitHarian: 60.5, bobotWaktu: 50 }).ok, false);
  assert.equal(normalizeGradeLatihanSettings({ targetMenitHarian: 601, bobotWaktu: 50 }).ok, false);
});

// Server order = ranking by active time.
const baris = [
  { pesertaId: 1, peringkat: 1, detikAktif: 9000, grade: { nilai: 88, grade: 'B' } },
  { pesertaId: 2, peringkat: 2, detikAktif: 6000, grade: { nilai: 95, grade: 'A' } },
  { pesertaId: 3, peringkat: 3, detikAktif: 3000, grade: { nilai: 95, grade: 'A' } },
  { pesertaId: 4, peringkat: 4, detikAktif: 1200, grade: { nilai: 61, grade: 'C' } },
  { pesertaId: 5, peringkat: 5, detikAktif: 0, grade: { nilai: 0, grade: 'D' } },
  { pesertaId: 6, peringkat: 6, detikAktif: 0, grade: { nilai: null, grade: null } },
];
const ids = (rows) => rows.map((r) => r.pesertaId);
const ranks = (rows) => rows.map((r) => r.peringkatTampil);

test('Order by active time: the server order, reversed for lowest first, rank stays the time rank', () => {
  assert.deepEqual(ids(urutkanRiwayatLatihan(baris)), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(ranks(urutkanRiwayatLatihan(baris)), [1, 2, 3, 4, '-', '-']);
  const naik = urutkanRiwayatLatihan(baris, { kolom: 'waktu', arah: 'naik' });
  assert.deepEqual(ids(naik), [6, 5, 4, 3, 2, 1]);
  assert.deepEqual(ranks(naik), ['-', '-', 4, 3, 2, 1]);
});

test('Order by grade: highest Nilai first, equal Nilai share a rank and the more active goes first', () => {
  const turun = urutkanRiwayatLatihan(baris, { kolom: 'grade', arah: 'turun' });
  assert.deepEqual(ids(turun), [2, 3, 1, 4, 5, 6]);
  assert.deepEqual(ranks(turun), [1, 1, 3, 4, '-', '-']);
});

test('Order by grade, lowest first: reversed with the same ranks, a row without a grade stays last', () => {
  const naik = urutkanRiwayatLatihan(baris, { kolom: 'grade', arah: 'naik' });
  assert.deepEqual(ids(naik), [5, 4, 1, 3, 2, 6]);
  assert.deepEqual(ranks(naik), ['-', 4, 3, 1, 1, '-']);
  // The rows themselves are not changed.
  assert.equal(baris[0].peringkatTampil, undefined);
});
