<template>
  <div class="col-span-full border-t border-black/10 pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500">
    <span>{{ $t('laporan.legendWarna') }}:</span>
    <span
      v-for="(warna, status) in STATUS_WARNA"
      :key="status"
      class="inline-flex items-center gap-1.5"
      :class="status === statusTag ? 'font-semibold text-slate-800' : ''"
    >
      <span class="w-3 h-3 rounded-sm border" :class="warna.contoh" />
      {{ $t(`tag.${status}`) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { STATUS_WARNA } from './reportStats.js';

// Legend under the identity block of the printed rapor and Smart Report: what its colour means.
defineProps<{ statusTag: string }>();
</script>
