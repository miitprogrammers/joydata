<template>
  <div class="mb-vars space-y-0">
    <div class="kepala">
      <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('materiBunpou.heading') }}</h1>
      <p class="text-sm text-slate-600 mt-1">{{ $t('materiBunpou.subheading') }}</p>
    </div>

    <div class="cari-box">
      <i class="mdi mdi-magnify ikon-cari"></i>
      <input
        ref="inputEl"
        v-model="q"
        type="search"
        autocomplete="off"
        spellcheck="false"
        autofocus
        :placeholder="$t('materiBunpou.placeholder')"
        :aria-label="$t('materiBunpou.cariLabel')"
        @keydown="tekanInput"
      />
      <span v-if="!q" class="kbd-hint">{{ $t('materiBunpou.tekan') }} <kbd>/</kbd></span>
      <button v-else type="button" class="hapus" :aria-label="$t('materiBunpou.hapus')" @click="hapusKueri">
        <i class="mdi mdi-close"></i>
      </button>
    </div>

    <div class="filter" role="group" :aria-label="$t('materiBunpou.tingkat')">
      <button
        v-for="o in OPSI_TINGKAT"
        :key="o.nilai"
        type="button"
        class="chipf"
        :class="{ on: t === o.nilai }"
        @click="t = o.nilai"
      >
        {{ $t(o.label) }}
      </button>
      <span class="spasi"></span>
      <label v-if="!ada" class="kelompok-wrap">
        {{ $t('materiBunpou.kelompokLabel') }}
        <select v-model="k">
          <option value="bab">{{ $t('materiBunpou.kelompokBab') }}</option>
          <option value="modul">{{ $t('materiBunpou.kelompokModul') }}</option>
        </select>
      </label>
    </div>

    <div v-if="muat" class="pesan">{{ $t('materiBunpou.memuat') }}</div>
    <div v-else-if="galat" class="pesan">
      {{ $t('materiBunpou.gagal') }}
      <button type="button" class="joy-btn-secondary ml-2" @click="muatData">{{ $t('materiBunpou.muatUlang') }}</button>
    </div>

    <template v-else>
      <div v-if="!ada && terakhirMateri.length" class="terakhir">
        <span>{{ $t('materiBunpou.terakhir') }}</span>
        <button v-for="m in terakhirMateri" :key="m.id" type="button" @click="buka(m.id)"><JP :text="m.pola" /></button>
      </div>

      <div class="info-hasil">
        <span v-if="ada">{{ $t('materiBunpou.infoHasil', { n: hasil.length, q }) }}</span>
        <span v-else>{{ $t('materiBunpou.infoDaftar', { n: kolam.length, mode: k === 'bab' ? $t('materiBunpou.kelompokInfoBab') : $t('materiBunpou.kelompokInfoModul') }) }}</span>
        <router-link v-if="ada && bandingkanTara" :to="{ path: '/materi-bunpou/tara', query: { slide: 'bandingkan' } }">
          <i class="mdi mdi-compare-horizontal"></i>{{ $t('materiBunpou.bandingkan') }}
          <span lang="ja" translate="no">～たら・と・ば・なら</span>
        </router-link>
      </div>

      <div class="joy-surface daftar" role="listbox" :aria-label="$t('materiBunpou.heading')">
        <!-- Search results -->
        <template v-if="ada">
          <BarisMateri
            v-for="(m, i) in hasil"
            :key="m.id"
            :materi="m"
            :pilih="i === pilih"
            :data-baris="i"
            @buka="buka"
          />
          <div v-if="!hasil.length" class="kosong">
            {{ $t('materiBunpou.kosong', { q }) }}<br />{{ $t('materiBunpou.kosongSaran') }}
          </div>
        </template>

        <!-- Grouped list -->
        <template v-else>
          <details v-for="g in grup" :key="g.kunci" class="grup" :open="grupTerbuka.has(g.kunci)">
            <summary>
              <i class="mdi mdi-chevron-right"></i>
              <b>{{ judulGrup(g) }}</b>
              <span class="isi">
                <span v-if="k === 'modul' && typeof g.kunci === 'number'" class="sub">{{ g.label }} · </span>
                <span lang="ja" translate="no">{{ g.materi.map((m) => ringkasPola(m.pola)).join(' · ') }}</span>
              </span>
              <span class="jml">{{ $t('materiBunpou.jumlahPola', { n: g.materi.length }) }}</span>
            </summary>
            <BarisMateri v-for="m in g.materi" :key="m.id" :materi="m" @buka="buka" />
          </details>
          <div v-if="!grup.length" class="kosong">{{ $t('materiBunpou.kosongSaran') }}</div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { cariMateri, kelompokkan } from '../utils/cariBunpou.js';
import BarisMateri from '../components/materi-bunpou/BarisMateri.vue';
import JP from '../components/materi-bunpou/JP.vue';
import '../components/materi-bunpou/slide.css';

const route = useRoute();
const router = useRouter();
const { t: tr } = useI18n();

const OPSI_TINGKAT = [
  { nilai: '', label: 'materiBunpou.tingkatSemua' },
  { nilai: 'N5', label: 'materiBunpou.tingkatN5' },
  { nilai: 'N4', label: 'materiBunpou.tingkatN4' },
];
const KELOMPOK_BANDING = ['tara', 'to', 'ba', 'nara'];

// Query, level and grouping live in the URL (?q=&t=&k=) so "back" from a presentation returns to the same list.
const q = ref(String(route.query.q || ''));
const ada = computed(() => q.value.trim() !== '');
const t = ref(['N5', 'N4'].includes(route.query.t) ? route.query.t : '');
const k = ref(route.query.k === 'modul' ? 'modul' : 'bab');
const pilih = ref(0);
const inputEl = ref(null);

const daftar = ref([]);
const kategoriModul = ref([]);
const muat = ref(true);
const galat = ref(false);

async function muatData() {
  muat.value = true;
  galat.value = false;
  try {
    const res = await apiRequest('/materi-bunpou');
    daftar.value = res.materi || [];
    kategoriModul.value = res.kategoriModul || [];
  } catch {
    galat.value = true;
  } finally {
    muat.value = false;
  }
}

function bacaTerakhir() {
  try {
    const a = JSON.parse(localStorage.getItem('materiBunpou.terakhir') || '[]');
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}
const idTerakhir = bacaTerakhir();
const terakhirMateri = computed(() =>
  idTerakhir.map((id) => daftar.value.find((m) => m.id === id)).filter((m) => m && m.status !== 'belum')
);

const kolam = computed(() => daftar.value.filter((m) => !t.value || m.tingkat === t.value));
const hasil = computed(() => (ada.value ? cariMateri(daftar.value, q.value, { tingkat: t.value }) : []));
const grup = computed(() => kelompokkan(kolam.value, k.value, kategoriModul.value));
const bandingkanTara = computed(
  () => hasil.value.filter((m) => KELOMPOK_BANDING.includes(m.id)).length >= 2 && hasil.value.some((m) => m.id === 'tara' && m.status !== 'belum')
);

// The group holding the last opened material starts open.
const grupTerbuka = computed(() => {
  const terakhir = daftar.value.find((m) => m.id === idTerakhir[0]);
  const buka = new Set();
  if (terakhir) {
    const g = grup.value.find((x) => x.materi.some((m) => m.id === terakhir.id));
    if (g) buka.add(g.kunci);
  }
  return buka;
});

function judulGrup(g) {
  if (typeof g.kunci === 'number') return k.value === 'bab' ? tr('materiBunpou.bab', { n: g.kunci }) : tr('materiBunpou.kat', { n: g.kunci });
  return k.value === 'bab' ? tr('materiBunpou.tanpaBab') : tr('materiBunpou.tidakDiModul');
}
// Pattern preview in a group header: strip furigana markers.
const ringkasPola = (p) => p.replace(/\{[^}]*\}/g, '');

watch([q, t, k], () => {
  pilih.value = 0;
  const query = {};
  if (q.value) query.q = q.value;
  if (t.value) query.t = t.value;
  if (k.value !== 'bab') query.k = k.value;
  router.replace({ query }).catch(() => {});
});
// Re-sync when the URL changes from outside (e.g. the sidebar item clicked while on ?q=tara).
watch(
  () => route.query,
  (qs) => {
    if (route.path !== '/materi-bunpou') return;
    q.value = String(qs.q || '');
    t.value = ['N5', 'N4'].includes(qs.t) ? qs.t : '';
    k.value = qs.k === 'modul' ? 'modul' : 'bab';
  }
);
watch(hasil, (h) => {
  if (pilih.value > h.length - 1) pilih.value = Math.max(0, h.length - 1);
});

function buka(id) {
  const m = daftar.value.find((x) => x.id === id);
  if (!m || m.status === 'belum') return;
  router.push({ path: `/materi-bunpou/${id}` });
}

function hapusKueri() {
  q.value = '';
  inputEl.value?.focus();
}

function geserPilihan(n) {
  pilih.value = Math.max(0, Math.min(pilih.value + n, hasil.value.length - 1));
  nextTick(() => document.querySelector(`[data-baris="${pilih.value}"]`)?.scrollIntoView({ block: 'nearest' }));
}

// IME composition (Enter commits kana, arrows pick candidates) must not drive the list.
const menyusun = (e) => e.isComposing || e.keyCode === 229;

function tekanInput(e) {
  if (e.ctrlKey || e.metaKey || e.altKey || menyusun(e)) return;
  if (e.key === 'ArrowDown' && ada.value) { e.preventDefault(); geserPilihan(1); }
  else if (e.key === 'ArrowUp' && ada.value) { e.preventDefault(); geserPilihan(-1); }
  else if (e.key === 'Enter' && ada.value) { e.preventDefault(); const m = hasil.value[pilih.value]; if (m) buka(m.id); }
  else if (e.key === 'Escape') { e.preventDefault(); if (q.value) q.value = ''; else inputEl.value?.blur(); }
}

// "/" focuses the search box from anywhere on the page; arrows and Enter also work after the box lost focus.
function tekanDokumen(e) {
  if (e.ctrlKey || e.metaKey || e.altKey || menyusun(e)) return;
  // Not behind an open dialog
  if (document.querySelector('.v-overlay--active')) return;
  const diInput = e.target instanceof HTMLElement && e.target.matches('input, select, textarea');
  if (e.key === '/' && !diInput) {
    e.preventDefault();
    inputEl.value?.focus();
    return;
  }
  if (diInput || !ada.value || !hasil.value.length) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); geserPilihan(1); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); geserPilihan(-1); }
  else if (e.key === 'Enter' && !(e.target instanceof HTMLElement && e.target.closest('a,button,summary'))) { const m = hasil.value[pilih.value]; if (m) buka(m.id); }
  else if (e.key === 'Escape') q.value = '';
}

onMounted(() => {
  muatData();
  inputEl.value?.focus();
  document.addEventListener('keydown', tekanDokumen);
});
onBeforeUnmount(() => document.removeEventListener('keydown', tekanDokumen));
</script>

<style scoped>
.cari-box {
  margin-top: 18px;
  position: relative;
}
.ikon-cari {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  color: #94a3b8;
}
.cari-box input {
  width: 100%;
  height: 56px;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  padding: 0 52px;
  font-size: 18px;
  font-family: var(--font-body), var(--font-jp);
  background: #fff;
  outline: none;
}
.cari-box input:focus {
  border-color: #1d4ed8;
  box-shadow: 0 0 0 4px #dbeafe;
}
.cari-box input::-webkit-search-cancel-button {
  display: none;
}
.hapus {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: none;
  font-size: 20px;
  color: #94a3b8;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
}
.hapus:hover {
  background: #f1f5f9;
}
.kbd-hint {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #94a3b8;
}
kbd {
  font-size: 11px;
  border: 1px solid #cbd5e1;
  border-bottom-width: 2px;
  border-radius: 4px;
  padding: 0 5px;
  background: #fff;
  color: #475569;
}
.filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}
.chipf {
  border: 1px solid #cbd5e1;
  background: #fff;
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 13px;
  color: #334155;
  cursor: pointer;
}
.chipf.on {
  background: #1d4ed8;
  border-color: #1d4ed8;
  color: #fff;
}
.spasi {
  flex: 1;
}
.kelompok-wrap {
  font-size: 13px;
  color: #64748b;
}
.kelompok-wrap select {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 5px 8px;
  font-size: 13px;
  background: #fff;
  margin-left: 4px;
}
.pesan {
  margin-top: 24px;
  padding: 28px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
}
.terakhir {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 18px 2px 4px;
  font-size: 13px;
  color: #64748b;
}
.terakhir button {
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 15px;
  cursor: pointer;
}
.terakhir button:hover {
  border-color: #bfdbfe;
  background: #eff6ff;
}
.info-hasil {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 2px 8px;
  font-size: 13px;
  color: #64748b;
}
.info-hasil a {
  margin-left: auto;
  color: #1d4ed8;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  gap: 6px;
  align-items: center;
}
.info-hasil a:hover {
  text-decoration: underline;
}
.daftar {
  overflow: hidden;
}
.kosong {
  padding: 36px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
}
details.grup {
  border-top: 1px solid #e2e8f0;
}
details.grup:first-child {
  border-top: 0;
}
details.grup summary {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  cursor: pointer;
  font-size: 14px;
}
details.grup summary::-webkit-details-marker {
  display: none;
}
details.grup summary .mdi {
  font-size: 20px;
  color: #94a3b8;
  transition: transform 0.15s;
}
details.grup[open] summary .mdi {
  transform: rotate(90deg);
}
details.grup summary b {
  font-family: var(--font-display);
  min-width: 64px;
}
details.grup summary .isi {
  color: #475569;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
details.grup summary .sub {
  color: #64748b;
}
details.grup summary .jml {
  color: #94a3b8;
  font-size: 12px;
}
details.grup :deep(.baris) {
  padding-left: 50px;
}
@media (max-width: 600px) {
  .kbd-hint,
  .spasi {
    display: none;
  }
  .filter {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 4px;
  }
  details.grup :deep(.baris) {
    padding-left: 14px;
  }
}
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
</style>
