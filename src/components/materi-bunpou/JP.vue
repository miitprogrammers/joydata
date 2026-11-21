<template>
  <span lang="ja" translate="no"><FuriganaText :text="text" sorot frasa /></span>
</template>

<script setup>
import FuriganaText from '../portal/tes/FuriganaText.vue';

// Japanese text of a material: furigana 漢字{かな}, highlight [[...]], phrases that break after 、.
defineProps({ text: { type: String, default: '' } });
</script>
