<template>
  <div class="min-h-screen bg-slate-50">
    <header class="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200">
      <div class="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="text-base font-bold text-slate-900 font-display leading-tight">JOYdata</p>
          <p class="text-[11px] text-slate-500 leading-tight">{{ $t('portal.title') }}</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="inline-flex items-center bg-slate-200/70 p-0.5 rounded-lg">
            <button
              v-for="lang in ['id', 'ja']"
              :key="lang"
              type="button"
              class="px-2 py-1 text-xs font-medium rounded-md transition-colors"
              :class="locale === lang ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              @click="switchLang(lang)"
            >
              {{ lang === 'id' ? 'ID' : '日本語' }}
            </button>
          </div>
          <v-menu v-if="peserta" location="bottom end">
            <template #activator="{ props: menuProps }">
              <v-btn v-bind="menuProps" icon="mdi-account-circle-outline" variant="text" size="small" :aria-label="peserta.nama" />
            </template>
            <v-list density="compact" min-width="200">
              <v-list-item :subtitle="peserta.email" :title="peserta.nama" />
              <v-divider />
              <v-list-item
                v-if="!peserta.wajibGantiSandi"
                prepend-icon="mdi-lock-reset"
                :title="$t('portal.gantiSandi')"
                @click="passwordDialog = true"
              />
              <v-list-item prepend-icon="mdi-logout" :title="$t('portal.keluar')" @click="logout" />
            </v-list>
          </v-menu>
        </div>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-5 space-y-4">
      <div v-if="loading" class="py-20 flex justify-center" role="status" :aria-label="$t('app.loading')">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <div v-else-if="loadError" class="joy-surface p-6 text-center space-y-3">
        <p class="text-sm text-slate-700">{{ $t('portal.gagalMuat') }}</p>
        <v-btn variant="tonal" color="primary" class="text-none" @click="load">{{ $t('common.cobaLagi') }}</v-btn>
      </div>

      <!-- First login: the birth-date password must be replaced before anything else is shown -->
      <section v-else-if="peserta?.wajibGantiSandi" class="joy-surface p-6 max-w-md mx-auto">
        <h1 class="text-lg font-bold text-slate-900 font-display">{{ $t('portal.gantiSandiTitle') }}</h1>
        <p class="text-sm text-slate-600 mt-1 mb-4">{{ $t('portal.gantiSandiDesc') }}</p>
        <PortalPasswordForm @saved="onPasswordSaved" />
      </section>

      <template v-else-if="report">
        <section class="joy-surface p-5">
          <h1 class="text-xl font-bold text-slate-900 font-display">{{ $t('portal.halo', { nama: report.peserta.nama }) }}</h1>
          <p class="text-sm text-slate-600 mt-1">
            {{ [report.kelas?.namaKelas, locale === 'ja' ? report.kelas?.programNamaJa : report.kelas?.programNama].filter(Boolean).join(' · ') }}
          </p>
          <p class="text-xs text-slate-500 mt-0.5">
            <span v-if="report.kelas?.senseiNama && report.kelas.senseiNama !== '-'">{{ report.kelas.senseiNama }} 先生 · </span>
            <span v-if="report.peserta.tanggalMasuk">{{ $t('portal.mulaiBelajar', { tanggal: tanggal(report.peserta.tanggalMasuk) }) }}</span>
          </p>
        </section>

        <!-- KPI tiles -->
        <section class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="joy-surface p-4">
            <p class="text-xs font-medium text-slate-500">{{ $t('portal.rataUjian') }}</p>
            <p class="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {{ num(report.kpi.rataUjian) }}<span v-if="report.kpi.rataUjian !== null" class="text-sm font-semibold text-slate-500"> {{ report.kpi.gradeUjian }}</span>
            </p>
            <p v-if="report.kpi.lulusKkmUjian !== null" class="text-xs mt-1" :class="report.kpi.lulusKkmUjian ? 'text-emerald-700' : 'text-red-600'">
              {{ $t(report.kpi.lulusKkmUjian ? 'portal.lulusKkm' : 'portal.bawahKkm', { kkm: report.settings.kkm_ujian }) }}
            </p>
          </div>
          <div class="joy-surface p-4">
            <p class="text-xs font-medium text-slate-500">{{ $t('portal.kehadiran') }}</p>
            <p class="text-2xl font-bold tabular-nums mt-1" :class="report.kpi.kehadiranRendah ? 'text-red-600' : 'text-slate-900'">
              {{ report.kpi.rasioKehadiran === null ? '-' : `${num(report.kpi.rasioKehadiran)}%` }}
            </p>
            <p class="text-xs text-slate-500 mt-1 tabular-nums">
              {{ report.absensi.hadir }}/{{ report.absensi.sesi }} {{ $t('portal.sesi').toLowerCase() }}
            </p>
          </div>
          <div class="joy-surface p-4">
            <p class="text-xs font-medium text-slate-500">{{ $t('portal.peringkat') }}</p>
            <p class="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {{ report.peringkat?.posisi ?? '-' }}
            </p>
            <p class="text-xs text-slate-500 mt-1">
              <template v-if="report.peringkat?.posisi">{{ $t('portal.dariN', { n: report.peringkat.jumlahDinilai }) }} · </template>
              {{ $t('portal.rataKelas', { nilai: num(report.peringkat?.rataKelas) }) }}
            </p>
          </div>
          <div class="joy-surface p-4">
            <p class="text-xs font-medium text-slate-500">{{ $t('portal.sikap') }}</p>
            <p class="text-2xl font-bold text-slate-900 tabular-nums mt-1">
              {{ num(report.kpi.skorSikap) }}<span v-if="report.kpi.skorSikap !== null" class="text-sm font-semibold text-slate-500"> {{ report.kpi.predikatSikap }}</span>
            </p>
            <p v-if="report.kpi.lulusKkmSikap !== null" class="text-xs mt-1" :class="report.kpi.lulusKkmSikap ? 'text-emerald-700' : 'text-red-600'">
              {{ $t(report.kpi.lulusKkmSikap ? 'portal.lulusKkm' : 'portal.bawahKkm', { kkm: report.settings.kkm_sikap }) }}
            </p>
          </div>
        </section>

        <!-- Exams -->
        <section class="joy-surface p-5">
          <h2 class="text-base font-bold text-slate-900 font-display mb-3">{{ $t('portal.nilaiUjian') }}</h2>
          <p v-if="!report.ujian.daftar.length" class="text-sm text-slate-500">{{ $t('portal.ujianKosong') }}</p>
          <template v-else>
            <ScoreTrendChart
              v-if="trendPoints.length > 1"
              :points="trendPoints"
              :kkm="report.settings.kkm_ujian"
              :aria-label="$t('portal.trenAria', { n: trendPoints.length, kkm: report.settings.kkm_ujian })"
            />
            <ul class="divide-y divide-slate-100 mt-3">
              <li v-for="u in ujianTerbaru" :key="u.id" class="py-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-slate-900">{{ u.kode || '-' }}</p>
                    <p class="text-xs text-slate-500">
                      {{ tanggal(u.tanggal) }}
                      <template v-if="kelasRataPerKode.get(u.kode) != null"> · {{ $t('portal.kelasRata', { nilai: num(kelasRataPerKode.get(u.kode)) }) }}</template>
                    </p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="text-lg font-bold tabular-nums" :class="u.lulusKkm ? 'text-slate-900' : 'text-red-600'">
                      {{ num(u.rata, 2) }} <span class="text-xs font-semibold text-slate-500">{{ u.grade }}</span>
                    </p>
                  </div>
                </div>
                <p v-if="u.pola === 'variable'" class="text-xs text-slate-600 mt-1 tabular-nums">
                  {{ bagianText(u) }}
                </p>
                <details v-if="u.catatan" class="mt-1.5 group">
                  <summary class="text-xs font-medium text-primary cursor-pointer select-none">{{ $t('portal.catatan') }}</summary>
                  <p class="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-line">{{ u.catatan }}</p>
                </details>
              </li>
            </ul>
          </template>
        </section>

        <!-- Attendance -->
        <section class="joy-surface p-5">
          <h2 class="text-base font-bold text-slate-900 font-display mb-1">{{ $t('portal.kehadiranBulanan') }}</h2>
          <p v-if="report.kpi.kehadiranRendah" class="text-xs text-red-600 mb-2">
            {{ $t('portal.kehadiranRendah', { ambang: report.settings.ambang_kehadiran_rendah }) }}
          </p>
          <div class="overflow-x-auto -mx-1">
            <table class="w-full text-xs tabular-nums">
              <thead>
                <tr class="text-slate-500 text-left">
                  <th class="font-medium py-2 px-1">{{ $t('portal.bulan') }}</th>
                  <th class="font-medium py-2 px-1 text-right">{{ $t('portal.status.hadir') }}</th>
                  <th class="font-medium py-2 px-1 text-right">{{ $t('portal.status.sakit') }}</th>
                  <th class="font-medium py-2 px-1 text-right">{{ $t('portal.status.izin') }}</th>
                  <th class="font-medium py-2 px-1 text-right">{{ $t('portal.status.alfa') }}</th>
                  <th class="font-medium py-2 px-1 text-right">%</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="b in bulanAbsensi" :key="b.periode">
                  <td class="py-2 px-1 text-slate-800 whitespace-nowrap">{{ bulan(b.periode) }}</td>
                  <td class="py-2 px-1 text-right">{{ b.absensi.hadir }}/{{ b.absensi.sesi }}</td>
                  <td class="py-2 px-1 text-right">{{ b.absensi.sakit || '·' }}</td>
                  <td class="py-2 px-1 text-right">{{ b.absensi.izin || '·' }}</td>
                  <td class="py-2 px-1 text-right" :class="b.absensi.alfa ? 'text-red-600 font-semibold' : ''">{{ b.absensi.alfa || '·' }}</td>
                  <td class="py-2 px-1 text-right font-semibold" :class="lowAttendance(b.absensi.rasio) ? 'text-red-600' : 'text-slate-900'">
                    {{ b.absensi.rasio === null ? '-' : num(b.absensi.rasio) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-3">
            <p class="text-xs font-medium text-slate-500 mb-1.5">{{ $t('portal.tidakHadir') }}</p>
            <p v-if="!report.tidakHadir.length" class="text-xs text-emerald-700">{{ $t('portal.semuaHadir') }}</p>
            <div v-else class="flex flex-wrap gap-1.5">
              <span
                v-for="a in report.tidakHadir"
                :key="a.tanggal"
                class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                :class="STATUS_CLASS[a.status] || 'bg-slate-100 text-slate-700'"
              >
                {{ tanggal(a.tanggal) }} · {{ $t(`portal.status.${a.status}`) }}
              </span>
            </div>
          </div>
        </section>

        <!-- Kaiwa -->
        <section v-if="report.kaiwa.daftar.length" class="joy-surface p-5">
          <h2 class="text-base font-bold text-slate-900 font-display mb-2">{{ $t('portal.kaiwa') }}</h2>
          <ul class="divide-y divide-slate-100">
            <li v-for="k in [...report.kaiwa.daftar].reverse()" :key="k.id" class="py-2.5 flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm text-slate-900">{{ k.topik || '-' }}</p>
                <p class="text-xs text-slate-500">{{ tanggal(k.tanggal) }}</p>
                <p v-if="k.catatan" class="text-xs text-slate-700 mt-1">{{ k.catatan }}</p>
              </div>
              <span class="text-lg font-bold text-slate-900 shrink-0">{{ k.grade }}</span>
            </li>
          </ul>
        </section>

        <!-- Attitude -->
        <section v-if="sikapBulan.length || report.sikap.daftar.length" class="joy-surface p-5">
          <h2 class="text-base font-bold text-slate-900 font-display mb-2">{{ $t('portal.sikapBulanan') }}</h2>
          <ul class="divide-y divide-slate-100">
            <li v-for="b in sikapBulan" :key="b.periode" class="py-2 flex items-center justify-between text-sm">
              <span class="text-slate-800">{{ bulan(b.periode) }}</span>
              <span class="tabular-nums font-semibold" :class="b.sikap.lulusKkm ? 'text-slate-900' : 'text-red-600'">
                {{ num(b.sikap.skor) }} <span class="text-xs text-slate-500">{{ b.sikap.predikat }}</span>
              </span>
            </li>
          </ul>
          <template v-if="sikapTerbaru.length">
            <p class="text-xs font-medium text-slate-500 mt-3 mb-1.5">{{ $t('portal.sikapCatatan') }}</p>
            <ul class="space-y-1">
              <li v-for="s in sikapTerbaru" :key="s.id" class="flex items-center gap-2 text-xs">
                <v-icon
                  :icon="s.sentiment === 'positif' ? 'mdi-thumb-up-outline' : 'mdi-alert-circle-outline'"
                  :color="s.sentiment === 'positif' ? 'success' : 'warning'"
                  size="14"
                />
                <span class="text-slate-800">{{ locale === 'ja' ? s.kategoriNamaJa : s.kategoriNamaId }}</span>
                <span class="text-slate-500 ml-auto shrink-0">{{ tanggal(s.tanggal) }}</span>
              </li>
            </ul>
          </template>
        </section>

        <!-- Placement -->
        <section v-if="adaPenempatan" class="joy-surface p-5">
          <h2 class="text-base font-bold text-slate-900 font-display mb-2">{{ $t('portal.penempatan') }}</h2>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <template v-for="row in penempatanRows" :key="row.label">
              <div v-if="row.value">
                <dt class="text-xs text-slate-500">{{ row.label }}</dt>
                <dd class="text-slate-900">{{ row.value }}</dd>
              </div>
            </template>
          </dl>
        </section>

        <p class="text-center text-xs text-slate-400 pt-2 pb-6">{{ $t('portal.footer') }}</p>
      </template>
    </main>

    <v-dialog v-model="passwordDialog" max-width="420">
      <v-card class="p-5">
        <h2 class="text-base font-bold text-slate-900 font-display mb-3">{{ $t('portal.gantiSandiDialog') }}</h2>
        <PortalPasswordForm @saved="onPasswordChanged" />
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" color="success" timeout="2500">{{ $t('portal.sandiTersimpan') }}</v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useLocale } from 'vuetify';
import { useAppStore } from '../../stores/appStore.js';
import { portalRequest, setPortalToken } from '../../services/portalApi.js';
import ScoreTrendChart from '../../components/smart-report/ScoreTrendChart.vue';
import PortalPasswordForm from '../../components/portal/PortalPasswordForm.vue';

const STATUS_CLASS = {
  sakit: 'bg-amber-100 text-amber-800',
  izin: 'bg-sky-100 text-sky-800',
  alfa: 'bg-red-100 text-red-700',
};
const BAGIAN = ['mojiGoi', 'bunpou', 'dokkai', 'choukai'];

const router = useRouter();
const { t, locale } = useI18n();
const vuetifyLocale = useLocale();
const appStore = useAppStore();

const peserta = ref(null);
const report = ref(null);
const loading = ref(true);
const loadError = ref(false);
const passwordDialog = ref(false);
const snackbar = ref(false);

const intlLocale = computed(() => (locale.value === 'ja' ? 'ja-JP' : 'id-ID'));

function num(v, digits = 1) {
  if (v === null || v === undefined || !Number.isFinite(Number(v))) return '-';
  return new Intl.NumberFormat(intlLocale.value, { maximumFractionDigits: digits }).format(Number(v));
}

function tanggal(iso) {
  if (!iso) return '-';
  const [y, m, d] = String(iso).slice(0, 10).split('-').map(Number);
  return new Intl.DateTimeFormat(intlLocale.value, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(y, m - 1, d));
}

function bulan(periode) {
  const [y, m] = periode.split('-').map(Number);
  return new Intl.DateTimeFormat(intlLocale.value, { month: 'short', year: 'numeric' }).format(new Date(y, m - 1, 1));
}

function lowAttendance(rasio) {
  return rasio !== null && rasio < report.value.settings.ambang_kehadiran_rendah;
}

function bagianText(u) {
  return BAGIAN.filter((key) => u[key] !== null)
    .map((key) => `${t(`portal.bagian.${key}`)} ${num(u[key], 2)}`)
    .join(' · ');
}

const trendPoints = computed(() =>
  (report.value?.ujian.daftar || []).map((u) => ({ label: u.kode, value: u.rata, title: `${u.kode} · ${tanggal(u.tanggal)} · ${num(u.rata, 2)}` }))
);
const ujianTerbaru = computed(() => [...(report.value?.ujian.daftar || [])].reverse());
const kelasRataPerKode = computed(() => new Map((report.value?.peringkat?.perUjian || []).map((p) => [p.kode, p.rata])));
const bulanAbsensi = computed(() => (report.value?.bulanan || []).filter((b) => b.absensi.sesi > 0).reverse());
// Months without any attitude record only carry the basis score, so they are left out.
const sikapBulan = computed(() =>
  (report.value?.bulanan || []).filter((b) => b.sikap.positif + b.sikap.negatif > 0).reverse()
);
const sikapTerbaru = computed(() => [...(report.value?.sikap.daftar || [])].reverse().slice(0, 8));

const penempatanRows = computed(() => {
  const p = report.value?.penempatan || {};
  return [
    { label: t('portal.perusahaan'), value: p.perusahaanNaitei },
    { label: t('portal.jenisPekerjaan'), value: p.jenisPekerjaan },
    { label: t('portal.lokasi'), value: p.lokasiKerja },
    { label: t('portal.lulusUjianTanggal'), value: p.tanggalLulusUjian ? tanggal(p.tanggalLulusUjian) : '' },
    { label: t('portal.rencanaKerja'), value: p.rencanaMulaiKerja ? tanggal(p.rencanaMulaiKerja) : '' },
  ];
});
const adaPenempatan = computed(() => penempatanRows.value.some((r) => r.value));

function switchLang(next) {
  appStore.setLocale(next, { locale }, vuetifyLocale);
}

function logout() {
  setPortalToken('');
  router.replace('/portal/login');
}

async function load() {
  loading.value = true;
  loadError.value = false;
  try {
    peserta.value = (await portalRequest('/auth/me')).peserta;
    report.value = peserta.value.wajibGantiSandi ? null : await portalRequest('/dashboard');
  } catch (err) {
    if (err.status === 401) {
      router.replace('/portal/login');
      return;
    }
    loadError.value = true;
  } finally {
    loading.value = false;
  }
}

function onPasswordSaved(session) {
  peserta.value = session;
  snackbar.value = true;
  load();
}

function onPasswordChanged(session) {
  peserta.value = session;
  passwordDialog.value = false;
  snackbar.value = true;
}

onMounted(load);
</script>
