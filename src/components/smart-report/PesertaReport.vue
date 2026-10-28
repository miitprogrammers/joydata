<template>
  <article
    class="sr-page bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-4xl mx-auto space-y-5 print:p-0 print:border-none print:shadow-none print:rounded-none"
  >
    <ReportHeader :title="$t('smartReport.kopJudulPeserta')" :rentang="report.rentang" :print-date="printDate" />

    <!-- Identitas -->
    <div class="bg-slate-50 border border-slate-200 rounded-lg p-3.5 grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-3 text-xs">
      <div>
        <div class="text-[11px] text-slate-500">{{ $t('common.namaPeserta') }}</div>
        <div class="font-bold text-slate-900 text-sm mt-0.5">{{ report.student.nama }}</div>
        <div class="text-[10px] text-slate-400 font-mono">ID #{{ report.student.mancationAkunId || report.student.id }}</div>
      </div>
      <div>
        <div class="text-[11px] text-slate-500">{{ $t('common.kelas') }}</div>
        <div class="font-bold text-slate-800 mt-0.5">{{ report.kelas?.namaKelas || '-' }}</div>
        <div class="text-[10px] text-slate-500">
          {{ locale === 'ja' ? report.kelas?.programNamaJa : report.kelas?.programNama }}
        </div>
      </div>
      <div>
        <div class="text-[11px] text-slate-500">{{ $t('smartReport.sensei') }}</div>
        <div class="font-bold text-slate-800 mt-0.5">{{ report.kelas?.senseiNama || '-' }}</div>
        <div class="text-[10px] text-slate-500">
          {{ $t('smartReport.tanggalMasuk') }}: {{ report.student.tanggalMasuk || '-' }}
        </div>
      </div>
      <div>
        <div class="text-[11px] text-slate-500">{{ $t('smartReport.statusTag') }}</div>
        <div class="font-bold text-slate-800 mt-0.5">{{ $t(`tag.${report.student.statusTag}`) }}</div>
      </div>
    </div>

    <!-- KPI -->
    <div class="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-3 text-center">
      <div class="p-3 border border-slate-200 rounded-lg">
        <div class="text-[11px] font-medium text-slate-500">{{ $t('smartReport.rataUjian') }}</div>
        <div class="text-xl font-bold mt-1" :class="statusClass(report.kpi.lulusKkmUjian)">
          {{ fmt(report.kpi.rataUjian) }}
          <span v-if="report.kpi.rataUjian !== null" class="text-xs font-semibold text-slate-500">({{ report.kpi.gradeUjian }})</span>
        </div>
        <div class="text-[10px] text-slate-400 mt-0.5">
          {{ $t('smartReport.lulusKkmDari', { lulus: report.kpi.jumlahLulusUjian, total: report.kpi.jumlahUjian, kkm: settings.kkm_ujian }) }}
        </div>
      </div>
      <div class="p-3 border border-slate-200 rounded-lg">
        <div class="text-[11px] font-medium text-slate-500">{{ $t('smartReport.kaiwaTerakhir') }}</div>
        <div class="text-xl font-bold mt-1 text-blue-800">{{ report.kpi.kaiwaTerakhir || '-' }}</div>
        <div class="text-[10px] text-slate-400 mt-0.5">{{ $t('smartReport.sesiKaiwa', { n: report.kpi.jumlahKaiwa }) }}</div>
      </div>
      <div class="p-3 border border-slate-200 rounded-lg">
        <div class="text-[11px] font-medium text-slate-500">{{ $t('smartReport.skorSikap') }}</div>
        <div class="text-xl font-bold mt-1" :class="statusClass(report.kpi.lulusKkmSikap)">
          {{ fmt(report.kpi.skorSikap) }}
          <span v-if="report.kpi.skorSikap !== null" class="text-xs font-semibold text-slate-500">({{ report.kpi.predikatSikap }})</span>
        </div>
        <div class="text-[10px] text-slate-400 mt-0.5">{{ $t('smartReport.skorSikapDesc', { kkm: settings.kkm_sikap }) }}</div>
      </div>
      <div class="p-3 border border-slate-200 rounded-lg">
        <div class="text-[11px] font-medium text-slate-500">{{ $t('smartReport.kehadiran') }}</div>
        <div
          class="text-xl font-bold mt-1"
          :class="report.kpi.rasioKehadiran === null ? 'text-slate-800' : report.kpi.kehadiranRendah ? 'text-red-600' : 'text-emerald-700'"
        >
          {{ report.kpi.rasioKehadiran !== null ? `${report.kpi.rasioKehadiran}%` : '-' }}
        </div>
        <div class="text-[10px] text-slate-400 mt-0.5">
          {{ $t('smartReport.hadirDariSesi', { hadir: report.absensi.hadir, sesi: report.absensi.sesi }) }}
        </div>
      </div>
    </div>

    <ResumeCard
      :title="$t('smartReport.resumeJudul')"
      :resume="report.resume"
      :can-write="canWrite"
      :busy="busy"
      :locked="locked"
      :generate="generate"
      :save="save"
    />

    <!-- Tren & bagian -->
    <div class="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-5 sr-keep">
      <div class="md:col-span-2 print:col-span-2 space-y-1.5">
        <h3 class="sr-section-title">{{ $t('smartReport.secTren') }}</h3>
        <ScoreTrendChart
          :points="trendPoints"
          :kkm="settings.kkm_ujian"
          :aria-label="$t('smartReport.grafikAria', { n: trendPoints.length, kkm: settings.kkm_ujian })"
        />
      </div>
      <div class="space-y-1.5">
        <h3 class="sr-section-title">{{ $t('smartReport.secBagian') }}</h3>
        <div class="space-y-2.5 pt-1">
          <div v-for="b in bagianRows" :key="b.key" class="text-[11px]">
            <div class="flex justify-between text-slate-600">
              <span>{{ $t(`smartReport.bagian_${b.key}`) }}</span>
              <span class="font-bold text-slate-800" style="font-variant-numeric: tabular-nums">{{ fmt(b.value) }}</span>
            </div>
            <div class="relative h-1.5 mt-1 rounded-full bg-slate-100">
              <div
                v-if="b.value !== null"
                class="absolute inset-y-0 left-0 rounded-full"
                :style="{ width: `${Math.min(100, b.value)}%`, background: '#1E3A8A' }"
              />
              <div class="absolute -inset-y-0.5 w-px bg-slate-500" :style="{ left: `${settings.kkm_ujian}%` }" />
            </div>
          </div>
          <div class="text-[10px] text-slate-400 flex items-center gap-1">
            <span class="inline-block w-px h-2.5 bg-slate-500" />
            {{ $t('smartReport.kkmLabel', { kkm: settings.kkm_ujian }) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 1. Riwayat ujian -->
    <div class="space-y-1.5">
      <div class="sr-title-row">
        <h3 class="sr-section-title">1. {{ $t('smartReport.secUjian') }}</h3>
        <span class="text-[11px] text-slate-500">{{ report.ujian.daftar.length }}×</span>
      </div>
      <table class="sr-table">
        <thead>
          <tr>
            <th>{{ $t('smartReport.colTanggal') }}</th>
            <th>{{ $t('smartReport.colKode') }}</th>
            <th class="text-center">{{ $t('smartReport.bagian_mojiGoi') }}</th>
            <th class="text-center">{{ $t('smartReport.bagian_bunpou') }}</th>
            <th class="text-center">{{ $t('smartReport.bagian_dokkai') }}</th>
            <th class="text-center">{{ $t('smartReport.bagian_choukai') }}</th>
            <th class="text-center">{{ $t('smartReport.colTunggal') }}</th>
            <th class="text-center">{{ $t('smartReport.colRata') }}</th>
            <th class="text-center">{{ $t('smartReport.colGrade') }}</th>
            <th class="text-center">{{ $t('smartReport.colStatus') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!report.ujian.daftar.length">
            <td colspan="10" class="text-center text-slate-400 py-3">{{ $t('smartReport.tidakAdaUjian') }}</td>
          </tr>
          <template v-for="u in report.ujian.daftar" :key="u.id">
            <tr class="sr-num">
              <td class="font-sans">{{ u.tanggal }}</td>
              <td class="font-bold text-slate-800">{{ u.kode }}</td>
              <td class="text-center">{{ fmt(u.mojiGoi) }}</td>
              <td class="text-center">{{ fmt(u.bunpou) }}</td>
              <td class="text-center">{{ fmt(u.dokkai) }}</td>
              <td class="text-center">{{ fmt(u.choukai) }}</td>
              <td class="text-center">{{ fmt(u.nilaiTunggal) }}</td>
              <td class="text-center font-bold text-slate-900 bg-slate-50">{{ fmt(u.rata) }}</td>
              <td class="text-center font-bold">{{ u.grade }}</td>
              <td class="text-center text-[10px] font-sans font-semibold">
                <span :class="u.lulusKkm ? 'text-emerald-700' : 'text-red-600'">
                  {{ u.lulusKkm ? $t('smartReport.lulus') : $t('smartReport.belumLulus') }}
                </span>
              </td>
            </tr>
            <tr v-if="u.catatan" class="sr-note-row">
              <td colspan="10">{{ u.catatan }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- 2. Rekap bulanan -->
    <div class="space-y-1.5">
      <h3 class="sr-section-title">2. {{ $t('smartReport.secBulanan') }}</h3>
      <table class="sr-table">
        <thead>
          <tr>
            <th>{{ $t('smartReport.colPeriode') }}</th>
            <th class="text-center">{{ $t('smartReport.colUjian') }}</th>
            <th class="text-center">{{ $t('smartReport.colKaiwa') }}</th>
            <th class="text-center">{{ $t('smartReport.colSikap') }}</th>
            <th class="text-center">{{ $t('smartReport.colKehadiran') }}</th>
            <th class="text-center">{{ $t('smartReport.colSia') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!report.bulanan.length">
            <td colspan="6" class="text-center text-slate-400 py-3">{{ $t('smartReport.belumAdaData') }}</td>
          </tr>
          <tr v-for="b in report.bulanan" :key="b.periode" class="sr-num">
            <td class="font-bold text-slate-800">{{ b.periode }}</td>
            <td class="text-center">
              <template v-if="b.jumlahUjian">
                <span class="font-bold text-slate-900">{{ fmt(b.ujianRata) }}</span>
                <span class="text-slate-400"> · {{ b.jumlahUjian }}×</span>
              </template>
              <span v-else class="text-slate-300">-</span>
            </td>
            <td class="text-center">{{ b.kaiwa.length ? b.kaiwa.join(', ') : '-' }}</td>
            <td class="text-center">
              <span class="font-bold" :class="statusClass(b.sikap.lulusKkm)">{{ fmt(b.sikap.skor) }}</span>
              <span v-if="b.sikap.positif || b.sikap.negatif" class="text-slate-400">
                (+{{ b.sikap.positif }} / −{{ b.sikap.negatif }})
              </span>
            </td>
            <td class="text-center">
              <template v-if="b.absensi.sesi">
                {{ b.absensi.hadir }}/{{ b.absensi.sesi }}
                <span
                  class="font-bold"
                  :class="b.absensi.rasio < settings.ambang_kehadiran_rendah ? 'text-red-600' : 'text-slate-900'"
                >
                  ({{ b.absensi.rasio }}%)
                </span>
              </template>
              <span v-else class="text-slate-300">-</span>
            </td>
            <td class="text-center text-slate-500">
              {{ b.absensi.sesi ? `${b.absensi.sakit} / ${b.absensi.izin} / ${b.absensi.alfa}` : '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 3. Kaiwa -->
    <div class="space-y-1.5">
      <h3 class="sr-section-title">3. {{ $t('smartReport.secKaiwa') }}</h3>
      <table v-if="report.kaiwa.daftar.length" class="sr-table">
        <thead>
          <tr>
            <th class="w-24">{{ $t('smartReport.colTanggal') }}</th>
            <th>{{ $t('smartReport.colTopik') }}</th>
            <th class="text-center w-14">{{ $t('smartReport.colGrade') }}</th>
            <th>{{ $t('smartReport.colCatatan') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="k in report.kaiwa.daftar" :key="k.id">
            <td class="font-mono">{{ k.tanggal }}</td>
            <td>{{ k.topik || '-' }}</td>
            <td class="text-center font-bold text-blue-800">{{ k.grade }}</td>
            <td class="text-slate-600">{{ k.catatan || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-[11px] text-slate-400">{{ $t('smartReport.tidakAdaKaiwa') }}</div>
    </div>

    <!-- 4. Sikap -->
    <div class="space-y-1.5">
      <h3 class="sr-section-title">4. {{ $t('smartReport.secSikap') }}</h3>
      <table v-if="report.sikap.daftar.length" class="sr-table">
        <thead>
          <tr>
            <th class="w-24">{{ $t('smartReport.colTanggal') }}</th>
            <th>{{ $t('smartReport.colKategori') }}</th>
            <th class="text-center w-16">{{ $t('smartReport.colDampak') }}</th>
            <th>{{ $t('smartReport.colKeterangan') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in report.sikap.daftar" :key="s.id">
            <td class="font-mono">{{ s.tanggal }}</td>
            <td class="font-medium text-slate-800">{{ locale === 'ja' ? s.kategoriNamaJa : s.kategoriNamaId }}</td>
            <td class="text-center font-mono font-bold">
              <span v-if="s.sentiment === 'positif'" class="text-emerald-700">+{{ s.bobot }}</span>
              <span v-else class="text-red-600">−{{ s.bobot }}</span>
            </td>
            <td class="text-slate-600">{{ s.keterangan || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-[11px] text-slate-400">
        {{ $t('smartReport.tidakAdaSikap', { basis: settings.sikap_basis }) }}
      </div>
    </div>

    <!-- 5. Penempatan (hanya bila ada isinya) -->
    <div v-if="penempatanRows.length" class="space-y-1.5 sr-keep">
      <h3 class="sr-section-title">5. {{ $t('smartReport.secPenempatan') }}</h3>
      <div class="border border-slate-200 rounded p-3 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
        <div v-for="row in penempatanRows" :key="row.label" class="flex justify-between gap-3 border-b border-slate-50 py-0.5">
          <span class="text-slate-500">{{ row.label }}</span>
          <span class="font-semibold text-slate-800 text-right">{{ row.value }}</span>
        </div>
      </div>
    </div>

    <!-- Tanda tangan -->
    <div class="sr-keep pt-6 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-xs">
      <div v-for="sign in signatures" :key="sign.role">
        <div class="text-[11px] text-slate-500 mb-10">{{ sign.role }}</div>
        <div class="font-bold text-slate-900 border-t border-slate-300 pt-1.5">{{ sign.name }}</div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ReportHeader from './ReportHeader.vue';
import ResumeCard from './ResumeCard.vue';
import ScoreTrendChart from './ScoreTrendChart.vue';

const props = defineProps<{
  report: any;
  settings: any;
  printDate: string;
  canWrite: boolean;
  busy?: boolean;
  locked?: boolean;
  generate: () => Promise<void>;
  save: (payload: { teksId: string; teksJa: string }) => Promise<void>;
}>();

const { t, locale } = useI18n();

const BAGIAN = ['mojiGoi', 'bunpou', 'dokkai', 'choukai'];

function fmt(v: number | null | undefined) {
  if (v === null || v === undefined || !Number.isFinite(v)) return '-';
  return String(Math.round(v * 100) / 100);
}

function statusClass(lulus: boolean | null) {
  if (lulus === null) return 'text-slate-800';
  return lulus ? 'text-emerald-700' : 'text-red-600';
}

const trendPoints = computed(() =>
  props.report.ujian.daftar.map((u: any) => ({
    label: u.kode,
    value: u.rata,
    title: `${u.kode} · ${u.tanggal} · ${fmt(u.rata)} (${u.grade})`,
  }))
);

const bagianRows = computed(() => BAGIAN.map((key) => ({ key, value: props.report.ujian.bagian[key] })));

const penempatanRows = computed(() => {
  const p = props.report.penempatan || {};
  return [
    { label: t('smartReport.perusahaanNaitei'), value: p.perusahaanNaitei },
    { label: t('smartReport.jenisPekerjaan'), value: p.jenisPekerjaan },
    { label: t('smartReport.lokasiKerja'), value: p.lokasiKerja },
    { label: t('smartReport.tanggalLulusUjian'), value: p.tanggalLulusUjian },
  ].filter((row) => row.value);
});

const signatures = computed(() => [
  { role: t('smartReport.ttdSensei'), name: props.report.kelas?.senseiNama || '( ............................ )' },
  { role: t('smartReport.ttdPeserta'), name: props.report.student.nama },
  { role: t('smartReport.ttdManager'), name: '( ............................ )' },
]);
</script>
