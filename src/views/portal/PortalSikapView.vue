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
      <h2 class="text-base font-bold text-slate-900 font-display mb-1">{{ $t('portal.sikapCatatanSemua') }}</h2>
      <CatatanSikapList :items="catatan" />
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePortalSession, usePortalFormat } from '../../services/portalSession.js';
import CatatanSikapList from '../../components/portal/CatatanSikapList.vue';

const { report } = usePortalSession();
const { num, bulan } = usePortalFormat();

// Months without any attitude record only carry the basis score, so they are left out.
const sikapBulan = computed(() => report.value.bulanan.filter((b) => b.sikap.positif + b.sikap.negatif > 0).reverse());
const catatan = computed(() => [...report.value.sikap.daftar].reverse());
</script>
