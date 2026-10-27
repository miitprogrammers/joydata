<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('kaiwa.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">{{ $t('kaiwa.subheading') }}</p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-plus"
        class="text-none whitespace-nowrap shrink-0"
        @click="openCreate()"
      >
        {{ $t('kaiwa.addBtn') }}
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
            :label="$t('kaiwa.filterPeriode')"
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
            :label="$t('kaiwa.filterKelas')"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="loadData"
          />
        </div>
        <div class="sm:col-span-2">
          <v-select
            v-model="filterGrade"
            :items="gradeFilterOptions"
            item-title="label"
            item-value="value"
            :label="$t('kaiwa.filterGrade')"
            variant="outlined"
            density="compact"
            hide-details
          />
        </div>
        <div class="sm:col-span-4">
          <v-text-field
            v-model="searchQuery"
            :placeholder="$t('kaiwa.searchPlaceholder')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
        </div>
      </div>
    </div>

    <!-- 3 Separate §13.1 Metrics (Never Mixed) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Metric 1: Class Grade Distribution (1 student = 1 latest grade) -->
      <div class="joy-surface p-4">
        <div class="text-xs font-medium text-slate-500">{{ $t('kaiwa.metricDistribusiTitle') }}</div>
        <div class="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 tabular-nums font-mono">
          <span class="text-lg font-bold text-emerald-700">A: {{ metrics.distribusi.A }}</span>
          <span class="text-slate-300" aria-hidden="true">·</span>
          <span class="text-lg font-bold text-sky-700">B: {{ metrics.distribusi.B }}</span>
          <span class="text-slate-300" aria-hidden="true">·</span>
          <span class="text-lg font-bold text-amber-700">C: {{ metrics.distribusi.C }}</span>
        </div>
        <div class="mt-1.5 text-xs text-slate-500 tabular-nums">
          {{ $t('kaiwa.belumAdaNilai') }} (-): <span class="font-mono font-semibold text-slate-700">{{ metrics.distribusi.belumAda }}</span>
          <span aria-hidden="true"> · </span>
          <span>Total: {{ metrics.totalPeserta }}</span>
        </div>
      </div>

      <!-- Metric 2: Ordinal Development Point Average (All sessions: A=3, B=2, C=1) -->
      <div class="joy-surface p-4">
        <div class="text-xs font-medium text-slate-500">{{ $t('kaiwa.metricOrdinalTitle') }}</div>
        <div class="mt-1.5 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-slate-900 tabular-nums font-mono">
            {{ metrics.rataPoinOrdinal !== null ? Number(metrics.rataPoinOrdinal).toFixed(2) : '-' }}
          </span>
          <span class="text-xs text-slate-500 font-mono">/ 3.00</span>
        </div>
        <div class="mt-1 text-xs text-slate-500">
          A = 3 · B = 2 · C = 1 ({{ filterPeriode }})
        </div>
      </div>

      <!-- Metric 3: Total Kaiwa Sessions Activity -->
      <div class="joy-surface p-4">
        <div class="text-xs font-medium text-slate-500">{{ $t('kaiwa.metricSesiTitle') }}</div>
        <div class="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums font-mono">
          {{ metrics.jumlahSesi }}
        </div>
        <div class="mt-1 text-xs text-slate-500 tabular-nums">
          {{
            metrics.totalPeserta > 0
              ? `${(metrics.jumlahSesi / metrics.totalPeserta).toFixed(1)} sesi / peserta`
              : '-'
          }}
        </div>
      </div>
    </div>

    <!-- Interactive View Tabs -->
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
        <button
          type="button"
          class="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0"
          :class="activeTab === 'perPeserta' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          @click="activeTab = 'perPeserta'"
        >
          {{ $t('kaiwa.tabPerPeserta') }} ({{ displayedStudentSummary.length }})
        </button>
        <button
          type="button"
          class="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0"
          :class="activeTab === 'sesiLog' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          @click="activeTab = 'sesiLog'"
        >
          {{ $t('kaiwa.tabSesiLog') }} ({{ displayedItems.length }})
        </button>
      </div>
    </div>

    <!-- Main Data Surface -->
    <div class="joy-surface overflow-hidden">
      <div v-if="loading" class="p-6">
        <v-skeleton-loader type="table-row-divider@6" />
      </div>

      <!-- TAB 1: Latest Position Per Student -->
      <template v-else-if="activeTab === 'perPeserta'">
        <div v-if="!displayedStudentSummary.length" class="p-8 text-center text-sm text-slate-500">
          {{ $t('app.noData') }}
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse joy-table">
            <thead>
              <tr>
                <th class="px-5 py-3">{{ $t('kaiwa.colPeserta') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('kaiwa.colKelas') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('kaiwa.colLatestGrade') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('kaiwa.colTanggal') }}</th>
                <th class="px-4 py-3 text-right whitespace-nowrap">{{ $t('kaiwa.colJumlahSesi') }}</th>
                <th class="px-4 py-3">{{ $t('kaiwa.colCatatan') }}</th>
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
                <td class="px-4 py-2.5 whitespace-nowrap">
                  <template v-if="st.latestGrade">
                    <span class="font-mono font-bold text-sm" :class="kaiwaGradeColor(st.latestGrade)">
                      {{ st.latestGrade }}
                    </span>
                  </template>
                  <span v-else class="text-xs text-slate-400">
                    - · {{ $t('kaiwa.belumAdaNilai') }}
                  </span>
                </td>
                <td class="px-4 py-2.5 tabular-nums font-mono text-xs text-slate-600 whitespace-nowrap">
                  {{ st.latestTanggal || '-' }}
                </td>
                <td class="px-4 py-2.5 text-right tabular-nums font-mono text-slate-700">
                  {{ st.jumlahSesi }}
                </td>
                <td class="px-4 py-2.5 text-xs text-slate-600 max-w-md truncate">
                  {{ st.latestDescription || '-' }}
                </td>
                <td class="px-5 py-2.5 text-right whitespace-nowrap">
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="primary"
                    prepend-icon="mdi-plus"
                    class="text-none"
                    :aria-label="`${$t('kaiwa.addBtn')} ${st.pesertaNama}`"
                    @click="openCreate(st)"
                  >
                    {{ $t('app.add') }}
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- TAB 2: All Kaiwa Sessions Log -->
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
            {{ $t('kaiwa.addBtn') }}
          </v-btn>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse joy-table">
            <thead>
              <tr>
                <th class="px-5 py-3 whitespace-nowrap">{{ $t('kaiwa.colTanggal') }}</th>
                <th class="px-4 py-3">{{ $t('kaiwa.colPeserta') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('kaiwa.colKelas') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('kaiwa.colGrade') }}</th>
                <th class="px-4 py-3">{{ $t('kaiwa.colCatatan') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('kaiwa.colPenilai') }}</th>
                <th class="px-5 py-3 text-right whitespace-nowrap">{{ $t('app.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in displayedItems" :key="row.id">
                <td class="px-5 py-2.5 tabular-nums font-mono text-xs text-slate-700 whitespace-nowrap">
                  {{ row.tanggalKaiwa }}
                </td>
                <td class="px-4 py-2.5 font-semibold text-slate-900">
                  {{ row.pesertaNama }}
                </td>
                <td class="px-4 py-2.5 text-xs text-slate-700 whitespace-nowrap">{{ row.kelasNama }}</td>
                <td class="px-4 py-2.5 font-mono font-bold text-sm" :class="kaiwaGradeColor(row.grade)">
                  {{ row.grade }}
                </td>
                <td class="px-4 py-2.5 text-xs text-slate-700 max-w-md">
                  {{ row.description || '-' }}
                </td>
                <td class="px-4 py-2.5 text-xs text-slate-600 whitespace-nowrap">{{ row.penilaiNama }}</td>
                <td class="px-5 py-2.5 text-right whitespace-nowrap">
                  <v-btn
                    icon="mdi-pencil-outline"
                    size="x-small"
                    variant="text"
                    :aria-label="`${$t('app.edit')} ${row.pesertaNama} ${row.tanggalKaiwa}`"
                    @click="openEdit(row)"
                  />
                  <v-btn
                    icon="mdi-trash-can-outline"
                    size="x-small"
                    variant="text"
                    color="error"
                    :aria-label="`${$t('app.delete')} ${row.pesertaNama} ${row.tanggalKaiwa}`"
                    @click="askDelete(row)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>

    <!-- Create / Edit Kaiwa Dialog (No codeKaiwa, strictly Grade A / B / C) -->
    <v-dialog v-model="dialogOpen" max-width="540">
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 font-semibold text-slate-900 font-display">
          {{ editingId ? $t('kaiwa.editTitle') : $t('kaiwa.addBtn') }}
        </div>
        <v-card-text class="pa-6 space-y-4">
          <v-autocomplete
            v-model="form.pesertaId"
            :items="rosterSelectItems"
            item-title="label"
            item-value="value"
            :label="$t('kaiwa.colPeserta')"
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
              :label="$t('kaiwa.colKelas')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
            <v-text-field
              v-model="form.tanggalKaiwa"
              type="date"
              :label="$t('kaiwa.colTanggal')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>

          <!-- Interactive Grade Selector (Strictly A / B / C) -->
          <div class="space-y-2">
            <div class="text-xs font-semibold text-slate-700">{{ $t('kaiwa.colGrade') }} (A / B / C)</div>
            <div class="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                v-for="g in ['A', 'B', 'C']"
                :key="g"
                type="button"
                class="px-5 py-1.5 text-sm font-bold font-mono rounded-md transition-colors"
                :class="
                  form.grade === g
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                "
                @click="form.grade = g"
              >
                Grade {{ g }}
              </button>
            </div>
          </div>

          <v-textarea
            v-model="form.description"
            rows="3"
            :label="$t('kaiwa.colCatatan')"
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
          {{ deleteTarget?.pesertaNama }} · Grade {{ deleteTarget?.grade }} ({{ deleteTarget?.tanggalKaiwa }})
        </div>
        <p class="text-sm text-slate-600 mb-5">{{ $t('kaiwa.confirmDelete') }}</p>
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
const activeTab = ref('perPeserta');

const filterPeriode = ref(currentMonthIso());
const filterKelasId = ref('all');
const filterGrade = ref('all');
const searchQuery = ref('');

const syncMeta = ref(null);
const metrics = ref({
  distribusi: { A: 0, B: 0, C: 0, belumAda: 0 },
  rataPoinOrdinal: null,
  jumlahSesi: 0,
  totalPeserta: 0,
});
const studentSummary = ref([]);
const items = ref([]);
const kelasOptions = ref([]);
const rosterOptions = ref([]);

const dialogOpen = ref(false);
const editingId = ref(null);
const form = ref({
  pesertaId: null,
  kelasId: null,
  tanggalKaiwa: todayIso(),
  grade: 'B',
  description: '',
});

const deleteDialog = ref(false);
const deleteTarget = ref(null);

const kelasFilterOptions = computed(() => [
  { value: 'all', label: t('app.all') },
  ...kelasOptions.value.map((k) => ({ value: k.id, label: k.namaKelas })),
]);

const gradeFilterOptions = computed(() => [
  { value: 'all', label: t('app.all') },
  { value: 'A', label: 'Grade A' },
  { value: 'B', label: 'Grade B' },
  { value: 'C', label: 'Grade C' },
  { value: 'NONE', label: `- (${t('kaiwa.belumAdaNilai')})` },
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

const displayedStudentSummary = computed(() => {
  const q = String(searchQuery.value || '').trim().toLowerCase();
  return studentSummary.value.filter((st) => {
    if (filterGrade.value === 'NONE' && st.latestGrade !== null) return false;
    if (['A', 'B', 'C'].includes(filterGrade.value) && st.latestGrade !== filterGrade.value) return false;
    if (
      q &&
      !String(st.pesertaNama || '').toLowerCase().includes(q) &&
      !String(st.mancationAkunId || '').includes(q) &&
      !String(st.latestDescription || '').toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });
});

const displayedItems = computed(() => {
  const q = String(searchQuery.value || '').trim().toLowerCase();
  return items.value.filter((r) => {
    if (filterGrade.value === 'NONE') return false;
    if (['A', 'B', 'C'].includes(filterGrade.value) && r.grade !== filterGrade.value) return false;
    if (
      q &&
      !String(r.pesertaNama || '').toLowerCase().includes(q) &&
      !String(r.mancationAkunId || '').includes(q) &&
      !String(r.description || '').toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });
});

function kaiwaGradeColor(g) {
  if (g === 'A') return 'text-emerald-700';
  if (g === 'B') return 'text-sky-700';
  if (g === 'C') return 'text-amber-700';
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
    const res = await apiRequest(`/kaiwa?${params.toString()}`);
    metrics.value = res.metrics || {
      distribusi: { A: 0, B: 0, C: 0, belumAda: 0 },
      rataPoinOrdinal: null,
      jumlahSesi: 0,
      totalPeserta: 0,
    };
    studentSummary.value = res.studentSummary || [];
    items.value = res.items || [];
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

  form.value = {
    pesertaId: presetStudent ? presetStudent.pesertaId : firstRoster?.id || null,
    kelasId: presetStudent
      ? presetStudent.kelasId
      : firstRoster?.kelasId || (filterKelasId.value !== 'all' ? Number(filterKelasId.value) : kelasOptions.value[0]?.id || null),
    tanggalKaiwa: defaultDateForPeriode(),
    grade: presetStudent?.latestGrade || 'B',
    description: '',
  };
  dialogOpen.value = true;
}

function openEdit(row) {
  editingId.value = row.id;
  form.value = {
    pesertaId: row.pesertaId,
    kelasId: row.kelasId,
    tanggalKaiwa: row.tanggalKaiwa,
    grade: row.grade || 'B',
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
      tanggalKaiwa: form.value.tanggalKaiwa,
      grade: form.value.grade,
      description: String(form.value.description || '').trim(),
    };
    if (editingId.value) {
      await apiRequest(`/kaiwa/${editingId.value}`, { method: 'PATCH', body });
    } else {
      await apiRequest('/kaiwa', { method: 'POST', body });
    }
    dialogOpen.value = false;
    appStore.notify(t('messages.saved'), 'success');
    if (body.tanggalKaiwa && /^\d{4}-\d{2}/.test(body.tanggalKaiwa)) {
      filterPeriode.value = body.tanggalKaiwa.slice(0, 7);
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
    await apiRequest(`/kaiwa/${deleteTarget.value.id}`, { method: 'DELETE' });
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
