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

export function getInitialLocale() {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(LOCALE_STORAGE_KEY) : null;
  return saved === 'ja' ? 'ja' : 'id';
}

export const useAppStore = defineStore('app', () => {
  const user = ref(null);
  const initialized = ref(false);
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

  function setLocale(nextLocale, i18nObj, vuetifyLocaleObj) {
    const clean = nextLocale === 'ja' ? 'ja' : 'id';
    locale.value = clean;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, clean);
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
    } catch {
      clearStoredTokens();
      user.value = null;
    } finally {
      initialized.value = true;
    }
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
    refreshSessionProfile,
    logout,
  };
});
