<template>
  <component :is="to ? 'router-link' : 'div'" :to="to || undefined" class="joy-surface p-4 block min-w-0" :class="to ? 'hover:border-slate-300' : ''">
    <p class="text-xs font-medium text-slate-500">{{ label }}</p>
    <p class="mt-1 text-2xl font-bold text-slate-900 leading-tight">
      {{ nilai }}<span v-if="satuan" class="ml-1 text-sm font-semibold text-slate-500">{{ satuan }}</span>
    </p>
    <!-- Change against last month: arrow + signed text, green when the change is good, red when it is not -->
    <p v-if="deltaTeks" class="mt-0.5 inline-flex items-center gap-0.5 text-xs font-medium" :class="warnaDelta">
      <v-icon :icon="delta > 0 ? 'mdi-arrow-up' : delta < 0 ? 'mdi-arrow-down' : 'mdi-minus'" size="13" />
      {{ deltaTeks }}
    </p>
    <p v-if="$slots.default" class="mt-1 text-[11px] text-slate-500 leading-snug"><slot /></p>
  </component>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: { type: String, required: true },
  nilai: { type: [String, Number], required: true },
  satuan: { type: String, default: '' },
  delta: { type: Number, default: null },
  deltaTeks: { type: String, default: '' },
  // false where a rise is bad.
  naikBaik: { type: Boolean, default: true },
  to: { type: String, default: '' },
});

const warnaDelta = computed(() => {
  if (!props.delta) return 'text-slate-500';
  return props.delta > 0 === props.naikBaik ? 'text-emerald-700' : 'text-red-600';
});
</script>
