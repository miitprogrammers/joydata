<template>
  <div class="panggung-luar" ref="luarEl">
    <div ref="panggungEl" class="panggung mb-vars" :class="{ gerak }" :style="gaya" @mousemove="gerakkan">
      <div ref="kanvasEl" class="kanvas" :style="gayaKanvas"><slot /></div>
      <button type="button" class="tepi kiri" :aria-label="$t('materiBunpou.sebelumnya')" @click.stop="$emit('geser', -1)">
        <i class="mdi mdi-chevron-left"></i>
      </button>
      <button type="button" class="tepi kanan" :aria-label="$t('materiBunpou.berikutnya')" @click.stop="$emit('geser', 1)">
        <i class="mdi mdi-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

// 1280x720 canvas scaled to fit its container (or the screen in fullscreen); the stage is the fullscreen element.
defineEmits(['geser']);
// kunci changes whenever the visible slide changes; the slide is then re-measured and shrunk to fit.
const props = defineProps({ kunci: { type: String, default: '' } });
const kanvasEl = ref(null);

const luarEl = ref(null);
const panggungEl = ref(null);
const lebar = ref(1280);
const tinggi = ref(720);
const penuh = ref(false);
const gerak = ref(false);
let timer = null;
let pengamat = null;

const skala = computed(() => Math.min(lebar.value / 1280, tinggi.value / 720));
const gaya = computed(() => (penuh.value ? {} : { width: `${lebar.value}px`, height: `${tinggi.value}px` }));
const gayaKanvas = computed(() => ({
  transform: `scale(${skala.value})`,
  left: `${(lebar.value - 1280 * skala.value) / 2}px`,
  top: `${(tinggi.value - 720 * skala.value) / 2}px`,
}));

function ukur() {
  penuh.value = document.fullscreenElement === panggungEl.value;
  if (penuh.value) {
    lebar.value = window.innerWidth;
    tinggi.value = window.innerHeight;
    return;
  }
  const induk = luarEl.value?.clientWidth || 1280;
  let w = Math.min(induk, ((window.innerHeight - 250) * 16) / 9);
  w = Math.max(w, Math.min(induk, 320));
  lebar.value = w;
  tinggi.value = (w * 9) / 16;
}

// Real content can be taller than 720px: find the largest --u in [0.7, 1] that fits.
async function fit() {
  await nextTick();
  const el = kanvasEl.value?.querySelector('.mb-slide');
  if (!el) return;
  const muat = (u) => {
    el.style.setProperty('--u', `${u}px`);
    // scrollHeight ignores the bottom padding of an overflow:visible flex box, so measure the children
    // and keep the padding free.
    const gaya = getComputedStyle(el);
    let bawah = 0;
    for (const c of el.children) bawah = Math.max(bawah, c.offsetTop + c.offsetHeight);
    return bawah + parseFloat(gaya.paddingBottom) <= el.clientHeight + 1 && el.scrollWidth <= el.clientWidth + 1;
  };
  if (muat(1)) return;
  // Height is not linear in font size (text rewraps), so bisect for the largest unit that fits.
  let lo = 0.7;
  let hi = 1;
  let terbaik = 0.7;
  for (let i = 0; i < 7; i++) {
    const mid = (lo + hi) / 2;
    if (muat(mid)) {
      terbaik = mid;
      lo = mid;
    } else hi = mid;
  }
  el.style.setProperty('--u', `${terbaik}px`);
}
watch(() => props.kunci, fit);

function gerakkan() {
  gerak.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (gerak.value = false), 1500);
}

function layarPenuh() {
  const el = panggungEl.value;
  try {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (el?.requestFullscreen) el.requestFullscreen().catch(() => {});
  } catch {
    /* fullscreen unavailable: ignore */
  }
}

onMounted(() => {
  ukur();
  fit();
  document.fonts?.ready?.then(fit);
  window.addEventListener('resize', ukur);
  document.addEventListener('fullscreenchange', ukur);
  if (typeof ResizeObserver !== 'undefined' && luarEl.value) {
    pengamat = new ResizeObserver(ukur);
    pengamat.observe(luarEl.value);
  }
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', ukur);
  document.removeEventListener('fullscreenchange', ukur);
  pengamat?.disconnect();
  clearTimeout(timer);
});

defineExpose({ layarPenuh, ukur, sedangPenuh: () => document.fullscreenElement === panggungEl.value });
</script>

<style scoped>
.panggung-luar {
  display: flex;
  justify-content: center;
}
.panggung {
  position: relative;
  background: #0f172a;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08), 0 10px 30px -12px rgba(15, 23, 42, 0.25);
}
.panggung:fullscreen {
  border-radius: 0;
  width: 100vw !important;
  height: 100vh !important;
}
.kanvas {
  position: absolute;
  width: 1280px;
  height: 720px;
  transform-origin: 0 0;
  background: #fff;
}
.tepi {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 9%;
  border: 0;
  background: none;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 5;
  /* only the visible circle takes clicks, so the strip never covers slide content */
  pointer-events: none;
}
.tepi .mdi {
  font-size: 40px;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}
.tepi.kiri {
  left: 0;
  justify-content: flex-start;
  padding-left: 12px;
}
.tepi.kanan {
  right: 0;
  justify-content: flex-end;
  padding-right: 12px;
}
.panggung.gerak .tepi {
  opacity: 1;
}
.panggung.gerak .tepi .mdi {
  pointer-events: auto;
  cursor: pointer;
}
@media (prefers-reduced-motion: reduce) {
  .tepi {
    transition: none;
  }
}
</style>
