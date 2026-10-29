<template>
  <div class="space-y-2">
    <div class="grid grid-cols-3 gap-2 text-center">
      <div class="border border-slate-200 rounded py-1.5">
        <div class="text-[10px] text-slate-500">{{ $t('laporan.sesiKaiwa') }}</div>
        <div class="text-base font-bold font-mono mt-0.5 text-slate-900">{{ grades.length }}</div>
      </div>
      <div class="border border-slate-200 rounded py-1.5">
        <div class="text-[10px] text-slate-500">{{ $t('laporan.gradeTerakhir') }}</div>
        <div class="text-base font-bold font-mono mt-0.5 text-blue-800">{{ gradeTerakhir || '-' }}</div>
      </div>
      <div class="border border-slate-200 rounded py-1.5">
        <div class="text-[10px] text-slate-500">{{ $t('laporan.kaiwaCard') }}</div>
        <div class="text-base font-bold font-mono mt-0.5" :class="kaiwaCardTone">
          {{ kaiwaCard?.jumlahMinggu ? `${kaiwaCard.tercapai}/${kaiwaCard.jumlahMinggu}` : '-' }}
        </div>
        <div class="text-[10px] text-slate-400">{{ $t('laporan.mingguTercapai') }}</div>
      </div>
    </div>
    <div class="border border-slate-200 rounded p-2.5 space-y-1.5">
      <div class="text-[10px] text-slate-500">{{ $t('laporan.distribusiGrade') }}</div>
      <div v-for="g in GRADES" :key="g" class="flex items-center gap-2 text-[11px]">
        <span class="w-4 font-bold font-mono text-slate-700">{{ g }}</span>
        <span class="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <span class="block h-full rounded-full" :style="{ width: `${persen(g)}%`, background: '#1E3A8A' }" />
        </span>
        <span class="w-6 text-right font-mono font-semibold text-slate-800">{{ counts[g] }}</span>
      </div>
    </div>
    <p v-if="kaiwaCard?.jumlahMinggu" class="text-[10px] text-slate-400">
      {{ $t('laporan.aturanKaiwa', { n: kaiwaCard.target }) }}<template v-if="kaiwaCard.senseiWajibNama">{{ $t('laporan.aturanKaiwaWajib', { nama: kaiwaCard.senseiWajibNama }) }}</template>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { hitungGrade } from './reportStats.js';

// Kaiwa in numbers for the printed reports: sessions, latest grade, Kaiwa Card weeks, grade distribution.
const props = defineProps<{
  grades: string[];
  gradeTerakhir: string | null;
  // { target, jumlahMinggu, tercapai, senseiWajibNama } from the report API
  kaiwaCard: any;
}>();

const GRADES = ['A', 'B', 'C'] as const;

const counts = computed(() => hitungGrade(props.grades));

function persen(g: (typeof GRADES)[number]) {
  return props.grades.length ? Math.round((counts.value[g] / props.grades.length) * 100) : 0;
}

const kaiwaCardTone = computed(() => {
  const k = props.kaiwaCard;
  if (!k?.jumlahMinggu) return 'text-slate-400';
  return k.tercapai === k.jumlahMinggu ? 'text-emerald-700' : 'text-amber-700';
});
</script>
