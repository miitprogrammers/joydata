<template>
  <div>
    <svg
      v-if="plotted.length"
      :viewBox="`0 0 ${W} ${H}`"
      class="w-full h-auto"
      role="img"
      :aria-label="ariaLabel"
    >
      <!-- Hairline grid and y ticks (scores are always 0–100) -->
      <g v-for="tick in TICKS" :key="tick">
        <line :x1="PAD.left" :x2="W - PAD.right" :y1="y(tick)" :y2="y(tick)" stroke="#E2E8F0" stroke-width="1" />
        <text
          :x="PAD.left - 6"
          :y="y(tick) + 3"
          text-anchor="end"
          font-size="9"
          fill="#94A3B8"
          style="font-variant-numeric: tabular-nums"
        >
          {{ tick }}
        </text>
      </g>

      <!-- KKM threshold -->
      <line
        :x1="PAD.left"
        :x2="W - PAD.right"
        :y1="y(kkm)"
        :y2="y(kkm)"
        stroke="#64748B"
        stroke-width="1"
        stroke-dasharray="4 3"
      />
      <!-- Labelled in the right margin so it never collides with a data label -->
      <text :x="W - PAD.right + 6" :y="y(kkm) + 3" font-size="9" font-weight="600" fill="#475569">
        {{ $t('smartReport.kkmLabel', { kkm }) }}
      </text>

      <path
        v-for="(d, i) in segments"
        :key="i"
        :d="d"
        fill="none"
        stroke="#1E3A8A"
        stroke-width="2"
        stroke-linejoin="round"
        stroke-linecap="round"
      />

      <g v-for="p in plotted" :key="p.index">
        <circle :cx="p.x" :cy="p.y" r="4" fill="#1E3A8A" stroke="#FFFFFF" stroke-width="2">
          <title>{{ p.title }}</title>
        </circle>
        <!-- Generous invisible hit target for the native tooltip -->
        <circle :cx="p.x" :cy="p.y" r="10" fill="transparent">
          <title>{{ p.title }}</title>
        </circle>
        <text
          v-if="p.labelled"
          :x="p.x"
          :y="p.y < PAD.top + 14 ? p.y + 15 : p.y - 8"
          text-anchor="middle"
          font-size="10"
          font-weight="700"
          fill="#334155"
        >
          {{ formatValue(p.value) }}
        </text>
      </g>

      <text
        v-for="p in xLabels"
        :key="`x-${p.index}`"
        :x="p.x"
        :y="H - 8"
        text-anchor="middle"
        font-size="9"
        fill="#64748B"
      >
        {{ p.label }}
      </text>
    </svg>
    <div v-else class="text-[11px] text-slate-400 italic py-6 text-center">
      {{ $t('smartReport.grafikKosong') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface TrendPoint {
  label: string;
  value: number | null;
  title?: string;
}

const props = defineProps<{
  points: TrendPoint[];
  kkm: number;
  ariaLabel: string;
  // Drawing width in SVG units (the height stays 180): wider for a full-width chart, so it gets longer, not taller.
  width?: number;
}>();

const W = computed(() => props.width ?? 640);
const H = 180;
const PAD = { left: 30, right: 74, top: 14, bottom: 26 };
const TICKS = [0, 25, 50, 75, 100];
const maxXLabels = computed(() => Math.round((14 * W.value) / 640));

const y = (v: number) => PAD.top + (1 - Math.max(0, Math.min(100, v)) / 100) * (H - PAD.top - PAD.bottom);

const xOf = (i: number) => {
  const n = props.points.length;
  if (n <= 1) return (PAD.left + W.value - PAD.right) / 2;
  return PAD.left + 12 + (i / (n - 1)) * (W.value - PAD.left - PAD.right - 24);
};

const formatValue = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

const plotted = computed(() => {
  const withValue = props.points
    .map((p, index) => ({ ...p, index }))
    .filter((p) => p.value !== null && Number.isFinite(p.value));
  if (!withValue.length) return [];

  // Selective direct labels: the highest, the lowest and the latest score.
  const values = withValue.map((p) => p.value as number);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const labelled = new Set([
    withValue.find((p) => p.value === max)!.index,
    withValue.find((p) => p.value === min)!.index,
    withValue[withValue.length - 1].index,
  ]);

  return withValue.map((p) => ({
    index: p.index,
    value: p.value as number,
    x: xOf(p.index),
    y: y(p.value as number),
    title: p.title || `${p.label}: ${formatValue(p.value as number)}`,
    labelled: labelled.has(p.index),
  }));
});

// A missing score breaks the line instead of bridging the gap.
const segments = computed(() => {
  const result: string[] = [];
  let current: string[] = [];
  props.points.forEach((p, i) => {
    if (p.value === null || !Number.isFinite(p.value)) {
      if (current.length > 1) result.push(current.join(' '));
      current = [];
      return;
    }
    current.push(`${current.length ? 'L' : 'M'}${xOf(i).toFixed(1)},${y(p.value).toFixed(1)}`);
  });
  if (current.length > 1) result.push(current.join(' '));
  return result;
});

const xLabels = computed(() => {
  const n = props.points.length;
  const step = Math.ceil(n / maxXLabels.value);
  return props.points
    .map((p, index) => ({ label: p.label, index, x: xOf(index) }))
    .filter((p) => p.index % step === 0 || p.index === n - 1);
});
</script>
