<template>
  <span
    ><template v-for="(b, i) in bagian" :key="i"
      ><span v-if="b.jp" lang="ja" translate="no">{{ b.teks }}</span
      ><template v-else>{{ b.teks }}</template></template
    ></span
  >
</template>

<script setup>
import { computed } from 'vue';

// Indonesian text that quotes kana ("bentuk た", "～たら"). Browser translation would mangle those runs, so each run
// is marked as Japanese.
const props = defineProps({ text: { type: String, default: '' } });

const KANA = '[～〜]*[ぁ-ゖァ-ヺ][ぁ-ゖァ-ヺー～〜]*';
const RE = new RegExp(`(${KANA}(?:\\s*[＋→]\\s*${KANA})*)`);

const bagian = computed(() =>
  props.text
    .split(RE)
    .map((teks, i) => ({ teks, jp: i % 2 === 1 }))
    .filter((b) => b.teks !== '')
);
</script>
