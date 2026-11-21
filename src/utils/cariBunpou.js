// Search and grouping for the Materi Bunpou list. Pure functions so they run in node:test.

const KANJI_FURIGANA = /([㐀-鿿々〆ヶ]+)\{([^}]+)\}/g;

/** Lowercase, katakana -> hiragana, no furigana/highlight markers, no tilde/middle dot/hyphen/space. */
export function normalisasi(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/\{[^}]*\}/g, '')
    .replace(/\[\[|\]\]/g, '')
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/[～〜~・\s-]/g, '');
}

// Same as normalisasi, but kanji are replaced by their reading so that a query in kana still finds 予定{よてい}.
function normalisasiBaca(s) {
  return normalisasi(String(s ?? '').replace(KANJI_FURIGANA, '$2'));
}

const minBab = (m) => {
  const b = m.sumber?.minnaBab;
  return b && b.length ? Math.min(...b) : Infinity;
};
const minModul = (m) => {
  const n = m.sumber?.modulN4;
  return n && n.length ? Math.min(...n) : Infinity;
};

export function skorMateri(m, kueri) {
  const raw = String(kueri ?? '').trim().toLowerCase();
  const bab = raw.match(/^(?:bab|b)\s*(\d{1,2})$/);
  if (bab) return (m.sumber?.minnaBab || []).includes(Number(bab[1])) ? 50 : 0;
  const mod = raw.match(/^(?:#|modul\s*|m)(\d{1,3})$/);
  if (mod) return (m.sumber?.modulN4 || []).includes(Number(mod[1])) ? 50 : 0;

  const qn = normalisasi(kueri);
  if (!qn) return 0;
  const pola = [normalisasi(m.pola), normalisasiBaca(m.pola)];
  const varian = (m.varian || []).flatMap((v) => [normalisasi(v), normalisasiBaca(v)]);
  const romaji = normalisasi(m.romaji);
  let s = 0;
  if (pola.includes(qn)) s = 100;
  else if (pola.some((p) => p.startsWith(qn))) s = 90;
  else if (varian.some((v) => v === qn || v.startsWith(qn))) s = 85;
  else if (romaji === qn) s = 82;
  else if (romaji.startsWith(qn)) s = 76;
  else if (pola.some((p) => p.includes(qn))) s = 70;
  else {
    // Curated catalog keywords outrank the meanings taken from the lesson content.
    const kunci = (m.kataKunci || []).map(normalisasi);
    const padanan = (m.padanan || []).map(normalisasi);
    if (kunci[0] === qn) s = 66;
    else if (kunci.includes(qn) || padanan.includes(qn)) s = 64;
    else if (kunci.some((x) => x.includes(qn)) || padanan.some((x) => x.includes(qn)) || normalisasi(m.arti).includes(qn)) s = 58;
  }
  if (s && m.status === 'belum') s -= 8;
  return s;
}

export function cariMateri(daftar, kueri, { tingkat = '' } = {}) {
  return (daftar || [])
    .filter((m) => !tingkat || m.tingkat === tingkat)
    .map((m) => ({ m, s: skorMateri(m, kueri) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || minBab(a.m) - minBab(b.m) || minModul(a.m) - minModul(b.m))
    .map((x) => x.m);
}

/** mode 'bab' (smallest Minna chapter) or 'modul' (module category). Entries without either go last. */
export function kelompokkan(daftar, mode, kategoriModul = []) {
  const judul = new Map((kategoriModul || []).map((k) => [k.nomor, k.judul]));
  const peta = new Map();
  for (const m of daftar || []) {
    let kunci;
    if (mode === 'modul') kunci = m.kategoriModul ?? 'tidak';
    else kunci = Number.isFinite(minBab(m)) ? minBab(m) : 'tanpa';
    if (!peta.has(kunci)) peta.set(kunci, []);
    peta.get(kunci).push(m);
  }
  const urut = (k) => (typeof k === 'number' ? k : Infinity);
  return [...peta.keys()]
    .sort((a, b) => urut(a) - urut(b))
    .map((kunci) => {
      const materi = peta.get(kunci).slice().sort((a, b) => minModul(a) - minModul(b) || minBab(a) - minBab(b));
      let label;
      if (mode === 'modul') label = typeof kunci === 'number' ? judul.get(kunci) || `Kat. ${kunci}` : 'tidak';
      else label = typeof kunci === 'number' ? `Bab ${kunci}` : 'tanpa';
      return { kunci, label, materi };
    });
}
