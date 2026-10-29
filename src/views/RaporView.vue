<template>
  <div class="space-y-6">
    <!-- Non-print Header & Controls -->
    <div class="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 font-display">
          {{ $t('rapor.title') }}
        </h1>
        <p class="text-sm text-slate-600 mt-0.5">
          {{ $t('rapor.subtitle') }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="raporData"
          type="button"
          class="joy-btn-secondary text-xs flex items-center gap-1.5"
          @click="openPenempatanModal"
        >
          <v-icon icon="mdi-card-account-details-outline" size="16" />
          <span>{{ $t('rapor.editPenempatan') }}</span>
        </button>

        <button
          v-if="raporData"
          type="button"
          class="joy-btn-primary text-xs flex items-center gap-1.5 shadow-sm"
          @click="handlePrintRapor"
        >
          <v-icon icon="mdi-printer" size="16" />
          <span>{{ $t('rapor.cetakPdf') }}</span>
        </button>
      </div>
    </div>

    <!-- Non-print Selection Bar -->
    <div class="no-print joy-surface p-4 flex flex-wrap items-center gap-4">
      <!-- Student Selector -->
      <div class="flex-1 min-w-[240px]">
        <label class="block text-xs font-semibold text-slate-700 mb-1">
          {{ $t('rapor.pilihPeserta') }}:
        </label>
        <select
          v-model="selectedPesertaId"
          class="joy-input w-full py-1.5 px-3 text-xs font-medium"
          @change="fetchRapor"
        >
          <option value="">-- {{ $t('rapor.pilihPesertaPlaceholder') }} --</option>
          <option v-for="p in allPesertaList" :key="p.id" :value="p.id">
            {{ p.nama }} (ID #{{ p.mancationAkunId || p.id }}) - {{ p.namaKelas }}
          </option>
        </select>
      </div>

      <!-- Periode Picker -->
      <div class="w-40">
        <label class="block text-xs font-semibold text-slate-700 mb-1">
          {{ $t('common.periode') }}:
        </label>
        <input
          v-model="selectedPeriode"
          type="month"
          class="joy-input w-full py-1.5 px-2.5 text-xs font-medium"
          @change="fetchRapor"
        />
      </div>

      <!-- Reload button -->
      <div class="self-end pb-0.5">
        <button
          type="button"
          class="joy-btn-secondary text-xs py-2 px-3"
          :disabled="!selectedPesertaId || loading"
          @click="fetchRapor"
        >
          <v-icon icon="mdi-refresh" size="16" />
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="joy-surface p-12 text-center text-slate-500 no-print">
      <v-progress-circular indeterminate color="primary" size="32" class="mb-3" />
      <div class="text-sm font-medium">{{ $t('common.memuat') }}</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="joy-surface p-8 text-center text-red-600 bg-red-50/50 border border-red-200 no-print">
      <div class="text-sm font-semibold">{{ error }}</div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!raporData" class="joy-surface p-12 text-center text-slate-400 no-print">
      <v-icon icon="mdi-file-certificate-outline" size="48" class="text-slate-300 mb-2" />
      <div class="text-sm font-medium text-slate-600">{{ $t('rapor.silakanPilihPeserta') }}</div>
      <div class="text-xs text-slate-400 mt-1">{{ $t('rapor.petunjukPilih') }}</div>
    </div>

    <!-- PRINTABLE DIGITAL RAPOR SHEET (A4 ready) -->
    <RaporSheet v-else :rapor-data="raporData" :settings="appStore.settings" :print-date="printDate" />

    <!-- Edit Penempatan Modal (§15 mainIdea.md) -->
    <v-dialog v-model="penempatanModal" max-width="500">
      <div class="bg-white rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-base font-bold text-slate-900 font-display">
            {{ $t('rapor.modalPenempatanJudul') }}
          </h3>
          <button type="button" class="text-slate-400 hover:text-slate-600" @click="penempatanModal = false">
            <v-icon icon="mdi-close" size="20" />
          </button>
        </div>

        <form class="space-y-3 text-xs" @submit.prevent="savePenempatan">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              Tanggal Lulus Ujian (合格日):
            </label>
            <input
              v-model="penempatanForm.tanggalLulusUjian"
              type="date"
              class="joy-input w-full p-2 text-xs"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              Perusahaan Naitei (内定企業名):
            </label>
            <input
              v-model="penempatanForm.perusahaanNaitei"
              type="text"
              class="joy-input w-full p-2 text-xs"
              placeholder="Contoh: Toyota Boshoku / Tokyo Kaigo KK"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              Jenis Pekerjaan (内定した業務):
            </label>
            <input
              v-model="penempatanForm.jenisPekerjaan"
              type="text"
              class="joy-input w-full p-2 text-xs"
              placeholder="Contoh: Kaigo / Pengelasan / Fabrikasi"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              Lokasi Kerja / Prefektur (勤務地):
            </label>
            <input
              v-model="penempatanForm.lokasiKerja"
              type="text"
              class="joy-input w-full p-2 text-xs"
              placeholder="Contoh: Aichi / Tokyo / Kanagawa"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              Rencana Mulai Kerja (就業開始予定日):
            </label>
            <input
              v-model="penempatanForm.rencanaMulaiKerja"
              type="date"
              class="joy-input w-full p-2 text-xs"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              Pendidikan Terakhir (最終学歴):
            </label>
            <input
              v-model="penempatanForm.pendidikanTerakhir"
              type="text"
              class="joy-input w-full p-2 text-xs"
              placeholder="Contoh: SMK Mesin / S1 Sastra Jepang / SMA IPA"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              Pendidikan Terakhir – Bahasa Jepang (最終学歴・日本語):
            </label>
            <input
              v-model="penempatanForm.pendidikanTerakhirJa"
              type="text"
              class="joy-input w-full p-2 text-xs"
              placeholder="例：SMKN 1 Cianjur（国立職業高等学校）自動車工学科（2025年卒業）"
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" class="joy-btn-secondary text-xs" @click="penempatanModal = false">
              {{ $t('common.batal') }}
            </button>
            <button type="submit" class="joy-btn-primary text-xs" :disabled="savingPenempatan">
              {{ savingPenempatan ? $t('common.menyimpan') : $t('common.simpan') }}
            </button>
          </div>
        </form>
      </div>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '../stores/appStore.js';
import { apiRequest } from '../services/api.js';
import RaporSheet from '../components/rapor/RaporSheet.vue';

const route = useRoute();
const { t, locale } = useI18n();
const appStore = useAppStore();

const selectedPesertaId = ref<string | number>('');
const selectedPeriode = ref(new Date().toISOString().slice(0, 7));

const loading = ref(false);
const error = ref('');
const allPesertaList = ref<any[]>([]);
const raporData = ref<any>(null);

const printDate = computed(() => {
  return new Date().toLocaleDateString(locale.value === 'ja' ? 'ja-JP' : 'id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Penempatan Form Modal
const penempatanModal = ref(false);
const savingPenempatan = ref(false);
const penempatanForm = ref({
  tanggalLulusUjian: '',
  perusahaanNaitei: '',
  jenisPekerjaan: '',
  lokasiKerja: '',
  rencanaMulaiKerja: '',
  pendidikanTerakhir: '',
  pendidikanTerakhirJa: '',
});

// From the report pickers endpoint: /peserta belongs to Data Peserta, which a role with only Rapor access cannot open.
async function loadAllPeserta() {
  try {
    const data = await apiRequest('/laporan/opsi');
    allPesertaList.value = (data.peserta || []).filter((p: any) => p.sumber === 'roster');
  } catch (err: any) {
    console.error('Failed to load students', err);
  }
}

async function fetchRapor() {
  if (!selectedPesertaId.value) {
    raporData.value = null;
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    const data = await apiRequest(`/rapor/${selectedPesertaId.value}?periode=${selectedPeriode.value}`);
    raporData.value = data;
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat rapor peserta';
  } finally {
    loading.value = false;
  }
}

function handlePrintRapor() {
  window.print();
}

function openPenempatanModal() {
  if (!raporData.value) return;
  const p = raporData.value.penempatan || {};
  penempatanForm.value = {
    tanggalLulusUjian: p.tanggalLulusUjian || '',
    perusahaanNaitei: p.perusahaanNaitei || '',
    jenisPekerjaan: p.jenisPekerjaan || '',
    lokasiKerja: p.lokasiKerja || '',
    rencanaMulaiKerja: p.rencanaMulaiKerja || '',
    pendidikanTerakhir: p.pendidikanTerakhir || '',
    pendidikanTerakhirJa: p.pendidikanTerakhirJa || '',
  };
  penempatanModal.value = true;
}

async function savePenempatan() {
  if (!selectedPesertaId.value) return;
  savingPenempatan.value = true;
  try {
    const updated = await apiRequest(`/peserta/${selectedPesertaId.value}/penempatan`, {
      method: 'PUT',
      body: penempatanForm.value,
    });
    if (raporData.value) {
      raporData.value.penempatan = updated;
    }
    appStore.notify(t('rapor.penempatanBerhasilDisimpan'), 'success');
    penempatanModal.value = false;
  } catch (err: any) {
    appStore.notify(err.message || 'Gagal menyimpan data penempatan', 'error');
  } finally {
    savingPenempatan.value = false;
  }
}

onMounted(async () => {
  await loadAllPeserta();
  if (route.query.pesertaId) {
    selectedPesertaId.value = String(route.query.pesertaId);
  } else if (allPesertaList.value.length > 0) {
    selectedPesertaId.value = allPesertaList.value[0].id;
  }
  if (route.query.periode) {
    selectedPeriode.value = String(route.query.periode);
  }
  if (selectedPesertaId.value) {
    await fetchRapor();
  }
});
</script>
