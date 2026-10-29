<template>
  <div v-if="loading && !ready" class="min-h-screen flex items-center justify-center bg-slate-50" role="status" :aria-label="$t('app.loading')">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <div v-else-if="loadError && !ready" class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="joy-surface p-6 text-center space-y-3 max-w-sm w-full">
      <p class="text-sm text-slate-700">{{ $t('portal.gagalMuat') }}</p>
      <v-btn variant="tonal" color="primary" class="text-none" @click="reload">{{ $t('common.cobaLagi') }}</v-btn>
    </div>
  </div>

  <!-- First login: the birth-date password must be replaced before anything else is shown -->
  <div v-else-if="peserta?.wajibGantiSandi" class="min-h-screen bg-slate-50 px-4 py-10">
    <div class="max-w-md mx-auto">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-base font-bold text-slate-900 font-display leading-tight">JOYdata</p>
          <p class="text-[11px] text-slate-500 leading-tight">{{ $t('portal.title') }}</p>
        </div>
        <LangToggle />
      </div>
      <section class="joy-surface p-6">
        <h1 class="text-lg font-bold text-slate-900 font-display">{{ $t('portal.gantiSandiTitle') }}</h1>
        <p class="text-sm text-slate-600 mt-1 mb-4">{{ $t('portal.gantiSandiDesc') }}</p>
        <PortalPasswordForm @saved="onFirstPasswordSaved" />
      </section>
      <button type="button" class="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-800" @click="logout">
        {{ $t('portal.keluar') }}
      </button>
    </div>
  </div>

  <template v-else-if="ready">
    <v-navigation-drawer
      v-model="drawerOpen"
      :permanent="isDesktop"
      :temporary="!isDesktop"
      width="256"
      class="border-r border-slate-200 no-print"
    >
      <div class="px-4 py-4 border-b border-slate-200">
        <div class="text-lg font-bold tracking-tight text-slate-900 font-display">JOYdata</div>
        <div class="text-[11px] text-slate-500 leading-tight mt-0.5">{{ $t('portal.title') }}</div>
      </div>

      <div class="px-4 py-3 border-b border-slate-200">
        <p class="text-sm font-semibold text-slate-900 truncate">{{ report?.peserta.nama }}</p>
        <p class="text-[11px] text-slate-500 truncate">
          {{ [report?.kelas?.namaKelas, locale === 'ja' ? report?.kelas?.programNamaJa : report?.kelas?.programNama].filter(Boolean).join(' · ') }}
        </p>
      </div>

      <v-list nav density="comfortable" class="py-2">
        <template v-for="group in NAV" :key="group.key">
          <v-list-subheader>{{ $t(`portal.menuGroup.${group.key}`) }}</v-list-subheader>
          <v-list-item
            v-for="item in group.items"
            :key="item.key"
            :to="item.to"
            :exact="item.to === '/portal'"
            :prepend-icon="item.icon"
            :title="$t(`portal.menu.${item.key}`)"
            rounded="lg"
            class="mx-2"
          >
            <template v-if="item.key === 'kaiwa' && kaiwaBadge" #append>
              <span
                class="text-[11px] font-semibold tabular-nums rounded-full px-1.5 py-0.5"
                :class="kaiwaBadge.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
              >
                {{ kaiwaBadge.text }}
              </span>
            </template>
          </v-list-item>
        </template>
      </v-list>

      <template #append>
        <div class="border-t border-slate-200 p-3">
          <button
            type="button"
            class="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            @click="logout"
          >
            <v-icon icon="mdi-logout" size="18" />
            <span>{{ $t('portal.keluar') }}</span>
          </button>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar flat density="comfortable" class="border-b border-slate-200 bg-white no-print">
      <v-app-bar-nav-icon v-if="!isDesktop" :aria-label="$t('portal.bukaMenu')" @click="drawerOpen = !drawerOpen" />
      <div class="text-base font-semibold text-slate-900 font-display mx-2 truncate">{{ pageTitle }}</div>
      <v-spacer />
      <LangToggle class="mr-2" />
      <v-menu location="bottom end">
        <template #activator="{ props: menuProps }">
          <v-btn v-bind="menuProps" icon="mdi-account-circle-outline" variant="text" size="small" class="mr-1" :aria-label="peserta?.nama" />
        </template>
        <v-list density="compact" min-width="220">
          <v-list-item :title="peserta?.nama" :subtitle="peserta?.email" />
          <v-divider />
          <v-list-item prepend-icon="mdi-account-circle-outline" :title="$t('portal.menu.profil')" to="/portal/profil" />
          <v-list-item prepend-icon="mdi-logout" :title="$t('portal.keluar')" @click="logout" />
        </v-list>
      </v-menu>
      <v-progress-linear :active="pendingRequests > 0" indeterminate absolute location="bottom" color="primary" height="2" />
    </v-app-bar>

    <v-main class="bg-slate-50">
      <div class="max-w-4xl mx-auto px-4 py-5 min-[960px]:px-6 print:p-0 print:max-w-none">
        <router-view />
      </div>
    </v-main>
  </template>
</template>

<script setup>
import { ref, computed, watch, onMounted, defineComponent, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDisplay, useLocale } from 'vuetify';
import { useAppStore } from '../../stores/appStore.js';
import { pendingRequests } from '../../services/loadingState.js';
import { usePortalSession, loadPortalSession, setPortalPeserta, clearPortalSession } from '../../services/portalSession.js';
import PortalPasswordForm from '../../components/portal/PortalPasswordForm.vue';

const NAV = [
  {
    key: 'belajar',
    items: [
      { key: 'beranda', to: '/portal', icon: 'mdi-home-outline' },
      { key: 'kaiwa', to: '/portal/kaiwa', icon: 'mdi-card-account-details-star-outline' },
      { key: 'mensetsu', to: '/portal/mensetsu', icon: 'mdi-account-tie-voice' },
      { key: 'ujian', to: '/portal/ujian', icon: 'mdi-clipboard-text-outline' },
      { key: 'kehadiran', to: '/portal/kehadiran', icon: 'mdi-calendar-check-outline' },
      { key: 'sikap', to: '/portal/sikap', icon: 'mdi-scale-balance' },
    ],
  },
  {
    key: 'dokumen',
    items: [
      { key: 'rapor', to: '/portal/rapor', icon: 'mdi-file-certificate-outline' },
      { key: 'smartReport', to: '/portal/smart-report', icon: 'mdi-file-chart-outline' },
    ],
  },
  {
    key: 'akun',
    items: [{ key: 'profil', to: '/portal/profil', icon: 'mdi-account-circle-outline' }],
  },
];

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const display = useDisplay();
const vuetifyLocale = useLocale();
const appStore = useAppStore();
const { peserta, report, loading, loadError } = usePortalSession();

const LangToggle = defineComponent({
  name: 'PortalLangToggle',
  setup() {
    return () =>
      h(
        'div',
        { class: 'inline-flex items-center bg-slate-200/70 p-0.5 rounded-lg' },
        ['id', 'ja'].map((lang) =>
          h(
            'button',
            {
              type: 'button',
              class: [
                'px-2 py-1 text-xs font-medium rounded-md transition-colors',
                locale.value === lang ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900',
              ],
              onClick: () => appStore.setLocale(lang, { locale }, vuetifyLocale),
            },
            lang === 'id' ? 'ID' : '日本語'
          )
        )
      );
  },
});

const isDesktop = computed(() => display.lgAndUp.value);
const drawerOpen = ref(true);
watch(isDesktop, (desk) => (drawerOpen.value = desk), { immediate: true });
// On a phone the drawer closes after picking a page.
watch(() => route.fullPath, () => {
  if (!isDesktop.value) drawerOpen.value = false;
});

const ready = computed(() => Boolean(report.value));
const pageTitle = computed(() => t(route.meta.portalTitle || 'portal.title'));

const kaiwaBadge = computed(() => {
  const card = report.value?.kaiwaCard;
  if (!card) return null;
  return { ok: card.tercapai, text: card.tercapai ? '✓' : `${card.jumlah}/${card.target}` };
});

async function load(force = false) {
  try {
    await loadPortalSession({ force });
  } catch (err) {
    if (err.status === 401) router.replace('/portal/login');
  }
}

function reload() {
  load(true);
}

function onFirstPasswordSaved(session) {
  setPortalPeserta(session);
  appStore.notify(t('portal.sandiTersimpan'), 'success');
  load(true);
}

function logout() {
  clearPortalSession();
  router.replace('/portal/login');
}

onMounted(() => load());
</script>
