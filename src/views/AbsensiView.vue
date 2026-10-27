<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('absensi.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">{{ $t('absensi.subheading') }}</p>
      </div>
    </div>

    <!-- Snapshot Notice -->
    <div
      v-if="syncMeta && syncMeta.source !== 'mysql_live'"
      class="joy-surface px-4 py-2.5 text-xs text-amber-800 bg-amber-50/70 flex items-center justify-between gap-3"
    >
      <span>{{ $t('app.snapshotNotice') }}</span>
    </div>

    <!-- Unfilled Attendance Reminder Banner (§14.5) -->
    <div
      v-if="pengingatHariIni"
      class="joy-surface p-4"
      :class="pengingatHariIni.belumDiisi?.length ? 'bg-amber-50/50' : 'bg-emerald-50/40'"
    >
      <div
        v-if="pengingatHariIni.belumDiisi?.length"
        class="flex flex-col gap-3"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="text-sm font-semibold text-amber-900">
            {{ $t('absensi.reminderTitle') }}
            <span class="ml-1 font-mono tabular-nums text-xs text-amber-800">
              ({{ pengingatHariIni.tanggal }})
            </span>
          </div>
          <div class="text-xs text-amber-800 font-mono tabular-nums">
            {{ pengingatHariIni.belumDiisi.length }} / {{ pengingatHariIni.totalKelasAktif }}
          </div>
        </div>
        <div class="pt-2 border-t border-amber-200/70 divide-y divide-amber-200/50">
          <div
            v-for="kl in pengingatHariIni.belumDiisi"
            :key="kl.id"
            class="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
          >
            <div class="min-w-0 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
              <span class="font-semibold text-slate-900">{{ kl.namaKelas }}</span>
              <span class="text-slate-400" aria-hidden="true">·</span>
              <span class="text-xs text-slate-600">{{ kl.senseiNama }}</span>
              <span class="text-slate-400" aria-hidden="true">·</span>
              <span class="text-xs text-slate-600 tabular-nums font-mono">{{ kl.jumlahPeserta }} peserta</span>
            </div>
            <v-btn
              color="primary"
              variant="tonal"
              size="x-small"
              class="text-none whitespace-nowrap shrink-0"
              :aria-label="`${$t('absensi.fillNowBtn')} ${kl.namaKelas}`"
              @click="jumpToUnfilledClass(kl.id, pengingatHariIni.tanggal)"
            >
              {{ $t('absensi.fillNowBtn') }}
            </v-btn>
          </div>
        </div>
      </div>
      <div v-else class="flex items-center justify-between gap-3 text-sm text-emerald-900 font-medium">
        <span>{{ $t('absensi.reminderDone') }}</span>
        <span class="text-xs font-mono tabular-nums text-emerald-700">{{ pengingatHariIni.tanggal }}</span>
      </div>
    </div>

    <!-- Interactive Mode Switcher -->
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div class="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
        <button
          type="button"
          class="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0"
          :class="activeTab === 'wizard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          @click="activeTab = 'wizard'"
        >
          {{ $t('absensi.tabWizard') }}
        </button>
        <button
          type="button"
          class="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0"
          :class="activeTab === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          @click="activeTab = 'monthly'"
        >
          {{ $t('absensi.tabMonthly') }}
        </button>
      </div>
    </div>

    <!-- =================================================================== -->
    <!-- TAB 1: DAILY ATTENDANCE WIZARD                                      -->
    <!-- =================================================================== -->
    <template v-if="activeTab === 'wizard'">
      <!-- Step 1: Date & Class Selection -->
      <div class="joy-surface p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h2 class="text-sm font-bold text-slate-900 font-display">{{ $t('absensi.step1Label') }}</h2>
          <span
            class="text-xs font-medium"
            :class="alreadyRecorded ? 'text-sky-700' : 'text-emerald-700'"
          >
            {{ alreadyRecorded ? $t('absensi.statusRecorded') : $t('absensi.statusNewDefault') }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div class="sm:col-span-4">
            <v-text-field
              v-model="tanggalWizard"
              type="date"
              :label="$t('absensi.tanggalAbsen')"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="onWizardFilterChange"
            />
          </div>
          <div class="sm:col-span-5">
            <v-select
              v-model="selectedKelasId"
              :items="kelasSelectItems"
              item-title="label"
              item-value="value"
              :label="$t('absensi.pilihKelas')"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="onWizardFilterChange"
            />
          </div>
          <div class="sm:col-span-3 flex sm:justify-end">
            <v-btn
              variant="outlined"
              color="primary"
              size="small"
              prepend-icon="mdi-check-all"
              class="text-none whitespace-nowrap"
              :disabled="!wizardRows.length"
              @click="markAllHadir"
            >
              {{ $t('absensi.markAllHadirBtn') }}
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Step 2: Roster Attendance Checklist -->
      <div class="joy-surface overflow-hidden">
        <div class="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-sm font-bold text-slate-900 font-display">{{ $t('absensi.step2Label') }}</h2>
          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold tabular-nums font-mono">
            <span class="text-emerald-700">{{ $t('absensi.hadir') }}: {{ wizardCounts.hadir }}</span>
            <span class="text-slate-300" aria-hidden="true">·</span>
            <span class="text-sky-700">{{ $t('absensi.izin') }}: {{ wizardCounts.izin }}</span>
            <span class="text-slate-300" aria-hidden="true">·</span>
            <span class="text-amber-700">{{ $t('absensi.sakit') }}: {{ wizardCounts.sakit }}</span>
            <span class="text-slate-300" aria-hidden="true">·</span>
            <span class="text-red-700">{{ $t('absensi.alfa') }}: {{ wizardCounts.alfa }}</span>
          </div>
        </div>

        <div v-if="loading" class="p-6">
          <v-skeleton-loader type="table-row-divider@6" />
        </div>
        <div v-else-if="!wizardRows.length" class="p-8 text-center text-sm text-slate-500">
          {{ $t('app.noData') }}
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse joy-table">
            <thead>
              <tr>
                <th class="px-5 py-3 w-12">#</th>
                <th class="px-4 py-3">{{ $t('absensi.colPeserta') }}</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-5 py-3">{{ $t('kelas.description') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in wizardRows" :key="row.pesertaId">
                <td class="px-5 py-2.5 tabular-nums font-mono text-xs text-slate-400">{{ idx + 1 }}</td>
                <td class="px-4 py-2.5">
                  <span class="font-semibold text-slate-900">{{ row.pesertaNama }}</span>
                  <span v-if="row.mancationAkunId" class="ml-2 text-xs text-slate-400 font-mono tabular-nums">
                    #{{ row.mancationAkunId }}
                  </span>
                </td>
                <td class="px-4 py-2.5 whitespace-nowrap">
                  <div class="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                    <button
                      v-for="opt in statusOptions"
                      :key="opt.value"
                      type="button"
                      class="px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap"
                      :class="
                        row.status === opt.value
                          ? opt.activeClass
                          : 'text-slate-600 hover:text-slate-900'
                      "
                      :aria-label="`${row.pesertaNama} ${opt.label}`"
                      @click="row.status = opt.value"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </td>
                <td class="px-5 py-2 min-w-[220px]">
                  <input
                    v-model="row.description"
                    type="text"
                    :placeholder="$t('absensi.keteranganPlaceholder')"
                    :aria-label="`${$t('kelas.description')} ${row.pesertaNama}`"
                    class="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-slate-500"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="wizardRows.length"
          class="px-5 py-4 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between gap-4 flex-wrap"
        >
          <div class="text-xs text-slate-600 font-mono tabular-nums">
            {{ tanggalWizard }} · {{ wizardRows.length }} peserta
          </div>
          <v-btn
            color="primary"
            variant="flat"
            prepend-icon="mdi-content-save-check-outline"
            class="text-none"
            :loading="saving"
            @click="submitWizard"
          >
            {{ $t('absensi.submitWizardBtn') }}
          </v-btn>
        </div>
      </div>
    </template>

    <!-- =================================================================== -->
    <!-- TAB 2: MONTHLY ATTENDANCE RATIO RECAP (§5)                          -->
    <!-- =================================================================== -->
    <template v-else>
      <!-- Monthly Filter Bar -->
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
          <div class="sm:col-span-4">
            <v-select
              v-model="selectedKelasId"
              :items="kelasSelectItems"
              item-title="label"
              item-value="value"
              :label="$t('absensi.pilihKelas')"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="loadData"
            />
          </div>
          <div class="sm:col-span-5">
            <v-text-field
              v-model="searchMonthly"
              :placeholder="$t('app.search')"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              clearable
              hide-details
            />
          </div>
        </div>
      </div>

      <!-- 3 Monthly KPI Blocks -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="joy-surface p-4">
          <div class="text-xs font-medium text-slate-500">{{ $t('absensi.kpiSesiKelas') }}</div>
          <div class="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums font-mono">
            {{ monthly.sesiKelas }}
          </div>
          <div class="mt-1 text-xs text-slate-500 truncate tabular-nums font-mono">
            {{
              monthly.tanggalTercatat?.length
                ? monthly.tanggalTercatat.slice(0, 4).join(', ') +
                  (monthly.tanggalTercatat.length > 4 ? ` (+${monthly.tanggalTercatat.length - 4})` : '')
                : '-'
            }}
          </div>
        </div>

        <div class="joy-surface p-4">
          <div class="text-xs font-medium text-slate-500">{{ $t('absensi.kpiRasioKelas') }}</div>
          <div
            class="mt-1.5 text-2xl font-bold tabular-nums font-mono"
            :class="
              monthly.sesiKelas === 0 || monthly.rasioKelas === null
                ? 'text-slate-400'
                : monthly.rasioKelas >= appStore.settings.ambang_kehadiran_rendah
                  ? 'text-emerald-700'
                  : 'text-red-700'
            "
          >
            {{
              monthly.sesiKelas === 0 || monthly.rasioKelas === null
                ? '-'
                : `${Number(monthly.rasioKelas).toFixed(1)}%`
            }}
          </div>
          <div class="mt-1 text-xs text-slate-500">Σ Hadir / (S × Roster)</div>
        </div>

        <div class="joy-surface p-4">
          <div class="text-xs font-medium text-slate-500">{{ $t('absensi.kpiPesertaRoster') }}</div>
          <div class="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums font-mono">
            {{ monthly.jumlahPesertaRoster }}
          </div>
          <div class="mt-1 text-xs text-slate-500 tabular-nums">{{ filterPeriode }}</div>
        </div>
      </div>

      <!-- S = 0 Notice -->
      <div
        v-if="!loading && monthly.sesiKelas === 0"
        class="joy-surface px-4 py-3 text-xs text-slate-600 bg-slate-50"
      >
        {{ $t('absensi.noSessionNotice') }}
      </div>

      <!-- Monthly Student Recap Table -->
      <div class="joy-surface overflow-hidden">
        <div v-if="loading" class="p-6">
          <v-skeleton-loader type="table-row-divider@6" />
        </div>
        <div v-else-if="!displayedStudentRecap.length" class="p-8 text-center text-sm text-slate-500">
          {{ $t('app.noData') }}
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse joy-table">
            <thead>
              <tr>
                <th class="px-5 py-3">{{ $t('absensi.colPeserta') }}</th>
                <th class="px-3 py-3 text-right whitespace-nowrap">{{ $t('absensi.colHadir') }}</th>
                <th class="px-3 py-3 text-right whitespace-nowrap">{{ $t('absensi.colIzin') }}</th>
                <th class="px-3 py-3 text-right whitespace-nowrap">{{ $t('absensi.colSakit') }}</th>
                <th class="px-3 py-3 text-right whitespace-nowrap">{{ $t('absensi.colAlfa') }}</th>
                <th class="px-4 py-3 text-right whitespace-nowrap">S</th>
                <th class="px-4 py-3 text-right whitespace-nowrap">{{ $t('absensi.colRasioHadir') }}</th>
                <th class="px-5 py-3 text-right whitespace-nowrap">{{ $t('absensi.colRasioNonHadir') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="st in displayedStudentRecap" :key="st.pesertaId">
                <td class="px-5 py-2.5">
                  <span class="font-semibold text-slate-900">{{ st.pesertaNama }}</span>
                  <span v-if="st.mancationAkunId" class="ml-2 text-xs text-slate-400 font-mono tabular-nums">
                    #{{ st.mancationAkunId }}
                  </span>
                </td>
                <td class="px-3 py-2.5 text-right tabular-nums font-mono text-emerald-700 font-semibold">
                  {{ st.hadir }}
                </td>
                <td class="px-3 py-2.5 text-right tabular-nums font-mono text-sky-700">
                  {{ st.izin }}
                </td>
                <td class="px-3 py-2.5 text-right tabular-nums font-mono text-amber-700">
                  {{ st.sakit }}
                </td>
                <td class="px-3 py-2.5 text-right tabular-nums font-mono text-red-700">
                  {{ st.alfa }}
                </td>
                <td class="px-4 py-2.5 text-right tabular-nums font-mono text-slate-500">
                  {{ monthly.sesiKelas }}
                </td>
                <td
                  class="px-4 py-2.5 text-right tabular-nums font-mono font-bold whitespace-nowrap"
                  :class="
                    monthly.sesiKelas === 0 || st.rasioKehadiran === null
                      ? 'text-slate-400 font-normal'
                      : st.rasioKehadiran >= appStore.settings.ambang_kehadiran_rendah
                        ? 'text-slate-900'
                        : 'text-red-700'
                  "
                >
                  {{ formatRatio(st.rasioKehadiran, monthly.sesiKelas) }}
                </td>
                <td class="px-5 py-2.5 text-right tabular-nums font-mono text-slate-600 whitespace-nowrap">
                  {{ formatRatio(st.rasioKetidakhadiran, monthly.sesiKelas) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';

const route = useRoute();
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
const activeTab = ref('wizard');

const filterPeriode = ref(currentMonthIso());
const tanggalWizard = ref(todayIso());
const selectedKelasId = ref(null);
const searchMonthly = ref('');

const syncMeta = ref(null);
const kelasOptions = ref([]);
const pengingatHariIni = ref(null);
const alreadyRecorded = ref(false);
const wizardRows = ref([]);
const monthly = ref({
  sesiKelas: 0,
  tanggalTercatat: [],
  rasioKelas: null,
  jumlahPesertaRoster: 0,
  studentRecap: [],
});

const kelasSelectItems = computed(() =>
  kelasOptions.value.map((k) => ({
    value: k.id,
    label: `${k.namaKelas}${k.status === 'selesai' ? ` (${t('kelas.statusSelesai')})` : ''}`,
  }))
);

const statusOptions = computed(() => [
  { value: 'hadir', label: t('absensi.hadir'), activeClass: 'bg-white text-emerald-800 shadow-xs' },
  { value: 'izin', label: t('absensi.izin'), activeClass: 'bg-white text-sky-800 shadow-xs' },
  { value: 'sakit', label: t('absensi.sakit'), activeClass: 'bg-white text-amber-800 shadow-xs' },
  { value: 'alfa', label: t('absensi.alfa'), activeClass: 'bg-white text-red-800 shadow-xs' },
]);

const wizardCounts = computed(() => {
  const counts = { hadir: 0, izin: 0, sakit: 0, alfa: 0 };
  for (const r of wizardRows.value) {
    if (counts[r.status] !== undefined) counts[r.status] += 1;
  }
  return counts;
});

const displayedStudentRecap = computed(() => {
  const list = monthly.value.studentRecap || [];
  const q = String(searchMonthly.value || '').trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (s) =>
      String(s.pesertaNama || '').toLowerCase().includes(q) ||
      String(s.mancationAkunId || '').includes(q)
  );
});

function formatRatio(val, sesiKelas) {
  if (!sesiKelas || val === null || val === undefined) return '-';
  return `${Number(val).toFixed(1)}%`;
}

async function loadData() {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (filterPeriode.value) params.set('periode', filterPeriode.value);
    if (tanggalWizard.value) params.set('tanggal', tanggalWizard.value);
    if (selectedKelasId.value) params.set('kelasId', String(selectedKelasId.value));

    const res = await apiRequest(`/absensi?${params.toString()}`);
    syncMeta.value = res.syncMeta || null;
    kelasOptions.value = res.kelasOptions || [];
    if (res.kelasId) {
      selectedKelasId.value = res.kelasId;
    }
    pengingatHariIni.value = res.pengingatHariIni || null;
    alreadyRecorded.value = Boolean(res.wizard?.alreadyRecorded);
    wizardRows.value = (res.wizard?.rows || []).map((r) => ({ ...r }));
    monthly.value = res.monthly || {
      sesiKelas: 0,
      tanggalTercatat: [],
      rasioKelas: null,
      jumlahPesertaRoster: 0,
      studentRecap: [],
    };
  } catch (err) {
    const key = `messages.${err.code}`;
    appStore.notify(t(key) !== key ? t(key) : t('messages.GENERIC_ERROR'), 'error');
  } finally {
    loading.value = false;
  }
}

function onWizardFilterChange() {
  if (tanggalWizard.value && /^\d{4}-\d{2}/.test(tanggalWizard.value)) {
    filterPeriode.value = tanggalWizard.value.slice(0, 7);
  }
  loadData();
}

function jumpToUnfilledClass(kelasId, tanggal) {
  activeTab.value = 'wizard';
  selectedKelasId.value = Number(kelasId);
  if (tanggal) {
    tanggalWizard.value = tanggal;
    filterPeriode.value = tanggal.slice(0, 7);
  }
  loadData();
}

function markAllHadir() {
  wizardRows.value = wizardRows.value.map((r) => ({
    ...r,
    status: 'hadir',
  }));
}

async function submitWizard() {
  if (!selectedKelasId.value || !wizardRows.value.length) return;
  saving.value = true;
  try {
    const res = await apiRequest('/absensi/wizard', {
      method: 'POST',
      body: {
        kelasId: selectedKelasId.value,
        tanggalAbsensi: tanggalWizard.value,
        entries: wizardRows.value.map((r) => ({
          pesertaId: r.pesertaId,
          status: r.status,
          description: r.description || '',
        })),
      },
    });
    appStore.notify(t('messages.absensiSaved', { count: res.savedCount }), 'success');
    await loadData();
  } catch (err) {
    const key = `messages.${err.code}`;
    appStore.notify(t(key) !== key ? t(key) : t('messages.GENERIC_ERROR'), 'error');
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  if (route.query.tanggal && /^\d{4}-\d{2}-\d{2}$/.test(String(route.query.tanggal))) {
    tanggalWizard.value = String(route.query.tanggal);
    filterPeriode.value = tanggalWizard.value.slice(0, 7);
  }
  if (route.query.kelasId && Number(route.query.kelasId) > 0) {
    selectedKelasId.value = Number(route.query.kelasId);
  }
  if (route.query.tab === 'monthly') {
    activeTab.value = 'monthly';
  }
  loadData();
});
</script>
