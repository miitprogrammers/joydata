<template>
  <div>
    <div class="text-[11px] text-slate-500">{{ $t('laporan.peringkatKelas') }}</div>
    <div class="font-bold text-slate-900 text-sm mt-0.5" style="font-variant-numeric: tabular-nums">
      <template v-if="peringkat?.posisi">
        {{ peringkat.posisi }}<span class="text-[11px] font-semibold text-slate-500"> / {{ peringkat.jumlahDinilai }}</span>
      </template>
      <template v-else>-</template>
    </div>
    <div class="text-[10px] text-slate-500">{{ peringkat?.posisi ? note : $t('laporan.belumDinilai') }}</div>
  </div>
</template>

<script setup lang="ts">
// Class rank in the identity block of the printed rapor and Smart Report: position / peserta with a score.
defineProps<{
  // { posisi, jumlahDinilai, jumlahPeserta } from the report API, or null without a class
  peringkat: any;
  // What the rank is based on (the month's exams, or every exam).
  note: string;
}>();
</script>
