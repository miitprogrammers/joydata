<template>
  <div v-if="loading && !data" class="py-2"><v-skeleton-loader type="paragraph@1" /></div>
  <div v-else-if="data">
    <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
      <p class="text-sm font-semibold text-slate-900">{{ $t('monitorLatihan.bunpouJudul') }}</p>
      <p v-if="belumMulai" class="text-[11px] text-slate-500">{{ $t('monitorLatihan.bunpouBelumMulai', { n: belumMulai }) }}</p>
    </div>
    <p v-if="!tampil.length" class="text-sm text-slate-500">{{ $t('monitorLatihan.bunpouKosong') }}</p>
    <div v-else class="space-y-2">
      <div v-for="v in tampil" :key="v.kode" class="rounded-lg border border-slate-200 px-3 py-2.5">
        <div class="flex items-center justify-between gap-2">
          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-900 truncate">{{ judulVolume(v) }}</p>
            <p class="text-[11px] text-slate-500 tabular-nums">
              {{ $t('monitorLatihan.bunpouProgres', { a: Math.min(v.progres?.tahap_terbuka || 0, v.tahap?.length || 0), b: v.tahap?.length || 0 }) }}
              · {{ $t('monitorLatihan.bunpouDikuasai', { d: v.progres?.dikuasai || 0, n: v.jumlahPola }) }}
            </p>
          </div>
          <span class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="kelas(v)">{{ label(v) }}</span>
        </div>
        <div class="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div class="h-full rounded-full" :class="v.progres?.selesai ? 'bg-emerald-500' : 'bg-primary'" :style="{ width: `${persen(v)}%` }" />
        </div>
        <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 tabular-nums">
          <span v-if="v.bos?.jumlah">{{ $t('monitorLatihan.bunpouBos', { n: v.bos.jumlah }) }}</span>
          <span v-if="v.bos?.jumlah && v.bos.rondeBerikut > 1">{{ $t('monitorLatihan.bunpouRonde', { n: v.bos.rondeBerikut - 1 }) }}</span>
          <span v-if="v.progres?.perlu_perhatian" class="font-semibold text-amber-700">{{ $t('monitorLatihan.bunpouPerhatian') }}</span>
        </div>
      </div>
    </div>

    <div class="mt-3">
      <p class="mb-1.5 text-sm font-semibold text-slate-900">{{ $t('monitorLatihan.bunpouPolaLemah') }}</p>
      <p v-if="!polaLemah.length" class="text-sm text-slate-500">{{ $t('monitorLatihan.bunpouPolaLemahKosong') }}</p>
      <ul v-else class="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        <li v-for="p in polaLemah" :key="p.id" class="rounded-lg bg-amber-50 px-2.5 py-1.5">
          <div class="flex items-start justify-between gap-2">
            <p class="min-w-0 text-sm font-semibold text-amber-900 break-words" lang="ja" translate="no">{{ p.pola }}</p>
            <router-link
              v-if="bisaBukaMateri"
              :to="`/materi-bunpou/${encodeURIComponent(p.id)}`"
              class="shrink-0 text-[11px] font-medium text-blue-700 hover:underline"
            >{{ $t('monitorLatihan.bunpouMateri') }}</router-link>
          </div>
          <p class="text-[11px] text-slate-600">
            {{ p.arti }}
            <span class="tabular-nums">· {{ $t('monitorLatihan.bunpouBab', { n: p.bab }) }} · {{ $t('monitorLatihan.bunpouSalah', { n: p.salah }) }}</span>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { buatKlienBunpou, judulVolume as judulVolumeBunpou, ringkasProgresBunpou } from '../../services/bunpouAdventure.js';
import { useAppStore } from '../../stores/appStore.js';

// Bunpou Adventure of one peserta for the sensei. Loaded on its own (own loading and silent failure), so an old or
// missing table never blocks the practice detail around it.
const props = defineProps({
  pesertaId: { type: [Number, String], required: true },
  query: { type: Object, default: () => ({}) },
});

const { t } = useI18n();
const appStore = useAppStore();
const klien = buatKlienBunpou();
const data = ref(null);
const loading = ref(false);
let muatKe = 0;

const volumes = computed(() => data.value?.volume || []);
const tampil = computed(() => volumes.value.filter((v) => v.progres?.selesai || v.progres?.dikuasai || (!v.terkunci && v.dirilis !== false)));
const belumMulai = computed(() => volumes.value.filter((v) => !tampil.value.includes(v)).length);
const polaLemah = computed(() => data.value?.polaLemah || []);
// The Materi Bunpou link only shows for staff who may open that page.
const bisaBukaMateri = computed(() => appStore.canAccess('materi-bunpou'));

const judulVolume = (v) => judulVolumeBunpou(v, t);
const persen = (v) => ringkasProgresBunpou(v.progres, v).persen;

function label(v) {
  if (v.progres?.selesai) return t('monitorLatihan.bunpouSelesai');
  if (v.dirilis === false) return t('monitorLatihan.bunpouSegera');
  return v.terkunci ? t('monitorLatihan.bunpouTerkunci') : t('monitorLatihan.bunpouTerbuka');
}

function kelas(v) {
  if (v.progres?.selesai) return 'bg-emerald-100 text-emerald-800';
  if (v.dirilis === false) return 'bg-violet-50 text-violet-700';
  return v.terkunci ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-800';
}

async function muat() {
  const nomor = ++muatKe;
  data.value = null;
  loading.value = true;
  try {
    const res = await klien.monitorPeserta(props.pesertaId, props.query);
    if (nomor === muatKe) data.value = res;
  } catch {
    if (nomor === muatKe) data.value = null;
  } finally {
    if (nomor === muatKe) loading.value = false;
  }
}

watch(() => [props.pesertaId, JSON.stringify(props.query)], muat, { immediate: true });
</script>
