// Shared by the printed rapor (RaporSheet) and the Smart Report (PesertaReport): status colours and number summaries.

const round1 = (v) => Math.round(v * 10) / 10;

// Identity block tinted by the status tag (blok), with a legend swatch per status (contoh).
export const STATUS_WARNA = {
  standar: { blok: 'bg-slate-50 border-slate-200', contoh: 'bg-slate-200 border-slate-400' },
  berkembang: { blok: 'bg-blue-50 border-blue-200', contoh: 'bg-blue-200 border-blue-400' },
  siap_interview: { blok: 'bg-emerald-50 border-emerald-200', contoh: 'bg-emerald-200 border-emerald-400' },
};

/** Classes of the identity block; the peserta portal hides the status, so there it stays neutral. */
export function warnaIdentitas(statusTag, portal = false) {
  return ((!portal && STATUS_WARNA[statusTag]) || STATUS_WARNA.standar).blok;
}

/** rows: [{ kode, nilai, lulus }] in date order; nilai null = not scored. */
export function ringkasUjian(rows) {
  const dinilai = rows.filter((r) => r.nilai !== null && r.nilai !== undefined && Number.isFinite(Number(r.nilai)));
  if (!dinilai.length) return null;
  return {
    jumlah: rows.length,
    lulus: rows.filter((r) => r.lulus).length,
    tertinggi: dinilai.reduce((a, b) => (b.nilai > a.nilai ? b : a)),
    terendah: dinilai.reduce((a, b) => (b.nilai < a.nilai ? b : a)),
    // First to last exam; null with fewer than two scored exams.
    selisih: dinilai.length >= 2 ? round1(dinilai[dinilai.length - 1].nilai - dinilai[0].nilai) : null,
  };
}

/** Number of sessions per kaiwa grade. */
export function hitungGrade(grades) {
  const counts = { A: 0, B: 0, C: 0 };
  for (const g of grades) if (g in counts) counts[g] += 1;
  return counts;
}

/**
 * Sikap records grouped per category: number of records and their signed total, biggest impact first.
 * rows: [{ kategoriNamaId, kategoriNamaJa, sentiment, bobot }]
 */
export function sikapPerKategori(rows, locale) {
  const byNama = new Map();
  for (const r of rows) {
    const nama = (locale === 'ja' ? r.kategoriNamaJa : r.kategoriNamaId) || '-';
    const sign = r.sentiment === 'positif' ? 1 : -1;
    const cur = byNama.get(nama) || { nama, jumlah: 0, dampak: 0 };
    cur.jumlah += 1;
    cur.dampak = round1(cur.dampak + sign * Math.abs(Number(r.bobot) || 0));
    byNama.set(nama, cur);
  }
  return [...byNama.values()].sort((a, b) => Math.abs(b.dampak) - Math.abs(a.dampak) || b.jumlah - a.jumlah);
}

/** "+3.5" / "−2" / "0" */
export function bertanda(v) {
  if (v === null || v === undefined) return '-';
  if (v > 0) return `+${v}`;
  if (v < 0) return `−${Math.abs(v)}`;
  return '0';
}
