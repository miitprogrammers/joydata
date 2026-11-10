<template>
  <div class="space-y-4">
    <div class="joy-surface p-4 space-y-3">
      <p class="text-xs text-slate-600 leading-relaxed">{{ $t('tesOnline.bank.info') }}</p>
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <v-btn-toggle v-model="jenis" mandatory color="primary" variant="outlined" density="compact" class="sm:col-span-3 self-center">
          <v-btn value="kanji" class="text-none">Kanji</v-btn>
          <v-btn value="dokkai" class="text-none">Dokkai</v-btn>
        </v-btn-toggle>
        <v-select
          v-model="materi"
          :items="materiOptions"
          item-title="label"
          item-value="kode"
          :label="jenis === 'kanji' ? $t('tesOnline.materi') : $t('tesOnline.levelBacaan')"
          variant="outlined"
          density="compact"
          hide-details
          :class="jenis === 'kanji' ? 'sm:col-span-9' : 'sm:col-span-5'"
        />
        <v-select
          v-if="jenis === 'dokkai'"
          v-model="jlpt"
          :items="jlptChoices"
          item-title="label"
          item-value="value"
          item-props="props"
          :label="$t('tesOnline.polaKalimat')"
          variant="outlined"
          density="compact"
          hide-details
          class="sm:col-span-4"
        />
        <v-select
          v-if="jenis === 'dokkai'"
          v-model="kanjiVolume"
          :items="volumeChoices"
          item-title="label"
          item-value="value"
          multiple
          chips
          closable-chips
          :label="$t('tesOnline.kanjiBacaan')"
          :hint="$t('tesOnline.kanjiBacaanHint')"
          persistent-hint
          :error-messages="kanjiVolume.length ? [] : [$t('tesOnline.kanjiMinimal')]"
          variant="outlined"
          density="compact"
          class="sm:col-span-12"
        />
      </div>

      <div class="flex flex-wrap items-center gap-3 pt-1">
        <v-btn-toggle v-model="mode" mandatory color="primary" variant="tonal" density="compact">
          <v-btn value="semua" class="text-none" prepend-icon="mdi-format-list-bulleted">{{ $t('tesOnline.bank.modeSemua') }}</v-btn>
          <v-btn value="simulasi" class="text-none" prepend-icon="mdi-shuffle-variant">{{ $t('tesOnline.bank.modeSimulasi') }}</v-btn>
        </v-btn-toggle>
        <template v-if="mode === 'simulasi'">
          <v-text-field
            v-model="jumlah"
            type="number"
            min="1"
            :label="jenis === 'kanji' ? $t('tesOnline.jumlahKata') : $t('tesOnline.jumlahBacaan')"
            variant="outlined"
            density="compact"
            hide-details
            style="max-width: 220px"
            @keyup.enter="muat"
          />
          <v-btn variant="outlined" color="primary" class="text-none" prepend-icon="mdi-refresh" :loading="loading" :disabled="!siap" @click="muat">
            {{ $t('tesOnline.bank.acakUlang') }}
          </v-btn>
        </template>
        <v-text-field
          v-else
          v-model="cari"
          prepend-inner-icon="mdi-magnify"
          :label="$t('tesOnline.bank.cari')"
          variant="outlined"
          density="compact"
          hide-details
          clearable
          style="max-width: 280px"
        />
        <div class="flex items-center gap-4 ml-auto">
          <label v-if="jenis === 'dokkai'" class="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
            <input v-model="furigana" type="checkbox" class="accent-blue-700" />
            {{ $t('portal.tes.furigana') }}
          </label>
          <label class="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
            <input v-model="kunci" type="checkbox" class="accent-blue-700" />
            {{ $t('tesOnline.bank.kunci') }}
          </label>
        </div>
      </div>
    </div>

    <div class="joy-surface overflow-hidden">
      <div class="px-5 py-3 border-b border-slate-200 text-sm text-slate-700 flex flex-wrap items-center justify-between gap-2">
        <span class="font-semibold text-slate-900">{{ data?.materiJudul || '' }}</span>
        <span class="text-xs text-slate-500 tabular-nums">{{ ringkasan }}</span>
      </div>
      <p v-if="mode === 'simulasi'" class="px-5 py-2.5 bg-sky-50 text-xs text-sky-900 leading-relaxed">{{ $t('tesOnline.bank.simulasiInfo') }}</p>

      <div v-if="loading && !data" class="p-6"><v-skeleton-loader type="table-row-divider@6" /></div>
      <div v-else-if="!siap || !daftar.length" class="p-8 text-center text-sm text-slate-500">{{ $t('tesOnline.bank.kosong') }}</div>

      <!-- Kanji: every word of the material -->
      <div v-else-if="jenis === 'kanji' && mode === 'semua'" class="overflow-x-auto">
        <table class="w-full text-left border-collapse joy-table text-sm">
          <thead>
            <tr>
              <th class="px-5 py-2.5 w-12">#</th>
              <th class="px-4 py-2.5">{{ $t('tesOnline.bank.colKanji') }}</th>
              <template v-if="materi === 'DASAR'">
                <th class="px-4 py-2.5">{{ $t('tesOnline.bank.colOn') }}</th>
                <th class="px-4 py-2.5">{{ $t('tesOnline.bank.colKun') }}</th>
              </template>
              <th v-else class="px-4 py-2.5">{{ $t('tesOnline.bank.colBacaan') }}</th>
              <th class="px-4 py-2.5">{{ $t('tesOnline.bank.colArti') }}</th>
              <th v-if="semuaVolume" class="px-5 py-2.5">{{ $t('tesOnline.bank.colVolume') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(k, i) in daftar" :key="k.id">
              <td class="px-5 py-2 text-xs text-slate-400 tabular-nums">{{ i + 1 }}</td>
              <td class="px-4 py-2 text-xl font-semibold text-slate-900" lang="ja">{{ k.kanji }}</td>
              <template v-if="materi === 'DASAR'">
                <td class="px-4 py-2" lang="ja">
                  <span v-if="kunci">{{ k.on.join('、') || '-' }}</span><span v-else class="text-slate-300">···</span>
                </td>
                <td class="px-4 py-2" lang="ja">
                  <span v-if="kunci">{{ k.kun.join('、') || '-' }}</span><span v-else class="text-slate-300">···</span>
                </td>
              </template>
              <td v-else class="px-4 py-2" lang="ja">
                <template v-if="kunci">
                  {{ k.bacaan }}
                  <div v-if="k.bacaanLain?.length" class="text-[11px] text-slate-500">{{ $t('tesOnline.bank.bacaanLain', { daftar: k.bacaanLain.join('、') }) }}</div>
                </template>
                <span v-else class="text-slate-300">···</span>
              </td>
              <td class="px-4 py-2 text-slate-700">
                <template v-if="kunci">{{ k.arti }}</template><span v-else class="text-slate-300">···</span>
              </td>
              <td v-if="semuaVolume" class="px-5 py-2 text-xs text-slate-500 whitespace-nowrap">{{ labelVolumeKanji(k.id.split(':')[0], $t) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Kanji: one peserta's paper, every word with its reading and meaning options -->
      <div v-else-if="jenis === 'kanji'" class="overflow-x-auto">
        <table class="w-full text-left border-collapse joy-table text-sm">
          <thead>
            <tr>
              <th class="px-5 py-2.5 w-12">#</th>
              <th class="px-4 py-2.5">{{ $t('tesOnline.bank.colKanji') }}</th>
              <th class="px-4 py-2.5">{{ $t('tesOnline.bank.colPilihanBacaan') }}</th>
              <th class="px-5 py-2.5">{{ $t('tesOnline.bank.colPilihanArti') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, i) in daftar" :key="s.id">
              <td class="px-5 py-2 text-xs text-slate-400 tabular-nums">{{ i + 1 }}</td>
              <td class="px-4 py-2 text-xl font-semibold text-slate-900" lang="ja">{{ s.kanji }}</td>
              <td v-for="bagian in ['bacaan', 'arti']" :key="bagian" class="px-4 py-2">
                <div class="flex flex-wrap gap-1.5" :lang="bagian === 'bacaan' ? 'ja' : undefined">
                  <span
                    v-for="(o, oi) in s[bagian].opsi"
                    :key="oi"
                    class="rounded-md border px-2 py-0.5 text-xs"
                    :class="kunci && oi === s[bagian].benar ? 'border-emerald-300 bg-emerald-50 font-semibold text-emerald-900' : 'border-slate-200 text-slate-700'"
                  >
                    {{ 'ABCD'[oi] }}. {{ o }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Dokkai: passages with their questions (all, or one peserta's paper) -->
      <template v-else>
        <section v-for="(b, i) in daftar" :key="b.id" class="px-6 py-4 border-b border-slate-100">
          <div class="flex flex-wrap items-center gap-1.5">
            <h3 class="text-base font-semibold text-slate-900 mr-1" lang="ja">{{ i + 1 }}. <FuriganaText :text="b.judul" :furigana="furigana" /></h3>
            <span class="rounded px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700">{{ b.level }}</span>
            <span class="rounded px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700">{{ b.jlpt || jlpt }}</span>
            <span v-if="b.sumber === 'ai'" class="rounded px-1.5 py-0.5 text-[10px] font-bold bg-violet-100 text-violet-800">AI</span>
            <span class="text-[11px] text-slate-400 font-mono">{{ b.id }}</span>
          </div>
          <div v-if="polaBacaan(b).length" class="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span class="text-[11px] text-slate-500">{{ $t('tesOnline.bank.bunpou') }}</span>
            <span
              v-for="p in polaBacaan(b)"
              :key="p.nomor"
              class="rounded border border-sky-200 bg-sky-50 px-1.5 py-0.5 text-[11px] text-sky-900"
              :title="p.arti"
              lang="ja"
            >
              <span class="font-semibold tabular-nums">{{ p.nomor }}</span> {{ p.pola }}
            </span>
          </div>
          <p class="mt-2 rounded-lg bg-slate-50 border border-slate-100 p-3 text-base leading-[2.3] text-slate-900" lang="ja">
            <FuriganaText :text="b.teks" :furigana="furigana" />
          </p>
          <details v-if="kunci" class="mt-1">
            <summary class="text-xs font-medium text-blue-700 cursor-pointer select-none">{{ $t('tesOnline.ai.terjemahan') }}</summary>
            <p class="mt-1 text-xs text-slate-700 leading-relaxed">{{ b.terjemahan }}</p>
          </details>
          <div v-for="(s, si) in b.soal" :key="s.id" class="mt-3">
            <p class="text-sm font-medium text-slate-900" lang="ja">{{ si + 1 }}. <FuriganaText :text="s.tanya" :furigana="furigana" /></p>
            <p v-if="kunci" class="text-xs text-slate-500">{{ s.tanyaId }}</p>
            <ul class="mt-1 space-y-1">
              <li
                v-for="(o, oi) in s.opsi"
                :key="oi"
                class="flex items-center gap-2 rounded-md px-2 py-1 text-sm"
                :class="kunci && oi === s.benar ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'"
              >
                <span class="w-5 text-xs font-semibold text-slate-500">{{ 'ABC'[oi] }}</span>
                <span class="flex-1" lang="ja"><FuriganaText :text="o" :furigana="furigana" /></span>
                <span v-if="kunci && oi === s.benar" class="text-[11px] font-semibold text-emerald-700">{{ $t('tesOnline.ai.kunci') }}</span>
              </li>
            </ul>
            <p v-if="kunci" class="mt-1 text-xs text-slate-600" lang="ja">{{ s.pembahasan }}</p>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';
import FuriganaText from './portal/tes/FuriganaText.vue';
import { labelVolumeKanji } from '../utils/volumeKanji.js';

// Bank Soal on the Tes Online page: the same settings as opening a code, showing every question that code draws
// from with its key, or a paper drawn as one peserta would get it (nothing is stored).
const props = defineProps({
  katalog: { type: Object, default: () => ({ kanji: [], dokkai: [] }) },
  jlptOptions: { type: Array, default: () => ['N5', 'N4', 'N3'] },
  volumeKanji: { type: Array, default: () => [] },
  // { N5: [...], N4: [...], N3: [...] }: the volumes a dokkai code at that level starts with
  volumeKanjiDefault: { type: Object, default: () => ({}) },
});

const { t } = useI18n();
const appStore = useAppStore();

const jenis = ref('kanji');
const materi = ref(null);
const jlpt = ref('N5');
const kanjiVolume = ref([]);
const mode = ref('semua');
const jumlah = ref(20);
const cari = ref('');
const furigana = ref(true);
const kunci = ref(true);
const loading = ref(false);
const hasil = ref(null);
let permintaan = 0;

// A response is shown only for the settings it was asked with: Dasar rows have no place in a Volume table.
const kunciPengaturan = computed(() => JSON.stringify([jenis.value, materi.value, jlpt.value, kanjiVolume.value, mode.value]));
const data = computed(() => (hasil.value?.kunci === kunciPengaturan.value ? hasil.value.res : null));

// A dokkai level is named after what its bank practises at the chosen pattern level (judulPerJlpt, N4).
const materiOptions = computed(() =>
  (props.katalog[jenis.value] || []).map((m) => ({ ...m, label: (jenis.value === 'dokkai' && m.judulPerJlpt?.[jlpt.value]) || m.judul }))
);
const materiAktif = computed(() => materiOptions.value.find((m) => m.kode === materi.value));
// The bunpou module patterns a bank passage practises (N4 bank; AI passages and drawn papers carry none).
const polaPerNomor = computed(() => new Map((data.value?.polaBunpou || []).map((p) => [p.nomor, p])));
const polaBacaan = (b) => (b.bunpou || []).map((n) => polaPerNomor.value.get(n)).filter(Boolean);
const jlptChoices = computed(() =>
  props.jlptOptions.map((j) => {
    const n = materiAktif.value?.perJlpt?.[j]?.jumlah ?? 0;
    return { value: j, label: t('tesOnline.polaBank', { jlpt: j, n }), props: { disabled: n === 0 } };
  })
);
const volumeChoices = computed(() => props.volumeKanji.map((v) => ({ value: v, label: labelVolumeKanji(v, t) })));
const volumeAwal = (j) => [...(props.volumeKanjiDefault[j] || props.volumeKanji)];
// Semua Volume of a level: the table says which volume each word is from.
const semuaVolume = computed(() => ['SEMUA', 'N4SEMUA'].includes(materi.value));
const siap = computed(() => Boolean(materi.value) && (jenis.value !== 'dokkai' || kanjiVolume.value.length > 0));

const polos = (s) => String(s || '').replace(/\{[^}]*\}/g, '').toLowerCase();
const daftar = computed(() => {
  const items = (mode.value === 'simulasi' ? data.value?.soal : data.value?.items) || [];
  const q = mode.value === 'semua' ? String(cari.value || '').trim().toLowerCase() : '';
  if (!q) return items;
  return items.filter((x) =>
    jenis.value === 'kanji'
      ? [x.kanji, x.bacaan, x.arti, ...(x.on || []), ...(x.kun || []), ...(x.bacaanLain || [])].some((v) => polos(v).includes(q))
      : [x.id, x.judul, x.teks, x.terjemahan].some((v) => polos(v).includes(q))
  );
});

const ringkasan = computed(() => {
  if (!data.value) return '';
  const nSoal = (list) => list.reduce((n, b) => n + b.soal.length, 0);
  if (mode.value === 'simulasi') {
    const n = data.value.soal.length;
    return jenis.value === 'kanji'
      ? t('tesOnline.nKataAcak', { n, total: data.value.total })
      : `${t('tesOnline.nBacaanAcak', { n, total: data.value.total })} · ${t('tesOnline.bank.nSoal', { n: nSoal(data.value.soal) })}`;
  }
  const items = data.value.items;
  return jenis.value === 'kanji'
    ? t('tesOnline.bank.nKata', { n: items.length })
    : t('tesOnline.bank.nBacaan', { n: items.length, soal: nSoal(items) });
});

async function muat() {
  const id = ++permintaan;
  if (!siap.value) {
    hasil.value = null;
    loading.value = false;
    return;
  }
  const kunciDiminta = kunciPengaturan.value;
  loading.value = true;
  try {
    const params = new URLSearchParams({ jenis: jenis.value, materi: materi.value });
    if (jenis.value === 'dokkai') {
      params.set('jlpt', jlpt.value);
      params.set('volume', kanjiVolume.value.join(','));
    }
    if (mode.value === 'simulasi' && Number(jumlah.value) > 0) params.set('jumlah', String(jumlah.value));
    const res = await apiRequest(`/tes-online/${mode.value === 'simulasi' ? 'simulasi' : 'bank-soal'}?${params}`);
    if (id === permintaan) hasil.value = { kunci: kunciDiminta, res };
  } catch (err) {
    if (id === permintaan) {
      hasil.value = null;
      appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
    }
  } finally {
    if (id === permintaan) loading.value = false;
  }
}

watch(
  jenis,
  (j) => {
    materi.value = (props.katalog[j] || [])[0]?.kode || null;
    jlpt.value = 'N5';
    jumlah.value = j === 'kanji' ? 20 : 5;
    cari.value = '';
  }
);
watch(
  () => props.katalog,
  (k) => {
    if (!materi.value) materi.value = (k[jenis.value] || [])[0]?.kode || null;
  },
  { immediate: true }
);
watch(
  () => [props.volumeKanji, props.volumeKanjiDefault],
  () => {
    if (!kanjiVolume.value.length) kanjiVolume.value = volumeAwal(jlpt.value);
  },
  { immediate: true }
);
watch(jlpt, (j, lama) => {
  if (j !== lama) kanjiVolume.value = volumeAwal(j);
});
// A pattern level without passages at this reading level falls back to N5.
watch(materiAktif, (m) => {
  if (jenis.value === 'dokkai' && !(m?.perJlpt?.[jlpt.value]?.jumlah > 0)) jlpt.value = 'N5';
});
watch([jenis, materi, jlpt, kanjiVolume, mode], muat, { immediate: true });
</script>
