<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href || undefined"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
    class="shrink-0 overflow-hidden bg-slate-100 text-slate-500 flex items-center justify-center select-none"
    :class="portrait ? 'rounded-lg border border-slate-200' : 'rounded-full'"
    :style="boxStyle"
    :title="href ? $t('peserta.fotoBukaPenuh') : undefined"
  >
    <img
      v-if="src && !gagal"
      :src="src"
      :alt="$t('peserta.fotoAlt', { nama })"
      loading="lazy"
      decoding="async"
      referrerpolicy="no-referrer"
      class="w-full h-full object-cover"
      style="object-position: 50% 25%"
      @error="gagal = true"
    />
    <span v-else class="font-semibold" :style="{ fontSize: `${Math.round(size * 0.38)}px` }" aria-hidden="true">
      {{ inisial }}
    </span>
  </component>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// Pas foto from Mancation (fotoUrl from the API); initials when there is none or it fails to load.
const props = defineProps({
  src: { type: String, default: null },
  nama: { type: String, default: '' },
  // Width in px; portrait boxes are 4:5 like the pas foto in Mancation, otherwise a circle.
  size: { type: Number, default: 36 },
  portrait: { type: Boolean, default: false },
  // Clicking opens the full photo in a new tab.
  bukaPenuh: { type: Boolean, default: false },
});

const gagal = ref(false);
watch(
  () => props.src,
  () => {
    gagal.value = false;
  }
);

const href = computed(() => (props.bukaPenuh && props.src && !gagal.value ? props.src : null));

const boxStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.portrait ? Math.round((props.size * 5) / 4) : props.size}px`,
}));

const inisial = computed(() => {
  const kata = String(props.nama || '').trim().split(/\s+/).filter(Boolean);
  return ((kata[0]?.[0] || '') + (kata.length > 1 ? kata[kata.length - 1][0] : '')).toUpperCase() || '?';
});
</script>
