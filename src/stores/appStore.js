import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  apiRequest,
  getStoredTokens,
  setStoredTokens,
  clearStoredTokens,
} from '../services/api.js';

const LOCALE_STORAGE_KEY = 'joydata_locale';

// Institution settings (Pengaturan) used for display thresholds; the server applies the same values.
const DEFAULT_SETTINGS = {
  kkm_ujian: 70,
  kkm_sikap: 70,
  batas_grade: { A: 90, B: 75, C: 60 },
  sikap_basis: 75,
  ambang_kehadiran_rendah: 75,
};

function readSavedLocale() {
  try {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(LOCALE_STORAGE_KEY) : null;
    return saved === 'ja' || saved === 'id' ? saved : null;
  } catch {
    return null;
  }
}

/** True once someone picked a language on this device with the ID / 日本語 switch. */
export function hasSavedLocale() {
  return readSavedLocale() !== null;
}

// Without a choice of their own, a browser set to Japanese starts in 日本語. Japanese staff otherwise read the
// Indonesian UI through the browser's translator, which turns romaji such as "Mensetsu" into wrong kanji (面雪).
export function getInitialLocale() {
  const saved = readSavedLocale();
  if (saved) return saved;
  const langs = typeof navigator !== 'undefined' ? [...(navigator.languages || []), navigator.language] : [];
  return langs.some((l) => /^ja\b/i.test(String(l || ''))) ? 'ja' : 'id';
}

export const useAppStore = defineStore('app', () => {
  const user = ref(null);
  const initialized = ref(false);
  // The last session check failed on the network or server (tokens kept): LoginView offers to try again.
  const restoreFailed = ref(false);
  const settings = ref({ ...DEFAULT_SETTINGS });
  const locale = ref(getInitialLocale());
  const toast = ref({
    show: false,
    message: '',
    color: 'success',
  });

  const isAuthenticated = computed(() => Boolean(user.value));
  const isAdmin = computed(() => user.value?.role?.kode === 'admin');
  const allowedPages = computed(() => user.value?.allowedPages || []);
  const allowedPageKodes = computed(() => new Set(allowedPages.value.map((p) => p.kode)));

  function canAccess(pageKode) {
    if (!pageKode) return true;
    return allowedPageKodes.value.has(pageKode);
  }

  function firstAllowedRoute() {
    const activePhasePages = allowedPages.value.filter((p) => Number(p.fase) <= 4);
    if (activePhasePages.length > 0) {
      return activePhasePages[0].routePath;
    }
    if (allowedPages.value.length > 0) {
      return allowedPages.value[0].routePath;
    }
    return '/no-access';
  }

  // simpan = false switches without remembering it, for the automatic choice (the ID / 日本語 switch saves).
  function setLocale(nextLocale, i18nObj, vuetifyLocaleObj, { simpan = true } = {}) {
    const clean = nextLocale === 'ja' ? 'ja' : 'id';
    locale.value = clean;
    if (simpan) {
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, clean);
      } catch {
        // private mode / blocked storage: the language still applies to this visit
      }
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = clean;
    }
    if (i18nObj?.locale) {
      i18nObj.locale.value = clean;
    }
    if (vuetifyLocaleObj?.current) {
      vuetifyLocaleObj.current.value = clean;
    }
  }

  function notify(message, color = 'success') {
    toast.value = {
      show: true,
      message,
      color,
    };
  }

  async function login(username, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    setStoredTokens(data.accessToken, data.refreshToken);
    user.value = data.user;
    initialized.value = true;
    restoreFailed.value = false;
    await loadSettings();
    return data.user;
  }

  function setSettings(next) {
    settings.value = { ...DEFAULT_SETTINGS, ...(next || {}) };
  }

  async function loadSettings() {
    try {
      setSettings(await apiRequest('/settings'));
    } catch {
      // keep the current values; pages still render with defaults
    }
  }

  function gradeLabel(score) {
    if (score === null || score === undefined || Number.isNaN(Number(score))) return '-';
    const n = Number(score);
    const batas = settings.value.batas_grade || DEFAULT_SETTINGS.batas_grade;
    if (n >= batas.A) return 'A';
    if (n >= batas.B) return 'B';
    if (n >= batas.C) return 'C';
    return 'D';
  }

  async function restoreSession() {
    if (initialized.value) return user.value;
    const { accessToken, refreshToken } = getStoredTokens();
    if (!accessToken && !refreshToken) {
      initialized.value = true;
      user.value = null;
      return null;
    }
    try {
      const data = await apiRequest('/auth/me');
      user.value = data.user;
      await loadSettings();
      initialized.value = true;
    } catch (err) {
      user.value = null;
      if (err.code === 'SESSION_EXPIRED') {
        // api.js already cleared the tokens and told the user the session ended.
        initialized.value = true;
        restoreFailed.value = false;
      } else {
        // Offline or the server is down: keep the tokens and check again on the next navigation or reload,
        // instead of signing the user out over a connection problem.
        restoreFailed.value = true;
      }
    }
    if (user.value) restoreFailed.value = false;
    return user.value;
  }

  async function refreshSessionProfile() {
    try {
      const data = await apiRequest('/auth/me');
      user.value = data.user;
      return data.user;
    } catch {
      return user.value;
    }
  }

  function logout() {
    clearStoredTokens();
    user.value = null;
    initialized.value = true;
    restoreFailed.value = false;
  }

  /** The server rejected the session (api.js has cleared the tokens). */
  function sessionExpired() {
    user.value = null;
    initialized.value = true;
    restoreFailed.value = false;
  }

  return {
    user,
    initialized,
    settings,
    setSettings,
    loadSettings,
    gradeLabel,
    locale,
    toast,
    isAuthenticated,
    isAdmin,
    allowedPages,
    allowedPageKodes,
    canAccess,
    firstAllowedRoute,
    setLocale,
    notify,
    login,
    restoreSession,
    restoreFailed,
    refreshSessionProfile,
    logout,
    sessionExpired,
  };
});
