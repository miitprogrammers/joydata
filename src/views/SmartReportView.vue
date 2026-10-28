<template>
  <div class="space-y-6">
    <!-- Header & actions -->
    <div class="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 font-display">
          {{ $t('smartReport.title') }}
        </h1>
        <p class="text-sm text-slate-600 mt-0.5">{{ $t('smartReport.subtitle') }}</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          v-if="hasReport"
          type="button"
          class="joy-btn-primary text-xs flex items-center gap-1.5 shadow-sm"
          :disabled="bulk.running"
          @click="printReport"
        >
          <v-icon icon="mdi-printer" size="16" />
          <span>{{ $t('smartReport.cetak') }}</span>
        </button>
      </div>
    </div>

    <!-- Selection -->
    <div class="no-print joy-surface p-4 flex flex-wrap items-end gap-4">
      <div class="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
        <button
          v-for="m in MODES"
          :key="m"
          type="button"
          class="px-3 py-1.5 rounded-md transition-colors"
          :class="mode === m ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
          :disabled="bulk.running"
          @click="setMode(m)"
        >
          {{ m === 'peserta' ? $t('smartReport.modePeserta') : $t('smartReport.modeKelas') }}
        </button>
      </div>

      <div class="w-56">
        <label class="block text-xs font-semibold text-slate-700 mb-1">{{ $t('smartReport.pilihKelas') }}:</label>
        <select
          v-model="selectedKelasId"
          class="joy-input w-full py-1.5 px-3 text-xs font-medium"
          :disabled="bulk.running"
          @change="onKelasChange"
        >
          <option value="">{{ mode === 'kelas' ? $t('smartReport.pilihPlaceholder') : $t('common.semuaKelas') }}</option>
          <option v-for="k in options.kelas" :key="k.id" :value="String(k.id)">
            {{ k.namaKelas }} · {{ $t('smartReport.pesertaN', { n: k.jumlahPeserta }) }}
          </option>
        </select>
      </div>

      <div v-if="mode === 'peserta'" class="flex-1 min-w-[240px]">
        <label class="block text-xs font-semibold text-slate-700 mb-1">{{ $t('smartReport.pilihPeserta') }}:</label>
        <select
          v-model="selectedPesertaId"
          class="joy-input w-full py-1.5 px-3 text-xs font-medium"
          @change="loadReport"
        >
          <option value="">{{ $t('smartReport.pilihPlaceholder') }}</option>
          <option v-for="p in pesertaOptions" :key="p.id" :value="String(p.id)">
            {{ p.nama }} (ID #{{ p.mancationAkunId || p.id }}) · {{ p.namaKelas }}
          </option>
        </select>
      </div>

      <button
        type="button"
        class="joy-btn-secondary text-xs py-2 px-3"
        :disabled="loading || bulk.running || !selectionReady"
        @click="loadReport"
      >
        <v-icon icon="mdi-refresh" size="16" />
      </button>
    </div>

    <div v-if="!canWrite && !(mode === 'kelas' && kelasData)" class="no-print text-[11px] text-slate-500 -mt-3">
      {{ $t('smartReport.resumeHanyaBaca') }}
    </div>

    <!-- Class mode: every resume of the bundle in one action -->
    <div
      v-if="mode === 'kelas' && kelasData && !loading"
      class="no-print joy-surface p-4 flex flex-col sm:flex-row sm:items-center gap-3"
    >
      <div class="flex-1 min-w-0">
        <div class="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
          <v-icon icon="mdi-creation" size="16" class="text-blue-800" />
          {{ $t('smartReport.panelJudul') }}
        </div>
        <div class="text-xs text-slate-500 mt-0.5">
          {{
            bulk.running
              ? $t('smartReport.buatSemuaProgres', { done: bulk.done, n: bulk.total })
              : $t('smartReport.statusResume', resumeStatus)
          }}
        </div>
        <div v-if="bulk.running" class="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{ width: `${(bulk.done / bulk.total) * 100}%`, background: '#1E3A8A' }"
          />
        </div>
      </div>

      <div v-if="!canWrite" class="text-xs text-slate-500">{{ $t('smartReport.resumeHanyaBaca') }}</div>
      <div v-else-if="bulk.running" class="flex items-center gap-2">
        <v-progress-circular indeterminate size="16" width="2" color="primary" />
        <button type="button" class="joy-btn-secondary text-xs" :disabled="bulk.stop" @click="bulk.stop = true">
          {{ $t('smartReport.hentikan') }}
        </button>
      </div>
      <div v-else class="flex flex-wrap items-center gap-2">
        <button
          v-if="resumeStatus.siap > 0"
          type="button"
          class="joy-btn-secondary text-xs"
          @click="generateAll(true)"
        >
          {{ $t('smartReport.buatUlangSemua') }}
        </button>
        <button
          type="button"
          class="joy-btn-primary text-xs flex items-center gap-1.5 shadow-sm"
          :disabled="!pendingResumes.length"
          @click="generateAll(false)"
        >
          <v-icon icon="mdi-creation" size="16" />
          {{
            pendingResumes.length
              ? $t('smartReport.buatSemua', { n: pendingResumes.length })
              : $t('smartReport.semuaResumeTerkini')
          }}
        </button>
      </div>
    </div>

    <!-- States -->
    <div v-if="loading" class="joy-surface p-12 text-center text-slate-500 no-print">
      <v-progress-circular indeterminate color="primary" size="32" class="mb-3" />
      <div class="text-sm font-medium">{{ $t('common.memuat') }}</div>
    </div>

    <div v-else-if="error" class="joy-surface p-8 text-center text-red-600 bg-red-50/50 border border-red-200 no-print">
      <div class="text-sm font-semibold">{{ error }}</div>
    </div>

    <div v-else-if="!hasReport" class="joy-surface p-12 text-center text-slate-400 no-print">
      <v-icon icon="mdi-file-chart-outline" size="48" class="text-slate-300 mb-2" />
      <div class="text-sm font-medium text-slate-600">{{ $t('smartReport.kosongJudul') }}</div>
      <div class="text-xs text-slate-400 mt-1">{{ $t('smartReport.kosongDesc') }}</div>
    </div>

    <!-- Printable bundle: class page first, then one report per peserta, each on its own page -->
    <div v-else id="smart-report-print" class="space-y-6 print:space-y-0">
      <template v-if="mode === 'peserta' && pesertaData">
        <PesertaReport
          :report="pesertaData.peserta"
          :settings="pesertaData.settings"
          :print-date="printDate"
          :can-write="canWrite"
          :generate="() => generateResume('peserta', pesertaData.peserta.student.id)"
          :save="(payload) => saveResume('peserta', pesertaData.peserta.student.id, payload)"
        />
      </template>
      <template v-else-if="mode === 'kelas' && kelasData">
        <KelasSummary
          :kelas="kelasData.kelas"
          :summary="kelasData.ringkasan"
          :resume="kelasData.resume"
          :settings="kelasData.settings"
          :print-date="printDate"
          :can-write="canWrite"
          :busy="isBulkTarget('kelas', kelasData.kelas.id)"
          :locked="bulk.running"
          :generate="() => generateResume('kelas', kelasData.kelas.id)"
          :save="(payload) => saveResume('kelas', kelasData.kelas.id, payload)"
        />
        <PesertaReport
          v-for="p in kelasData.peserta"
          :key="p.student.id"
          :report="p"
          :settings="kelasData.settings"
          :print-date="printDate"
          :can-write="canWrite"
          :busy="isBulkTarget('peserta', p.student.id)"
          :locked="bulk.running"
          :generate="() => generateResume('peserta', p.student.id)"
          :save="(payload) => saveResume('peserta', p.student.id, payload)"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '../stores/appStore.js';
import { apiRequest } from '../services/api.js';
import PesertaReport from '../components/smart-report/PesertaReport.vue';
import KelasSummary from '../components/smart-report/KelasSummary.vue';

type Mode = 'peserta' | 'kelas';
type Scope = 'peserta' | 'kelas';
type ResumePayload = { teksId: string; teksJa: string };

const MODES: Mode[] = ['peserta', 'kelas'];
// Writing a resume calls Gemini (billed), so only these roles may do it; the server enforces the same rule.
const WRITER_ROLES = ['admin', 'manager'];
// Resumes written at the same time in a bulk run: about 3x faster, well under the AI providers' rate limits.
const BULK_CONCURRENCY = 3;
// Errors that will fail every remaining resume the same way, so a bulk run stops at the first one.
const BULK_FATAL_CODES = new Set(['AI_NOT_CONFIGURED', 'AI_ACCESS_DENIED', 'ROLE_NOT_ALLOWED', 'FORBIDDEN_PAGE_ACCESS']);

const route = useRoute();
const router = useRouter();
const { t, te, locale } = useI18n();
const appStore = useAppStore();

const mode = ref<Mode>('peserta');
const selectedKelasId = ref('');
const selectedPesertaId = ref('');
const options = ref<{ kelas: any[]; peserta: any[] }>({ kelas: [], peserta: [] });

const loading = ref(false);
const error = ref('');
const pesertaData = ref<any>(null);
const kelasData = ref<any>(null);

const bulk = reactive({ running: false, stop: false, done: 0, total: 0, active: [] as string[] });

const canWrite = computed(() => WRITER_ROLES.includes(appStore.user?.role?.kode));

const pesertaOptions = computed(() =>
  selectedKelasId.value
    ? options.value.peserta.filter((p) => String(p.kelasId) === selectedKelasId.value)
    : options.value.peserta
);

const selectionReady = computed(() => (mode.value === 'kelas' ? !!selectedKelasId.value : !!selectedPesertaId.value));

const hasReport = computed(() => (mode.value === 'kelas' ? !!kelasData.value : !!pesertaData.value));

type ResumeTarget = { scope: Scope; id: number; nama: string; resume: any };

// Every resume of the class bundle: one per peserta, then the class resume.
const resumeTargets = computed<ResumeTarget[]>(() => {
  if (!kelasData.value) return [];
  return [
    ...kelasData.value.peserta.map((p: any) => ({ scope: 'peserta' as Scope, id: p.student.id, nama: p.student.nama, resume: p.resume })),
    { scope: 'kelas', id: kelasData.value.kelas.id, nama: kelasData.value.kelas.namaKelas, resume: kelasData.value.resume },
  ];
});

// Missing, or written from older data.
const pendingResumes = computed(() => resumeTargets.value.filter((r) => !r.resume || r.resume.usang));

const resumeStatus = computed(() => {
  const all = resumeTargets.value;
  return {
    total: all.length,
    siap: all.filter((r) => r.resume && !r.resume.usang).length,
    belum: all.filter((r) => !r.resume).length,
    usang: all.filter((r) => r.resume?.usang).length,
  };
});

const printDate = computed(() =>
  new Date().toLocaleDateString(locale.value === 'ja' ? 'ja-JP' : 'id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
);

function errorText(err: any) {
  const key = `messages.${err?.code}`;
  return te(key) ? t(key) : t('messages.GENERIC_ERROR');
}

function syncQuery() {
  const query: Record<string, string> = { mode: mode.value };
  if (selectedKelasId.value) query.kelasId = selectedKelasId.value;
  if (mode.value === 'peserta' && selectedPesertaId.value) query.pesertaId = selectedPesertaId.value;
  router.replace({ query });
}

async function loadOptions() {
  try {
    options.value = await apiRequest('/laporan/opsi');
  } catch (err: any) {
    error.value = errorText(err);
  }
}

async function loadReport() {
  syncQuery();
  error.value = '';
  if (!selectionReady.value) {
    pesertaData.value = null;
    kelasData.value = null;
    return;
  }
  loading.value = true;
  try {
    if (mode.value === 'kelas') {
      kelasData.value = await apiRequest(`/smart-report/kelas/${selectedKelasId.value}`);
    } else {
      pesertaData.value = await apiRequest(`/smart-report/peserta/${selectedPesertaId.value}`);
    }
  } catch (err: any) {
    error.value = errorText(err);
  } finally {
    loading.value = false;
  }
}

function setMode(next: Mode) {
  if (mode.value === next) return;
  mode.value = next;
  loadReport();
}

function onKelasChange() {
  if (mode.value === 'peserta') {
    const stillListed = pesertaOptions.value.some((p) => String(p.id) === selectedPesertaId.value);
    if (!stillListed) selectedPesertaId.value = '';
  }
  loadReport();
}

function applyResume(scope: Scope, id: number, resume: any) {
  if (scope === 'kelas') {
    if (kelasData.value?.kelas.id === id) kelasData.value.resume = resume;
    return;
  }
  if (pesertaData.value?.peserta.student.id === id) pesertaData.value.peserta.resume = resume;
  const inKelas = kelasData.value?.peserta.find((p: any) => p.student.id === id);
  if (inKelas) inKelas.resume = resume;
}

async function generateResume(scope: Scope, id: number) {
  try {
    applyResume(scope, id, await apiRequest(`/smart-report/resume/${scope}/${id}`, { method: 'POST' }));
    appStore.notify(t('smartReport.resumeBerhasil'), 'success');
  } catch (err: any) {
    appStore.notify(errorText(err), 'error');
  }
}

async function saveResume(scope: Scope, id: number, payload: ResumePayload) {
  try {
    applyResume(scope, id, await apiRequest(`/smart-report/resume/${scope}/${id}`, { method: 'PUT', body: payload }));
    appStore.notify(t('smartReport.resumeTersimpan'), 'success');
  } catch (err: any) {
    appStore.notify(errorText(err), 'error');
    throw err;
  }
}

const targetKey = (scope: Scope, id: number) => `${scope}:${id}`;

function isBulkTarget(scope: Scope, id: number) {
  return bulk.active.includes(targetKey(scope, id));
}

/**
 * Writes the resumes of the class bundle, BULK_CONCURRENCY at a time, one request each so every call stays
 * inside the serverless time limit. all = rewrite every resume, otherwise only missing and outdated ones.
 * A failure does not stop the others; pressing the button again retries what is still missing.
 */
async function generateAll(all: boolean) {
  const queue = all ? [...resumeTargets.value] : [...pendingResumes.value];
  if (!queue.length) return;
  if (all && !confirm(t('smartReport.konfirmasiBuatUlangSemua', { n: queue.length }))) return;

  Object.assign(bulk, { running: true, stop: false, done: 0, total: queue.length, active: [] });
  const failed: { nama: string; err: any }[] = [];
  let next = 0;

  const worker = async () => {
    while (!bulk.stop && next < queue.length) {
      const item = queue[next++];
      const key = targetKey(item.scope, item.id);
      bulk.active.push(key);
      try {
        applyResume(item.scope, item.id, await apiRequest(`/smart-report/resume/${item.scope}/${item.id}`, { method: 'POST' }));
      } catch (err: any) {
        failed.push({ nama: item.nama, err });
        if (BULK_FATAL_CODES.has(err?.code)) bulk.stop = true;
      } finally {
        bulk.active = bulk.active.filter((k) => k !== key);
        bulk.done += 1;
      }
    }
  };

  try {
    await Promise.all(Array.from({ length: Math.min(BULK_CONCURRENCY, queue.length) }, worker));
  } finally {
    const ok = bulk.done - failed.length;
    if (failed.length) {
      appStore.notify(
        t('smartReport.buatSemuaSebagian', {
          ok,
          gagal: failed.length,
          nama: failed.map((f) => f.nama).join(', '),
          pesan: errorText(failed[0].err),
        }),
        'error'
      );
    } else if (bulk.stop) {
      appStore.notify(t('smartReport.buatSemuaDihentikan', { ok }), 'info');
    } else {
      appStore.notify(t('smartReport.buatSemuaSelesai', { n: ok }), 'success');
    }
    Object.assign(bulk, { running: false, stop: false, active: [] });
  }
}

function printReport() {
  window.print();
}

onMounted(async () => {
  await loadOptions();
  const q = route.query;
  if (q.mode === 'kelas' || q.mode === 'peserta') mode.value = q.mode;
  if (q.kelasId) selectedKelasId.value = String(q.kelasId);
  if (q.pesertaId) selectedPesertaId.value = String(q.pesertaId);
  if (selectionReady.value) await loadReport();
});
</script>

<style>
/* Shared by the Smart Report components; in the components layer so Tailwind utilities still win. */
@layer components {
  .sr-section-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #0f172a;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
  }

  .sr-title-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
  }

  .sr-title-row .sr-section-title {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .sr-table {
    width: 100%;
    font-size: 11px;
    border: 1px solid #e2e8f0;
    border-collapse: collapse;
  }

  .sr-table th {
    background: #f8fafc;
    color: #475569;
    font-size: 10.5px;
    font-weight: 600;
    padding: 5px 8px;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
    text-align: left;
  }

  .sr-table td {
    padding: 4px 8px;
    border-top: 1px solid #f1f5f9;
    color: #334155;
    vertical-align: top;
  }

  .sr-num td {
    font-variant-numeric: tabular-nums;
  }

  .sr-note-row td {
    border-top: 0;
    padding: 0 8px 6px 16px;
    font-size: 10px;
    font-style: italic;
    color: #64748b;
    white-space: pre-line;
  }
}

@media print {
  .no-print,
  .v-navigation-drawer,
  .v-app-bar,
  .v-snackbar,
  .joy-page-preloader,
  header,
  nav,
  footer {
    display: none !important;
  }

  .v-main {
    padding: 0 !important;
  }

  .v-application__wrap {
    min-height: 0 !important;
  }

  html,
  body,
  .v-application,
  .v-main {
    background: white !important;
  }

  #smart-report-print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    zoom: 0.82;
  }

  #smart-report-print .sr-page {
    max-width: none;
  }

  #smart-report-print .sr-page + .sr-page {
    break-before: page;
  }

  #smart-report-print tr,
  #smart-report-print .sr-keep,
  #smart-report-print .sr-resume {
    break-inside: avoid;
  }

  #smart-report-print thead {
    display: table-header-group;
  }

  @page {
    size: A4 portrait;
    margin: 1cm 1.2cm;
  }
}
</style>
