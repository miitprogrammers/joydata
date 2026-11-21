<template>
  <section class="slide mb-slide">
    <div class="s-label">{{ $t('materiBunpou.slide.latihanLabel') }}</div>
    <div class="latihan-list">
      <div v-for="(l, i) in materi.latihan" :key="i" class="lat">
        <span class="no">{{ i + 1 }}</span>
        <div>
          <div class="tanya">
            <TeksCampur :text="l.tanya" /><template v-if="l.jp"> <span class="jp"><JP :text="l.jp" /></span></template>
          </div>
          <Rahasia
            class="jawab"
            :g="String(i)"
            :buka="semuaBuka || terbuka.includes(String(i))"
            :ph="$t('materiBunpou.slide.phJawaban')"
            @buka="$emit('buka', $event)"
          >
            <span v-if="l.jawabJp" class="jp"><JP :text="l.jawabJp" /></span>
            <TeksCampur v-else :text="l.jawab || ''" />
          </Rahasia>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import TeksCampur from './TeksCampur.vue';
import JP from './JP.vue';
import Rahasia from './Rahasia.vue';

defineProps({
  materi: { type: Object, required: true },
  terbuka: { type: Array, default: () => [] },
  semuaBuka: { type: Boolean, default: false },
});
defineEmits(['buka']);
</script>
