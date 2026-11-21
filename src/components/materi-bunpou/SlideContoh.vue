<template>
  <section class="slide mb-slide">
    <div class="s-label contoh-kepala">
      {{ $t('materiBunpou.slide.contoh') }} {{ indeks + 1 }} / {{ materi.contoh.length }}
      <span class="tempat"><i class="mdi" :class="IKON[contoh.tempat] || 'mdi-chat-outline'"></i>{{ $t(`materiBunpou.tempat.${contoh.tempat}`) }}</span>
      <span class="makna-chip">
        <TeksCampur v-if="contoh.label" :text="contoh.label" />
        <template v-else>{{ NOMOR[contoh.makna] }} <TeksCampur :text="materi.makna[contoh.makna]?.judul || ''" /></template>
      </span>
    </div>
    <div class="situasi"><TeksCampur :text="contoh.situasi" /></div>
    <div class="dialog">
      <div v-for="(b, i) in contoh.baris" :key="i" class="dlg-baris" :class="{ tunggal: !b.penutur }">
        <span v-if="b.penutur" class="penutur"><TeksCampur :text="b.penutur" /></span>
        <div>
          <div class="jp"><JP :text="b.jp" /></div>
          <Rahasia class="terj" g="0" :buka="terbuka" :ph="$t('materiBunpou.slide.phTerjemahan')" @buka="$emit('buka', $event)">
            <TeksCampur :text="b.id" />
          </Rahasia>
        </div>
      </div>
    </div>
    <Rahasia v-if="contoh.catatan" class="lampu" g="0" senyap :buka="terbuka" @buka="$emit('buka', $event)">
      <span style="display: flex; gap: calc(14 * var(--u))">
        <i class="mdi mdi-lightbulb-on-outline"></i><span><TeksCampur :text="contoh.catatan" /></span>
      </span>
    </Rahasia>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import JP from './JP.vue';
import TeksCampur from './TeksCampur.vue';
import Rahasia from './Rahasia.vue';

const props = defineProps({
  materi: { type: Object, required: true },
  indeks: { type: Number, required: true },
  terbuka: { type: Boolean, default: false }, // the single hidden group of this slide is open
});
defineEmits(['buka']);

const contoh = computed(() => props.materi.contoh[props.indeks]);
const NOMOR = ['①', '②', '③'];
const IKON = {
  kerja: 'mdi-factory',
  asrama: 'mdi-home-city-outline',
  kelas: 'mdi-school-outline',
  belanja: 'mdi-cart-outline',
  transportasi: 'mdi-train',
  rumahsakit: 'mdi-hospital-box-outline',
  mensetsu: 'mdi-account-tie-voice',
  telepon: 'mdi-phone-outline',
  rumah: 'mdi-home-outline',
  jalan: 'mdi-map-marker-outline',
  tawar: 'mdi-gift-outline',
  umum: 'mdi-chat-outline',
};
</script>
