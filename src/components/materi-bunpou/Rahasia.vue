<template>
  <div class="rahasia" :class="{ buka, senyap }" :data-ph="ph" @click="!buka && $emit('buka', g)">
    <div class="isi-rahasia"><slot /></div>
  </div>
</template>

<script setup>
// A part of a slide that stays hidden until the sensei reveals its group. Styles live in slide.css.
defineProps({
  g: { type: String, required: true },
  buka: { type: Boolean, default: false },
  senyap: { type: Boolean, default: false }, // hidden without a placeholder
  ph: { type: String, default: '' },
});
defineEmits(['buka']);
</script>
