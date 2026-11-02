<template>
  <div class="space-y-4">
    <div class="joy-surface px-4 py-3">
      <div class="flex items-center justify-between gap-3 text-xs font-medium text-slate-500">
        <span class="tabular-nums">{{ $t('portal.tes.bacaanKe', { n: index + 1, total: soal.length }) }}</span>
        <label class="flex items-center gap-1.5 cursor-pointer select-none">
          <input v-model="furigana" type="checkbox" class="accent-blue-700" />
          {{ $t('portal.tes.furigana') }}
        </label>
      </div>
      <div class="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div class="h-full rounded-full bg-primary transition-all" :style="{ width: `${progres}%` }" />
      </div>
    </div>

    <section class="joy-surface p-5">
      <h2 class="text-lg font-bold text-slate-900" lang="ja"><FuriganaText :text="bacaan.judul" :furigana="furigana" /></h2>
      <p class="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-4 text-lg leading-[2.4] text-slate-900" lang="ja">
        <FuriganaText :text="bacaan.teks" :furigana="furigana" />
      </p>
      <div v-if="diperiksa && bacaan.terjemahan" class="mt-3">
        <button type="button" class="text-xs font-medium text-blue-700 hover:underline" @click="terjemahanTerbuka = !terjemahanTerbuka">
          {{ terjemahanTerbuka ? $t('portal.tes.tutupTerjemahan') : $t('portal.tes.lihatTerjemahan') }}
        </button>
        <p v-if="terjemahanTerbuka" class="mt-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-950 leading-relaxed">{{ bacaan.terjemahan }}</p>
      </div>
    </section>

    <section v-for="(s, qi) in bacaan.soal" :key="s.id" class="joy-surface p-5">
      <p class="text-base font-semibold text-slate-900" lang="ja">{{ qi + 1 }}. <FuriganaText :text="s.tanya" :furigana="furigana" /></p>
      <p class="text-xs text-slate-500 mt-0.5">{{ s.tanyaId }}</p>
      <div class="mt-3 grid gap-2">
        <button
          v-for="(opt, oi) in s.opsi"
          :key="opt"
          type="button"
          class="flex items-center gap-3 rounded-xl border-2 px-4 py-2.5 text-left text-sm transition-colors"
          :class="kelasOpsi(s, oi)"
          :disabled="diperiksa"
          @click="jawaban = { ...jawaban, [s.id]: oi }"
        >
          <span class="w-6 h-6 shrink-0 rounded-full bg-white/70 border border-slate-200 text-xs font-semibold flex items-center justify-center">{{ 'ABC'[oi] }}</span>
          <span>{{ opt }}</span>
        </button>
      </div>
      <p v-if="diperiksa" class="mt-2 rounded-lg px-3 py-2 text-xs" :class="jawaban[s.id] === s.benar ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'">
        {{ jawaban[s.id] === s.benar ? $t('portal.tes.benarKomentar') : $t('portal.tes.salahKomentar') }} {{ s.pembahasan }}
      </p>
    </section>

    <div class="flex items-center justify-between gap-2">
      <v-btn v-if="mode === 'resmi' && index > 0" variant="text" class="text-none" prepend-icon="mdi-chevron-left" @click="pindah(index - 1)">
        {{ $t('portal.tes.sebelumnya') }}
      </v-btn>
      <span v-else />
      <v-btn v-if="mode === 'latihan' && !diperiksa" color="primary" variant="flat" class="text-none" :disabled="!bacaanTerjawab" @click="diperiksa = true">
        {{ $t('portal.tes.periksa') }}
      </v-btn>
      <v-btn
        v-else-if="index + 1 < soal.length"
        color="primary"
        variant="flat"
        class="text-none"
        append-icon="mdi-chevron-right"
        :disabled="!bacaanTerjawab"
        @click="pindah(index + 1)"
      >
        {{ $t('portal.tes.bacaanBerikutnya') }}
      </v-btn>
      <v-btn v-else color="primary" variant="flat" class="text-none" :loading="mengirim" :disabled="!semuaTerjawab" @click="$emit('selesai', jawaban)">
        {{ mode === 'resmi' ? $t('portal.tes.kirimJawaban') : $t('portal.tes.lihatHasil') }}
      </v-btn>
    </div>
    <p v-if="mode === 'resmi' && index + 1 === soal.length" class="text-xs text-slate-500 text-right">{{ $t('portal.tes.kirimSekali') }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import FuriganaText from './FuriganaText.vue';

const props = defineProps({
  soal: { type: Array, required: true },
  mode: { type: String, default: 'latihan' },
  mengirim: { type: Boolean, default: false },
});
defineEmits(['selesai']);

const index = ref(0);
const jawaban = ref({});
const furigana = ref(true);
const diperiksa = ref(false);
const terjemahanTerbuka = ref(false);

const bacaan = computed(() => props.soal[index.value]);
const semuaSoal = computed(() => props.soal.flatMap((b) => b.soal));
const bacaanTerjawab = computed(() => bacaan.value.soal.every((s) => Number.isInteger(jawaban.value[s.id])));
const semuaTerjawab = computed(() => semuaSoal.value.every((s) => Number.isInteger(jawaban.value[s.id])));
const progres = computed(() => (semuaSoal.value.filter((s) => Number.isInteger(jawaban.value[s.id])).length / semuaSoal.value.length) * 100);

function kelasOpsi(s, oi) {
  const dipilih = jawaban.value[s.id] === oi;
  if (diperiksa.value) {
    if (oi === s.benar) return 'border-emerald-500 bg-emerald-50 text-emerald-950';
    if (dipilih) return 'border-red-400 bg-red-50 text-red-950';
    return 'border-slate-200 bg-white text-slate-500';
  }
  return dipilih ? 'border-blue-600 bg-blue-50 text-slate-900' : 'border-slate-200 bg-white text-slate-900 hover:border-blue-400';
}

function pindah(i) {
  index.value = i;
  diperiksa.value = false;
  terjemahanTerbuka.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>
