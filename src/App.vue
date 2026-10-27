<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDisplay, useLocale } from 'vuetify';
import { useAppStore } from './stores/appStore.js';
import PWAInstallButton from './components/PWAInstallButton.vue';
import PwaInstallPrompt from './components/PwaInstallPrompt.vue';

const route = useRoute();
const router = useRouter();
const { locale } = useI18n();
const display = useDisplay();
const vuetifyLocale = useLocale();
const appStore = useAppStore();

const isDesktop = computed(() => display.lgAndUp.value);
const drawerOpen = ref(true);
const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true);

watch(
  isDesktop,
  (desk) => {
    drawerOpen.value = desk;
  },
  { immediate: true }
);

const activeAllowedPages = computed(() =>
  appStore.allowedPages.filter((p) => Number(p.fase) <= 4)
);

const mainNavItems = computed(() =>
  activeAllowedPages.value.filter((p) => p.bar === 'main')
);

const configNavItems = computed(() =>
  activeAllowedPages.value.filter((p) => p.bar === 'config')
);

const currentPageTitle = computed(() => {
  const matched = appStore.allowedPages.find((p) => p.routePath === route.path);
  if (matched) {
    return locale.value === 'ja' ? matched.titleJa : matched.titleId;
  }
  return 'JOYdata';
});

function switchLang(next) {
  appStore.setLocale(next, { locale }, vuetifyLocale);
}

function handleLogout() {
  appStore.logout();
  router.replace('/login');
}

function updateOnline() {
  isOnline.value = navigator.onLine;
}

onMounted(() => {
  window.addEventListener('online', updateOnline);
  window.addEventListener('offline', updateOnline);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnline);
  window.removeEventListener('offline', updateOnline);
});
</script>

<template>
  <v-app class="bg-slate-50 text-slate-900">
    <!-- Offline Connectivity Banner (PWA Requirement) -->
    <div
      v-if="!isOnline"
      class="bg-amber-600 text-white text-xs font-medium px-4 py-2 text-center z-50"
      role="status"
    >
      {{ $t('app.offlineBanner') }}
    </div>

    <!-- Public Layout (Login) -->
    <template v-if="route.meta.public || !appStore.isAuthenticated">
      <router-view />
    </template>
