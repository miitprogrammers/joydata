<template>
  <div class="space-y-4">
    <p v-if="kertas.situasi" class="text-sm text-slate-600" lang="ja" translate="no">
      <FuriganaText :text="kertas.situasi" />
    </p>

    <!-- The dialog; the line with the four boxes is the question -->
    <div class="rounded-xl border border-slate-100 bg-slate-50 px-4 py-4 space-y-3" lang="ja" translate="no">
      <div v-for="(baris, i) in kertas.baris" :key="i" class="flex items-start gap-2.5">
        <span
          v-if="baris.pembicara"
          class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600"
        >{{ baris.pembicara }}</span>
        <p v-if="!soalBaris(baris)" class="min-w-0 text-lg leading-[2.2] text-slate-900 break-words">
          <FuriganaText :text="baris.teks" />
        </p>
        <p v-else class="min-w-0 text-lg leading-[2.4] text-slate-900 break-words" :aria-label="$t('portal.bunpouAdventure.baris')">
          <FuriganaText :text="baris.sebelum" />
          <span
            v-for="k in kotak"
            :key="k.i"
            class="mx-0.5 inline-block h-9 min-w-[2.25rem] border-b-2 text-center align-middle text-base font-bold leading-9"
            :class="k.bintang ? 'border-amber-500 bg-amber-100 text-amber-700 rounded-t' : 'border-slate-400'"
            :data-bintang="k.bintang ? 'ya' : null"
          >{{ k.bintang ? '★' : '' }}</span>
          <FuriganaText :text="baris.sesudah" />
        </p>
      </div>
    </div>

    <p class="text-sm font-medium text-slate-700">{{ $t('portal.bunpouAdventure.pilihPetunjuk') }}</p>

    <div class="grid sm:grid-cols-4 gap-2.5" :class="pilihanPanjang ? 'grid-cols-1' : 'grid-cols-2'" role="radiogroup" :aria-label="$t('portal.bunpouAdventure.pilihPetunjuk')">
      <button
        v-for="p in kertas.pilihan"
        :key="p.nomor"
        type="button"
        role="radio"
        :aria-checked="dipilih === p.nomor"
        :disabled="terjawab"
        class="flex min-h-[56px] items-center gap-3 rounded-xl border-2 px-3 py-2 text-left text-lg transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
        :class="kelasPilihan(p.nomor)"
        @click="pilih(p.nomor)"
      >
        <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/70 border border-slate-200 text-xs font-semibold text-slate-600 tabular-nums">{{ p.nomor }}</span>
        <span class="min-w-0 break-words" lang="ja" translate="no"><FuriganaText :text="p.teks" /></span>
      </button>
    </div>

    <!-- Feedback right after the answer -->
    <div
      v-if="terjawab"
      class="rounded-xl px-4 py-3 text-sm space-y-2"
      :class="benar ? 'bg-emerald-50 text-emerald-900' : 'bg-red-50 text-red-900'"
      role="status"
    >
      <p class="flex items-center gap-1.5 font-semibold">
        <v-icon :icon="benar ? 'mdi-check-circle' : 'mdi-close-circle'" size="18" />
        {{ benar ? $t('portal.bunpouAdventure.benar') : $t('portal.bunpouAdventure.salah') }}
      </p>
      <p class="text-lg leading-[2.2] text-slate-900 break-words" lang="ja" translate="no">
        <FuriganaText :text="kalimat.sebelum" />
        <template v-for="(b, i) in kalimat.bagian" :key="i">
          <span
            class="inline-block whitespace-nowrap rounded px-1"
            :class="b.bintang ? 'bg-amber-200 font-bold' : ''"
            :data-bintang="b.bintang ? 'ya' : null"
          ><FuriganaText :text="b.teks" /><sup v-if="b.bintang" class="ml-0.5 text-amber-700">★</sup></span>
        </template>
        <FuriganaText :text="kalimat.sesudah" />
      </p>
      <p class="font-semibold">{{ $t('portal.bunpouAdventure.jawabanBintang', { n: kertas.benar }) }}</p>
      <p v-if="kertas.terjemahan"><span class="font-semibold">{{ $t('portal.bunpouAdventure.terjemahan') }}:</span> <TeksJepangCampur :text="kertas.terjemahan" /></p>
      <p v-if="kertas.pembahasan"><span class="font-semibold">{{ $t('portal.bunpouAdventure.pembahasan') }}:</span> <TeksJepangCampur :text="kertas.pembahasan" /></p>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue';
import FuriganaText from '../tes/FuriganaText.vue';
import TeksJepangCampur from './TeksJepangCampur.vue';
import { kotakSoal, susunKalimat } from '../../../services/bunpouAdventure.js';

// One "soal bintang": the peserta picks the number of the piece that falls in the ★ box, as in the JLPT.
// `dipilih` = the number chosen (null until answered); the parent keeps the answers.
const props = defineProps({
  kertas: { type: Object, required: true },
  dipilih: { type: Number, default: null },
});
const emit = defineEmits(['pilih']);

const terjawab = computed(() => props.dipilih !== null && props.dipilih !== undefined);
const benar = computed(() => terjawab.value && props.dipilih === props.kertas.benar);
const kotak = computed(() => kotakSoal(props.kertas));
const kalimat = computed(() => susunKalimat(props.kertas));
// Long pieces get a full-width button on a phone instead of breaking in the middle of a word.
const pilihanPanjang = computed(() => props.kertas.pilihan.some((p) => p.teks.replace(/{[^}]*}/g, '').length > 4));

const soalBaris = (baris) => 'sebelum' in baris || 'sesudah' in baris;

function kelasPilihan(nomor) {
  if (!terjawab.value) return 'border-slate-200 bg-white text-slate-900 hover:border-blue-600 hover:bg-blue-50';
  if (nomor === props.kertas.benar) return 'border-emerald-500 bg-emerald-50 text-emerald-900';
  if (nomor === props.dipilih) return 'border-red-400 bg-red-50 text-red-900';
  return 'border-slate-200 bg-white text-slate-400';
}

function pilih(nomor) {
  if (!terjawab.value) emit('pilih', nomor);
}

function onKey(e) {
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  if (terjawab.value || e.target?.closest?.('input, textarea')) return;
  if (/^[1-4]$/.test(e.key) && props.kertas.pilihan.some((p) => p.nomor === Number(e.key))) pilih(Number(e.key));
}

onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>
