<template>
  <v-tooltip location="bottom" max-width="280">
    <template #activator="{ props: tipProps }">
      <div
        v-bind="tipProps"
        class="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 whitespace-nowrap"
        :aria-label="`${$t('portal.pemakaian.hariIni')}: ${teks}`"
        tabindex="0"
      >
        <v-icon icon="mdi-timer-outline" size="16" class="text-slate-500" />
        <span class="hidden min-[600px]:inline font-medium text-slate-500">{{ $t('portal.pemakaian.hariIni') }}</span>
        <span class="tabular-nums">{{ teks }}</span>
      </div>
    </template>
    {{ $t('portal.pemakaian.info') }}
  </v-tooltip>
</template>

<script setup>
// The peserta's active time in the portal today, shown in the portal app bar on every page.
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePemakaianPortal } from '../../services/pemakaianPortal.js';

const { t } = useI18n();
const { detikHariIni } = usePemakaianPortal();

const teks = computed(() => {
  const menit = Math.floor(detikHariIni.value / 60);
  if (menit < 1) return t('portal.pemakaian.kurangSemenit');
  if (menit < 60) return t('portal.pemakaian.menit', { n: menit });
  return t('portal.pemakaian.jamMenit', { j: Math.floor(menit / 60), m: menit % 60 });
});
</script>
