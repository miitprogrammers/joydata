<template>
  <section class="slide mb-slide">
    <div class="s-label">{{ $t('materiBunpou.slide.kesalahanLabel') }}</div>
    <div class="salah-grid">
      <div class="hd">{{ $t('materiBunpou.slide.salah') }}</div>
      <div class="hd">{{ $t('materiBunpou.slide.benar') }}</div>
      <div class="hd">{{ $t('materiBunpou.slide.kenapa') }}</div>
      <template v-for="(k, i) in materi.kesalahan" :key="i">
        <div class="x"><i class="mdi mdi-close-circle"></i><span class="jp"><JP :text="k.salah" /></span></div>
        <div class="v"><i class="mdi mdi-check-circle"></i><JP :text="k.benar" /></div>
        <div class="k"><TeksCampur :text="k.alasan" /></div>
      </template>
    </div>
  </section>
</template>

<script setup>
import JP from './JP.vue';
import TeksCampur from './TeksCampur.vue';

defineProps({ materi: { type: Object, required: true } });
</script>
