<template>
  <div class="space-y-5">
    <!-- Header & controls (not printed) -->
    <div class="no-print flex flex-wrap items-start justify-between gap-4">
      <div>
        <router-link to="/nilai-ujian" class="text-xs font-medium text-primary inline-flex items-center gap-1">
          <v-icon icon="mdi-arrow-left" size="14" />
          {{ $t('cetakUjian.kembali') }}
        </router-link>
        <h1 class="text-2xl font-bold text-slate-900 font-display mt-1">{{ $t('cetakUjian.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">{{ $t('cetakUjian.subheading') }}</p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-printer"
        class="text-none whitespace-nowrap shrink-0"
        :disabled="!hasil || !hasil.peserta.length"
        @click="cetak"
      >
        {{ $t('cetakUjian.cetakPdf') }}
      </v-btn>
    </div>

    <div class="no-print joy-surface p-4">
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div class="sm:col-span-4">
          <v-select
            v-model="kelasId"
            :items="kelasItems"
            item-title="label"
            item-value="value"
            :label="$t('cetakUjian.pilihKelas')"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="onKelasChange"
          />
        </div>
        <div class="sm:col-span-8">
          <v-autocomplete
            v-model="kode"
            :items="kodeItems"
            item-title="label"
            item-value="value"
            :label="$t('cetakUjian.pilihKode')"
            :no-data-text="$t('cetakUjian.belumAdaKode')"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="loadHasil"
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="no-print joy-surface p-12 text-center text-slate-500">
      <v-progress-circular indeterminate color="primary" size="32" />
    </div>
    <div v-else-if="!hasil" class="no-print joy-surface p-12 text-center text-sm text-slate-500">
      {{ $t('cetakUjian.pilihDulu') }}
    </div>

    <!-- PRINTABLE SHEET (A4) -->
    <div
      v-else
      id="hasil-ujian-print"
      class="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-4xl mx-auto space-y-5"
    >
      <!-- Letterhead -->
      <div class="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
        <div>
          <div class="text-xs font-bold text-slate-500 tracking-widest uppercase">LPK MIZUNO SEMANGAT BANGSA</div>
          <h2 class="text-xl font-black text-slate-900 tracking-tight font-display">CABANG JOY · JOYdata</h2>
        </div>
        <div class="text-right">
          <div class="text-base font-black text-slate-900 tracking-wide">{{ $t('cetakUjian.judul') }}</div>
          <div class="text-sm font-bold font-mono text-slate-800">{{ hasil.codeUjian }}</div>
          <div class="text-[10px] text-slate-400 mt-0.5">{{ $t('cetakUjian.tglCetak') }}: {{ tanggalCetak }}</div>
        </div>
      </div>

      <!-- Identity -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div>
          <div class="text-[11px] text-slate-500">{{ $t('cetakUjian.kelas') }}</div>
          <div class="font-bold text-slate-900 mt-0.5">{{ labelKelas }}</div>
          <div v-if="programNama" class="text-[10px] text-slate-500">{{ programNama }}</div>
        </div>
        <div>
          <div class="text-[11px] text-slate-500">{{ $t('cetakUjian.tanggal') }}</div>
          <div class="font-bold text-slate-900 mt-0.5">{{ labelTanggal }}</div>
        </div>
        <div>
          <div class="text-[11px] text-slate-500">{{ $t('cetakUjian.sensei') }}</div>
          <div class="font-bold text-slate-900 mt-0.5">{{ hasil.kelas?.senseiNama || '-' }}</div>
        </div>
        <div>
          <div class="text-[11px] text-slate-500">{{ $t('cetakUjian.kkm') }}</div>
          <div class="font-bold text-slate-900 mt-0.5 font-mono">{{ hasil.kkm }}</div>
        </div>
      </div>

      <!-- Summary -->
      <div class="grid grid-cols-4 gap-2 text-center">
        <div class="border border-slate-200 rounded py-1.5 px-2">
          <div class="text-[10px] text-slate-500">{{ $t('cetakUjian.jumlahPeserta') }}</div>
          <div class="text-base font-bold font-mono text-slate-900">{{ hasil.ringkasan.jumlahPeserta }}</div>
        </div>
        <div class="border border-slate-200 rounded py-1.5 px-2">
          <div class="text-[10px] text-slate-500">{{ $t('cetakUjian.rataRata') }}</div>
          <div class="text-base font-bold font-mono text-slate-900">{{ fmt(hasil.ringkasan.rataRata) }}</div>
        </div>
        <div class="border border-slate-200 rounded py-1.5 px-2">
          <div class="text-[10px] text-slate-500">{{ $t('cetakUjian.lulus') }}</div>
          <div class="text-base font-bold font-mono text-emerald-700">{{ hasil.ringkasan.lulus }}</div>
        </div>
        <div class="border border-slate-200 rounded py-1.5 px-2">
          <div class="text-[10px] text-slate-500">{{ $t('cetakUjian.tidakLulus') }}</div>
          <div class="text-base font-bold font-mono text-red-700">{{ hasil.ringkasan.tidakLulus }}</div>
        </div>
      </div>

      <!-- Results, highest average first -->
      <table class="hasil-tabel w-full text-xs border-collapse">
        <thead>
          <tr>
            <th class="w-8 text-center">{{ $t('cetakUjian.colNo') }}</th>
            <th class="text-left">{{ $t('cetakUjian.colNama') }}</th>
            <th class="text-left">{{ $t('cetakUjian.colKelas') }}</th>
            <th class="text-right">{{ $t('cetakUjian.colMojiGoi') }}</th>
            <th class="text-right">{{ $t('cetakUjian.colBunpou') }}</th>
            <th class="text-right">{{ $t('cetakUjian.colChoukai') }}</th>
            <th class="text-right">{{ $t('cetakUjian.colRata') }}</th>
            <th class="text-center">{{ $t('cetakUjian.colStatus') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in hasil.peserta" :key="`${p.pesertaId}-${p.kelasId}`">
            <td class="text-center font-mono text-slate-500">{{ i + 1 }}</td>
            <td class="font-semibold text-slate-900">{{ p.nama }}</td>
            <td class="text-slate-700 whitespace-nowrap">{{ p.kelasNama }}</td>
            <td class="text-right font-mono">{{ fmt(p.nilaiMojiGoi) }}</td>
            <td class="text-right font-mono">{{ fmt(p.nilaiBunpou) }}</td>
            <td class="text-right font-mono">{{ fmt(p.nilaiChoukai) }}</td>
            <td class="text-right font-mono font-bold text-slate-900">{{ fmt(p.nilaiRata) }}</td>
            <td class="text-center font-semibold whitespace-nowrap">
              <span v-if="p.lulus === null" class="text-slate-400">-</span>
              <span v-else-if="p.lulus" class="text-emerald-700">{{ $t('cetakUjian.lulus') }}</span>
              <span v-else class="text-red-700">{{ $t('cetakUjian.tidakLulus') }}</span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-right font-semibold text-slate-700">{{ $t('cetakUjian.rataKelas') }}</td>
            <td class="text-right font-mono font-semibold">{{ fmt(hasil.ringkasan.rataBagian.nilaiMojiGoi) }}</td>
            <td class="text-right font-mono font-semibold">{{ fmt(hasil.ringkasan.rataBagian.nilaiBunpou) }}</td>
            <td class="text-right font-mono font-semibold">{{ fmt(hasil.ringkasan.rataBagian.nilaiChoukai) }}</td>
            <td class="text-right font-mono font-bold text-slate-900">{{ fmt(hasil.ringkasan.rataRata) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <p class="text-[10px] text-slate-500">{{ $t('cetakUjian.keterangan', { kkm: hasil.kkm }) }}</p>

      <!-- Signatures -->
      <div class="hasil-ttd pt-6 grid grid-cols-2 gap-10 text-center text-xs">
        <div>
          <div class="text-[11px] text-slate-500 mb-14">{{ $t('cetakUjian.ttdSensei') }}</div>
          <div class="font-bold text-slate-900 border-t border-slate-300 pt-1.5">
            {{ hasil.kelas?.senseiNama || '( ........................................ )' }}
          </div>
        </div>
        <div>
          <div class="text-[11px] text-slate-500 mb-14">{{ $t('cetakUjian.ttdKepala') }}</div>
          <div class="font-bold text-slate-900 border-t border-slate-300 pt-1.5">Mizuno Semangat Bangsa</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Cetak Hasil Ujian: one exam code for one class (or every class that took it), highest average first, printed to
// PDF through the browser's print dialog like the Rapor. Same page access as Rekap Nilai Ujian.
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';

const route = useRoute();
const router = useRouter();
const { t, locale } = useI18n();
const appStore = useAppStore();

const SEMUA = 'all';
const loading = ref(false);
const kelasOptions = ref([]);
const daftarKode = ref([]);
const kelasId = ref(null);
const kode = ref(null);
const hasil = ref(null);

const bahasa = computed(() => (locale.value === 'ja' ? 'ja-JP' : 'id-ID'));

// Only classes that have at least one exam score.
const kelasItems = computed(() => {
  const ada = new Set(daftarKode.value.map((k) => k.kelasId));
  return [
    { value: SEMUA, label: t('cetakUjian.semuaKelas') },
    ...kelasOptions.value
      .filter((k) => ada.has(Number(k.id)))
      .map((k) => ({ value: Number(k.id), label: k.namaKelas }))
      .sort((a, b) => a.label.localeCompare(b.label, 'id', { numeric: true })),
  ];
});

// The codes of the picked class; for all classes, one entry per code with the classes added together.
const kodeItems = computed(() => {
  const grup = new Map();
  for (const k of daftarKode.value) {
    if (kelasId.value !== SEMUA && k.kelasId !== kelasId.value) continue;
    const g = grup.get(k.codeUjian) || { kode: k.codeUjian, tanggal: k.tanggalAwal, jumlah: 0, kelas: 0 };
    g.tanggal = !g.tanggal || (k.tanggalAwal && k.tanggalAwal < g.tanggal) ? k.tanggalAwal : g.tanggal;
    g.jumlah += k.jumlahPeserta;
    g.kelas += 1;
    grup.set(k.codeUjian, g);
  }
  return [...grup.values()]
    .sort((a, b) => String(b.tanggal || '').localeCompare(String(a.tanggal || '')) || a.kode.localeCompare(b.kode))
    .map((g) => ({
      value: g.kode,
      label: [
        g.kode,
        g.tanggal || '-',
        t('cetakUjian.jumlahItem', { n: g.jumlah }),
        kelasId.value === SEMUA ? t('cetakUjian.kelasJumlah', { n: g.kelas }) : null,
      ]
        .filter(Boolean)
        .join(' · '),
    }));
});

const labelKelas = computed(() => {
  if (!hasil.value) return '';
  if (hasil.value.kelas) return hasil.value.kelas.namaKelas;
  return `${t('cetakUjian.semuaKelas')} (${t('cetakUjian.kelasJumlah', { n: hasil.value.ringkasan.jumlahKelas })})`;
});

const programNama = computed(() => {
  const k = hasil.value?.kelas;
  if (!k) return '';
  return locale.value === 'ja' ? k.programNamaJa || k.programNamaId : k.programNamaId;
});

function tanggalPanjang(iso) {
  if (!iso) return '-';
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(bahasa.value, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

const labelTanggal = computed(() => {
  const h = hasil.value;
  if (!h || !h.tanggalAwal) return '-';
  if (h.tanggalAwal === h.tanggalAkhir) return tanggalPanjang(h.tanggalAwal);
  return `${tanggalPanjang(h.tanggalAwal)} – ${tanggalPanjang(h.tanggalAkhir)}`;
});

const tanggalCetak = computed(() =>
  new Date().toLocaleDateString(bahasa.value, { year: 'numeric', month: 'long', day: 'numeric' })
);

function fmt(v) {
  if (v === null || v === undefined) return '-';
  return Number(v).toLocaleString(bahasa.value, { maximumFractionDigits: 2 });
}

function notifyError(err) {
  const key = `messages.${err?.code}`;
  appStore.notify(t(key) !== key ? t(key) : t('messages.GENERIC_ERROR'), 'error');
}

function syncQuery() {
  const query = {};
  if (kelasId.value !== null) query.kelasId = String(kelasId.value);
  if (kode.value) query.kode = kode.value;
  router.replace({ query });
}

async function loadHasil() {
  syncQuery();
  if (!kode.value) {
    hasil.value = null;
    return;
  }
  loading.value = true;
  try {
    const params = new URLSearchParams({ kode: kode.value });
    if (kelasId.value !== SEMUA) params.set('kelasId', String(kelasId.value));
    hasil.value = await apiRequest(`/nilai-ujian/cetak?${params.toString()}`);
  } catch (err) {
    hasil.value = null;
    notifyError(err);
  } finally {
    loading.value = false;
  }
}

// A new class keeps the picked code when that class has it too, otherwise takes its newest code.
function onKelasChange() {
  const ada = kodeItems.value.some((k) => k.value === kode.value);
  if (!ada) kode.value = kodeItems.value[0]?.value || null;
  loadHasil();
}

// The PDF file name comes from the page title, so name it after the exam while the dialog is open.
function cetak() {
  const judulLama = document.title;
  const kelas = hasil.value?.kelas?.namaKelas || t('cetakUjian.semuaKelas');
  document.title = `${t('cetakUjian.judulFile')} ${hasil.value?.codeUjian} - ${kelas}`;
  const pulihkan = () => {
    document.title = judulLama;
    window.removeEventListener('afterprint', pulihkan);
  };
  window.addEventListener('afterprint', pulihkan);
  window.print();
}

onMounted(async () => {
  loading.value = true;
  try {
    const res = await apiRequest('/nilai-ujian/cetak/kode');
    kelasOptions.value = res.kelasOptions || [];
    daftarKode.value = res.kode || [];
  } catch (err) {
    notifyError(err);
  } finally {
    loading.value = false;
  }

  const qKelas = route.query.kelasId;
  const pilihan = kelasItems.value.map((k) => k.value);
  const dariQuery = qKelas === SEMUA ? SEMUA : Number(qKelas);
  kelasId.value = pilihan.includes(dariQuery) ? dariQuery : pilihan[1] ?? SEMUA;
  const qKode = String(route.query.kode || '');
  kode.value = kodeItems.value.some((k) => k.value === qKode) ? qKode : kodeItems.value[0]?.value || null;
  await loadHasil();
});
</script>

<style>
.hasil-tabel th,
.hasil-tabel td {
  border: 1px solid #cbd5e1;
  padding: 5px 8px;
}

.hasil-tabel thead th {
  background: #f1f5f9;
  font-weight: 700;
  color: #0f172a;
  font-size: 11px;
}

.hasil-tabel tfoot td {
  background: #f8fafc;
}

@media print {
  .no-print,
  .v-navigation-drawer,
  .v-app-bar,
  .v-snackbar,
  .joy-page-preloader,
  header,
  nav,
  footer {
    display: none !important;
  }

  .v-main {
    padding: 0 !important;
  }

  .v-application__wrap {
    min-height: 0 !important;
  }

  html,
  body,
  .v-application,
  .v-main {
    background: white !important;
  }

  #hasil-ujian-print {
    max-width: 100% !important;
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    /* A class of ~25 peserta with the signatures on one A4 page; zoom (unlike transform) also shrinks the layout
       used for page breaks. */
    zoom: 0.85;
  }

  #hasil-ujian-print .hasil-tabel th,
  #hasil-ujian-print .hasil-tabel td {
    padding: 3px 8px;
  }

  #hasil-ujian-print .hasil-ttd .mb-14 {
    margin-bottom: 2.5rem;
  }

  /* A long class runs over several pages: rows stay whole, the header row repeats, the signatures stay together. */
  #hasil-ujian-print tr,
  #hasil-ujian-print .hasil-ttd {
    break-inside: avoid;
  }

  #hasil-ujian-print thead {
    display: table-header-group;
  }

  /* The average row once, at the end, instead of repeating at the foot of every page. */
  #hasil-ujian-print tfoot {
    display: table-row-group;
  }

  /* @page is global: same as the Rapor and Smart Report, so printing those does not change. */
  @page {
    size: A4 portrait;
    margin: 1cm 1.2cm;
  }
}
</style>
