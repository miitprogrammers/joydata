// Time a peserta actively uses the portal per day (Jakarta date). The portal reports the active seconds gathered
// since its last report, about once a minute; the server adds them to today's total.

/** Most seconds one report may add: about a minute between reports, with room for a report that failed once. */
export const MAKS_DETIK_PER_LAPORAN = 300;
export const DETIK_SEHARI = 24 * 60 * 60;

/** The seconds a report may add: a whole number from 0 to MAKS_DETIK_PER_LAPORAN; anything else counts as 0. */
export function detikLaporan(nilai) {
  const n = Math.floor(Number(nilai));
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(n, MAKS_DETIK_PER_LAPORAN);
}

/** Today's total after a report: never more than a whole day. */
export function totalSetelahLaporan(totalLama, detik) {
  return Math.min(DETIK_SEHARI, Math.max(0, Number(totalLama) || 0) + detikLaporan(detik));
}
