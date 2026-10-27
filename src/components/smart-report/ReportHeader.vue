<template>
  <div class="border-b-2 border-slate-900 pb-3 flex items-center justify-between gap-4">
    <div>
      <div class="text-xs font-bold text-slate-500 tracking-widest uppercase">LPK MIZUNO SEMANGAT BANGSA</div>
      <h2 class="text-xl font-black text-slate-900 tracking-tight font-display">CABANG JOY · JOYdata</h2>
    </div>
    <div class="text-right">
      <div class="text-xs font-bold font-mono text-slate-800">{{ title }}</div>
      <div class="text-[11px] font-mono text-slate-500 mt-0.5">
        {{ $t('smartReport.rentangData') }}:
        <span class="font-bold text-slate-800">
          {{ rentang ? `${rentang.mulai} – ${rentang.sampai}` : $t('smartReport.belumAdaData') }}
        </span>
      </div>
      <div class="text-[10px] text-slate-400 mt-0.5">{{ $t('smartReport.tglCetak') }}: {{ printDate }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  rentang: { mulai: string; sampai: string } | null;
  printDate: string;
}>();
</script>
