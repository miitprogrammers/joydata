<template>
  <section class="joy-surface p-5 overflow-hidden" :aria-label="$t('portal.kaiwaCard.judul')">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-[11px] font-bold tracking-[0.14em] uppercase text-primary">{{ $t('portal.kaiwaCard.judul') }}</p>
        <h2 class="text-base font-bold text-slate-900 font-display mt-0.5">
          {{ rentangMinggu(card.minggu.mulai, card.minggu.selesai) }}
        </h2>
        <p class="text-xs text-slate-500 mt-0.5">{{ sisaHariText }}</p>
      </div>
      <span
        class="shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
        :class="card.tercapai ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
      >
        <v-icon :icon="card.tercapai ? 'mdi-check-decagram' : 'mdi-timer-sand'" size="14" />
        {{ card.tercapai ? $t('portal.kaiwaCard.tercapai') : $t('portal.kaiwaCard.belumTercapai') }}
      </span>
    </div>

    <!-- Stamp slots: one per required session; the last one is reserved for the required sensei -->
    <ol class="mt-4 grid gap-2" :style="{ gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))` }">
      <li v-for="(slot, i) in slots" :key="i" class="flex flex-col items-center text-center min-w-0">
        <div
          class="kc-stamp"
          :class="[slot.sesi ? 'kc-stamp--filled' : 'kc-stamp--empty', slot.wajib ? 'kc-stamp--wajib' : '']"
          :style="slot.sesi ? { transform: `rotate(${TILT[i % TILT.length]}deg)` } : null"
        >
          <template v-if="slot.sesi">
            <span class="text-lg font-black leading-none">{{ slot.sesi.grade }}</span>
            <v-icon v-if="slot.wajib" icon="mdi-star" size="12" class="kc-stamp__star" />
          </template>
          <v-icon v-else-if="slot.wajib" icon="mdi-star-outline" size="20" />
          <span v-else class="text-sm font-semibold">{{ i + 1 }}</span>
        </div>
        <p class="mt-1.5 text-[11px] font-medium leading-tight text-slate-700 truncate w-full">
          <template v-if="slot.sesi">{{ hari(slot.sesi.tanggal) }} {{ tanggal(slot.sesi.tanggal, { day: 'numeric' }) }}</template>
          <template v-else-if="slot.wajib">{{ $t('portal.kaiwaCard.wajib') }}</template>
          <template v-else>&nbsp;</template>
        </p>
        <p class="text-[10px] leading-tight text-slate-500 truncate w-full">
          <template v-if="slot.sesi">{{ namaPendek(slot.sesi.senseiNama) }}</template>
          <template v-else-if="slot.wajib">{{ namaPendek(card.senseiWajib?.nama) }}</template>
        </p>
      </li>
    </ol>
    <p v-if="ekstra > 0" class="text-[11px] text-slate-500 text-right -mt-1">{{ $t('portal.kaiwaCard.ekstra', { n: ekstra }) }}</p>

    <div class="mt-4">
      <div class="h-2 rounded-full bg-slate-100 overflow-hidden" role="progressbar" :aria-valuenow="card.jumlah" aria-valuemin="0" :aria-valuemax="card.target">
        <div class="h-full rounded-full transition-all" :class="card.tercapai ? 'bg-emerald-500' : 'bg-primary'" :style="{ width: `${persen}%` }" />
      </div>
      <ul class="mt-3 space-y-1.5 text-sm">
        <li class="flex items-center gap-2">
          <v-icon :icon="card.kurang === 0 ? 'mdi-check-circle' : 'mdi-circle-outline'" :color="card.kurang === 0 ? 'success' : undefined" size="18" class="text-slate-400" />
          <span class="text-slate-800">{{ $t('portal.kaiwaCard.syaratJumlah', { n: card.target }) }}</span>
          <span class="ml-auto tabular-nums font-semibold" :class="card.kurang === 0 ? 'text-emerald-700' : 'text-slate-900'">
            {{ card.jumlah }}/{{ card.target }}
          </span>
        </li>
        <li v-if="card.senseiWajib" class="flex items-center gap-2">
          <v-icon :icon="card.wajibTerpenuhi ? 'mdi-check-circle' : 'mdi-circle-outline'" :color="card.wajibTerpenuhi ? 'success' : undefined" size="18" class="text-slate-400" />
          <span class="text-slate-800 min-w-0">{{ $t('portal.kaiwaCard.syaratWajib', { nama: $t('portal.senseiNama', { nama: card.senseiWajib.nama }) }) }}</span>
          <span class="ml-auto shrink-0 font-semibold" :class="card.wajibTerpenuhi ? 'text-emerald-700' : 'text-amber-700'">
            {{ card.wajibTerpenuhi ? $t('portal.kaiwaCard.sudah') : $t('portal.kaiwaCard.belum') }}
          </span>
        </li>
      </ul>
      <p v-if="!card.tercapai" class="mt-3 text-xs text-slate-600 leading-relaxed">{{ saran }}</p>
    </div>

    <slot />
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePortalFormat } from '../../services/portalSession.js';

const props = defineProps({
  // report.kaiwaCard from /api/portal/dashboard
  card: { type: Object, required: true },
});

const TILT = [-7, 5, -4, 8, -6, 3];

const { t } = useI18n();
const { tanggal, hari, rentangMinggu, toDate } = usePortalFormat();

const slots = computed(() => {
  const { target, sesi, senseiWajib } = props.card;
  const urut = [...sesi].sort((a, b) => a.tanggal.localeCompare(b.tanggal) || a.id - b.id);
  if (!senseiWajib) {
    return Array.from({ length: target }, (_, i) => ({ sesi: urut[i] || null, wajib: false }));
  }
  const sesiWajib = urut.find((s) => s.wajib) || null;
  const lain = urut.filter((s) => s !== sesiWajib);
  return [
    ...Array.from({ length: target - 1 }, (_, i) => ({ sesi: lain[i] || null, wajib: false })),
    { sesi: sesiWajib, wajib: true },
  ];
});

const ekstra = computed(() => props.card.jumlah - slots.value.filter((s) => s.sesi).length);
const persen = computed(() => Math.min(100, Math.round((props.card.jumlah / props.card.target) * 100)));

const sisaHari = computed(() => Math.round((toDate(props.card.minggu.selesai) - toDate(props.card.minggu.hariIni)) / 86400000) + 1);
const sisaHariText = computed(() =>
  sisaHari.value <= 1 ? t('portal.kaiwaCard.hariTerakhir') : t('portal.kaiwaCard.sisaHari', { n: sisaHari.value })
);

const saran = computed(() => {
  const { kurang, wajibTerpenuhi, senseiWajib } = props.card;
  const parts = [];
  if (kurang > 0) parts.push(t('portal.kaiwaCard.kurangSesi', { n: kurang }));
  if (!wajibTerpenuhi && senseiWajib) parts.push(t('portal.kaiwaCard.kurangWajib', { nama: t('portal.senseiNama', { nama: senseiWajib.nama }) }));
  return parts.join(' ');
});

function namaPendek(nama) {
  return nama ? String(nama).split(/\s+/)[0] : '–';
}
</script>

<style scoped>
.kc-stamp {
  position: relative;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kc-stamp--empty {
  border: 2px dashed #cbd5e1;
  color: #94a3b8;
  background: #f8fafc;
}

.kc-stamp--filled {
  border: 2px solid currentColor;
  box-shadow: inset 0 0 0 3px #fff, inset 0 0 0 4.5px currentColor;
  color: #1e40af;
  background: #eff6ff;
}

.kc-stamp--wajib.kc-stamp--empty {
  border-color: #fbbf24;
  color: #d97706;
  background: #fffbeb;
}

.kc-stamp--wajib.kc-stamp--filled {
  color: #b45309;
  background: #fef3c7;
}

.kc-stamp__star {
  position: absolute;
  top: 0.2rem;
  right: 0.3rem;
}
</style>
