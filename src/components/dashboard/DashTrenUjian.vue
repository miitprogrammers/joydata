<template>
  <div>
    <div class="relative h-40 ml-8 mr-2 mt-2" @mouseleave="aktif = null">
      <!-- Gridlines and their values -->
      <div v-for="v in tick" :key="v" class="absolute inset-x-0 border-t border-slate-100" :style="{ top: `${y(v)}%` }">
        <span class="absolute -left-8 -translate-y-1/2 w-7 text-right text-[10px] tabular-nums text-slate-400">{{ v }}</span>
      </div>
      <!-- KKM -->
      <div class="absolute inset-x-0 border-t border-amber-500" :style="{ top: `${y(kkm)}%` }">
        <span class="absolute right-0 -translate-y-full pb-0.5 text-[10px] font-medium text-amber-800">KKM {{ kkm }}</span>
      </div>

      <svg class="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline
          v-for="(seg, i) in segmen"
          :key="i"
          :points="seg"
          fill="none"
          stroke="#2563eb"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
        />
      </svg>

      <div v-if="aktif !== null" class="absolute inset-y-0 border-l border-slate-300" :style="{ left: `${x(aktif)}%` }" />

      <template v-for="(t, i) in tren" :key="t.bulan">
        <span
          v-if="t.rata !== null"
          class="absolute w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 ring-2 ring-white"
          :style="{ left: `${x(i)}%`, top: `${y(t.rata)}%` }"
        />
        <!-- The latest month carries its value -->
        <span
          v-if="i === terakhir"
          class="absolute -translate-x-1/2 -translate-y-full -mt-2 text-xs font-semibold text-slate-900 tabular-nums whitespace-nowrap"
          :style="{ left: `${x(i)}%`, top: `${y(t.rata)}%` }"
        >{{ angka(t.rata) }}</span>
      </template>

      <!-- Hover / focus targets: one band per month -->
      <button
        v-for="(t, i) in tren"
        :key="`hit-${t.bulan}`"
        type="button"
        class="absolute inset-y-0 focus:outline-none focus-visible:bg-blue-50/60"
        :style="{ left: `${(i / tren.length) * 100}%`, width: `${100 / tren.length}%` }"
        :aria-label="teksTooltip(t)"
        @mouseenter="aktif = i"
        @focus="aktif = i"
        @blur="aktif = null"
      />

      <div
        v-if="aktif !== null"
        class="absolute z-10 -top-2 -translate-y-full rounded-md bg-slate-900 px-2 py-1 text-[11px] text-white whitespace-nowrap pointer-events-none"
        :class="posisiDalam(aktif, tren.length).kelas"
        :style="{ left: `${posisiDalam(aktif, tren.length).left}%` }"
      >
        {{ teksTooltip(tren[aktif]) }}
      </div>
    </div>
    <div class="flex ml-8 mr-2 mt-1.5">
      <span v-for="t in tren" :key="t.bulan" class="flex-1 text-center text-[10px] text-slate-500">{{ bulanPendek(t.bulan) }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { posisiDalam } from './posisiTooltip.js';

/** tren: [{ bulan: 'YYYY-MM', rata, peserta, jumlahUjian }] oldest first. */
const props = defineProps({
  tren: { type: Array, required: true },
  kkm: { type: Number, required: true },
  angka: { type: Function, required: true },
  bulanPendek: { type: Function, required: true },
  teksTooltip: { type: Function, required: true },
});

const aktif = ref(null);

// The y scale starts at the tens below the lowest value or the KKM (lines need no zero), up to 100.
const yMin = computed(() => {
  const nilai = props.tren.map((t) => t.rata).filter((v) => v !== null);
  return Math.max(0, Math.floor((Math.min(props.kkm, ...nilai) - 5) / 10) * 10);
});
const tick = computed(() => {
  const out = [];
  for (let v = 100; v >= yMin.value; v -= yMin.value <= 40 ? 20 : 10) out.push(v);
  return out;
});
const x = (i) => ((i + 0.5) / props.tren.length) * 100;
const y = (v) => 100 - ((v - yMin.value) / (100 - yMin.value)) * 100;

// Months without exams break the line.
const segmen = computed(() => {
  const out = [];
  let cur = [];
  props.tren.forEach((t, i) => {
    if (t.rata === null) {
      if (cur.length) out.push(cur);
      cur = [];
    } else cur.push(`${x(i)},${y(t.rata)}`);
  });
  if (cur.length) out.push(cur);
  return out.filter((s) => s.length > 1).map((s) => s.join(' '));
});
const terakhir = computed(() => {
  for (let i = props.tren.length - 1; i >= 0; i -= 1) if (props.tren[i].rata !== null) return i;
  return -1;
});
</script>
