<template>
  <div class="space-y-2">
    <div class="grid grid-cols-3 gap-2 text-center">
      <div class="border border-slate-200 rounded py-1.5">
        <div class="text-[10px] text-slate-500">{{ skorLabel }}</div>
        <div class="text-base font-bold font-mono mt-0.5" :class="lulusKkm === false ? 'text-red-600' : 'text-emerald-700'">
          {{ skor ?? '-' }}
        </div>
        <div class="text-[10px] text-slate-400">{{ skorNote }}</div>
      </div>
      <div class="border border-slate-200 rounded py-1.5">
        <div class="text-[10px] text-slate-500">{{ $t('laporan.kejadianPositif') }}</div>
        <div class="text-base font-bold font-mono mt-0.5 text-emerald-700">{{ jumlah.positif }}</div>
      </div>
      <div class="border border-slate-200 rounded py-1.5">
        <div class="text-[10px] text-slate-500">{{ $t('laporan.kejadianNegatif') }}</div>
        <div class="text-base font-bold font-mono mt-0.5" :class="jumlah.negatif ? 'text-red-600' : 'text-slate-900'">{{ jumlah.negatif }}</div>
      </div>
    </div>
    <table class="w-full text-left text-xs border border-slate-200 rounded">
      <thead class="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] font-semibold">
        <tr>
          <th class="py-1.5 px-2.5">{{ $t('smartReport.colKategori') }}</th>
          <th class="py-1.5 px-2 text-center w-16">{{ $t('laporan.colKejadian') }}</th>
          <th class="py-1.5 px-2 text-center w-16">{{ $t('smartReport.colDampak') }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr v-if="!perKategori.length">
          <td colspan="3" class="py-3 px-2.5 text-center text-[11px] text-slate-400">
            {{ $t('laporan.tanpaKejadianSikap', { basis }) }}
          </td>
        </tr>
        <tr v-for="k in perKategori" :key="k.nama">
          <td class="py-1.5 px-2.5 text-slate-800">{{ k.nama }}</td>
          <td class="py-1.5 px-2 text-center font-mono">{{ k.jumlah }}</td>
          <td class="py-1.5 px-2 text-center font-mono font-bold" :class="k.dampak >= 0 ? 'text-emerald-700' : 'text-red-600'">
            {{ bertanda(k.dampak) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { sikapPerKategori, bertanda } from './reportStats.js';

// Sikap in numbers for the printed reports: score, positive / negative records, records per category.
const props = defineProps<{
  // { kategoriNamaId, kategoriNamaJa, sentiment, bobot }
  rows: any[];
  skor: number | null;
  skorLabel: string;
  skorNote: string;
  lulusKkm: boolean | null;
  basis: number;
}>();

const { locale } = useI18n();

const perKategori = computed(() => sikapPerKategori(props.rows, locale.value));
const jumlah = computed(() => ({
  positif: props.rows.filter((s) => s.sentiment === 'positif').length,
  negatif: props.rows.filter((s) => s.sentiment !== 'positif').length,
}));
</script>
