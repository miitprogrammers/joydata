import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPesertaJourney,
  buildKelasSummary,
  buildPesertaAiFacts,
  buildKelasAiFacts,
  restoreAliases,
  makeNameScrubber,
  hashFacts,
  catatanUntukPeserta,
  urutkanPeringkat,
} from './smartReport.js';

const settings = {
  kkm_ujian: 75,
  kkm_sikap: 75,
  sikap_basis: 75,
  batas_grade: { A: 90, B: 75, C: 60 },
  ambang_kehadiran_rendah: 75,
};

const ujianRows = [
  { id: 1, pesertaId: 1, tanggalUjian: '2026-07-17', codeUjian: 'M001', pola: 'variable', nilaiMojiGoi: 80, nilaiBunpou: 90, nilaiDokkai: null, nilaiChoukai: 70, catatan: 'Budi salah partikel に' },
  { id: 2, pesertaId: 1, tanggalUjian: '2026-07-24', codeUjian: 'M002', pola: 'tunggal', nilaiTunggal: 73, catatan: '' },
  { id: 3, pesertaId: 1, tanggalUjian: '2026-08-07', codeUjian: 'M003', pola: 'tunggal', nilaiTunggal: 92, catatan: '' },
  { id: 4, pesertaId: 2, tanggalUjian: '2026-07-17', codeUjian: 'M001', pola: 'tunggal', nilaiTunggal: 60, catatan: '' },
];

// Class 3 met on 4 days in July and 1 in August; peserta 1 missed one July day without a record.
const absensiRows = [
  { pesertaId: 1, kelasId: 3, tanggalAbsensi: '2026-07-17', status: 'hadir' },
  { pesertaId: 1, kelasId: 3, tanggalAbsensi: '2026-07-20', status: 'sakit' },
  { pesertaId: 1, kelasId: 3, tanggalAbsensi: '2026-07-24', status: 'hadir' },
  { pesertaId: 2, kelasId: 3, tanggalAbsensi: '2026-07-27', status: 'hadir' },
  { pesertaId: 1, kelasId: 3, tanggalAbsensi: '2026-08-07', status: 'hadir' },
  { pesertaId: 9, kelasId: 4, tanggalAbsensi: '2026-07-21', status: 'hadir' },
];

const sikapRows = [
  { id: 1, pesertaId: 1, tanggalPenilaian: '2026-08-03', sentiment: 'negatif', bobot: 10, kategoriNamaId: 'Terlambat', description: 'Budi terlambat 30 menit' },
];

test('Smart Report: journey of one peserta covers every period with configured KKM and grades', () => {
  const j = buildPesertaJourney({ pesertaId: 1, kelasId: 3, ujianRows, kaiwaRows: [], sikapRows, absensiRows, settings });

  assert.deepEqual(j.rentang, { mulai: '2026-07-17', sampai: '2026-08-07' });
  assert.deepEqual(j.ujian.daftar.map((u) => [u.kode, u.rata, u.grade, u.lulusKkm]), [
    ['M001', 80, 'B', true],
    ['M002', 73, 'C', false],
    ['M003', 92, 'A', true],
  ]);
  assert.equal(j.kpi.rataUjian, 81.7);
  assert.equal(j.kpi.jumlahLulusUjian, 2);
  assert.deepEqual(j.ujian.bagian, { mojiGoi: 80, bunpou: 90, dokkai: null, choukai: 70 });
  assert.deepEqual(j.ujian.tren, { jumlahPembanding: 1, awal: 80, akhir: 92, selisih: 12 });

  // July: 4 class sessions (other classes ignored), 2 present. August: 1 of 1.
  assert.deepEqual(j.bulanan.map((b) => [b.periode, b.absensi.sesi, b.absensi.hadir]), [
    ['2026-07', 4, 2],
    ['2026-08', 1, 1],
  ]);
  assert.equal(j.kpi.rasioKehadiran, 60);
  assert.equal(j.kpi.kehadiranRendah, true);

  // Sikap restarts at the basis each month: July 75, August 65 → mean 70, below KKM 75.
  assert.deepEqual(j.bulanan.map((b) => b.sikap.skor), [75, 65]);
  assert.equal(j.kpi.skorSikap, 70);
  assert.equal(j.kpi.lulusKkmSikap, false);
});

test('Smart Report: a peserta without records has an empty journey', () => {
  const j = buildPesertaJourney({ pesertaId: 7, kelasId: 3, ujianRows, absensiRows, settings });
  assert.equal(j.rentang, null);
  assert.deepEqual(j.bulanan, []);
  assert.equal(j.kpi.rataUjian, null);
  assert.equal(j.kpi.lulusKkmUjian, null);
  assert.equal(j.kpi.rasioKehadiran, null);
});

test('Smart Report: class ranking shares ranks on equal averages and lists who needs attention', () => {
  const journey = (rata, rasio) => ({
    rentang: { mulai: '2026-07-01', sampai: '2026-07-31' },
    kpi: {
      rataUjian: rata,
      gradeUjian: rata === null ? '-' : rata >= 90 ? 'A' : rata >= 75 ? 'B' : 'C',
      lulusKkmUjian: rata === null ? null : rata >= 75,
      jumlahUjian: rata === null ? 0 : 1,
      jumlahLulusUjian: 0,
      kaiwaTerakhir: null,
      skorSikap: 75,
      lulusKkmSikap: true,
      rasioKehadiran: rasio,
      kehadiranRendah: rasio < 75,
    },
    ujian: { daftar: [], bagian: {} },
  });
  const summary = buildKelasSummary(
    [
      { pesertaId: 1, nama: 'Ani', journey: journey(80, 90) },
      { pesertaId: 2, nama: 'Budi', journey: journey(80, 95) },
      { pesertaId: 3, nama: 'Citra', journey: journey(91, 100) },
      { pesertaId: 4, nama: 'Dedi', journey: journey(70, 50) },
      { pesertaId: 5, nama: 'Eka', journey: journey(null, 100) },
    ],
    settings
  );

  assert.deepEqual(summary.ranking.map((r) => [r.nama, r.peringkat]), [
    ['Citra', 1],
    ['Budi', 2],
    ['Ani', 2],
    ['Dedi', 4],
    ['Eka', null],
  ]);
  assert.equal(summary.statistik.rataKelas, 80.3);
  assert.equal(summary.statistik.median, 80);
  assert.equal(summary.statistik.jumlahLulusKkm, 3);
  assert.deepEqual(summary.distribusiGrade, { A: 1, B: 2, C: 1, D: 0 });
  assert.deepEqual(summary.perluPerhatian.map((p) => [p.nama, p.alasan]), [['Dedi', ['ujian', 'kehadiran']]]);
});

test('Class ranking helper: rows without a score are left out, ties share a rank', () => {
  const ranked = urutkanPeringkat(
    [
      { pesertaId: 1, nama: 'Ani', rata: 85, rasioKehadiran: 90 },
      { pesertaId: 2, nama: 'Budi', rata: null, rasioKehadiran: 100 },
      { pesertaId: 3, nama: 'Citra', rata: 85, rasioKehadiran: 100 },
      { pesertaId: 4, nama: 'Dedi', rata: 92, rasioKehadiran: 60 },
    ],
    (r) => r.rata
  );
  assert.deepEqual(ranked.map((r) => [r.nama, r.peringkat]), [
    ['Dedi', 1],
    ['Citra', 2],
    ['Ani', 2],
  ]);
});

test('Smart Report: facts sent to Gemini carry no names, and class aliases map back to names', () => {
  const j = buildPesertaJourney({ pesertaId: 1, kelasId: 3, ujianRows, sikapRows, absensiRows, settings });
  const facts = buildPesertaAiFacts(j, { nama: 'Budi Santoso', programNama: 'Tokutei Ginou', settings });
  const text = JSON.stringify(facts);
  assert.equal(/budi|santoso/i.test(text), false);
  assert.match(facts.ujian.daftar[0].catatan, /^peserta salah partikel/);
  assert.equal(hashFacts(facts, 1), hashFacts(JSON.parse(text), 1));
  assert.notEqual(hashFacts(facts, 1), hashFacts(facts, 2));

  assert.equal(makeNameScrubber('Muhammad Al Fatih')('Fatih dan Alfatih'), 'peserta dan Alfatih');

  const summary = buildKelasSummary(
    [{ pesertaId: 1, nama: 'Budi Santoso', journey: j }],
    settings
  );
  const { facts: kelasFacts, aliases } = buildKelasAiFacts(summary, { programNama: null, settings });
  assert.equal(/budi/i.test(JSON.stringify(kelasFacts)), false);
  assert.equal(kelasFacts.peringkat[0].peserta, 'P01');
  assert.equal(restoreAliases('P01 unggul; P01さんは良好。P99 tidak ada.', aliases), 'Budi Santoso unggul; Budi Santosoさんは良好。P99 tidak ada.');
});

test('catatanUntukPeserta removes staff working notes but keeps the learning content', () => {
  const m001 =
    'Fokus latihan: jam: pukul 9 = くじ (bukan きゅうじ). Rincian: A 20 · F 18 (dikoreksi saat input: F2 GO benar (keputusan 28-10: romaji dihitung benar; pemeriksa 0); nilai pemeriksa 89; pemeriksa メリ; tanggal di kertas 29-08-2026).';
  assert.equal(catatanUntukPeserta(m001), 'Fokus latihan: jam: pukul 9 = くじ (bukan きゅうじ). Rincian: A 20 · F 18.');
  const n5 =
    'Rincian: Moji-Goi 22/35 (soal 20 rusak, dihitung benar) · Bunpou-Dokkai 19/32 (bunpou 18/26, dokkai 1/6) · Choukai 14/24 (dikoreksi saat input: no. 4 dijawab ④; pemeriksa 15). Perkiraan skala JLPT ±108/180.';
  assert.equal(
    catatanUntukPeserta(n5),
    'Rincian: Moji-Goi 22/35 (soal 20 rusak, dihitung benar) · Bunpou-Dokkai 19/32 (bunpou 18/26, dokkai 1/6) · Choukai 14/24. Perkiraan skala JLPT ±108/180.'
  );
  assert.equal(
    catatanUntukPeserta('Kuat: baca kanji. Catatan pemeriksaan: hanya halaman 1, 3, 5 yang diunggah. Rincian: A 10 (sama dengan nilai pemeriksa 97).'),
    'Kuat: baca kanji. Rincian: A 10.'
  );
  assert.equal(catatanUntukPeserta(''), '');
});

test('catatanUntukPeserta keeps the useful part of a mixed bracket and drops checker remarks outside brackets', () => {
  assert.equal(
    catatanUntukPeserta('Rincian: A 20 · G 10 (tata bahasa 62/70, kanji 30/30; C6 いちばん ditulis di luar kurung, dikoreksi benar saat input). Ujian Bunpou & Kanji.'),
    'Rincian: A 20 · G 10 (tata bahasa 62/70, kanji 30/30). Ujian Bunpou & Kanji.'
  );
  assert.equal(
    catatanUntukPeserta('Choukai: 4 5/6. Moji-Goi no. 7 dua jawaban dihitamkan (② dan ④) = 0, pemeriksa membenarkan; Choukai no. 7 kosong. Lembar difoto pudar, dibaca dengan peningkatan kontras. Kuat: hobi fotografi.'),
    'Choukai: 4 5/6. Choukai no. 7 kosong. Kuat: hobi fotografi.'
  );
});
