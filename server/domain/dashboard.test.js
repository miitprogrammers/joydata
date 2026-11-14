import test from 'node:test';
import assert from 'node:assert/strict';
import { bulanSebelumnya, daftarBulan, ringkasAktivitasHarian, ringkasUjian, buildDashboard } from './dashboard.js';
import { buildPesertaJourney } from './smartReport.js';

const settings = {
  kkm_ujian: 75,
  kkm_sikap: 75,
  sikap_basis: 75,
  ambang_kehadiran_rendah: 75,
  batas_grade: { A: 90, B: 75, C: 60 },
  kaiwa_target_mingguan: 3,
  kaiwa_sensei_wajib_id: 9,
  kaiwa_berlaku_mulai: '2026-10-26',
};

test('Months: the month before, and the last n months oldest first across a year end', () => {
  assert.equal(bulanSebelumnya('2026-11'), '2026-10');
  assert.equal(bulanSebelumnya('2026-01'), '2025-12');
  assert.deepEqual(daftarBulan('2026-02', 4), ['2025-11', '2025-12', '2026-01', '2026-02']);
});

test('Practice per day: active seconds per type, peserta per day, today and who is practising now', () => {
  const now = new Date('2026-11-14T05:00:00Z'); // 12:00 WIB
  const sesi = [
    { pesertaId: 1, jenis: 'flashcard', detikAktif: 1800, mulaiAt: '2026-11-14T03:00:00Z', terakhirAt: '2026-11-14T03:30:00Z', selesaiAt: '2026-11-14T03:30:00Z' },
    { pesertaId: 1, jenis: 'dokkai', detikAktif: 300, mulaiAt: '2026-11-14T04:50:00Z', terakhirAt: '2026-11-14T04:59:50Z', selesaiAt: null },
    { pesertaId: 2, jenis: 'kanji', detikAktif: 600, mulaiAt: '2026-11-13T10:00:00Z', terakhirAt: '2026-11-13T10:10:00Z', selesaiAt: null },
    // 23:30 WIB on the 12th: counts on the 12th, not the 13th.
    { pesertaId: 2, jenis: 'kanji', detikAktif: 120, mulaiAt: '2026-11-12T16:30:00Z', terakhirAt: '2026-11-12T16:32:00Z', selesaiAt: null },
    { pesertaId: 3, jenis: 'kanji', detikAktif: 0, mulaiAt: '2026-11-14T02:00:00Z', terakhirAt: '2026-11-14T02:00:00Z', selesaiAt: null },
  ];
  const r = ringkasAktivitasHarian(sesi, { hari: 3, now });
  assert.deepEqual(r.harian.map((d) => d.tanggal), ['2026-11-12', '2026-11-13', '2026-11-14']);
  assert.deepEqual(r.harian[2].detik, { flashcard: 1800, kanji: 0, dokkai: 300 });
  assert.equal(r.harian[2].peserta, 1);
  assert.equal(r.harian[0].total, 120);
  assert.deepEqual(r.hariIni, { peserta: 1, detikAktif: 2100 });
  assert.equal(r.sedangLatihan, 1);
});

const ujianRows = [
  { pesertaId: 1, kelasId: 10, tanggalUjian: '2026-10-20', codeUjian: 'KJ-0', pola: 'tunggal', nilaiTunggal: 80 },
  { pesertaId: 2, kelasId: 10, tanggalUjian: '2026-10-20', codeUjian: 'KJ-0', pola: 'tunggal', nilaiTunggal: 70 },
  { pesertaId: 1, kelasId: 10, tanggalUjian: '2026-11-13', codeUjian: 'KJ-1', pola: 'tunggal', nilaiTunggal: 95 },
  // Peserta 1 sits two papers in November: they still count once, with their average.
  { pesertaId: 1, kelasId: 10, tanggalUjian: '2026-11-13', codeUjian: 'UJ-1', pola: 'variable', nilaiMojiGoi: 90, nilaiBunpou: 80, nilaiChoukai: 70 },
  { pesertaId: 2, kelasId: 10, tanggalUjian: '2026-11-13', codeUjian: 'KJ-1', pola: 'tunggal', nilaiTunggal: 60 },
];

test('Exams: everyone weighs the same in a month; delta to last month; one row per paper, newest first', () => {
  const r = ringkasUjian(ujianRows, { periode: '2026-11', settings, namaKelas: new Map([[10, 'Joy A']]) });
  // Peserta 1: (95 + 80) / 2 = 87.5; peserta 2: 60 → 73.8. October: 75.
  assert.equal(r.bulanIni.rata, 73.8);
  assert.equal(r.bulanIni.delta, -1.2);
  assert.equal(r.bulanIni.peserta, 2);
  assert.equal(r.bulanIni.lulusKkm, 1);
  assert.equal(r.bulanIni.jumlahUjian, 2);
  assert.deepEqual(r.bulanIni.distribusi, { A: 0, B: 1, C: 1, D: 0 });
  assert.deepEqual(r.bulanIni.bagian, { mojiGoi: 90, bunpou: 80, choukai: 70 });
  assert.deepEqual(r.tren.map((t) => t.bulan), ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11']);
  assert.equal(r.tren[4].rata, 75);
  assert.equal(r.tren[0].rata, null);
  assert.deepEqual(r.terbaru.map((u) => u.kode), ['KJ-1', 'UJ-1', 'KJ-0']);
  assert.deepEqual(r.terbaru[0], {
    kode: 'KJ-1',
    tanggal: '2026-11-13',
    kelas: ['Joy A'],
    peserta: 2,
    rata: 77.5,
    persenLulus: 50,
    bagian: { mojiGoi: null, bunpou: null, choukai: null },
  });
});

// Saturday 14 Nov 2026: this week = 9–15 Nov, last week = 2–8 Nov.
function fixture() {
  const state = {
    kelas: [
      { id: 10, namaKelas: 'Joy A', status: 'aktif', senseiId: 9, programId: 1, tanggalStart: '2026-06-01' },
      { id: 11, namaKelas: 'Joy B', status: 'aktif', senseiId: 9, programId: 1, tanggalStart: '2026-11-01' },
      { id: 12, namaKelas: 'Joy Lama', status: 'selesai', senseiId: 9, programId: 1, tanggalStart: '2026-01-01' },
    ],
    peserta: [
      { id: 1, mancationAkunId: 101, kelasId: 10, sumber: 'roster', tanggalMasuk: '2026-07-01' },
      { id: 2, mancationAkunId: 102, kelasId: 10, sumber: 'roster', tanggalMasuk: null },
      { id: 3, mancationAkunId: 103, kelasId: 10, sumber: 'manual', tanggalMasuk: null },
      { id: 4, mancationAkunId: 104, kelasId: 12, sumber: 'roster', tanggalMasuk: null },
    ],
    staff: [{ id: 9, nama: 'Sensei Wajib' }],
    programs: [{ id: 1, namaId: 'Persiapan N5', namaJa: 'N5' }],
    sikapKategori: [{ id: 1, namaId: 'Kesopanan', namaJa: '礼儀' }],
    nilaiUjian: ujianRows,
    nilaiKaiwa: [
      ...['2026-11-03', '2026-11-04', '2026-11-05'].map((t, i) => ({ id: i + 1, pesertaId: 1, tanggalKaiwa: t, grade: 'A', senseiId: i === 0 ? 9 : 8 })),
      ...['2026-11-10', '2026-11-11', '2026-11-12'].map((t, i) => ({ id: i + 4, pesertaId: 1, tanggalKaiwa: t, grade: 'A', senseiId: i === 0 ? 9 : 8 })),
      { id: 7, pesertaId: 2, tanggalKaiwa: '2026-11-03', grade: 'B', senseiId: 8 },
      { id: 8, pesertaId: 2, tanggalKaiwa: '2026-11-13', grade: 'B', senseiId: 9 },
    ],
    nilaiMensetsu: [{ id: 1, pesertaId: 1, tanggalMensetsu: '2026-11-06', grade: 'B' }],
    nilaiSikap: [
      { id: 1, pesertaId: 1, kategoriId: 1, tanggalPenilaian: '2026-11-04', sentiment: 'positif', bobot: 5, description: 'Membantu teman' },
      { id: 2, pesertaId: 2, kategoriId: 1, tanggalPenilaian: '2026-11-05', sentiment: 'negatif', bobot: 15, description: 'Terlambat' },
    ],
    absensi: [
      ...['2026-11-12', '2026-11-13', '2026-11-14'].map((t, i) => ({ id: i + 1, pesertaId: 1, kelasId: 10, tanggalAbsensi: t, status: 'hadir' })),
      { id: 4, pesertaId: 2, kelasId: 10, tanggalAbsensi: '2026-11-12', status: 'hadir' },
      { id: 5, pesertaId: 2, kelasId: 10, tanggalAbsensi: '2026-11-13', status: 'alfa' },
      { id: 6, pesertaId: 2, kelasId: 10, tanggalAbsensi: '2026-11-14', status: 'sakit' },
    ],
    nilaiFisik: [
      { id: 1, pesertaId: 2, kelasId: 10, tanggal: '2026-11-11', jenisKelamin: 'L', pushUp: 5, plankDetik: 30, sitUp: 5, karungBolakBalik: 2, lintasanM: 10 },
    ],
  };
  const sikapRows = state.nilaiSikap.map((s) => ({ ...s, kategoriNamaId: 'Kesopanan', kategoriNamaJa: '礼儀' }));
  const journeys = new Map(
    [1, 2].map((id) => [
      id,
      buildPesertaJourney({
        pesertaId: id,
        kelasId: 10,
        ujianRows: state.nilaiUjian,
        kaiwaRows: state.nilaiKaiwa,
        mensetsuRows: state.nilaiMensetsu,
        sikapRows,
        absensiRows: state.absensi,
        fisikRows: state.nilaiFisik,
        settings,
      }),
    ])
  );
  const latihan = {
    statistik: [
      { pesertaId: 1, detikAktif: 25200, grade: { hari: 5, menitPerHari: 84, skorWaktu: 100, skorNilai: 90, nilai: 95, grade: 'A' } },
      { pesertaId: 2, detikAktif: 600, grade: { hari: 5, menitPerHari: 2, skorWaktu: 3.3, skorNilai: null, nilai: 3.3, grade: 'D' } },
    ],
    aturanGrade: { targetMenitHarian: 60, bobotWaktu: 50 },
    sesi: [],
    terakhir: { 1: '2026-11-13T10:00:00Z', 2: '2026-11-10T10:00:00Z' },
  };
  return {
    state,
    journeys,
    settings,
    nameMap: new Map([[101, 'Ani'], [102, 'Budi'], [103, 'Luar'], [104, 'Lulus']]),
    hariIni: '2026-11-14',
    latihan,
    now: new Date('2026-11-14T05:00:00Z'),
  };
}

test('Dashboard: only roster peserta of active classes; a class nobody sits in is left out', () => {
  const d = buildDashboard(fixture());
  assert.equal(d.pesertaAktif, 2);
  assert.deepEqual(d.perKelas.map((k) => k.namaKelas), ['Joy A']);
  assert.deepEqual(d.hari.absensi.kelas, [{ kelasId: 10, namaKelas: 'Joy A', terisi: true }]);
  assert.equal(d.perKelas[0].senseiNama, 'Sensei Wajib');
  assert.equal(d.perKelas[0].peserta, 2);
});

test('Dashboard today: absensi per status with who is not present, Kaiwa Card of the running week', () => {
  const d = buildDashboard(fixture());
  assert.deepEqual(d.hari.absensi.status, { hadir: 1, sakit: 1, izin: 0, alfa: 0 });
  assert.deepEqual(d.hari.absensi.tidakHadir, [{ pesertaId: 2, nama: 'Budi', namaKelas: 'Joy A', status: 'sakit' }]);
  assert.equal(d.hari.kaiwa.sisaHari, 1);
  assert.equal(d.hari.kaiwa.target, 3);
  assert.equal(d.hari.kaiwa.senseiWajib, 'Sensei Wajib');
  assert.equal(d.hari.kaiwa.dinilai, 2);
  assert.equal(d.hari.kaiwa.tercapai, 1);
  assert.equal(d.hari.kaiwa.sudahMulai, 2);
  assert.equal(d.hari.kaiwa.sesi, 4);
});

test('Dashboard month: attendance pooled, sikap mean, Kaiwa Card of finished weeks only, practice and fisik', () => {
  const d = buildDashboard(fixture());
  // 3 of 3 + 1 of 3 present.
  assert.deepEqual(d.bulan.kehadiran, { rasio: 66.7, sesi: 6, hadir: 4, delta: null });
  assert.equal(d.bulan.sikap.rata, 70);
  assert.equal(d.bulan.sikap.bawahKkm, 1);
  assert.equal(d.bulan.sikap.delta, -5);
  // Weeks whose Monday is in November and that have ended: 2–8 Nov only; peserta 1 reached it, peserta 2 did not.
  assert.equal(d.bulan.kaiwaCard.minggu, 2);
  assert.equal(d.bulan.kaiwaCard.tercapai, 1);
  assert.equal(d.bulan.kaiwaCard.persen, 50);
  assert.deepEqual(d.bulan.mensetsu, { sesi: 1, peserta: 1, distribusi: { A: 0, B: 1, C: 0 } });
  assert.equal(d.bulan.latihan.menitPerHari, 43);
  assert.deepEqual(d.bulan.latihan.grade, { A: 1, B: 0, C: 0, D: 1 });
  assert.equal(d.bulan.fisik.dites, 1);
  assert.equal(d.bulan.fisik.bawahKkm, 1);
});

test('Dashboard attention: every reason of a peserta at once, most reasons first', () => {
  const d = buildDashboard(fixture());
  assert.equal(d.perhatian.length, 1);
  const budi = d.perhatian[0];
  assert.equal(budi.nama, 'Budi');
  assert.deepEqual(
    budi.alasan.map((a) => a.jenis),
    ['ujian', 'kehadiran', 'sikap', 'kaiwa', 'latihan', 'fisik']
  );
  assert.deepEqual(budi.alasan.find((a) => a.jenis === 'kaiwa'), { jenis: 'kaiwa', jumlah: 1, target: 3, wajibTerpenuhi: false });
  assert.deepEqual(budi.alasan.find((a) => a.jenis === 'latihan'), { jenis: 'latihan', terakhir: '2026-11-10', hari: 4 });
});

test('Dashboard attention: without practice data there is no practice reason; never practised is a reason', () => {
  const tanpa = buildDashboard({ ...fixture(), latihan: null });
  assert.ok(!tanpa.perhatian[0].alasan.some((a) => a.jenis === 'latihan'));
  const f = fixture();
  f.latihan.terakhir = { 2: '2026-11-13T10:00:00Z' };
  const ani = buildDashboard(f).perhatian.find((p) => p.nama === 'Ani');
  assert.deepEqual(ani.alasan, [{ jenis: 'latihan', terakhir: null, hari: null }]);
});

test('Dashboard: latest sikap notes of active peserta, newest first, with the note', () => {
  const d = buildDashboard(fixture());
  assert.deepEqual(d.sikapTerbaru.map((s) => [s.nama, s.sentiment, s.keterangan]), [
    ['Budi', 'negatif', 'Terlambat'],
    ['Ani', 'positif', 'Membantu teman'],
  ]);
});

test('Dashboard practice chart: starts at the first practice ever logged, not before', () => {
  const f = fixture();
  assert.equal(buildDashboard(f).latihanHarian.length, 14);
  f.latihan.aturanGrade = { ...f.latihan.aturanGrade, mulaiData: '2026-11-13' };
  assert.deepEqual(buildDashboard(f).latihanHarian.map((h) => h.tanggal), ['2026-11-13', '2026-11-14']);
});
