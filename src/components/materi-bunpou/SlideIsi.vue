<template>
  <SlideJudul v-if="slide.jenis === 'judul'" :materi="materi" />
  <SlideRumus v-else-if="slide.jenis === 'rumus'" :materi="materi" />
  <SlideMakna v-else-if="slide.jenis === 'makna'" :materi="materi" />
  <SlideContoh
    v-else-if="slide.jenis === 'contoh'"
    :materi="materi"
    :indeks="slide.indeks"
    :terbuka="semua || terbuka.includes('0')"
    @buka="$emit('buka', $event)"
  />
  <SlideBandingkan v-else-if="slide.jenis === 'bandingkan'" :materi="materi" />
  <SlideKesalahan v-else-if="slide.jenis === 'kesalahan'" :materi="materi" />
  <SlideLatihan
    v-else-if="slide.jenis === 'latihan'"
    :materi="materi"
    :terbuka="terbuka"
    :semua-buka="semua"
    @buka="$emit('buka', $event)"
  />
  <SlideRingkasan v-else-if="slide.jenis === 'ringkasan'" :materi="materi" :ringkas="ringkas" @ke="$emit('ke', $event)" />
</template>

<script setup>
import './slide.css';
import SlideJudul from './SlideJudul.vue';
import SlideRumus from './SlideRumus.vue';
import SlideMakna from './SlideMakna.vue';
import SlideContoh from './SlideContoh.vue';
import SlideBandingkan from './SlideBandingkan.vue';
import SlideKesalahan from './SlideKesalahan.vue';
import SlideLatihan from './SlideLatihan.vue';
import SlideRingkasan from './SlideRingkasan.vue';

// Renders one slide from its descriptor { jenis, indeks? }; groups in `terbuka` (or all when `semua`) are revealed.
defineProps({
  slide: { type: Object, required: true },
  materi: { type: Object, required: true },
  ringkas: { type: Object, default: () => ({}) },
  terbuka: { type: Array, default: () => [] },
  semua: { type: Boolean, default: false },
});
defineEmits(['buka', 'ke']);
</script>
