import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { portalRequest } from './portalApi.js';
import { latihanBerjalanDiPerangkat, onLatihanBerhenti } from './aktivitasLatihan.js';

const INTERVAL_TAMPIL_MS = 5_000;
const MUAT_ULANG_SAAT_KEMBALI_MS = 60_000;

const tanggalWib = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());

/**
 * The peserta's practice time today, the same figure as their row in Monitor Latihan ("1 hari"): flashcard, kanji
 * and dokkai sessions started today (WIB), tests included. Loaded from the server when the portal opens, when a
 * practice on this device stops, when the app comes back after a while, and after midnight WIB; in between, the
 * seconds of a practice running on this device are added as they are counted, so no polling is needed.
 */
export function useLatihanHariIni() {
  const server = ref({ tanggal: '', detikAktif: 0, perJenis: { flashcard: 0, kanji: 0, dokkai: 0 } });
  const sekarang = ref(Date.now());
  // Seconds of each running timer already in the server's figure (counted when that figure arrived).
  const dasar = new Map();
  let dimuatAt = 0;
  let urutan = 0;

  async function muat() {
    const nomor = ++urutan;
    try {
      const res = await portalRequest('/latihan/hari-ini', { diam: true });
      if (nomor !== urutan) return;
      dasar.clear();
      for (const p of latihanBerjalanDiPerangkat()) dasar.set(p, p.detikAktif());
      server.value = res;
      dimuatAt = Date.now();
    } catch {
      // keep the last figure; the next trigger tries again
    }
  }

  function onVisibility() {
    if (document.visibilityState === 'visible' && Date.now() - dimuatAt > MUAT_ULANG_SAAT_KEMBALI_MS) muat();
  }

  let tick = null;
  let lepas = null;
  onMounted(() => {
    muat();
    lepas = onLatihanBerhenti(muat);
    document.addEventListener('visibilitychange', onVisibility);
    tick = setInterval(() => {
      sekarang.value = Date.now();
      if (server.value.tanggal && server.value.tanggal !== tanggalWib()) muat();
    }, INTERVAL_TAMPIL_MS);
  });
  onBeforeUnmount(() => {
    clearInterval(tick);
    lepas?.();
    document.removeEventListener('visibilitychange', onVisibility);
  });

  /** { detikAktif, perJenis } now: the server's figure plus what running practice here counted since. */
  const hariIni = computed(() => {
    void sekarang.value;
    const perJenis = { flashcard: 0, kanji: 0, dokkai: 0, ...server.value.perJenis };
    let detikAktif = server.value.detikAktif;
    for (const p of latihanBerjalanDiPerangkat()) {
      const tambah = Math.max(0, p.detikAktif() - (dasar.get(p) ?? p.awal));
      detikAktif += tambah;
      if (p.jenis && perJenis[p.jenis] !== undefined) perJenis[p.jenis] += tambah;
    }
    return { detikAktif, perJenis };
  });

  return { hariIni };
}
