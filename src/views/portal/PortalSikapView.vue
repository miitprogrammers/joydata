<template>
  <div v-if="report" class="space-y-4">
    <section class="joy-surface p-5">
      <div class="flex items-baseline justify-between gap-3">
        <h2 class="text-base font-bold text-slate-900 font-display">{{ $t('portal.sikap') }}</h2>
        <p class="text-2xl font-bold tabular-nums" :class="report.kpi.lulusKkmSikap === false ? 'text-red-600' : 'text-slate-900'">
          {{ num(report.kpi.skorSikap) }}<span v-if="report.kpi.skorSikap !== null" class="text-sm font-semibold text-slate-500"> {{ report.kpi.predikatSikap }}</span>
        </p>
      </div>
      <p class="text-xs text-slate-600 mt-1 leading-relaxed">
        {{ $t('portal.sikapPenjelasan', { basis: report.settings.sikap_basis, kkm: report.settings.kkm_sikap }) }}
      </p>
    </section>

    <section class="joy-surface p-5">
      <h2 class="text-base font-bold text-slate-900 font-display mb-2">{{ $t('portal.sikapBulanan') }}</h2>
      <p v-if="!sikapBulan.length" class="text-sm text-slate-500">{{ $t('portal.sikapKosong', { basis: report.settings.sikap_basis }) }}</p>
      <ul v-else class="divide-y divide-slate-100">
        <li v-for="b in sikapBulan" :key="b.periode" class="py-2.5 flex items-center justify-between gap-3 text-sm">
          <div>
            <p class="text-slate-800">{{ bulan(b.periode) }}</p>
            <p class="text-[11px] text-slate-500">
              {{ $t('portal.sikapHitung', { positif: b.sikap.positif, negatif: b.sikap.negatif }) }}
            </p>
          </div>
          <span class="tabular-nums font-semibold" :class="b.sikap.lulusKkm ? 'text-slate-900' : 'text-red-600'">
            {{ num(b.sikap.skor) }} <span class="text-xs text-slate-500">{{ b.sikap.predikat }}</span>
          </span>
        </li>
      </ul>
    </section>

    <section v-if="catatan.length" class="joy-surface p-5">
      <h2 class="text-base font-bold text-slate-900 font-display mb-2">{{ $t('portal.sikapCatatanSemua') }}</h2>
      <ul class="divide-y divide-slate-100">
        <li v-for="s in catatan" :key="s.id" class="py-2 flex items-center gap-2 text-sm">
          <v-icon
            :icon="s.sentiment === 'positif' ? 'mdi-thumb-up-outline' : 'mdi-alert-circle-outline'"
            :color="s.sentiment === 'positif' ? 'success' : 'warning'"
            size="16"
          />
          <span class="text-slate-800 min-w-0">{{ locale === 'ja' ? s.kategoriNamaJa : s.kategoriNamaId }}</span>
          <span class="ml-auto shrink-0 tabular-nums text-xs font-semibold" :class="s.sentiment === 'positif' ? 'text-emerald-700' : 'text-red-600'">
            {{ s.sentiment === 'positif' ? '+' : '−' }}{{ num(s.bobot) }}
          </span>
          <span class="w-24 text-right shrink-0 text-xs text-slate-500">{{ tanggal(s.tanggal) }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePortalSession, usePortalFormat } from '../../services/portalSession.js';

const { locale } = useI18n();
const { report } = usePortalSession();
const { num, tanggal, bulan } = usePortalFormat();

// Months without any attitude record only carry the basis score, so they are left out.
const sikapBulan = computed(() => report.value.bulanan.filter((b) => b.sikap.positif + b.sikap.negatif > 0).reverse());
const catatan = computed(() => [...report.value.sikap.daftar].reverse());
</script>
