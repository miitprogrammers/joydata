<template>
  <div>
    <div v-if="total > 0" class="flex h-2 w-full gap-[2px]" role="img" :aria-label="ariaLabel">
      <span
        v-for="b in bagian.filter((x) => x.nilai > 0)"
        :key="b.key"
        class="h-full first:rounded-l-full last:rounded-r-full"
        :class="b.warna"
        :style="{ flexGrow: b.nilai, flexBasis: 0 }"
        :title="`${b.label}: ${b.nilai}`"
      />
    </div>
    <div v-else class="h-2 w-full rounded-full bg-slate-100" />
    <div class="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600">
      <span v-for="b in bagian" :key="b.key" class="flex items-center gap-1.5">
        <span class="h-2 w-2 rounded-sm" :class="b.warna" />{{ b.label }}
        <span class="font-semibold tabular-nums text-slate-900">{{ b.nilai }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

/** One whole split into parts: [{ key, label, nilai, warna (bg class) }]; the legend carries the numbers. */
const props = defineProps({
  bagian: { type: Array, required: true },
});

const total = computed(() => props.bagian.reduce((n, b) => n + b.nilai, 0));
const ariaLabel = computed(() => props.bagian.map((b) => `${b.label} ${b.nilai}`).join(', '));
</script>
