<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 font-display">
          {{ $t('progres.title') }}
        </h1>
        <p class="text-sm text-slate-600 mt-0.5">
          {{ $t('progres.subtitle') }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="joy-btn-secondary text-xs flex items-center gap-1.5"
          :disabled="exporting"
          @click="handleExportCsv"
        >
          <v-icon icon="mdi-download" size="16" />
          <span>{{ $t('progres.exportCsv') }}</span>
        </button>
      </div>
    </div>

    <!-- Mode Selector & Quick Filters -->
    <div class="joy-surface p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Mode Tabs -->
      <div class="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
        <button
          type="button"
          class="px-4 py-1.5 rounded-md text-xs font-semibold transition-all"
          :class="viewMode === 'peserta' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
          @click="viewMode = 'peserta'"
        >
          <v-icon icon="mdi-account-group" size="16" class="mr-1" />
          {{ $t('progres.modePeserta') }}
        </button>
        <button
          type="button"
          class="px-4 py-1.5 rounded-md text-xs font-semibold transition-all"
          :class="viewMode === 'kelas' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
          @click="viewMode = 'kelas'"
        >
          <v-icon icon="mdi-google-classroom" size="16" class="mr-1" />
          {{ $t('progres.modeKelas') }}
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Periode Picker -->
        <div class="flex items-center gap-1.5 text-xs text-slate-600">
          <span class="font-medium">{{ $t('common.periode') }}:</span>
          <input
            v-model="selectedPeriode"
            type="month"
            class="joy-input py-1 px-2.5 text-xs font-medium w-36"
            @change="fetchData"
          />
        </div>

        <!-- Kelas Filter -->
        <div class="flex items-center gap-1.5 text-xs text-slate-600">
          <span class="font-medium">{{ $t('common.kelas') }}:</span>
          <select
            v-model="selectedKelasId"
            class="joy-input py-1 px-2.5 text-xs font-medium"
            @change="fetchData"
          >
            <option value="">{{ $t('common.semuaKelas') }}</option>
            <option v-for="k in kelasList" :key="k.id" :value="k.id">
              {{ k.namaKelas }}
            </option>
          </select>
        </div>

        <!-- Tag Filter -->
        <div class="flex items-center gap-1.5 text-xs text-slate-600">
          <span class="font-medium">Tag:</span>
          <select
            v-model="selectedTag"
            class="joy-input py-1 px-2.5 text-xs font-medium"
            @change="fetchData"
          >
            <option value="">{{ $t('common.semuaTag') }}</option>
            <option value="standar">{{ $t('tag.standar') }}</option>
            <option value="berkembang">{{ $t('tag.berkembang') }}</option>
            <option value="siap_interview">{{ $t('tag.siap_interview') }}</option>
          </select>
        </div>

        <!-- Quick Filter Button: Siap Interview -->
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5"
          :class="
            selectedTag === 'siap_interview'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          "
          @click="toggleSiapInterviewFilter"
        >
          <span>🎯</span>
          <span>{{ $t('progres.kandidatInterview') }}</span>
          <span
            class="px-1.5 py-0.2 rounded text-[10px] font-bold"
            :class="selectedTag === 'siap_interview' ? 'bg-emerald-700 text-white' : 'bg-emerald-200 text-emerald-900'"
          >
            {{ kandidatInterviewCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="joy-surface p-12 text-center text-slate-500">
      <v-progress-circular indeterminate color="primary" size="32" class="mb-3" />
      <div class="text-sm font-medium">{{ $t('common.memuat') }}</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="joy-surface p-8 text-center text-red-600 bg-red-50/50 border border-red-200">
      <div class="text-sm font-semibold">{{ error }}</div>
      <button type="button" class="mt-3 joy-btn-secondary text-xs" @click="fetchData">
        {{ $t('common.cobaLagi') }}
      </button>
    </div>

    <template v-else>
      <!-- MODE PER KELAS -->
      <div v-if="viewMode === 'kelas'" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="summary in kelasSummaryList"
            :key="summary.kelasId"
            class="joy-surface p-5 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between">
                <h3 class="text-base font-bold text-slate-900 font-display">
                  {{ summary.namaKelas }}
                </h3>
                <span class="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  {{ summary.jumlahPeserta }} {{ $t('common.peserta') }}
                </span>
              </div>
              <div class="text-xs text-slate-500 mt-0.5">
                Sensei: <span class="font-medium text-slate-700">{{ summary.senseiNama }}</span>
              </div>

              <!-- Tag Breakdown -->
              <div class="mt-3 pt-3 border-t border-slate-100">
                <div class="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  {{ $t('progres.distribusiTag') }}
                </div>
                <div class="grid grid-cols-3 gap-1.5 text-center">
                  <div class="p-1.5 rounded bg-slate-50 border border-slate-100">
                    <div class="text-[10px] text-slate-500">{{ $t('tag.standar') }}</div>
                    <div class="text-xs font-bold text-slate-800">{{ summary.tagCounts.standar }}</div>
                  </div>
                  <div class="p-1.5 rounded bg-blue-50/60 border border-blue-100">
                    <div class="text-[10px] text-blue-600">{{ $t('tag.berkembang') }}</div>
                    <div class="text-xs font-bold text-blue-800">{{ summary.tagCounts.berkembang }}</div>
                  </div>
                  <div class="p-1.5 rounded bg-emerald-50/80 border border-emerald-100">
                    <div class="text-[10px] text-emerald-700">{{ $t('tag.siap_interview') }}</div>
                    <div class="text-xs font-bold text-emerald-800">{{ summary.tagCounts.siap_interview }}</div>
                  </div>
                </div>
              </div>

              <!-- Metrics Overview -->
              <div class="mt-3.5 space-y-2 text-xs">
                <div class="flex items-center justify-between py-1 border-b border-slate-50">
                  <span class="text-slate-600">{{ $t('progres.rataUjianKelas') }}:</span>
                  <span
                    class="font-mono font-bold"
                    :class="summary.rataUjian !== null && summary.rataUjian >= appStore.settings.kkm_ujian ? 'text-emerald-700' : 'text-slate-800'"
                  >
                    {{ summary.rataUjian !== null ? summary.rataUjian : '-' }}
                  </span>
                </div>
                <div class="flex items-center justify-between py-1 border-b border-slate-50">
                  <span class="text-slate-600">{{ $t('progres.rataSikapKelas') }}:</span>
                  <span
                    class="font-mono font-bold"
                    :class="summary.rataSikap !== null && summary.rataSikap >= appStore.settings.kkm_sikap ? 'text-emerald-700' : 'text-slate-800'"
                  >
                    {{ summary.rataSikap !== null ? summary.rataSikap : '-' }}
                  </span>
                </div>
                <div class="flex items-center justify-between py-1 border-b border-slate-50">
                  <span class="text-slate-600">{{ $t('progres.rasioKehadiranKelas') }}:</span>
                  <span
                    class="font-mono font-bold"
                    :class="
                      summary.rasioKehadiran !== null && summary.rasioKehadiran < appStore.settings.ambang_kehadiran_rendah
                        ? 'text-red-600'
                        : 'text-emerald-700'
                    "
                  >
                    {{ summary.rasioKehadiran !== null ? `${summary.rasioKehadiran}%` : '-' }}
                  </span>
                </div>
                <div class="flex items-center justify-between py-1">
                  <span class="text-slate-600">{{ $t('progres.kaiwaTerakhirDist') }}:</span>
                  <div class="flex items-center gap-1.5 font-mono text-[11px]">
                    <span class="text-emerald-700 font-bold">A:{{ summary.kaiwaDistribusi.A }}</span>
                    <span class="text-blue-700 font-bold">B:{{ summary.kaiwaDistribusi.B }}</span>
                    <span class="text-amber-700 font-bold">C:{{ summary.kaiwaDistribusi.C }}</span>
                  </div>
                </div>
                <div v-if="summary.mensetsuDistribusi" class="flex items-center justify-between py-1">
                  <span class="text-slate-600">{{ $t('progres.mensetsuTerakhirDist') }}:</span>
                  <div class="flex items-center gap-1.5 font-mono text-[11px]">
                    <span class="text-emerald-700 font-bold">A:{{ summary.mensetsuDistribusi.A }}</span>
                    <span class="text-blue-700 font-bold">B:{{ summary.mensetsuDistribusi.B }}</span>
                    <span class="text-amber-700 font-bold">C:{{ summary.mensetsuDistribusi.C }}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="w-full joy-btn-secondary text-xs mt-2 justify-center"
              @click="selectClassAndSwitchToStudentMode(summary.kelasId)"
            >
              <v-icon icon="mdi-account-search" size="14" class="mr-1" />
              <span>{{ $t('progres.lihatDaftarSiswa') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- MODE PER PESERTA -->
      <div v-else class="joy-surface overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th class="py-3 px-3 w-12 text-center">#</th>
                <th class="py-3 px-4">{{ $t('common.namaPeserta') }}</th>
                <th class="py-3 px-3">{{ $t('common.kelas') }}</th>
                <th class="py-3 px-3 text-center">{{ $t('progres.nilaiUjianAvg') }}</th>
                <th class="py-3 px-3 text-center">{{ $t('progres.kaiwaTerakhir') }}</th>
                <th class="py-3 px-3 text-center">{{ $t('progres.mensetsuTerakhir') }}</th>
                <th class="py-3 px-3 text-center">{{ $t('progres.skorSikap') }}</th>
                <th class="py-3 px-3 text-center">{{ $t('progres.kehadiran') }}</th>
                <th class="py-3 px-3 text-center">{{ $t('progres.statusTag') }}</th>
                <th class="py-3 px-3 text-right">{{ $t('common.aksi') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="filteredPesertaList.length === 0">
                <td colspan="10" class="py-10 text-center text-slate-400">
                  {{ $t('common.tidakAdaData') }}
                </td>
              </tr>
              <tr
                v-for="(p, idx) in filteredPesertaList"
                :key="p.pesertaId"
                class="hover:bg-slate-50/80 transition-colors"
                :class="p.statusTag === 'siap_interview' ? 'bg-emerald-50/20' : ''"
              >
                <td class="py-3 px-3 text-center text-slate-400 font-mono">
                  {{ idx + 1 }}
                </td>
                <td class="py-3 px-4">
                  <div class="font-semibold text-slate-900">{{ p.nama }}</div>
                  <div class="text-[11px] text-slate-400 font-mono">
                    ID #{{ p.mancationAkunId || p.pesertaId }}
                    <span v-if="p.sumber === 'manual'" class="ml-1 px-1 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px]">
                      Luar Kelas
                    </span>
                  </div>
                </td>
                <td class="py-3 px-3">
                  <span class="font-medium text-slate-700">{{ p.namaKelas }}</span>
                </td>
                <td class="py-3 px-3 text-center">
                  <div v-if="p.rataUjian !== null" class="font-mono">
                    <span
                      class="font-bold"
                      :class="p.lulusKkmUjian ? 'text-emerald-700' : 'text-red-600'"
                    >
                      {{ p.rataUjian }}
                    </span>
                    <span class="text-[10px] text-slate-400 ml-1">({{ p.predikatUjian }})</span>
                  </div>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td class="py-3 px-3 text-center">
                  <span
                    v-if="p.gradeKaiwaTerakhir"
                    class="font-mono font-bold px-2 py-0.5 rounded text-xs"
                    :class="{
                      'bg-emerald-100 text-emerald-800': p.gradeKaiwaTerakhir === 'A',
                      'bg-blue-100 text-blue-800': p.gradeKaiwaTerakhir === 'B',
                      'bg-amber-100 text-amber-800': p.gradeKaiwaTerakhir === 'C',
                    }"
                  >
                    {{ p.gradeKaiwaTerakhir }}
                  </span>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td class="py-3 px-3 text-center">
                  <span
                    v-if="p.gradeMensetsuTerakhir"
                    class="font-mono font-bold px-2 py-0.5 rounded text-xs"
                    :class="{
                      'bg-emerald-100 text-emerald-800': p.gradeMensetsuTerakhir === 'A',
                      'bg-blue-100 text-blue-800': p.gradeMensetsuTerakhir === 'B',
                      'bg-amber-100 text-amber-800': p.gradeMensetsuTerakhir === 'C',
                    }"
                  >
                    {{ p.gradeMensetsuTerakhir }}
                  </span>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td class="py-3 px-3 text-center">
                  <div class="font-mono">
                    <span
                      class="font-bold"
                      :class="p.lulusKkmSikap ? 'text-emerald-700' : 'text-red-600'"
                    >
                      {{ p.skorSikap }}
                    </span>
                    <span class="text-[10px] text-slate-400 ml-1">({{ p.predikatSikap }})</span>
                  </div>
                </td>
                <td class="py-3 px-3 text-center font-mono">
                  <span
                    v-if="p.rasioKehadiran !== null"
                    :class="p.rasioKehadiran < appStore.settings.ambang_kehadiran_rendah ? 'text-red-600 font-bold' : 'text-slate-800 font-semibold'"
                  >
                    {{ p.rasioKehadiran }}%
                  </span>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td class="py-3 px-3 text-center">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold"
                    :class="{
                      'bg-slate-100 text-slate-700': p.statusTag === 'standar',
                      'bg-blue-50 text-blue-700 border border-blue-200': p.statusTag === 'berkembang',
                      'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold':
                        p.statusTag === 'siap_interview',
                    }"
                  >
                    <span v-if="p.statusTag === 'siap_interview'" class="mr-1">🎯</span>
                    {{ $t(`tag.${p.statusTag}`) }}
                  </span>
                </td>
                <td class="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                  <!-- Change Tag (Admin Only) -->
                  <button
                    v-if="isAdmin"
                    type="button"
                    class="p-1 rounded text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    :title="$t('progres.ubahTag')"
                    @click="openChangeTagDialog(p)"
                  >
                    <v-icon icon="mdi-tag-edit" size="16" />
                  </button>

                  <!-- View Rapor -->
                  <router-link
                    :to="`/rapor?pesertaId=${p.pesertaId}&periode=${selectedPeriode}`"
                    class="p-1 rounded text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors inline-block"
                    :title="$t('progres.bukaRapor')"
                  >
                    <v-icon icon="mdi-file-document-outline" size="16" />
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Admin Change Tag Dialog (§12.2 mainIdea.md) -->
    <v-dialog v-model="changeTagDialog" max-width="440">
      <div class="bg-white rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-base font-bold text-slate-900 font-display">
            {{ $t('progres.ubahStatusTagJudul') }}
          </h3>
          <button type="button" class="text-slate-400 hover:text-slate-600" @click="changeTagDialog = false">
            <v-icon icon="mdi-close" size="20" />
          </button>
        </div>

        <div v-if="selectedStudentForTag" class="space-y-4 text-xs">
          <div class="p-3 bg-slate-50 rounded-lg">
            <div class="font-bold text-slate-900 text-sm">{{ selectedStudentForTag.nama }}</div>
            <div class="text-slate-500 text-[11px] font-mono mt-0.5">
              ID #{{ selectedStudentForTag.mancationAkunId || selectedStudentForTag.pesertaId }} · {{ selectedStudentForTag.namaKelas }}
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-2">
              {{ $t('progres.pilihStatusTag') }}:
            </label>
            <div class="space-y-2">
              <label
                class="flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all"
                :class="newStatusTag === 'standar' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:bg-slate-50'"
              >
                <input v-model="newStatusTag" type="radio" value="standar" name="statusTagRadio" />
                <div>
                  <div class="font-bold text-slate-800">{{ $t('tag.standar') }}</div>
                  <div class="text-[11px] text-slate-500">{{ $t('tag.standarDesc') }}</div>
                </div>
              </label>

              <label
                class="flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all"
                :class="newStatusTag === 'berkembang' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:bg-slate-50'"
              >
                <input v-model="newStatusTag" type="radio" value="berkembang" name="statusTagRadio" />
                <div>
                  <div class="font-bold text-blue-800">{{ $t('tag.berkembang') }}</div>
                  <div class="text-[11px] text-slate-500">{{ $t('tag.berkembangDesc') }}</div>
                </div>
              </label>

              <label
                class="flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all"
                :class="newStatusTag === 'siap_interview' ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 hover:bg-slate-50'"
              >
                <input v-model="newStatusTag" type="radio" value="siap_interview" name="statusTagRadio" />
                <div>
                  <div class="font-bold text-emerald-800">🎯 {{ $t('tag.siap_interview') }}</div>
                  <div class="text-[11px] text-slate-500">{{ $t('tag.siapInterviewDesc') }}</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              {{ $t('progres.alasanCatatan') }}:
            </label>
            <textarea
              v-model="statusTagNote"
              rows="2"
              class="joy-input w-full p-2 text-xs"
              :placeholder="$t('progres.alasanCatatanPlaceholder')"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button type="button" class="joy-btn-secondary text-xs" @click="changeTagDialog = false">
            {{ $t('common.batal') }}
          </button>
          <button
            type="button"
            class="joy-btn-primary text-xs"
            :disabled="savingTag"
            @click="submitChangeStatusTag"
          >
            {{ savingTag ? $t('common.menyimpan') : $t('common.simpan') }}
          </button>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '../stores/appStore.js';
import { apiRequest } from '../services/api.js';

const { t, locale } = useI18n();
const appStore = useAppStore();

const isAdmin = computed(() => appStore.isAdmin);

const viewMode = ref<'peserta' | 'kelas'>('peserta');
const selectedPeriode = ref(new Date().toISOString().slice(0, 7));
const selectedKelasId = ref('');
const selectedTag = ref('');

const loading = ref(false);
const error = ref('');
const exporting = ref(false);

const kelasList = ref<any[]>([]);
const kelasSummaryList = ref<any[]>([]);
const pesertaList = ref<any[]>([]);
const kandidatInterviewCount = ref(0);

// Admin Change Tag Dialog State
const changeTagDialog = ref(false);
const selectedStudentForTag = ref<any>(null);
const newStatusTag = ref('standar');
const statusTagNote = ref('');
const savingTag = ref(false);

const filteredPesertaList = computed(() => {
  return pesertaList.value;
});

// From the report pickers endpoint: /kelas belongs to Data Kelas, which a role with only Progres access cannot open.
async function fetchClasses() {
  try {
    const data = await apiRequest('/laporan/opsi');
    kelasList.value = data.kelas || [];
  } catch (err: any) {
    console.error('Failed to load classes', err);
  }
}

async function fetchData() {
  loading.value = true;
  error.value = '';
  try {
    const params = new URLSearchParams();
    if (selectedPeriode.value) params.set('periode', selectedPeriode.value);
    if (selectedKelasId.value) params.set('kelasId', selectedKelasId.value);
    if (selectedTag.value) params.set('tag', selectedTag.value);

    const data = await apiRequest(`/progres?${params.toString()}`);
    kelasSummaryList.value = data.kelasSummary || [];
    pesertaList.value = data.pesertaList || [];
    kandidatInterviewCount.value = data.kandidatInterviewCount || 0;
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat data progres';
  } finally {
    loading.value = false;
  }
}

function toggleSiapInterviewFilter() {
  if (selectedTag.value === 'siap_interview') {
    selectedTag.value = '';
  } else {
    selectedTag.value = 'siap_interview';
  }
  fetchData();
}

function selectClassAndSwitchToStudentMode(kelasId: number) {
  selectedKelasId.value = String(kelasId);
  viewMode.value = 'peserta';
  fetchData();
}

function openChangeTagDialog(student: any) {
  selectedStudentForTag.value = student;
  newStatusTag.value = student.statusTag || 'standar';
  statusTagNote.value = '';
  changeTagDialog.value = true;
}

async function submitChangeStatusTag() {
  if (!selectedStudentForTag.value) return;
  savingTag.value = true;
  try {
    await apiRequest(`/peserta/${selectedStudentForTag.value.pesertaId}/tag`, {
      method: 'PATCH',
      body: {
        statusTag: newStatusTag.value,
        note: statusTagNote.value,
      },
    });
    appStore.notify(t('progres.tagBerhasilDiubah'), 'success');
    changeTagDialog.value = false;
    await fetchData();
  } catch (err: any) {
    appStore.notify(err.message || 'Gagal mengubah status tag', 'error');
  } finally {
    savingTag.value = false;
  }
}

async function handleExportCsv() {
  exporting.value = true;
  try {
    const params = new URLSearchParams({
      tipe: 'progres',
      periode: selectedPeriode.value,
      locale: locale.value,
    });
    if (selectedKelasId.value) params.set('kelasId', selectedKelasId.value);

    const token = localStorage.getItem('joydata_access_token');
    const res = await fetch(`/api/export/rekap?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error('Gagal mengekspor data');

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JOYdata-Progres-${selectedPeriode.value}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    appStore.notify(t('progres.eksporBerhasil'), 'success');
  } catch (err: any) {
    appStore.notify(err.message || 'Gagal mengekspor CSV', 'error');
  } finally {
    exporting.value = false;
  }
}

onMounted(async () => {
  await fetchClasses();
  await fetchData();
});
</script>
