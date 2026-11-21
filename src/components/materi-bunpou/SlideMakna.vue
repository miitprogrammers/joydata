<template>
  <section class="slide mb-slide">
    <div class="s-label">{{ $t('materiBunpou.slide.maknaLabel') }}</div>
    <div class="makna-grid" :class="{ satu: materi.makna.length === 1 }" :style="{ '--kol': materi.makna.length }">
      <div v-for="(k, i) in materi.makna" :key="i" class="kartu-makna">
        <h3><span class="no">{{ i + 1 }}</span><TeksCampur :text="k.judul" /></h3>
        <div class="s-teks" style="margin-top: calc(8 * var(--u))"><TeksCampur :text="k.penjelasan" /></div>
        <div class="padanan">
          <span class="lbl">{{ $t('materiBunpou.slide.padanan') }}</span>
          <span v-for="(p, j) in k.padanan" :key="j"><TeksCampur :text="p" /></span>
        </div>
        <div v-if="k.contohMini" class="mini">
          <div class="jp"><JP :text="k.contohMini.jp" /></div>
          <div class="id"><TeksCampur :text="k.contohMini.id" /></div>
        </div>
      </div>
    </div>
    <div v-if="materi.perhatikan" class="perhatikan">
      <i class="mdi mdi-alert-circle-outline"></i>
      <div>
        <b>{{ $t('materiBunpou.slide.perhatikan') }}</b>
        <p><TeksCampur :text="materi.perhatikan" /></p>
      </div>
    </div>
  </section>
</template>

<script setup>
import JP from './JP.vue';
import TeksCampur from './TeksCampur.vue';

defineProps({ materi: { type: Object, required: true } });
</script>
