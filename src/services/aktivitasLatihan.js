import { onBeforeUnmount } from 'vue';

// How often a running practice tells the server it is still going (the monitor counts it as running for a minute).
const INTERVAL_DETAK_MS = 15_000;
// No touch, click, key or scroll for this long: the time no longer counts as active practice.
const DIAM_MS = 90_000;
const INTERAKSI = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'];

// Practice timers running on this device ({ jenis, awal, detikAktif() }), so the portal app bar can show today's
// practice time going up between signals. When one stops, the listeners hear it once its last signal is answered
// (they reload the server's figure) and only then does it leave the list, so the shown time never dips.
const berjalanDiPerangkat = new Set();
const pendengarBerhenti = new Set();

export function latihanBerjalanDiPerangkat() {
  return [...berjalanDiPerangkat];
}

export function onLatihanBerhenti(fn) {
  pendengarBerhenti.add(fn);
  return () => pendengarBerhenti.delete(fn);
}

/**
 * Active practice time and the signal to the server while a practice, test or flashcard deck runs.
 * kirim({ detikAktif, selesai, keepalive }) sends one signal; it is called every 15 s, when the app goes to the
 * background, and once with selesai when the practice stops (or the page is left).
 * Active = the page visible and used in the last 90 s, so an app left open does not count as practice.
 */
export function useDetakAktivitas(kirim) {
  let berjalan = false;
  let detik = 0;
  let interaksiTerakhir = 0;
  let tickAt = 0;
  let tick = null;
  let detak = null;
  let pelacak = null;

  const terlihat = () => typeof document === 'undefined' || document.visibilityState === 'visible';

  function hitung() {
    const now = Date.now();
    const lewat = Math.min(5000, Math.max(0, now - tickAt));
    tickAt = now;
    if (berjalan && terlihat() && now - interaksiTerakhir < DIAM_MS) detik += lewat / 1000;
  }

  function catatInteraksi() {
    interaksiTerakhir = Date.now();
  }

  function kirimSekarang({ selesai = false, keepalive = false } = {}) {
    hitung();
    return Promise.resolve(kirim({ detikAktif: Math.floor(detik), selesai, keepalive })).catch(() => {});
  }

  function onVisibility() {
    hitung();
    if (!terlihat()) kirimSekarang({ keepalive: true });
    else catatInteraksi();
  }

  // The tab or app closed: the last time and progress still reach the server.
  function onPageHide() {
    kirimSekarang({ keepalive: true });
  }

  function pasang(on) {
    const fn = on ? 'addEventListener' : 'removeEventListener';
    for (const e of INTERAKSI) window[fn](e, catatInteraksi, { passive: true, capture: true });
    document[fn]('visibilitychange', onVisibility);
    window[fn]('pagehide', onPageHide);
  }

  /**
   * Starts counting; awal = active seconds already counted (a test continued later); jenis = flashcard, kanji or
   * dokkai (for the breakdown of today's practice in the portal app bar).
   */
  function mulai(awal = 0, jenis = null) {
    if (berjalan) berhenti({ kirimAkhir: false });
    berjalan = true;
    detik = Number(awal) || 0;
    pelacak = { jenis, awal: detik, detikAktif };
    berjalanDiPerangkat.add(pelacak);
    tickAt = Date.now();
    catatInteraksi();
    pasang(true);
    tick = setInterval(hitung, 1000);
    detak = setInterval(() => kirimSekarang(), INTERVAL_DETAK_MS);
  }

  /** Stops counting; kirimAkhir sends the closing signal (selesai = the session ends on the server). */
  function berhenti({ kirimAkhir = true, selesai = true, keepalive = false } = {}) {
    if (!berjalan) return Promise.resolve();
    hitung();
    berjalan = false;
    clearInterval(tick);
    clearInterval(detak);
    pasang(false);
    const selesaiPelacak = pelacak;
    pelacak = null;
    // A restart of this timer must not change what the stopped one shows until it leaves the list.
    const beku = Math.floor(detik);
    selesaiPelacak.detikAktif = () => beku;
    const akhir = kirimAkhir ? kirimSekarang({ selesai, keepalive }) : Promise.resolve();
    akhir
      .then(() => Promise.allSettled([...pendengarBerhenti].map((fn) => fn())))
      .finally(() => berjalanDiPerangkat.delete(selesaiPelacak));
    return akhir;
  }

  function detikAktif() {
    hitung();
    return Math.floor(detik);
  }

  // Leaving the page (another menu, logging out) closes the session; keepalive lets the request finish.
  onBeforeUnmount(() => berhenti({ keepalive: true }));

  return { mulai, berhenti, detikAktif, kirimSekarang, sedangBerjalan: () => berjalan };
}
