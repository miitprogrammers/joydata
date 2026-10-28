<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-between px-4 py-6">
    <header class="max-w-5xl w-full mx-auto flex items-center justify-between gap-6">
      <span class="text-lg font-bold tracking-tight text-slate-900 font-display whitespace-nowrap">
        JOYdata
      </span>
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
    </header>

    <main class="w-full max-w-md mx-auto my-auto py-8">
      <div class="joy-surface p-7 sm:p-8">
        <div class="mb-6">
          <p class="text-xs font-medium text-slate-500 mb-1">
            {{ $t('app.institution') }}
          </p>
          <h1 class="text-2xl font-bold text-slate-900 font-display">
            {{ $t('portal.loginTitle') }}
          </h1>
          <p class="text-sm text-slate-600 mt-1">
            {{ $t('portal.loginSubtitle') }}
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="onSubmit">
          <v-text-field
            v-model="email"
            type="email"
            :label="$t('portal.email')"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="comfortable"
            autocomplete="username"
            inputmode="email"
            hide-details="auto"
            required
          />

          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :label="$t('portal.password')"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            variant="outlined"
            density="comfortable"
            autocomplete="current-password"
            :hint="$t('portal.passwordHint')"
            persistent-hint
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
            {{ $t('portal.submit') }}
          </v-btn>
        </form>
      </div>

      <p class="text-center mt-4">
        <router-link to="/login" class="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2">
          {{ $t('portal.staffLink') }}
        </router-link>
      </p>
    </main>

    <footer class="max-w-5xl w-full mx-auto text-center text-xs text-slate-400">
      JOYdata · LPK Mizuno Semangat Bangsa
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLocale } from 'vuetify';
import { useAppStore } from '../../stores/appStore.js';
import { portalRequest, setPortalToken } from '../../services/portalApi.js';

const router = useRouter();
const { t, te, locale } = useI18n();
const vuetifyLocale = useLocale();
const appStore = useAppStore();

const email = ref('');
const password = ref('');
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
    const data = await portalRequest('/auth/login', { method: 'POST', body: { email: email.value, password: password.value } });
    setPortalToken(data.token);
    router.replace('/portal');
  } catch (err) {
    if (err.code === 'INVALID_CREDENTIALS') errorMsg.value = t('portal.loginGagal');
    else errorMsg.value = te(`messages.${err.code}`) ? t(`messages.${err.code}`) : t('messages.GENERIC_ERROR');
  } finally {
    submitting.value = false;
  }
}
</script>
