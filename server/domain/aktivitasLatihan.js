/**
 * Practice activity of peserta (flashcard, latihan kanji / dokkai, tes with a code). Pure rules for the live
 * monitor and the practice history.
 *
 * Every session is one row. While it runs, the app sends a signal about every 15 seconds with the active seconds
 * (screen on and used, see the portal composable) and the progress; the monitor shows a session as running while
 * its last signal is under DETIK_AKTIF old.
 */

export const JENIS_AKTIVITAS = ['flashcard', 'kanji', 'dokkai'];
export const MODE_AKTIVITAS = ['latihan', 'resmi'];
export const DETIK_AKTIF = 60;

const angka = (v) => (v === null || v === undefined || v === '' || !Number.isFinite(Number(v)) ? null : Math.floor(Number(v)));

/** Running now: not closed and a signal in the last DETIK_AKTIF seconds. */
export function sedangAktif(sesi, now = new Date()) {
  return !sesi.selesaiAt && now.getTime() - new Date(sesi.terakhirAt).getTime() <= DETIK_AKTIF * 1000;
}

/**
 * A signal from the app applied to a session. Active seconds and progress only go forward and never beyond the
 * time since the session started (a few seconds of slack for clocks) or the items of the paper. Flashcard progress
 * counts swipes, which may go round the deck several times: at most four per second.
 */
export function terapkanDetak(sesi, input, now = new Date()) {
  const lewat = Math.max(0, Math.floor((now.getTime() - new Date(sesi.mulaiAt).getTime()) / 1000)) + 5;
  const detik = angka(input?.detikAktif);
  const item = angka(input?.itemSelesai);
  const posisi = angka(input?.posisi);
  const batasItem = sesi.jenis === 'flashcard' ? lewat * 4 : sesi.jumlahItem;
  return {
    detikAktif: Math.max(sesi.detikAktif, Math.min(detik ?? sesi.detikAktif, lewat)),
    itemSelesai: Math.max(sesi.itemSelesai, Math.min(item ?? sesi.itemSelesai, batasItem)),
    posisi: posisi !== null && posisi >= 1 ? Math.min(posisi, sesi.jumlahItem || posisi) : sesi.posisi,
    terakhirAt: now.toISOString(),
  };
}

/**
 * berjalan = running now; selesai = paper handed in (it has a score) or a flashcard deck put away; berhenti = a paper
 * left before the end.
 */
export function statusSesi(sesi, now = new Date()) {
  if (sedangAktif(sesi, now)) return 'berjalan';
  if (sesi.skor !== null && sesi.skor !== undefined) return 'selesai';
  return sesi.jenis === 'flashcard' ? 'selesai' : 'berhenti';
}

export const tanggalWib = (iso) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date(iso));

/** Start of a period of the last n days in WIB (today included), as an ISO time; null n = all time. */
export function awalPeriode(hari, now = new Date()) {
  if (!hari) return null;
  const [y, m, d] = tanggalWib(now).split('-').map(Number);
  // 00:00 WIB = 17:00 UTC the day before.
  return new Date(Date.UTC(y, m - 1, d - (hari - 1)) - 7 * 3600 * 1000).toISOString();
}

/** Periods of the history tab: '1' = one chosen WIB day, '7' / '30' = the last n days, 'semua' = all time. */
export const PERIODE_LATIHAN = { 1: 1, 7: 7, 30: 30, semua: null };

/** 00:00 WIB of a YYYY-MM-DD date (plus n days), as an ISO time. */
function awalHariWib(tanggal, tambahHari = 0) {
  const [y, m, d] = tanggal.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + tambahHari) - 7 * 3600 * 1000).toISOString();
}

/**
 * The time range of a history query: { periode, tanggal, dari, sampai } with sampai exclusive (null = up to now).
 * Period '1' covers the WIB day `tanggal`; a missing, invalid or future date means today. Unknown periods = 7 days.
 */
export function rentangPeriode({ periode, tanggal } = {}, now = new Date()) {
  const p = Object.hasOwn(PERIODE_LATIHAN, String(periode)) ? String(periode) : '7';
  if (p !== '1') return { periode: p, tanggal: null, dari: awalPeriode(PERIODE_LATIHAN[p], now), sampai: null };
  const hariIni = tanggalWib(now);
  // A date that does not exist (2026-02-30) rolls over in Date.UTC, so it no longer reads back the same.
  const sah = typeof tanggal === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(tanggal) && tanggalWib(awalHariWib(tanggal)) === tanggal;
  const hari = sah && tanggal <= hariIni ? tanggal : hariIni;
  return { periode: p, tanggal: hari, dari: awalHariWib(hari), sampai: awalHariWib(hari, 1) };
}

function kosong() {
  return {
    detikAktif: 0,
    hari: new Set(),
    jumlahSesi: 0,
    kartu: 0,
    soal: 0,
    tesResmi: 0,
    skorLatihan: [],
    perJenis: { flashcard: 0, kanji: 0, dokkai: 0 },
    terakhirAt: null,
  };
}

/**
 * Practice per peserta, most diligent first: total active time, then days with practice, then sessions. pesertaIds
 * = everyone who should be listed even without practice (the roster); sessions of others count too.
 * dari / sampai = only sessions started from dari and before sampai (ISO times; null = no bound).
 */
export function statistikLatihan(sesiList, pesertaIds = [], { dari = null, sampai = null } = {}) {
  const per = new Map(pesertaIds.map((id) => [Number(id), kosong()]));
  const batas = dari ? new Date(dari).getTime() : null;
  const akhir = sampai ? new Date(sampai).getTime() : null;
  for (const s of sesiList) {
    const mulai = new Date(s.mulaiAt).getTime();
    if ((batas !== null && mulai < batas) || (akhir !== null && mulai >= akhir)) continue;
    const id = Number(s.pesertaId);
    if (!per.has(id)) per.set(id, kosong());
    const p = per.get(id);
    p.jumlahSesi += 1;
    p.detikAktif += s.detikAktif;
    if (p.perJenis[s.jenis] !== undefined) p.perJenis[s.jenis] += s.detikAktif;
    if (s.detikAktif > 0) p.hari.add(tanggalWib(s.mulaiAt));
    if (s.jenis === 'flashcard') p.kartu += s.itemSelesai;
    else p.soal += s.itemSelesai;
    if (s.mode === 'resmi' && s.skor !== null && s.skor !== undefined) p.tesResmi += 1;
    if (s.mode === 'latihan' && s.skor !== null && s.skor !== undefined) p.skorLatihan.push(Number(s.skor));
    if (!p.terakhirAt || s.terakhirAt > p.terakhirAt) p.terakhirAt = s.terakhirAt;
  }
  return [...per.entries()]
    .map(([pesertaId, p]) => ({
      pesertaId,
      detikAktif: p.detikAktif,
      hariAktif: p.hari.size,
      jumlahSesi: p.jumlahSesi,
      kartu: p.kartu,
      soal: p.soal,
      tesResmi: p.tesResmi,
      rataSkorLatihan: p.skorLatihan.length
        ? Math.round((p.skorLatihan.reduce((n, x) => n + x, 0) / p.skorLatihan.length) * 100) / 100
        : null,
      perJenis: p.perJenis,
      terakhirAt: p.terakhirAt,
    }))
    .sort((a, b) => b.detikAktif - a.detikAktif || b.hariAktif - a.hariAktif || b.jumlahSesi - a.jumlahSesi || a.pesertaId - b.pesertaId);
}
