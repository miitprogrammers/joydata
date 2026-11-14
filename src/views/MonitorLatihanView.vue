<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('monitorLatihan.heading') }}</h1>
      <p class="text-sm text-slate-600 mt-1 max-w-3xl">{{ $t('monitorLatihan.subheading') }}</p>
    </div>

    <v-tabs v-model="tab" color="primary" density="compact" class="border-b border-slate-200">
      <v-tab value="live" class="text-none text-sm font-medium" prepend-icon="mdi-access-point">
        {{ $t('monitorLatihan.tabLive') }}
        <span v-if="liveItems.length" class="ml-2 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-1.5 tabular-nums">{{ liveItems.length }}</span>
      </v-tab>
      <v-tab value="riwayat" class="text-none text-sm font-medium" prepend-icon="mdi-podium">{{ $t('monitorLatihan.tabRiwayat') }}</v-tab>
    </v-tabs>

    <div class="joy-surface p-4 grid grid-cols-1 sm:grid-cols-12 gap-3">
      <div class="sm:col-span-4">
        <v-select
          v-model="kelasId"
          :items="kelasFilterOptions"
          item-title="label"
          item-value="value"
          :label="$t('monitorLatihan.filterKelas')"
          variant="outlined"
          density="compact"
          hide-details
        />
      </div>
      <div v-if="tab === 'riwayat'" class="sm:col-span-8 flex flex-wrap items-center gap-2">
        <v-btn-toggle v-model="periode" mandatory color="primary" variant="outlined" density="compact">
          <v-btn value="1" class="text-none">{{ $t('monitorLatihan.periode1') }}</v-btn>
          <v-btn value="7" class="text-none">{{ $t('monitorLatihan.periode7') }}</v-btn>
          <v-btn value="30" class="text-none">{{ $t('monitorLatihan.periode30') }}</v-btn>
          <v-btn value="semua" class="text-none">{{ $t('monitorLatihan.periodeSemua') }}</v-btn>
        </v-btn-toggle>
        <!-- One day: pick the date, or step a day back / forward (never past today, WIB) -->
        <div v-if="periode === '1'" class="flex items-center gap-1">
          <v-btn icon="mdi-chevron-left" variant="text" size="small" :aria-label="$t('monitorLatihan.hariSebelumnya')" @click="geserHari(-1)" />
          <v-text-field
            v-model="tanggal"
            type="date"
            :max="hariIni()"
            :aria-label="$t('monitorLatihan.pilihTanggal')"
            variant="outlined"
            density="compact"
            hide-details
            class="w-40"
          />
          <v-btn
            icon="mdi-chevron-right"
            variant="text"
            size="small"
            :disabled="tanggal >= hariIni()"
            :aria-label="$t('monitorLatihan.hariBerikutnya')"
            @click="geserHari(1)"
          />
        </div>
      </div>
      <div v-else class="sm:col-span-8 flex items-center gap-2 text-xs text-slate-500">
        <span class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span>{{ liveDiperbarui ? $t('monitorLatihan.diperbarui', { jam: jamDetik(liveDiperbarui) }) : $t('app.loading') }}</span>
      </div>
    </div>

    <!-- Practising right now -->
    <div v-if="tab === 'live'" class="joy-surface overflow-hidden">
      <div v-if="liveLoading && !liveDiperbarui" class="p-6"><v-skeleton-loader type="table-row-divider@4" /></div>
      <div v-else-if="!liveTampil.length" class="p-8 text-center text-sm text-slate-500">{{ $t('monitorLatihan.liveKosong') }}</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse joy-table">
          <thead>
            <tr>
              <th class="px-5 py-3">{{ $t('monitorLatihan.colPeserta') }}</th>
              <th class="px-4 py-3">{{ $t('monitorLatihan.colAktivitas') }}</th>
              <th class="px-4 py-3">{{ $t('monitorLatihan.colProgres') }}</th>
              <th class="px-4 py-3 text-right">{{ $t('monitorLatihan.colWaktuAktif') }}</th>
              <th class="px-5 py-3 text-right">{{ $t('monitorLatihan.colSinyal') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in liveTampil" :key="s.id" class="cursor-pointer hover:bg-slate-50" @click="bukaPeserta(s.pesertaId)">
              <td class="px-5 py-2.5">
                <div class="flex items-center gap-3 min-w-0">
                  <PesertaFoto :src="s.fotoUrl" :nama="s.nama" :size="36" />
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-slate-900 truncate">{{ s.nama }}</p>
                    <p class="text-xs text-slate-500 truncate">{{ s.namaKelas || '-' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-2.5">
                <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="warnaJenis(s)">
                  <v-icon :icon="ikonJenis(s)" size="13" />{{ labelJenis(s) }}
                </span>
                <p class="text-xs text-slate-600 mt-1">{{ s.materiJudul }}</p>
              </td>
              <td class="px-4 py-2.5 min-w-[160px]">
                <template v-if="s.jenis === 'flashcard'">
                  <p class="text-xs text-slate-700 tabular-nums">{{ $t('monitorLatihan.kartuKe', { n: s.posisi || 1, total: s.jumlahItem }) }}</p>
                  <p class="text-[11px] text-slate-500 tabular-nums">{{ $t('monitorLatihan.nDigeser', { n: s.itemSelesai }) }}</p>
                </template>
                <template v-else>
                  <p class="text-xs text-slate-700 tabular-nums">{{ $t('monitorLatihan.nDijawab', { n: s.itemSelesai, total: s.jumlahItem }) }}</p>
                  <div class="mt-1 h-1.5 w-32 rounded-full bg-slate-100 overflow-hidden">
                    <div class="h-full rounded-full bg-primary" :style="{ width: `${s.jumlahItem ? (s.itemSelesai / s.jumlahItem) * 100 : 0}%` }" />
                  </div>
                </template>
              </td>
              <td class="px-4 py-2.5 text-right">
                <p class="text-sm font-semibold text-slate-900 tabular-nums">{{ durasi(s.detikAktif) }}</p>
                <p class="text-[11px] text-slate-500">{{ $t('monitorLatihan.mulaiJam', { jam: jamMenit(s.mulaiAt) }) }}</p>
              </td>
              <td class="px-5 py-2.5 text-right text-xs text-slate-500 tabular-nums whitespace-nowrap">{{ sinyalLalu(s.terakhirAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Practice per peserta, most diligent first -->
    <div v-else class="joy-surface overflow-hidden">
      <div class="px-5 py-3 border-b border-slate-200 text-xs text-slate-500">{{ $t('monitorLatihan.urutanInfo') }}</div>
      <details v-if="aturanGrade" class="px-5 py-2.5 border-b border-slate-200 text-xs text-slate-600">
        <summary class="cursor-pointer select-none font-semibold text-primary">{{ $t('monitorLatihan.gradeRumusJudul') }}</summary>
        <ul class="mt-2 space-y-1.5 max-w-3xl leading-relaxed">
          <li v-for="b in barisRumus" :key="b.label"><span class="font-semibold text-slate-800">{{ b.label }}</span> = {{ b.teks }}</li>
        </ul>
      </details>
      <div v-if="statLoading && !statItems.length" class="p-6"><v-skeleton-loader type="table-row-divider@6" /></div>
      <div v-else-if="!statItems.length" class="p-8 text-center text-sm text-slate-500">{{ $t('monitorLatihan.riwayatKosong') }}</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse joy-table">
          <thead>
            <tr>
              <th class="px-5 py-3 w-12">#</th>
              <th class="px-4 py-3">{{ $t('monitorLatihan.colPeserta') }}</th>
              <th class="px-4 py-3">{{ $t('monitorLatihan.colWaktuAktif') }}</th>
              <th v-if="!satuHari" class="px-4 py-3 text-right">{{ $t('monitorLatihan.colHari') }}</th>
              <th class="px-4 py-3 text-right">{{ $t('monitorLatihan.colSesi') }}</th>
              <th class="px-4 py-3 text-right">{{ $t('monitorLatihan.colKartu') }}</th>
              <th class="px-4 py-3 text-right">{{ $t('monitorLatihan.colSoal') }}</th>
              <th class="px-4 py-3 text-right">{{ $t('monitorLatihan.colSkor') }}</th>
              <th class="px-4 py-3">{{ $t('monitorLatihan.colGrade') }}</th>
              <th class="px-5 py-3 text-right">{{ $t('monitorLatihan.colTerakhir') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in statItems" :key="r.pesertaId" class="cursor-pointer hover:bg-slate-50" @click="bukaPeserta(r.pesertaId)">
              <td class="px-5 py-2.5 text-sm font-semibold tabular-nums" :class="r.detikAktif ? 'text-slate-900' : 'text-slate-300'">{{ r.peringkatTampil }}</td>
              <td class="px-4 py-2.5">
                <div class="flex items-center gap-3 min-w-0">
                  <PesertaFoto :src="r.fotoUrl" :nama="r.nama" :size="32" />
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-slate-900 truncate">{{ r.nama }}</p>
                    <p class="text-xs text-slate-500 truncate">{{ r.namaKelas || '-' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-2.5 min-w-[170px]">
                <div class="flex items-center gap-2">
                  <div class="h-2 w-24 rounded-full bg-slate-100 overflow-hidden flex" :title="rincianJenis(r)">
                    <div class="h-full bg-blue-600" :style="{ width: `${lebarBatang(r.perJenis.flashcard)}%` }" />
                    <div class="h-full bg-teal-500" :style="{ width: `${lebarBatang(r.perJenis.kanji)}%` }" />
                    <div class="h-full bg-amber-500" :style="{ width: `${lebarBatang(r.perJenis.dokkai)}%` }" />
                  </div>
                  <span class="text-sm font-semibold tabular-nums" :class="r.detikAktif ? 'text-slate-900' : 'text-slate-400'">{{ durasiJam(r.detikAktif) }}</span>
                </div>
              </td>
              <td v-if="!satuHari" class="px-4 py-2.5 text-right text-sm tabular-nums">{{ r.hariAktif }}</td>
              <td class="px-4 py-2.5 text-right text-sm tabular-nums">{{ r.jumlahSesi }}</td>
              <td class="px-4 py-2.5 text-right text-sm tabular-nums">{{ r.kartu }}</td>
              <td class="px-4 py-2.5 text-right text-sm tabular-nums">{{ r.soal }}</td>
              <td class="px-4 py-2.5 text-right text-sm tabular-nums">{{ satuDesimal(r.rataSkorLatihan) }}</td>
              <td class="px-4 py-2.5 whitespace-nowrap" :title="r.grade?.grade ? rincianGrade(r.grade) : ''">
                <span v-if="r.grade?.grade" class="inline-flex items-center gap-1.5">
                  <span class="w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold" :class="warnaGrade(r.grade.grade)">{{ r.grade.grade }}</span>
                  <span class="text-xs text-slate-500 tabular-nums">{{ satuDesimal(r.grade.nilai) }}</span>
                </span>
                <span v-else class="text-sm text-slate-400">-</span>
              </td>
              <td class="px-5 py-2.5 text-right text-xs text-slate-500 whitespace-nowrap">{{ r.terakhirAt ? waktuPendek(r.terakhirAt) : $t('monitorLatihan.belumPernah') }}</td>
            </tr>
          </tbody>
        </table>
        <div class="px-5 py-2.5 border-t border-slate-100 flex flex-wrap gap-4 text-[11px] text-slate-500">
          <span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-sm bg-blue-600" />{{ $t('monitorLatihan.jenisFlashcard') }}</span>
          <span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-sm bg-teal-500" />{{ $t('monitorLatihan.jenisKanji') }}</span>
          <span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-sm bg-amber-500" />{{ $t('monitorLatihan.jenisDokkai') }}</span>
        </div>
      </div>
    </div>

    <!-- One peserta: totals, flashcard progress, sessions -->
    <v-dialog v-model="detailOpen" max-width="860" scrollable>
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
          <PesertaFoto v-if="detail" :src="detail.peserta.fotoUrl" :nama="detail.peserta.nama" :size="44" perbesar />
          <div class="min-w-0 flex-1">
            <p class="text-base font-bold text-slate-900 truncate">{{ detail?.peserta.nama || '' }}</p>
            <p class="text-xs text-slate-500">{{ detail?.peserta.namaKelas || '-' }} · {{ labelPeriode }}</p>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" :aria-label="$t('app.close')" @click="detailOpen = false" />
        </div>
        <v-card-text class="p-6 space-y-5">
          <div v-if="detailLoading && !detail" class="py-6"><v-skeleton-loader type="paragraph@2" /></div>
          <template v-else-if="detail">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div v-for="k in kotakRingkasan" :key="k.label" class="rounded-lg border border-slate-200 px-3 py-2.5">
                <p class="text-[11px] text-slate-500">{{ k.label }}</p>
                <p class="text-lg font-bold text-slate-900 tabular-nums">{{ k.nilai }}</p>
              </div>
            </div>

            <div v-if="detail.ringkasan.grade?.grade" class="rounded-lg border border-slate-200 px-4 py-3 flex items-center gap-4">
              <span class="w-11 h-11 rounded-full shrink-0 inline-flex items-center justify-center text-lg font-black" :class="warnaGrade(detail.ringkasan.grade.grade)">
                {{ detail.ringkasan.grade.grade }}
              </span>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-slate-900">{{ $t('monitorLatihan.gradeNilai', { nilai: satuDesimal(detail.ringkasan.grade.nilai) }) }}</p>
                <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">{{ rumusTerisi(detail.ringkasan.grade, detail.aturanGrade) }}</p>
              </div>
            </div>

            <div v-if="detail.flashcard.length">
              <p class="text-sm font-semibold text-slate-900 mb-2">{{ $t('monitorLatihan.flashcardJudul') }}</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="f in detail.flashcard" :key="f.volume" class="rounded-lg border border-slate-200 px-3 py-2.5">
                  <div class="flex items-center justify-between gap-2">
                    <p class="text-sm font-semibold text-slate-900">{{ f.judul }}</p>
                    <p class="text-[11px] text-slate-500 tabular-nums">{{ $t('monitorLatihan.flashcardProgres', { dilihat: f.dilihat, total: f.total, putaran: f.putaran }) }}</p>
                  </div>
                  <p v-if="f.tersulit.length" class="text-[11px] text-slate-500 mt-1.5">{{ $t('monitorLatihan.tersulit') }}</p>
                  <div class="mt-1 flex flex-wrap gap-1">
                    <span
                      v-for="k in f.tersulit"
                      :key="k.kanji"
                      class="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800"
                      lang="ja"
                      :title="k.bacaan"
                    >{{ k.kanji }} <span class="text-[10px] text-slate-500 tabular-nums">{{ (k.ms / 1000).toFixed(1) }}s</span></span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p class="text-sm font-semibold text-slate-900 mb-2">{{ $t('monitorLatihan.sesiJudul') }}</p>
              <p v-if="!detail.sesi.length" class="text-sm text-slate-500">{{ $t('monitorLatihan.sesiKosong') }}</p>
              <div v-else class="overflow-x-auto rounded-lg border border-slate-200">
                <table class="w-full text-left border-collapse joy-table text-sm">
                  <thead>
                    <tr>
                      <th class="px-4 py-2">{{ $t('monitorLatihan.colWaktu') }}</th>
                      <th class="px-3 py-2">{{ $t('monitorLatihan.colAktivitas') }}</th>
                      <th class="px-3 py-2 text-right">{{ $t('monitorLatihan.colWaktuAktif') }}</th>
                      <th class="px-3 py-2 text-right">{{ $t('monitorLatihan.colProgres') }}</th>
                      <th class="px-3 py-2 text-right">{{ $t('monitorLatihan.colSkor') }}</th>
                      <th class="px-4 py-2">{{ $t('monitorLatihan.colStatus') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="s in detail.sesi" :key="s.id">
                      <td class="px-4 py-2 text-xs text-slate-600 whitespace-nowrap">{{ waktuPendek(s.mulaiAt) }}</td>
                      <td class="px-3 py-2">
                        <span class="text-xs font-semibold" :class="warnaTeksJenis(s)">{{ labelJenis(s) }}</span>
                        <span class="text-xs text-slate-600"> · {{ s.materiJudul }}</span>
                      </td>
                      <td class="px-3 py-2 text-right tabular-nums">{{ durasi(s.detikAktif) }}</td>
                      <td class="px-3 py-2 text-right text-xs tabular-nums text-slate-600 whitespace-nowrap">
                        {{ s.jenis === 'flashcard' ? $t('monitorLatihan.nDigeser', { n: s.itemSelesai }) : `${s.itemSelesai}/${s.jumlahItem}` }}
                      </td>
                      <td class="px-3 py-2 text-right tabular-nums">{{ satuDesimal(s.skor) }}</td>
                      <td class="px-4 py-2 text-xs whitespace-nowrap" :class="warnaStatus(s.status)">{{ $t(`monitorLatihan.status.${s.status}`) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';
import PesertaFoto from '../components/PesertaFoto.vue';

const { t, locale } = useI18n();
const appStore = useAppStore();

// The live list refreshes this often while the page is visible; peserta signal about every 15 s.
const REFRESH_LIVE_MS = 10_000;

const tab = ref('live');
const kelasId = ref('all');
const periode = ref('7');
// Today in WIB as YYYY-MM-DD: read each time, so a page left open past midnight moves on.
const hariIni = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
// The day shown with period '1'.
const tanggal = ref(hariIni());
const satuHari = computed(() => periode.value === '1');
const kelasOptions = ref([]);

const liveItems = ref([]);
const liveLoading = ref(false);
const liveDiperbarui = ref(null);
const sekarang = ref(Date.now());
let liveTimer = null;
let jamTimer = null;

const statItems = ref([]);
const statLoading = ref(false);
// Target, weight, grade bands and the first logged day behind the Grade column (server/domain/gradeLatihan.js).
const aturanGrade = ref(null);

const detailOpen = ref(false);
const detailLoading = ref(false);
const detail = ref(null);

function notifyError(err) {
  appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
}

const kelasFilterOptions = computed(() => [
  { value: 'all', label: t('app.all') },
  ...kelasOptions.value.map((k) => ({ value: k.id, label: k.namaKelas })),
]);
const liveTampil = computed(() => liveItems.value.filter((s) => kelasId.value === 'all' || s.kelasId === kelasId.value));
const labelPeriode = computed(() => {
  if (satuHari.value) {
    // Noon WIB of the chosen day, so the weekday never slips to the day before or after.
    const hari = fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${tanggal.value}T12:00:00+07:00`));
    return tanggal.value === hariIni() ? `${t('monitorLatihan.hariIni')} · ${hari}` : hari;
  }
  return t(periode.value === '7' ? 'monitorLatihan.periode7' : periode.value === '30' ? 'monitorLatihan.periode30' : 'monitorLatihan.periodeSemua');
});

/** One day back or forward from the chosen date, never past today. */
function geserHari(n) {
  const [y, m, d] = tanggal.value.split('-').map(Number);
  const baru = new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
  tanggal.value = baru > hariIni() ? hariIni() : baru;
}

/** The period as query parameters for both history requests. */
function paramPeriode() {
  return satuHari.value ? { periode: '1', tanggal: tanggal.value } : { periode: periode.value };
}

// --- formatting -----------------------------------------------------------------------------------------------------

const fmt = (opsi) => new Intl.DateTimeFormat(locale.value === 'ja' ? 'ja-JP' : 'id-ID', { timeZone: 'Asia/Jakarta', ...opsi });
const jamMenit = (iso) => fmt({ hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
const jamDetik = (ms) => fmt({ hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(ms));
const waktuPendek = (iso) => fmt({ day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

function durasi(detik) {
  const d = Math.max(0, Math.floor(detik || 0));
  const jam = Math.floor(d / 3600);
  const menit = Math.floor((d % 3600) / 60);
  const sisa = String(d % 60).padStart(2, '0');
  return jam ? `${jam}:${String(menit).padStart(2, '0')}:${sisa}` : `${menit}:${sisa}`;
}

function durasiJam(detik) {
  const menit = Math.round((detik || 0) / 60);
  return menit >= 60 ? t('monitorLatihan.jamMenit', { jam: Math.floor(menit / 60), menit: menit % 60 }) : t('monitorLatihan.menit', { n: menit });
}

function sinyalLalu(iso) {
  return t('monitorLatihan.detikLalu', { n: Math.max(0, Math.round((sekarang.value - new Date(iso).getTime()) / 1000)) });
}

const JENIS = {
  flashcard: { ikon: 'mdi-cards-outline', warna: 'bg-blue-50 text-blue-800', teks: 'text-blue-800' },
  kanji: { ikon: 'mdi-ideogram-cjk', warna: 'bg-teal-50 text-teal-800', teks: 'text-teal-800' },
  dokkai: { ikon: 'mdi-book-open-variant', warna: 'bg-amber-50 text-amber-800', teks: 'text-amber-800' },
};
const labelJenis = (s) =>
  s.mode === 'resmi'
    ? t(s.jenis === 'kanji' ? 'monitorLatihan.jenisTesKanji' : 'monitorLatihan.jenisTesDokkai')
    : t(`monitorLatihan.jenis${s.jenis.charAt(0).toUpperCase()}${s.jenis.slice(1)}`);
const ikonJenis = (s) => (s.mode === 'resmi' ? 'mdi-form-textbox-password' : JENIS[s.jenis]?.ikon);
const warnaJenis = (s) => (s.mode === 'resmi' ? 'bg-violet-50 text-violet-800' : JENIS[s.jenis]?.warna);
const warnaTeksJenis = (s) => (s.mode === 'resmi' ? 'text-violet-800' : JENIS[s.jenis]?.teks);
const warnaStatus = (status) => (status === 'berjalan' ? 'text-emerald-700 font-semibold' : status === 'selesai' ? 'text-slate-700' : 'text-amber-700');

// Bars share one scale: the most active peserta in the list fills the bar.
const maksDetik = computed(() => Math.max(1, ...statItems.value.map((r) => r.detikAktif)));
const lebarBatang = (detik) => (detik / maksDetik.value) * 100;
const rincianJenis = (r) =>
  [
    `${t('monitorLatihan.jenisFlashcard')} ${durasiJam(r.perJenis.flashcard)}`,
    `${t('monitorLatihan.jenisKanji')} ${durasiJam(r.perJenis.kanji)}`,
    `${t('monitorLatihan.jenisDokkai')} ${durasiJam(r.perJenis.dokkai)}`,
  ].join(' · ');

// --- Grade Latihan ---------------------------------------------------------------------------------------------------

const satuDesimal = (v) =>
  v === null || v === undefined ? '-' : new Intl.NumberFormat(locale.value === 'ja' ? 'ja-JP' : 'id-ID', { maximumFractionDigits: 1 }).format(v);
const WARNA_GRADE = { A: 'bg-emerald-100 text-emerald-800', B: 'bg-blue-100 text-blue-800', C: 'bg-amber-100 text-amber-800', D: 'bg-red-100 text-red-700' };
const warnaGrade = (g) => WARNA_GRADE[g] || 'bg-slate-100 text-slate-600';

/** Hover text of a grade: minutes per day, the two scores and the result. */
function rincianGrade(g) {
  return t(g.skorNilai === null ? 'monitorLatihan.gradeRincianTanpaNilai' : 'monitorLatihan.gradeRincian', {
    menit: satuDesimal(g.menitPerHari),
    sw: satuDesimal(g.skorWaktu),
    sn: satuDesimal(g.skorNilai),
    nilai: satuDesimal(g.nilai),
  });
}

/** The formula with one peserta's numbers filled in, for the detail popup. */
function rumusTerisi(g, a) {
  const isi = {
    bw: a.bobotWaktu,
    bn: 100 - a.bobotWaktu,
    sw: satuDesimal(g.skorWaktu),
    sn: satuDesimal(g.skorNilai),
    menit: satuDesimal(g.menitPerHari),
    hari: g.hari,
    target: a.targetMenitHarian,
  };
  return t(g.skorNilai === null ? 'monitorLatihan.gradeTerisiTanpaNilai' : 'monitorLatihan.gradeTerisi', isi);
}

const barisRumus = computed(() => {
  const a = aturanGrade.value;
  if (!a) return [];
  const mulai = a.mulaiData ? fmt({ day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${a.mulaiData}T12:00:00+07:00`)) : '-';
  return [
    { label: t('monitorLatihan.gradeWaktuLabel'), teks: t('monitorLatihan.gradeWaktuRumus', { target: a.targetMenitHarian, mulai }) },
    { label: t('monitorLatihan.gradeNilaiLabel'), teks: t('monitorLatihan.gradeNilaiRumus') },
    { label: t('monitorLatihan.gradeTotalLabel'), teks: t('monitorLatihan.gradeTotalRumus', { bw: a.bobotWaktu, bn: 100 - a.bobotWaktu }) },
    { label: t('monitorLatihan.colGrade'), teks: t('monitorLatihan.gradeBatasRumus', { a: a.batasGrade?.A ?? 90, b: a.batasGrade?.B ?? 75, c: a.batasGrade?.C ?? 60 }) },
  ];
});

const kotakRingkasan = computed(() => {
  const r = detail.value?.ringkasan;
  if (!r) return [];
  return [
    { label: t('monitorLatihan.colWaktuAktif'), nilai: durasiJam(r.detikAktif) },
    // Within one day the day count is always 0 or 1, so the number of sessions says more.
    satuHari.value ? { label: t('monitorLatihan.colSesi'), nilai: r.jumlahSesi } : { label: t('monitorLatihan.colHari'), nilai: r.hariAktif },
    { label: t('monitorLatihan.colKartu'), nilai: r.kartu },
    { label: t('monitorLatihan.colSoal'), nilai: r.soal },
  ];
});

// --- loading --------------------------------------------------------------------------------------------------------

async function muatLive({ diam = false } = {}) {
  if (!diam) liveLoading.value = true;
  try {
    const res = await apiRequest('/monitor-latihan/live', { diam });
    liveItems.value = res.items || [];
    liveDiperbarui.value = Date.now();
  } catch (err) {
    if (!diam) notifyError(err);
  } finally {
    liveLoading.value = false;
  }
}

// Stepping through days quickly sends several requests; only the newest one may fill the table.
let muatKe = 0;

async function muatStatistik() {
  const nomor = ++muatKe;
  statLoading.value = true;
  try {
    const params = new URLSearchParams({ ...paramPeriode(), kelasId: String(kelasId.value) });
    const res = await apiRequest(`/monitor-latihan/statistik?${params}`);
    if (nomor !== muatKe) return;
    kelasOptions.value = res.kelasOptions || [];
    // Peserta without practice share the last place.
    statItems.value = (res.items || []).map((r) => ({ ...r, peringkatTampil: r.detikAktif ? r.peringkat : '-' }));
    aturanGrade.value = res.aturanGrade || null;
  } catch (err) {
    if (nomor === muatKe) notifyError(err);
  } finally {
    if (nomor === muatKe) statLoading.value = false;
  }
}

async function bukaPeserta(pesertaId) {
  detailOpen.value = true;
  detailLoading.value = true;
  detail.value = null;
  try {
    detail.value = await apiRequest(`/monitor-latihan/peserta/${pesertaId}?${new URLSearchParams(paramPeriode())}`);
  } catch (err) {
    notifyError(err);
    detailOpen.value = false;
  } finally {
    detailLoading.value = false;
  }
}

function jalankanLive() {
  clearInterval(liveTimer);
  liveTimer = setInterval(() => {
    if (tab.value === 'live' && document.visibilityState === 'visible') muatLive({ diam: true });
  }, REFRESH_LIVE_MS);
}

function onVisibility() {
  if (document.visibilityState === 'visible' && tab.value === 'live') muatLive({ diam: true });
}

watch(tab, (v) => {
  if (v === 'live') muatLive({ diam: Boolean(liveDiperbarui.value) });
  else muatStatistik();
});
// A cleared or typed-ahead date goes back to today (the server does the same). Registered first, so the load
// below runs once, with the corrected date.
watch(tanggal, (v) => {
  if (!v || v > hariIni()) tanggal.value = hariIni();
});
watch([periode, kelasId, tanggal], () => {
  if (tab.value === 'riwayat') muatStatistik();
});

onMounted(async () => {
  muatLive();
  // The class list comes with the statistics.
  apiRequest('/monitor-latihan/statistik?periode=7', { diam: true })
    .then((res) => {
      kelasOptions.value = res.kelasOptions || [];
    })
    .catch(() => {});
  jalankanLive();
  jamTimer = setInterval(() => {
    sekarang.value = Date.now();
  }, 1000);
  document.addEventListener('visibilitychange', onVisibility);
});
onBeforeUnmount(() => {
  clearInterval(liveTimer);
  clearInterval(jamTimer);
  document.removeEventListener('visibilitychange', onVisibility);
});
</script>
