<template>
  <span class="furigana-text"
    ><template v-for="(seg, i) in segments" :key="i"
      ><ruby v-if="seg.rt"
        >{{ seg.base }}<rt v-if="furigana">{{ seg.rt }}</rt></ruby
      ><template v-else>{{ seg.base }}</template></template
    ></span
  >
</template>

<script setup>
import { computed } from 'vue';

// Bank text writes furigana right after its kanji: 毎朝{まいあさ}.
const props = defineProps({
  text: { type: String, default: '' },
  furigana: { type: Boolean, default: true },
});

const POLA = /([㐀-鿿々〆ヶ]+)\{([^}]+)\}/g;

const segments = computed(() => {
  const out = [];
  let last = 0;
  for (const m of props.text.matchAll(POLA)) {
    if (m.index > last) out.push({ base: props.text.slice(last, m.index) });
    out.push({ base: m[1], rt: m[2] });
    last = m.index + m[0].length;
  }
  if (last < props.text.length) out.push({ base: props.text.slice(last) });
  return out;
});
</script>

<style scoped>
.furigana-text rt {
  font-size: 0.55em;
  color: rgb(var(--v-theme-primary));
}
</style>
