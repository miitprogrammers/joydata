<template>
  <div class="space-y-4">
    <!-- Choose a volume -->
    <template v-if="!dek">
      <section class="joy-surface p-5">
        <h2 class="text-base font-bold text-slate-900 font-display">{{ $t('portal.flashcard.judul') }}</h2>
        <p class="text-sm text-slate-600 mt-1">{{ $t('portal.flashcard.info') }}</p>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <span class="text-xs text-slate-500">{{ $t('portal.tes.levelKanji') }}</span>
          <v-btn-toggle v-model="level" mandatory color="primary" variant="outlined" density="compact">
            <v-btn v-for="j in levelOptions" :key="j" :value="j" class="text-none">{{ j }}</v-btn>
          </v-btn-toggle>
        </div>
        <div v-if="memuat && !volume.length" class="mt-3"><v-skeleton-loader type="list-item-two-line@3" /></div>
        <div v-else class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            v-for="v in volumeLevel"
            :key="v.kode"
            type="button"
            class="rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-blue-400 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-50"
            :disabled="membuka !== null"
            @click="buka(v.kode)"
          >
            <span class="flex items-center justify-between gap-2">
              <span class="text-sm font-semibold text-slate-900">{{ judulPendek(v.judul) }}</span>
              <v-progress-circular v-if="membuka === v.kode" indeterminate size="16" width="2" color="primary" />
              <span v-else class="text-[11px] text-slate-500 tabular-nums">{{ $t('portal.flashcard.nKartu', { n: v.total }) }}</span>
            </span>
            <span class="mt-2 block h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <span class="block h-full rounded-full bg-primary" :style="{ width: `${v.total ? (v.dilihat / v.total) * 100 : 0}%` }" />
            </span>
            <span class="mt-1 block text-[11px] text-slate-500">
              {{ v.dilihat ? $t('portal.flashcard.progresVolume', { dilihat: v.dilihat, total: v.total, putaran: v.putaran }) : $t('portal.flashcard.belumDibuka') }}
            </span>
          </button>
        </div>
      </section>

      <section class="joy-surface p-5">
        <h3 class="text-sm font-semibold text-slate-900">{{ $t('portal.flashcard.caraKerjaJudul') }}</h3>
        <ul class="mt-2 space-y-1.5 text-sm text-slate-600 list-disc pl-5">
          <li>{{ $t('portal.flashcard.caraKerja1') }}</li>
          <li>{{ $t('portal.flashcard.caraKerja2') }}</li>
          <li>{{ $t('portal.flashcard.caraKerja3') }}</li>
        </ul>
      </section>
    </template>

    <!-- A deck -->
    <template v-else>
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="text-sm font-bold text-slate-900 truncate">{{ dek.judul }}</p>
          <p class="text-xs text-slate-500">{{ $t('portal.flashcard.putaranKe', { n: dek.putaran + 1 }) }}</p>
        </div>
        <v-btn size="small" variant="text" class="text-none shrink-0" prepend-icon="mdi-close" :loading="menutup" @click="tutup">
          {{ $t('portal.flashcard.selesai') }}
        </v-btn>
      </div>

      <template v-if="!ringkasan">
        <div class="joy-surface px-4 py-3">
          <div class="flex items-center justify-between text-xs font-medium text-slate-500">
            <span class="tabular-nums">{{ $t('portal.flashcard.kartuKe', { n: index + 1, total: dek.kartu.length }) }}</span>
            <span class="tabular-nums flex items-center gap-1" :aria-label="$t('portal.flashcard.waktuKartu')">
              <v-icon icon="mdi-timer-outline" size="14" />{{ jam(msKartu) }}
            </span>
          </div>
          <div class="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div class="h-full rounded-full bg-primary transition-all" :style="{ width: `${((index + 1) / dek.kartu.length) * 100}%` }" />
          </div>
        </div>

        <!-- The card: drag sideways to move on, tap to turn it over -->
        <div class="relative" style="perspective: 1200px">
          <div
            :key="kartu.id"
            class="kartu-geser select-none"
            :class="{ 'kartu-lepas': !menyeret }"
            :style="{ transform: `translateX(${geser}px) rotate(${geser / 24}deg)` }"
            role="button"
            tabindex="0"
            :aria-label="terbalik ? $t('portal.flashcard.balikDepan') : $t('portal.flashcard.ketukBalik')"
            @pointerdown="onDown"
            @pointermove="onMove"
            @pointerup="onUp"
            @pointercancel="onCancel"
            @keydown.enter.prevent="terbalik = !terbalik"
            @keydown.space.prevent="terbalik = !terbalik"
          >
            <div class="kartu-flip" :class="{ 'kartu-terbalik': terbalik }">
              <div class="kartu-sisi joy-surface flex flex-col items-center justify-center p-6 text-center">
                <p class="text-6xl sm:text-7xl font-bold text-slate-900 leading-tight break-words max-w-full" lang="ja">{{ kartu.kanji }}</p>
                <p class="mt-6 text-xs text-slate-400">{{ $t('portal.flashcard.ketukBalik') }}</p>
              </div>
              <div class="kartu-sisi kartu-belakang joy-surface flex flex-col items-center justify-center p-6 text-center bg-blue-50/40">
                <p class="text-3xl font-bold text-slate-900 break-words max-w-full" lang="ja">{{ kartu.kanji }}</p>
                <template v-if="kartu.on">
                  <dl class="mt-4 space-y-1.5 text-base" lang="ja">
                    <div v-if="kartu.on.length" class="flex gap-2 justify-center">
                      <dt class="text-xs text-slate-500 pt-1">{{ $t('portal.flashcard.on') }}</dt>
                      <dd class="font-semibold text-blue-800">{{ kartu.on.join('、') }}</dd>
                    </div>
                    <div v-if="kartu.kun.length" class="flex gap-2 justify-center">
                      <dt class="text-xs text-slate-500 pt-1">{{ $t('portal.flashcard.kun') }}</dt>
                      <dd class="font-semibold text-blue-800">{{ kartu.kun.join('、') }}</dd>
                    </div>
                  </dl>
                </template>
                <template v-else>
                  <p class="mt-3 text-2xl font-semibold text-blue-800" lang="ja">{{ kartu.bacaan }}</p>
                  <p v-if="kartu.bacaanLain?.length" class="mt-1 text-xs text-slate-500" lang="ja">
                    {{ $t('portal.flashcard.bacaanLain', { daftar: kartu.bacaanLain.join('、') }) }}
                  </p>
                </template>
                <p class="mt-4 text-base text-slate-800">{{ kartu.arti }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between gap-2">
          <v-btn variant="text" class="text-none" prepend-icon="mdi-chevron-left" :disabled="index === 0" @click="mundur">
            {{ $t('portal.flashcard.sebelumnya') }}
          </v-btn>
          <v-btn variant="tonal" color="primary" class="text-none" prepend-icon="mdi-rotate-3d-variant" @click="terbalik = !terbalik">
            {{ $t('portal.flashcard.balik') }}
          </v-btn>
          <v-btn color="primary" variant="flat" class="text-none" append-icon="mdi-chevron-right" @click="maju">
            {{ $t('portal.flashcard.berikutnya') }}
          </v-btn>
        </div>
        <p class="text-center text-[11px] text-slate-400">{{ $t('portal.flashcard.geserPetunjuk') }}</p>
      </template>

      <!-- End of a round: the slowest cards come first next time -->
      <section v-else class="joy-surface p-5 space-y-4">
        <div class="text-center">
          <v-icon icon="mdi-check-decagram-outline" size="36" class="text-blue-700" />
          <p class="mt-1 text-base font-semibold text-slate-900">{{ $t('portal.flashcard.putaranSelesai', { n: ringkasan.putaran }) }}</p>
          <p class="text-sm text-slate-600">{{ $t('portal.flashcard.ringkasPutaran', { n: ringkasan.jumlah, waktu: jam(ringkasan.totalMs) }) }}</p>
        </div>
        <div>
          <p class="text-xs font-semibold text-slate-500 mb-1.5">{{ $t('portal.flashcard.palingLama') }}</p>
          <ul class="divide-y divide-slate-100 rounded-lg border border-slate-200">
            <li v-for="k in ringkasan.terlama" :key="k.id" class="flex items-center justify-between gap-3 px-3 py-2">
              <span class="min-w-0">
                <span class="text-lg font-semibold text-slate-900" lang="ja">{{ k.kanji }}</span>
                <span class="ml-2 text-xs text-slate-500" lang="ja">{{ k.bacaan }}</span>
              </span>
              <span class="text-sm tabular-nums text-slate-700 shrink-0">{{ jam(k.ms) }}</span>
            </li>
          </ul>
          <p class="mt-2 text-xs text-slate-500">{{ $t('portal.flashcard.putaranInfo') }}</p>
        </div>
        <p v-if="gagalSimpanPutaran" class="text-xs font-medium text-red-700 bg-red-50 rounded px-3 py-2">{{ $t('portal.flashcard.gagalSimpan') }}</p>
        <div class="flex flex-wrap justify-end gap-2">
          <v-btn variant="text" class="text-none" :loading="menutup" @click="tutup">{{ $t('portal.flashcard.selesai') }}</v-btn>
          <v-btn v-if="gagalSimpanPutaran" color="primary" variant="flat" class="text-none" :loading="menyimpanPutaran" @click="simpanPutaran">
            {{ $t('portal.flashcard.cobaSimpan') }}
          </v-btn>
          <v-btn v-else color="primary" variant="flat" class="text-none" :loading="menyimpanPutaran" :disabled="!kartuBerikutnya" @click="mulaiPutaranBaru">
            {{ $t('portal.flashcard.putaranBerikutnya') }}
          </v-btn>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { portalRequest } from '../../services/portalApi.js';
import { isPortalSessionExpired } from '../../services/portalSession.js';
import { useAppStore } from '../../stores/appStore.js';
import { useDetakAktivitas } from '../../services/aktivitasLatihan.js';

const { t } = useI18n();
const router = useRouter();
const appStore = useAppStore();

// Drag further than this to move to the next or previous card.
const AMBANG_GESER = 70;

const volume = ref([]);
const memuat = ref(true);
const level = ref('N5');
const membuka = ref(null);
const menutup = ref(false);

const levelOptions = computed(() => [...new Set(volume.value.map((v) => v.jlpt))]);
const volumeLevel = computed(() => volume.value.filter((v) => v.jlpt === level.value));
const judulPendek = (judul) => String(judul).replace(/^N\d · /, '');

// The open deck: { aktivitasId, volume, judul, putaran, kartu (in order) }
const dek = ref(null);
const index = ref(0);
const terbalik = ref(false);
const kartu = computed(() => dek.value?.kartu[index.value] || null);

// Display time of each card in this round (ms). A card seen twice (swiped back) adds up.
const waktuPutaran = ref({});
let belumTersimpan = {};
let tampilSejak = null;
let kartuDigeser = 0;
const sekarang = ref(Date.now());
let jamTimer = null;

const msKartu = computed(() => {
  if (!kartu.value) return 0;
  return (waktuPutaran.value[kartu.value.id] || 0) + (tampilSejak !== null ? Math.max(0, sekarang.value - tampilSejak) : 0);
});

function jam(ms) {
  const detik = Math.floor((ms || 0) / 1000);
  return `${Math.floor(detik / 60)}:${String(detik % 60).padStart(2, '0')}`;
}

function gagal(err) {
  if (isPortalSessionExpired(err, router)) return;
  appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
}

// --- display time of the card on screen -------------------------------------------------------------------------

function mulaiWaktuKartu() {
  tampilSejak = document.visibilityState === 'visible' ? Date.now() : null;
}

function tutupWaktuKartu() {
  if (!kartu.value || tampilSejak === null) return;
  const id = kartu.value.id;
  const total = (waktuPutaran.value[id] || 0) + (Date.now() - tampilSejak);
  waktuPutaran.value = { ...waktuPutaran.value, [id]: total };
  belumTersimpan[id] = total;
  tampilSejak = null;
}

// The app in the background: the card's time stops until it comes back.
function onVisibility() {
  if (!dek.value || ringkasan.value) return;
  if (document.visibilityState === 'visible') mulaiWaktuKartu();
  else tutupWaktuKartu();
}

// --- saving: display times and the practice signal -------------------------------------------------------------

async function simpan({ detikAktif, selesai = false, keepalive = false, putaranSelesai = false } = {}) {
  if (!dek.value) return null;
  const kirimWaktu = { ...belumTersimpan };
  // The card on screen counts up to now, so leaving the app on it still records it.
  if (kartu.value && tampilSejak !== null && !putaranSelesai) {
    kirimWaktu[kartu.value.id] = (waktuPutaran.value[kartu.value.id] || 0) + (Date.now() - tampilSejak);
  }
  belumTersimpan = {};
  try {
    return await portalRequest(`/flashcard/${dek.value.volume}/simpan`, {
      method: 'POST',
      body: {
        aktivitasId: dek.value.aktivitasId,
        waktu: kirimWaktu,
        detikAktif,
        kartuDilihat: kartuDigeser,
        posisi: index.value + 1,
        putaranSelesai,
        selesai,
      },
      diam: !putaranSelesai,
      keepalive,
    });
  } catch (err) {
    // Sent again with the next save.
    belumTersimpan = { ...kirimWaktu, ...belumTersimpan };
    throw err;
  }
}

const aktivitas = useDetakAktivitas(({ detikAktif, selesai, keepalive }) => simpan({ detikAktif, selesai, keepalive }));

// --- moving through the deck -------------------------------------------------------------------------------------

function maju() {
  if (!kartu.value) return;
  tutupWaktuKartu();
  kartuDigeser += 1;
  terbalik.value = false;
  if (index.value + 1 >= dek.value.kartu.length) {
    selesaiPutaran();
    return;
  }
  index.value += 1;
  mulaiWaktuKartu();
}

function mundur() {
  if (index.value === 0) return;
  tutupWaktuKartu();
  terbalik.value = false;
  index.value -= 1;
  mulaiWaktuKartu();
}

const geser = ref(0);
const menyeret = ref(false);
let awalX = 0;
let awalY = 0;
let arah = null;
let sedangKeluar = false;

function onDown(e) {
  if (sedangKeluar || (e.pointerType === 'mouse' && e.button !== 0)) return;
  menyeret.value = true;
  arah = null;
  awalX = e.clientX;
  awalY = e.clientY;
  geser.value = 0;
  e.currentTarget.setPointerCapture?.(e.pointerId);
}

function onMove(e) {
  if (!menyeret.value) return;
  const dx = e.clientX - awalX;
  const dy = e.clientY - awalY;
  if (!arah && Math.hypot(dx, dy) > 8) arah = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
  if (arah === 'x') geser.value = index.value === 0 && dx > 0 ? dx / 4 : dx;
}

function onUp() {
  if (!menyeret.value) return;
  menyeret.value = false;
  const dx = geser.value;
  if (arah === 'x' && dx < -AMBANG_GESER) return lepas('kiri');
  if (arah === 'x' && dx > AMBANG_GESER && index.value > 0) return lepas('kanan');
  if (!arah) terbalik.value = !terbalik.value;
  geser.value = 0;
}

function onCancel() {
  menyeret.value = false;
  geser.value = 0;
}

// The card flies out to the side, then the next (left) or previous (right) one comes in.
function lepas(sisi) {
  sedangKeluar = true;
  geser.value = (sisi === 'kiri' ? -1 : 1) * (window.innerWidth || 600);
  setTimeout(() => {
    geser.value = 0;
    sedangKeluar = false;
    if (sisi === 'kiri') maju();
    else mundur();
  }, 160);
}

function onKey(e) {
  if (!dek.value || ringkasan.value || e.target?.closest?.('input, textarea')) return;
  if (e.key === 'ArrowRight') maju();
  else if (e.key === 'ArrowLeft') mundur();
  // Space on a button presses that button; on the card it is handled there.
  else if (e.key === ' ' && !e.target?.closest?.('button, [role="button"]')) {
    e.preventDefault();
    terbalik.value = !terbalik.value;
  }
}

// --- rounds --------------------------------------------------------------------------------------------------------

const ringkasan = ref(null);
const kartuBerikutnya = ref(null);
const menyimpanPutaran = ref(false);
const gagalSimpanPutaran = ref(false);

async function simpanPutaran() {
  menyimpanPutaran.value = true;
  gagalSimpanPutaran.value = false;
  try {
    const res = await simpan({ detikAktif: aktivitas.detikAktif(), putaranSelesai: true });
    kartuBerikutnya.value = res.kartu;
    dek.value.putaran = res.putaran;
  } catch (err) {
    gagalSimpanPutaran.value = true;
    if (isPortalSessionExpired(err, router)) return;
  } finally {
    menyimpanPutaran.value = false;
  }
}

function selesaiPutaran() {
  const byId = new Map(dek.value.kartu.map((k) => [k.id, k]));
  const waktu = Object.entries(waktuPutaran.value);
  ringkasan.value = {
    putaran: dek.value.putaran + 1,
    jumlah: dek.value.kartu.length,
    totalMs: waktu.reduce((n, [, ms]) => n + ms, 0),
    terlama: waktu
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, ms]) => {
        const k = byId.get(id);
        return { id, ms, kanji: k.kanji, bacaan: k.bacaan || [...(k.on || []), ...(k.kun || [])].slice(0, 2).join('、') };
      }),
  };
  kartuBerikutnya.value = null;
  simpanPutaran();
}

function mulaiPutaranBaru() {
  dek.value.kartu = kartuBerikutnya.value;
  index.value = 0;
  waktuPutaran.value = {};
  ringkasan.value = null;
  terbalik.value = false;
  window.scrollTo({ top: 0 });
  mulaiWaktuKartu();
}

// --- opening and closing a deck ------------------------------------------------------------------------------------

async function muat() {
  memuat.value = true;
  try {
    volume.value = (await portalRequest('/flashcard')).volume;
    if (!levelOptions.value.includes(level.value)) level.value = levelOptions.value[0] || 'N5';
  } catch (err) {
    gagal(err);
  } finally {
    memuat.value = false;
  }
}

async function buka(kode) {
  membuka.value = kode;
  try {
    const res = await portalRequest(`/flashcard/${kode}/mulai`, { method: 'POST' });
    dek.value = { aktivitasId: res.aktivitasId, volume: res.volume, judul: res.judul, putaran: res.putaran, kartu: res.kartu };
    index.value = 0;
    terbalik.value = false;
    waktuPutaran.value = {};
    belumTersimpan = {};
    kartuDigeser = 0;
    ringkasan.value = null;
    window.scrollTo({ top: 0 });
    mulaiWaktuKartu();
    aktivitas.mulai(0);
    jamTimer = setInterval(() => {
      sekarang.value = Date.now();
    }, 250);
  } catch (err) {
    gagal(err);
  } finally {
    membuka.value = null;
  }
}

async function tutup() {
  menutup.value = true;
  if (!ringkasan.value) tutupWaktuKartu();
  await aktivitas.berhenti();
  clearInterval(jamTimer);
  dek.value = null;
  menutup.value = false;
  muat();
}

onMounted(() => {
  muat();
  window.addEventListener('keydown', onKey);
  document.addEventListener('visibilitychange', onVisibility);
});
onBeforeUnmount(() => {
  // Leaving for another page: the card on screen keeps its time (useDetakAktivitas sends the closing save).
  if (dek.value && !ringkasan.value) tutupWaktuKartu();
  clearInterval(jamTimer);
  window.removeEventListener('keydown', onKey);
  document.removeEventListener('visibilitychange', onVisibility);
});
</script>

<style scoped>
.kartu-geser {
  touch-action: pan-y;
  cursor: grab;
  will-change: transform;
}
.kartu-geser:active {
  cursor: grabbing;
}
.kartu-lepas {
  transition: transform 0.16s ease-out;
}
.kartu-flip {
  position: relative;
  min-height: 320px;
  transform-style: preserve-3d;
  transition: transform 0.35s ease;
}
.kartu-terbalik {
  transform: rotateY(180deg);
}
.kartu-sisi {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.kartu-belakang {
  transform: rotateY(180deg);
}
@media (prefers-reduced-motion: reduce) {
  .kartu-lepas,
  .kartu-flip {
    transition: none;
  }
}
</style>
