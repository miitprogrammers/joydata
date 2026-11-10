<template>
  <div class="space-y-4">
    <div class="joy-surface px-4 py-3">
      <div class="flex items-center justify-between text-xs font-medium text-slate-500">
        <span class="tabular-nums">{{ $t('portal.tes.soalKe', { n: Math.min(index + 1, soal.length), total: soal.length }) }}</span>
        <span class="tabular-nums flex items-center gap-1"><v-icon icon="mdi-timer-outline" size="14" />{{ waktu }}</span>
      </div>
      <div class="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div class="h-full rounded-full bg-primary transition-all" :style="{ width: `${progres}%` }" />
      </div>
    </div>

    <section v-if="!semuaTerjawab" class="joy-surface p-5">
      <p class="text-center">
        <span class="inline-block rounded-full bg-blue-50 text-blue-800 px-3 py-1 text-xs font-semibold">
          {{ step === 'bacaan' ? $t('portal.tes.langkahBacaan') : step === 'arti' ? $t('portal.tes.langkahArti') : $t('portal.tes.langkahUmpan') }}
        </span>
      </p>
      <div class="mt-4 rounded-xl bg-slate-50 border border-slate-100 py-6 px-3 text-center">
        <p class="text-6xl font-bold text-slate-900 leading-tight break-words" lang="ja">{{ item.kanji }}</p>
        <p v-if="step === 'arti' && jawabanItem.bacaan !== null" class="mt-2 text-sm font-medium text-blue-700" lang="ja">
          {{ item.bacaan.opsi[jawabanItem.bacaan] }}
        </p>
      </div>

      <div v-if="step !== 'umpan'" class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          v-for="(opt, i) in opsiAktif"
          :key="`${step}-${opt}`"
          type="button"
          class="flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-left text-base text-slate-900 hover:border-blue-600 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600 transition-colors"
          @click="pilih(i)"
        >
          <span class="w-6 h-6 shrink-0 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center">{{ i + 1 }}</span>
          <span :lang="step === 'bacaan' ? 'ja' : undefined">{{ opt }}</span>
        </button>
      </div>
      <div v-if="step === 'arti'" class="mt-3">
        <button type="button" class="text-xs font-medium text-blue-700 hover:underline" @click="step = 'bacaan'">
          ← {{ $t('portal.tes.ubahBacaan') }}
        </button>
      </div>

      <!-- Practice: what was right before moving on -->
      <div v-if="step === 'umpan'" class="mt-4 space-y-2">
        <div v-for="bagian in umpan" :key="bagian.label" class="rounded-lg px-4 py-2.5 text-sm" :class="bagian.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'">
          <p class="font-semibold flex items-center gap-1.5">
            <v-icon :icon="bagian.ok ? 'mdi-check-circle' : 'mdi-close-circle'" size="16" />
            {{ bagian.label }}
          </p>
          <p class="mt-0.5">
            <span :lang="bagian.ja ? 'ja' : undefined">{{ bagian.dipilih }}</span>
            <template v-if="!bagian.ok">
              → <span class="font-semibold" :lang="bagian.ja ? 'ja' : undefined">{{ bagian.benar }}</span>
            </template>
          </p>
        </div>
        <p v-if="item.semuaBacaan" class="text-xs text-slate-500" lang="ja">{{ $t('portal.tes.semuaBacaan') }}: {{ item.semuaBacaan }}</p>
        <v-btn block color="primary" variant="flat" class="text-none mt-2" @click="lanjut">
          {{ index + 1 < soal.length ? $t('portal.tes.lanjut') : $t('portal.tes.lihatHasil') }}
        </v-btn>
      </div>
    </section>

    <section v-else class="joy-surface p-6 text-center space-y-3">
      <v-icon icon="mdi-check-decagram-outline" size="40" class="text-blue-700" />
      <p class="text-base font-semibold text-slate-900">{{ $t('portal.tes.semuaTerjawab') }}</p>
      <p class="text-sm text-slate-600">{{ $t('portal.tes.kirimSekali') }}</p>
      <v-btn color="primary" variant="flat" class="text-none" :loading="mengirim" @click="$emit('selesai', jawaban)">
        {{ $t('portal.tes.kirimJawaban') }}
      </v-btn>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  soal: { type: Array, required: true },
  // latihan: the paper carries its key, feedback after every word; resmi: no key, answers go to the server at the end
  mode: { type: String, default: 'latihan' },
  mulaiAt: { type: String, default: null },
  mengirim: { type: Boolean, default: false },
});
// progres { posisi, itemSelesai }: for the live practice monitor
const emit = defineEmits(['selesai', 'progres']);
const { t } = useI18n();

const index = ref(0);
const step = ref('bacaan');
const jawaban = ref({});
const semuaTerjawab = ref(false);

const item = computed(() => props.soal[Math.min(index.value, props.soal.length - 1)]);
const jawabanItem = computed(() => jawaban.value[item.value.id] || { bacaan: null, arti: null });
const opsiAktif = computed(() => (step.value === 'bacaan' ? item.value.bacaan.opsi : item.value.arti.opsi));
const progres = computed(() => (Object.keys(jawaban.value).filter((id) => jawaban.value[id].arti !== null).length / props.soal.length) * 100);

watch(
  [index, jawaban],
  () => {
    const itemSelesai = Object.values(jawaban.value).filter((j) => j.arti !== null && j.arti !== undefined).length;
    emit('progres', { posisi: Math.min(index.value + 1, props.soal.length), itemSelesai });
  },
  { immediate: true }
);

function simpan(bagian, i) {
  jawaban.value = { ...jawaban.value, [item.value.id]: { ...jawabanItem.value, [bagian]: i } };
}

function pilih(i) {
  if (step.value === 'bacaan') {
    simpan('bacaan', i);
    step.value = 'arti';
    return;
  }
  simpan('arti', i);
  if (props.mode === 'latihan') step.value = 'umpan';
  else lanjut();
}

function lanjut() {
  if (index.value + 1 < props.soal.length) {
    index.value += 1;
    step.value = 'bacaan';
  } else if (props.mode === 'latihan') {
    emit('selesai', jawaban.value);
  } else {
    semuaTerjawab.value = true;
  }
}

const umpan = computed(() => {
  const s = item.value;
  const j = jawabanItem.value;
  return [
    { label: t('portal.tes.caraBaca'), ja: true, ok: j.bacaan === s.bacaan.benar, dipilih: s.bacaan.opsi[j.bacaan], benar: s.bacaan.opsi[s.bacaan.benar] },
    { label: t('portal.tes.arti'), ja: false, ok: j.arti === s.arti.benar, dipilih: s.arti.opsi[j.arti], benar: s.arti.opsi[s.arti.benar] },
  ];
});

// Elapsed time; a resumed official test counts from when it was first started.
const detik = ref(0);
const mulai = props.mulaiAt ? new Date(props.mulaiAt).getTime() : Date.now();
let timer = null;
const waktu = computed(() => `${String(Math.floor(detik.value / 60)).padStart(2, '0')}:${String(detik.value % 60).padStart(2, '0')}`);

function onKey(e) {
  if (e.target?.closest?.('input, textarea') || semuaTerjawab.value) return;
  if (step.value === 'umpan' && e.key === 'Enter') lanjut();
  else if (step.value !== 'umpan' && /^[1-4]$/.test(e.key) && Number(e.key) <= opsiAktif.value.length) pilih(Number(e.key) - 1);
}

onMounted(() => {
  timer = setInterval(() => {
    detik.value = Math.max(0, Math.floor((Date.now() - mulai) / 1000));
  }, 1000);
  window.addEventListener('keydown', onKey);
});
onBeforeUnmount(() => {
  clearInterval(timer);
  window.removeEventListener('keydown', onKey);
});
</script>
