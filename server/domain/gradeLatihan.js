/**
 * Grade Latihan on the Monitor Latihan history tab: how diligent (active practice time) and how good (average
 * practice score) a peserta's practice was in the chosen period. The user asked on 2026-11-14 for a grade from
 * session time and average score; Claude chose the formula:
 *
 *   Hari        = WIB days from the latest of { period start, first practice ever logged, peserta's start date }
 *                 to the period end (the chosen day, or today), both included. Today counts as a whole day.
 *   Skor Waktu  = min(100, active minutes ÷ Hari ÷ target minutes per day × 100)        (default target 60)
 *   Skor Nilai  = average score of the scored practice papers (latihan kanji / dokkai), the Skor column
 *   Nilai       = bobotWaktu % × Skor Waktu + (100 − bobotWaktu) % × Skor Nilai          (default 50 / 50)
 *                 without a scored paper in the period (flashcard only) Nilai = Skor Waktu
 *   Grade       = batas_grade, the same A / B / C / D bands as exams (A ≥ 90, B ≥ 75, C ≥ 60)
 *
 * No practice at all gives Nilai 0 (grade D); no day to count (started after the period) gives no grade.
 * Target and weight live in settings key `grade_latihan` (Pengaturan, admin).
 *
 * Pure module without imports: Pengaturan imports it too.
 */

export const DEFAULT_GRADE_LATIHAN = { targetMenitHarian: 60, bobotWaktu: 50 };
export const BATAS_TARGET_MENIT = 600;

const round1 = (v) => Math.round(v * 10) / 10;
const angka = (v) => (v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? null : Number(v));
const tanggalSah = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v.slice(0, 10));

/** The grade rules of the settings, every missing or broken value filled from the defaults. */
export function aturanGradeLatihan(settings) {
  const s = settings?.grade_latihan || {};
  const target = angka(s.targetMenitHarian);
  const bobot = angka(s.bobotWaktu);
  return {
    targetMenitHarian: target !== null && target > 0 ? target : DEFAULT_GRADE_LATIHAN.targetMenitHarian,
    bobotWaktu: bobot !== null && bobot >= 0 && bobot <= 100 ? bobot : DEFAULT_GRADE_LATIHAN.bobotWaktu,
  };
}

/** The `grade_latihan` settings from Pengaturan: { ok, normalized } or { ok: false, code }. Whole numbers. */
export function normalizeGradeLatihanSettings(raw) {
  const gagal = { ok: false, code: 'INVALID_GRADE_LATIHAN' };
  const target = angka(raw?.targetMenitHarian);
  const bobot = angka(raw?.bobotWaktu);
  if (target === null || !Number.isInteger(target) || target < 1 || target > BATAS_TARGET_MENIT) return gagal;
  if (bobot === null || !Number.isInteger(bobot) || bobot < 0 || bobot > 100) return gagal;
  return { ok: true, normalized: { targetMenitHarian: target, bobotWaktu: bobot } };
}

/**
 * Days a peserta could practise in a period: from the latest of the given start dates (YYYY-MM-DD, nulls ignored)
 * to `sampai`, both included; 0 when the start is after `sampai` or there is no start at all.
 */
export function hariDihitung({ dari = null, mulaiData = null, tanggalMasuk = null, sampai }) {
  const awal = [dari, mulaiData, tanggalMasuk].filter(tanggalSah).map((t) => t.slice(0, 10)).sort().pop();
  if (!awal || !tanggalSah(sampai) || awal > sampai) return 0;
  const utc = (t) => Date.UTC(Number(t.slice(0, 4)), Number(t.slice(5, 7)) - 1, Number(t.slice(8, 10)));
  return Math.round((utc(sampai) - utc(awal)) / 86_400_000) + 1;
}

/**
 * The history rows (server order = ranking by active time, each with `peringkat` and `grade`) in the order chosen
 * on Monitor Latihan: kolom 'waktu' or 'grade', arah 'turun' = best first or 'naik' = lowest first. Each row gets
 * `peringkatTampil`, its rank in the chosen column (1 = best) also when the list runs lowest first; peserta
 * without practice have none ('-'). By grade, equal Nilai share a rank and the more active peserta goes first;
 * a row without a grade (started after the period) stays at the bottom either way.
 */
export function urutkanRiwayatLatihan(items, { kolom = 'waktu', arah = 'turun' } = {}) {
  const f = arah === 'naik' ? -1 : 1;
  if (kolom !== 'grade') {
    const rows = items.map((r) => ({ ...r, peringkatTampil: r.detikAktif ? r.peringkat : '-' }));
    return f === 1 ? rows : rows.reverse();
  }
  const nilai = (r) => r.grade?.nilai ?? null;
  const dinilai = items.filter((r) => r.detikAktif && nilai(r) !== null).map(nilai).sort((a, b) => b - a);
  return items
    .map((r) => ({ ...r, peringkatTampil: r.detikAktif && nilai(r) !== null ? dinilai.indexOf(nilai(r)) + 1 : '-' }))
    .sort((a, b) => {
      if (nilai(a) === null || nilai(b) === null) return (nilai(a) === null) - (nilai(b) === null);
      return f * (nilai(b) - nilai(a)) || f * (a.peringkat - b.peringkat);
    });
}

function predikat(nilai, batas) {
  if (nilai >= (batas?.A ?? 90)) return 'A';
  if (nilai >= (batas?.B ?? 75)) return 'B';
  if (nilai >= (batas?.C ?? 60)) return 'C';
  return 'D';
}

/**
 * The grade of one peserta's practice: { hari, menitPerHari, skorWaktu, skorNilai, nilai, grade }, all null when
 * there is no day to count. detikAktif = active seconds in the period, rataSkor = average practice score or null.
 */
export function hitungGradeLatihan({ detikAktif = 0, rataSkor = null }, hari, aturan = DEFAULT_GRADE_LATIHAN, batasGrade = null) {
  if (!hari || hari < 1) return { hari: 0, menitPerHari: null, skorWaktu: null, skorNilai: null, nilai: null, grade: null };
  const menitPerHari = Math.max(0, Number(detikAktif) || 0) / 60 / hari;
  const skorWaktu = Math.min(100, (menitPerHari / aturan.targetMenitHarian) * 100);
  const skorNilai = angka(rataSkor) === null ? null : Math.min(100, Math.max(0, Number(rataSkor)));
  const nilai =
    skorNilai === null ? skorWaktu : (aturan.bobotWaktu * skorWaktu + (100 - aturan.bobotWaktu) * skorNilai) / 100;
  return {
    hari,
    menitPerHari: round1(menitPerHari),
    skorWaktu: round1(skorWaktu),
    skorNilai: skorNilai === null ? null : round1(skorNilai),
    nilai: round1(nilai),
    grade: predikat(round1(nilai), batasGrade),
  };
}
