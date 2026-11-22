<template>
  <div class="space-y-4">
    <div class="joy-surface px-4 py-3">
      <div class="flex items-center justify-between text-xs font-medium text-slate-500">
        <span class="tabular-nums">{{ $t('portal.bunpouAdventure.soalKe', { n: Math.min(index + 1, soal.length), total: soal.length }) }}</span>
        <span class="tabular-nums flex items-center gap-1"><v-icon icon="mdi-timer-outline" size="14" />{{ waktu }}</span>
      </div>
      <div class="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div class="h-full rounded-full bg-primary transition-all" :style="{ width: `${progres}%` }" />
      </div>
    </div>

    <section class="joy-surface p-5">
      <SoalBintang :key="kertas.id" :kertas="kertas" :dipilih="jawaban[kertas.id] ?? null" @pilih="pilih" />
      <v-btn
        v-if="terjawab"
        block
        color="primary"
        variant="flat"
        class="text-none mt-4"
        :loading="mengirim && terakhir"
        @click="lanjut"
      >
        {{ terakhir ? $t('portal.bunpouAdventure.lihatHasil') : $t('portal.bunpouAdventure.lanjutSoal') }}
      </v-btn>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import SoalBintang from './SoalBintang.vue';
import { useDetakAktivitas } from '../../../services/aktivitasLatihan.js';
import { buatKlienBunpou } from '../../../services/bunpouAdventure.js';

// One session: a question at a time with feedback right after the answer; all answers go to the server at the end.
// The practice heartbeat (every 15 s) runs here; the parent stops it with berhenti() once the result is in.
const props = defineProps({
  sesiId: { type: String, required: true },
  soal: { type: Array, required: true },
  mengirim: { type: Boolean, default: false },
});
// selesai { jawaban: { [soalId]: nomor }, detikAktif }; progres { posisi, itemSelesai } for the live practice monitor
const emit = defineEmits(['selesai', 'progres']);

const klien = buatKlienBunpou();
const index = ref(0);
const jawaban = ref({});
const detik = ref(0);
let timer = null;

const aktivitas = useDetakAktivitas(({ detikAktif, selesai, keepalive }) =>
  klien.detak(props.sesiId, {
    detikAktif,
    selesai,
    keepalive,
    posisi: Math.min(index.value + 1, props.soal.length),
    itemSelesai: Object.keys(jawaban.value).length,
  })
);

const kertas = computed(() => props.soal[Math.min(index.value, props.soal.length - 1)]);
const terjawab = computed(() => jawaban.value[kertas.value.id] !== undefined);
const terakhir = computed(() => index.value + 1 >= props.soal.length);
const progres = computed(() => (Object.keys(jawaban.value).length / props.soal.length) * 100);
const waktu = computed(() => `${String(Math.floor(detik.value / 60)).padStart(2, '0')}:${String(detik.value % 60).padStart(2, '0')}`);

function pilih(nomor) {
  jawaban.value = { ...jawaban.value, [kertas.value.id]: nomor };
  emit('progres', { posisi: Math.min(index.value + 1, props.soal.length), itemSelesai: Object.keys(jawaban.value).length });
}

let sudahKirim = false;

function lanjut() {
  if (!terjawab.value) return;
  if (!terakhir.value) index.value += 1;
  else if (!sudahKirim) {
    // One submit per paper: Enter and a click on the focused button can both arrive.
    sudahKirim = true;
    emit('selesai', { jawaban: jawaban.value, detikAktif: aktivitas.detikAktif() });
  }
}

/** The parent could not hand the paper in and the paper is still valid: allow another try. */
function bukaKirimLagi() {
  sudahKirim = false;
}

function onKey(e) {
  if (e.key === 'Enter' && !e.ctrlKey && !e.altKey && !e.metaKey && terjawab.value && !e.target?.closest?.('button, input, textarea')) lanjut();
}

onMounted(() => {
  aktivitas.mulai(0, 'bunpou');
  const mulai = Date.now();
  timer = setInterval(() => {
    detik.value = Math.floor((Date.now() - mulai) / 1000);
  }, 1000);
  window.addEventListener('keydown', onKey);
});
onBeforeUnmount(() => {
  clearInterval(timer);
  window.removeEventListener('keydown', onKey);
});

defineExpose({
  /** Stops the heartbeat; kirimAkhir = send the closing signal (false once /nilai already closed the session). */
  berhenti: (opsi) => aktivitas.berhenti(opsi),
  bukaKirimLagi,
});
</script>
