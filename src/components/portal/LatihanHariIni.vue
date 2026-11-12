<template>
  <v-menu location="bottom end" :close-on-content-click="false">
    <template #activator="{ props: menuProps }">
      <button
        v-bind="menuProps"
        type="button"
        class="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 whitespace-nowrap hover:bg-slate-200"
        :aria-label="`${$t('portal.latihanHariIni.judul')}: ${durasi(hariIni.detikAktif)}`"
      >
        <v-icon icon="mdi-timer-outline" size="16" class="text-slate-500" />
        <span class="hidden min-[600px]:inline font-medium text-slate-500">{{ $t('portal.latihanHariIni.label') }}</span>
        <span class="tabular-nums">{{ durasi(hariIni.detikAktif) }}</span>
      </button>
    </template>

    <v-card rounded="lg" min-width="260" max-width="320" class="p-4">
      <div class="text-xs font-medium text-slate-500">{{ $t('portal.latihanHariIni.judul') }}</div>
      <div class="text-2xl font-bold text-slate-900 font-display tabular-nums">{{ durasi(hariIni.detikAktif) }}</div>

      <div class="mt-3 flex h-2 overflow-hidden rounded-full bg-slate-100">
        <div v-for="j in JENIS" :key="j.kode" class="h-full" :class="j.warna" :style="{ width: `${lebar(hariIni.perJenis[j.kode])}%` }" />
      </div>
      <ul class="mt-3 space-y-1.5 text-sm">
        <li v-for="j in JENIS" :key="j.kode" class="flex items-center justify-between gap-3">
          <span class="flex items-center gap-2 text-slate-700"><span class="h-2 w-2 rounded-sm" :class="j.warna" />{{ $t(`portal.latihanHariIni.${j.kode}`) }}</span>
          <span class="tabular-nums font-medium text-slate-900">{{ durasi(hariIni.perJenis[j.kode]) }}</span>
        </li>
      </ul>
      <p class="mt-3 text-xs text-slate-500">{{ $t('portal.latihanHariIni.info') }}</p>
    </v-card>
  </v-menu>
</template>

<script setup>
// Today's practice time in the portal app bar (every portal page): the same figure and format as the peserta's
// row in Monitor Latihan, with the flashcard / kanji / dokkai split in the same colours.
import { useI18n } from 'vue-i18n';
import { useLatihanHariIni } from '../../services/latihanHariIni.js';

const JENIS = [
  { kode: 'flashcard', warna: 'bg-blue-600' },
  { kode: 'kanji', warna: 'bg-teal-500' },
  { kode: 'dokkai', warna: 'bg-amber-500' },
];

const { t } = useI18n();
const { hariIni } = useLatihanHariIni();

// As durasiJam in MonitorLatihanView: whole minutes, rounded.
function durasi(detik) {
  const menit = Math.round((detik || 0) / 60);
  return menit >= 60
    ? t('monitorLatihan.jamMenit', { jam: Math.floor(menit / 60), menit: menit % 60 })
    : t('monitorLatihan.menit', { n: menit });
}

function lebar(detik) {
  const total = hariIni.value.detikAktif;
  return total > 0 ? (detik / total) * 100 : 0;
}
</script>
