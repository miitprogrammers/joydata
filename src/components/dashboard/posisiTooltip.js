/**
 * Where a chart tooltip goes for band i of n so it stays inside the chart: from the band's left edge on the left
 * third, ending at its right edge on the right third, centred on the band between. left in %, kelas = translate.
 */
export function posisiDalam(i, n) {
  if (i === null || i === undefined || !n) return { left: 0, kelas: '' };
  const tengah = ((i + 0.5) / n) * 100;
  if (tengah < 100 / 3) return { left: (i / n) * 100, kelas: '' };
  if (tengah > 200 / 3) return { left: ((i + 1) / n) * 100, kelas: '-translate-x-full' };
  return { left: tengah, kelas: '-translate-x-1/2' };
}
