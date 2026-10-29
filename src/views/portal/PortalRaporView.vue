<template>
  <div class="space-y-4">
    <section class="no-print joy-surface p-4 flex flex-wrap items-end gap-3">
      <div class="w-48">
        <label for="portal-rapor-bulan" class="block text-xs font-semibold text-slate-700 mb-1">{{ $t('portal.dokumen.pilihBulan') }}</label>
        <select id="portal-rapor-bulan" v-model="periode" class="joy-input w-full py-1.5 px-2.5 text-sm" @change="load">
          <option v-for="p in periodeOptions" :key="p" :value="p">{{ bulan(p) }}</option>
        </select>
      </div>
      <button
        type="button"
        class="joy-btn-primary text-xs flex items-center gap-1.5 ml-auto"
        :disabled="!data || loading"
        @click="print"
      >
        <v-icon icon="mdi-file-download-outline" size="16" />
        {{ $t('portal.dokumen.unduhPdf') }}
      </button>
      <p class="basis-full text-[11px] text-slate-500">{{ $t('portal.dokumen.petunjukPdf') }}</p>
    </section>

    <div v-if="loading" class="no-print py-16 flex justify-center" role="status" :aria-label="$t('app.loading')">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <div v-else-if="error" class="no-print joy-surface p-6 text-center space-y-3">
      <p class="text-sm text-slate-700">{{ $t('portal.gagalMuat') }}</p>
      <v-btn variant="tonal" color="primary" class="text-none" @click="load">{{ $t('common.cobaLagi') }}</v-btn>
    </div>
    <!-- The A4 sheet keeps its print layout; on a phone it scrolls sideways. -->
    <div v-else-if="data" class="overflow-x-auto print:overflow-visible -mx-4 px-4 print:mx-0 print:px-0">
      <div class="min-w-[720px] print:min-w-0">
        <RaporSheet :rapor-data="data" :settings="data.settings" :print-date="printDate" portal />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { portalRequest } from '../../services/portalApi.js';
import { usePortalFormat, isPortalSessionExpired } from '../../services/portalSession.js';
import RaporSheet from '../../components/rapor/RaporSheet.vue';

const router = useRouter();
const { locale } = useI18n();
const { bulan } = usePortalFormat();

const data = ref(null);
const periode = ref('');
const periodeOptions = ref([]);
const loading = ref(true);
const error = ref(false);

const printDate = computed(() =>
  new Date().toLocaleDateString(locale.value === 'ja' ? 'ja-JP' : 'id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
);

async function load() {
  loading.value = true;
  error.value = false;
  try {
    const query = periode.value ? `?periode=${encodeURIComponent(periode.value)}` : '';
    data.value = await portalRequest(`/rapor${query}`);
    periodeOptions.value = data.value.periodeOptions;
    periode.value = data.value.periode;
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
