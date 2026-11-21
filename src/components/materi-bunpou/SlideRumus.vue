<template>
  <section class="slide mb-slide">
    <div class="s-label">{{ $t('materiBunpou.slide.rumusLabel') }}</div>
    <div v-if="materi.rumusPengantar" class="s-teks"><TeksCampur :text="materi.rumusPengantar" /></div>
    <table class="s-tabel rumus">
      <thead>
        <tr>
          <th>{{ $t('materiBunpou.slide.jenisKata') }}</th>
          <th><TeksCampur :text="materi.rumusKolom.dasar" /></th>
          <th></th>
          <template v-if="adaAntara">
            <th><TeksCampur :text="materi.rumusKolom.antara || ''" /></th>
            <th></th>
          </template>
          <th><TeksCampur :text="materi.rumusKolom.hasil" /></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in materi.rumus" :key="i">
          <td class="jenis"><TeksCampur :text="r.jenis" /></td>
          <td class="jp"><JP :text="r.dasar" /></td>
          <td class="panah-r">→</td>
          <template v-if="adaAntara">
            <td class="jp antara"><JP :text="r.antara || ''" /></td>
            <td class="panah-r">→</td>
          </template>
          <td class="jp hasil">
            <JP :text="r.hasil" />
            <span v-if="r.catatan" class="warn">
              <JP v-if="r.catatan.includes('{')" :text="r.catatan" /><TeksCampur v-else :text="r.catatan" />
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import JP from './JP.vue';
import TeksCampur from './TeksCampur.vue';

const props = defineProps({ materi: { type: Object, required: true } });
const adaAntara = computed(() => Boolean(props.materi.rumusKolom?.antara) || props.materi.rumus.some((r) => r.antara));
</script>
