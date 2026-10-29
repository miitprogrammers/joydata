<template>
  <div class="space-y-6 max-w-4xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 font-display">
          {{ $t('pengaturan.title') }}
        </h1>
        <p class="text-sm text-slate-600 mt-0.5">
          {{ $t('pengaturan.subtitle') }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="joy-btn-secondary text-xs flex items-center gap-1.5"
          :disabled="resetting || saving"
          @click="confirmReset"
        >
          <v-icon icon="mdi-restore" size="16" />
          <span>{{ $t('pengaturan.resetDefault') }}</span>
        </button>

        <button
          type="button"
          class="joy-btn-primary text-xs flex items-center gap-1.5"
          :disabled="saving || resetting"
          @click="saveSettings"
        >
          <v-icon icon="mdi-content-save" size="16" />
          <span>{{ saving ? $t('common.menyimpan') : $t('common.simpan') }}</span>
        </button>
      </div>
    </div>

    <!-- Admin Warning if non-admin -->
    <div v-if="!isAdmin" class="joy-surface p-6 bg-amber-50/60 border border-amber-200 text-amber-800 text-xs rounded-xl">
      <div class="font-bold text-sm mb-1">
        {{ $t('pengaturan.aksesTerbatasJudul') }}
      </div>
      <div>{{ $t('pengaturan.aksesTerbatasDesc') }}</div>
    </div>

    <!-- Main Settings Form -->
    <div v-else class="space-y-6">
      <!-- Loading State -->
      <div v-if="loading" class="joy-surface p-12 text-center text-slate-500">
        <v-progress-circular indeterminate color="primary" size="32" class="mb-3" />
        <div class="text-sm font-medium">{{ $t('common.memuat') }}</div>
      </div>

      <template v-else>
        <!-- Card 1: Ambang Batas KKM & Penilaian -->
        <div class="joy-surface p-6 space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h2 class="text-base font-bold text-slate-900 font-display">
              1. {{ $t('pengaturan.secKkm') }}
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              {{ $t('pengaturan.secKkmDesc') }}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">
                {{ $t('pengaturan.kkmUjian') }} (0–100):
              </label>
              <input
                v-model.number="form.kkm_ujian"
                type="number"
                min="0"
                max="100"
                class="joy-input w-full p-2.5 font-mono text-xs"
              />
              <span class="text-[11px] text-slate-400 mt-1 block">
                Standard LPK Mizuno: 70
              </span>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">
                {{ $t('pengaturan.kkmSikap') }} (0–100):
              </label>
              <input
                v-model.number="form.kkm_sikap"
                type="number"
                min="0"
                max="100"
                class="joy-input w-full p-2.5 font-mono text-xs"
              />
              <span class="text-[11px] text-slate-400 mt-1 block">
                Standard KKM Kedisiplinan: 70
              </span>
            </div>
          </div>
        </div>

        <!-- Card 2: Basis Skor Sikap & Kehadiran -->
        <div class="joy-surface p-6 space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h2 class="text-base font-bold text-slate-900 font-display">
              2. {{ $t('pengaturan.secSikapKehadiran') }}
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              {{ $t('pengaturan.secSikapKehadiranDesc') }}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">
                {{ $t('pengaturan.basisSikap') }}:
              </label>
              <input
                v-model.number="form.sikap_basis"
                type="number"
                min="0"
                max="100"
                class="joy-input w-full p-2.5 font-mono text-xs"
              />
              <span class="text-[11px] text-slate-500 mt-1 block">
                {{ $t('pengaturan.basisSikapHelp') }}
              </span>
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">
                {{ $t('pengaturan.ambangKehadiranRendah') }} (%):
              </label>
              <input
                v-model.number="form.ambang_kehadiran_rendah"
                type="number"
                min="0"
                max="100"
                class="joy-input w-full p-2.5 font-mono text-xs"
              />
              <span class="text-[11px] text-slate-500 mt-1 block">
                {{ $t('pengaturan.ambangKehadiranHelp') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Card 3: Batas Label Predikat (A/B/C/D) -->
        <div class="joy-surface p-6 space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h2 class="text-base font-bold text-slate-900 font-display">
              3. {{ $t('pengaturan.secGradeLabel') }}
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              {{ $t('pengaturan.secGradeLabelDesc') }}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-700 mb-1">
                Predikat A (Sangat Baik) ≥ :
              </label>
              <input
                v-model.number="form.batas_grade.A"
                type="number"
                min="0"
                max="100"
                class="joy-input w-full p-2.5 font-mono text-xs"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">
                Predikat B (Baik) ≥ :
              </label>
              <input
                v-model.number="form.batas_grade.B"
                type="number"
                min="0"
                max="100"
                class="joy-input w-full p-2.5 font-mono text-xs"
              />
            </div>

            <div>
              <label class="block font-semibold text-slate-700 mb-1">
                Predikat C (Cukup) ≥ :
              </label>
              <input
                v-model.number="form.batas_grade.C"
                type="number"
                min="0"
                max="100"
                class="joy-input w-full p-2.5 font-mono text-xs"
              />
            </div>
          </div>
          <div class="text-[11px] text-slate-500 italic">
            * Nilai di bawah C (&lt; {{ form.batas_grade.C }}) otomatis mendapat Predikat D (Kurang).
          </div>
        </div>

        <!-- Card 4: Kaiwa Card (aturan kaiwa mingguan) -->
        <div class="joy-surface p-6 space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h2 class="text-base font-bold text-slate-900 font-display">
              4. {{ $t('pengaturan.secKaiwaCard') }}
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">
              {{ $t('pengaturan.secKaiwaCardDesc') }}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label for="set-kaiwa-target" class="block font-semibold text-slate-700 mb-1">
                {{ $t('pengaturan.kaiwaTarget') }}:
              </label>
              <input
                id="set-kaiwa-target"
                v-model.number="form.kaiwa_target_mingguan"
                type="number"
                min="1"
                max="14"
                class="joy-input w-full p-2.5 font-mono text-xs"
              />
              <span class="text-[11px] text-slate-500 mt-1 block">
                {{ $t('pengaturan.kaiwaTargetHelp') }}
              </span>
            </div>

            <div>
              <label for="set-kaiwa-sensei" class="block font-semibold text-slate-700 mb-1">
                {{ $t('pengaturan.kaiwaSenseiWajib') }}:
              </label>
              <select id="set-kaiwa-sensei" v-model="form.kaiwa_sensei_wajib_id" class="joy-input w-full p-2.5 text-xs">
                <option :value="null">{{ $t('pengaturan.kaiwaTanpaSenseiWajib') }}</option>
                <option v-for="s in staffOptions" :key="s.id" :value="s.id">{{ s.nama }}</option>
              </select>
              <span class="text-[11px] text-slate-500 mt-1 block">
                {{ $t('pengaturan.kaiwaSenseiWajibHelp') }}
              </span>
            </div>

            <div>
              <label for="set-kaiwa-mulai" class="block font-semibold text-slate-700 mb-1">
                {{ $t('pengaturan.kaiwaBerlakuMulai') }}:
              </label>
              <input
                id="set-kaiwa-mulai"
                v-model="form.kaiwa_berlaku_mulai"
                type="date"
                class="joy-input w-full p-2.5 font-mono text-xs"
              />
              <span class="text-[11px] text-slate-500 mt-1 block">
                {{ $t('pengaturan.kaiwaBerlakuMulaiHelp') }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '../stores/appStore.js';
import { apiRequest } from '../services/api.js';

const { t } = useI18n();
const appStore = useAppStore();

const isAdmin = computed(() => appStore.isAdmin);

const loading = ref(false);
const saving = ref(false);
const resetting = ref(false);

const form = ref({
  kkm_ujian: 70,
  kkm_sikap: 70,
  sikap_basis: 75,
  ambang_kehadiran_rendah: 75,
  batas_grade: {
    A: 90,
    B: 75,
    C: 60,
  },
  rentang_tren_bulan: 12,
  periode_default: 'auto',
  kaiwa_target_mingguan: 4,
  kaiwa_sensei_wajib_id: null as number | null,
  kaiwa_berlaku_mulai: '' as string | null,
});

// Active staff for the required kaiwa sensei; settings are admin-only and admins always keep Crud Staff.
const staffOptions = ref<{ id: number; nama: string }[]>([]);

async function loadStaffOptions() {
  try {
    const data = await apiRequest('/staff');
    staffOptions.value = (data.items || [])
      .filter((s: any) => s.active && s.roleKode !== 'viewer')
      .map((s: any) => ({ id: Number(s.id), nama: s.nama }));
  } catch {
    staffOptions.value = [];
  }
}

async function loadSettings() {
  loading.value = true;
  try {
    const data = await apiRequest('/settings');
    form.value = {
      kkm_ujian: data.kkm_ujian ?? 70,
      kkm_sikap: data.kkm_sikap ?? 70,
      sikap_basis: data.sikap_basis ?? 75,
      ambang_kehadiran_rendah: data.ambang_kehadiran_rendah ?? 75,
      batas_grade: {
        A: data.batas_grade?.A ?? 90,
        B: data.batas_grade?.B ?? 75,
        C: data.batas_grade?.C ?? 60,
      },
      rentang_tren_bulan: data.rentang_tren_bulan ?? 12,
      periode_default: data.periode_default ?? 'auto',
      kaiwa_target_mingguan: data.kaiwa_target_mingguan ?? 4,
      kaiwa_sensei_wajib_id: data.kaiwa_sensei_wajib_id ?? null,
      kaiwa_berlaku_mulai: data.kaiwa_berlaku_mulai ?? '',
    };
  } catch (err: any) {
    appStore.notify(err.message || 'Gagal memuat pengaturan', 'error');
  } finally {
    loading.value = false;
  }
}

async function saveSettings() {
  saving.value = true;
  try {
    const updated = await apiRequest('/settings', {
      method: 'PATCH',
      body: form.value,
    });
    form.value = {
      ...form.value,
      ...updated,
    };
    appStore.setSettings(updated);
    appStore.notify(t('pengaturan.berhasilDisimpan'), 'success');
  } catch (err: any) {
    appStore.notify(err.message || 'Gagal menyimpan pengaturan', 'error');
  } finally {
    saving.value = false;
  }
}

async function confirmReset() {
  if (!confirm(t('pengaturan.konfirmasiReset'))) return;
  resetting.value = true;
  try {
    const reset = await apiRequest('/settings/reset', {
      method: 'POST',
    });
    form.value = {
      ...form.value,
      ...reset,
    };
    appStore.setSettings(reset);
    appStore.notify(t('pengaturan.berhasilDireset'), 'success');
  } catch (err: any) {
    appStore.notify(err.message || 'Gagal mereset pengaturan', 'error');
  } finally {
    resetting.value = false;
  }
}

onMounted(async () => {
  await Promise.all([loadSettings(), loadStaffOptions()]);
});
</script>
