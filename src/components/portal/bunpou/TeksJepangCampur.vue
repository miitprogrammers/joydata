<template>
  <span
    ><template v-for="(b, i) in bagian" :key="i"
      ><span v-if="b.jp" lang="ja" translate="no"><FuriganaText :text="b.teks" /></span
      ><template v-else>{{ b.teks }}</template></template
    ></span
  >
</template>

<script setup>
import { computed } from 'vue';
import FuriganaText from '../tes/FuriganaText.vue';

// Indonesian text that quotes Japanese (kanji with 漢字{かな} furigana, kana, ～, 「」). Browser translation must
// translate the Indonesian and leave the Japanese runs alone, so only the Japanese runs get lang="ja" translate="no".
const props = defineProps({ text: { type: String, default: '' } });

const JP = '[～〜ぁ-ゖァ-ヺー・一-鿿々㐀-䶿]';
const RE = new RegExp(`((?:${JP}(?:\{[^}]*\})?|[「」、。]|[ \t]+(?=${JP}))+)`);

const bagian = computed(() =>
  String(props.text)
    .split(RE)
    .map((teks, i) => ({ teks, jp: i % 2 === 1 }))
    .filter((b) => b.teks !== '')
);
</script>
