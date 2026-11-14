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

        <!-- Card 5: Evaluasi Fisik (benchmarks, weights, KKM, sack track) -->
        <div class="joy-surface p-6 space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h2 class="text-base font-bold text-slate-900 font-display">5. {{ $t('pengaturan.secFisik') }}</h2>
            <p class="text-xs text-slate-500 mt-0.5">{{ $t('pengaturan.secFisikDesc') }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label for="set-fisik-lintasan" class="block font-semibold text-slate-700 mb-1">{{ $t('pengaturan.fisikLintasan') }}:</label>
              <input
                id="set-fisik-lintasan"
                v-model.number="form.evaluasi_fisik.lintasanM"
                type="number"
                min="1"
                max="100"
                step="0.5"
                class="joy-input w-full p-2.5 font-mono text-xs"
              />
              <span class="text-[11px] text-slate-500 mt-1 block">{{ $t('pengaturan.fisikLintasanHelp') }}</span>
            </div>
            <div>
              <label for="set-fisik-kkm" class="block font-semibold text-slate-700 mb-1">{{ $t('pengaturan.fisikKkm') }}:</label>
              <input
                id="set-fisik-kkm"
                v-model.number="form.evaluasi_fisik.kkm"
                type="number"
                min="0"
                max="100"
                class="joy-input w-full p-2.5 font-mono text-xs"
              />
              <span class="text-[11px] text-slate-500 mt-1 block">{{ $t('pengaturan.fisikKkmHelp') }}</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="text-[11px] text-slate-500">
                  <th class="py-2 pr-3 font-semibold">{{ $t('fisik.colItem') }}</th>
                  <th class="py-2 px-2 font-semibold whitespace-nowrap" colspan="2">{{ $t('fisik.colLaki') }} ({{ $t('pengaturan.fisikMinimal') }} → {{ $t('pengaturan.fisikTarget') }})</th>
                  <th class="py-2 px-2 font-semibold whitespace-nowrap" colspan="2">{{ $t('fisik.colPerempuan') }} ({{ $t('pengaturan.fisikMinimal') }} → {{ $t('pengaturan.fisikTarget') }})</th>
                  <th class="py-2 pl-2 font-semibold whitespace-nowrap">{{ $t('pengaturan.fisikBobot') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="k in ITEM_FISIK" :key="k" class="border-t border-slate-100">
                  <td class="py-2 pr-3">
                    <p class="font-medium text-slate-800">{{ $t(`fisik.${k}`) }}</p>
                    <p class="text-[11px] text-slate-500">{{ $t(`fisik.satuan.${k}`) }}</p>
                  </td>
                  <template v-for="g in ['L', 'P']" :key="g">
                    <td class="py-2 px-1">
                      <input v-model.number="form.evaluasi_fisik.patokan[k][g].minimal" type="number" min="0" :aria-label="`${k} ${g} minimal`" class="joy-input w-20 p-2 font-mono text-xs" />
                    </td>
                    <td class="py-2 px-1">
                      <input v-model.number="form.evaluasi_fisik.patokan[k][g].target" type="number" min="0" :aria-label="`${k} ${g} target`" class="joy-input w-20 p-2 font-mono text-xs" />
                    </td>
                  </template>
                  <td class="py-2 pl-2">
                    <input v-model.number="form.evaluasi_fisik.bobot[k]" type="number" min="0" max="100" :aria-label="`${k} bobot`" class="joy-input w-16 p-2 font-mono text-xs" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="text-[11px]" :class="totalBobotFisik === 100 ? 'text-slate-500' : 'text-red-600 font-semibold'">
            {{ $t('pengaturan.fisikBobotTotal', { n: totalBobotFisik }) }}
          </div>
        </div>

        <!-- Card 6: Grade Latihan (Monitor Latihan history) -->
        <div class="joy-surface p-6 space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h2 class="text-base font-bold text-slate-900 font-display">6. {{ $t('pengaturan.secGradeLatihan') }}</h2>
            <p class="text-xs text-slate-500 mt-0.5">{{ $t('pengaturan.secGradeLatihanDesc') }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label for="set-latihan-target" class="block font-semibold text-slate-700 mb-1">{{ $t('pengaturan.gradeLatihanTarget') }}:</label>
              <input
                id="set-latihan-target"
                v-model.number="form.grade_latihan.targetMenitHarian"
                type="number"
                min="1"
                :max="BATAS_TARGET_MENIT"
                class="joy-input w-full p-2.5 font-mono text-xs"
              />
              <span class="text-[11px] text-slate-500 mt-1 block">{{ $t('pengaturan.gradeLatihanTargetHelp') }}</span>
            </div>
            <div>
              <label for="set-latihan-bobot" class="block font-semibold text-slate-700 mb-1">{{ $t('pengaturan.gradeLatihanBobot') }}:</label>
              <input
                id="set-latihan-bobot"
                v-model.number="form.grade_latihan.bobotWaktu"
                type="number"
                min="0"
                max="100"
                class="joy-input w-full p-2.5 font-mono text-xs"
              />
              <span class="text-[11px] text-slate-500 mt-1 block">
                {{ $t('pengaturan.gradeLatihanBobotHelp', { n: 100 - (Number(form.grade_latihan.bobotWaktu) || 0) }) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Card 7: Nilai Akhir (Progres Peserta) -->
        <div class="joy-surface p-6 space-y-4">
          <div class="border-b border-slate-100 pb-3">
            <h2 class="text-base font-bold text-slate-900 font-display">7. {{ $t('pengaturan.secNilaiAkhir') }}</h2>
            <p class="text-xs text-slate-500 mt-0.5">{{ $t('pengaturan.secNilaiAkhirDesc') }}</p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div v-for="k in FAKTOR_NILAI_AKHIR" :key="k">
              <label :for="`set-na-${k}`" class="block font-semibold text-slate-700 mb-1">{{ $t(`progres.faktor.${k}`) }} (%):</label>
              <input
                :id="`set-na-${k}`"
                v-model.number="form.nilai_akhir.bobot[k]"
                type="number"
                min="0"
                max="100"
                class="joy-input w-full p-2.5 font-mono text-xs"
              />
            </div>
          </div>
          <div class="text-[11px]" :class="totalBobotNilaiAkhir === 100 ? 'text-slate-500' : 'text-red-600 font-semibold'">
            {{ $t('pengaturan.nilaiAkhirTotal', { n: totalBobotNilaiAkhir }) }}
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
import { ITEM_FISIK, aturanFisik } from '@/server/domain/evaluasiFisik.js';
import { BATAS_TARGET_MENIT, aturanGradeLatihan } from '@/server/domain/gradeLatihan.js';
import { FAKTOR_NILAI_AKHIR, aturanNilaiAkhir } from '@/server/domain/nilaiAkhir.js';

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
  // Evaluasi Fisik: every value filled (missing ones from the defaults), so the inputs always have a target.
  evaluasi_fisik: aturanFisik({}) as any,
  grade_latihan: aturanGradeLatihan({}),
  nilai_akhir: aturanNilaiAkhir({}) as any,
});

const totalBobotNilaiAkhir = computed(() =>
  FAKTOR_NILAI_AKHIR.reduce((n: number, k: string) => n + (Number(form.value.nilai_akhir.bobot[k]) || 0), 0)
);

const totalBobotFisik = computed(() =>
  ITEM_FISIK.reduce((n: number, k: string) => n + (Number(form.value.evaluasi_fisik.bobot[k]) || 0), 0)
);

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
      evaluasi_fisik: aturanFisik(data),
      grade_latihan: aturanGradeLatihan(data),
      nilai_akhir: aturanNilaiAkhir(data),
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
      evaluasi_fisik: aturanFisik(updated),
      grade_latihan: aturanGradeLatihan(updated),
      nilai_akhir: aturanNilaiAkhir(updated),
    };
    appStore.setSettings(updated);
    appStore.notify(t('pengaturan.berhasilDisimpan'), 'success');
  } catch (err: any) {
    const key = `messages.${err.code}`;
    appStore.notify(t(key) !== key ? t(key) : err.message || 'Gagal menyimpan pengaturan', 'error');
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
      evaluasi_fisik: aturanFisik(reset),
      grade_latihan: aturanGradeLatihan(reset),
      nilai_akhir: aturanNilaiAkhir(reset),
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
