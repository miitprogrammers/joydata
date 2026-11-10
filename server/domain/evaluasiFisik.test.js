import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_EVALUASI_FISIK,
  aturanFisik,
  nilaiItemFisik,
  hitungNilaiFisik,
  ringkasFisik,
  formatDetik,
  validateNilaiFisikInput,
  normalizeEvaluasiFisikSettings,
} from './evaluasiFisik.js';

const settings = { batas_grade: { A: 90, B: 75, C: 60 } };

test('Item score: 60 at Minimal, 100 at Target, straight lines in between and below', () => {
  const p = { minimal: 30, target: 60 };
  assert.equal(nilaiItemFisik(30, p), 60);
  assert.equal(nilaiItemFisik(60, p), 100);
  assert.equal(nilaiItemFisik(75, p), 100);
  assert.equal(nilaiItemFisik(45, p), 80);
  assert.equal(nilaiItemFisik(15, p), 30);
  assert.equal(nilaiItemFisik(0, p), 0);
  assert.equal(nilaiItemFisik(null, p), null);
  assert.equal(nilaiItemFisik('', p), null);
});

test('Nilai Fisik of the agreed example (laki-laki): 20/20/20/40 weights, predikat B, lulus', () => {
  const r = hitungNilaiFisik({ jenisKelamin: 'L', pushUp: 45, plankDetik: 150, sitUp: 55, karungBolakBalik: 13, lintasanM: 10 }, settings);
  assert.deepEqual(
    Object.fromEntries(Object.entries(r.items).map(([k, v]) => [k, v.nilai])),
    { pushUp: 80, plank: 86.7, sitUp: 80, karung: 80 }
  );
  assert.equal(r.items.karung.hasil, 260); // 13 round trips × 2 × 10 m
  assert.equal(r.items.karung.bolakBalik, 13);
  assert.equal(r.nilaiFisik, 81.3);
  assert.equal(r.predikat, 'B');
  assert.equal(r.lulusKkm, true);
  assert.equal(r.bebanKg, 20);
});

test('Perempuan benchmarks, half a round trip, a longer track, and incomplete tests', () => {
  const p = hitungNilaiFisik({ jenisKelamin: 'P', pushUp: 6, plankDetik: 200, sitUp: 45, karungBolakBalik: 12.5, lintasanM: 10 }, settings);
  assert.equal(p.items.pushUp.nilai, 30); // below Minimal 12
  assert.equal(p.items.plank.nilai, 100); // over Target
  assert.equal(p.items.sitUp.nilai, 80); // 30 → 60
  assert.equal(p.items.karung.nilai, 76.7); // 250 m
  assert.equal(p.bebanKg, 10);
  // (30×20 + 100×20 + 80×20 + 76.7×40) / 100
  assert.equal(p.nilaiFisik, 72.7);
  assert.equal(p.predikat, 'C');

  // 10 round trips on a 15 m track = 300 m.
  assert.equal(hitungNilaiFisik({ jenisKelamin: 'L', karungBolakBalik: 10, lintasanM: 15 }, settings).items.karung.nilai, 93.3);

  const kurang = hitungNilaiFisik({ jenisKelamin: 'L', pushUp: 40, plankDetik: 100 }, settings);
  assert.equal(kurang.lengkap, false);
  assert.equal(kurang.nilaiFisik, null);
  assert.equal(kurang.predikat, null);
  assert.equal(kurang.items.pushUp.nilai, 73.3);

  const tanpaJk = hitungNilaiFisik({ pushUp: 40, plankDetik: 100, sitUp: 50, karungBolakBalik: 12 }, settings);
  assert.equal(tanpaJk.nilaiFisik, null);
  assert.equal(tanpaJk.items.pushUp.nilai, null);
});

test('Settings: partial values fall back to the defaults; Pengaturan input is checked', () => {
  const a = aturanFisik({ evaluasi_fisik: { kkm: 70, patokan: { pushUp: { L: { minimal: 25 } } } } });
  assert.equal(a.kkm, 70);
  assert.equal(a.lintasanM, 10);
  assert.deepEqual(a.patokan.pushUp.L, { minimal: 25, target: 60 });
  assert.deepEqual(a.bobot, DEFAULT_EVALUASI_FISIK.bobot);
  assert.deepEqual(aturanFisik({}), aturanFisik({ evaluasi_fisik: DEFAULT_EVALUASI_FISIK }));

  assert.equal(normalizeEvaluasiFisikSettings(DEFAULT_EVALUASI_FISIK).ok, true);
  const bobotSalah = { ...DEFAULT_EVALUASI_FISIK, bobot: { pushUp: 25, plank: 25, sitUp: 25, karung: 40 } };
  assert.equal(normalizeEvaluasiFisikSettings(bobotSalah).ok, false);
  const targetSalah = structuredClone(DEFAULT_EVALUASI_FISIK);
  targetSalah.patokan.plank.P = { minimal: 90, target: 90 };
  assert.equal(normalizeEvaluasiFisikSettings(targetSalah).ok, false);
  assert.equal(normalizeEvaluasiFisikSettings({ ...DEFAULT_EVALUASI_FISIK, lintasanM: 0 }).ok, false);
});

test('Test records from the form: results optional one by one, round trips in steps of 0.5', () => {
  const dasar = { pesertaId: 3, kelasId: 2, tanggal: '2026-11-10', jenisKelamin: 'p' };
  const ok = validateNilaiFisikInput({ ...dasar, pushUp: '20', plankDetik: 95, sitUp: '', karungBolakBalik: 12.5, catatan: ' lutut sakit ' });
  assert.equal(ok.ok, true);
  assert.deepEqual(ok.normalized, {
    pesertaId: 3,
    kelasId: 2,
    tanggal: '2026-11-10',
    jenisKelamin: 'P',
    pushUp: 20,
    plankDetik: 95,
    sitUp: null,
    karungBolakBalik: 12.5,
    catatan: 'lutut sakit',
  });
  assert.equal(validateNilaiFisikInput({ ...dasar, karungBolakBalik: 12.3 }).code, 'INVALID_NILAI_FISIK');
  assert.equal(validateNilaiFisikInput({ ...dasar, pushUp: 3.5 }).code, 'INVALID_NILAI_FISIK');
  assert.equal(validateNilaiFisikInput({ ...dasar, pushUp: 3000 }).code, 'INVALID_NILAI_FISIK');
  assert.equal(validateNilaiFisikInput({ ...dasar, sitUp: 'abc' }).code, 'INVALID_NILAI_FISIK');
  assert.equal(validateNilaiFisikInput({ ...dasar }).code, 'FISIK_KOSONG');
  assert.equal(validateNilaiFisikInput({ ...dasar, jenisKelamin: '', pushUp: 20 }).code, 'FISIK_JENIS_KELAMIN_KOSONG');
  assert.equal(validateNilaiFisikInput({ ...dasar, tanggal: '10-11-2026', pushUp: 20 }).code, 'INVALID_NILAI_FISIK');
  assert.equal(validateNilaiFisikInput({ ...dasar, kelasId: null, pushUp: 20 }).normalized.kelasId, null);
});

test('History of one peserta oldest first, plank shown as m:ss', () => {
  const { daftar, terakhir } = ringkasFisik(
    [
      { id: 2, tanggal: '2026-12-01', jenisKelamin: 'L', pushUp: 50, plankDetik: 160, sitUp: 60, karungBolakBalik: 14, lintasanM: 10 },
      { id: 1, tanggal: '2026-11-03', jenisKelamin: 'L', pushUp: 45, plankDetik: 150, sitUp: 55, karungBolakBalik: 13, lintasanM: 10 },
    ],
    settings
  );
  assert.deepEqual(daftar.map((d) => d.tanggal), ['2026-11-03', '2026-12-01']);
  assert.equal(terakhir.id, 2);
  assert.ok(terakhir.nilaiFisik > daftar[0].nilaiFisik);
  assert.equal(formatDetik(95), '1:35');
  assert.equal(formatDetik(180), '3:00');
  assert.equal(formatDetik(null), '-');
});
