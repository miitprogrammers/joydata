<template>
  <section class="slide mb-slide">
    <div class="s-label">{{ $t('materiBunpou.slide.bandingkanLabel') }}</div>
    <div class="banding-wrap">
      <table class="s-tabel banding">
        <thead>
          <tr>
            <th></th>
            <th v-for="(k, i) in b.kolom" :key="i" class="kol" :class="{ utama: i === 0 }">
              <JP :text="k.pola" />
              <small :class="{ lanjut: k.lanjutan }">
                <TeksCampur :text="k.sub" /><template v-if="k.lanjutan"> · {{ $t('materiBunpou.slide.lanjutan') }}</template>
              </small>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in b.baris" :key="i">
            <td class="lbl"><TeksCampur :text="r.label" /></td>
            <td v-for="(x, j) in r.isi" :key="j" :class="{ utama: j === 0 }">
              <span v-if="r.jp" class="jp"><JP :text="x" /></span>
              <TeksCampur v-else :text="x" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="b.kaki" class="kaki"><i class="mdi mdi-thumb-up-outline"></i><span><TeksCampur :text="b.kaki" /></span></div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import JP from './JP.vue';
import TeksCampur from './TeksCampur.vue';

const props = defineProps({ materi: { type: Object, required: true } });
const b = computed(() => props.materi.bandingkan);
</script>
