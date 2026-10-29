import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { portalRequest, getPortalToken, setPortalToken } from './portalApi.js';

// One peserta session and dashboard report, shared by the portal layout and every portal page.
const peserta = ref(null);
const report = ref(null);
const loading = ref(false);
const loadError = ref(false);
let pending = null;
// The token the data above was loaded with: a different one (another peserta logging in on this device) reloads.
let loadedWith = '';

async function fetchSession() {
  loadedWith = getPortalToken();
  loading.value = true;
  loadError.value = false;
  try {
    peserta.value = (await portalRequest('/auth/me')).peserta;
    report.value = peserta.value.wajibGantiSandi ? null : await portalRequest('/dashboard');
  } catch (err) {
    if (err.status === 401) {
      clearPortalSession();
      throw err;
    }
    loadError.value = true;
  } finally {
    loading.value = false;
  }
}

/** Loads the session and report once; force = reload (after a password change, or "try again"). */
export function loadPortalSession({ force = false } = {}) {
  const loaded = report.value || peserta.value?.wajibGantiSandi;
  if (!force && loaded && loadedWith === getPortalToken()) return Promise.resolve();
  if (loadedWith !== getPortalToken()) {
    peserta.value = null;
    report.value = null;
  }
  pending ||= fetchSession().finally(() => {
    pending = null;
  });
  return pending;
}

/** After a password change: the new session, and the rotated token it came with. */
export function setPortalPeserta(session) {
  peserta.value = session;
  loadedWith = getPortalToken();
}

export function clearPortalSession() {
  setPortalToken('');
  peserta.value = null;
  report.value = null;
  loadedWith = '';
}

/** For pages with their own requests: an expired session goes back to the login page. */
export function isPortalSessionExpired(err, router) {
  if (err?.status !== 401) return false;
  clearPortalSession();
  router.replace('/portal/login');
  return true;
}

export function usePortalSession() {
  return { peserta, report, loading, loadError };
}

/** Number and date formatting in the portal's current language. */
export function usePortalFormat() {
  const { locale } = useI18n();
  const intlLocale = computed(() => (locale.value === 'ja' ? 'ja-JP' : 'id-ID'));

  function num(v, digits = 1) {
    if (v === null || v === undefined || !Number.isFinite(Number(v))) return '-';
    return new Intl.NumberFormat(intlLocale.value, { maximumFractionDigits: digits }).format(Number(v));
  }

  function toDate(iso) {
    const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function tanggal(iso, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
    if (!iso) return '-';
    return new Intl.DateTimeFormat(intlLocale.value, options).format(toDate(iso));
  }

  function bulan(periode) {
    const [y, m] = periode.split('-').map(Number);
    return new Intl.DateTimeFormat(intlLocale.value, { month: 'long', year: 'numeric' }).format(new Date(y, m - 1, 1));
  }

  /** "26 Okt – 1 Nov 2026" */
  function rentangMinggu(mulai, selesai) {
    const short = { day: 'numeric', month: 'short' };
    return `${tanggal(mulai, short)} – ${tanggal(selesai, { ...short, year: 'numeric' })}`;
  }

  function hari(iso) {
    return tanggal(iso, { weekday: 'short' });
  }

  return { intlLocale, num, tanggal, bulan, rentangMinggu, hari, toDate };
}
