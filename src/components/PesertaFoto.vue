<template>
  <component
    :is="bisaPerbesar ? 'button' : 'div'"
    v-bind="$attrs"
    :type="bisaPerbesar ? 'button' : undefined"
    class="shrink-0 overflow-hidden bg-slate-100 text-slate-500 flex items-center justify-center select-none p-0"
    :class="[
      portrait ? 'rounded-lg border border-slate-200' : 'rounded-full',
      bisaPerbesar
        ? 'cursor-zoom-in outline-none transition-shadow hover:ring-2 hover:ring-blue-300 focus-visible:ring-2 focus-visible:ring-blue-500'
        : '',
    ]"
    :style="boxStyle"
    :title="bisaPerbesar ? $t('peserta.fotoPerbesar') : undefined"
    :aria-label="bisaPerbesar ? $t('peserta.fotoPerbesarNama', { nama }) : undefined"
    @click="bukaBesar"
  >
    <img
      v-if="src && !gagal"
      :src="src"
      :alt="bisaPerbesar ? '' : $t('peserta.fotoAlt', { nama })"
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

  <!-- Enlarged photo: the same file as the small one, so it is already loaded. Click it, Esc or × to close. -->
  <v-dialog v-if="bisaPerbesar" v-model="besar" max-width="520">
    <div class="bg-white rounded-xl overflow-hidden shadow-xl">
      <img
        :src="src"
        :alt="$t('peserta.fotoAlt', { nama })"
        referrerpolicy="no-referrer"
        class="block w-full max-h-[78vh] object-contain bg-slate-900 cursor-zoom-out"
        @click="besar = false"
      />
      <div class="px-4 py-2 flex items-center justify-between gap-3">
        <span class="text-sm font-semibold text-slate-900 truncate">{{ nama }}</span>
        <v-btn icon="mdi-close" variant="text" size="small" :aria-label="$t('app.close')" @click="besar = false" />
      </div>
    </div>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// Two root nodes (the box and its dialog): attributes from the parent go to the box.
defineOptions({ inheritAttrs: false });

// Pas foto from Mancation (fotoUrl from the API); initials when there is none or it fails to load.
const props = defineProps({
  src: { type: String, default: null },
  nama: { type: String, default: '' },
  // Width in px; portrait boxes are 4:5 like the pas foto in Mancation, otherwise a circle.
  size: { type: Number, default: 36 },
  portrait: { type: Boolean, default: false },
  // Clicking shows the photo enlarged.
  perbesar: { type: Boolean, default: false },
});

const gagal = ref(false);
const besar = ref(false);
watch(
  () => props.src,
  () => {
    gagal.value = false;
  }
);

const bisaPerbesar = computed(() => props.perbesar && Boolean(props.src) && !gagal.value);

function bukaBesar(event) {
  if (!bisaPerbesar.value) return;
  // In a table row or a header the click is only for the photo.
  event.stopPropagation();
  besar.value = true;
}

const boxStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.portrait ? Math.round((props.size * 5) / 4) : props.size}px`,
}));

const inisial = computed(() => {
  const kata = String(props.nama || '').trim().split(/\s+/).filter(Boolean);
  return ((kata[0]?.[0] || '') + (kata.length > 1 ? kata[kata.length - 1][0] : '')).toUpperCase() || '?';
});
</script>
