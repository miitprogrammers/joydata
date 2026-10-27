<template>
  <div
    v-if="deferredPrompt && showPrompt"
    class="no-print fixed bottom-4 right-4 z-50 max-w-sm bg-white rounded-xl shadow-lg border border-slate-200 p-4 space-y-3"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
          <v-icon icon="mdi-cellphone-arrow-down" size="20" />
        </div>
        <div>
          <div class="text-xs font-bold text-slate-900">{{ $t('pwa.installTitle') }}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">{{ $t('pwa.installDesc') }}</div>
        </div>
      </div>
      <button type="button" class="text-slate-400 hover:text-slate-600" @click="dismissPrompt">
        <v-icon icon="mdi-close" size="16" />
      </button>
    </div>
    <div class="flex items-center justify-end gap-2 pt-1">
      <button type="button" class="joy-btn-secondary text-xs py-1 px-2.5" @click="dismissPrompt">
        {{ $t('pwa.nantiBtn') }}
      </button>
      <button type="button" class="joy-btn-primary text-xs py-1 px-3" @click="installApp">
        {{ $t('pwa.installBtn') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const deferredPrompt = ref(null);
const showPrompt = ref(false);

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showPrompt.value = true;
  });
});

async function installApp() {
  if (!deferredPrompt.value) return;
  deferredPrompt.value.prompt();
  const choice = await deferredPrompt.value.userChoice;
  if (choice.outcome === 'accepted') {
    showPrompt.value = false;
  }
  deferredPrompt.value = null;
}

function dismissPrompt() {
  showPrompt.value = false;
}
</script>
