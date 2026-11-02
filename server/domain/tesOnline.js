/**
 * Tes Online (kanji & dokkai N5) for the peserta portal. Pure rules: the question catalogue, building a randomised
 * test, grading it, and the access codes sensei hand out. Every attempt draws its own questions (subset, order,
 * distractors and option order), so two peserta, or one peserta twice, never get the same paper.
 */

import { KANJI_DASAR, KANJI_VOLUME, BACAAN_LAIN } from './bankSoal/kanjiN5.js';
import { DOKKAI_LEVEL } from './bankSoal/dokkaiN5.js';

export const JENIS_TES = ['kanji', 'dokkai'];
const JUMLAH_OPSI_KANJI = 4;
const MIN_JUMLAH_SOAL = 1;
// No look-alike characters (0/O, 1/I/L), so a code read aloud or copied from the board is typed right.
const HURUF_KODE = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const PANJANG_KODE = 6;

function kanjiItems(materi) {
  if (materi === 'DASAR') {
    return KANJI_DASAR.map(([kanji, on, kun, arti]) => ({ id: `DASAR:${kanji}`, kanji, on, kun, arti }));
  }
  const vols = materi === 'SEMUA' ? Object.keys(KANJI_VOLUME) : [materi];
  const seen = new Set();
  const items = [];
  for (const vol of vols) {
    for (const [kanji, bacaan, arti] of KANJI_VOLUME[vol] || []) {
      // 服 is in VOL4 and VOL5: one question when both volumes are tested together.
      if (seen.has(kanji)) continue;
      seen.add(kanji);
      items.push({ id: `${vol}:${kanji}`, kanji, bacaan, arti, bacaanLain: BACAAN_LAIN[kanji] || [] });
    }
  }
  return items;
}

// Sentence-pattern level of a dokkai passage. L1-L5 is the passage length and type; this is its grammar,
// vocabulary and kanji. The fixed bank is N5; N4 and N3 passages come from approved AI codes.
export const JLPT_DOKKAI = ['N5', 'N4', 'N3'];

/**
 * Dokkai passages of a material at one sentence-pattern level: for N5 the fixed bank plus the approved AI passages,
 * for N4/N3 only approved AI passages (tambahan: [{ ...passage, level, jlpt }]).
 */
export function poolDokkai(materi, tambahan = [], jlpt = 'N5') {
  const levels = materi === 'SEMUA' ? DOKKAI_LEVEL : DOKKAI_LEVEL.filter((l) => l.kode === materi);
  const bank = jlpt === 'N5' ? levels.flatMap((l) => l.bacaan.map((b) => ({ ...b, level: l.kode, jlpt: 'N5' }))) : [];
  return [...bank, ...tambahan.filter((b) => (b.jlpt || 'N5') === jlpt && (materi === 'SEMUA' || b.level === materi))];
}

/**
 * What can be tested, in display order. `jumlah` = questions in the whole material (kanji: words; dokkai: passages,
 * each with its questions), `saranNamaUjian` = the exam code proposed for Rekap Nilai Ujian.
 */
export function daftarMateriTes(tambahanDokkai = []) {
  const kanji = [
    { kode: 'DASAR', judul: 'Dasar (80 kanji)', jumlah: KANJI_DASAR.length, saranNamaUjian: 'KJ-DASAR' },
    ...Object.entries(KANJI_VOLUME).map(([kode, items]) => ({
      kode,
      judul: `Volume ${kode.slice(3)}`,
      jumlah: items.length,
      saranNamaUjian: `KJ-V${kode.slice(3)}`,
    })),
    { kode: 'SEMUA', judul: 'Semua Volume', jumlah: kanjiItems('SEMUA').length, saranNamaUjian: 'KJ-ALL' },
  ];
  const hitung = (kode, jlpt) => {
    const pool = poolDokkai(kode, tambahanDokkai, jlpt);
    return { jumlah: pool.length, jumlahSoal: pool.reduce((n, b) => n + b.soal.length, 0) };
  };
  // jumlah / jumlahSoal = the N5 pool; perJlpt = the pool at every sentence-pattern level.
  const itemDokkai = (kode, judul, saranNamaUjian) => ({
    kode,
    judul,
    ...hitung(kode, 'N5'),
    perJlpt: Object.fromEntries(JLPT_DOKKAI.map((j) => [j, hitung(kode, j)])),
    saranNamaUjian,
  });
  const dokkai = [
    ...DOKKAI_LEVEL.map((l) => itemDokkai(l.kode, `${l.judul} · ${l.deskripsi}`, `DK-${l.kode}`)),
    itemDokkai('SEMUA', 'Gabungan semua level', 'DK-ALL'),
  ];
  return { kanji, dokkai };
}

export function cariMateri(jenis, materi, tambahanDokkai = []) {
  return daftarMateriTes(tambahanDokkai)[jenis]?.find((m) => m.kode === materi) || null;
}

function shuffle(arr, rng) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const isKatakana = (s) => /^[゠-ヿ]/.test(s);

// Distractors of about the same length first (random within each length band), so length gives nothing away.
function pilihPengecoh(benar, kandidat, jumlah, rng, bolehDipakai = () => true) {
  const perBand = [[], [], []];
  for (const k of shuffle([...new Set(kandidat)], rng)) {
    const band = Math.min(Math.abs(k.length - benar.length), 2);
    if (k === benar || perBand[band].length >= jumlah || !bolehDipakai(k)) continue;
    perBand[band].push(k);
    if (perBand[0].length >= jumlah) break;
  }
  return perBand.flat().slice(0, jumlah);
}

// "Dingin (cuaca)" and "Dingin (benda/sentuhan)", or "Bekerja" and "Bekerja di (suatu tempat)", share a meaning:
// such a pair is never offered together, or the question would have two right answers.
const bagianArtiCache = new Map();
function bagianArti(arti) {
  if (!bagianArtiCache.has(arti)) {
    bagianArtiCache.set(
      arti,
      arti
        .toLowerCase()
        .replace(/\([^)]*\)/g, '')
        .split('/')
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }
  return bagianArtiCache.get(arti);
}

export function artiBeririsan(a, b) {
  const pa = bagianArti(a);
  const pb = bagianArti(b);
  return pa.some((x) => pb.some((y) => x === y || x.startsWith(`${y} `) || y.startsWith(`${x} `)));
}

function opsiAcak(benar, pengecoh, rng) {
  const opsi = shuffle([benar, ...pengecoh], rng);
  return { opsi, benar: opsi.indexOf(benar) };
}

function buatSoalKanji(materi, jumlah, rng) {
  const items = kanjiItems(materi);
  const dipilih = shuffle(items, rng).slice(0, jumlah ? Math.min(jumlah, items.length) : items.length);
  const semuaArti = items.map((i) => i.arti);

  return dipilih.map((item) => {
    let bacaanBenar;
    let kandidatBacaan;
    let semuaBacaan = null;
    if (item.on) {
      // Kanji dasar: ask its main on'yomi or kun'yomi; any reading of this kanji is never offered as a distractor.
      const bisaDitanya = [item.on[0], item.kun[0]].filter(Boolean);
      bacaanBenar = bisaDitanya[Math.floor(rng() * bisaDitanya.length)];
      const milikSendiri = new Set([...item.on, ...item.kun]);
      kandidatBacaan = items
        .flatMap((i) => [i.on[0], i.kun[0]])
        .filter((r) => r && isKatakana(r) === isKatakana(bacaanBenar) && !milikSendiri.has(r));
      semuaBacaan = [item.on.join('、'), item.kun.join('、')].filter(Boolean).join(' ／ ');
    } else {
      bacaanBenar = item.bacaan;
      kandidatBacaan = items.map((i) => i.bacaan).filter((r) => !item.bacaanLain.includes(r));
    }
    return {
      id: item.id,
      kanji: item.kanji,
      semuaBacaan,
      bacaan: opsiAcak(bacaanBenar, pilihPengecoh(bacaanBenar, kandidatBacaan, JUMLAH_OPSI_KANJI - 1, rng), rng),
      arti: opsiAcak(
        item.arti,
        pilihPengecoh(item.arti, semuaArti, JUMLAH_OPSI_KANJI - 1, rng, (k) => !artiBeririsan(item.arti, k)),
        rng
      ),
    };
  });
}

function buatSoalDokkai(bacaan, jumlah, rng, kanjiBoleh) {
  const dipilih = shuffle(bacaan, rng)
    .slice(0, jumlah ? Math.min(jumlah, bacaan.length) : bacaan.length)
    .map((b) => (kanjiBoleh ? sederhanakanBacaan(b, kanjiBoleh) : b));
  return dipilih.map((b) => ({
    id: b.id,
    level: b.level,
    judul: b.judul,
    teks: b.teks,
    terjemahan: b.terjemahan,
    soal: b.soal.map((s) => ({
      id: s.id,
      tanya: s.tanya,
      tanyaId: s.tanyaId,
      pembahasan: s.pembahasan,
      ...opsiAcak(s.opsi[s.benar], s.opsi.filter((_, i) => i !== s.benar), rng),
    })),
  }));
}

/**
 * A fresh, randomised paper with its answer key. rng = () => [0, 1). pool = the dokkai passages to draw from
 * (an AI code's own passages, or the bank with approved AI passages); default = the fixed bank. kanjiBoleh = the
 * kanji a dokkai paper may show (from the code's kanji volumes); other kanji are written in kana.
 */
export function buatSoalTes({ jenis, materi, jumlah = null, pool = null, kanjiBoleh = null }, rng = Math.random) {
  if (!cariMateri(jenis, materi)) throw new Error('INVALID_TES_ONLINE');
  if (jenis === 'kanji') return buatSoalKanji(materi, jumlah, rng);
  return buatSoalDokkai(pool ?? poolDokkai(materi), jumlah, rng, kanjiBoleh);
}

/** The paper a peserta sees during an official test: no answer key, no translation or explanation. */
export function soalTanpaKunci(jenis, soal) {
  if (jenis === 'kanji') {
    return soal.map(({ id, kanji, bacaan, arti }) => ({ id, kanji, bacaan: { opsi: bacaan.opsi }, arti: { opsi: arti.opsi } }));
  }
  return soal.map(({ id, level, judul, teks, soal: daftar }) => ({
    id,
    level,
    judul,
    teks,
    soal: daftar.map(({ id: soalId, tanya, tanyaId, opsi }) => ({ id: soalId, tanya, tanyaId, opsi })),
  }));
}

const pilihan = (v) => (Number.isInteger(v) ? v : null);

/**
 * Grades a paper. Kanji: reading and meaning count half a point each per word. Dokkai: one point per question.
 * jawaban: kanji { [soalId]: { bacaan, arti } }, dokkai { [soalId]: index }; unanswered = wrong.
 */
export function nilaiTes(jenis, soal, jawaban = {}) {
  const j = jawaban && typeof jawaban === 'object' ? jawaban : {};
  if (jenis === 'kanji') {
    const detail = soal.map((s) => {
      const dipilihBacaan = pilihan(j[s.id]?.bacaan);
      const dipilihArti = pilihan(j[s.id]?.arti);
      return {
        id: s.id,
        kanji: s.kanji,
        semuaBacaan: s.semuaBacaan,
        bacaanBenar: s.bacaan.opsi[s.bacaan.benar],
        artiBenar: s.arti.opsi[s.arti.benar],
        bacaanDipilih: dipilihBacaan === null ? null : s.bacaan.opsi[dipilihBacaan] ?? null,
        artiDipilih: dipilihArti === null ? null : s.arti.opsi[dipilihArti] ?? null,
        bacaanOk: dipilihBacaan === s.bacaan.benar,
        artiOk: dipilihArti === s.arti.benar,
      };
    });
    const benarBacaan = detail.filter((d) => d.bacaanOk).length;
    const benarArti = detail.filter((d) => d.artiOk).length;
    const total = detail.length;
    return {
      skor: total ? Math.round(((benarBacaan + benarArti) / (2 * total)) * 10000) / 100 : 0,
      total,
      benar: detail.filter((d) => d.bacaanOk && d.artiOk).length,
      benarBacaan,
      benarArti,
      detail,
    };
  }

  const detail = soal.flatMap((b) =>
    b.soal.map((s) => {
      const dipilih = pilihan(j[s.id]);
      return {
        id: s.id,
        bacaanId: b.id,
        judul: b.judul,
        tanya: s.tanya,
        tanyaId: s.tanyaId,
        jawabanBenar: s.opsi[s.benar],
        jawabanDipilih: dipilih === null ? null : s.opsi[dipilih] ?? null,
        ok: dipilih === s.benar,
        pembahasan: s.pembahasan,
      };
    })
  );
  const benar = detail.filter((d) => d.ok).length;
  return {
    skor: detail.length ? Math.round((benar / detail.length) * 10000) / 100 : 0,
    total: detail.length,
    benar,
    detail,
  };
}

const tanpaFurigana = (s) => String(s || '').replace(/\{[^}]*\}/g, '');

/** One-line note for Rekap Nilai Ujian: what was tested and what to practise again. */
export function catatanHasilTes({ jenis, materiJudul, kode }, hasil) {
  const awal = `Tes online ${jenis === 'kanji' ? 'Kanji' : 'Dokkai'} ${materiJudul} (kode ${kode})`;
  if (jenis === 'kanji') {
    const salah = hasil.detail.filter((d) => !d.bacaanOk || !d.artiOk);
    const daftar = salah.slice(0, 12).map((d) => `${d.kanji} ${d.bacaanBenar} (${d.artiBenar})`);
    return [
      awal,
      `Bacaan ${hasil.benarBacaan}/${hasil.total} · Arti ${hasil.benarArti}/${hasil.total}`,
      daftar.length ? `Perlu diulang: ${daftar.join('; ')}${salah.length > daftar.length ? `; +${salah.length - daftar.length} lagi` : ''}` : 'Semua benar',
    ].join(' · ');
  }
  const salah = hasil.detail.filter((d) => !d.ok);
  const daftar = salah.slice(0, 8).map((d) => `${tanpaFurigana(d.judul)}: ${d.tanyaId} → ${d.jawabanBenar}`);
  return [awal, `Benar ${hasil.benar}/${hasil.total}`, daftar.length ? `Perlu diulang: ${daftar.join('; ')}` : 'Semua benar'].join(' · ');
}

export function buatKodeTes(randomInt) {
  return Array.from({ length: PANJANG_KODE }, () => HURUF_KODE[randomInt(HURUF_KODE.length)]).join('');
}

export function normalisasiKodeTes(input) {
  return String(input || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * Validates what a sensei fills in to open a test code. jumlah = words (kanji) or passages (dokkai) per peserta;
 * null = all. sumber 'ai' = dokkai of one level whose passages an AI writes for this code (reviewed as a draft).
 * jlpt = the dokkai sentence-pattern level (N5, N4, N3); kanji tests are always N5.
 */
export function validateSesiTes(input, { tambahanDokkai = [] } = {}) {
  const kelasId = Number(input?.kelasId);
  const jenis = String(input?.jenis || '');
  const materi = String(input?.materi || '');
  const sumber = input?.sumber === 'ai' ? 'ai' : 'bank';
  const jlpt = input?.jlpt ?? 'N5';
  const tanggalUjian = String(input?.tanggalUjian || '').trim();
  const namaUjian = String(input?.namaUjian || '').trim().toUpperCase();
  const info = cariMateri(jenis, materi, tambahanDokkai);

  if (!Number.isInteger(kelasId) || kelasId <= 0 || !info) return { ok: false, code: 'INVALID_TES_ONLINE' };
  if (sumber === 'ai' && (jenis !== 'dokkai' || materi === 'SEMUA')) return { ok: false, code: 'INVALID_TES_ONLINE' };
  if (!JLPT_DOKKAI.includes(jlpt) || (jenis === 'kanji' && jlpt !== 'N5')) return { ok: false, code: 'INVALID_TES_ONLINE' };
  // A bank code draws from what exists at that pattern level: N4/N3 only once AI passages have been approved.
  const ukuranPool = jenis === 'dokkai' ? info.perJlpt[jlpt].jumlah : info.jumlah;
  // Kanji volumes the dokkai passages may use; all volumes (or a kanji test) = null.
  let kanjiVolume = null;
  if (jenis === 'dokkai' && Array.isArray(input?.kanjiVolume)) {
    kanjiVolume = VOLUME_KANJI.filter((v) => input.kanjiVolume.includes(v));
    if (!kanjiVolume.length || kanjiVolume.length !== new Set(input.kanjiVolume).size) {
      return { ok: false, code: 'INVALID_TES_ONLINE' };
    }
    if (kanjiVolume.length === VOLUME_KANJI.length) kanjiVolume = null;
  }
  if (sumber === 'bank' && ukuranPool === 0) return { ok: false, code: 'INVALID_TES_ONLINE' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggalUjian) || !namaUjian || namaUjian.length > 40) {
    return { ok: false, code: 'INVALID_TES_ONLINE' };
  }

  let jumlahSoal = null;
  if (input?.jumlahSoal !== null && input?.jumlahSoal !== undefined && String(input.jumlahSoal).trim() !== '') {
    jumlahSoal = Number(input.jumlahSoal);
    if (!Number.isInteger(jumlahSoal) || jumlahSoal < MIN_JUMLAH_SOAL) return { ok: false, code: 'INVALID_TES_ONLINE' };
    // An AI code's pool is written later, so its count stays as asked (capped by the pool when drawing).
    if (sumber === 'bank' && jumlahSoal >= ukuranPool) jumlahSoal = null;
  }

  let berlakuSampai = null;
  if (input?.berlakuSampai) {
    const t = new Date(input.berlakuSampai);
    if (Number.isNaN(t.getTime())) return { ok: false, code: 'INVALID_TES_ONLINE' };
    berlakuSampai = t.toISOString();
  }

  return {
    ok: true,
    normalized: { kelasId, jenis, materi, sumber, jlpt, kanjiVolume, jumlahSoal, tanggalUjian, namaUjian, berlakuSampai },
  };
}

/** Why a code cannot be used right now, or null when it can. */
export function alasanKodeTidakBerlaku(sesi, now = new Date()) {
  if (!sesi) return 'TES_KODE_TIDAK_DITEMUKAN';
  if (sesi.status === 'draf') return 'TES_KODE_BELUM_AKTIF';
  if (sesi.status !== 'aktif') return 'TES_KODE_DITUTUP';
  if (sesi.berlakuSampai && new Date(sesi.berlakuSampai) <= now) return 'TES_KODE_DITUTUP';
  return null;
}

// ---------------------------------------------------------------------------------------------------------------
// AI-written dokkai passages: what a model returns is only used when it passes these checks.

const KANJI = /[\u3400-\u9FFF\u3005\u3006\u30F6]/;
const KANA_SAJA = /^[\u3040-\u30FF]+$/;
const RANGKAIAN_BERFURIGANA = /([\u3400-\u9FFF\u3005\u3006\u30F6]+)\{([^{}]*)\}/g;

// Kanji groups a dokkai code can allow in its passages: the same groups as the kanji test (80 basic kanji and the
// kanji of each volume's words). The JLPT level of a dokkai code is about grammar only.
export const VOLUME_KANJI = ['DASAR', ...Object.keys(KANJI_VOLUME)];
const KANJI_PER_VOLUME = {
  DASAR: new Set(KANJI_DASAR.map(([k]) => k)),
  ...Object.fromEntries(
    Object.entries(KANJI_VOLUME).map(([vol, kata]) => [
      vol,
      new Set(kata.flatMap(([w]) => w.match(/[\u3400-\u9FFF\u3005]/g) || [])),
    ])
  ),
};

/** The kanji of a selection of volumes (default: all of them). */
export function kanjiDariVolume(volume = VOLUME_KANJI) {
  return new Set(volume.flatMap((v) => [...(KANJI_PER_VOLUME[v] || [])]));
}

/** Every kanji the peserta study. */
export const KANJI_DIPELAJARI = kanjiDariVolume();

/**
 * Every kanji run carries a kana reading right after it (漢字{かんじ}), and braces hold nothing else. A reading
 * shorter than its kanji run (毎朝六時{ろくじ}) means kanji before it went without furigana.
 */
export function furiganaLengkap(teks) {
  const sisa = String(teks).replace(RANGKAIAN_BERFURIGANA, (_, base, rt) =>
    KANA_SAJA.test(rt) && rt.length >= [...base].length ? '' : '{'
  );
  return !KANJI.test(sisa) && !/[{}]/.test(sisa);
}

/**
 * A kanji run with any kanji outside kanjiBoleh is written in its kana reading instead (寮{りょう} → りょう).
 * `ganti` collects what was replaced, so the explanation can follow the same text.
 */
export function sederhanakanKanji(teks, ganti = new Map(), kanjiBoleh = KANJI_DIPELAJARI) {
  return String(teks).replace(RANGKAIAN_BERFURIGANA, (utuh, base, rt) => {
    if ([...base].every((c) => kanjiBoleh.has(c))) return utuh;
    ganti.set(base, rt);
    return rt;
  });
}

function terapkanGanti(teks, ganti) {
  return [...ganti.keys()]
    .sort((a, b) => b.length - a.length)
    .reduce((t, base) => t.split(base).join(ganti.get(base)), teks);
}

/** A passage with only kanji from kanjiBoleh: title, text and questions in kana where needed, explanations too. */
export function sederhanakanBacaan(b, kanjiBoleh) {
  const ganti = new Map();
  const out = {
    ...b,
    judul: sederhanakanKanji(b.judul, ganti, kanjiBoleh),
    teks: sederhanakanKanji(b.teks, ganti, kanjiBoleh),
    soal: b.soal.map((x) => ({ ...x, tanya: sederhanakanKanji(x.tanya, ganti, kanjiBoleh) })),
  };
  if (!ganti.size) return b;
  out.soal = out.soal.map((x) => ({ ...x, pembahasan: terapkanGanti(x.pembahasan, ganti) }));
  return out;
}

const teksBersih = (v) => (typeof v === 'string' ? v.trim() : '');
// N4 and N3 passages may run longer than N5 ones.
const PANJANG_MAKS = { N5: 800, N4: 1200, N3: 1600 };

/**
 * Checks and normalises one passage written by the AI. Returns { ok: true, bacaan } with ids under `id`
 * (questions `${id}-1`, …) or { ok: false, alasan }. Kanji outside kanjiBoleh become kana, at every JLPT level.
 */
export function validasiBacaanAi(raw, id, { jlpt = 'N5', kanjiBoleh = KANJI_DIPELAJARI } = {}) {
  const judul = teksBersih(raw?.judul);
  const teks = teksBersih(raw?.teks);
  const terjemahan = teksBersih(raw?.terjemahan);
  if (!judul || judul.length > 60 || teks.length < 20 || teks.length > (PANJANG_MAKS[jlpt] || 800) || terjemahan.length < 10) {
    return { ok: false, alasan: 'panjang' };
  }
  if (!furiganaLengkap(judul) || !furiganaLengkap(teks)) return { ok: false, alasan: 'furigana' };

  const daftar = Array.isArray(raw?.soal) ? raw.soal : [];
  if (daftar.length < 2 || daftar.length > 3) return { ok: false, alasan: 'jumlah_soal' };
  const soal = [];
  for (const [i, s] of daftar.entries()) {
    const tanya = teksBersih(s?.tanya);
    const tanyaId = teksBersih(s?.tanyaId);
    const pembahasan = teksBersih(s?.pembahasan).replace(/\{[^{}]*\}/g, '');
    const opsi = Array.isArray(s?.opsi) ? s.opsi.map(teksBersih) : [];
    const benar = s?.benar;
    if (!tanya || !tanyaId || !pembahasan || !furiganaLengkap(tanya)) return { ok: false, alasan: 'soal' };
    if (opsi.length !== 3 || opsi.some((o) => !o) || new Set(opsi).size !== 3) return { ok: false, alasan: 'opsi' };
    if (!Number.isInteger(benar) || benar < 0 || benar > 2) return { ok: false, alasan: 'kunci' };
    soal.push({ id: `${id}-${i + 1}`, tanya, tanyaId, opsi, benar, pembahasan });
  }
  if (new Set(soal.map((x) => x.tanya)).size !== soal.length) return { ok: false, alasan: 'soal' };

  return { ok: true, bacaan: sederhanakanBacaan({ id, judul, teks, terjemahan, soal }, kanjiBoleh) };
}
