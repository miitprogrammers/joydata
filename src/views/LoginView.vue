<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-between px-4 py-6">
    <!-- Top minimal bar: single brand mark + language toggle & PWA install -->
    <header class="max-w-5xl w-full mx-auto flex items-center justify-between gap-6">
      <span class="text-lg font-bold tracking-tight text-slate-900 font-display whitespace-nowrap">
        JOYdata
      </span>
      <div class="flex items-center gap-2">
        <PWAInstallButton />
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
      </div>
    </header>

    <main class="w-full max-w-md mx-auto my-auto py-8">
      <div class="joy-surface p-7 sm:p-8">
        <div class="mb-6">
          <p class="text-xs font-medium text-slate-500 mb-1">
            {{ $t('app.institution') }}
          </p>
          <h1 class="text-2xl font-bold text-slate-900 font-display">
            {{ $t('login.title') }}
          </h1>
          <p class="text-sm text-slate-600 mt-1">
            {{ $t('login.subtitle') }}
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="onSubmit">
          <v-text-field
            v-model="username"
            :label="$t('login.username')"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            density="comfortable"
            autocomplete="username"
            hide-details="auto"
            required
          />

          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :label="$t('login.password')"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            variant="outlined"
            density="comfortable"
            autocomplete="current-password"
            hide-details="auto"
            required
            @click:append-inner="showPassword = !showPassword"
          />

          <p v-if="errorMsg" class="text-xs font-medium text-red-700" role="alert">
            {{ errorMsg }}
          </p>

          <v-btn
            type="submit"
            color="primary"
            size="large"
            block
            variant="flat"
            class="text-none font-semibold mt-2"
            :loading="submitting"
          >
            {{ $t('login.submit') }}
          </v-btn>
        </form>

        <div class="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
          {{ $t('login.demoHint') }}
        </div>
      </div>
    </main>

    <footer class="max-w-5xl w-full mx-auto text-center text-xs text-slate-400">
      JOYdata · LPK Mizuno Semangat Bangsa
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLocale } from 'vuetify';
import { useAppStore } from '../stores/appStore.js';
import PWAInstallButton from '../components/PWAInstallButton.vue';

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();
const vuetifyLocale = useLocale();
const appStore = useAppStore();

const username = ref('admin');
const password = ref('admin123');
const showPassword = ref(false);
const submitting = ref(false);
const errorMsg = ref('');

function switchLang(next) {
  appStore.setLocale(next, { locale }, vuetifyLocale);
}

async function onSubmit() {
  errorMsg.value = '';
  submitting.value = true;
  try {
    await appStore.login(username.value, password.value);
    router.replace(appStore.firstAllowedRoute());
  } catch (err) {
    errorMsg.value = t(`messages.${err.code}`) || t('messages.INVALID_CREDENTIALS');
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  if (route.query.autostart === '1' && !appStore.isAuthenticated) {
    onSubmit();
  }
});
</script>
