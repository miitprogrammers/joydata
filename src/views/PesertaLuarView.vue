<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('pesertaLuar.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">{{ $t('pesertaLuar.subheading') }}</p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-plus"
        class="text-none"
        @click="openAddDialog"
      >
        {{ $t('pesertaLuar.addBtn') }}
      </v-btn>
    </div>

    <MancationSyncBanner :sync-meta="syncMeta" :show-sync-btn="false" />

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
          v-model="filterKeterangan"
          :items="luarChoices"
          item-title="label"
          item-value="value"
          clearable
          :label="$t('pesertaLuar.filterKeterangan')"
          variant="outlined"
          density="compact"
          hide-details
          @update:model-value="loadData"
        />
      </div>
      <div class="md:col-span-3">
        <v-select
          v-model="filterTag"
          :items="tagChoices"
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

    <!-- Table -->
    <div class="joy-surface overflow-hidden">
      <div v-if="loading" class="p-6">
        <v-skeleton-loader type="table-row-divider@4" />
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
              <th class="px-4 py-3">{{ $t('pesertaLuar.colKeterangan') }}</th>
              <th class="px-4 py-3">{{ $t('peserta.colPendidikan') }}</th>
              <th class="px-4 py-3">{{ $t('peserta.colNaitei') }}</th>
              <th class="px-4 py-3">{{ $t('pesertaLuar.colAlasan') }}</th>
              <th class="px-5 py-3 text-right">{{ $t('app.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in items" :key="p.id">
              <td class="px-5 py-2.5 tabular-nums text-slate-600">#{{ p.mancationAkunId }}</td>
              <td class="px-4 py-2.5">
                <div class="font-semibold text-slate-900">{{ p.nama }}</div>
                <div v-if="p.daerahAsal" class="text-xs text-slate-500">{{ p.daerahAsal }}</div>
              </td>
              <td class="px-4 py-2.5 text-xs font-semibold text-slate-700 whitespace-nowrap">
                {{ $t(`luarTypes.${p.keteranganLuarKelas || 'alumni'}`) }}
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
                  </div>
                </template>
                <span v-else class="text-slate-400">-</span>
              </td>
              <td class="px-4 py-2.5 text-slate-600 max-w-xs truncate">{{ p.alasan || '-' }}</td>
              <td class="px-5 py-2.5 text-right whitespace-nowrap">
                <v-btn
                  size="x-small"
                  variant="tonal"
                  color="primary"
                  class="text-none mr-1"
                  @click="openDetail(p.id)"
                >
                  {{ $t('peserta.detailBtn') }}
                </v-btn>
                <v-btn
                  icon="mdi-trash-can-outline"
                  size="x-small"
                  variant="text"
                  color="error"
                  :aria-label="`${$t('app.delete')} ${p.nama}`"
                  @click="askDelete(p)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Manual Add Dialog (Lookup by mancationAkunId) -->
    <v-dialog v-model="addDialog" max-width="560">
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 font-semibold text-slate-900 font-display">
          {{ $t('pesertaLuar.addBtn') }}
        </div>
        <v-card-text class="pa-6 space-y-4">
          <div class="flex items-start gap-2">
            <v-text-field
              v-model="addForm.mancationAkunId"
              type="number"
              :label="$t('pesertaLuar.lookupLabel')"
              placeholder="9802"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              class="flex-1"
            />
            <v-btn
              variant="tonal"
              color="primary"
              class="text-none mt-1"
              :loading="lookingUp"
              @click="runLookup"
            >
              {{ $t('pesertaLuar.lookupBtn') }}
            </v-btn>
          </div>

          <div v-if="lookupInfo" class="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1">
            <template v-if="lookupInfo.found && !lookupInfo.alreadyRegistered">
              <div class="text-emerald-700 font-semibold">{{ $t('pesertaLuar.lookupFound') }}</div>
              <div class="text-slate-900 font-medium">
                {{ lookupInfo.account.nama }} · ID #{{ lookupInfo.account.mancationAkunId }}
              </div>
              <div v-if="lookupInfo.account.daerahAsal" class="text-slate-500">
                {{ lookupInfo.account.daerahAsal }}
              </div>
            </template>
            <div v-else-if="lookupInfo.alreadyRegistered" class="text-amber-700 font-medium">
              {{ $t('pesertaLuar.lookupDuplicate') }}
            </div>
            <div v-else class="text-red-700 font-medium">
              {{ $t('pesertaLuar.lookupNotFound') }}
            </div>

            <div v-if="lookupInfo.candidateHints?.length" class="pt-1 text-slate-500">
              {{ $t('pesertaLuar.hintCandidates') }}
              <button
                v-for="h in lookupInfo.candidateHints"
                :key="h.mancationAkunId"
                type="button"
                class="underline ml-2 hover:text-slate-900 tabular-nums"
                @click="pickHint(h.mancationAkunId)"
              >
                #{{ h.mancationAkunId }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <v-select
              v-model="addForm.keteranganLuarKelas"
              :items="luarChoices"
              item-title="label"
              item-value="value"
              :label="$t('pesertaLuar.colKeterangan')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
            <v-text-field
              v-model="addForm.tanggalMasuk"
              type="date"
              :label="$t('peserta.tanggalMasuk')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>

          <v-text-field
            v-model="addForm.pendidikanAkhir"
            :label="$t('peserta.pendidikanAkhir')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />

          <v-text-field
            v-model="addForm.pendidikanAkhirJa"
            :label="$t('peserta.pendidikanAkhirJa')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />

          <v-textarea
            v-model="addForm.alasan"
            :label="$t('pesertaLuar.colAlasan')"
            rows="2"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-card-text>
        <div class="px-6 py-3.5 border-t border-slate-200 flex justify-end gap-2 bg-slate-50/50">
          <v-btn variant="text" class="text-none" @click="addDialog = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" class="text-none" :loading="saving" @click="submitAdd">
            {{ $t('app.save') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="pa-5 rounded-xl">
        <div class="text-base font-semibold text-slate-900 mb-2">{{ deleteTarget?.nama }}</div>
        <p class="text-sm text-slate-600 mb-5">{{ $t('pesertaLuar.confirmDelete') }}</p>
        <div class="flex justify-end gap-2">
          <v-btn variant="text" class="text-none" @click="deleteDialog = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="error" variant="flat" class="text-none" :loading="deleting" @click="confirmDelete">
            {{ $t('app.delete') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

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
const items = ref([]);
const syncMeta = ref(null);
const prefectures = ref([]);

const search = ref('');
const filterKeterangan = ref(null);
const filterTag = ref(null);

const addDialog = ref(false);
const lookingUp = ref(false);
const saving = ref(false);
const lookupInfo = ref(null);
const addForm = ref({
  mancationAkunId: '',
  keteranganLuarKelas: 'alumni',
  tanggalMasuk: '',
  pendidikanAkhir: '',
  pendidikanAkhirJa: '',
  alasan: '',
});

const deleteDialog = ref(false);
const deleteTarget = ref(null);
const deleting = ref(false);

const detailOpen = ref(false);
const selectedPesertaId = ref(null);

const luarChoices = computed(() => [
  { value: 'alumni', label: t('luarTypes.alumni') },
  { value: 'cuti', label: t('luarTypes.cuti') },
  { value: 'keluar', label: t('luarTypes.keluar') },
]);

const tagChoices = computed(() => [
  { value: 'siap_interview', label: t('tags.siap_interview') },
  { value: 'berkembang', label: t('tags.berkembang') },
  { value: 'standar', label: t('tags.standar') },
]);

async function loadData() {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (filterKeterangan.value) params.set('keterangan', filterKeterangan.value);
    if (filterTag.value) params.set('statusTag', filterTag.value);
    if (search.value) params.set('search', search.value);
    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await apiRequest(`/peserta-luar${qs}`);
    items.value = res.items || [];
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

function openAddDialog() {
  lookupInfo.value = null;
  addForm.value = {
    mancationAkunId: '9802',
    keteranganLuarKelas: 'cuti',
    tanggalMasuk: '',
    pendidikanAkhir: '',
    pendidikanAkhirJa: '',
    alasan: '',
  };
  addDialog.value = true;
  runLookup();
}

function pickHint(akunId) {
  addForm.value.mancationAkunId = String(akunId);
  runLookup();
}

async function runLookup() {
  if (!addForm.value.mancationAkunId) return;
  lookingUp.value = true;
  try {
    lookupInfo.value = await apiRequest(`/peserta-luar/lookup/${addForm.value.mancationAkunId}`);
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    lookingUp.value = false;
  }
}

async function submitAdd() {
  saving.value = true;
  try {
    await apiRequest('/peserta-luar', {
      method: 'POST',
      body: addForm.value,
    });
    addDialog.value = false;
    appStore.notify(t('messages.saved'), 'success');
    await loadData();
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    saving.value = false;
  }
}

function openDetail(id) {
  selectedPesertaId.value = id;
  detailOpen.value = true;
}

function askDelete(p) {
  deleteTarget.value = p;
  deleteDialog.value = true;
}

async function confirmDelete() {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await apiRequest(`/peserta-luar/${deleteTarget.value.id}`, { method: 'DELETE' });
    deleteDialog.value = false;
    appStore.notify(t('messages.deleted'), 'success');
    await loadData();
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    deleting.value = false;
  }
}

onMounted(() => {
  loadPrefectures();
  loadData();
});
</script>
