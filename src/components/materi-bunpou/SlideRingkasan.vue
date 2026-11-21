<template>
  <section class="slide mb-slide">
    <div class="s-label">{{ $t('materiBunpou.slide.ringkasanLabel') }}</div>
    <div class="ring-grid">
      <div class="ring-kiri">
        <div class="besar" lang="ja" translate="no"><span v-if="adaTilde" class="tilde">～</span><JP :text="polaTanpaTilde" /></div>
        <div v-if="materi.inti" class="inti"><TeksCampur :text="materi.inti" /></div>
      </div>
      <div>
        <ul class="ring-list">
          <li v-for="(r, i) in materi.ringkasan" :key="i">
            <i class="mdi mdi-check-bold"></i><span><TeksCampur :text="r" /></span>
          </li>
        </ul>
        <div v-if="terkait.length" class="terkait" style="margin-top: calc(34 * var(--u))">
          {{ $t('materiBunpou.slide.terkait') }}
          <button
            v-for="t in terkait"
            :key="t.id"
            type="button"
            :disabled="t.status === 'belum'"
            :title="t.status === 'belum' ? $t('materiBunpou.status.belum') : ''"
            :style="t.status === 'belum' ? 'opacity: .5' : ''"
            @click="$emit('ke', t.id)"
          >
            <JP :text="t.pola" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import JP from './JP.vue';
import TeksCampur from './TeksCampur.vue';

const props = defineProps({
  materi: { type: Object, required: true },
  ringkas: { type: Object, default: () => ({}) },
});
defineEmits(['ke']);

const adaTilde = computed(() => /^[～〜]/.test(props.materi.pola));
const polaTanpaTilde = computed(() => props.materi.pola.replace(/^[～〜]/, ''));
const terkait = computed(() => (props.materi.terkait || []).map((id) => props.ringkas[id]).filter(Boolean));
</script>
