<template>
  <article
    class="sr-page bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-4xl mx-auto space-y-5 print:p-0 print:border-none print:shadow-none print:rounded-none"
  >
    <ReportHeader :title="$t('smartReport.kopJudulPeserta')" :rentang="report.rentang" :print-date="printDate" />

    <!-- Identitas -->
    <div
      class="border rounded-lg p-3.5 grid grid-cols-2 gap-3 text-xs"
      :class="[portal ? 'sm:grid-cols-4 print:grid-cols-4' : 'sm:grid-cols-5 print:grid-cols-5', warnaIdentitas(report.student.statusTag, portal)]"
    >
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
      <PeringkatCell :peringkat="report.peringkat" :note="$t('laporan.peringkatSeluruh')" />
      <div v-if="!portal">
        <div class="text-[11px] text-slate-500">{{ $t('smartReport.statusTag') }}</div>
        <div class="font-bold text-slate-800 mt-0.5">{{ $t(`tag.${report.student.statusTag}`) }}</div>
      </div>
      <StatusLegend v-if="!portal" :status-tag="report.student.statusTag" />
    </div>

    <!-- KPI -->
    <div class="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-3 text-center">
      <div class="p-3 border border-slate-200 rounded-lg">
        <div class="text-[11px] font-medium text-slate-500">{{ $t('smartReport.rataUjian') }}</div>
        <div class="text-xl font-bold mt-1" :class="statusClass(report.kpi.lulusKkmUjian)">
          {{ fmt(report.kpi.rataUjian) }}
          <span v-if="report.kpi.rataUjian !== null" class="text-xs font-semibold text-slate-500">({{ report.kpi.gradeUjian }})</span>
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

    <!-- Exam trend, full width -->
    <section class="border border-slate-200 rounded-lg px-3.5 pt-3 pb-2 space-y-1 sr-keep">
      <h3 class="sr-section-title border-b-0 pb-0">{{ $t('smartReport.secTren') }}</h3>
      <ScoreTrendChart
        :points="trendPoints"
        :kkm="settings.kkm_ujian"
        :width="1000"
        :aria-label="$t('smartReport.grafikAria', { n: trendPoints.length, kkm: settings.kkm_ujian })"
      />
    </section>

    <!-- Exam statistics; a second row of section averages for exams scored per section -->
    <section v-if="ujianCells.length" class="border border-slate-200 rounded-lg p-3.5 space-y-2 sr-keep">
      <h3 class="sr-section-title border-b-0 pb-0">{{ $t('laporan.statistikUjian') }}</h3>
      <div class="grid grid-cols-4 gap-2 text-center">
        <div v-for="cell in ujianCells" :key="cell.label" class="border border-slate-200 rounded py-2 px-2">
          <div class="text-[10px] text-slate-500">{{ cell.label }}</div>
          <div class="text-lg font-bold mt-0.5" :class="cell.tone" style="font-variant-numeric: tabular-nums">{{ cell.value }}</div>
          <div class="text-[10px] text-slate-400">{{ cell.note }}</div>
        </div>
      </div>
      <div v-if="bagianCells.length" class="grid grid-cols-4 gap-2 text-center">
        <div v-for="cell in bagianCells" :key="cell.key" class="border border-slate-200 rounded py-1.5 px-2">
          <div class="text-[10px] text-slate-500">{{ cell.label }}</div>
          <div class="text-base font-bold mt-0.5" :class="cell.tone" style="font-variant-numeric: tabular-nums">{{ cell.value }}</div>
        </div>
      </div>
    </section>

    <!-- 1. Rekap bulanan -->
    <div class="space-y-1.5">
      <h3 class="sr-section-title">1. {{ $t('smartReport.secBulanan') }}</h3>
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
            <td class="text-center">{{ kaiwaRingkas(b.kaiwa) }}</td>
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

    <!-- 2. Kaiwa & 3. Sikap, in numbers -->
    <div class="grid grid-cols-2 gap-5 sr-keep">
      <div class="space-y-1.5">
        <h3 class="sr-section-title">2. {{ $t('smartReport.secKaiwa') }}</h3>
        <StatKaiwa
          :grades="report.kaiwa.daftar.map((k: any) => k.grade)"
          :grade-terakhir="report.kpi.kaiwaTerakhir"
          :kaiwa-card="report.kaiwaCard"
        />
      </div>
      <div class="space-y-1.5">
        <h3 class="sr-section-title">3. {{ $t('smartReport.secSikap') }}</h3>
        <StatSikap
          :rows="report.sikap.daftar"
          :skor="report.kpi.skorSikap"
          :skor-label="$t('smartReport.skorSikap')"
          :skor-note="$t('smartReport.skorSikapDesc', { kkm: settings.kkm_sikap })"
          :lulus-kkm="report.kpi.lulusKkmSikap"
          :basis="settings.sikap_basis"
        />
      </div>
    </div>

    <!-- 4. Penempatan (hanya bila ada isinya) -->
    <div v-if="penempatanRows.length" class="space-y-1.5 sr-keep">
      <h3 class="sr-section-title">4. {{ $t('smartReport.secPenempatan') }}</h3>
      <div class="border border-slate-200 rounded p-3 grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
        <div v-for="row in penempatanRows" :key="row.label" class="flex justify-between gap-3 border-b border-slate-50 py-0.5">
          <span class="text-slate-500">{{ row.label }}</span>
          <span class="font-semibold text-slate-800 text-right">{{ row.value }}</span>
        </div>
      </div>
    </div>

    <!-- One overall review of every score -->
    <ResumeCard
      :title="$t('laporan.reviewJudul')"
      :resume="report.resume"
      :can-write="canWrite"
      :date-only="portal"
      :busy="busy"
      :locked="locked"
      :generate="generate"
      :save="save"
    />

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
import './smartReport.css';
import ResumeCard from './ResumeCard.vue';
import ScoreTrendChart from './ScoreTrendChart.vue';
import StatKaiwa from './StatKaiwa.vue';
import StatSikap from './StatSikap.vue';
import StatusLegend from './StatusLegend.vue';
import PeringkatCell from './PeringkatCell.vue';
import { bertanda, hitungGrade, warnaIdentitas } from './reportStats.js';

const props = defineProps<{
  report: any;
  settings: any;
  printDate: string;
  canWrite: boolean;
  busy?: boolean;
  locked?: boolean;
  generate: () => Promise<void>;
  save: (payload: { teksId: string; teksJa: string }) => Promise<void>;
  // Peserta portal: read-only, without the status tag.
  portal?: boolean;
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

// Average per section; single-score exams have none, so the row only shows for section-scored ones.
const bagianCells = computed(() => {
  const cells = BAGIAN.map((key) => {
    const value = props.report.ujian.bagian[key];
    return {
      key,
      label: t('laporan.rataBagian', { bagian: t(`smartReport.bagian_${key}`) }),
      value: fmt(value),
      tone: value === null ? 'text-slate-400' : value >= props.settings.kkm_ujian ? 'text-slate-900' : 'text-red-600',
      ada: value !== null,
    };
  });
  return cells.some((c) => c.ada) ? cells : [];
});

// "5× · A1 B3 C1": sessions of a month and how many of each grade.
function kaiwaRingkas(grades: string[]) {
  if (!grades.length) return '-';
  const counts = Object.entries(hitungGrade(grades)).filter(([, n]) => n > 0).map(([g, n]) => `${g}${n}`);
  return `${grades.length}× · ${counts.join(' ')}`;
}

const ujianCells = computed(() => {
  const { tertinggi, terendah, tren } = props.report.ujian;
  const { jumlahUjian, jumlahLulusUjian } = props.report.kpi;
  if (!tertinggi) return [];
  return [
    { label: t('laporan.tertinggi'), value: fmt(tertinggi.rata), note: tertinggi.kode, tone: 'text-slate-900' },
    { label: t('laporan.terendah'), value: fmt(terendah.rata), note: terendah.kode, tone: 'text-slate-900' },
    {
      label: t('laporan.tren'),
      value: tren ? bertanda(tren.selisih) : '-',
      note: tren ? t('laporan.trenNote', { n: tren.jumlahPembanding }) : '',
      tone: !tren || tren.selisih === 0 ? 'text-slate-900' : tren.selisih > 0 ? 'text-emerald-700' : 'text-red-600',
    },
    {
      label: t('laporan.ketuntasan'),
      value: `${jumlahLulusUjian}/${jumlahUjian}`,
      note: t('laporan.ketuntasanNote', { persen: Math.round((jumlahLulusUjian / jumlahUjian) * 1000) / 10, kkm: props.settings.kkm_ujian }),
      tone: jumlahLulusUjian === jumlahUjian ? 'text-emerald-700' : 'text-amber-700',
    },
  ];
});

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
