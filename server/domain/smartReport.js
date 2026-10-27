import { createHash } from 'node:crypto';
import {
  computeNilaiUjianAvg,
  getGradeLabel,
  computeSikapSummary,
  computeClassMonthlyAbsensi,
} from './rules.js';

/**
 * Smart Report: rekap seluruh perjalanan nilai peserta (semua periode) dan ringkasan kelas,
 * plus fakta anonim yang dikirim ke Gemini untuk menulis resume.
 */

export const BAGIAN_UJIAN = [
  { key: 'mojiGoi', field: 'nilaiMojiGoi' },
  { key: 'bunpou', field: 'nilaiBunpou' },
  { key: 'dokkai', field: 'nilaiDokkai' },
  { key: 'choukai', field: 'nilaiChoukai' },
];

const round1 = (n) => Math.round(n * 10) / 10;
const toMonth = (date) => String(date).slice(0, 7);
const toDay = (date) => String(date).slice(0, 10);

function optionalNumber(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function mean(values) {
  const nums = values.filter((v) => Number.isFinite(v));
  return nums.length ? round1(nums.reduce((a, b) => a + b, 0) / nums.length) : null;
}

function median(values) {
  const nums = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (!nums.length) return null;
  const mid = Math.floor(nums.length / 2);
  return round1(nums.length % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2);
}

function stdev(values) {
  const nums = values.filter((v) => Number.isFinite(v));
  if (nums.length < 2) return null;
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return round1(Math.sqrt(nums.reduce((acc, n) => acc + (n - avg) ** 2, 0) / nums.length));
}

function resolveAvg(u) {
  const stored = optionalNumber(u.nilaiAvg);
  return stored !== null ? stored : computeNilaiUjianAvg(u);
}

/**
 * Builds the full journey of one peserta from all of their records. Rows may come from every class;
 * absensiRows may hold the whole table (sessions are counted per class the peserta attended that month).
 */
export function buildPesertaJourney({
  pesertaId,
  kelasId = null,
  ujianRows = [],
  kaiwaRows = [],
  sikapRows = [],
  absensiRows = [],
  settings,
}) {
  const pid = Number(pesertaId);
  const { kkm_ujian: kkmUjian, kkm_sikap: kkmSikap, sikap_basis: basis, batas_grade: batasGrade } = settings;

  const ujianDaftar = ujianRows
    .filter((u) => Number(u.pesertaId) === pid && u.tanggalUjian)
    .map((u) => {
      const rata = resolveAvg(u);
      return {
        id: u.id,
        tanggal: toDay(u.tanggalUjian),
        kode: u.codeUjian || '',
        pola: u.pola,
        mojiGoi: optionalNumber(u.nilaiMojiGoi),
        bunpou: optionalNumber(u.nilaiBunpou),
        dokkai: optionalNumber(u.nilaiDokkai),
        choukai: optionalNumber(u.nilaiChoukai),
        nilaiTunggal: optionalNumber(u.nilaiTunggal),
        rata,
        grade: rata !== null ? getGradeLabel(rata, batasGrade) : '-',
        lulusKkm: rata !== null && rata >= kkmUjian,
        catatan: u.catatan || '',
      };
    })
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.kode.localeCompare(b.kode));

  const kaiwaDaftar = kaiwaRows
    .filter((k) => Number(k.pesertaId) === pid && k.tanggalKaiwa)
    .map((k) => ({
      id: k.id,
      tanggal: toDay(k.tanggalKaiwa),
      topik: k.topik || '',
      grade: k.grade,
      catatan: k.description || '',
    }))
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  const sikapDaftar = sikapRows
    .filter((s) => Number(s.pesertaId) === pid && s.tanggalPenilaian)
    .map((s) => ({
      id: s.id,
      tanggal: toDay(s.tanggalPenilaian),
      kategoriNamaId: s.kategoriNamaId || 'Lainnya',
      kategoriNamaJa: s.kategoriNamaJa || 'その他',
      sentiment: s.sentiment,
      bobot: Math.abs(Number(s.bobot) || 0),
      keterangan: s.description || '',
    }))
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal));

  const ownAbsensi = absensiRows.filter((a) => Number(a.pesertaId) === pid && a.tanggalAbsensi);

  const ownDates = [
    ...ujianDaftar.map((u) => u.tanggal),
    ...kaiwaDaftar.map((k) => k.tanggal),
    ...sikapDaftar.map((s) => s.tanggal),
    ...ownAbsensi.map((a) => toDay(a.tanggalAbsensi)),
  ].sort();
  const rentang = ownDates.length ? { mulai: ownDates[0], sampai: ownDates[ownDates.length - 1] } : null;

  // Sessions of the classes this peserta belongs to, limited to the span of their own records.
  const kelasIds = new Set(ownAbsensi.map((a) => Number(a.kelasId)));
  if (kelasId) kelasIds.add(Number(kelasId));
  const kelasAbsensi = rentang
    ? absensiRows.filter(
        (a) =>
          a.tanggalAbsensi &&
          kelasIds.has(Number(a.kelasId)) &&
          toDay(a.tanggalAbsensi) >= rentang.mulai &&
          toDay(a.tanggalAbsensi) <= rentang.sampai
      )
    : [];

  const months = [...new Set([...ownDates.map(toMonth), ...kelasAbsensi.map((a) => toMonth(a.tanggalAbsensi))])].sort();

  const bulanan = months.map((periode) => {
    const ujianBulan = ujianDaftar.filter((u) => toMonth(u.tanggal) === periode);
    const sikapBulan = sikapDaftar.filter((s) => toMonth(s.tanggal) === periode);

    // The classes the peserta was recorded in that month, or their current class when there is no record.
    const ownBulan = ownAbsensi.filter((a) => toMonth(a.tanggalAbsensi) === periode);
    const kelasBulan = new Set(ownBulan.map((a) => Number(a.kelasId)));
    if (kelasBulan.size === 0 && kelasId) kelasBulan.add(Number(kelasId));
    const absensiBulan = kelasAbsensi.filter(
      (a) => toMonth(a.tanggalAbsensi) === periode && kelasBulan.has(Number(a.kelasId))
    );
    const abs = computeClassMonthlyAbsensi([pid], absensiBulan).studentStats.get(pid);

    const sikap = computeSikapSummary(sikapBulan, basis, kkmSikap, batasGrade);
    return {
      periode,
      ujianRata: mean(ujianBulan.map((u) => u.rata)),
      jumlahUjian: ujianBulan.length,
      kaiwa: kaiwaDaftar.filter((k) => toMonth(k.tanggal) === periode).map((k) => k.grade),
      sikap: {
        skor: sikap.skorAkhir,
        predikat: sikap.label,
        lulusKkm: sikap.lulusKkm,
        positif: sikap.jumlahPositif,
        negatif: sikap.jumlahNegatif,
      },
      absensi: {
        sesi: abs.sesiKelas,
        hadir: abs.hadir,
        sakit: abs.sakit,
        izin: abs.izin,
        alfa: abs.alfa,
        rasio: abs.rasioKehadiran,
      },
    };
  });

  const ujianRataList = ujianDaftar.map((u) => u.rata).filter((v) => v !== null);
  const rataUjian = mean(ujianRataList);
  const dinilai = ujianDaftar.filter((u) => u.rata !== null);
  const tertinggi = dinilai.reduce((best, u) => (!best || u.rata > best.rata ? u : best), null);
  const terendah = dinilai.reduce((worst, u) => (!worst || u.rata < worst.rata ? u : worst), null);
  let tren = null;
  if (ujianRataList.length >= 2) {
    const n = Math.min(3, Math.floor(ujianRataList.length / 2));
    const awal = mean(ujianRataList.slice(0, n));
    const akhir = mean(ujianRataList.slice(-n));
    tren = { jumlahPembanding: n, awal, akhir, selisih: round1(akhir - awal) };
  }

  const absensiTotal = bulanan.reduce(
    (acc, b) => ({
      sesi: acc.sesi + b.absensi.sesi,
      hadir: acc.hadir + b.absensi.hadir,
      sakit: acc.sakit + b.absensi.sakit,
      izin: acc.izin + b.absensi.izin,
      alfa: acc.alfa + b.absensi.alfa,
    }),
    { sesi: 0, hadir: 0, sakit: 0, izin: 0, alfa: 0 }
  );
  absensiTotal.rasio = absensiTotal.sesi > 0 ? round1((absensiTotal.hadir / absensiTotal.sesi) * 100) : null;

  // Sikap starts again from the basis every month, so the journey score is the mean of the monthly scores.
  const skorSikap = mean(bulanan.map((b) => b.sikap.skor));

  const distribusiKaiwa = { A: 0, B: 0, C: 0 };
  for (const k of kaiwaDaftar) {
    if (k.grade in distribusiKaiwa) distribusiKaiwa[k.grade] += 1;
  }

  return {
    rentang,
    kpi: {
      rataUjian,
      gradeUjian: rataUjian !== null ? getGradeLabel(rataUjian, batasGrade) : '-',
      lulusKkmUjian: rataUjian !== null ? rataUjian >= kkmUjian : null,
      jumlahUjian: ujianDaftar.length,
      jumlahLulusUjian: ujianDaftar.filter((u) => u.lulusKkm).length,
      kaiwaTerakhir: kaiwaDaftar.length ? kaiwaDaftar[kaiwaDaftar.length - 1].grade : null,
      jumlahKaiwa: kaiwaDaftar.length,
      skorSikap,
      predikatSikap: skorSikap !== null ? getGradeLabel(skorSikap, batasGrade) : '-',
      lulusKkmSikap: skorSikap !== null ? skorSikap >= kkmSikap : null,
      rasioKehadiran: absensiTotal.rasio,
      kehadiranRendah: absensiTotal.rasio !== null && absensiTotal.rasio < settings.ambang_kehadiran_rendah,
    },
    ujian: {
      daftar: ujianDaftar,
      bagian: Object.fromEntries(BAGIAN_UJIAN.map((b) => [b.key, mean(ujianDaftar.map((u) => u[b.key]))])),
      tertinggi: tertinggi ? { kode: tertinggi.kode, tanggal: tertinggi.tanggal, rata: tertinggi.rata } : null,
      terendah: terendah ? { kode: terendah.kode, tanggal: terendah.tanggal, rata: terendah.rata } : null,
      tren,
    },
    kaiwa: { daftar: kaiwaDaftar, distribusi: distribusiKaiwa },
    sikap: { daftar: sikapDaftar },
    absensi: absensiTotal,
    bulanan,
  };
}

/**
 * Class page of the Smart Report: statistics over the members' journeys and a ranking by exam average
 * (ties broken by attendance). members: [{ pesertaId, nama, journey }]
 */
export function buildKelasSummary(members, settings) {
  const rows = members.map(({ pesertaId, nama, journey }) => ({
    pesertaId,
    nama,
    ...journey.kpi,
    bagian: journey.ujian.bagian,
  }));

  const dinilai = rows
    .filter((r) => r.rataUjian !== null)
    .sort(
      (a, b) =>
        b.rataUjian - a.rataUjian ||
        (b.rasioKehadiran ?? -1) - (a.rasioKehadiran ?? -1) ||
        a.nama.localeCompare(b.nama)
    );
  const ranking = dinilai.map((r) => ({ ...r, peringkat: null }));
  // Equal averages share a rank (1, 2, 2, 4).
  for (let i = 0; i < ranking.length; i += 1) {
    ranking[i].peringkat =
      i > 0 && ranking[i].rataUjian === ranking[i - 1].rataUjian ? ranking[i - 1].peringkat : i + 1;
  }
  const tanpaNilai = rows
    .filter((r) => r.rataUjian === null)
    .sort((a, b) => a.nama.localeCompare(b.nama))
    .map((r) => ({ ...r, peringkat: null }));

  const rataList = dinilai.map((r) => r.rataUjian);
  const distribusiGrade = { A: 0, B: 0, C: 0, D: 0 };
  for (const r of dinilai) distribusiGrade[r.gradeUjian] += 1;

  const distribusiKaiwa = { A: 0, B: 0, C: 0 };
  for (const r of rows) {
    if (r.kaiwaTerakhir in distribusiKaiwa) distribusiKaiwa[r.kaiwaTerakhir] += 1;
  }

  const ujianSemua = members.flatMap(({ journey }) => journey.ujian.daftar);
  const perKode = new Map();
  for (const u of ujianSemua) {
    if (!u.kode) continue;
    const entry = perKode.get(u.kode) || { kode: u.kode, tanggal: u.tanggal, nilai: [], lulus: 0 };
    if (u.tanggal < entry.tanggal) entry.tanggal = u.tanggal;
    if (u.rata !== null) entry.nilai.push(u.rata);
    if (u.lulusKkm) entry.lulus += 1;
    perKode.set(u.kode, entry);
  }
  const perUjian = [...perKode.values()]
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.kode.localeCompare(b.kode))
    .map((e) => ({
      kode: e.kode,
      tanggal: e.tanggal,
      rata: mean(e.nilai),
      tertinggi: e.nilai.length ? Math.max(...e.nilai) : null,
      terendah: e.nilai.length ? Math.min(...e.nilai) : null,
      jumlahPeserta: e.nilai.length,
      jumlahLulus: e.lulus,
    }));

  const perluPerhatian = rows
    .map((r) => ({
      pesertaId: r.pesertaId,
      nama: r.nama,
      alasan: [
        r.lulusKkmUjian === false ? 'ujian' : null,
        r.kehadiranRendah ? 'kehadiran' : null,
        r.lulusKkmSikap === false ? 'sikap' : null,
      ].filter(Boolean),
      rataUjian: r.rataUjian,
      rasioKehadiran: r.rasioKehadiran,
      skorSikap: r.skorSikap,
    }))
    .filter((r) => r.alasan.length > 0)
    .sort((a, b) => b.alasan.length - a.alasan.length || a.nama.localeCompare(b.nama));

  const rentangList = members.map(({ journey }) => journey.rentang).filter(Boolean);
  const top = ranking[0] || null;
  const bottom = ranking[ranking.length - 1] || null;

  return {
    rentang: rentangList.length
      ? {
          mulai: rentangList.map((r) => r.mulai).sort()[0],
          sampai: rentangList.map((r) => r.sampai).sort().slice(-1)[0],
        }
      : null,
    statistik: {
      jumlahPeserta: rows.length,
      jumlahDinilai: dinilai.length,
      rataKelas: mean(rataList),
      median: median(rataList),
      simpanganBaku: stdev(rataList),
      tertinggi: top ? { pesertaId: top.pesertaId, nama: top.nama, nilai: top.rataUjian } : null,
      terendah: bottom ? { pesertaId: bottom.pesertaId, nama: bottom.nama, nilai: bottom.rataUjian } : null,
      jumlahLulusKkm: dinilai.filter((r) => r.lulusKkmUjian).length,
      rataKehadiran: mean(rows.map((r) => r.rasioKehadiran)),
      jumlahKehadiranRendah: rows.filter((r) => r.kehadiranRendah).length,
      rataSikap: mean(rows.map((r) => r.skorSikap)),
      jumlahSikapBawahKkm: rows.filter((r) => r.lulusKkmSikap === false).length,
      jumlahUjianTercatat: ujianSemua.length,
    },
    distribusiGrade,
    distribusiKaiwa,
    bagian: Object.fromEntries(BAGIAN_UJIAN.map((b) => [b.key, mean(ujianSemua.map((u) => u[b.key]))])),
    perUjian,
    ranking: [...ranking, ...tanpaNilai],
    perluPerhatian,
    aturan: settingsSnapshot(settings),
  };
}

function settingsSnapshot(settings) {
  return {
    kkmUjian: settings.kkm_ujian,
    kkmSikap: settings.kkm_sikap,
    basisSikap: settings.sikap_basis,
    batasGrade: settings.batas_grade,
    ambangKehadiran: settings.ambang_kehadiran_rendah,
  };
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Replaces each part of the peserta's own name in free text, so notes sent to Gemini carry no name. */
export function makeNameScrubber(nama, replacement = 'peserta') {
  const parts = String(nama || '')
    .split(/\s+/)
    .map((p) => p.replace(/[^\p{L}\p{N}'-]/gu, ''))
    .filter((p) => p.length >= 3);
  if (!parts.length) return (text) => text;
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${parts.map(escapeRegExp).join('|')})(?![\\p{L}\\p{N}])`, 'giu');
  return (text) => String(text || '').replace(pattern, replacement);
}

const compact = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== '' && v !== undefined));

/** Facts about one peserta for the AI resume: no name, no ids, and the peserta's name removed from notes. */
export function buildPesertaAiFacts(journey, { nama, programNama, settings }) {
  const scrub = makeNameScrubber(nama);
  return {
    program: programNama || null,
    rentangData: journey.rentang,
    aturan: settingsSnapshot(settings),
    ujian: {
      rataKeseluruhan: journey.kpi.rataUjian,
      predikat: journey.kpi.gradeUjian,
      jumlahUjian: journey.kpi.jumlahUjian,
      jumlahLulusKkm: journey.kpi.jumlahLulusUjian,
      rataPerBagian: journey.ujian.bagian,
      tren: journey.ujian.tren,
      tertinggi: journey.ujian.tertinggi,
      terendah: journey.ujian.terendah,
      daftar: journey.ujian.daftar.map((u) =>
        compact({
          tanggal: u.tanggal,
          kode: u.kode,
          mojiGoi: u.mojiGoi,
          bunpou: u.bunpou,
          dokkai: u.dokkai,
          choukai: u.choukai,
          nilaiTunggal: u.nilaiTunggal,
          rata: u.rata,
          grade: u.grade,
          lulusKkm: u.lulusKkm,
          catatan: scrub(u.catatan),
        })
      ),
    },
    kaiwa: {
      jumlahSesi: journey.kpi.jumlahKaiwa,
      gradeTerakhir: journey.kpi.kaiwaTerakhir,
      distribusi: journey.kaiwa.distribusi,
      daftar: journey.kaiwa.daftar.map((k) =>
        compact({ tanggal: k.tanggal, topik: scrub(k.topik), grade: k.grade, catatan: scrub(k.catatan) })
      ),
    },
    sikap: {
      skorRataBulanan: journey.kpi.skorSikap,
      predikat: journey.kpi.predikatSikap,
      lulusKkm: journey.kpi.lulusKkmSikap,
      bulanan: journey.bulanan.map((b) => ({ periode: b.periode, skor: b.sikap.skor, positif: b.sikap.positif, negatif: b.sikap.negatif })),
      kejadian: journey.sikap.daftar.map((s) =>
        compact({
          tanggal: s.tanggal,
          kategori: s.kategoriNamaId,
          sifat: s.sentiment,
          bobot: s.bobot,
          keterangan: scrub(s.keterangan),
        })
      ),
    },
    kehadiran: {
      total: journey.absensi,
      bulanan: journey.bulanan.filter((b) => b.absensi.sesi > 0).map((b) => ({ periode: b.periode, ...b.absensi })),
    },
  };
}

/**
 * Facts about one class for the AI resume. Peserta appear only as aliases (P01, P02, … in ranking order);
 * aliases maps each alias back to the peserta so names can be put back into the generated text.
 */
export function buildKelasAiFacts(summary, { programNama, settings }) {
  const aliases = new Map();
  const aliasOf = new Map();
  summary.ranking.forEach((r, i) => {
    const alias = `P${String(i + 1).padStart(2, '0')}`;
    aliases.set(alias, { pesertaId: r.pesertaId, nama: r.nama });
    aliasOf.set(r.pesertaId, alias);
  });
  const s = summary.statistik;
  const facts = {
    program: programNama || null,
    rentangData: summary.rentang,
    aturan: settingsSnapshot(settings),
    statistik: {
      ...s,
      tertinggi: s.tertinggi ? { peserta: aliasOf.get(s.tertinggi.pesertaId), nilai: s.tertinggi.nilai } : null,
      terendah: s.terendah ? { peserta: aliasOf.get(s.terendah.pesertaId), nilai: s.terendah.nilai } : null,
    },
    distribusiPredikatUjian: summary.distribusiGrade,
    distribusiKaiwaTerakhir: summary.distribusiKaiwa,
    rataPerBagian: summary.bagian,
    rataPerUjian: summary.perUjian,
    peringkat: summary.ranking.map((r) =>
      compact({
        peserta: aliasOf.get(r.pesertaId),
        peringkat: r.peringkat,
        rataUjian: r.rataUjian,
        predikat: r.rataUjian !== null ? r.gradeUjian : null,
        jumlahUjian: r.jumlahUjian,
        kehadiran: r.rasioKehadiran,
        skorSikap: r.skorSikap,
        kaiwaTerakhir: r.kaiwaTerakhir,
      })
    ),
    perluPerhatian: summary.perluPerhatian.map((p) => ({ peserta: aliasOf.get(p.pesertaId), alasan: p.alasan })),
  };
  return { facts, aliases };
}

/** Puts the real names back in place of the aliases (P01, …) in AI text. */
export function restoreAliases(text, aliases) {
  return String(text || '').replace(/\bP\d{2,3}\b/g, (alias) => aliases.get(alias)?.nama || alias);
}

export function hashFacts(facts, version) {
  return createHash('sha256').update(`${version}:${JSON.stringify(facts)}`).digest('hex');
}
