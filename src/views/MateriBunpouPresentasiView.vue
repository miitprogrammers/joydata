<template>
  <div class="mb-vars">
    <div class="toolbar">
      <button type="button" class="btn teks" @click="kembali">
        <i class="mdi mdi-arrow-left"></i><span>{{ labelKembali }}</span>
      </button>
      <span v-if="materi" class="judul-pres">
        <JP :text="materi.pola" />
        <span class="status" :class="materi.status">
          <i class="mdi" :class="materi.status === 'ditinjau' ? 'mdi-check-circle' : 'mdi-circle'"></i>
          {{ $t(`materiBunpou.status.${materi.status}`) }}
        </span>
      </span>
      <span class="spasi"></span>
      <template v-if="materi">
        <button type="button" class="btn" :class="{ on: furigana }" title="Furigana (R)" @click="furigana = !furigana">
          <i class="mdi mdi-format-letter-case"></i><span class="label-btn">{{ $t('materiBunpou.furigana') }}</span>
        </button>
        <button type="button" class="btn" :class="{ on: tampil }" title="T" @click="tampil = !tampil">
          <i class="mdi" :class="tampil ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"></i>
          <span class="label-btn">{{ tampil ? $t('materiBunpou.terjemahanTampil') : $t('materiBunpou.terjemahanSembunyi') }}</span>
        </button>
        <button type="button" class="btn" :class="{ on: baca }" title="B" @click="baca = !baca">
          <i class="mdi mdi-view-agenda-outline"></i><span class="label-btn">{{ $t('materiBunpou.modeBaca') }}</span>
        </button>
        <button v-if="!baca" type="button" class="btn" title="F" @click="layarPenuh">
          <i class="mdi mdi-fullscreen"></i><span class="label-btn">{{ $t('materiBunpou.layarPenuh') }}</span>
        </button>
      </template>
    </div>

    <div v-if="muat && !materi" class="pesan">{{ $t('materiBunpou.memuat') }}</div>
    <div v-else-if="galat && !materi" class="pesan">
      <p>{{ galat === 404 ? $t('materiBunpou.tidakDitemukan') : $t('materiBunpou.gagal') }}</p>
      <div class="mt-3">
        <button v-if="galat !== 404" type="button" class="joy-btn-secondary mr-2" @click="muatMateri">{{ $t('materiBunpou.muatUlang') }}</button>
        <button type="button" class="joy-btn-primary" @click="kembali">{{ $t('materiBunpou.kembaliKeDaftar') }}</button>
      </div>
    </div>

    <template v-else-if="materi">
      <!-- Reading mode: every slide as a card, translations open, teacher notes on top -->
      <div v-if="baca" class="mb-baca" :class="{ 'mb-tanpa-furigana': !furigana }">
        <div v-if="materi.catatanSensei?.length" class="catatan-baca">
          <b><i class="mdi mdi-notebook-edit-outline"></i>{{ $t('materiBunpou.catatanSensei') }}</b>
          <ul>
            <li v-for="(c, i) in materi.catatanSensei" :key="i"><TeksCampur :text="c" /></li>
          </ul>
        </div>
        <SlideIsi v-for="(s, i) in slides" :key="i" :slide="s" :materi="materi" :ringkas="ringkas" semua @ke="keMateri" />
      </div>

      <div v-else>
        <KanvasSlide ref="kanvasRef" :kunci="`${materi.id}|${slide}|${furigana}`" :class="{ 'mb-tanpa-furigana': !furigana }" @geser="geser">
          <SlideIsi
            :key="slide"
            :slide="slides[slide]"
            :materi="materi"
            :ringkas="ringkas"
            :terbuka="buka[slide] || []"
            :semua="tampil"
            @buka="bukaGrup"
            @ke="keMateri"
          />
        </KanvasSlide>

        <div class="strip">
          <button type="button" class="btn" :aria-label="$t('materiBunpou.sebelumnya')" :disabled="slide === 0" @click="geser(-1)">
            <i class="mdi mdi-chevron-left"></i>
          </button>
          <button v-for="g in strip" :key="g.grup" type="button" class="seg" :class="{ on: g.idx.includes(slide) }" @click="ke(g.idx[0])">
            {{ $t(`materiBunpou.stripGrup.${g.grup}`) }}
            <template v-if="g.idx.length > 1">
              <span v-for="i in g.idx" :key="i" class="titik" :class="{ on: i === slide }"></span>
            </template>
          </button>
          <button type="button" class="btn" :aria-label="$t('materiBunpou.berikutnya')" :disabled="slide === slides.length - 1" @click="geser(1)">
            <i class="mdi mdi-chevron-right"></i>
          </button>
          <span class="nomor">{{ slide + 1 }} / {{ slides.length }}</span>
        </div>

        <div class="pintasan">
          <kbd>←</kbd><kbd>→</kbd> {{ $t('materiBunpou.pintasan') }} · <kbd>T</kbd> {{ $t('materiBunpou.pintasanTerjemahan') }} ·
          <kbd>R</kbd> {{ $t('materiBunpou.pintasanFurigana') }} · <kbd>F</kbd> {{ $t('materiBunpou.pintasanLayar') }} ·
          <kbd>B</kbd> {{ $t('materiBunpou.pintasanBaca') }} · <kbd>Esc</kbd> {{ $t('materiBunpou.pintasanKembali') }}
        </div>

        <details v-if="materi.catatanSensei?.length" class="joy-surface catatan-sensei">
          <summary>
            <i class="mdi mdi-notebook-edit-outline"></i>{{ $t('materiBunpou.catatanSensei') }}
            <span class="redup">· {{ $t('materiBunpou.tidakDiLayarPenuh') }}</span>
          </summary>
          <ul>
            <li v-for="(c, i) in materi.catatanSensei" :key="i"><TeksCampur :text="c" /></li>
          </ul>
        </details>
      </div>
    </template>
  </div>
</template>

<script>
// Survives navigation between presentations (related patterns), so "back" always returns to the search list.
const jejak = { daftar: '/materi-bunpou' };
</script>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import KanvasSlide from '../components/materi-bunpou/KanvasSlide.vue';
import SlideIsi from '../components/materi-bunpou/SlideIsi.vue';
import JP from '../components/materi-bunpou/JP.vue';
import TeksCampur from '../components/materi-bunpou/TeksCampur.vue';
import '../components/materi-bunpou/slide.css';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const materi = ref(null);
const ringkas = ref({});
const muat = ref(true);
const galat = ref(0); // 0 = none, 404 = not found, other = failed to load
const slide = ref(0);
const buka = ref({}); // slide index -> revealed group ids
const tampil = ref(false); // toolbar: reveal everything everywhere
const baca = ref(false);
const kanvasRef = ref(null);

const KUNCI_FURIGANA = 'materiBunpou.furigana';
function bacaFurigana() {
  try {
    return localStorage.getItem(KUNCI_FURIGANA) !== '0';
  } catch {
    return true;
  }
}
const furigana = ref(bacaFurigana());
watch(furigana, (v) => {
  try {
    localStorage.setItem(KUNCI_FURIGANA, v ? '1' : '0');
  } catch {
    /* storage unavailable: the choice just is not remembered */
  }
});

// Remember where the list was (with its search) so "back" restores it.
const dari = typeof window !== 'undefined' ? window.history.state?.back : null;
// Opened directly (not from the list): forget any older list position.
jejak.daftar = typeof dari === 'string' && dari.split('?')[0] === '/materi-bunpou' ? dari : '/materi-bunpou';

const labelKembali = computed(() => {
  const q = new URLSearchParams(jejak.daftar.split('?')[1] || '').get('q');
  return q ? t('materiBunpou.kembaliKe', { q }) : t('materiBunpou.kembaliKeDaftar');
});

const slides = computed(() => {
  const m = materi.value;
  if (!m) return [];
  const s = [{ jenis: 'judul', grup: 'judul' }, { jenis: 'rumus', grup: 'rumus' }, { jenis: 'makna', grup: 'makna' }];
  (m.contoh || []).forEach((_, i) => s.push({ jenis: 'contoh', grup: 'contoh', indeks: i }));
  if (m.bandingkan) s.push({ jenis: 'bandingkan', grup: 'bandingkan' });
  if (m.kesalahan?.length) s.push({ jenis: 'kesalahan', grup: 'kesalahan' });
  s.push({ jenis: 'latihan', grup: 'latihan' }, { jenis: 'ringkasan', grup: 'ringkasan' });
  return s;
});

// One nav button per slide group; groups with several slides (examples) get dots.
const strip = computed(() => {
  const out = [];
  slides.value.forEach((s, i) => {
    const g = out.find((x) => x.grup === s.grup);
    if (g) g.idx.push(i);
    else out.push({ grup: s.grup, idx: [i] });
  });
  return out;
});

// Hidden groups of a slide: the translation block of an example, one answer per exercise.
function grupSlide(i) {
  const s = slides.value[i];
  if (!s) return [];
  if (s.jenis === 'contoh') return ['0'];
  if (s.jenis === 'latihan') return materi.value.latihan.map((_, j) => String(j));
  return [];
}
const tertutup = (i) => grupSlide(i).filter((g) => !(buka.value[i] || []).includes(g));

function bukaGrup(g) {
  const lama = buka.value[slide.value] || [];
  if (!lama.includes(g)) buka.value = { ...buka.value, [slide.value]: [...lama, g] };
}

function ke(n) {
  slide.value = Math.max(0, Math.min(n, slides.value.length - 1));
}
function geser(n) {
  if (n > 0 && !tampil.value) {
    // Hidden parts open first, one group per press, like slide animations
    const sisa = tertutup(slide.value);
    if (sisa.length) {
      bukaGrup(sisa[0]);
      return;
    }
  }
  const tujuan = slide.value + n;
  if (tujuan < 0 || tujuan >= slides.value.length) return;
  slide.value = tujuan;
}
function toggleT() {
  const semua = grupSlide(slide.value);
  if (!semua.length) return;
  buka.value = { ...buka.value, [slide.value]: tertutup(slide.value).length ? [...semua] : [] };
}

function layarPenuh() {
  kanvasRef.value?.layarPenuh?.();
}
function kembali() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  router.push(jejak.daftar);
}
function keMateri(id) {
  // replace, so the history keeps pointing back at the list
  router.replace({ path: `/materi-bunpou/${id}` });
}

function simpanTerakhir(id) {
  try {
    const a = JSON.parse(localStorage.getItem('materiBunpou.terakhir') || '[]').filter((x) => x !== id);
    a.unshift(id);
    localStorage.setItem('materiBunpou.terakhir', JSON.stringify(a.slice(0, 6)));
  } catch {
    /* storage unavailable: the "last opened" row is simply hidden */
  }
}

// ?slide=n (1-based); ?slide=bandingkan jumps to the comparison slide
function slideDariUrl() {
  const p = route.query.slide;
  if (p === 'bandingkan') {
    const i = slides.value.findIndex((s) => s.jenis === 'bandingkan');
    return i >= 0 ? i : 0;
  }
  const n = Number.parseInt(p, 10);
  return Number.isFinite(n) ? n - 1 : 0;
}

let nomorMuat = 0;
async function muatMateri() {
  const id = String(route.params.id || '');
  const nomor = ++nomorMuat;
  muat.value = true;
  galat.value = 0;
  try {
    const res = await apiRequest(`/materi-bunpou/${encodeURIComponent(id)}`);
    if (nomor !== nomorMuat) return;
    materi.value = res.materi;
    ringkas.value = res.ringkas || {};
    buka.value = {};
    tampil.value = false;
    ke(slideDariUrl());
    if (typeof window !== 'undefined' && window.innerWidth < 600) baca.value = true;
    simpanTerakhir(id);
  } catch (err) {
    if (nomor !== nomorMuat) return;
    materi.value = null;
    galat.value = err?.status === 404 || err?.code === 'materi_tidak_ditemukan' ? 404 : err?.status || 500;
  } finally {
    if (nomor === nomorMuat) muat.value = false;
  }
}

watch(() => route.params.id, (id) => id && muatMateri());
watch(slide, (n) => {
  if (!materi.value) return;
  const sekarang = Number.parseInt(route.query.slide, 10);
  if (sekarang === n + 1) return;
  router.replace({ query: { ...route.query, slide: String(n + 1) } }).catch(() => {});
});

function tekan(e) {
  if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing || e.keyCode === 229) return;
  if (e.target instanceof HTMLElement && e.target.matches('input, select, textarea')) return;
  // Do not act behind an open dialog (e.g. the logout confirmation)
  if (document.querySelector('.v-overlay--active')) return;
  const k = e.key.toLowerCase();
  if (k === 'escape') {
    if (!document.fullscreenElement) kembali();
    return;
  }
  if (!materi.value || muat.value) return;
  if (['arrowright', ' ', 'pagedown'].includes(k)) {
    // Space on a focused button would also click it
    e.preventDefault();
    if (!baca.value) geser(1);
  } else if (['arrowleft', 'pageup'].includes(k)) {
    e.preventDefault();
    if (!baca.value) geser(-1);
  } else if (k === 't') toggleT();
  else if (k === 'r') furigana.value = !furigana.value;
  else if (k === 'f') {
    if (!baca.value) layarPenuh();
  } else if (k === 'b') baca.value = !baca.value;
  else if (/^[1-9]$/.test(k) && !baca.value) ke(Number(k) - 1);
}

onMounted(() => {
  muatMateri();
  document.addEventListener('keydown', tekan);
});
onBeforeUnmount(() => document.removeEventListener('keydown', tekan));
</script>

<style scoped>
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.toolbar .spasi {
  flex: 1;
}
.judul-pres {
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
}
.status {
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  font-family: var(--font-body);
}
.status.draf {
  color: #b45309;
}
.status.ditinjau {
  color: #047857;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
  cursor: pointer;
}
.btn .mdi {
  font-size: 18px;
}
.btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}
.btn:disabled {
  opacity: 0.45;
  cursor: default;
}
.btn.on {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}
.btn.teks {
  border-color: transparent;
  background: none;
  color: #1d4ed8;
  padding-left: 4px;
}
.btn.teks:hover {
  background: #eff6ff;
}
.pesan {
  margin-top: 24px;
  padding: 36px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
}
.strip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 14px auto 0;
  flex-wrap: wrap;
  justify-content: center;
}
.seg {
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 13px;
  color: #475569;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.seg.on {
  border-color: #1d4ed8;
  color: #1d4ed8;
  font-weight: 600;
  background: #eff6ff;
}
.titik {
  width: 7px;
  height: 7px;
  border-radius: 99px;
  background: #cbd5e1;
  display: inline-block;
}
.titik.on {
  background: #1d4ed8;
}
.nomor {
  font-size: 13px;
  color: #64748b;
  margin-left: 6px;
  font-variant-numeric: tabular-nums;
}
.pintasan {
  text-align: center;
  font-size: 12px;
  color: #64748b;
  margin-top: 10px;
}
kbd {
  font-size: 11px;
  border: 1px solid #cbd5e1;
  border-bottom-width: 2px;
  border-radius: 4px;
  padding: 0 5px;
  background: #fff;
  color: #475569;
  margin: 0 2px;
}
.catatan-sensei {
  margin-top: 16px;
}
.catatan-sensei summary {
  cursor: pointer;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
}
.catatan-sensei summary::-webkit-details-marker {
  display: none;
}
.redup {
  font-weight: 400;
  color: #64748b;
}
.catatan-sensei ul {
  margin: 0;
  padding: 0 16px 14px 40px;
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  list-style: disc;
}
.catatan-baca {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 14px;
  color: #78350f;
}
.catatan-baca b {
  display: flex;
  gap: 8px;
  align-items: center;
}
.catatan-baca ul {
  margin: 6px 0 0;
  padding-left: 22px;
  line-height: 1.6;
  list-style: disc;
}
@media (max-width: 600px) {
  .label-btn,
  .pintasan {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
</style>
