<template>
  <div v-if="report" class="space-y-4">
    <section class="joy-surface p-5">
      <div class="flex items-baseline justify-between gap-3">
        <h2 class="text-base font-bold text-slate-900 font-display">{{ $t('portal.kehadiran') }}</h2>
        <p class="text-2xl font-bold tabular-nums" :class="report.kpi.kehadiranRendah ? 'text-red-600' : 'text-slate-900'">
          {{ report.kpi.rasioKehadiran === null ? '-' : `${num(report.kpi.rasioKehadiran)}%` }}
        </p>
      </div>
      <p class="text-xs text-slate-500 mt-0.5">
        {{ report.absensi.hadir }}/{{ report.absensi.sesi }} {{ $t('portal.sesi').toLowerCase() }}
        <template v-if="report.peringkat?.rataKehadiranKelas != null">
          · {{ $t('portal.rataKelasPersen', { nilai: num(report.peringkat.rataKehadiranKelas) }) }}
        </template>
      </p>
      <p v-if="report.kpi.kehadiranRendah" class="text-xs text-red-600 mt-2">
        {{ $t('portal.kehadiranRendah', { ambang: report.settings.ambang_kehadiran_rendah }) }}
      </p>
    </section>

    <section class="joy-surface p-5">
      <h2 class="text-base font-bold text-slate-900 font-display mb-1">{{ $t('portal.kehadiranBulanan') }}</h2>
      <div class="overflow-x-auto -mx-1">
        <table class="w-full text-xs tabular-nums">
          <thead>
            <tr class="text-slate-500 text-left">
              <th class="font-medium py-2 px-1">{{ $t('portal.bulan') }}</th>
              <th class="font-medium py-2 px-1 text-right">{{ $t('portal.status.hadir') }}</th>
              <th class="font-medium py-2 px-1 text-right">{{ $t('portal.status.sakit') }}</th>
              <th class="font-medium py-2 px-1 text-right">{{ $t('portal.status.izin') }}</th>
              <th class="font-medium py-2 px-1 text-right">{{ $t('portal.status.alfa') }}</th>
              <th class="font-medium py-2 px-1 text-right">%</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="!bulanAbsensi.length">
              <td colspan="6" class="py-3 text-slate-500">{{ $t('portal.belumAda') }}</td>
            </tr>
            <tr v-for="b in bulanAbsensi" :key="b.periode">
              <td class="py-2 px-1 text-slate-800 whitespace-nowrap">{{ bulan(b.periode) }}</td>
              <td class="py-2 px-1 text-right">{{ b.absensi.hadir }}/{{ b.absensi.sesi }}</td>
              <td class="py-2 px-1 text-right">{{ b.absensi.sakit || '·' }}</td>
              <td class="py-2 px-1 text-right">{{ b.absensi.izin || '·' }}</td>
              <td class="py-2 px-1 text-right" :class="b.absensi.alfa ? 'text-red-600 font-semibold' : ''">{{ b.absensi.alfa || '·' }}</td>
              <td class="py-2 px-1 text-right font-semibold" :class="lowAttendance(b.absensi.rasio) ? 'text-red-600' : 'text-slate-900'">
                {{ b.absensi.rasio === null ? '-' : num(b.absensi.rasio) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="joy-surface p-5">
      <h2 class="text-base font-bold text-slate-900 font-display mb-2">{{ $t('portal.tidakHadir') }}</h2>
      <p v-if="!report.tidakHadir.length" class="text-sm text-emerald-700">{{ $t('portal.semuaHadir') }}</p>
      <div v-else class="flex flex-wrap gap-1.5">
        <span
          v-for="a in report.tidakHadir"
          :key="a.tanggal"
          class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
          :class="STATUS_CLASS[a.status] || 'bg-slate-100 text-slate-700'"
        >
          {{ tanggal(a.tanggal) }} · {{ $t(`portal.status.${a.status}`) }}
        </span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePortalSession, usePortalFormat } from '../../services/portalSession.js';

const STATUS_CLASS = {
  sakit: 'bg-amber-100 text-amber-800',
  izin: 'bg-sky-100 text-sky-800',
  alfa: 'bg-red-100 text-red-700',
};

const { report } = usePortalSession();
const { num, tanggal, bulan } = usePortalFormat();

const bulanAbsensi = computed(() => report.value.bulanan.filter((b) => b.absensi.sesi > 0).reverse());

function lowAttendance(rasio) {
  return rasio !== null && rasio < report.value.settings.ambang_kehadiran_rendah;
}
</script>
