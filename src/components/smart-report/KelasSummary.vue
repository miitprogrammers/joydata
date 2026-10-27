<template>
  <article
    class="sr-page bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-4xl mx-auto space-y-5 print:p-0 print:border-none print:shadow-none print:rounded-none"
  >
    <ReportHeader :title="$t('smartReport.kopJudulKelas')" :rentang="summary.rentang" :print-date="printDate" />

    <div class="bg-slate-50 border border-slate-200 rounded-lg p-3.5 grid grid-cols-3 gap-3 text-xs">
      <div>
        <div class="text-[11px] text-slate-500">{{ $t('common.kelas') }}</div>
        <div class="font-bold text-slate-900 text-sm mt-0.5">{{ kelas.namaKelas }}</div>
      </div>
      <div>
        <div class="text-[11px] text-slate-500">{{ $t('smartReport.program') }}</div>
        <div class="font-bold text-slate-800 mt-0.5">{{ locale === 'ja' ? kelas.programNamaJa : kelas.programNama }}</div>
      </div>
      <div>
        <div class="text-[11px] text-slate-500">{{ $t('smartReport.sensei') }}</div>
        <div class="font-bold text-slate-800 mt-0.5">{{ kelas.senseiNama }}</div>
      </div>
    </div>

    <!-- Statistik kelas -->
    <div class="grid grid-cols-2 sm:grid-cols-5 print:grid-cols-5 gap-2.5 text-center">
      <div v-for="tile in tiles" :key="tile.label" class="p-2.5 border border-slate-200 rounded-lg">
        <div class="text-[10px] font-medium text-slate-500 leading-tight">{{ tile.label }}</div>
        <div class="text-lg font-bold mt-1" :class="tile.tone">{{ tile.value }}</div>
        <div class="text-[9.5px] text-slate-400 leading-tight mt-0.5">{{ tile.note }}</div>
      </div>
    </div>

    <ResumeCard
      :title="$t('smartReport.resumeKelasJudul')"
      :resume="resume"
      :can-write="canWrite"
      :busy="busy"
      :generate="generate"
      :save="save"
    />

    <div class="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-5 sr-keep">
      <div class="md:col-span-2 print:col-span-2 space-y-1.5">
        <h3 class="sr-section-title">{{ $t('smartReport.secTrenKelas') }}</h3>
        <ScoreTrendChart
          :points="trendPoints"
          :kkm="settings.kkm_ujian"
          :aria-label="$t('smartReport.grafikAria', { n: trendPoints.length, kkm: settings.kkm_ujian })"
        />
      </div>
      <div class="space-y-3">
        <div class="space-y-1.5">
          <h3 class="sr-section-title">{{ $t('smartReport.secDistribusi') }}</h3>
          <div class="grid grid-cols-4 gap-1.5 text-center">
            <div v-for="(count, grade) in summary.distribusiGrade" :key="grade" class="border border-slate-200 rounded py-1">
              <div class="text-[10px] font-bold text-slate-500">{{ grade }}</div>
              <div class="text-sm font-bold text-slate-900">{{ count }}</div>
            </div>
          </div>
        </div>
        <div class="space-y-1.5">
          <h3 class="sr-section-title">{{ $t('smartReport.secBagian') }}</h3>
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
        </div>
      </div>
    </div>

    <!-- Peringkat -->
    <div class="space-y-1.5">
      <div class="sr-title-row">
        <h3 class="sr-section-title">{{ $t('smartReport.secPeringkat') }}</h3>
        <span class="text-[10px] text-slate-400 text-right">{{ $t('smartReport.peringkatDasar') }}</span>
      </div>
      <table class="sr-table">
        <thead>
          <tr>
            <th class="text-center w-8">#</th>
            <th>{{ $t('smartReport.colNama') }}</th>
            <th class="text-center">{{ $t('smartReport.colRata') }}</th>
            <th class="text-center">{{ $t('smartReport.colGrade') }}</th>
            <th class="text-center">{{ $t('smartReport.colLulusUjian') }}</th>
            <th class="text-center">{{ $t('smartReport.colKehadiran') }}</th>
            <th class="text-center">{{ $t('smartReport.colSikap') }}</th>
            <th class="text-center">{{ $t('smartReport.colKaiwa') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in summary.ranking" :key="r.pesertaId" class="sr-num">
            <td class="text-center font-bold text-slate-900">{{ r.peringkat ?? '-' }}</td>
            <td class="font-sans font-medium text-slate-800">{{ r.nama }}</td>
            <td class="text-center font-bold" :class="statusClass(r.lulusKkmUjian)">
              {{ r.rataUjian !== null ? fmt(r.rataUjian) : '' }}
              <span v-if="r.rataUjian === null" class="font-sans font-normal text-slate-400">{{ $t('smartReport.belumAdaNilai') }}</span>
            </td>
            <td class="text-center font-bold">{{ r.rataUjian !== null ? r.gradeUjian : '-' }}</td>
            <td class="text-center">{{ r.jumlahUjian ? `${r.jumlahLulusUjian}/${r.jumlahUjian}` : '-' }}</td>
            <td class="text-center" :class="r.kehadiranRendah ? 'text-red-600 font-bold' : ''">
              {{ r.rasioKehadiran !== null ? `${r.rasioKehadiran}%` : '-' }}
            </td>
            <td class="text-center" :class="r.lulusKkmSikap === false ? 'text-red-600 font-bold' : ''">{{ fmt(r.skorSikap) }}</td>
            <td class="text-center">{{ r.kaiwaTerakhir || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Perlu perhatian -->
    <div class="space-y-1.5 sr-keep">
      <h3 class="sr-section-title">{{ $t('smartReport.secPerhatian') }}</h3>
      <div v-if="summary.perluPerhatian.length" class="flex flex-wrap gap-1.5">
        <div
          v-for="p in summary.perluPerhatian"
          :key="p.pesertaId"
          class="border border-slate-200 rounded-md px-2 py-1 text-[11px] flex items-center gap-1.5"
        >
          <v-icon icon="mdi-alert-circle-outline" size="13" class="text-red-600" />
          <span class="font-semibold text-slate-800">{{ p.nama }}</span>
          <span class="text-slate-500">{{ p.alasan.map((a) => $t(`smartReport.alasan_${a}`)).join(' · ') }}</span>
        </div>
      </div>
      <div v-else class="text-[11px] text-slate-400">{{ $t('smartReport.tidakAdaPerhatian') }}</div>
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
  kelas: any;
  summary: any;
  resume: any;
  settings: any;
  printDate: string;
  canWrite: boolean;
  busy?: boolean;
  generate: () => Promise<void>;
  save: (payload: { teksId: string; teksJa: string }) => Promise<void>;
}>();

const { t, locale } = useI18n();

function fmt(v: number | null | undefined) {
  if (v === null || v === undefined || !Number.isFinite(v)) return '-';
  return String(Math.round(v * 100) / 100);
}

function statusClass(lulus: boolean | null) {
  if (lulus === null) return 'text-slate-800';
  return lulus ? 'text-emerald-700' : 'text-red-600';
}

const tiles = computed(() => {
  const s = props.summary.statistik;
  const st = props.settings;
  return [
    {
      label: t('smartReport.jumlahPeserta'),
      value: s.jumlahPeserta,
      note: t('smartReport.dinilaiDari', { n: s.jumlahDinilai }),
      tone: 'text-slate-900',
    },
    {
      label: t('smartReport.rataKelas'),
      value: fmt(s.rataKelas),
      note: t('smartReport.medianSimpangan', { median: fmt(s.median), sd: fmt(s.simpanganBaku) }),
      tone: s.rataKelas === null ? 'text-slate-800' : s.rataKelas >= st.kkm_ujian ? 'text-emerald-700' : 'text-red-600',
    },
    {
      label: t('smartReport.lulusKkmKelas'),
      value: `${s.jumlahLulusKkm}/${s.jumlahDinilai}`,
      note: t('smartReport.lulusKkmKelasDesc', { n: s.jumlahDinilai, kkm: st.kkm_ujian }),
      tone: 'text-slate-900',
    },
    {
      label: t('smartReport.rataKehadiranKelas'),
      value: s.rataKehadiran !== null ? `${s.rataKehadiran}%` : '-',
      note: t('smartReport.kehadiranRendahN', { n: s.jumlahKehadiranRendah, ambang: st.ambang_kehadiran_rendah }),
      tone: s.jumlahKehadiranRendah ? 'text-amber-700' : 'text-emerald-700',
    },
    {
      label: t('smartReport.rataSikapKelas'),
      value: fmt(s.rataSikap),
      note: t('smartReport.sikapBawahKkmN', { n: s.jumlahSikapBawahKkm, kkm: st.kkm_sikap }),
      tone: s.jumlahSikapBawahKkm ? 'text-amber-700' : 'text-emerald-700',
    },
  ];
});

const trendPoints = computed(() =>
  props.summary.perUjian.map((u: any) => ({
    label: u.kode,
    value: u.rata,
    title: `${u.kode} · ${u.tanggal} · ${fmt(u.rata)} (${u.jumlahPeserta}, ${fmt(u.terendah)}–${fmt(u.tertinggi)})`,
  }))
);

const bagianRows = computed(() =>
  ['mojiGoi', 'bunpou', 'dokkai', 'choukai'].map((key) => ({ key, value: props.summary.bagian[key] }))
);
</script>
