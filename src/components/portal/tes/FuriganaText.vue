<template>
  <span v-if="!sorot && !frasa" class="furigana-text"
    ><template v-for="(seg, i) in segments" :key="i"
      ><ruby v-if="seg.rt"
        >{{ seg.base }}<rt v-if="furigana">{{ seg.rt }}</rt></ruby
      ><template v-else>{{ seg.base }}</template></template
    ></span
  >
  <span v-else class="furigana-text"
    ><span v-for="(grup, g) in kelompok" :key="g" :class="frasa ? 'frasa' : null"
      ><template v-for="(bagian, p) in grup" :key="p"
        ><mark v-if="bagian.sorot" class="sorot"
          ><template v-for="(seg, i) in bagian.segs" :key="i"
            ><ruby v-if="seg.rt"
              >{{ seg.base }}<rt v-if="furigana">{{ seg.rt }}</rt></ruby
            ><template v-else>{{ seg.base }}</template></template
          ></mark
        ><template v-else
          ><template v-for="(seg, i) in bagian.segs" :key="i"
            ><ruby v-if="seg.rt"
              >{{ seg.base }}<rt v-if="furigana">{{ seg.rt }}</rt></ruby
            ><template v-else>{{ seg.base }}</template></template
          ></template
        ></template
      ></span
    ></span
  >
</template>

<script setup>
import { computed } from 'vue';

// Bank text writes furigana right after its kanji: 毎朝{まいあさ}.
// Optional (off by default): sorot renders [[...]] as <mark class="sorot">; frasa wraps each phrase ending in 、
// in an inline-block span so a long sentence breaks between phrases.
const props = defineProps({
  text: { type: String, default: '' },
  furigana: { type: Boolean, default: true },
  sorot: { type: Boolean, default: false },
  frasa: { type: Boolean, default: false },
});

// Default (both new props off) markup stays identical to what Tes Online / Bank Soal always rendered.
const POLA = /([㐀-鿿々〆ヶ]+)\{([^}]+)\}/g;

function bagiFurigana(teks) {
  const out = [];
  let last = 0;
  for (const m of teks.matchAll(POLA)) {
    if (m.index > last) out.push({ base: teks.slice(last, m.index) });
    out.push({ base: m[1], rt: m[2] });
    last = m.index + m[0].length;
  }
  if (last < teks.length) out.push({ base: teks.slice(last) });
  return out;
}

const segments = computed(() => bagiFurigana(props.text));

// phrases -> parts (plain / highlighted) -> furigana segments
const kelompok = computed(() => {
  const frasaList = props.frasa ? (props.text.match(/[^、]*、|[^、]+$/g) || ['']) : [props.text];
  return frasaList.map((f) => {
    const bagian = props.sorot ? f.split(/(\[\[.*?\]\])/) : [f];
    return bagian
      .filter((b) => b !== '')
      .map((b) =>
        props.sorot && b.startsWith('[[') && b.endsWith(']]')
          ? { sorot: true, segs: bagiFurigana(b.slice(2, -2)) }
          : { sorot: false, segs: bagiFurigana(b) }
      );
  });
});
</script>

<style scoped>
/* Memo, email and notice passages keep their lines; titles, questions and options never contain line breaks. */
.furigana-text {
  white-space: pre-line;
}
.furigana-text rt {
  font-size: 0.55em;
  color: rgb(var(--v-theme-primary));
}
.frasa {
  display: inline-block;
}
mark.sorot {
  background: linear-gradient(transparent 12%, #fef08a 12%, #fef08a 94%, transparent 94%);
  color: inherit;
  font-weight: 700;
  padding: 0 0.06em;
  border-radius: 3px;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
</style>
