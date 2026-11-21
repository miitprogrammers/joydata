// Materi Bunpou: one grammar lesson per sentence pattern, shown to the class by a sensei.
// The catalog lists every planned pattern; the content files hold the lessons written so far. A catalog entry
// without content is listed as "belum". Shapes and limits: docs/materi-bunpou/spek-kode.md § 1.

import { KATALOG_MATERI } from './katalog.js';
import { MATERI_N5 } from './materiN5.js';
import { MATERI_N4 } from './materiN4.js';
import { MODUL_BUNPOU, LEVEL_BUNPOU, cariPolaBunpou } from '../bunpou.js';
import { furiganaLengkap } from '../tesOnline.js';

export const KATALOG = KATALOG_MATERI;
export const ISI = [...MATERI_N5, ...MATERI_N4];
// Which content file each lesson sits in, so a lesson in the wrong level's file is caught.
export const TINGKAT_BERKAS = Object.fromEntries([
  ...MATERI_N5.map((m) => [m.id, 'N5']),
  ...MATERI_N4.map((m) => [m.id, 'N4']),
]);

export const TEMPAT = ['kerja', 'asrama', 'kelas', 'belanja', 'transportasi', 'rumahsakit', 'mensetsu', 'telepon', 'rumah', 'jalan', 'tawar', 'umum'];
export const STATUS_ISI = ['draf', 'ditinjau'];

// Maximum text lengths (characters) and item counts [min, max] per field.
const PANJANG = {
  arti: 40, kataKunci: 30, inti: 60, kolom: 20, pengantar: 140, jenis: 24, catatanRumus: 30,
  judulMakna: 30, penjelasan: 140, padanan: 30, miniId: 100, perhatikan: 320,
  situasi: 120, catatanContoh: 160, label: 30, penutur: 16, barisJp: 40, barisId: 120,
  subKolom: 24, labelBanding: 40, selBanding: 60, kaki: 120, alasan: 140, tanya: 140, jawab: 140,
  ringkasan: 110, catatanSensei: 200,
};
const JUMLAH = {
  kataKunci: [0, 8], rumus: [2, 8], makna: [1, 3], padanan: [1, 4], contoh: [3, 5], baris: [1, 4],
  kolom: [2, 4], barisBanding: [1, 5], kesalahan: [0, 4], latihan: [2, 4], ringkasan: [2, 4], terkait: [0, 6], catatanSensei: [0, 4],
};
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const KANJI = /[㐀-䶿一-鿿々]/;
const SOROT = /\[\[([^[\]]*)\]\]/g;
const adaTeks = (v) => typeof v === 'string' && v.trim().length > 0;
const panjang = (s) => [...s].length;

/** Collects problems for one entry; every check is one small method so the rules stay readable. */
function pencatat(id) {
  const masalah = [];
  const catat = (field, kode, pesan) => masalah.push({ id, field, kode, pesan });
  const api = {
    masalah,
    catat,
    wajib(field, nilai) {
      if (!adaTeks(nilai)) { catat(field, 'wajib', 'harus berisi teks'); return false; }
      return true;
    },
    jumlah(field, arr, [min, maks]) {
      if (!Array.isArray(arr)) { catat(field, 'wajib', 'harus berupa daftar'); return []; }
      if (arr.length < min || arr.length > maks) catat(field, 'jumlah', `${arr.length} butir, harus ${min}–${maks}`);
      return arr;
    },
    enum(field, nilai, daftar) {
      if (!daftar.includes(nilai)) catat(field, 'enum', `harus salah satu ${daftar.join('/')}`);
    },
    // Indonesian text: no kanji, no markers, length cap.
    id(field, nilai, maks, { wajib = true } = {}) {
      // Whitespace-only counts as absent.
      if (nilai == null || (typeof nilai === 'string' && !nilai.trim())) {
        if (wajib) catat(field, 'wajib', 'harus berisi teks');
        return;
      }
      if (typeof nilai !== 'string') return catat(field, 'wajib', 'harus berupa teks');
      if (panjang(nilai) > maks) catat(field, 'panjang', `${panjang(nilai)} karakter, maksimal ${maks}`);
      if (KANJI.test(nilai)) catat(field, 'kanji_di_id', 'teks Indonesia tidak boleh memuat kanji');
      if (/[{}]|\[\[|\]\]/.test(nilai)) catat(field, 'penanda_di_id', 'teks Indonesia tidak boleh memuat { } [[ ]]');
    },
    // Japanese text: furigana on every kanji run and well-formed [[…]] highlights. Returns whether it has a highlight.
    jp(field, nilai, { sorotWajib = false, maks = 0 } = {}) {
      if (!api.wajib(field, nilai)) return false;
      if (!furiganaLengkap(nilai)) catat(field, 'furigana', 'ada kanji tanpa furigana 漢字{かな}');
      let ada = false;
      for (const [, isi] of nilai.matchAll(SOROT)) {
        ada = true;
        if (!isi.trim()) catat(field, 'sorot', 'sorotan [[ ]] kosong');
        if (isi.includes('、')) catat(field, 'sorot', 'sorotan [[ ]] tidak boleh memuat 、');
      }
      if (/\[\[|\]\]/.test(nilai.replace(SOROT, ''))) catat(field, 'sorot', 'sorotan [[ ]] tidak seimbang atau bersarang');
      if (sorotWajib && !ada) catat(field, 'sorot', 'harus memuat sorotan [[…]]');
      if (maks) {
        const tampak = nilai.replace(SOROT, '$1').replace(/\{[^{}]*\}/g, '');
        if (panjang(tampak) > maks) catat(field, 'panjang', `${panjang(tampak)} karakter tampak, maksimal ${maks}`);
      }
      return ada;
    },
  };
  return api;
}

const urutBab = (bab) => (bab?.length ? Math.min(...bab) : Infinity);
const urutModul = (modul) => (modul?.length ? Math.min(...modul) : Infinity);
const tingkatSeharusnya = (sumber) => (sumber?.minnaBab?.length && Math.min(...sumber.minnaBab) <= 25 ? 'N5' : 'N4');

// Problem codes: id, duplikat, wajib, panjang, jumlah, enum, furigana, sorot, kanji_di_id, penanda_di_id, rujukan,
// tingkat, modul, makna_tak_dipakai, tempat_seragam, bentuk (wrong data shape, e.g. sumber.jlptsensei).

/** Problems of the catalog; [] = every entry is valid. */
export function validasiKatalog(katalog) {
  const semua = [];
  const idAda = new Set();
  const modulDipakai = new Map();
  for (const e of Array.isArray(katalog) ? katalog : []) {
    const p = pencatat(e?.id ?? '(tanpa id)');
    if (typeof e?.id !== 'string' || !SLUG.test(e.id)) p.catat('id', 'id', 'id harus slug huruf kecil/angka/tanda hubung');
    else if (idAda.has(e.id)) p.catat('id', 'duplikat', 'id dipakai dua kali');
    idAda.add(e?.id);
    p.jp('pola', e?.pola);
    if (e?.varian !== undefined) {
      if (!Array.isArray(e.varian)) p.catat('varian', 'wajib', 'harus berupa daftar');
      else e.varian.forEach((v, i) => p.jp(`varian[${i}]`, v));
    }
    p.wajib('romaji', e?.romaji);
    p.id('arti', e?.arti, PANJANG.arti);
    if (e?.kataKunci !== undefined) {
      p.jumlah('kataKunci', e.kataKunci, JUMLAH.kataKunci).forEach((k, i) => p.id(`kataKunci[${i}]`, k, PANJANG.kataKunci));
    }
    p.enum('tingkat', e?.tingkat, ['N5', 'N4']);
    if (e?.sumber?.jlptsensei !== undefined) {
      const j = e.sumber.jlptsensei;
      const bentukBaik = j && typeof j === 'object' && !Array.isArray(j) && Object.entries(j).every(
        ([k, v]) => ['N5', 'N4', 'N3'].includes(k) && Array.isArray(v) && v.every((n) => Number.isInteger(n) && n > 0)
      );
      if (!bentukBaik) p.catat('sumber.jlptsensei', 'bentuk', 'harus objek { N5|N4|N3: [bilangan bulat positif] }');
    }
    const bab = e?.sumber?.minnaBab;
    const modul = e?.sumber?.modulN4;
    if (!Array.isArray(bab) || !Array.isArray(modul)) p.catat('sumber', 'wajib', 'sumber.minnaBab dan sumber.modulN4 harus berupa daftar');
    else {
      if (!bab.every((n) => Number.isInteger(n) && n >= 1 && n <= 50) || bab.some((n, i) => i && n <= bab[i - 1])) {
        p.catat('sumber.minnaBab', 'enum', 'bab harus bilangan 1–50, urut naik');
      }
      if (['N5', 'N4'].includes(e.tingkat) && e.tingkat !== tingkatSeharusnya(e.sumber)) {
        p.catat('tingkat', 'tingkat', `tingkat harus ${tingkatSeharusnya(e.sumber)} menurut bab Minna terkecil`);
      }
      for (const n of modul) {
        if (!cariPolaBunpou('N4', n)) p.catat('sumber.modulN4', 'modul', `pola modul ${n} tidak ada`);
        else if (modulDipakai.has(n)) p.catat('sumber.modulN4', 'modul', `pola modul ${n} sudah dipakai '${modulDipakai.get(n)}'`);
        else modulDipakai.set(n, e.id);
      }
    }
    semua.push(...p.masalah);
  }
  return semua;
}

function periksaRumus(p, isi) {
  const kol = isi.rumusKolom;
  if (!kol || typeof kol !== 'object') p.catat('rumusKolom', 'wajib', 'harus berisi dasar dan hasil');
  else {
    p.id('rumusKolom.dasar', kol.dasar, PANJANG.kolom);
    p.id('rumusKolom.hasil', kol.hasil, PANJANG.kolom);
    p.id('rumusKolom.antara', kol.antara, PANJANG.kolom, { wajib: false });
  }
  const baris = p.jumlah('rumus', isi.rumus, JUMLAH.rumus);
  let adaAntara = false;
  baris.forEach((r, i) => {
    const f = `rumus[${i}]`;
    p.id(`${f}.jenis`, r?.jenis, PANJANG.jenis, { wajib: false });
    p.jp(`${f}.dasar`, r?.dasar);
    if (r?.antara !== undefined) { adaAntara = true; p.jp(`${f}.antara`, r.antara); }
    p.jp(`${f}.hasil`, r?.hasil, { sorotWajib: true });
    if (r?.catatan !== undefined) {
      if (panjang(r.catatan) > PANJANG.catatanRumus) p.catat(`${f}.catatan`, 'panjang', `maksimal ${PANJANG.catatanRumus} karakter`);
      if (!furiganaLengkap(r.catatan)) p.catat(`${f}.catatan`, 'furigana', 'ada kanji tanpa furigana');
      // [[ ]] is reserved for highlights, which a note never has; reported as a stray marker (penanda_di_id).
      if (r.catatan.includes('[[') || r.catatan.includes(']]')) p.catat(`${f}.catatan`, 'penanda_di_id', 'catatan tidak boleh memuat [[ ]]');
    }
  });
  if (adaAntara && !kol?.antara) p.catat('rumusKolom.antara', 'wajib', 'baris memakai antara, label kolom antara wajib');
  if (!adaAntara && kol?.antara) p.catat('rumusKolom.antara', 'rujukan', 'label antara tanpa baris yang memakainya');
}

function periksaMakna(p, isi) {
  const makna = p.jumlah('makna', isi.makna, JUMLAH.makna);
  makna.forEach((m, i) => {
    const f = `makna[${i}]`;
    p.id(`${f}.judul`, m?.judul, PANJANG.judulMakna);
    p.id(`${f}.penjelasan`, m?.penjelasan, PANJANG.penjelasan);
    p.jumlah(`${f}.padanan`, m?.padanan, JUMLAH.padanan).forEach((x, j) => p.id(`${f}.padanan[${j}]`, x, PANJANG.padanan));
    if (m?.contohMini !== undefined) {
      p.jp(`${f}.contohMini.jp`, m.contohMini?.jp);
      p.id(`${f}.contohMini.id`, m.contohMini?.id, PANJANG.miniId);
    }
  });
  return makna;
}

function periksaContoh(p, isi, jumlahMakna) {
  const contoh = p.jumlah('contoh', isi.contoh, JUMLAH.contoh);
  const dipakai = new Set();
  contoh.forEach((c, i) => {
    const f = `contoh[${i}]`;
    p.enum(`${f}.tempat`, c?.tempat, TEMPAT);
    if (!Number.isInteger(c?.makna) || c.makna < 0 || c.makna >= jumlahMakna) p.catat(`${f}.makna`, 'rujukan', 'indeks makna tidak ada');
    else dipakai.add(c.makna);
    p.id(`${f}.label`, c?.label, PANJANG.label, { wajib: false });
    p.id(`${f}.situasi`, c?.situasi, PANJANG.situasi);
    p.id(`${f}.catatan`, c?.catatan, PANJANG.catatanContoh);
    let sorotan = false;
    p.jumlah(`${f}.baris`, c?.baris, JUMLAH.baris).forEach((b, j) => {
      const fb = `${f}.baris[${j}]`;
      if (b?.penutur !== null) p.id(`${fb}.penutur`, b?.penutur, PANJANG.penutur);
      if (p.jp(`${fb}.jp`, b?.jp, { maks: PANJANG.barisJp })) sorotan = true;
      p.id(`${fb}.id`, b?.id, PANJANG.barisId);
    });
    if (Array.isArray(c?.baris) && c.baris.length && !sorotan) p.catat(`${f}.baris`, 'sorot', 'minimal satu baris harus memuat sorotan [[…]]');
  });
  for (let i = 0; i < jumlahMakna; i++) {
    if (contoh.length && !dipakai.has(i)) p.catat(`makna[${i}]`, 'makna_tak_dipakai', 'tidak ada contoh yang memakai makna ini');
  }
  if (contoh.length >= 3 && new Set(contoh.map((c) => c?.tempat)).size < 2) {
    p.catat('contoh', 'tempat_seragam', 'minimal 2 jenis tempat berbeda');
  }
}

function periksaBandingkan(p, isi, ada) {
  const b = isi.bandingkan;
  if (b === undefined) return;
  const kolom = p.jumlah('bandingkan.kolom', b?.kolom, JUMLAH.kolom);
  kolom.forEach((k, i) => {
    const f = `bandingkan.kolom[${i}]`;
    if (k?.id !== null && !ada.has(k?.id)) p.catat(`${f}.id`, 'rujukan', `id '${k?.id}' tidak ada di katalog`);
    if (i === 0 && k?.id !== isi.id) p.catat(`${f}.id`, 'rujukan', 'kolom pertama harus materi ini');
    p.jp(`${f}.pola`, k?.pola);
    p.id(`${f}.sub`, k?.sub, PANJANG.subKolom);
    if (k?.lanjutan !== undefined && typeof k.lanjutan !== 'boolean') p.catat(`${f}.lanjutan`, 'enum', 'harus true/false');
  });
  p.jumlah('bandingkan.baris', b?.baris, JUMLAH.barisBanding).forEach((r, i) => {
    const f = `bandingkan.baris[${i}]`;
    p.id(`${f}.label`, r?.label, PANJANG.labelBanding);
    if (!Array.isArray(r?.isi) || r.isi.length !== kolom.length) return p.catat(`${f}.isi`, 'jumlah', 'jumlah sel harus sama dengan jumlah kolom');
    r.isi.forEach((sel, j) => (r.jp ? p.jp(`${f}.isi[${j}]`, sel) : p.id(`${f}.isi[${j}]`, sel, PANJANG.selBanding)));
  });
  p.id('bandingkan.kaki', b?.kaki, PANJANG.kaki, { wajib: false });
}

/**
 * Problems of the lessons against the catalog; [] = all valid. `tingkatBerkas` ({ id: 'N5'|'N4' }, default
 * TINGKAT_BERKAS) says which content file each lesson came from; it must match the catalog level.
 */
export function validasiIsi(isi, katalog, tingkatBerkas = TINGKAT_BERKAS) {
  const semua = [];
  const ada = new Set((katalog || []).map((e) => e.id));
  const tingkatKatalog = Object.fromEntries((katalog || []).map((e) => [e.id, e.tingkat]));
  const sudah = new Set();
  for (const m of Array.isArray(isi) ? isi : []) {
    const p = pencatat(m?.id ?? '(tanpa id)');
    if (!ada.has(m?.id)) p.catat('id', 'id', 'id tidak ada di katalog');
    else {
      if (sudah.has(m.id)) p.catat('id', 'duplikat', 'lebih dari satu isi untuk id ini');
      sudah.add(m.id);
      const berkas = tingkatBerkas?.[m.id];
      if (berkas && berkas !== tingkatKatalog[m.id]) p.catat('id', 'tingkat', `ditulis di berkas ${berkas}, tingkat katalog ${tingkatKatalog[m.id]}`);
    }
    p.enum('status', m?.status, STATUS_ISI);
    p.id('inti', m?.inti, PANJANG.inti);
    periksaRumus(p, m || {});
    p.id('rumusPengantar', m?.rumusPengantar, PANJANG.pengantar, { wajib: false });
    const makna = periksaMakna(p, m || {});
    p.id('perhatikan', m?.perhatikan, PANJANG.perhatikan, { wajib: false });
    periksaContoh(p, m || {}, makna.length);
    periksaBandingkan(p, m || {}, ada);
    if (m?.kesalahan !== undefined) {
      p.jumlah('kesalahan', m.kesalahan, JUMLAH.kesalahan).forEach((k, i) => {
        p.jp(`kesalahan[${i}].salah`, k?.salah);
        p.jp(`kesalahan[${i}].benar`, k?.benar, { sorotWajib: true });
        p.id(`kesalahan[${i}].alasan`, k?.alasan, PANJANG.alasan);
      });
    }
    p.jumlah('latihan', m?.latihan, JUMLAH.latihan).forEach((l, i) => {
      const f = `latihan[${i}]`;
      p.id(`${f}.tanya`, l?.tanya, PANJANG.tanya);
      if (l?.jp !== undefined) p.jp(`${f}.jp`, l.jp);
      if (l?.jawabJp !== undefined) p.jp(`${f}.jawabJp`, l.jawabJp);
      p.id(`${f}.jawab`, l?.jawab, PANJANG.jawab, { wajib: false });
      if (!adaTeks(l?.jawab) && !adaTeks(l?.jawabJp)) p.catat(f, 'wajib', 'butuh jawab atau jawabJp');
    });
    p.jumlah('ringkasan', m?.ringkasan, JUMLAH.ringkasan).forEach((r, i) => p.id(`ringkasan[${i}]`, r, PANJANG.ringkasan));
    const terkait = p.jumlah('terkait', m?.terkait, JUMLAH.terkait);
    terkait.forEach((t, i) => {
      if (!ada.has(t)) p.catat(`terkait[${i}]`, 'rujukan', `id '${t}' tidak ada di katalog`);
      else if (t === m.id) p.catat(`terkait[${i}]`, 'rujukan', 'tidak boleh menunjuk dirinya sendiri');
      else if (terkait.indexOf(t) !== i) p.catat(`terkait[${i}]`, 'duplikat', `id '${t}' dua kali`);
    });
    if (m?.catatanSensei !== undefined) {
      p.jumlah('catatanSensei', m.catatanSensei, JUMLAH.catatanSensei).forEach((c, i) => p.id(`catatanSensei[${i}]`, c, PANJANG.catatanSensei));
    }
    semua.push(...p.masalah);
  }
  return semua;
}

/** Module pattern numbers (1–104) no catalog entry points to yet; the goal is an empty list. */
export function cakupanModul(katalog = KATALOG) {
  const dipakai = new Set(katalog.flatMap((e) => e.sumber?.modulN4 || []));
  const semua = MODUL_BUNPOU.N4.kategori.flatMap((k) => k.pola.map((x) => x.nomor));
  return semua.filter((n) => !dipakai.has(n));
}

/** The module's categories, for grouping the list. */
export const kategoriModul = () => MODUL_BUNPOU.N4.kategori.map(({ nomor, judul }) => ({ nomor, judul }));

const levelEntri = (e) => {
  const urut = (e.sumber?.modulN4 || []).map((n) => cariPolaBunpou('N4', n)).filter(Boolean).map((x) => LEVEL_BUNPOU.indexOf(x.level));
  return urut.length ? LEVEL_BUNPOU[Math.min(...urut)] : null;
};
const kategoriEntri = (e) => {
  const pertama = e.sumber?.modulN4?.[0];
  return pertama === undefined ? null : cariPolaBunpou('N4', pertama)?.kategori ?? null;
};
const padananIsi = (isi) => [
  ...new Set((isi?.makna || []).flatMap((m) => m.padanan || []).map((x) => x.replace(/…/g, '').trim()).filter(Boolean)),
];
const turunan = (e, isi) => ({ level: levelEntri(e), kategoriModul: kategoriEntri(e), status: isi?.status || 'belum' });

/** Short list entry for every catalog pattern, ordered by Minna chapter then module number. */
export function ringkasanMateri(katalog = KATALOG, isi = ISI) {
  const peta = new Map(isi.map((m) => [m.id, m]));
  return katalog
    .map((e, i) => ({ e, i }))
    .sort((a, b) =>
      urutBab(a.e.sumber?.minnaBab) - urutBab(b.e.sumber?.minnaBab) ||
      urutModul(a.e.sumber?.modulN4) - urutModul(b.e.sumber?.modulN4) ||
      a.i - b.i
    )
    .map(({ e }) => ({
      id: e.id,
      pola: e.pola,
      varian: e.varian || [],
      romaji: e.romaji,
      arti: e.arti,
      kataKunci: e.kataKunci || [],
      padanan: padananIsi(peta.get(e.id)),
      tingkat: e.tingkat,
      sumber: { minnaBab: e.sumber?.minnaBab || [], modulN4: e.sumber?.modulN4 || [] },
      ...turunan(e, peta.get(e.id)),
    }));
}

/** One full lesson plus short entries of the patterns it points to; null when unknown or not written yet. */
export function ambilMateri(id, katalog = KATALOG, isi = ISI) {
  const e = katalog.find((x) => x.id === id);
  const m = isi.find((x) => x.id === id);
  if (!e || !m) return null;
  const rujukan = [...(m.terkait || []), ...(m.bandingkan?.kolom || []).map((k) => k.id)].filter(Boolean);
  const ringkas = {};
  for (const rid of rujukan) {
    const re = katalog.find((x) => x.id === rid);
    if (!re) continue;
    ringkas[rid] = { id: rid, pola: re.pola, arti: re.arti, status: isi.find((x) => x.id === rid)?.status || 'belum' };
  }
  return { materi: { ...e, ...m, ...turunan(e, m) }, ringkas };
}
