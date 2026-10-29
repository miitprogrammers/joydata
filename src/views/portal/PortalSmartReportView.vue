<template>
  <div class="space-y-4">
    <div v-if="loading" class="py-16 flex justify-center" role="status" :aria-label="$t('app.loading')">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <div v-else-if="error" class="joy-surface p-6 text-center space-y-3">
      <p class="text-sm text-slate-700">{{ $t('portal.gagalMuat') }}</p>
      <v-btn variant="tonal" color="primary" class="text-none" @click="load">{{ $t('common.cobaLagi') }}</v-btn>
    </div>
    <section v-else-if="!data?.tersedia" class="joy-surface p-8 text-center">
      <v-icon icon="mdi-file-chart-outline" size="40" class="text-slate-300" />
      <p class="text-sm font-semibold text-slate-800 mt-2">{{ $t('portal.dokumen.smartBelumAda') }}</p>
      <p class="text-xs text-slate-500 mt-1">{{ $t('portal.dokumen.smartBelumAdaDesc') }}</p>
    </section>
    <template v-else>
      <section class="no-print joy-surface p-4 flex flex-wrap items-center gap-3">
        <p class="text-xs text-slate-600 min-w-0 flex-1">{{ $t('portal.dokumen.smartDesc') }}</p>
        <button type="button" class="joy-btn-primary text-xs flex items-center gap-1.5" @click="print">
          <v-icon icon="mdi-file-download-outline" size="16" />
          {{ $t('portal.dokumen.unduhPdf') }}
        </button>
        <p class="basis-full text-[11px] text-slate-500">{{ $t('portal.dokumen.petunjukPdf') }}</p>
      </section>
      <div id="smart-report-print" class="overflow-x-auto print:overflow-visible -mx-4 px-4 print:mx-0 print:px-0">
        <div class="min-w-[720px] print:min-w-0">
          <PesertaReport
            :report="data.peserta"
            :settings="data.settings"
            :print-date="printDate"
            :can-write="false"
            :generate="noop"
            :save="noop"
            portal
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { portalRequest } from '../../services/portalApi.js';
import { isPortalSessionExpired } from '../../services/portalSession.js';
import PesertaReport from '../../components/smart-report/PesertaReport.vue';

const router = useRouter();
const { locale } = useI18n();

const data = ref(null);
const loading = ref(true);
const error = ref(false);

const printDate = computed(() =>
  new Date().toLocaleDateString(locale.value === 'ja' ? 'ja-JP' : 'id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
);

// The portal only shows the resume staff already wrote; it never writes or edits one.
const noop = async () => {};

async function load() {
  loading.value = true;
  error.value = false;
  try {
    data.value = await portalRequest('/smart-report');
  } catch (err) {
    if (!isPortalSessionExpired(err, router)) error.value = true;
  } finally {
    loading.value = false;
  }
}

function print() {
  window.print();
}

onMounted(load);
</script>
