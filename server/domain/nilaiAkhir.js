/**
 * Nilai Akhir on Progres Peserta: one score per peserta from every factor JOYdata can grade, over the whole journey. The user
 * asked on 2026-11-14 for "grading dari semua faktor yang bisa dinilai"; Claude chose the factors and weights:
 *
 *   ujian      monthly exam average                                   (0–100)   default weight 25
 *   kehadiran  attendance ratio                                       (%)                      15
 *   sikap      monthly sikap score (starts at the basis)              (0–100)                  15
 *   kaiwa      kualitas kaiwa: every session, each grade at the middle of its band (kualitasSesi)  10
 *   mensetsu   the same for mensetsu renshuu                                                   10
 *   kaiwaCard  share of finished Kaiwa Card weeks reached             (%)                       5
 *   latihan    Grade Latihan of the month (domain/gradeLatihan.js)    (0–100)                  10
 *   fisik      latest Evaluasi Fisik score up to the month's end      (0–100)                  10
 *
 * Nilai Akhir = weighted mean of the factors that have data (their weights shared out again); a grade needs at
 * least MIN_FAKTOR of them, then batas_grade gives A / B / C / D. Weights live in settings key `nilai_akhir`.
 *
 * Pure module without imports: Pengaturan imports it too.
 */

export const FAKTOR_NILAI_AKHIR = ['ujian', 'kehadiran', 'sikap', 'kaiwa', 'mensetsu', 'kaiwaCard', 'latihan', 'fisik'];
export const DEFAULT_NILAI_AKHIR = {
  bobot: { ujian: 25, kehadiran: 15, sikap: 15, kaiwa: 10, mensetsu: 10, kaiwaCard: 5, latihan: 10, fisik: 10 },
};
export const MIN_FAKTOR = 3;

const round1 = (v) => Math.round(v * 10) / 10;
const angka = (v) => (v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? null : Number(v));

/** The Nilai Akhir rules of the settings, every missing or broken weight filled from the defaults. */
export function aturanNilaiAkhir(settings) {
  const b = settings?.nilai_akhir?.bobot || {};
  return {
    bobot: Object.fromEntries(
      FAKTOR_NILAI_AKHIR.map((k) => {
        const v = angka(b[k]);
        return [k, v !== null && v >= 0 && v <= 100 ? v : DEFAULT_NILAI_AKHIR.bobot[k]];
      })
    ),
  };
}

/** The `nilai_akhir` settings from Pengaturan: { ok, normalized } or { ok: false, code }. Whole weights adding up to 100. */
export function normalizeNilaiAkhirSettings(raw) {
  const gagal = { ok: false, code: 'INVALID_NILAI_AKHIR' };
  const bobot = {};
  for (const k of FAKTOR_NILAI_AKHIR) {
    const v = angka(raw?.bobot?.[k]);
    if (v === null || !Number.isInteger(v) || v < 0 || v > 100) return gagal;
    bobot[k] = v;
  }
  if (FAKTOR_NILAI_AKHIR.reduce((n, k) => n + bobot[k], 0) !== 100) return gagal;
  return { ok: true, normalized: { bobot } };
}

/**
 * Points of a kaiwa / mensetsu grade: the middle of its band in batas_grade (default A 90–100 → 95, B 75–90 → 82.5,
 * C 60–75 → 67.5), so the mean lands in the band of the grade the sessions mostly had.
 */
export function poinGrade(batasGrade = null) {
  const a = batasGrade?.A ?? 90;
  const b = batasGrade?.B ?? 75;
  const c = batasGrade?.C ?? 60;
  return { A: round1((a + 100) / 2), B: round1((b + a) / 2), C: round1((c + b) / 2) };
}

/** Mean points of kaiwa / mensetsu grades (A / B / C); null without a graded session. */
export function poinGradeSesi(grades, batasGrade = null) {
  const titik = poinGrade(batasGrade);
  const poin = (grades || []).map((g) => titik[g]).filter((v) => v !== undefined);
  return poin.length ? round1(poin.reduce((a, b) => a + b, 0) / poin.length) : null;
}

function predikat(nilai, batas) {
  if (nilai >= (batas?.A ?? 90)) return 'A';
  if (nilai >= (batas?.B ?? 75)) return 'B';
  if (nilai >= (batas?.C ?? 60)) return 'C';
  return 'D';
}

/**
 * Kualitas kaiwa (or mensetsu): the spread of the grades of every session, not just the last one. Score = mean
 * points (poinGrade: A = 95, B = 82.5, C = 67.5), grade from batas_grade: all A → 95 A, all B → 82.5 B, all C → 67.5 C;
 * a mix gets the grade most of its sessions had (4 B + 1 C → 79.5 B, 1 B + 2 C → 72.5 C), every session counts.
 * Returns { nilai, grade, jumlah, distribusi }; nilai null without sessions.
 */
export function kualitasSesi(grades, batasGrade = null) {
  const distribusi = { A: 0, B: 0, C: 0 };
  for (const g of grades || []) if (distribusi[g] !== undefined) distribusi[g] += 1;
  const nilai = poinGradeSesi(grades, batasGrade);
  return {
    nilai,
    grade: nilai === null ? null : predikat(nilai, batasGrade),
    jumlah: distribusi.A + distribusi.B + distribusi.C,
    distribusi,
  };
}

/**
 * The factors of a peserta's whole journey (buildPesertaJourney in domain/smartReport.js): every exam, attendance and
 * sikap month, every kaiwa / mensetsu session, the latest fisik test; plus their Kaiwa Card weeks
 * ({ tercapai, jumlahMinggu }) and Grade Latihan over all time, both null for peserta outside a class.
 */
export function faktorKeseluruhan(journey, { kaiwaCard = null, latihan = null, batasGrade = null } = {}) {
  const kaiwa = kualitasSesi(journey.kaiwa.daftar.map((k) => k.grade), batasGrade);
  const mensetsu = kualitasSesi(journey.mensetsu.daftar.map((m) => m.grade), batasGrade);
  const fisik = journey.fisik?.terakhir;
  return {
    ujian:
      journey.kpi.rataUjian === null
        ? null
        : { nilai: journey.kpi.rataUjian, jumlah: journey.kpi.jumlahUjian, tren: journey.ujian.tren?.selisih ?? null },
    kehadiran: journey.absensi.rasio === null ? null : { nilai: journey.absensi.rasio, hadir: journey.absensi.hadir, sesi: journey.absensi.sesi },
    sikap: journey.kpi.skorSikap === null ? null : { nilai: journey.kpi.skorSikap, bulan: journey.bulanan.length },
    kaiwa: kaiwa.nilai === null ? null : kaiwa,
    mensetsu: mensetsu.nilai === null ? null : mensetsu,
    kaiwaCard: kaiwaCard?.jumlahMinggu
      ? { nilai: round1((kaiwaCard.tercapai / kaiwaCard.jumlahMinggu) * 100), tercapai: kaiwaCard.tercapai, minggu: kaiwaCard.jumlahMinggu }
      : null,
    latihan:
      angka(latihan?.nilai) === null
        ? null
        : { nilai: latihan.nilai, grade: latihan.grade, menitPerHari: latihan.menitPerHari, hari: latihan.hari },
    fisik: angka(fisik?.nilaiFisik) === null ? null : { nilai: fisik.nilaiFisik, tanggal: fisik.tanggal, lulusKkm: fisik.lulusKkm },
  };
}

/**
 * faktor: { [key]: { nilai (0–100), ...detail for the breakdown } | null }. Returns { nilai, grade, dinilai, rincian }:
 * rincian lists every factor with its weight, the weight it really got (bobotEfektif, %) and its share of the score.
 */
export function hitungNilaiAkhir(faktor, aturan = DEFAULT_NILAI_AKHIR, batasGrade = null) {
  const ada = FAKTOR_NILAI_AKHIR.filter((k) => angka(faktor?.[k]?.nilai) !== null && aturan.bobot[k] > 0);
  const totalBobot = ada.reduce((n, k) => n + aturan.bobot[k], 0);
  const cukup = ada.length >= MIN_FAKTOR && totalBobot > 0;
  const nilai = cukup ? round1(ada.reduce((n, k) => n + aturan.bobot[k] * Math.min(100, Math.max(0, faktor[k].nilai)), 0) / totalBobot) : null;
  return {
    nilai,
    grade: nilai === null ? null : predikat(nilai, batasGrade),
    dinilai: ada.length,
    rincian: FAKTOR_NILAI_AKHIR.map((k) => {
      const dihitung = ada.includes(k);
      const bobotEfektif = cukup && dihitung ? round1((aturan.bobot[k] / totalBobot) * 100) : null;
      return {
        faktor: k,
        ...(faktor?.[k] || {}),
        nilai: angka(faktor?.[k]?.nilai) === null ? null : round1(faktor[k].nilai),
        bobot: aturan.bobot[k],
        bobotEfektif,
        kontribusi: bobotEfektif === null ? null : round1((bobotEfektif / 100) * Math.min(100, Math.max(0, faktor[k].nilai))),
      };
    }),
  };
}
