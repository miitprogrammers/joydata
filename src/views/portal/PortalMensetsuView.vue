<template>
  <div v-if="report" class="space-y-4">
    <section class="grid grid-cols-2 gap-3">
      <div class="joy-surface p-4">
        <p class="text-xs font-medium text-slate-500">{{ $t('portal.mensetsu.jumlahSesi') }}</p>
        <p class="text-2xl font-bold text-slate-900 tabular-nums mt-1">{{ report.kpi.jumlahMensetsu }}</p>
      </div>
      <div class="joy-surface p-4">
        <p class="text-xs font-medium text-slate-500">{{ $t('portal.mensetsu.gradeTerakhir') }}</p>
        <p class="text-2xl font-bold text-blue-800 mt-1">{{ report.kpi.mensetsuTerakhir || '-' }}</p>
      </div>
    </section>

    <section v-if="sesi.length" class="joy-surface p-5">
      <h2 class="text-base font-bold text-slate-900 font-display mb-3">{{ $t('portal.mensetsu.distribusi') }}</h2>
      <div class="space-y-2">
        <div v-for="g in ['A', 'B', 'C']" :key="g" class="flex items-center gap-3 text-sm">
          <span class="w-5 font-bold text-slate-700">{{ g }}</span>
          <span class="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
            <span class="block h-full rounded-full bg-primary" :style="{ width: `${persen(g)}%` }" />
          </span>
          <span class="w-8 text-right font-semibold text-slate-800 tabular-nums">{{ report.mensetsu.distribusi[g] }}</span>
        </div>
      </div>
    </section>

    <section class="joy-surface p-5">
      <h2 class="text-base font-bold text-slate-900 font-display mb-2">{{ $t('portal.mensetsu.semuaSesi') }}</h2>
      <p v-if="!sesi.length" class="text-sm text-slate-500">{{ $t('portal.mensetsu.belumAda') }}</p>
      <ul v-else class="divide-y divide-slate-100">
        <li v-for="m in sesi" :key="m.id" class="py-3 flex items-start gap-3">
          <span class="w-9 h-9 rounded-full border-2 border-blue-800 text-blue-800 bg-blue-50 flex items-center justify-center text-sm font-black shrink-0">
            {{ m.grade }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm text-slate-900">
              {{ tanggal(m.tanggal, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
            </p>
            <p v-if="m.senseiNama" class="text-xs text-slate-500">{{ $t('portal.senseiNama', { nama: m.senseiNama }) }}</p>
            <p v-if="m.catatan" class="text-xs text-slate-700 mt-1 leading-relaxed">{{ m.catatan }}</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePortalSession, usePortalFormat } from '../../services/portalSession.js';

const { report } = usePortalSession();
const { tanggal } = usePortalFormat();

const sesi = computed(() => [...report.value.mensetsu.daftar].reverse());

function persen(g) {
  return sesi.value.length ? Math.round((report.value.mensetsu.distribusi[g] / sesi.value.length) * 100) : 0;
}
</script>
