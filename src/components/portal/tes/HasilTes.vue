<template>
  <div class="space-y-4">
    <section class="joy-surface p-6 text-center">
      <p class="text-xs font-medium text-slate-500">{{ judul }}</p>
      <div
        class="mx-auto mt-3 w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center"
        :class="lulus ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-amber-500 bg-amber-50 text-amber-800'"
      >
        <span class="text-3xl font-black tabular-nums">{{ num(hasil.skor, 2) }}</span>
        <span class="text-[11px] font-semibold">/ 100</span>
      </div>
      <p class="mt-3 text-sm text-slate-700">{{ pesan }}</p>
      <p v-if="tersimpanInfo" class="mt-2 text-xs font-medium text-emerald-800 bg-emerald-50 rounded-lg px-3 py-2 inline-block">
        <v-icon icon="mdi-content-save-check-outline" size="14" /> {{ tersimpanInfo }}
      </p>
      <p v-else class="mt-2 text-xs text-slate-500">{{ $t('portal.tes.latihanTidakDisimpan') }}</p>
    </section>

    <section class="grid gap-3" :class="hasil.jenis === 'kanji' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'">
      <div v-for="s in statistik" :key="s.label" class="joy-surface p-3 text-center">
        <p class="text-[11px] font-medium text-slate-500">{{ s.label }}</p>
        <p class="text-lg font-bold tabular-nums mt-0.5" :class="s.kelas">{{ s.nilai }}</p>
      </div>
    </section>

    <section class="joy-surface p-5">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h2 class="text-base font-bold text-slate-900 font-display">{{ $t('portal.tes.pembahasan') }}</h2>
        <label v-if="jumlahSalah && jumlahSalah < hasil.detail.length" class="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
          <input v-model="hanyaSalah" type="checkbox" class="accent-blue-700" />
          {{ $t('portal.tes.hanyaSalah', { n: jumlahSalah }) }}
        </label>
      </div>

      <ul v-if="hasil.jenis === 'kanji'" class="divide-y divide-slate-100">
        <li v-for="(d, i) in daftar" :key="d.id" class="py-3 flex items-start gap-3">
          <span class="text-2xl font-bold text-slate-900 w-20 shrink-0 break-words" lang="ja">{{ d.kanji }}</span>
          <div class="min-w-0 flex-1 text-sm space-y-0.5">
            <p :class="d.bacaanOk ? 'text-slate-700' : 'text-red-700'">
              <v-icon :icon="d.bacaanOk ? 'mdi-check' : 'mdi-close'" size="14" />
              <span lang="ja">{{ d.bacaanDipilih ?? '—' }}</span>
              <template v-if="!d.bacaanOk"> → <span class="font-semibold text-slate-900" lang="ja">{{ d.bacaanBenar }}</span></template>
            </p>
            <p :class="d.artiOk ? 'text-slate-700' : 'text-red-700'">
              <v-icon :icon="d.artiOk ? 'mdi-check' : 'mdi-close'" size="14" />
              {{ d.artiDipilih ?? '—' }}
              <template v-if="!d.artiOk"> → <span class="font-semibold text-slate-900">{{ d.artiBenar }}</span></template>
            </p>
            <p v-if="d.semuaBacaan" class="text-xs text-slate-500" lang="ja">{{ d.semuaBacaan }}</p>
          </div>
          <span class="text-[11px] text-slate-400 tabular-nums shrink-0">{{ i + 1 }}</span>
        </li>
      </ul>

      <ul v-else class="divide-y divide-slate-100">
        <li v-for="d in daftar" :key="d.id" class="py-3 text-sm space-y-1">
          <p class="text-xs text-slate-500" lang="ja"><FuriganaText :text="d.judul" /></p>
          <p class="font-medium text-slate-900" lang="ja"><FuriganaText :text="d.tanya" /></p>
          <p class="text-xs text-slate-500">{{ d.tanyaId }}</p>
          <p :class="d.ok ? 'text-emerald-800' : 'text-red-700'">
            <v-icon :icon="d.ok ? 'mdi-check' : 'mdi-close'" size="14" />
            {{ d.jawabanDipilih ?? '—' }}
            <template v-if="!d.ok"> → <span class="font-semibold text-slate-900">{{ d.jawabanBenar }}</span></template>
          </p>
          <p class="text-xs text-slate-600 bg-slate-50 rounded px-2 py-1.5" lang="ja">{{ d.pembahasan }}</p>
        </li>
      </ul>
    </section>

    <div class="flex flex-wrap justify-center gap-2">
      <v-btn v-if="bisaUlang" color="primary" variant="flat" class="text-none" prepend-icon="mdi-refresh" @click="$emit('ulang')">
        {{ $t('portal.tes.ulangLatihan') }}
      </v-btn>
      <v-btn variant="outlined" color="primary" class="text-none" @click="$emit('kembali')">{{ $t('portal.tes.kembali') }}</v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePortalFormat } from '../../../services/portalSession.js';
import FuriganaText from './FuriganaText.vue';

const props = defineProps({
  hasil: { type: Object, required: true },
  judul: { type: String, default: '' },
  detik: { type: Number, default: 0 },
  tersimpanInfo: { type: String, default: '' },
  bisaUlang: { type: Boolean, default: false },
});
defineEmits(['ulang', 'kembali']);

const { t } = useI18n();
const { num } = usePortalFormat();

const salah = (d) => (props.hasil.jenis === 'kanji' ? !d.bacaanOk || !d.artiOk : !d.ok);
const jumlahSalah = computed(() => props.hasil.detail.filter(salah).length);
const hanyaSalah = ref(jumlahSalah.value > 0);
const daftar = computed(() => (hanyaSalah.value ? props.hasil.detail.filter(salah) : props.hasil.detail));
const lulus = computed(() => props.hasil.skor >= 75);

const pesan = computed(() => {
  if (props.hasil.skor >= 85) return t('portal.tes.pesanHebat');
  if (props.hasil.skor >= 60) return t('portal.tes.pesanBagus');
  return t('portal.tes.pesanSemangat');
});

const waktu = computed(() => `${String(Math.floor(props.detik / 60)).padStart(2, '0')}:${String(props.detik % 60).padStart(2, '0')}`);

const statistik = computed(() => {
  const h = props.hasil;
  if (h.jenis === 'kanji') {
    return [
      { label: t('portal.tes.statBenarPenuh'), nilai: `${h.benar}/${h.total}`, kelas: 'text-emerald-700' },
      { label: t('portal.tes.caraBaca'), nilai: `${h.benarBacaan}/${h.total}`, kelas: 'text-slate-900' },
      { label: t('portal.tes.arti'), nilai: `${h.benarArti}/${h.total}`, kelas: 'text-slate-900' },
      { label: t('portal.tes.waktu'), nilai: waktu.value, kelas: 'text-slate-900' },
    ];
  }
  return [
    { label: t('portal.tes.statBenar'), nilai: h.benar, kelas: 'text-emerald-700' },
    { label: t('portal.tes.statSalah'), nilai: h.total - h.benar, kelas: 'text-red-700' },
    { label: t('portal.tes.waktu'), nilai: waktu.value, kelas: 'text-slate-900' },
  ];
});
</script>
