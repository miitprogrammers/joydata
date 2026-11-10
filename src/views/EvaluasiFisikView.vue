<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('fisik.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">{{ $t('fisik.subheading') }}</p>
      </div>
      <v-btn color="primary" variant="flat" size="small" prepend-icon="mdi-plus" class="text-none whitespace-nowrap shrink-0" @click="openCreate()">
        {{ $t('fisik.addBtn') }}
      </v-btn>
    </div>

    <!-- Filter bar -->
    <div class="joy-surface p-4">
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div class="sm:col-span-3">
          <v-text-field
            v-model="filterPeriode"
            type="month"
            :label="$t('fisik.filterPeriode')"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="loadData"
          />
        </div>
        <div class="sm:col-span-3">
          <v-select
            v-model="filterKelasId"
            :items="kelasFilterOptions"
            item-title="label"
            item-value="value"
            :label="$t('fisik.filterKelas')"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="loadData"
          />
        </div>
        <div class="sm:col-span-6">
          <v-text-field
            v-model="searchQuery"
            :placeholder="$t('fisik.searchPlaceholder')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
        </div>
      </div>
    </div>

    <!-- This month in numbers -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="joy-surface p-4">
        <div class="text-xs font-medium text-slate-500">{{ $t('fisik.kpiDites') }}</div>
        <div class="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums font-mono">{{ metrics.jumlahDites }}</div>
        <div class="mt-1 text-xs text-slate-500">{{ $t('fisik.kpiDitesDesc', { n: metrics.totalPeserta }) }}</div>
      </div>
      <div class="joy-surface p-4">
        <div class="text-xs font-medium text-slate-500">{{ $t('fisik.kpiRata') }}</div>
        <div class="mt-1.5 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-slate-900 tabular-nums font-mono">{{ metrics.rataNilaiFisik ?? '-' }}</span>
          <span v-if="predikatRata" class="text-sm font-bold" :class="warnaPredikat(predikatRata)">{{ predikatRata }}</span>
        </div>
        <div class="mt-1 text-xs text-slate-500">{{ $t('fisik.kpiRataDesc', { n: metrics.jumlahLengkap }) }}</div>
      </div>
      <div class="joy-surface p-4">
        <div class="text-xs font-medium text-slate-500">{{ $t('fisik.kpiLulus') }}</div>
        <div class="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums font-mono">
          {{ metrics.jumlahLulus }}<span class="text-sm text-slate-400"> / {{ metrics.jumlahLengkap }}</span>
        </div>
        <div class="mt-1 text-xs text-slate-500">{{ $t('fisik.kpiLulusDesc', { kkm: aturan.kkm }) }}</div>
      </div>
    </div>

    <!-- How the scores are computed, with the benchmarks in force -->
    <div class="joy-surface">
      <button type="button" class="w-full px-4 py-3 flex items-center justify-between text-left" @click="caraTerbuka = !caraTerbuka">
        <span class="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <v-icon icon="mdi-calculator-variant-outline" size="18" class="text-slate-500" />{{ $t('fisik.caraPenilaian') }}
        </span>
        <v-icon :icon="caraTerbuka ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="20" class="text-slate-500" />
      </button>
      <div v-if="caraTerbuka" class="px-4 pb-4 space-y-3">
        <p class="text-xs text-slate-600 leading-relaxed">{{ $t('fisik.caraPenilaianDesc', { m: aturan.lintasanM }) }}</p>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse joy-table text-xs">
            <thead>
              <tr>
                <th class="px-3 py-2">{{ $t('fisik.colItem') }}</th>
                <th class="px-3 py-2 whitespace-nowrap">{{ $t('fisik.colLaki') }}</th>
                <th class="px-3 py-2 whitespace-nowrap">{{ $t('fisik.colPerempuan') }}</th>
                <th class="px-3 py-2 text-right">{{ $t('fisik.colBobot') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="k in ITEM_FISIK" :key="k">
                <td class="px-3 py-2 font-medium text-slate-800">{{ $t(`fisik.${k}`) }}</td>
                <td v-for="g in ['L', 'P']" :key="g" class="px-3 py-2 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                  {{ aturan.patokan[k][g].minimal }} → {{ aturan.patokan[k][g].target }} {{ $t(`fisik.satuan.${k}`) }}
                </td>
                <td class="px-3 py-2 text-right font-mono tabular-nums">{{ aturan.bobot[k] }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-[11px] text-slate-500">{{ $t('fisik.caraPredikat', { kkm: aturan.kkm, a: batasGrade.A, b: batasGrade.B, c: batasGrade.C }) }}</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
      <button
        v-for="tb in ['perPeserta', 'semuaTes']"
        :key="tb"
        type="button"
        class="px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap"
        :class="activeTab === tb ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        @click="activeTab = tb"
      >
        {{ tb === 'perPeserta' ? $t('fisik.tabPerPeserta') : $t('fisik.tabSemuaTes') }}
        ({{ tb === 'perPeserta' ? studentSummary.length : items.length }})
      </button>
    </div>

    <div class="joy-surface overflow-hidden">
      <div v-if="loading" class="p-6"><v-skeleton-loader type="table-row-divider@6" /></div>

      <!-- Every roster peserta, tested this month or not -->
      <template v-else-if="activeTab === 'perPeserta'">
        <div v-if="!studentSummary.length" class="p-8 text-center text-sm text-slate-500">{{ $t('app.noData') }}</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse joy-table">
            <thead>
              <tr>
                <th class="px-5 py-3">{{ $t('fisik.colPeserta') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('fisik.colKelas') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('fisik.colJk') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('fisik.colTanggal') }}</th>
                <th class="px-4 py-3 text-right whitespace-nowrap">{{ $t('fisik.nilaiFisik') }}</th>
                <th class="px-5 py-3 text-right whitespace-nowrap">{{ $t('app.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="st in studentSummary" :key="st.pesertaId">
                <td class="px-5 py-2.5">
                  <div class="flex items-center gap-3 min-w-0">
                    <PesertaFoto :src="st.fotoUrl" :nama="st.pesertaNama" :size="32" />
                    <span class="font-semibold text-slate-900 truncate">{{ st.pesertaNama }}</span>
                  </div>
                </td>
                <td class="px-4 py-2.5 text-xs text-slate-700 whitespace-nowrap">{{ st.kelasNama }}</td>
                <td class="px-4 py-2.5 text-xs text-slate-700">{{ st.jenisKelamin || '-' }}</td>
                <td class="px-4 py-2.5 tabular-nums font-mono text-xs text-slate-600 whitespace-nowrap">{{ st.terakhir?.tanggal || '-' }}</td>
                <td class="px-4 py-2.5 text-right whitespace-nowrap">
                  <template v-if="st.terakhir">
                    <span class="font-mono font-bold tabular-nums text-slate-900">{{ st.terakhir.skor.nilaiFisik ?? '-' }}</span>
                    <span v-if="st.terakhir.skor.predikat" class="ml-1.5 text-xs font-bold" :class="warnaPredikat(st.terakhir.skor.predikat)">
                      {{ st.terakhir.skor.predikat }}
                    </span>
                    <span v-if="!st.terakhir.skor.lengkap" class="ml-1.5 text-[11px] text-amber-700">{{ $t('fisik.belumLengkapSingkat') }}</span>
                  </template>
                  <span v-else class="text-xs text-slate-400">{{ $t('fisik.belumDites') }}</span>
                </td>
                <td class="px-5 py-2.5 text-right whitespace-nowrap">
                  <v-btn
                    v-if="st.terakhir"
                    size="x-small"
                    variant="tonal"
                    prepend-icon="mdi-pencil-outline"
                    class="text-none"
                    :aria-label="`${$t('app.edit')} ${st.pesertaNama}`"
                    @click="openEdit(st.terakhir)"
                  >
                    {{ $t('app.edit') }}
                  </v-btn>
                  <v-btn
                    v-else
                    size="x-small"
                    variant="tonal"
                    color="primary"
                    prepend-icon="mdi-plus"
                    class="text-none"
                    :aria-label="`${$t('fisik.addBtn')} ${st.pesertaNama}`"
                    @click="openCreate(st)"
                  >
                    {{ $t('fisik.inputBtn') }}
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Every test of the month -->
      <template v-else>
        <div v-if="!items.length" class="p-10 text-center space-y-3">
          <div class="text-sm text-slate-500">{{ $t('app.noData') }}</div>
          <v-btn color="primary" variant="tonal" size="small" prepend-icon="mdi-plus" class="text-none" @click="openCreate()">
            {{ $t('fisik.addBtn') }}
          </v-btn>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse joy-table">
            <thead>
              <tr>
                <th class="px-5 py-3 whitespace-nowrap">{{ $t('fisik.colTanggal') }}</th>
                <th class="px-4 py-3">{{ $t('fisik.colPeserta') }}</th>
                <th v-for="k in ITEM_FISIK" :key="k" class="px-3 py-3 text-right whitespace-nowrap">{{ $t(`fisik.singkat${kapital(k)}`) }}</th>
                <th class="px-4 py-3 text-right whitespace-nowrap">{{ $t('fisik.nilaiFisik') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('fisik.colPenilai') }}</th>
                <th class="px-5 py-3 text-right whitespace-nowrap">{{ $t('app.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in items" :key="row.id">
                <td class="px-5 py-2.5 tabular-nums font-mono text-xs text-slate-700 whitespace-nowrap">{{ row.tanggal }}</td>
                <td class="px-4 py-2.5">
                  <p class="font-semibold text-slate-900">{{ row.pesertaNama }}</p>
                  <p class="text-[11px] text-slate-500">{{ row.kelasNama }} · {{ row.jenisKelamin }} · {{ $t('fisik.beban', { kg: row.skor.bebanKg }) }}</p>
                </td>
                <td v-for="k in ITEM_FISIK" :key="k" class="px-3 py-2.5 text-right whitespace-nowrap">
                  <p class="font-mono tabular-nums text-sm text-slate-800">{{ hasilSingkat(row, k) }}</p>
                  <p class="font-mono tabular-nums text-[11px]" :class="row.skor.items[k].nilai === null ? 'text-slate-300' : row.skor.items[k].nilai >= 60 ? 'text-slate-500' : 'text-red-600'">
                    {{ row.skor.items[k].nilai ?? '-' }}
                  </p>
                </td>
                <td class="px-4 py-2.5 text-right whitespace-nowrap">
                  <span class="font-mono font-bold tabular-nums text-slate-900">{{ row.skor.nilaiFisik ?? '-' }}</span>
                  <span v-if="row.skor.predikat" class="ml-1.5 text-xs font-bold" :class="warnaPredikat(row.skor.predikat)">{{ row.skor.predikat }}</span>
                </td>
                <td class="px-4 py-2.5 text-xs text-slate-600 whitespace-nowrap">{{ row.penilaiNama }}</td>
                <td class="px-5 py-2.5 text-right whitespace-nowrap">
                  <v-btn icon="mdi-pencil-outline" size="x-small" variant="text" :aria-label="`${$t('app.edit')} ${row.pesertaNama} ${row.tanggal}`" @click="openEdit(row)" />
                  <v-btn
                    icon="mdi-trash-can-outline"
                    size="x-small"
                    variant="text"
                    color="error"
                    :aria-label="`${$t('app.delete')} ${row.pesertaNama} ${row.tanggal}`"
                    @click="askDelete(row)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>

    <!-- One peserta: the four results, scored while typing -->
    <v-dialog v-model="dialogOpen" max-width="620" scrollable>
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 font-semibold text-slate-900 font-display">
          {{ editingId ? $t('fisik.editTitle') : $t('fisik.addBtn') }}
        </div>
        <v-card-text class="pa-6 space-y-4">
          <v-autocomplete
            v-model="form.pesertaId"
            :items="rosterSelectItems"
            item-title="label"
            item-value="value"
            :label="$t('fisik.colPeserta')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            @update:model-value="onStudentSelected"
          />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <v-select
              v-model="form.kelasId"
              :items="kelasSelectItems"
              item-title="label"
              item-value="value"
              :label="$t('fisik.colKelas')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
            <v-text-field
              v-model="form.tanggal"
              type="date"
              :label="$t('fisik.colTanggal')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>

          <!-- Gender decides the benchmarks and the sack weight; Mancation's value wins when it has one -->
          <div class="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs">
            <template v-if="jkMancation">
              <span class="font-semibold text-slate-800">{{ labelJk(jkMancation) }}</span>
              <span class="text-slate-500"> · {{ $t('fisik.beban', { kg: BEBAN_KARUNG_KG[jkMancation] }) }} · {{ $t('fisik.dariMancation') }}</span>
            </template>
            <template v-else>
              <p class="text-amber-800 mb-2">{{ $t('fisik.jkPilih') }}</p>
              <div class="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                <button
                  v-for="g in ['L', 'P']"
                  :key="g"
                  type="button"
                  class="px-4 py-1 text-xs font-semibold rounded-md transition-colors"
                  :class="form.jenisKelamin === g ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
                  @click="form.jenisKelamin = g"
                >
                  {{ labelJk(g) }} · {{ BEBAN_KARUNG_KG[g] }} kg
                </button>
              </div>
            </template>
          </div>

          <div class="space-y-3">
            <div class="grid grid-cols-[1fr_auto] gap-3 items-center">
              <v-text-field
                v-model="form.pushUp"
                type="number"
                min="0"
                :label="$t('fisik.pushUp')"
                :suffix="$t('fisik.satuan.pushUp')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <span class="nilai-chip" :class="warnaNilai(pratinjau.items.pushUp.nilai)">{{ pratinjau.items.pushUp.nilai ?? '-' }}</span>
            </div>
            <div class="grid grid-cols-[1fr_auto] gap-3 items-center">
              <div class="grid grid-cols-2 gap-2">
                <v-text-field
                  v-model="form.plankMenit"
                  type="number"
                  min="0"
                  :label="`${$t('fisik.plank')} · ${$t('fisik.menit')}`"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
                <v-text-field
                  v-model="form.plankDetik"
                  type="number"
                  min="0"
                  max="59"
                  :label="$t('fisik.detik')"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
              </div>
              <span class="nilai-chip" :class="warnaNilai(pratinjau.items.plank.nilai)">{{ pratinjau.items.plank.nilai ?? '-' }}</span>
            </div>
            <div class="grid grid-cols-[1fr_auto] gap-3 items-center">
              <v-text-field
                v-model="form.sitUp"
                type="number"
                min="0"
                :label="$t('fisik.sitUp')"
                :suffix="$t('fisik.satuan.sitUp')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <span class="nilai-chip" :class="warnaNilai(pratinjau.items.sitUp.nilai)">{{ pratinjau.items.sitUp.nilai ?? '-' }}</span>
            </div>
            <div class="grid grid-cols-[1fr_auto] gap-3 items-start">
              <v-text-field
                v-model="form.karungBolakBalik"
                type="number"
                min="0"
                step="0.5"
                :label="$t('fisik.karung')"
                :suffix="$t('fisik.satuanBolakBalik')"
                :hint="$t('fisik.karungHint', { m: lintasanForm, kg: pratinjau.bebanKg || '-' })"
                persistent-hint
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <span class="nilai-chip mt-2" :class="warnaNilai(pratinjau.items.karung.nilai)">{{ pratinjau.items.karung.nilai ?? '-' }}</span>
            </div>
          </div>

          <div class="rounded-lg border px-4 py-3 flex items-center justify-between" :class="pratinjau.nilaiFisik === null ? 'border-slate-200' : pratinjau.lulusKkm ? 'border-emerald-200 bg-emerald-50/50' : 'border-red-200 bg-red-50/50'">
            <span class="text-sm font-semibold text-slate-800">{{ $t('fisik.nilaiFisik') }}</span>
            <span v-if="pratinjau.nilaiFisik !== null" class="font-mono tabular-nums">
              <span class="text-xl font-bold text-slate-900">{{ pratinjau.nilaiFisik }}</span>
              <span class="ml-2 font-bold" :class="warnaPredikat(pratinjau.predikat)">{{ pratinjau.predikat }}</span>
              <span class="ml-2 text-xs font-sans" :class="pratinjau.lulusKkm ? 'text-emerald-700' : 'text-red-600'">
                {{ pratinjau.lulusKkm ? $t('fisik.lulusKkm', { kkm: pratinjau.kkm }) : $t('fisik.bawahKkm', { kkm: pratinjau.kkm }) }}
              </span>
            </span>
            <span v-else class="text-xs text-slate-400 italic">{{ $t('fisik.belumLengkap') }}</span>
          </div>

          <v-textarea
            v-model="form.catatan"
            rows="2"
            :label="$t('fisik.colCatatan')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
          <p class="text-[11px] text-slate-500">{{ $t('fisik.aturanTes') }}</p>
        </v-card-text>
        <div class="px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
          <v-btn variant="text" class="text-none" @click="dialogOpen = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" class="text-none" :loading="saving" @click="submitForm">{{ $t('app.save') }}</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card class="pa-5 rounded-xl">
        <div class="text-base font-semibold text-slate-900 mb-1">{{ deleteTarget?.pesertaNama }} ({{ deleteTarget?.tanggal }})</div>
        <p class="text-sm text-slate-600 mb-5">{{ $t('fisik.konfirmasiHapus') }}</p>
        <div class="flex justify-end gap-2">
          <v-btn variant="text" class="text-none" @click="deleteDialog = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="error" variant="flat" class="text-none" :loading="saving" @click="confirmDelete">{{ $t('app.delete') }}</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';
import PesertaFoto from '../components/PesertaFoto.vue';
// The same formula as the server, so the preview is exactly what the rapor will show.
import { ITEM_FISIK, BEBAN_KARUNG_KG, DEFAULT_EVALUASI_FISIK, hitungNilaiFisik, formatDetik } from '@/server/domain/evaluasiFisik.js';

const { t } = useI18n();
const appStore = useAppStore();

const hariIniWib = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());

const loading = ref(true);
const saving = ref(false);
const activeTab = ref('perPeserta');
const caraTerbuka = ref(false);

const filterPeriode = ref(hariIniWib().slice(0, 7));
const filterKelasId = ref('all');
const searchQuery = ref('');

const aturan = ref(DEFAULT_EVALUASI_FISIK);
const batasGrade = ref({ A: 90, B: 75, C: 60 });
const metrics = ref({ totalPeserta: 0, jumlahDites: 0, jumlahTes: 0, rataNilaiFisik: null, jumlahLengkap: 0, jumlahLulus: 0 });
const semuaPeserta = ref([]);
const semuaTes = ref([]);
const kelasOptions = ref([]);
const rosterOptions = ref([]);

const dialogOpen = ref(false);
const editingId = ref(null);
// Track length of the record being edited (kept from its test day); new tests use the one in Pengaturan.
const lintasanEdit = ref(null);
const kosongForm = () => ({
  pesertaId: null,
  kelasId: null,
  tanggal: hariIniWib(),
  jenisKelamin: '',
  pushUp: '',
  plankMenit: '',
  plankDetik: '',
  sitUp: '',
  karungBolakBalik: '',
  catatan: '',
});
const form = ref(kosongForm());

const deleteDialog = ref(false);
const deleteTarget = ref(null);

const kelasFilterOptions = computed(() => [
  { value: 'all', label: t('app.all') },
  ...kelasOptions.value.map((k) => ({ value: k.id, label: k.namaKelas })),
]);
const kelasSelectItems = computed(() => kelasOptions.value.map((k) => ({ value: k.id, label: k.namaKelas })));
const rosterSelectItems = computed(() =>
  rosterOptions.value.map((p) => ({ value: p.id, label: `${p.nama} (${p.namaKelas || '-'})` }))
);

const cari = (nama) => {
  const q = String(searchQuery.value || '').trim().toLowerCase();
  return !q || String(nama || '').toLowerCase().includes(q);
};
const studentSummary = computed(() => semuaPeserta.value.filter((s) => cari(s.pesertaNama)));
const items = computed(() => semuaTes.value.filter((r) => cari(r.pesertaNama)));

const predikatRata = computed(() => {
  const v = metrics.value.rataNilaiFisik;
  if (v === null || v === undefined) return null;
  const b = batasGrade.value;
  return v >= b.A ? 'A' : v >= b.B ? 'B' : v >= b.C ? 'C' : 'D';
});

// --- the form ---------------------------------------------------------------------------------------------------

const jkMancation = computed(() => rosterOptions.value.find((p) => Number(p.id) === Number(form.value.pesertaId))?.jenisKelamin || '');
const lintasanForm = computed(() => lintasanEdit.value ?? aturan.value.lintasanM);

/** Plank minutes + seconds as seconds; '' when both are empty. */
function plankDetikForm() {
  const { plankMenit, plankDetik } = form.value;
  if (plankMenit === '' && plankDetik === '') return '';
  return (Number(plankMenit) || 0) * 60 + (Number(plankDetik) || 0);
}

const pratinjau = computed(() =>
  hitungNilaiFisik(
    {
      jenisKelamin: jkMancation.value || form.value.jenisKelamin,
      pushUp: form.value.pushUp,
      plankDetik: plankDetikForm(),
      sitUp: form.value.sitUp,
      karungBolakBalik: form.value.karungBolakBalik,
      lintasanM: lintasanForm.value,
    },
    { evaluasi_fisik: aturan.value, batas_grade: batasGrade.value }
  )
);

function onStudentSelected(pesertaId) {
  const found = rosterOptions.value.find((p) => Number(p.id) === Number(pesertaId));
  if (found?.kelasId) form.value.kelasId = found.kelasId;
}

function defaultTanggal() {
  const today = hariIniWib();
  return today.startsWith(filterPeriode.value) ? today : `${filterPeriode.value}-01`;
}

function openCreate(preset = null) {
  editingId.value = null;
  lintasanEdit.value = null;
  const pertama =
    preset ||
    (filterKelasId.value !== 'all' ? rosterOptions.value.find((p) => Number(p.kelasId) === Number(filterKelasId.value)) : null);
  form.value = {
    ...kosongForm(),
    pesertaId: preset ? preset.pesertaId : pertama?.id || null,
    kelasId: preset ? preset.kelasId : pertama?.kelasId || (filterKelasId.value !== 'all' ? Number(filterKelasId.value) : null),
    tanggal: defaultTanggal(),
  };
  dialogOpen.value = true;
}

function openEdit(row) {
  editingId.value = row.id;
  lintasanEdit.value = row.lintasanM ?? null;
  const kosongBila = (v) => (v === null || v === undefined ? '' : v);
  form.value = {
    pesertaId: row.pesertaId,
    kelasId: row.kelasId,
    tanggal: row.tanggal,
    jenisKelamin: row.jenisKelamin || '',
    pushUp: kosongBila(row.pushUp),
    plankMenit: row.plankDetik === null || row.plankDetik === undefined ? '' : Math.floor(row.plankDetik / 60),
    plankDetik: row.plankDetik === null || row.plankDetik === undefined ? '' : row.plankDetik % 60,
    sitUp: kosongBila(row.sitUp),
    karungBolakBalik: kosongBila(row.karungBolakBalik),
    catatan: row.catatan || '',
  };
  dialogOpen.value = true;
}

// --- loading and saving -----------------------------------------------------------------------------------------

function notifyError(err) {
  const key = `messages.${err.code}`;
  appStore.notify(t(key) !== key ? t(key) : t('messages.GENERIC_ERROR'), 'error');
}

async function loadData() {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (filterPeriode.value) params.set('periode', filterPeriode.value);
    if (filterKelasId.value !== 'all') params.set('kelasId', String(filterKelasId.value));
    const res = await apiRequest(`/evaluasi-fisik?${params}`);
    aturan.value = res.aturan || DEFAULT_EVALUASI_FISIK;
    batasGrade.value = res.batasGrade || batasGrade.value;
    metrics.value = res.metrics || metrics.value;
    semuaPeserta.value = res.studentSummary || [];
    semuaTes.value = res.items || [];
    kelasOptions.value = res.kelasOptions || [];
    rosterOptions.value = res.rosterOptions || [];
  } catch (err) {
    notifyError(err);
  } finally {
    loading.value = false;
  }
}

async function submitForm() {
  saving.value = true;
  try {
    const body = {
      pesertaId: form.value.pesertaId,
      kelasId: form.value.kelasId,
      tanggal: form.value.tanggal,
      jenisKelamin: jkMancation.value || form.value.jenisKelamin,
      pushUp: form.value.pushUp,
      plankDetik: plankDetikForm(),
      sitUp: form.value.sitUp,
      karungBolakBalik: form.value.karungBolakBalik,
      catatan: String(form.value.catatan || '').trim(),
    };
    if (editingId.value) await apiRequest(`/evaluasi-fisik/${editingId.value}`, { method: 'PATCH', body });
    else await apiRequest('/evaluasi-fisik', { method: 'POST', body });
    dialogOpen.value = false;
    appStore.notify(t('messages.saved'), 'success');
    if (/^\d{4}-\d{2}/.test(body.tanggal || '')) filterPeriode.value = body.tanggal.slice(0, 7);
    await loadData();
  } catch (err) {
    notifyError(err);
  } finally {
    saving.value = false;
  }
}

function askDelete(row) {
  deleteTarget.value = row;
  deleteDialog.value = true;
}

async function confirmDelete() {
  if (!deleteTarget.value) return;
  saving.value = true;
  try {
    await apiRequest(`/evaluasi-fisik/${deleteTarget.value.id}`, { method: 'DELETE' });
    deleteDialog.value = false;
    appStore.notify(t('messages.deleted'), 'success');
    await loadData();
  } catch (err) {
    notifyError(err);
  } finally {
    saving.value = false;
  }
}

// --- formatting -------------------------------------------------------------------------------------------------

const kapital = (k) => k.charAt(0).toUpperCase() + k.slice(1);
const labelJk = (g) => (g === 'P' ? t('fisik.perempuan') : t('fisik.lakiLaki'));

function hasilSingkat(row, k) {
  if (k === 'plank') return formatDetik(row.plankDetik);
  if (k === 'karung') return row.karungBolakBalik ?? '-';
  return row[k] ?? '-';
}

function warnaPredikat(p) {
  if (p === 'A') return 'text-emerald-700';
  if (p === 'B') return 'text-sky-700';
  if (p === 'C') return 'text-amber-700';
  return 'text-red-600';
}

function warnaNilai(n) {
  if (n === null || n === undefined) return 'bg-slate-100 text-slate-400';
  return n >= 60 ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700';
}

onMounted(loadData);
</script>

<style scoped>
.nilai-chip {
  min-width: 3.25rem;
  padding: 0.35rem 0.5rem;
  border-radius: 0.5rem;
  text-align: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-weight: 700;
  font-size: 0.85rem;
}
</style>
