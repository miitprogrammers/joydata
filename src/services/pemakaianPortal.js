import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { portalRequest } from './portalApi.js';
import { useDetakAktivitas } from './aktivitasLatihan.js';

const INTERVAL_LAPOR_MS = 60_000;
const INTERVAL_TAMPIL_MS = 10_000;

const tanggalJakarta = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());

/**
 * The peserta's active time in the portal today, for the portal app bar. Counted the same way as practice time
 * (page visible and used in the last 90 s) on every portal page, and reported to the server once a minute, when
 * the app goes to the background and when it closes; only the seconds since the last report are sent.
 * detikHariIni = the server's total for today plus what this device has not reported yet.
 */
export function usePemakaianPortal() {
  const detikServer = ref(0);
  const tanggalServer = ref('');
  const sekarang = ref(0); // re-evaluates detikHariIni between reports
  let terkirim = 0; // active seconds of this page load the server has added
  let dalamPerjalanan = 0; // seconds in reports that have not answered yet

  async function lapor({ detikAktif, keepalive }) {
    const detik = Math.max(0, detikAktif - terkirim - dalamPerjalanan);
    // Nothing new to add and today's total already known: no request (an idle portal stays quiet).
    if (!detik && tanggalServer.value === tanggalJakarta()) return;
    dalamPerjalanan += detik;
    try {
      const res = await portalRequest('/pemakaian', { method: 'POST', body: { detik }, diam: true, keepalive });
      terkirim += detik;
      detikServer.value = res.detik;
      tanggalServer.value = res.tanggal;
    } finally {
      dalamPerjalanan -= detik;
    }
  }

  const detak = useDetakAktivitas(lapor, { intervalMs: INTERVAL_LAPOR_MS });
  let tampil = null;

  onMounted(() => {
    detak.mulai();
    detak.kirimSekarang(); // today's total so far (from this and other devices)
    tampil = setInterval(() => {
      sekarang.value = Date.now();
    }, INTERVAL_TAMPIL_MS);
  });
  onBeforeUnmount(() => clearInterval(tampil));

  const detikHariIni = computed(() => {
    void sekarang.value;
    const belumTerkirim = Math.max(0, detak.detikAktif() - terkirim);
    // Past midnight the server's total is yesterday's until the next report answers.
    const dasar = tanggalServer.value === tanggalJakarta() ? detikServer.value : 0;
    return dasar + belumTerkirim;
  });

  return { detikHariIni };
}
