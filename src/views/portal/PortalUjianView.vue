<template>
  <div v-if="report" class="space-y-4">
    <section class="grid grid-cols-2 gap-3">
      <div class="joy-surface p-4">
        <p class="text-xs font-medium text-slate-500">{{ $t('portal.rataUjian') }}</p>
        <p class="text-2xl font-bold text-slate-900 tabular-nums mt-1">
          {{ num(report.kpi.rataUjian) }}<span v-if="report.kpi.rataUjian !== null" class="text-sm font-semibold text-slate-500"> {{ report.kpi.gradeUjian }}</span>
        </p>
        <p class="text-xs text-slate-500 mt-1">KKM {{ report.settings.kkm_ujian }}</p>
      </div>
      <div class="joy-surface p-4">
        <p class="text-xs font-medium text-slate-500">{{ $t('portal.peringkat') }}</p>
        <p class="text-2xl font-bold text-slate-900 tabular-nums mt-1">{{ report.peringkat?.posisi ?? '-' }}</p>
        <p class="text-xs text-slate-500 mt-1">
          <template v-if="report.peringkat?.posisi">{{ $t('portal.dariN', { n: report.peringkat.jumlahDinilai }) }} · </template>
          {{ $t('portal.rataKelas', { nilai: num(report.peringkat?.rataKelas) }) }}
        </p>
      </div>
    </section>

    <section class="joy-surface p-5">
      <h2 class="text-base font-bold text-slate-900 font-display mb-3">{{ $t('portal.nilaiUjian') }}</h2>
      <p v-if="!report.ujian.daftar.length" class="text-sm text-slate-500">{{ $t('portal.ujianKosong') }}</p>
      <template v-else>
        <ScoreTrendChart
          v-if="trendPoints.length > 1"
          :points="trendPoints"
          :kkm="report.settings.kkm_ujian"
          :aria-label="$t('portal.trenAria', { n: trendPoints.length, kkm: report.settings.kkm_ujian })"
        />
        <ul class="divide-y divide-slate-100 mt-3">
          <li v-for="u in ujianTerbaru" :key="u.id" class="py-3">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-slate-900">{{ u.kode || '-' }}</p>
                <p class="text-xs text-slate-500">
                  {{ tanggal(u.tanggal) }}
                  <template v-if="kelasRataPerKode.get(u.kode) != null"> · {{ $t('portal.kelasRata', { nilai: num(kelasRataPerKode.get(u.kode)) }) }}</template>
                </p>
              </div>
              <p class="text-lg font-bold tabular-nums shrink-0" :class="u.lulusKkm ? 'text-slate-900' : 'text-red-600'">
                {{ num(u.rata, 2) }} <span class="text-xs font-semibold text-slate-500">{{ u.grade }}</span>
              </p>
            </div>
            <p v-if="u.pola === 'variable'" class="text-xs text-slate-600 mt-1">{{ bagianText(u) }}</p>
            <details v-if="u.catatan" class="mt-1.5">
              <summary class="text-xs font-medium text-primary cursor-pointer select-none">{{ $t('portal.catatan') }}</summary>
              <p class="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-line">{{ u.catatan }}</p>
            </details>
          </li>
        </ul>
      </template>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePortalSession, usePortalFormat } from '../../services/portalSession.js';
import ScoreTrendChart from '../../components/smart-report/ScoreTrendChart.vue';

const BAGIAN = ['mojiGoi', 'bunpou', 'dokkai', 'choukai'];

const { t } = useI18n();
const { report } = usePortalSession();
const { num, tanggal } = usePortalFormat();

function bagianText(u) {
  return BAGIAN.filter((key) => u[key] !== null)
    .map((key) => `${t(`portal.bagian.${key}`)} ${num(u[key], 2)}`)
    .join(' · ');
}

const trendPoints = computed(() =>
  report.value.ujian.daftar.map((u) => ({ label: u.kode, value: u.rata, title: `${u.kode} · ${tanggal(u.tanggal)} · ${num(u.rata, 2)}` }))
);
const ujianTerbaru = computed(() => [...report.value.ujian.daftar].reverse());
const kelasRataPerKode = computed(() => new Map((report.value.peringkat?.perUjian || []).map((p) => [p.kode, p.rata])));
</script>
