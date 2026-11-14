<template>
  <ul class="divide-y divide-slate-100">
    <li v-for="s in items" :key="s.id" class="py-3 flex items-start gap-2.5">
      <v-icon
        :icon="s.sentiment === 'positif' ? 'mdi-thumb-up-outline' : 'mdi-alert-circle-outline'"
        :color="s.sentiment === 'positif' ? 'success' : 'warning'"
        :aria-label="$t(s.sentiment === 'positif' ? 'portal.positif' : 'portal.negatif')"
        size="18"
        class="mt-px shrink-0"
      />
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline gap-2">
          <p class="text-sm font-medium text-slate-900 min-w-0">{{ locale === 'ja' ? s.kategoriNamaJa : s.kategoriNamaId }}</p>
          <span class="ml-auto shrink-0 tabular-nums text-xs font-semibold" :class="s.sentiment === 'positif' ? 'text-emerald-700' : 'text-red-600'">
            {{ s.sentiment === 'positif' ? '+' : '−' }}{{ num(s.bobot) }}
          </span>
        </div>
        <p v-if="s.keterangan" class="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-line">{{ s.keterangan }}</p>
        <p class="text-[11px] text-slate-500 mt-1">{{ tanggal(s.tanggal) }}</p>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { usePortalFormat } from '../../services/portalSession.js';

/** Sikap records as the portal report sends them, in the order to show them. */
defineProps({ items: { type: Array, required: true } });

const { locale } = useI18n();
const { num, tanggal } = usePortalFormat();
</script>
