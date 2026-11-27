import test from 'node:test';
import assert from 'node:assert/strict';
import { daftarKodeUjian, susunHasilUjian } from './hasilUjian.js';

const baris = (o) => ({
  pesertaId: 1,
  pesertaNama: 'Ani',
  kelasId: 3,
  kelasNama: 'Joy 1',
  tanggalUjian: '2026-09-29',
  pola: 'variable',
  nilaiTunggal: null,
  nilaiMojiGoi: null,
  nilaiBunpou: null,
  nilaiChoukai: null,
  ...o,
});

test('Sorted from the highest average down, ties by name, peserta without a score last', () => {
  const hasil = susunHasilUjian({
    kkm: 70,
    rows: [
      baris({ pesertaId: 1, pesertaNama: 'Citra', nilaiMojiGoi: 80, nilaiBunpou: 70, nilaiChoukai: 90 }),
      baris({ pesertaId: 2, pesertaNama: 'Budi', pola: 'tunggal', nilaiTunggal: 95 }),
      baris({ pesertaId: 3, pesertaNama: 'Ani', nilaiMojiGoi: 80, nilaiBunpou: 80 }),
      baris({ pesertaId: 4, pesertaNama: 'Dedi' }),
    ],
  });
  assert.deepEqual(
    hasil.peserta.map((p) => [p.nama, p.nilaiRata]),
    [['Budi', 95], ['Ani', 80], ['Citra', 80], ['Dedi', null]]
  );
});

test('Average = mean of the filled sections; Lulus at or above the KKM', () => {
  const hasil = susunHasilUjian({
    kkm: 70,
    rows: [
      baris({ pesertaId: 1, nilaiMojiGoi: 60, nilaiBunpou: 75, nilaiChoukai: 90 }),
      baris({ pesertaId: 2, pesertaNama: 'Budi', nilaiMojiGoi: 70 }),
      baris({ pesertaId: 3, pesertaNama: 'Citra', nilaiMojiGoi: 69.5 }),
    ],
  });
  const ani = hasil.peserta.find((p) => p.nama === 'Ani');
  assert.equal(ani.nilaiRata, 75);
  assert.equal(ani.lulus, true);
  assert.equal(hasil.peserta.find((p) => p.nama === 'Budi').lulus, true);
  assert.equal(hasil.peserta.find((p) => p.nama === 'Citra').lulus, false);
  assert.equal(hasil.ringkasan.lulus, 2);
  assert.equal(hasil.ringkasan.tidakLulus, 1);
});

test('A single-score exam has empty section cells and its score as the average', () => {
  const hasil = susunHasilUjian({ rows: [baris({ pola: 'tunggal', nilaiTunggal: 88, nilaiMojiGoi: 10 })] });
  const [p] = hasil.peserta;
  assert.equal(p.nilaiMojiGoi, null);
  assert.equal(p.nilaiBunpou, null);
  assert.equal(p.nilaiChoukai, null);
  assert.equal(p.nilaiRata, 88);
});

test('Uses the stored average (database view) when the row carries one', () => {
  const hasil = susunHasilUjian({ rows: [baris({ nilaiMojiGoi: 50, nilaiAvg: 91.18 })] });
  assert.equal(hasil.peserta[0].nilaiRata, 91.18);
});

test('Several rows of one peserta in one class: the highest score is kept', () => {
  const hasil = susunHasilUjian({
    rows: [
      baris({ tanggalUjian: '2026-08-12', pola: 'tunggal', nilaiTunggal: 47 }),
      baris({ tanggalUjian: '2026-07-24', pola: 'tunggal', nilaiTunggal: 85 }),
    ],
  });
  assert.equal(hasil.peserta.length, 1);
  assert.equal(hasil.peserta[0].nilaiRata, 85);
  assert.equal(hasil.peserta[0].tanggalUjian, '2026-07-24');
  assert.equal(hasil.tanggalAwal, '2026-07-24');
});

test('All classes together: one line per peserta per class, the date range across classes', () => {
  const hasil = susunHasilUjian({
    rows: [
      baris({ pesertaId: 1, kelasId: 3, kelasNama: 'Joy 1', tanggalUjian: '2026-07-17', pola: 'tunggal', nilaiTunggal: 90 }),
      baris({ pesertaId: 2, pesertaNama: 'Budi', kelasId: 1, kelasNama: 'Joy 3', tanggalUjian: '2026-08-27', pola: 'tunggal', nilaiTunggal: 96 }),
    ],
  });
  assert.deepEqual(hasil.peserta.map((p) => p.kelasNama), ['Joy 3', 'Joy 1']);
  assert.equal(hasil.ringkasan.jumlahKelas, 2);
  assert.equal(hasil.tanggalAwal, '2026-07-17');
  assert.equal(hasil.tanggalAkhir, '2026-08-27');
});

test('Class summary: averages overall and per section', () => {
  const hasil = susunHasilUjian({
    rows: [
      baris({ pesertaId: 1, nilaiMojiGoi: 80, nilaiBunpou: 60, nilaiChoukai: 70 }),
      baris({ pesertaId: 2, pesertaNama: 'Budi', nilaiMojiGoi: 90, nilaiBunpou: 70 }),
    ],
  });
  assert.equal(hasil.ringkasan.jumlahPeserta, 2);
  assert.equal(hasil.ringkasan.rataRata, 75);
  assert.deepEqual(hasil.ringkasan.rataBagian, { nilaiMojiGoi: 85, nilaiBunpou: 65, nilaiChoukai: 70 });
});

test('Code list: one entry per class + code, newest first, distinct peserta counted', () => {
  const daftar = daftarKodeUjian([
    { kelasId: 3, codeUjian: 'M001', tanggalUjian: '2026-07-17', pesertaId: 1 },
    { kelasId: 3, codeUjian: 'M001', tanggalUjian: '2026-08-12', pesertaId: 1 },
    { kelasId: 3, codeUjian: 'M001', tanggalUjian: '2026-07-17', pesertaId: 2 },
    { kelasId: 3, codeUjian: 'CP02', tanggalUjian: '2026-09-29', pesertaId: 1 },
    { kelasId: 1, codeUjian: 'M001', tanggalUjian: '2026-08-27', pesertaId: 9 },
    { kelasId: null, codeUjian: 'X', tanggalUjian: '2026-10-01', pesertaId: 5 },
    { kelasId: 3, codeUjian: '  ', tanggalUjian: '2026-10-01', pesertaId: 5 },
  ]);
  assert.deepEqual(
    daftar.map((d) => [d.kelasId, d.codeUjian, d.tanggalAwal, d.tanggalAkhir, d.jumlahPeserta]),
    [
      [3, 'CP02', '2026-09-29', '2026-09-29', 1],
      [1, 'M001', '2026-08-27', '2026-08-27', 1],
      [3, 'M001', '2026-07-17', '2026-08-12', 2],
    ]
  );
});
