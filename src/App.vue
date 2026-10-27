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
    <!-- Public Layout (Login) -->
    <template v-if="route.meta.public || !appStore.isAuthenticated">
      <!-- Offline Connectivity Banner (PWA Requirement) -->
      <div
        v-if="!isOnline"
        class="bg-amber-600 text-white text-xs font-medium px-4 py-2 text-center"
        role="status"
      >
        {{ $t('app.offlineBanner') }}
      </div>

      <router-view />
    </template>

    <!-- Authenticated Layout -->
    <template v-else>
      <v-navigation-drawer
        v-model="drawerOpen"
        :permanent="isDesktop"
        :temporary="!isDesktop"
        width="272"
        class="border-r border-slate-200"
      >
        <div class="px-4 py-4 border-b border-slate-200">
          <div class="text-lg font-bold tracking-tight text-slate-900 font-display">
            {{ $t('app.brand') }}
          </div>
          <div class="text-[11px] text-slate-500 leading-tight mt-0.5">
            {{ $t('app.institution') }}
          </div>
        </div>

        <v-list nav density="comfortable" class="py-2">
          <v-list-subheader>{{ $t('app.mainNav') }}</v-list-subheader>
          <v-list-item
            v-for="item in mainNavItems"
            :key="item.kode"
            :to="item.routePath"
            :prepend-icon="item.icon"
            :title="locale === 'ja' ? item.titleJa : item.titleId"
            rounded="lg"
            class="mx-2"
          />

          <v-list-subheader class="mt-2">{{ $t('app.configNav') }}</v-list-subheader>
          <v-list-item
            v-for="item in configNavItems"
            :key="item.kode"
            :to="item.routePath"
            :prepend-icon="item.icon"
            :title="locale === 'ja' ? item.titleJa : item.titleId"
            rounded="lg"
            class="mx-2"
          />
        </v-list>

        <template #append>
          <div class="border-t border-slate-200 p-3">
            <div class="px-2 pb-2">
              <div class="text-sm font-semibold text-slate-900 truncate">
                {{ appStore.user?.nama }}
              </div>
              <div class="text-[11px] text-slate-500 truncate">
                {{ appStore.user?.username }} ·
                {{ locale === 'ja' ? appStore.user?.role?.roleNameJa : appStore.user?.role?.roleNameId }}
              </div>
            </div>

            <button
              type="button"
              class="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              @click="handleLogout"
            >
              <v-icon icon="mdi-logout" size="18" />
              <span>{{ $t('app.logout') }}</span>
            </button>
          </div>
        </template>
      </v-navigation-drawer>

      <v-app-bar flat density="comfortable" class="border-b border-slate-200 bg-white">
        <v-app-bar-nav-icon v-if="!isDesktop" @click="drawerOpen = !drawerOpen" />
        <div class="text-base font-semibold text-slate-900 font-display mx-2 truncate">
          {{ currentPageTitle }}
        </div>

        <v-spacer />

        <PWAInstallButton class="mr-3" />

        <div class="inline-flex items-center bg-slate-200/70 p-0.5 rounded-lg">
          <button
            type="button"
            class="px-2.5 py-1 text-xs font-medium rounded-md transition-colors"
            :class="locale === 'id' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            @click="switchLang('id')"
          >
            ID
          </button>
          <button
            type="button"
            class="px-2.5 py-1 text-xs font-medium rounded-md transition-colors"
            :class="locale === 'ja' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
            @click="switchLang('ja')"
          >
            日本語
          </button>
        </div>
      </v-app-bar>

      <v-main>
        <!-- Offline Connectivity Banner (PWA Requirement) -->
        <div
          v-if="!isOnline"
          class="bg-amber-600 text-white text-xs font-medium px-4 py-2 text-center"
          role="status"
        >
          {{ $t('app.offlineBanner') }}
        </div>

        <div class="pa-4 pa-md-6">
          <router-view />
        </div>
      </v-main>
    </template>

    <PwaInstallPrompt />

    <v-snackbar
      :model-value="appStore.toast.show"
      :color="appStore.toast.color"
      location="bottom right"
      @update:model-value="appStore.toast.show = $event"
    >
      {{ appStore.toast.message }}
      <template #actions>
        <v-btn variant="text" @click="appStore.toast.show = false">
          {{ $t('app.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>
