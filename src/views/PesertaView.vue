<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('peserta.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">{{ $t('peserta.subheading') }}</p>
      </div>
      <v-btn
        variant="outlined"
        color="primary"
        size="small"
        prepend-icon="mdi-sync"
        class="text-none"
        :loading="syncing"
        @click="triggerSync"
      >
        {{ $t('app.syncMancation') }}
      </v-btn>
    </div>

    <MancationSyncBanner :sync-meta="syncMeta" :syncing="syncing" @sync="triggerSync" />

    <!-- Filter Bar -->
    <div class="joy-surface p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
      <div class="md:col-span-6">
        <v-text-field
          v-model="search"
          :placeholder="$t('peserta.searchPlaceholder')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
          @update:model-value="loadData"
        />
      </div>
      <div class="md:col-span-3">
        <v-select
          v-model="filterKelasId"
          :items="kelasOptions"
          item-title="namaKelas"
          item-value="id"
          clearable
          :label="$t('peserta.filterKelas')"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="loadData"
        />
      </div>
      <div class="md:col-span-3">
        <v-select
          v-model="filterTag"
          :items="tagFilterChoices"
          item-title="label"
          item-value="value"
          clearable
          :label="$t('peserta.filterTag')"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="loadData"
        />
      </div>
    </div>

    <!-- Roster Table (Zero-Pill Unboxed Metadata + Tabular Numerals + Tanpa 現状) -->
    <div class="joy-surface overflow-hidden">
      <div v-if="loading" class="p-6">
        <v-skeleton-loader type="table-row-divider@5" />
      </div>
      <div v-else-if="!items.length" class="p-8 text-center text-sm text-slate-500">
        {{ $t('app.noData') }}
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse joy-table">
          <thead>
            <tr>
              <th class="px-5 py-3">{{ $t('peserta.colAkunId') }}</th>
              <th class="px-4 py-3">{{ $t('peserta.colNama') }}</th>
              <th class="px-4 py-3">{{ $t('peserta.colKelas') }}</th>
              <th class="px-4 py-3">{{ $t('peserta.colTglMasuk') }}</th>
              <th class="px-4 py-3">{{ $t('peserta.colPendidikan') }}</th>
              <th class="px-4 py-3">{{ $t('peserta.colNaitei') }}</th>
              <th class="px-4 py-3">{{ $t('peserta.colTag') }}</th>
              <th class="px-5 py-3 text-right">{{ $t('app.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in items" :key="p.id">
              <td class="px-5 py-2.5 tabular-nums text-slate-600">#{{ p.mancationAkunId }}</td>
              <td class="px-4 py-2.5">
                <div class="font-semibold text-slate-900">{{ p.nama }}</div>
                <div v-if="p.daerahAsal" class="text-xs text-slate-500 truncate max-w-xs">
                  {{ p.daerahAsal }}
                </div>
              </td>
              <td class="px-4 py-2.5 font-medium text-slate-800 whitespace-nowrap">
                {{ p.namaKelas || '-' }}
              </td>
              <td class="px-4 py-2.5 tabular-nums text-slate-700 whitespace-nowrap">
                {{ p.tanggalMasuk || '-' }}
              </td>
              <td class="px-4 py-2.5 text-slate-700">
                {{ pendidikanBaris(p)[0] || '-' }}
                <div v-if="pendidikanBaris(p)[1]" class="text-xs text-slate-500">{{ pendidikanBaris(p)[1] }}</div>
              </td>
              <td class="px-4 py-2.5">
                <template v-if="p.penempatan?.perusahaanNaitei">
                  <div class="text-sm font-medium text-slate-900 truncate max-w-xs">
                    {{ p.penempatan.perusahaanNaitei }}
                  </div>
                  <div class="text-xs text-slate-500">
                    {{ locale === 'ja' ? p.penempatan.prefekturNamaJa : p.penempatan.prefekturNamaId }}
                    <span v-if="p.penempatan.rencanaMulaiKerja" class="tabular-nums">
                      · {{ p.penempatan.rencanaMulaiKerja }}
                    </span>
                  </div>
                </template>
                <span v-else class="text-slate-400">-</span>
              </td>
              <td class="px-4 py-2.5 whitespace-nowrap">
                <span class="text-xs font-semibold" :class="tagColorClass(p.statusTag)">
                  {{ $t(`tags.${p.statusTag}`) }}
                </span>
              </td>
              <td class="px-5 py-2.5 text-right whitespace-nowrap">
                <v-btn
                  size="x-small"
                  variant="tonal"
                  color="primary"
                  class="text-none font-medium"
                  @click="openDetail(p.id)"
                >
                  {{ $t('peserta.detailBtn') }}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <PesertaDetailDialog
      v-model="detailOpen"
      :peserta-id="selectedPesertaId"
      :prefectures="prefectures"
      @saved="loadData"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';
import MancationSyncBanner from '../components/MancationSyncBanner.vue';
import PesertaDetailDialog from '../components/PesertaDetailDialog.vue';

const { t, locale } = useI18n();
const appStore = useAppStore();

// Both languages are shown: the active locale's text first, the other one below it.
function pendidikanBaris(p) {
  const baris = locale.value === 'ja' ? [p.pendidikanAkhirJa, p.pendidikanAkhir] : [p.pendidikanAkhir, p.pendidikanAkhirJa];
  return baris.filter(Boolean);
}

const loading = ref(true);
const syncing = ref(false);
const items = ref([]);
const kelasOptions = ref([]);
const prefectures = ref([]);
const syncMeta = ref(null);

const search = ref('');
const filterKelasId = ref(null);
const filterTag = ref(null);

const detailOpen = ref(false);
const selectedPesertaId = ref(null);

const tagFilterChoices = computed(() => [
  { value: 'siap_interview', label: t('tags.siap_interview') },
  { value: 'berkembang', label: t('tags.berkembang') },
  { value: 'standar', label: t('tags.standar') },
]);

function tagColorClass(tag) {
  if (tag === 'siap_interview') return 'text-emerald-700';
  if (tag === 'berkembang') return 'text-amber-700';
  return 'text-slate-600';
}

async function loadData() {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (filterKelasId.value) params.set('kelasId', String(filterKelasId.value));
    if (filterTag.value) params.set('statusTag', filterTag.value);
    if (search.value) params.set('search', search.value);
    const qs = params.toString() ? `?${params.toString()}` : '';

    const res = await apiRequest(`/peserta${qs}`);
    items.value = res.items || [];
    kelasOptions.value = res.kelasOptions || [];
    syncMeta.value = res.mancationSync || null;
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    loading.value = false;
  }
}

async function loadPrefectures() {
  try {
    const res = await apiRequest('/prefectures');
    prefectures.value = res.items || [];
  } catch {
    prefectures.value = [];
  }
}

async function triggerSync() {
  syncing.value = true;
  try {
    const res = await apiRequest('/mancation/sync', { method: 'POST' });
    appStore.notify(t('messages.synced', { count: res.totalStudents }), 'success');
    await loadData();
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    syncing.value = false;
  }
}

function openDetail(id) {
  selectedPesertaId.value = id;
  detailOpen.value = true;
}

onMounted(() => {
  loadPrefectures();
  loadData();
});
</script>
