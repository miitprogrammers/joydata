<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">
          {{ $t('overview.heading') }}
        </h1>
        <p class="text-sm text-slate-600 mt-1">
          {{ $t('overview.subheading') }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <v-btn
          variant="outlined"
          color="primary"
          size="small"
          prepend-icon="mdi-sync"
          class="text-none"
          :loading="syncing"
          @click="triggerSync"
        >
          {{ $t('app.syncMancation') }}
        </v-btn>
        <v-btn
          v-if="appStore.canAccess('data-peserta')"
          color="primary"
          variant="flat"
          size="small"
          prepend-icon="mdi-account-group-outline"
          class="text-none"
          to="/peserta"
        >
          {{ $t('overview.viewRoster') }}
        </v-btn>
      </div>
    </div>

    <!-- Mancation Sync Banner -->
    <MancationSyncBanner :sync-meta="data?.mancationSync" :syncing="syncing" @sync="triggerSync" />

    <!-- Pengingat Absensi Hari Ini (§14.5 mainIdea.md) -->
    <div
      v-if="absensiReminder && absensiReminder.belumDiisi?.length"
      class="joy-surface p-4 border border-amber-300 bg-amber-50/70 flex flex-wrap items-center justify-between gap-3"
    >
      <div>
        <div class="text-sm font-semibold text-amber-900">
          {{ $t('absensi.reminderTitle') }}
          <span class="ml-1 font-mono tabular-nums text-xs text-amber-800">({{ absensiReminder.tanggal }})</span>
        </div>
        <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-700">
          <span v-for="(kl, i) in absensiReminder.belumDiisi" :key="kl.id">
            <router-link
              :to="`/absensi?tanggal=${absensiReminder.tanggal}&kelasId=${kl.id}`"
              class="font-semibold text-blue-800 hover:underline"
            >
              {{ kl.namaKelas }}
            </router-link>
            <span v-if="i < absensiReminder.belumDiisi.length - 1" class="ml-2 text-slate-300" aria-hidden="true">·</span>
          </span>
        </div>
      </div>
      <v-btn
        color="primary"
        variant="tonal"
        size="x-small"
        class="text-none shrink-0"
        :to="`/absensi?tanggal=${absensiReminder.tanggal}&kelasId=${absensiReminder.belumDiisi[0].id}`"
      >
        {{ $t('absensi.fillNowBtn') }}
      </v-btn>
    </div>

    <!-- KPI Grid -->
    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <v-skeleton-loader v-for="n in 5" :key="n" type="article" class="joy-surface" />
    </div>
    <div v-else-if="data" class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div class="joy-surface p-4">
        <div class="text-xs text-slate-500">{{ $t('overview.kpiPesertaAktif') }}</div>
        <div class="text-2xl font-bold text-slate-900 tabular-nums mt-1">
          {{ data.kpi.pesertaAktif }}
        </div>
      </div>
      <div class="joy-surface p-4">
        <div class="text-xs text-slate-500">{{ $t('overview.kpiKelasAktif') }}</div>
        <div class="text-2xl font-bold text-slate-900 tabular-nums mt-1">
          {{ data.kpi.kelasAktif }}
        </div>
      </div>
      <div class="joy-surface p-4">
        <div class="text-xs text-slate-500">{{ $t('overview.kpiSiapInterview') }}</div>
        <div class="text-2xl font-bold text-emerald-700 tabular-nums mt-1">
          {{ data.kpi.siapInterview }}
        </div>
      </div>
      <div class="joy-surface p-4">
        <div class="text-xs text-slate-500">{{ $t('overview.kpiSudahNaitei') }}</div>
        <div class="text-2xl font-bold text-blue-900 tabular-nums mt-1">
          {{ data.kpi.sudahNaitei }}
        </div>
      </div>
      <div class="joy-surface p-4 col-span-2 lg:col-span-1">
        <div class="text-xs text-slate-500">{{ $t('overview.kpiPesertaLuar') }}</div>
        <div class="text-2xl font-bold text-slate-900 tabular-nums mt-1">
          {{ data.kpi.pesertaLuarKelas }}
        </div>
      </div>
    </div>

    <!-- Fase 3: Visual Academic Charts Section (§11 mainIdea.md) -->
    <div v-if="chartsData" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-base font-bold text-slate-900 font-display">
          {{ $t('dashboard.analisisStatistikJudul') }}
        </h2>
        <span class="text-xs font-mono text-slate-500">
          {{ $t('common.periode') }}: {{ chartsData.periode }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Chart 1: Tren Ujian 6 Bulan -->
        <div class="joy-surface p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-700">{{ $t('dashboard.trenUjian6Bulan') }}</span>
            <v-icon icon="mdi-chart-line" size="16" class="text-blue-600" />
          </div>
          <div class="h-28 flex items-end justify-between gap-1.5 pt-2 border-b border-slate-100">
            <div
              v-for="m in chartsData.trenUjian"
              :key="m.bulan"
              class="flex-1 flex flex-col items-center gap-1"
            >
              <div
                class="w-full rounded-t transition-all"
                :class="m.rataRata !== null && m.rataRata >= 70 ? 'bg-blue-600' : 'bg-slate-300'"
                :style="{ height: `${m.rataRata ? (m.rataRata / 100) * 80 : 4}px` }"
                :title="`${m.bulan}: ${m.rataRata ?? '-'}`"
              />
              <span class="text-[9px] font-mono text-slate-400 rotate-[-45deg] origin-top-left mt-1">
                {{ m.bulan.slice(5) }}
              </span>
            </div>
          </div>
          <div class="text-[10px] text-slate-500 flex justify-between">
            <span>Rata-rata Terkini:</span>
            <strong class="font-mono text-slate-800">
              {{ chartsData.trenUjian[chartsData.trenUjian.length - 1]?.rataRata ?? '-' }}
            </strong>
          </div>
        </div>

        <!-- Chart 2: Distribusi Nilai Ujian (A/B/C/D) -->
        <div class="joy-surface p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-700">{{ $t('dashboard.distribusiUjian') }}</span>
            <v-icon icon="mdi-chart-bar" size="16" class="text-emerald-600" />
          </div>
          <div class="space-y-2 pt-1 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-emerald-700">A (≥90)</span>
              <span class="font-mono font-semibold">{{ chartsData.distribusiUjian.A }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-bold text-blue-700">B (≥75)</span>
              <span class="font-mono font-semibold">{{ chartsData.distribusiUjian.B }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-bold text-amber-700">C (≥60)</span>
              <span class="font-mono font-semibold">{{ chartsData.distribusiUjian.C }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-bold text-red-600">D (&lt;60)</span>
              <span class="font-mono font-semibold">{{ chartsData.distribusiUjian.D }}</span>
            </div>
          </div>
        </div>

        <!-- Chart 3: Rasio Kehadiran per Kelas -->
        <div class="joy-surface p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-700">{{ $t('dashboard.rasioPerKelas') }}</span>
            <v-icon icon="mdi-calendar-check" size="16" class="text-indigo-600" />
          </div>
          <div class="space-y-2.5 text-xs">
            <div
              v-for="k in chartsData.rasioKehadiranPerKelas"
              :key="k.kelasId"
              class="space-y-1"
            >
              <div class="flex justify-between text-[11px]">
                <span class="font-semibold text-slate-800">{{ k.namaKelas }}</span>
                <span
                  class="font-mono font-bold"
                  :class="k.isRendah ? 'text-red-600' : 'text-emerald-700'"
                >
                  {{ k.rasio !== null ? `${k.rasio}%` : '-' }}
                </span>
              </div>
              <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :class="k.isRendah ? 'bg-red-500' : 'bg-emerald-500'"
                  :style="{ width: `${k.rasio ?? 0}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Chart 4: Kaiwa & Sentimen Sikap -->
        <div class="joy-surface p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-700">{{ $t('dashboard.kaiwaSikapKombinasi') }}</span>
            <v-icon icon="mdi-account-voice" size="16" class="text-amber-600" />
          </div>
          <div class="text-xs space-y-2">
            <div class="text-[11px] font-semibold text-slate-500">Grade Kaiwa Terakhir:</div>
            <div class="flex items-center justify-between font-mono text-[11px] bg-slate-50 p-1.5 rounded">
              <span class="text-emerald-700 font-bold">A: {{ chartsData.distribusiKaiwa.A }}</span>
              <span class="text-blue-700 font-bold">B: {{ chartsData.distribusiKaiwa.B }}</span>
              <span class="text-amber-700 font-bold">C: {{ chartsData.distribusiKaiwa.C }}</span>
            </div>
            <div class="text-[11px] font-semibold text-slate-500 mt-2">Kejadian Sikap:</div>
            <div class="flex items-center justify-between text-[11px]">
              <span class="text-emerald-700 font-semibold">+{{ chartsData.sikapSentimen.positif }} Positif</span>
              <span class="text-red-600 font-semibold">−{{ chartsData.sikapSentimen.negatif }} Negatif</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Watchlist Section: Peserta Perhatian Khusus (§11 mainIdea.md) -->
      <div
        v-if="
          chartsData.watchlist?.sikapRendah?.length ||
          chartsData.watchlist?.kehadiranRendah?.length
        "
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <!-- Watchlist 1: Sikap di Bawah KKM (70) -->
        <div class="joy-surface p-4 border border-amber-200 bg-amber-50/30">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <v-icon icon="mdi-alert-circle-outline" size="16" class="text-amber-700" />
              <span>{{ $t('dashboard.perhatianSikap') }} (&lt; KKM 70)</span>
            </div>
            <span class="text-[10px] text-amber-800 font-mono">
              {{ chartsData.watchlist.sikapRendah.length }} peserta
            </span>
          </div>
          <div class="divide-y divide-amber-100 text-xs">
            <div
              v-for="s in chartsData.watchlist.sikapRendah"
              :key="s.pesertaId"
              class="py-1.5 flex items-center justify-between"
            >
              <div>
                <span class="font-semibold text-slate-800">{{ s.nama }}</span>
                <span class="text-slate-400 text-[11px] ml-1">({{ s.namaKelas }})</span>
              </div>
              <div class="flex items-center gap-2 font-mono">
                <span class="text-red-600 font-bold">{{ s.skor }} ({{ s.predikat }})</span>
                <router-link
                  :to="`/rapor?pesertaId=${s.pesertaId}&periode=${chartsData.periode}`"
                  class="text-blue-700 hover:underline text-[11px]"
                >
                  Rapor
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Watchlist 2: Kehadiran Rendah (< 75%) -->
        <div class="joy-surface p-4 border border-red-200 bg-red-50/30">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-1.5 text-xs font-bold text-red-900">
              <v-icon icon="mdi-account-alert-outline" size="16" class="text-red-700" />
              <span>{{ $t('dashboard.perhatianKehadiran') }} (&lt; 75%)</span>
            </div>
            <span class="text-[10px] text-red-800 font-mono">
              {{ chartsData.watchlist.kehadiranRendah.length }} peserta
            </span>
          </div>
          <div class="divide-y divide-red-100 text-xs">
            <div
              v-for="k in chartsData.watchlist.kehadiranRendah"
              :key="k.pesertaId"
              class="py-1.5 flex items-center justify-between"
            >
              <div>
                <span class="font-semibold text-slate-800">{{ k.nama }}</span>
                <span class="text-slate-400 text-[11px] ml-1">({{ k.namaKelas }})</span>
              </div>
              <div class="flex items-center gap-2 font-mono">
                <span class="text-red-600 font-bold">{{ k.rasio }}%</span>
                <router-link
                  :to="`/absensi`"
                  class="text-blue-700 hover:underline text-[11px]"
                >
                  Absensi
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main 2-Column Split -->
    <div v-if="data" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: JOY Classes Table -->
      <div class="lg:col-span-2 joy-surface overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-900 font-display">
            {{ $t('overview.classSection') }}
          </h2>
          <v-btn
            v-if="appStore.canAccess('data-kelas')"
            variant="text"
            color="primary"
            size="small"
            class="text-none"
            to="/kelas"
          >
            {{ $t('overview.viewClasses') }}
          </v-btn>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse joy-table">
            <thead>
              <tr>
                <th class="px-5 py-2.5">{{ $t('kelas.namaKelas') }}</th>
                <th class="px-4 py-2.5">{{ $t('kelas.mancationId') }}</th>
                <th class="px-4 py-2.5">{{ $t('kelas.program') }}</th>
                <th class="px-4 py-2.5">{{ $t('kelas.sensei') }}</th>
                <th class="px-5 py-2.5 text-right">{{ $t('kelas.jumlahPeserta') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="kl in data.classes" :key="kl.id">
                <td class="px-5 py-2.5 font-semibold text-slate-900">
                  {{ kl.namaKelas }}
                  <span class="text-xs font-normal text-slate-500 ml-1">
                    · {{ kl.status === 'aktif' ? $t('kelas.statusAktif') : $t('kelas.statusSelesai') }}
                  </span>
                </td>
                <td class="px-4 py-2.5 tabular-nums text-slate-600">
                  {{ kl.mancationClassId || '-' }}
                </td>
                <td class="px-4 py-2.5 text-slate-700">
                  {{ locale === 'ja' ? kl.programNamaJa || kl.programNamaId : kl.programNamaId || '-' }}
                </td>
                <td class="px-4 py-2.5 text-slate-700">
                  {{ kl.senseiNama || '-' }}
                </td>
                <td class="px-5 py-2.5 text-right tabular-nums font-medium">
                  {{ kl.jumlahPeserta }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right: Status Tag Distribution & Recent System Audit -->
      <div class="space-y-6">
        <div class="joy-surface p-5">
          <h2 class="text-base font-semibold text-slate-900 font-display mb-4">
            {{ $t('overview.tagSection') }}
          </h2>
          <div class="space-y-3.5">
            <div v-for="item in tagRows" :key="item.key">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-medium text-slate-700">{{ item.label }}</span>
                <span class="tabular-nums text-slate-900 font-semibold">{{ item.count }}</span>
              </div>
              <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :class="item.barClass"
                  :style="{ width: `${item.pct}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="joy-surface p-5">
          <div class="flex items-center justify-between gap-2 mb-3">
            <h2 class="text-base font-semibold text-slate-900 font-display">
              {{ $t('overview.recentAuditSection') }}
            </h2>
            <router-link
              v-if="appStore.canAccess('riwayat-aktivitas')"
              to="/config/audit-log"
              class="text-xs font-semibold text-blue-700 hover:underline whitespace-nowrap"
            >
              {{ $t('app.all') }}
            </router-link>
          </div>
          <div class="divide-y divide-slate-100">
            <div
              v-for="log in data.recentLogs.slice(0, 5)"
              :key="log.id"
              class="py-2 text-xs flex items-center justify-between gap-2"
            >
              <div class="truncate">
                <span class="font-medium text-slate-800">{{ log.staffNama }}</span>
                <span class="text-slate-400 mx-1">·</span>
                <span class="text-slate-600">{{ log.aksi }}</span>
              </div>
              <span class="text-slate-400 tabular-nums shrink-0">
                {{ formatShortDate(log.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';
import MancationSyncBanner from '../components/MancationSyncBanner.vue';

const { t, locale } = useI18n();
const appStore = useAppStore();

const loading = ref(true);
const syncing = ref(false);
const data = ref(null);
const chartsData = ref(null);

const absensiReminder = computed(() => data.value?.absensiReminder);

const tagRows = computed(() => {
  if (!data.value?.statusTagDistribution) return [];
  const dist = data.value.statusTagDistribution;
  const total = (dist.standar || 0) + (dist.berkembang || 0) + (dist.siap_interview || 0) || 1;
  return [
    {
      key: 'standar',
      label: t('tag.standar'),
      count: dist.standar || 0,
      pct: Math.round(((dist.standar || 0) / total) * 100),
      barClass: 'bg-slate-400',
    },
    {
      key: 'berkembang',
      label: t('tag.berkembang'),
      count: dist.berkembang || 0,
      pct: Math.round(((dist.berkembang || 0) / total) * 100),
      barClass: 'bg-blue-600',
    },
    {
      key: 'siap_interview',
      label: t('tag.siap_interview'),
      count: dist.siap_interview || 0,
      pct: Math.round(((dist.siap_interview || 0) / total) * 100),
      barClass: 'bg-emerald-600',
    },
  ];
});

async function loadOverview() {
  loading.value = true;
  try {
    const [resOverview, resCharts] = await Promise.all([
      apiRequest('/overview'),
      apiRequest('/dashboard/charts'),
    ]);
    data.value = resOverview;
    chartsData.value = resCharts;
  } catch (err) {
    appStore.notify(err.message || 'Gagal memuat ringkasan', 'error');
  } finally {
    loading.value = false;
  }
}

async function triggerSync() {
  syncing.value = true;
  try {
    const res = await apiRequest('/mancation/sync', { method: 'POST' });
    appStore.notify(
      t('app.syncSuccess', {
        classes: res.stats.classes,
        students: res.stats.students,
      }),
      'success'
    );
    await loadOverview();
  } catch (err) {
    appStore.notify(err.message || 'Sinkronisasi gagal', 'error');
  } finally {
    syncing.value = false;
  }
}

function formatShortDate(iso) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString(locale.value === 'ja' ? 'ja-JP' : 'id-ID', {
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return String(iso).slice(0, 10);
  }
}

onMounted(loadOverview);
</script>
