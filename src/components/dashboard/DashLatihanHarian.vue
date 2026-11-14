<template>
  <div>
    <div class="relative h-36 ml-8 mt-6" @mouseleave="aktif = null">
      <!-- The top value sits above its line, so a long unit (時間) never wraps in the narrow gutter -->
      <div class="absolute inset-x-0 top-0 border-t border-slate-100">
        <span class="absolute -left-8 -translate-y-full pb-0.5 text-[10px] tabular-nums text-slate-400 whitespace-nowrap">{{ labelMaks }}</span>
      </div>
      <div class="absolute inset-x-0 bottom-0 border-t border-slate-200">
        <span class="absolute -left-8 -translate-y-1/2 w-7 text-right text-[10px] tabular-nums text-slate-400">0</span>
      </div>

      <div class="absolute inset-0 flex items-end gap-0.5">
        <button
          v-for="(h, i) in harian"
          :key="h.tanggal"
          type="button"
          class="relative flex-1 h-full flex items-end justify-center rounded-sm focus:outline-none focus-visible:bg-blue-50"
          :aria-label="teksTooltip(h)"
          @mouseenter="aktif = i"
          @focus="aktif = i"
          @blur="aktif = null"
        >
          <!-- Flashcard at the bottom, then kanji, then dokkai; 2px of card between the parts -->
          <span
            v-if="h.total > 0"
            class="flex w-full max-w-[18px] flex-col-reverse gap-[2px] overflow-hidden rounded-t"
            :style="{ height: `${(h.total / maks) * 100}%` }"
          >
            <span
              v-for="j in JENIS.filter((k) => h.detik[k.key] > 0)"
              :key="j.key"
              class="w-full shrink-0"
              :class="j.warna"
              :style="{ flexGrow: h.detik[j.key], flexBasis: 0, minHeight: '2px' }"
            />
          </span>
        </button>
      </div>

      <div
        v-if="aktif !== null"
        class="absolute z-10 -top-2 -translate-y-full rounded-md bg-slate-900 px-2 py-1 text-[11px] leading-snug text-white whitespace-nowrap pointer-events-none"
        :class="posisiTooltip.kelas"
        :style="{ left: `${posisiTooltip.left}%` }"
      >
        <p class="font-semibold">{{ teksTooltip(harian[aktif]) }}</p>
        <p v-for="j in JENIS" :key="j.key" class="flex items-center gap-1.5">
          <span class="h-2 w-2 rounded-sm" :class="j.warna" />{{ j.label }} {{ durasi(harian[aktif].detik[j.key]) }}
        </p>
      </div>
    </div>
    <div class="flex gap-0.5 ml-8 mt-1">
      <span
        v-for="(h, i) in harian"
        :key="h.tanggal"
        class="flex-1 text-center text-[10px] tabular-nums"
        :class="i === harian.length - 1 ? 'font-semibold text-slate-800' : 'text-slate-400'"
      >{{ Number(h.tanggal.slice(8)) }}</span>
    </div>
    <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
      <span v-for="j in JENIS" :key="j.key" class="flex items-center gap-1.5">
        <span class="h-2 w-2 rounded-sm" :class="j.warna" />{{ j.label }}
        <span class="tabular-nums text-slate-500">{{ durasi(totalJenis[j.key]) }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { posisiDalam } from './posisiTooltip.js';

/** harian: [{ tanggal, detik: { flashcard, kanji, dokkai }, total, peserta }] oldest first. */
const props = defineProps({
  harian: { type: Array, required: true },
  labelJenis: { type: Object, required: true },
  durasi: { type: Function, required: true },
  teksTooltip: { type: Function, required: true },
  satuanJam: { type: String, default: 'j' },
});

const aktif = ref(null);

// The same colours as the practice bars on Monitor Latihan.
const JENIS = computed(() => [
  { key: 'flashcard', label: props.labelJenis.flashcard, warna: 'bg-blue-600' },
  { key: 'kanji', label: props.labelJenis.kanji, warna: 'bg-teal-500' },
  { key: 'dokkai', label: props.labelJenis.dokkai, warna: 'bg-amber-500' },
]);

// The top line is the next whole hour above the busiest day.
const maks = computed(() => Math.max(3600, Math.ceil(Math.max(0, ...props.harian.map((h) => h.total)) / 3600) * 3600));
const labelMaks = computed(() => `${maks.value / 3600}${props.satuanJam}`);
// The tooltip stays inside the card: left-aligned on the left third, right-aligned on the right third, centred between.
const posisiTooltip = computed(() => posisiDalam(aktif.value, props.harian.length));
const totalJenis = computed(() =>
  Object.fromEntries(['flashcard', 'kanji', 'dokkai'].map((k) => [k, props.harian.reduce((n, h) => n + h.detik[k], 0)]))
);
</script>
