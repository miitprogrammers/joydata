<template>
  <div
    id="rapor-print-container"
    class="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-4xl mx-auto space-y-6 print:space-y-4 print:p-0 print:border-none print:shadow-none"
  >
    <!-- Formal Letterhead / Kop Surat -->
    <div class="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
      <div>
        <div class="text-xs font-bold text-slate-500 tracking-widest uppercase">
          LPK MIZUNO SEMANGAT BANGSA
        </div>
        <h2 class="text-xl font-black text-slate-900 tracking-tight font-display">
          CABANG JOY · JOYdata
        </h2>
        <div class="text-[11px] text-slate-500 mt-0.5">
          Sistem Informasi Evaluasi Akademik, Karakter & Penempatan Kerja
        </div>
      </div>
      <div class="text-right">
        <div class="text-xs font-bold font-mono text-slate-800">
          {{ $t('rapor.kopJudul') }}
        </div>
        <div class="text-[11px] font-mono text-slate-500 mt-0.5">
          {{ $t('rapor.periodeLabel') }}: <span class="font-bold text-slate-800">{{ raporData.periode }}</span>
        </div>
        <div class="text-[10px] text-slate-400 mt-0.5">
          {{ $t('rapor.tglCetak') }}: {{ printDate }}
        </div>
      </div>
    </div>

    <!-- Student & Academic Identity Block -->
    <div class="border rounded-lg p-4 grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs" :class="warnaIdentitas(raporData.student.statusTag, portal)">
      <div>
        <div class="text-[11px] text-slate-500">{{ $t('common.namaPeserta') }}</div>
        <div class="font-bold text-slate-900 text-sm mt-0.5">{{ raporData.student.nama }}</div>
        <div class="text-[10px] text-slate-400 font-mono">ID #{{ raporData.student.mancationAkunId || raporData.student.id }}</div>
      </div>

      <div>
        <div class="text-[11px] text-slate-500">{{ $t('common.kelas') }}</div>
        <div class="font-bold text-slate-800 mt-0.5">{{ raporData.kelas?.namaKelas || '-' }}</div>
        <div class="text-[10px] text-slate-500">{{ raporData.kelas?.programNama || '-' }}</div>
      </div>

      <div>
        <div class="text-[11px] text-slate-500">Sensei Pengajar</div>
        <div class="font-bold text-slate-800 mt-0.5">{{ raporData.kelas?.senseiNama || '-' }}</div>
        <div class="text-[10px] text-slate-500">Cabang JOY</div>
      </div>

      <PeringkatCell :peringkat="raporData.peringkat" :note="$t('laporan.peringkatBulanIni')" />

      <div v-if="!portal">
        <div class="text-[11px] text-slate-500">{{ $t('progres.statusTag') }}</div>
        <div class="mt-0.5">
          <span
            class="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold"
            :class="{
              'bg-slate-200 text-slate-800': raporData.student.statusTag === 'standar',
              'bg-blue-100 text-blue-800': raporData.student.statusTag === 'berkembang',
              'bg-emerald-100 text-emerald-900 border border-emerald-300':
                raporData.student.statusTag === 'siap_interview',
            }"
          >
            <span v-if="raporData.student.statusTag === 'siap_interview'" class="mr-1">🎯</span>
            {{ $t(`tag.${raporData.student.statusTag}`) }}
          </span>
        </div>
      </div>
      <div v-else>
        <div class="text-[11px] text-slate-500">{{ $t('smartReport.tanggalMasuk') }}</div>
        <div class="font-bold text-slate-800 mt-0.5">{{ raporData.student.tanggalMasuk || '-' }}</div>
      </div>

      <StatusLegend v-if="!portal" :status-tag="raporData.student.statusTag" />
    </div>

    <!-- KPI Executive Summary Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
      <div class="p-3 bg-white border border-slate-200 rounded-lg">
        <div class="text-[11px] font-medium text-slate-500">{{ $t('rapor.rataUjian') }}</div>
        <div
          class="text-xl font-bold font-mono mt-1"
          :class="raporData.kpi.lulusKkmUjian ? 'text-emerald-700' : 'text-slate-800'"
        >
          {{ raporData.kpi.rataUjian !== null ? raporData.kpi.rataUjian : '-' }}
        </div>
        <div class="text-[10px] font-medium text-slate-400 mt-0.5">
          {{ $t('rapor.predikat') }}: <span class="font-bold text-slate-700">{{ raporData.kpi.gradeUjian }}</span> (KKM {{ settings.kkm_ujian }})
        </div>
      </div>

      <div class="p-3 bg-white border border-slate-200 rounded-lg">
        <div class="text-[11px] font-medium text-slate-500">{{ $t('rapor.kaiwaTerakhir') }}</div>
        <div class="text-xl font-bold font-mono mt-1 text-blue-700">
          {{ raporData.kpi.gradeKaiwa }}
        </div>
        <div class="text-[10px] font-medium text-slate-400 mt-0.5">
          {{ raporData.kpi.sesiKaiwa }} {{ $t('rapor.sesiTerlaksana') }}
        </div>
      </div>

      <div class="p-3 bg-white border border-slate-200 rounded-lg">
        <div class="text-[11px] font-medium text-slate-500">{{ $t('rapor.skorSikap', { basis: raporData.sikapData.basis }) }}</div>
        <div
          class="text-xl font-bold font-mono mt-1"
          :class="raporData.kpi.lulusKkmSikap ? 'text-emerald-700' : 'text-red-600'"
        >
          {{ raporData.kpi.skorSikap }}
        </div>
        <div class="text-[10px] font-medium text-slate-400 mt-0.5">
          {{ $t('rapor.predikat') }}: <span class="font-bold text-slate-700">{{ raporData.kpi.predikatSikap }}</span> (KKM {{ settings.kkm_sikap }})
        </div>
      </div>

      <div class="p-3 bg-white border border-slate-200 rounded-lg">
        <div class="text-[11px] font-medium text-slate-500">{{ $t('rapor.rasioKehadiran') }}</div>
        <div
          class="text-xl font-bold font-mono mt-1"
          :class="raporData.kpi.rasioKehadiran !== null && raporData.kpi.rasioKehadiran < settings.ambang_kehadiran_rendah ? 'text-red-600' : 'text-emerald-700'"
        >
          {{ raporData.kpi.rasioKehadiran !== null ? `${raporData.kpi.rasioKehadiran}%` : '-' }}
        </div>
        <div class="text-[10px] font-medium text-slate-400 mt-0.5">
          {{ raporData.absensiData.hadir }} / {{ raporData.absensiData.sesiKelas }} {{ $t('rapor.hariHadir') }}
        </div>
      </div>
    </div>

    <!-- Section 1: Ujian tertulis — a summary in numbers, no list of exams -->
    <div class="space-y-2">
      <div class="flex items-center justify-between border-b border-slate-200 pb-1.5">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">
          1. {{ $t('rapor.secUjian') }}
        </h3>
        <span class="text-[11px] text-slate-500">
          {{ raporData.ujianList.length }} {{ $t('rapor.ujianTercatat') }}
        </span>
      </div>

      <div v-if="ujian" class="grid grid-cols-4 gap-2 text-center">
        <div v-for="cell in ujianCells" :key="cell.label" class="border border-slate-200 rounded py-1.5 px-2">
          <div class="text-[10px] text-slate-500">{{ cell.label }}</div>
          <div class="text-base font-bold font-mono mt-0.5" :class="cell.tone">{{ cell.value }}</div>
          <div class="text-[10px] text-slate-400">{{ cell.note }}</div>
        </div>
      </div>

      <!-- Section averages, for exams scored per section -->
      <div v-if="bagianCells.length" class="grid grid-cols-4 gap-2 text-center">
        <div v-for="cell in bagianCells" :key="cell.key" class="border border-slate-200 rounded py-1.5 px-2">
          <div class="text-[10px] text-slate-500">{{ cell.label }}</div>
          <div class="text-base font-bold font-mono mt-0.5" :class="cell.tone">{{ cell.value }}</div>
        </div>
      </div>

      <p v-if="!raporData.ujianList.length" class="text-xs text-slate-400 text-center py-3 border border-slate-200 rounded">
        {{ $t('rapor.belumAdaUjian') }}
      </p>
    </div>

    <!-- Section 2 (kaiwa) & 3 (sikap): numbers only -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <div class="border-b border-slate-200 pb-1.5">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">2. {{ $t('rapor.secKaiwa') }}</h3>
        </div>
        <StatKaiwa
          :grades="raporData.kaiwaList.map((k: any) => k.grade)"
          :grade-terakhir="raporData.kpi.gradeKaiwa"
          :kaiwa-card="raporData.kaiwaCard"
        />
      </div>
      <div class="space-y-2">
        <div class="border-b border-slate-200 pb-1.5">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">3. {{ $t('rapor.secSikap') }}</h3>
        </div>
        <StatSikap
          :rows="raporData.sikapData.logs"
          :skor="raporData.sikapData.skorAkhir"
          :skor-label="$t('laporan.skorAkhir')"
          :skor-note="$t('laporan.basisKkm', { basis: raporData.sikapData.basis, kkm: settings.kkm_sikap })"
          :lulus-kkm="raporData.sikapData.lulusKkm"
          :basis="raporData.sikapData.basis"
        />
      </div>
    </div>

    <!-- Section 4: Rekap Kehadiran & Section 5: Data Penempatan 名簿 -->
    <div class="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4">
      <!-- Absensi Breakdown -->
      <div class="space-y-2">
        <div class="border-b border-slate-200 pb-1.5">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">
            4. {{ $t('rapor.secAbsensi') }}
          </h3>
        </div>
        <div class="border border-slate-200 rounded p-3 text-xs space-y-1.5">
          <div class="flex justify-between py-0.5 border-b border-slate-50">
            <span class="text-slate-600">Total Sesi Kelas (S):</span>
            <span class="font-mono font-bold text-slate-800">{{ raporData.absensiData.sesiKelas }} sesi</span>
          </div>
          <div class="flex justify-between py-0.5 border-b border-slate-50">
            <span class="text-slate-600">Hadir:</span>
            <span class="font-mono font-bold text-emerald-700">{{ raporData.absensiData.hadir }} hari</span>
          </div>
          <div class="flex justify-between py-0.5 border-b border-slate-50">
            <span class="text-slate-600">Izin:</span>
            <span class="font-mono font-medium text-blue-700">{{ raporData.absensiData.izin }} hari</span>
          </div>
          <div class="flex justify-between py-0.5 border-b border-slate-50">
            <span class="text-slate-600">Sakit:</span>
            <span class="font-mono font-medium text-amber-700">{{ raporData.absensiData.sakit }} hari</span>
          </div>
          <div class="flex justify-between py-0.5 border-b border-slate-50">
            <span class="text-slate-600">Alfa (Tanpa Keterangan):</span>
            <span class="font-mono font-medium text-red-600">{{ raporData.absensiData.alfa }} hari</span>
          </div>
          <div class="flex justify-between pt-1">
            <span class="font-bold text-slate-800">Rasio Kehadiran:</span>
            <span class="font-mono font-bold text-slate-900">
              {{ raporData.absensiData.rasioKehadiran !== null ? `${raporData.absensiData.rasioKehadiran}%` : '-' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Data Penempatan 名簿 -->
      <div class="space-y-2">
        <div class="border-b border-slate-200 pb-1.5 flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">
            5. {{ $t('rapor.secPenempatan') }}
          </h3>
          <span class="text-[10px] text-slate-400">Data 名簿</span>
        </div>
        <div class="border border-slate-200 rounded p-3 text-xs space-y-1.5">
          <div class="flex justify-between py-0.5 border-b border-slate-50">
            <span class="text-slate-600">Tanggal Lulus Ujian (合格日):</span>
            <span class="font-mono font-medium text-slate-800">{{ raporData.penempatan.tanggalLulusUjian || '-' }}</span>
          </div>
          <div class="flex justify-between py-0.5 border-b border-slate-50">
            <span class="text-slate-600">Perusahaan Naitei (内定企業名):</span>
            <span class="font-bold text-slate-800">{{ raporData.penempatan.perusahaanNaitei || '-' }}</span>
          </div>
          <div class="flex justify-between py-0.5 border-b border-slate-50">
            <span class="text-slate-600">Jenis Pekerjaan (内定した業務):</span>
            <span class="text-slate-800">{{ raporData.penempatan.jenisPekerjaan || '-' }}</span>
          </div>
          <div class="flex justify-between py-0.5 border-b border-slate-50">
            <span class="text-slate-600">Lokasi Kerja (勤務地):</span>
            <span class="text-slate-800">{{ raporData.penempatan.lokasiKerja || '-' }}</span>
          </div>
          <div class="flex justify-between py-0.5 border-b border-slate-50">
            <span class="text-slate-600">Rencana Mulai Kerja (就業開始予定日):</span>
            <span class="font-mono font-medium text-slate-800">{{ raporData.penempatan.rencanaMulaiKerja || '-' }}</span>
          </div>
          <div class="flex justify-between pt-1">
            <span class="text-slate-600">Pendidikan Terakhir (最終学歴):</span>
            <span class="text-slate-800 font-medium text-right">
              {{ raporData.penempatan.pendidikanTerakhir || '-' }}
              <span v-if="raporData.penempatan.pendidikanTerakhirJa" class="block font-normal">
                {{ raporData.penempatan.pendidikanTerakhirJa }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- One overall review (the Smart Report resume), at the bottom -->
    <ResumeCard
      v-if="raporData.resume"
      :title="$t('laporan.reviewJudul')"
      :resume="raporData.resume"
      :can-write="false"
      :generate="noop"
      :save="noop"
      date-only
    />
    <p v-else-if="!portal" class="no-print text-[11px] text-slate-400 italic">{{ $t('laporan.reviewBelumAda') }}</p>

    <!-- Formal Signatures / Lembar Pengesahan -->
    <div class="rapor-signatures pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 text-center text-xs">
      <div>
        <div class="text-[11px] text-slate-500 mb-12">Sensei Pengajar / Pembimbing</div>
        <div class="font-bold text-slate-900 border-t border-slate-300 pt-1.5">
          {{ raporData.kelas?.senseiNama || '( ........................................ )' }}
        </div>
        <div class="text-[10px] text-slate-400">Instruktur Bahasa Jepang</div>
      </div>

      <div>
        <div class="text-[11px] text-slate-500 mb-12">Peserta Pelatihan (Siswa)</div>
        <div class="font-bold text-slate-900 border-t border-slate-300 pt-1.5">
          {{ raporData.student.nama }}
        </div>
        <div class="text-[10px] text-slate-400">Siswa Cabang JOY</div>
      </div>

      <div>
        <div class="text-[11px] text-slate-500 mb-12">Kepala Cabang / Manager LPK</div>
        <div class="font-bold text-slate-900 border-t border-slate-300 pt-1.5">
          Mizuno Semangat Bangsa
        </div>
        <div class="text-[10px] text-slate-400">Cabang JOY</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import ResumeCard from '../smart-report/ResumeCard.vue';
import StatKaiwa from '../smart-report/StatKaiwa.vue';
import StatSikap from '../smart-report/StatSikap.vue';
import StatusLegend from '../smart-report/StatusLegend.vue';
import PeringkatCell from '../smart-report/PeringkatCell.vue';
import { ringkasUjian, bertanda, warnaIdentitas } from '../smart-report/reportStats.js';

// The printable monthly rapor (A4), for staff (RaporView) and for the peserta portal: numbers per section and
// one overall review at the bottom.
const props = defineProps<{
  raporData: any;
  // kkm_ujian, kkm_sikap, ambang_kehadiran_rendah
  settings: any;
  printDate: string;
  // Peserta portal: leaves out the status tag.
  portal?: boolean;
}>();

const { t } = useI18n();

const noop = async () => {};


const BAGIAN = [
  { key: 'nilaiMojiGoi', label: 'Moji-Goi' },
  { key: 'nilaiBunpou', label: 'Bunpou' },
  { key: 'nilaiDokkai', label: 'Dokkai' },
  { key: 'nilaiChoukai', label: 'Choukai' },
];

// Average per section this month; single-score exams have none, so the row only shows for section-scored ones.
const bagianCells = computed(() => {
  const cells = BAGIAN.map(({ key, label }) => {
    const nilai = props.raporData.ujianList.map((u: any) => u[key]).filter((v: any) => v !== null && v !== undefined);
    const rata = nilai.length ? Math.round((nilai.reduce((a: number, b: number) => a + b, 0) / nilai.length) * 10) / 10 : null;
    return {
      key,
      label: t('laporan.rataBagian', { bagian: label }),
      value: rata ?? '-',
      tone: rata === null ? 'text-slate-400' : rata >= props.settings.kkm_ujian ? 'text-slate-900' : 'text-red-600',
      ada: rata !== null,
    };
  });
  return cells.some((c) => c.ada) ? cells : [];
});

const ujian = computed(() =>
  ringkasUjian(props.raporData.ujianList.map((u: any) => ({ kode: u.codeUjian, nilai: u.nilaiAvg, lulus: u.lulusKkm })))
);

const ujianCells = computed(() => {
  const s = ujian.value;
  if (!s) return [];
  return [
    { label: t('laporan.tertinggi'), value: s.tertinggi.nilai, note: s.tertinggi.kode, tone: 'text-slate-900' },
    { label: t('laporan.terendah'), value: s.terendah.nilai, note: s.terendah.kode, tone: 'text-slate-900' },
    {
      label: t('laporan.lulusKkm', { kkm: props.settings.kkm_ujian }),
      value: `${s.lulus}/${s.jumlah}`,
      note: t('laporan.ujian'),
      tone: s.lulus === s.jumlah ? 'text-emerald-700' : 'text-amber-700',
    },
    {
      label: t('laporan.perubahan'),
      value: bertanda(s.selisih),
      note: t('laporan.pertamaTerakhir'),
      tone: s.selisih === null || s.selisih === 0 ? 'text-slate-900' : s.selisih > 0 ? 'text-emerald-700' : 'text-red-600',
    },
  ];
});
</script>

<style>
@media print {
  /* Hide navbar, sidebar, buttons, breadcrumbs during print */
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

  /* The drawer and app bar are hidden, so drop the space Vuetify reserves for them (page padding: App.vue print:p-0). */
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

  body {
    color: black !important;
    font-size: 11pt !important;
  }

  #rapor-print-container {
    max-width: 100% !important;
    border: none !important;
    padding: 0 !important;
    box-shadow: none !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    /* Fit a typical month on one A4 page; zoom (unlike transform) also shrinks the layout used for page breaks. */
    zoom: 0.85;
  }

  /* Keep table rows and the signature block whole across page breaks. */
  #rapor-print-container tr,
  .rapor-signatures,
  #rapor-print-container .sr-resume {
    break-inside: avoid;
  }

  @page {
    size: A4 portrait;
    margin: 1cm 1.2cm;
  }
}
</style>
