<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('ujian.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">{{ $t('ujian.subheading') }}</p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-plus"
        class="text-none whitespace-nowrap shrink-0"
        @click="openCreate()"
      >
        {{ $t('ujian.addBtn') }}
      </v-btn>
    </div>

    <!-- Mancation Snapshot Notice if applicable -->
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
            :label="$t('ujian.filterPeriode')"
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
            :label="$t('ujian.filterKelas')"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="loadData"
          />
        </div>
        <div class="sm:col-span-6">
          <v-text-field
            v-model="searchQuery"
            :placeholder="$t('ujian.searchPlaceholder')"
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
        <div class="text-xs font-medium text-slate-500">{{ $t('ujian.kpiTotalBaris') }}</div>
        <div class="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums font-mono">
          {{ computedKpi.totalBaris }}
        </div>
        <div class="mt-1 text-xs text-slate-500 tabular-nums">
          {{ filterPeriode }}
        </div>
      </div>

      <div class="joy-surface p-4">
        <div class="text-xs font-medium text-slate-500">{{ $t('ujian.kpiRataPeriode') }}</div>
        <div class="mt-1.5 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-slate-900 tabular-nums font-mono">
            {{ computedKpi.rataRata !== null ? computedKpi.rataRata.toFixed(1) : '-' }}
          </span>
          <span
            v-if="computedKpi.rataRata !== null"
            class="text-xs font-semibold"
            :class="gradeColorClass(computedKpi.rataLabel)"
          >
            · {{ computedKpi.rataLabel }}
          </span>
        </div>
        <div class="mt-1 text-xs text-slate-500">
          KKM {{ kpiMeta.kkm }}
        </div>
      </div>

      <div class="joy-surface p-4">
        <div class="text-xs font-medium text-slate-500">{{ $t('ujian.kpiLulusKkm', { kkm: kpiMeta.kkm }) }}</div>
        <div class="mt-1.5 text-2xl font-bold text-emerald-700 tabular-nums font-mono">
          {{ computedKpi.lulusKkmCount }}
          <span class="text-sm font-normal text-slate-500">/ {{ computedKpi.totalBaris }}</span>
        </div>
        <div class="mt-1 text-xs text-slate-500 tabular-nums">
          {{
            computedKpi.totalBaris > 0
              ? `${((computedKpi.lulusKkmCount / computedKpi.totalBaris) * 100).toFixed(1)}%`
              : '-'
          }}
        </div>
      </div>

      <div class="joy-surface p-4">
        <div class="text-xs font-medium text-slate-500">{{ $t('ujian.kpiDistribusi') }}</div>
        <div class="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-semibold tabular-nums font-mono">
          <span class="text-emerald-700">A: {{ computedKpi.distribusi.A }}</span>
          <span class="text-slate-300" aria-hidden="true">·</span>
          <span class="text-sky-700">B: {{ computedKpi.distribusi.B }}</span>
          <span class="text-slate-300" aria-hidden="true">·</span>
          <span class="text-amber-700">C: {{ computedKpi.distribusi.C }}</span>
          <span class="text-slate-300" aria-hidden="true">·</span>
          <span class="text-red-700">D: {{ computedKpi.distribusi.D }}</span>
        </div>
        <div class="mt-1 text-xs text-slate-500">A≥{{ appStore.settings.batas_grade.A }} · B≥{{ appStore.settings.batas_grade.B }} · C≥{{ appStore.settings.batas_grade.C }} · D&lt;{{ appStore.settings.batas_grade.C }}</div>
      </div>
    </div>

    <!-- Interactive View Mode Tabs -->
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
        <button
          type="button"
          class="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0"
          :class="activeTab === 'log' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          @click="activeTab = 'log'"
        >
          {{ $t('ujian.tabLog') }} ({{ displayedItems.length }})
        </button>
        <button
          type="button"
          class="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0"
          :class="activeTab === 'summary' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          @click="activeTab = 'summary'"
        >
          {{ $t('ujian.tabSummary') }} ({{ displayedStudentSummary.length }})
        </button>
      </div>
    </div>

    <!-- Main Data Surface -->
    <div class="joy-surface overflow-hidden">
      <div v-if="loading" class="p-6">
        <v-skeleton-loader type="table-row-divider@6" />
      </div>

      <!-- TAB 1: Exam Rows List -->
      <template v-else-if="activeTab === 'log'">
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
            {{ $t('ujian.addBtn') }}
          </v-btn>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse joy-table">
            <thead>
              <tr>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('ujian.colTanggal') }}</th>
                <th class="px-3 py-3 whitespace-nowrap">{{ $t('ujian.colKode') }}</th>
                <th class="px-3 py-3">{{ $t('ujian.colPeserta') }}</th>
                <th class="px-2.5 py-3 text-right whitespace-nowrap">{{ $t('ujian.colTunggal') }}</th>
                <th class="px-2.5 py-3 text-right whitespace-nowrap">{{ $t('ujian.colMojiGoi') }}</th>
                <th class="px-2.5 py-3 text-right whitespace-nowrap">{{ $t('ujian.colBunpou') }}</th>
                <th class="px-2.5 py-3 text-right whitespace-nowrap">{{ $t('ujian.colDokkai') }}</th>
                <th class="px-2.5 py-3 text-right whitespace-nowrap">{{ $t('ujian.colChoukai') }}</th>
                <th class="px-3 py-3 text-right whitespace-nowrap">{{ $t('ujian.colAvg') }}</th>
                <th class="px-3 py-3 whitespace-nowrap">{{ $t('ujian.colPenilai') }}</th>
                <th class="px-4 py-3 text-right whitespace-nowrap">{{ $t('app.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in displayedItems" :key="row.id">
                <td class="px-4 py-2.5 tabular-nums font-mono text-xs text-slate-700 whitespace-nowrap">
                  {{ row.tanggalUjian }}
                </td>
                <td class="px-3 py-2.5 font-mono text-xs font-semibold text-slate-900 whitespace-nowrap">
                  {{ row.codeUjian }}
                </td>
                <td class="px-3 py-2.5 min-w-[180px]">
                  <div class="font-semibold text-slate-900 leading-snug">{{ row.pesertaNama }}</div>
                  <div class="text-xs text-slate-500 truncate max-w-[240px]">
                    <span>{{ row.kelasNama }}</span>
                    <span aria-hidden="true"> · </span>
                    <span>{{ row.pola === 'tunggal' ? $t('ujian.colTunggal') : 'Variabel' }}</span>
                    <template v-if="row.catatan">
                      <span aria-hidden="true"> · </span>
                      <span>{{ row.catatan }}</span>
                    </template>
                  </div>
                </td>
                <td class="px-2.5 py-2.5 text-right tabular-nums font-mono text-xs text-slate-700">
                  {{ formatScoreCell(row.nilaiTunggal) }}
                </td>
                <td class="px-2.5 py-2.5 text-right tabular-nums font-mono text-xs text-slate-700">
                  {{ formatScoreCell(row.nilaiMojiGoi) }}
                </td>
                <td class="px-2.5 py-2.5 text-right tabular-nums font-mono text-xs text-slate-700">
                  {{ formatScoreCell(row.nilaiBunpou) }}
                </td>
                <td class="px-2.5 py-2.5 text-right tabular-nums font-mono text-xs text-slate-700">
                  {{ formatScoreCell(row.nilaiDokkai) }}
                </td>
                <td class="px-2.5 py-2.5 text-right tabular-nums font-mono text-xs text-slate-700">
                  {{ formatScoreCell(row.nilaiChoukai) }}
                </td>
                <td class="px-3 py-2.5 text-right tabular-nums font-mono whitespace-nowrap">
                  <span
                    class="font-bold"
                    :class="row.nilaiAvg >= kpiMeta.kkm ? 'text-slate-900' : 'text-red-700'"
                  >
                    {{ row.nilaiAvg !== null ? Number(row.nilaiAvg).toFixed(1) : '-' }}
                  </span>
                  <span
                    v-if="row.gradeLabel && row.gradeLabel !== '-'"
                    class="ml-1 text-xs font-semibold"
                    :class="gradeColorClass(row.gradeLabel)"
                  >
                    · {{ row.gradeLabel }}
                  </span>
                </td>
                <td class="px-3 py-2.5 text-xs text-slate-600 max-w-[130px] truncate">
                  {{ row.penilaiNama }}
                </td>
                <td class="px-4 py-2.5 text-right whitespace-nowrap">
                  <v-btn
                    icon="mdi-pencil-outline"
                    size="x-small"
                    variant="text"
                    :aria-label="`${$t('app.edit')} ${row.pesertaNama} ${row.codeUjian}`"
                    @click="openEdit(row)"
                  />
                  <v-btn
                    icon="mdi-trash-can-outline"
                    size="x-small"
                    variant="text"
                    color="error"
                    :aria-label="`${$t('app.delete')} ${row.pesertaNama} ${row.codeUjian}`"
                    @click="askDelete(row)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- TAB 2: Per-Student Monthly Summary -->
      <template v-else>
        <div v-if="!displayedStudentSummary.length" class="p-8 text-center text-sm text-slate-500">
          {{ $t('app.noData') }}
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse joy-table">
            <thead>
              <tr>
                <th class="px-5 py-3">{{ $t('ujian.colPeserta') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('ujian.colKelas') }}</th>
                <th class="px-4 py-3 text-right whitespace-nowrap">{{ $t('ujian.colJumlahUjian') }}</th>
                <th class="px-4 py-3 text-right whitespace-nowrap">{{ $t('ujian.colAvg') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('sikap.colStatusKkm', { kkm: kpiMeta.kkm }) }}</th>
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
                <td class="px-4 py-2.5 text-right tabular-nums font-mono text-slate-700">
                  {{ st.jumlahUjian }}
                </td>
                <td class="px-4 py-2.5 text-right tabular-nums font-mono whitespace-nowrap">
                  <template v-if="st.rataRata !== null">
                    <span class="font-bold text-slate-900">{{ Number(st.rataRata).toFixed(1) }}</span>
                    <span class="ml-1 text-xs font-semibold" :class="gradeColorClass(st.gradeLabel)">
                      · {{ st.gradeLabel }}
                    </span>
                  </template>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td class="px-4 py-2.5 text-xs font-semibold whitespace-nowrap">
                  <span v-if="st.lulusKkm === null" class="text-slate-400 font-normal">-</span>
                  <span v-else-if="st.lulusKkm" class="text-emerald-700">{{ $t('sikap.lulusKkm') }}</span>
                  <span v-else class="text-red-700">{{ $t('sikap.bawahKkm') }}</span>
                </td>
                <td class="px-5 py-2.5 text-right whitespace-nowrap">
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="primary"
                    prepend-icon="mdi-plus"
                    class="text-none"
                    :aria-label="`${$t('ujian.addBtn')} ${st.pesertaNama}`"
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
    </div>

    <!-- Create / Edit Dialog -->
    <v-dialog v-model="dialogOpen" max-width="620">
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 font-semibold text-slate-900 font-display">
          {{ editingId ? $t('ujian.editTitle') : $t('ujian.addBtn') }}
        </div>
        <v-card-text class="pa-6 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <v-autocomplete
              v-model="form.pesertaId"
              :items="rosterSelectItems"
              item-title="label"
              item-value="value"
              :label="$t('ujian.colPeserta')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              @update:model-value="onStudentSelected"
            />
            <v-select
              v-model="form.kelasId"
              :items="kelasSelectItems"
              item-title="label"
              item-value="value"
              :label="$t('ujian.colKelas')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <v-text-field
              v-model="form.tanggalUjian"
              type="date"
              :label="$t('ujian.colTanggal')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
            <v-text-field
              v-model="form.codeUjian"
              :label="$t('ujian.colKode')"
              :hint="$t('ujian.codeHint')"
              persistent-hint
              variant="outlined"
              density="comfortable"
            />
          </div>

          <!-- Interactive Pola Selector -->
          <div class="space-y-2">
            <div class="text-xs font-semibold text-slate-700">{{ $t('ujian.colPola') }}</div>
            <div class="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
              <button
                type="button"
                class="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap"
                :class="form.pola === 'variable' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                @click="form.pola = 'variable'"
              >
                {{ $t('ujian.polaVariable') }}
              </button>
              <button
                type="button"
                class="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap"
                :class="form.pola === 'tunggal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                @click="form.pola = 'tunggal'"
              >
                {{ $t('ujian.polaTunggal') }}
              </button>
            </div>
          </div>

          <!-- Pola Tunggal Input -->
          <div v-if="form.pola === 'tunggal'">
            <v-text-field
              v-model="form.nilaiTunggal"
              type="number"
              min="0"
              max="100"
              step="0.5"
              :label="`${$t('ujian.colTunggal')} (0–100)`"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>

          <!-- Pola Variable Inputs -->
          <div v-else class="space-y-2">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <v-text-field
                v-model="form.nilaiMojiGoi"
                type="number"
                min="0"
                max="100"
                step="0.5"
                :label="$t('ujian.colMojiGoi')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <v-text-field
                v-model="form.nilaiBunpou"
                type="number"
                min="0"
                max="100"
                step="0.5"
                :label="$t('ujian.colBunpou')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <v-text-field
                v-model="form.nilaiDokkai"
                type="number"
                min="0"
                max="100"
                step="0.5"
                :label="$t('ujian.colDokkai')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <v-text-field
                v-model="form.nilaiChoukai"
                type="number"
                min="0"
                max="100"
                step="0.5"
                :label="$t('ujian.colChoukai')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </div>
            <p class="text-xs text-slate-500">{{ $t('ujian.variableHint') }}</p>
          </div>

          <v-text-field
            v-model="form.catatan"
            :label="$t('ujian.catatan')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />

          <!-- Live Calculated Preview -->
          <div class="pt-2 border-t border-slate-200/80 flex items-center justify-between text-sm">
            <span class="text-slate-600 font-medium">{{ $t('ujian.colAvg') }}</span>
            <span class="font-mono tabular-nums font-bold text-base text-slate-900">
              {{ previewAvg !== null ? previewAvg.toFixed(1) : '-' }}
            </span>
          </div>
        </v-card-text>
        <div class="px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
          <v-btn variant="text" class="text-none" @click="dialogOpen = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" class="text-none" :loading="saving" @click="submitForm">
            {{ $t('app.save') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card class="pa-5 rounded-xl">
        <div class="text-base font-semibold text-slate-900 mb-1">
          {{ deleteTarget?.pesertaNama }} · {{ deleteTarget?.codeUjian }}
        </div>
        <p class="text-sm text-slate-600 mb-5">{{ $t('ujian.confirmDelete') }}</p>
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
const activeTab = ref('log');

const filterPeriode = ref(currentMonthIso());
const filterKelasId = ref('all');
const searchQuery = ref('');

const syncMeta = ref(null);
const kpiMeta = ref({ kkm: 70 });
const items = ref([]);
const studentSummary = ref([]);
const kelasOptions = ref([]);
const rosterOptions = ref([]);

const dialogOpen = ref(false);
const editingId = ref(null);
const form = ref({
  pesertaId: null,
  kelasId: null,
  tanggalUjian: todayIso(),
  codeUjian: '',
  pola: 'variable',
  nilaiTunggal: '',
  nilaiMojiGoi: '',
  nilaiBunpou: '',
  nilaiDokkai: '',
  nilaiChoukai: '',
  catatan: '',
});

const deleteDialog = ref(false);
const deleteTarget = ref(null);

const kelasFilterOptions = computed(() => [
  { value: 'all', label: t('app.all') },
  ...kelasOptions.value.map((k) => ({ value: k.id, label: k.namaKelas })),
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

const displayedItems = computed(() => {
  const q = String(searchQuery.value || '').trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter(
    (r) =>
      String(r.pesertaNama || '').toLowerCase().includes(q) ||
      String(r.mancationAkunId || '').includes(q) ||
      String(r.codeUjian || '').toLowerCase().includes(q)
  );
});

const displayedStudentSummary = computed(() => {
  const q = String(searchQuery.value || '').trim().toLowerCase();
  if (!q) return studentSummary.value;
  return studentSummary.value.filter(
    (s) =>
      String(s.pesertaNama || '').toLowerCase().includes(q) ||
      String(s.mancationAkunId || '').includes(q)
  );
});

function computeGrade(val) {
  return appStore.gradeLabel(val);
}

const computedKpi = computed(() => {
  const rows = displayedItems.value;
  const avgs = rows.map((r) => r.nilaiAvg).filter((v) => v !== null && v !== undefined);
  const rataRata =
    avgs.length > 0
      ? Math.round((avgs.reduce((acc, v) => acc + Number(v), 0) / avgs.length) * 10) / 10
      : null;
  const distribusi = { A: 0, B: 0, C: 0, D: 0 };
  let lulusKkmCount = 0;
  for (const v of avgs) {
    const lbl = computeGrade(v);
    if (distribusi[lbl] !== undefined) distribusi[lbl] += 1;
    if (Number(v) >= (kpiMeta.value.kkm || 70)) lulusKkmCount += 1;
  }
  return {
    totalBaris: rows.length,
    rataRata,
    rataLabel: computeGrade(rataRata),
    distribusi,
    lulusKkmCount,
  };
});

function parseOptionalNumber(val) {
  if (val === '' || val === null || val === undefined) return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

const previewAvg = computed(() => {
  if (form.value.pola === 'tunggal') {
    return parseOptionalNumber(form.value.nilaiTunggal);
  }
  const vals = [
    parseOptionalNumber(form.value.nilaiMojiGoi),
    parseOptionalNumber(form.value.nilaiBunpou),
    parseOptionalNumber(form.value.nilaiDokkai),
    parseOptionalNumber(form.value.nilaiChoukai),
  ].filter((v) => v !== null);
  if (!vals.length) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 100) / 100;
});

function gradeColorClass(lbl) {
  if (lbl === 'A') return 'text-emerald-700';
  if (lbl === 'B') return 'text-sky-700';
  if (lbl === 'C') return 'text-amber-700';
  if (lbl === 'D') return 'text-red-700';
  return 'text-slate-400';
}

function formatScoreCell(val) {
  if (val === null || val === undefined || val === '') return '-';
  const num = Number(val);
  return Number.isInteger(num) ? String(num) : num.toFixed(1);
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
    const res = await apiRequest(`/nilai-ujian?${params.toString()}`);
    items.value = res.items || [];
    studentSummary.value = res.studentSummary || [];
    kelasOptions.value = res.kelasOptions || [];
    rosterOptions.value = res.rosterOptions || [];
    syncMeta.value = res.syncMeta || null;
    kpiMeta.value = res.kpi || { kkm: 70 };
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
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
    tanggalUjian: defaultDateForPeriode(),
    codeUjian: '',
    pola: 'variable',
    nilaiTunggal: '',
    nilaiMojiGoi: '',
    nilaiBunpou: '',
    nilaiDokkai: '',
    nilaiChoukai: '',
    catatan: '',
  };
  dialogOpen.value = true;
}

function openEdit(row) {
  editingId.value = row.id;
  form.value = {
    pesertaId: row.pesertaId,
    kelasId: row.kelasId,
    tanggalUjian: row.tanggalUjian,
    codeUjian: row.codeUjian,
    pola: row.pola === 'tunggal' ? 'tunggal' : 'variable',
    nilaiTunggal: row.nilaiTunggal ?? '',
    nilaiMojiGoi: row.nilaiMojiGoi ?? '',
    nilaiBunpou: row.nilaiBunpou ?? '',
    nilaiDokkai: row.nilaiDokkai ?? '',
    nilaiChoukai: row.nilaiChoukai ?? '',
    catatan: row.catatan || '',
  };
  dialogOpen.value = true;
}

async function submitForm() {
  saving.value = true;
  try {
    const body = {
      pesertaId: form.value.pesertaId,
      kelasId: form.value.kelasId,
      tanggalUjian: form.value.tanggalUjian,
      codeUjian: String(form.value.codeUjian || '').trim(),
      pola: form.value.pola,
      nilaiTunggal: form.value.pola === 'tunggal' ? parseOptionalNumber(form.value.nilaiTunggal) : null,
      nilaiMojiGoi: form.value.pola === 'variable' ? parseOptionalNumber(form.value.nilaiMojiGoi) : null,
      nilaiBunpou: form.value.pola === 'variable' ? parseOptionalNumber(form.value.nilaiBunpou) : null,
      nilaiDokkai: form.value.pola === 'variable' ? parseOptionalNumber(form.value.nilaiDokkai) : null,
      nilaiChoukai: form.value.pola === 'variable' ? parseOptionalNumber(form.value.nilaiChoukai) : null,
      catatan: String(form.value.catatan || '').trim(),
    };

    if (editingId.value) {
      await apiRequest(`/nilai-ujian/${editingId.value}`, { method: 'PATCH', body });
    } else {
      await apiRequest('/nilai-ujian', { method: 'POST', body });
    }

    dialogOpen.value = false;
    appStore.notify(t('messages.saved'), 'success');
    if (body.tanggalUjian && /^\d{4}-\d{2}/.test(body.tanggalUjian)) {
      filterPeriode.value = body.tanggalUjian.slice(0, 7);
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
    await apiRequest(`/nilai-ujian/${deleteTarget.value.id}`, { method: 'DELETE' });
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
