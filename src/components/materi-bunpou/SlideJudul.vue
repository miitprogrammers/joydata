<template>
  <section class="slide mb-slide s-judul">
    <div class="chips">
      <span v-for="(s, i) in sumber" :key="i" class="chip">{{ s }}</span>
    </div>
    <div class="besar" lang="ja" translate="no">
      <span v-if="adaTilde" class="tilde">～</span><JP :text="polaTanpaTilde" />
    </div>
    <div class="romaji">{{ materi.romaji }}</div>
    <div class="arti"><TeksCampur :text="materi.arti" /></div>
    <div v-if="materi.inti" class="inti">
      <i class="mdi mdi-key-variant"></i><TeksCampur :text="materi.inti" />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import JP from './JP.vue';
import TeksCampur from './TeksCampur.vue';

const props = defineProps({ materi: { type: Object, required: true } });
const { t } = useI18n();

// The leading tilde is drawn in a faded colour.
const adaTilde = computed(() => /^[～〜]/.test(props.materi.pola));
const polaTanpaTilde = computed(() => props.materi.pola.replace(/^[～〜]/, ''));

const sumber = computed(() => {
  const m = props.materi;
  const s = m.sumber || {};
  const out = [];
  if (s.minnaBab?.length) out.push(`${m.tingkat} · ${t('materiBunpou.sumber.minna', { bab: s.minnaBab.join(', ') })}`);
  else out.push(m.tingkat);
  if (s.modulN4?.length) {
    out.push(t('materiBunpou.sumber.modul', { nomor: s.modulN4.map((n) => `#${n}`).join(' ') }) + (m.level ? ` · ${m.level}` : ''));
  }
  if (s.jlptsensei) {
    for (const [tk, ns] of Object.entries(s.jlptsensei)) out.push(`jlptsensei ${tk} ${ns.map((n) => `#${n}`).join(' ')}`);
  }
  return out;
});
</script>
