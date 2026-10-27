<template>
  <template v-if="!isInstalled">
    <v-btn
      v-if="deferredPrompt"
      color="primary"
      variant="tonal"
      size="small"
      prepend-icon="mdi-download-outline"
      class="text-none font-semibold"
      @click="triggerInstall"
    >
      {{ $t('app.installApp') }}
    </v-btn>

    <v-btn
      v-else-if="isIOS"
      variant="outlined"
      size="small"
      prepend-icon="mdi-apple"
      class="text-none"
      @click="showIosDialog = true"
    >
      {{ $t('app.installIos') }}
    </v-btn>

    <v-dialog v-model="showIosDialog" max-width="400">
      <v-card class="pa-5 rounded-xl">
        <div class="text-base font-semibold text-slate-900 font-display mb-2">
          {{ $t('app.iosGuideTitle') }}
        </div>
        <div class="text-sm text-slate-600 space-y-2 mb-5">
          <p>{{ $t('app.iosGuideStep1') }}</p>
          <p>{{ $t('app.iosGuideStep2') }}</p>
        </div>
        <div class="flex justify-end">
          <v-btn variant="tonal" color="primary" class="text-none" @click="showIosDialog = false">
            {{ $t('app.close') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </template>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const deferredPrompt = ref(null);
const isInstalled = ref(false);
const isIOS = ref(false);
const showIosDialog = ref(false);

function handleBeforeInstallPrompt(e) {
  e.preventDefault();
  deferredPrompt.value = e;
}

function handleAppInstalled() {
  isInstalled.value = true;
  deferredPrompt.value = null;
}

async function triggerInstall() {
  if (!deferredPrompt.value) return;
  await deferredPrompt.value.prompt();
  const choice = await deferredPrompt.value.userChoice;
  if (choice?.outcome === 'accepted') {
    isInstalled.value = true;
    deferredPrompt.value = null;
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return;
  const standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  isInstalled.value = standalone;

  const ua = window.navigator.userAgent.toLowerCase();
  isIOS.value = /iphone|ipad|ipod/.test(ua);

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.addEventListener('appinstalled', handleAppInstalled);
});

onUnmounted(() => {
  if (typeof window === 'undefined') return;
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  window.removeEventListener('appinstalled', handleAppInstalled);
});
</script>
