<template>
  <div v-if="report" class="space-y-4">
    <KaiwaCard :card="card" />

    <section class="joy-surface p-5">
      <p class="text-sm text-slate-700 leading-relaxed">
        {{ $t('portal.kaiwaCard.aturan', { n: card.target }) }}
        <template v-if="card.senseiWajib">
          {{ $t('portal.kaiwaCard.aturanWajib', { nama: $t('portal.senseiNama', { nama: card.senseiWajib.nama }) }) }}
        </template>
      </p>
    </section>

    <!-- Week by week -->
    <section class="joy-surface p-5">
      <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-1">
        <h2 class="text-base font-bold text-slate-900 font-display">{{ $t('portal.kaiwaCard.riwayat') }}</h2>
        <p v-if="mingguSelesai.length" class="text-xs text-slate-500">
          {{ $t('portal.kaiwaCard.mingguTercapai', { n: mingguTercapai, total: mingguSelesai.length }) }}
        </p>
      </div>
      <ul class="divide-y divide-slate-100">
        <li v-for="(w, i) in card.riwayat" :key="w.mulai" class="py-3">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm text-slate-900 min-w-0">
              {{ rentangMinggu(w.mulai, w.selesai) }}
              <span v-if="i === 0" class="text-[11px] text-primary font-medium"> · {{ $t('portal.kaiwaCard.mingguIni') }}</span>
            </p>
            <span
              class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold"
              :class="w.tercapai ? 'bg-emerald-100 text-emerald-800' : i === 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-50 text-red-700'"
            >
              {{ w.tercapai ? $t('portal.kaiwaCard.tercapai') : i === 0 ? $t('portal.kaiwaCard.berjalan') : $t('portal.kaiwaCard.tidakTercapai') }}
            </span>
          </div>
          <div class="mt-1.5 flex items-center gap-3">
            <div class="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div class="h-full rounded-full" :class="w.tercapai ? 'bg-emerald-500' : 'bg-slate-400'" :style="{ width: `${Math.min(100, (w.jumlah / card.target) * 100)}%` }" />
            </div>
            <p class="shrink-0 text-[11px] text-slate-500 flex items-center gap-1">
              {{ $t('portal.kaiwaCard.nSesi', { n: w.jumlah, target: card.target }) }}
              <template v-if="card.senseiWajib">
                <span aria-hidden="true">·</span>
                <v-icon :icon="w.wajibTerpenuhi ? 'mdi-star' : 'mdi-star-outline'" size="12" :class="w.wajibTerpenuhi ? 'text-amber-600' : 'text-slate-400'" />
                {{ namaPendek(card.senseiWajib.nama) }}
              </template>
            </p>
          </div>
        </li>
      </ul>
    </section>

    <!-- Every session -->
    <section class="joy-surface p-5">
      <h2 class="text-base font-bold text-slate-900 font-display mb-2">{{ $t('portal.kaiwaCard.semuaSesi') }}</h2>
      <p v-if="!sesi.length" class="text-sm text-slate-500">{{ $t('portal.kaiwaCard.belumAdaSesi') }}</p>
      <ul v-else class="divide-y divide-slate-100">
        <li v-for="k in sesi" :key="k.id" class="py-3 flex items-start gap-3">
          <span class="w-9 h-9 rounded-full border-2 border-blue-800 text-blue-800 bg-blue-50 flex items-center justify-center text-sm font-black shrink-0">
            {{ k.grade }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm text-slate-900">
              {{ tanggal(k.tanggal, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
            </p>
            <p class="text-xs text-slate-500 flex items-center gap-1">
              <template v-if="k.senseiNama">{{ $t('portal.senseiNama', { nama: k.senseiNama }) }}</template>
              <template v-else>{{ $t('portal.kaiwaCard.senseiBelumDiisi') }}</template>
              <v-icon v-if="k.wajib" icon="mdi-star" size="12" class="text-amber-600" :aria-label="$t('portal.kaiwaCard.wajib')" />
            </p>
            <p v-if="k.topik" class="text-xs text-slate-700 mt-1">{{ k.topik }}</p>
            <p v-if="k.catatan" class="text-xs text-slate-700 mt-1 leading-relaxed">{{ k.catatan }}</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePortalSession, usePortalFormat } from '../../services/portalSession.js';
import KaiwaCard from '../../components/portal/KaiwaCard.vue';

const { report } = usePortalSession();
const { tanggal, rentangMinggu } = usePortalFormat();

const card = computed(() => report.value.kaiwaCard);
const sesi = computed(() => [...report.value.kaiwa.daftar].reverse());
// The current week is still running, so it is left out of the count.
const mingguSelesai = computed(() => card.value.riwayat.slice(1));
const mingguTercapai = computed(() => mingguSelesai.value.filter((w) => w.tercapai).length);

function namaPendek(nama) {
  return nama ? String(nama).split(/\s+/)[0] : '';
}
</script>
