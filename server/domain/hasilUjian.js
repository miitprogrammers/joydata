// Cetak Hasil Ujian: the results of one exam code, for one class or for every class that took it, as a printable
// sheet (staff page /nilai-ujian/cetak). Columns the user asked for: Nama, Kelas, Moji-Goi, Bunpou-Dokkai,
// Choukai, Nilai rata-rata, Lulus/Tidak (against the exam KKM). Pure functions; akademikRepo loads the rows.
import { computeNilaiUjianAvg } from './rules.js';

function bulat(n, digit) {
  const f = 10 ** digit;
  return Math.round(n * f) / f;
}

function angka(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function rata(nilai) {
  return nilai.length ? bulat(nilai.reduce((a, b) => a + b, 0) / nilai.length, 1) : null;
}

const banding = (a, b) => String(a || '').localeCompare(String(b || ''), 'id', { sensitivity: 'base', numeric: true });

// The exam codes each class has, for the pickers: one entry per class + code (all dates together), newest first.
// rows: { kelasId, codeUjian, tanggalUjian, pesertaId }
export function daftarKodeUjian(rows) {
  const grup = new Map();
  for (const r of rows) {
    const kode = String(r.codeUjian || '').trim();
    if (!kode || r.kelasId === null || r.kelasId === undefined) continue;
    const kunci = `${Number(r.kelasId)}\u0000${kode}`;
    if (!grup.has(kunci)) grup.set(kunci, { kelasId: Number(r.kelasId), codeUjian: kode, tanggal: new Set(), peserta: new Set() });
    const g = grup.get(kunci);
    g.tanggal.add(String(r.tanggalUjian || '').slice(0, 10));
    g.peserta.add(Number(r.pesertaId));
  }
  return [...grup.values()]
    .map((g) => {
      const tanggal = [...g.tanggal].filter(Boolean).sort();
      return {
        kelasId: g.kelasId,
        codeUjian: g.codeUjian,
        tanggalAwal: tanggal[0] || null,
        tanggalAkhir: tanggal[tanggal.length - 1] || null,
        jumlahPeserta: g.peserta.size,
      };
    })
    .sort(
      (a, b) =>
        String(b.tanggalAwal || '').localeCompare(String(a.tanggalAwal || '')) ||
        banding(a.codeUjian, b.codeUjian) ||
        a.kelasId - b.kelasId
    );
}

// One printable result, sorted from the highest average down.
//  rows: nilai_ujian rows of the code (one class, or several), with pesertaNama and kelasNama added
// One line per peserta per class. A peserta with several rows for the code in the same class (a remedial or
// susulan paper on another date) keeps the highest score, the rule the import script follows too.
export function susunHasilUjian({ rows = [], kkm = 70 } = {}) {
  const perPeserta = new Map();
  for (const r of rows) {
    const nilaiAkhir = angka(r.nilaiAvg) ?? computeNilaiUjianAvg(r);
    const baris = {
      pesertaId: Number(r.pesertaId),
      nama: r.pesertaNama || `Peserta #${r.pesertaId}`,
      kelasId: r.kelasId === null || r.kelasId === undefined ? null : Number(r.kelasId),
      kelasNama: r.kelasNama || '-',
      tanggalUjian: String(r.tanggalUjian || '').slice(0, 10),
      // A single-score exam has no sections: its score is the average, the section cells stay empty.
      nilaiMojiGoi: r.pola === 'tunggal' ? null : angka(r.nilaiMojiGoi),
      nilaiBunpou: r.pola === 'tunggal' ? null : angka(r.nilaiBunpou ?? r.nilaiDokkai),
      nilaiChoukai: r.pola === 'tunggal' ? null : angka(r.nilaiChoukai),
      nilaiRata: nilaiAkhir === null ? null : bulat(nilaiAkhir, 2),
    };
    const kunci = `${baris.pesertaId}\u0000${baris.kelasId}`;
    const lama = perPeserta.get(kunci);
    const lebihBaik =
      !lama ||
      (baris.nilaiRata ?? -1) > (lama.nilaiRata ?? -1) ||
      ((baris.nilaiRata ?? -1) === (lama.nilaiRata ?? -1) && baris.tanggalUjian > lama.tanggalUjian);
    if (lebihBaik) perPeserta.set(kunci, baris);
  }

  // Highest average first (user's choice), across classes when several are printed together; ties by name,
  // peserta without a score last.
  const peserta = [...perPeserta.values()]
    .map((p) => ({ ...p, lulus: p.nilaiRata === null ? null : p.nilaiRata >= kkm }))
    .sort((a, b) => (b.nilaiRata ?? -1) - (a.nilaiRata ?? -1) || banding(a.nama, b.nama) || banding(a.kelasNama, b.kelasNama));

  const dinilai = peserta.filter((p) => p.nilaiRata !== null);
  const bagian = (key) => rata(peserta.map((p) => p[key]).filter((v) => v !== null));
  const tanggal = [...new Set(peserta.map((p) => p.tanggalUjian).filter(Boolean))].sort();

  return {
    kkm,
    tanggalAwal: tanggal[0] || null,
    tanggalAkhir: tanggal[tanggal.length - 1] || null,
    peserta,
    ringkasan: {
      jumlahPeserta: peserta.length,
      jumlahKelas: new Set(peserta.map((p) => p.kelasId)).size,
      rataRata: rata(dinilai.map((p) => p.nilaiRata)),
      lulus: dinilai.filter((p) => p.lulus).length,
      tidakLulus: dinilai.filter((p) => !p.lulus).length,
      rataBagian: {
        nilaiMojiGoi: bagian('nilaiMojiGoi'),
        nilaiBunpou: bagian('nilaiBunpou'),
        nilaiChoukai: bagian('nilaiChoukai'),
      },
    },
  };
}
