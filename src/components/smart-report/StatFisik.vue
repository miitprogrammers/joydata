<template>
  <div class="border border-slate-200 rounded p-3 text-xs space-y-2">
    <template v-if="tes">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
        <span class="font-mono tabular-nums">{{ tes.tanggal }}</span>
        <span>
          {{ tes.jenisKelamin === 'P' ? $t('fisik.perempuan') : $t('fisik.lakiLaki') }}
          · {{ $t('fisik.beban', { kg: tes.bebanKg }) }} · {{ $t('fisik.lintasan', { m: tes.lintasanM }) }}
        </span>
      </div>
      <table class="w-full border-collapse">
        <thead>
          <tr class="text-[10px] uppercase tracking-wide text-slate-400">
            <th class="text-left font-semibold py-0.5">{{ $t('fisik.colItem') }}</th>
            <th class="text-right font-semibold py-0.5">{{ $t('fisik.colHasil') }}</th>
            <th class="text-right font-semibold py-0.5 w-14">{{ $t('fisik.colNilai') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in baris" :key="row.key" class="border-t border-slate-50">
            <td class="py-1 text-slate-600">{{ row.label }}</td>
            <td class="py-1 text-right font-mono tabular-nums text-slate-800">{{ row.hasil }}</td>
            <td class="py-1 text-right font-mono tabular-nums font-bold" :class="row.nilai === null ? 'text-slate-300' : row.nilai >= 60 ? 'text-slate-900' : 'text-red-600'">
              {{ row.nilai === null ? '-' : row.nilai }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex items-center justify-between border-t border-slate-200 pt-1.5">
        <span class="font-bold text-slate-800">{{ $t('fisik.nilaiFisik') }}</span>
        <span v-if="tes.nilaiFisik !== null" class="font-mono tabular-nums">
          <span class="font-bold text-slate-900">{{ tes.nilaiFisik }}</span>
          <span class="ml-1.5 font-bold" :class="warnaPredikat(tes.predikat)">{{ tes.predikat }}</span>
          <span class="ml-1.5 text-[10px] font-sans" :class="tes.lulusKkm ? 'text-emerald-700' : 'text-red-600'">
            {{ tes.lulusKkm ? $t('fisik.lulusKkm', { kkm: tes.kkm }) : $t('fisik.bawahKkm', { kkm: tes.kkm }) }}
          </span>
        </span>
        <span v-else class="text-[11px] text-slate-400 italic">{{ $t('fisik.belumLengkap') }}</span>
      </div>
      <p v-if="jumlahTes > 1" class="text-[10px] text-slate-400">{{ $t('fisik.tesTerakhirDari', { n: jumlahTes }) }}</p>
      <p v-if="tes.catatan" class="text-[11px] text-slate-600">{{ tes.catatan }}</p>
    </template>
    <p v-else class="text-slate-400 italic">{{ kosong || $t('fisik.belumAdaTes') }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDetik } from '@/server/domain/evaluasiFisik.js';

// One scored test (domain ringkasFisik / hitungNilaiFisik): raw results, items { hasil, nilai }, Nilai Fisik.
const props = defineProps<{
  tes: any | null;
  jumlahTes?: number;
  kosong?: string;
}>();

const { t } = useI18n();

const baris = computed(() => {
  const s = props.tes;
  if (!s) return [];
  return [
    { key: 'pushUp', label: t('fisik.pushUp'), hasil: s.pushUp === null ? '-' : t('fisik.kali', { n: s.pushUp }), nilai: s.items.pushUp.nilai },
    { key: 'plank', label: t('fisik.plank'), hasil: formatDetik(s.plankDetik), nilai: s.items.plank.nilai },
    { key: 'sitUp', label: t('fisik.sitUp'), hasil: s.sitUp === null ? '-' : t('fisik.kali', { n: s.sitUp }), nilai: s.items.sitUp.nilai },
    {
      key: 'karung',
      label: t('fisik.karung'),
      hasil: s.karungBolakBalik === null ? '-' : t('fisik.bolakBalik', { n: s.karungBolakBalik, m: s.items.karung.hasil }),
      nilai: s.items.karung.nilai,
    },
  ];
});

function warnaPredikat(p: string) {
  if (p === 'A') return 'text-emerald-700';
  if (p === 'B') return 'text-sky-700';
  if (p === 'C') return 'text-amber-700';
  return 'text-red-600';
}
</script>
