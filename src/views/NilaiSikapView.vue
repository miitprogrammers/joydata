<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('sikap.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">{{ $t('sikap.subheading') }}</p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-plus"
        class="text-none whitespace-nowrap shrink-0"
        @click="openCreate()"
      >
        {{ $t('sikap.addBtn') }}
      </v-btn>
    </div>

    <!-- Snapshot Notice -->
    <div
      v-if="syncMeta && syncMeta.source !== 'mysql_live'"
      class="joy-surface px-4 py-2.5 text-xs text-amber-800 bg-amber-50/70 flex items-center justify-between gap-3"
    >
      <span>{{ $t('app.snapshotNotice') }}</span>
      <span v-if="syncMeta.syncedAt" class="tabular-nums font-mono text-amber-700 shrink-0">
        {{ formatShortTime(syncMeta.syncedAt) }}
      </span>
    </div>

    <!-- Filter Bar -->
    <div class="joy-surface p-4">
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div class="sm:col-span-3">
          <v-text-field
            v-model="filterPeriode"
            type="month"
            :label="$t('sikap.filterPeriode')"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="loadData"
          />
        </div>
        <div class="sm:col-span-3">
          <v-select
            v-model="filterKelasId"
            :items="kelasFilterOptions"
            item-title="label"
            item-value="value"
            :label="$t('sikap.filterKelas')"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="loadData"
          />
        </div>
        <div class="sm:col-span-2">
          <v-select
            v-model="filterSentiment"
            :items="sentimentFilterOptions"
            item-title="label"
            item-value="value"
            :label="$t('sikap.filterSentiment')"
            variant="outlined"
            density="compact"
            hide-details
          />
        </div>
        <div class="sm:col-span-4">
          <v-text-field
            v-model="searchQuery"
            :placeholder="$t('sikap.searchPlaceholder')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
        </div>
      </div>
    </div>

    <!-- 4 KPI Blocks -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="joy-surface p-4">
        <div class="text-xs font-medium text-slate-500">{{ $t('sikap.kpiRataSkor') }}</div>
        <div class="mt-1.5 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-slate-900 tabular-nums font-mono">
            {{ kpi.rataSkorSikap !== null ? Number(kpi.rataSkorSikap).toFixed(1) : '75.0' }}
          </span>
          <span class="text-xs text-slate-500 font-mono">/ 100</span>
        </div>
        <div class="mt-1 text-xs text-slate-500 tabular-nums">
          {{ $t('sikap.colBasis') }} {{ kpi.basis }} · KKM {{ kpi.kkm }}
        </div>
      </div>

      <div class="joy-surface p-4">
        <div class="text-xs font-medium text-slate-500">{{ $t('sikap.kpiPositif') }}</div>
        <div class="mt-1.5 text-2xl font-bold text-emerald-700 tabular-nums font-mono">
          +{{ kpi.jumlahKejadianPositif }}
        </div>
        <div class="mt-1 text-xs text-slate-500 tabular-nums">{{ filterPeriode }}</div>
      </div>

      <div class="joy-surface p-4">
        <div class="text-xs font-medium text-slate-500">{{ $t('sikap.kpiNegatif') }}</div>
        <div class="mt-1.5 text-2xl font-bold text-red-700 tabular-nums font-mono">
          −{{ kpi.jumlahKejadianNegatif }}
        </div>
        <div class="mt-1 text-xs text-slate-500 tabular-nums">{{ filterPeriode }}</div>
      </div>

      <div class="joy-surface p-4">
        <div class="text-xs font-medium text-slate-500">{{ $t('sikap.kpiBawahKkm') }}</div>
        <div
          class="mt-1.5 text-2xl font-bold tabular-nums font-mono"
          :class="kpi.diBawahKkmCount > 0 ? 'text-red-700' : 'text-slate-900'"
        >
          {{ kpi.diBawahKkmCount }}
          <span class="text-sm font-normal text-slate-500">/ {{ studentSummary.length }}</span>
        </div>
        <div class="mt-1 text-xs text-slate-500">A≥90 · B≥75 · C≥60 · D&lt;60</div>
      </div>
    </div>

    <!-- Interactive View Tabs -->
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
        <button
          type="button"
          class="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0"
          :class="activeTab === 'studentRecap' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          @click="activeTab = 'studentRecap'"
        >
          {{ $t('sikap.tabStudentRecap') }} ({{ displayedStudentSummary.length }})
        </button>
        <button
          type="button"
          class="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0"
          :class="activeTab === 'eventLog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          @click="activeTab = 'eventLog'"
        >
          {{ $t('sikap.tabEventLog') }} ({{ displayedItems.length }})
        </button>
      </div>
    </div>

    <!-- Main Data Surface -->
    <div class="joy-surface overflow-hidden">
      <div v-if="loading" class="p-6">
        <v-skeleton-loader type="table-row-divider@6" />
      </div>

      <!-- TAB 1: Monthly Student Attitude Score Recap -->
      <template v-else-if="activeTab === 'studentRecap'">
        <div v-if="!displayedStudentSummary.length" class="p-8 text-center text-sm text-slate-500">
          {{ $t('app.noData') }}
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse joy-table">
            <thead>
              <tr>
                <th class="px-5 py-3">{{ $t('sikap.colPeserta') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('sikap.colKelas') }}</th>
                <th class="px-4 py-3 text-right whitespace-nowrap">{{ $t('sikap.colBasis') }}</th>
                <th class="px-4 py-3 text-right whitespace-nowrap">{{ $t('sikap.colPlus') }}</th>
                <th class="px-4 py-3 text-right whitespace-nowrap">{{ $t('sikap.colMinus') }}</th>
                <th class="px-4 py-3 text-right whitespace-nowrap">{{ $t('sikap.colSkorAkhir') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('sikap.colLabel') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('sikap.colStatusKkm') }}</th>
                <th class="px-5 py-3 text-right whitespace-nowrap">{{ $t('app.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="st in displayedStudentSummary" :key="st.pesertaId">
                <td class="px-5 py-2.5">
                  <span class="font-semibold text-slate-900">{{ st.pesertaNama }}</span>
                  <span v-if="st.mancationAkunId" class="ml-2 text-xs text-slate-400 font-mono tabular-nums">
                    #{{ st.mancationAkunId }}
                  </span>
                </td>
                <td class="px-4 py-2.5 text-xs text-slate-700 whitespace-nowrap">{{ st.kelasNama }}</td>
                <td class="px-4 py-2.5 text-right tabular-nums font-mono text-xs text-slate-500">
                  {{ st.basis }}
                </td>
                <td class="px-4 py-2.5 text-right tabular-nums font-mono text-xs">
                  <span v-if="st.poinPositif > 0" class="text-emerald-700 font-semibold">+{{ st.poinPositif }}</span>
                  <span v-else class="text-slate-400">0</span>
                </td>
                <td class="px-4 py-2.5 text-right tabular-nums font-mono text-xs">
                  <span v-if="st.poinNegatif > 0" class="text-red-700 font-semibold">−{{ st.poinNegatif }}</span>
                  <span v-else class="text-slate-400">0</span>
                </td>
                <td class="px-4 py-2.5 text-right tabular-nums font-mono font-bold text-slate-900">
                  {{ st.skorAkhir }}
                </td>
                <td class="px-4 py-2.5 font-mono font-bold text-sm" :class="gradeColorClass(st.label)">
                  {{ st.label }}
                </td>
                <td class="px-4 py-2.5 text-xs font-semibold whitespace-nowrap">
                  <span v-if="st.lulusKkm" class="text-emerald-700">{{ $t('sikap.lulusKkm') }}</span>
                  <span v-else class="text-red-700">{{ $t('sikap.bawahKkm') }}</span>
                </td>
                <td class="px-5 py-2.5 text-right whitespace-nowrap">
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="primary"
                    prepend-icon="mdi-plus"
                    class="text-none"
                    :aria-label="`${$t('sikap.addBtn')} ${st.pesertaNama}`"
                    @click="openCreate(st)"
                  >
                    {{ $t('sikap.quickAddBtn') }}
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- TAB 2: Attitude Event Log -->
      <template v-else>
        <div v-if="!displayedItems.length" class="p-10 text-center space-y-3">
          <div class="text-sm text-slate-500">{{ $t('app.noData') }}</div>
          <v-btn
            color="primary"
            variant="tonal"
            size="small"
            prepend-icon="mdi-plus"
            class="text-none"
            @click="openCreate()"
          >
            {{ $t('sikap.addBtn') }}
          </v-btn>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse joy-table">
            <thead>
              <tr>
                <th class="px-5 py-3 whitespace-nowrap">{{ $t('sikap.colTanggal') }}</th>
                <th class="px-4 py-3">{{ $t('sikap.colPeserta') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('sikap.colKelas') }}</th>
                <th class="px-4 py-3">{{ $t('sikap.colKategori') }}</th>
                <th class="px-4 py-3 text-right whitespace-nowrap">{{ $t('sikap.colBobot') }}</th>
                <th class="px-4 py-3">{{ $t('sikap.colCatatan') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('sikap.colPenilai') }}</th>
                <th class="px-5 py-3 text-right whitespace-nowrap">{{ $t('app.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in displayedItems" :key="row.id">
                <td class="px-5 py-2.5 tabular-nums font-mono text-xs text-slate-700 whitespace-nowrap">
                  {{ row.tanggalPenilaian }}
                </td>
                <td class="px-4 py-2.5 font-semibold text-slate-900">{{ row.pesertaNama }}</td>
                <td class="px-4 py-2.5 text-xs text-slate-700 whitespace-nowrap">{{ row.kelasNama }}</td>
                <td class="px-4 py-2.5 text-xs text-slate-700">
                  {{ appStore.locale === 'ja' ? row.kategoriNamaJa || row.kategoriNamaId : row.kategoriNamaId }}
                </td>
                <td
                  class="px-4 py-2.5 text-right tabular-nums font-mono font-bold"
                  :class="row.sentiment === 'positif' ? 'text-emerald-700' : 'text-red-700'"
                >
                  {{ row.sentiment === 'positif' ? `+${row.bobot}` : `−${row.bobot}` }}
                </td>
                <td class="px-4 py-2.5 text-xs text-slate-600 max-w-sm">
                  {{ row.description || '-' }}
                </td>
                <td class="px-4 py-2.5 text-xs text-slate-600 whitespace-nowrap">{{ row.penilaiNama }}</td>
                <td class="px-5 py-2.5 text-right whitespace-nowrap">
                  <v-btn
                    icon="mdi-pencil-outline"
                    size="x-small"
                    variant="text"
                    :aria-label="`${$t('app.edit')} ${row.pesertaNama} ${row.tanggalPenilaian}`"
                    @click="openEdit(row)"
                  />
                  <v-btn
                    icon="mdi-trash-can-outline"
                    size="x-small"
                    variant="text"
                    color="error"
                    :aria-label="`${$t('app.delete')} ${row.pesertaNama} ${row.tanggalPenilaian}`"
                    @click="askDelete(row)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>

    <!-- Create / Edit Sikap Event Dialog -->
    <v-dialog v-model="dialogOpen" max-width="560">
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 font-semibold text-slate-900 font-display">
          {{ editingId ? $t('sikap.editTitle') : $t('sikap.addBtn') }}
        </div>
        <v-card-text class="pa-6 space-y-4">
          <v-autocomplete
            v-model="form.pesertaId"
            :items="rosterSelectItems"
            item-title="label"
            item-value="value"
            :label="$t('sikap.colPeserta')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            @update:model-value="onStudentSelected"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <v-select
              v-model="form.kelasId"
              :items="kelasSelectItems"
              item-title="label"
              item-value="value"
              :label="$t('sikap.colKelas')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
            <v-text-field
              v-model="form.tanggalPenilaian"
              type="date"
              :label="$t('sikap.colTanggal')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>

          <v-select
            v-model="form.kategoriId"
            :items="kategoriSelectItems"
            item-title="label"
            item-value="value"
            :label="$t('sikap.colKategori')"
            clearable
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            @update:model-value="onKategoriSelected"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div class="space-y-1.5">
              <div class="text-xs font-semibold text-slate-700">{{ $t('sikapKategori.sentiment') }}</div>
              <div class="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                <button
                  type="button"
                  class="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap"
                  :class="
                    form.sentiment === 'positif'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  "
                  @click="form.sentiment = 'positif'"
                >
                  {{ $t('sikapKategori.positif') }}
                </button>
                <button
                  type="button"
                  class="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap"
                  :class="
                    form.sentiment === 'negatif'
                      ? 'bg-white text-red-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  "
                  @click="form.sentiment = 'negatif'"
                >
                  {{ $t('sikapKategori.negatif') }}
                </button>
              </div>
            </div>

            <v-text-field
              v-model.number="form.bobot"
              type="number"
              min="1"
              max="100"
              :label="$t('sikap.colBobot')"
              :hint="$t('sikap.bobotHint')"
              persistent-hint
              variant="outlined"
              density="comfortable"
            />
          </div>

          <v-textarea
            v-model="form.description"
            rows="2"
            :label="$t('sikap.colCatatan')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-card-text>
        <div class="px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
          <v-btn variant="text" class="text-none" @click="dialogOpen = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" class="text-none" :loading="saving" @click="submitForm">
            {{ $t('app.save') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card class="pa-5 rounded-xl">
        <div class="text-base font-semibold text-slate-900 mb-1">
          {{ deleteTarget?.pesertaNama }} ({{ deleteTarget?.tanggalPenilaian }})
        </div>
        <p class="text-sm text-slate-600 mb-5">{{ $t('sikap.confirmDelete') }}</p>
        <div class="flex justify-end gap-2">
          <v-btn variant="text" class="text-none" @click="deleteDialog = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="error" variant="flat" class="text-none" :loading="saving" @click="confirmDelete">
            {{ $t('app.delete') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';

const { t } = useI18n();
const appStore = useAppStore();

function currentMonthIso() {
  return new Date().toISOString().slice(0, 7);
}
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

const loading = ref(true);
const saving = ref(false);
const activeTab = ref('studentRecap');

const filterPeriode = ref(currentMonthIso());
const filterKelasId = ref('all');
const filterSentiment = ref('all');
const searchQuery = ref('');

const syncMeta = ref(null);
const kpi = ref({
  rataSkorSikap: 75,
  jumlahKejadianPositif: 0,
  jumlahKejadianNegatif: 0,
  diBawahKkmCount: 0,
  kkm: 70,
  basis: 75,
});
const studentSummary = ref([]);
const items = ref([]);
const kategoriOptions = ref([]);
const kelasOptions = ref([]);
const rosterOptions = ref([]);

const dialogOpen = ref(false);
const editingId = ref(null);
const form = ref({
  pesertaId: null,
  kelasId: null,
  kategoriId: null,
  tanggalPenilaian: todayIso(),
  sentiment: 'positif',
  bobot: 5,
  description: '',
});

const deleteDialog = ref(false);
const deleteTarget = ref(null);

const kelasFilterOptions = computed(() => [
  { value: 'all', label: t('app.all') },
  ...kelasOptions.value.map((k) => ({ value: k.id, label: k.namaKelas })),
]);

const sentimentFilterOptions = computed(() => [
  { value: 'all', label: t('app.all') },
  { value: 'positif', label: t('sikapKategori.positif') },
  { value: 'negatif', label: t('sikapKategori.negatif') },
]);

const kelasSelectItems = computed(() =>
  kelasOptions.value.map((k) => ({ value: k.id, label: k.namaKelas }))
);

const rosterSelectItems = computed(() =>
  rosterOptions.value.map((p) => ({
    value: p.id,
    label: `${p.nama} (${p.namaKelas || '-'})`,
  }))
);

const kategoriSelectItems = computed(() =>
  kategoriOptions.value.map((k) => {
    const nama = appStore.locale === 'ja' ? k.namaJa || k.namaId : k.namaId;
    const sign = k.sentimentDefault === 'positif' ? '+' : '−';
    return {
      value: k.id,
      label: `${nama} (${sign}${k.bobotDefault})`,
    };
  })
);

const displayedStudentSummary = computed(() => {
  const q = String(searchQuery.value || '').trim().toLowerCase();
  return studentSummary.value.filter((st) => {
    if (filterSentiment.value === 'positif' && st.poinPositif <= 0) return false;
    if (filterSentiment.value === 'negatif' && st.poinNegatif <= 0) return false;
    if (
      q &&
      !String(st.pesertaNama || '').toLowerCase().includes(q) &&
      !String(st.mancationAkunId || '').includes(q)
    ) {
      return false;
    }
    return true;
  });
});

const displayedItems = computed(() => {
  const q = String(searchQuery.value || '').trim().toLowerCase();
  return items.value.filter((r) => {
    if (filterSentiment.value !== 'all' && r.sentiment !== filterSentiment.value) return false;
    if (
      q &&
      !String(r.pesertaNama || '').toLowerCase().includes(q) &&
      !String(r.mancationAkunId || '').includes(q) &&
      !String(r.description || '').toLowerCase().includes(q) &&
      !String(r.kategoriNamaId || '').toLowerCase().includes(q) &&
      !String(r.kategoriNamaJa || '').toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });
});

function gradeColorClass(lbl) {
  if (lbl === 'A') return 'text-emerald-700';
  if (lbl === 'B') return 'text-sky-700';
  if (lbl === 'C') return 'text-amber-700';
  if (lbl === 'D') return 'text-red-700';
  return 'text-slate-400';
}

function formatShortTime(iso) {
  try {
    return new Date(iso).toLocaleString(appStore.locale === 'ja' ? 'ja-JP' : 'id-ID');
  } catch {
    return iso;
  }
}

async function loadData() {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (filterPeriode.value) params.set('periode', filterPeriode.value);
    if (filterKelasId.value && filterKelasId.value !== 'all') {
      params.set('kelasId', String(filterKelasId.value));
    }
    const res = await apiRequest(`/nilai-sikap?${params.toString()}`);
    kpi.value = res.kpi || {
      rataSkorSikap: 75,
      jumlahKejadianPositif: 0,
      jumlahKejadianNegatif: 0,
      diBawahKkmCount: 0,
      kkm: 70,
      basis: 75,
    };
    studentSummary.value = res.studentSummary || [];
    items.value = res.items || [];
    kategoriOptions.value = res.kategoriOptions || [];
    kelasOptions.value = res.kelasOptions || [];
    rosterOptions.value = res.rosterOptions || [];
    syncMeta.value = res.syncMeta || null;
  } catch (err) {
    const key = `messages.${err.code}`;
    appStore.notify(t(key) !== key ? t(key) : t('messages.GENERIC_ERROR'), 'error');
  } finally {
    loading.value = false;
  }
}

function onStudentSelected(pesertaId) {
  const found = rosterOptions.value.find((p) => Number(p.id) === Number(pesertaId));
  if (found && found.kelasId) {
    form.value.kelasId = found.kelasId;
  }
}

function onKategoriSelected(kategoriId) {
  if (!kategoriId) return;
  const kat = kategoriOptions.value.find((k) => Number(k.id) === Number(kategoriId));
  if (kat) {
    form.value.sentiment = kat.sentimentDefault;
    form.value.bobot = Math.abs(Number(kat.bobotDefault) || 5);
  }
}

function defaultDateForPeriode() {
  const today = todayIso();
  if (today.startsWith(filterPeriode.value)) return today;
  return `${filterPeriode.value}-01`;
}

function openCreate(presetStudent = null) {
  editingId.value = null;
  const firstRoster =
    presetStudent ||
    (filterKelasId.value !== 'all'
      ? rosterOptions.value.find((p) => Number(p.kelasId) === Number(filterKelasId.value))
      : rosterOptions.value[0]);

  const firstKat = kategoriOptions.value[0] || null;
  form.value = {
    pesertaId: presetStudent ? presetStudent.pesertaId : firstRoster?.id || null,
    kelasId: presetStudent
      ? presetStudent.kelasId
      : firstRoster?.kelasId || (filterKelasId.value !== 'all' ? Number(filterKelasId.value) : kelasOptions.value[0]?.id || null),
    kategoriId: firstKat?.id || null,
    tanggalPenilaian: defaultDateForPeriode(),
    sentiment: firstKat ? firstKat.sentimentDefault : 'positif',
    bobot: firstKat ? Math.abs(Number(firstKat.bobotDefault) || 5) : 5,
    description: '',
  };
  dialogOpen.value = true;
}

function openEdit(row) {
  editingId.value = row.id;
  form.value = {
    pesertaId: row.pesertaId,
    kelasId: row.kelasId,
    kategoriId: row.kategoriId || null,
    tanggalPenilaian: row.tanggalPenilaian,
    sentiment: row.sentiment === 'negatif' ? 'negatif' : 'positif',
    bobot: Math.abs(Number(row.bobot) || 5),
    description: row.description || '',
  };
  dialogOpen.value = true;
}

async function submitForm() {
  saving.value = true;
  try {
    const body = {
      pesertaId: form.value.pesertaId,
      kelasId: form.value.kelasId,
      kategoriId: form.value.kategoriId || null,
      tanggalPenilaian: form.value.tanggalPenilaian,
      sentiment: form.value.sentiment,
      bobot: Math.abs(Number(form.value.bobot) || 0),
      description: String(form.value.description || '').trim(),
    };
    if (editingId.value) {
      await apiRequest(`/nilai-sikap/${editingId.value}`, { method: 'PATCH', body });
    } else {
      await apiRequest('/nilai-sikap', { method: 'POST', body });
    }
    dialogOpen.value = false;
    appStore.notify(t('messages.saved'), 'success');
    if (body.tanggalPenilaian && /^\d{4}-\d{2}/.test(body.tanggalPenilaian)) {
      filterPeriode.value = body.tanggalPenilaian.slice(0, 7);
    }
    await loadData();
  } catch (err) {
    const key = `messages.${err.code}`;
    appStore.notify(t(key) !== key ? t(key) : t('messages.GENERIC_ERROR'), 'error');
  } finally {
    saving.value = false;
  }
}

function askDelete(row) {
  deleteTarget.value = row;
  deleteDialog.value = true;
}

async function confirmDelete() {
  if (!deleteTarget.value) return;
  saving.value = true;
  try {
    await apiRequest(`/nilai-sikap/${deleteTarget.value.id}`, { method: 'DELETE' });
    deleteDialog.value = false;
    appStore.notify(t('messages.deleted'), 'success');
    await loadData();
  } catch (err) {
    const key = `messages.${err.code}`;
    appStore.notify(t(key) !== key ? t(key) : t('messages.GENERIC_ERROR'), 'error');
  } finally {
    saving.value = false;
  }
}

onMounted(loadData);
</script>
