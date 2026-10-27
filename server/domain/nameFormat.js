// Normalisasi nama peserta menjadi "Capitalize Each Word" (Title Case).
// Dipakai seragam untuk semua tampilan (view) maupun data unduhan (mis. ekspor CSV),
// baik nama yang bersumber dari mancation maupun dari database lokal.

const WORD_BOUNDARY = /(^|[\s\-'’])(\p{L})/gu;

export function formatPersonName(value) {
  if (value === null || value === undefined) return value;
  const text = String(value).replace(/\s+/g, ' ').trim();
  if (!text) return text;
  return text
    .toLowerCase()
    .replace(WORD_BOUNDARY, (_match, separator, letter) => separator + letter.toUpperCase());
}
