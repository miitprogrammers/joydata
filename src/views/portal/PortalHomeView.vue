<template>
  <div v-if="report" class="space-y-4">
    <section class="joy-surface p-5">
      <h1 class="text-xl font-bold text-slate-900 font-display">{{ $t('portal.halo', { nama: report.peserta.nama }) }}</h1>
      <p class="text-sm text-slate-600 mt-1">
        {{ [report.kelas?.namaKelas, locale === 'ja' ? report.kelas?.programNamaJa : report.kelas?.programNama].filter(Boolean).join(' · ') }}
      </p>
      <p class="text-xs text-slate-500 mt-0.5">
        <span v-if="report.kelas?.senseiNama && report.kelas.senseiNama !== '-'">{{ $t('portal.senseiNama', { nama: report.kelas.senseiNama }) }} · </span>
        <span v-if="report.peserta.tanggalMasuk">{{ $t('portal.mulaiBelajar', { tanggal: tanggal(report.peserta.tanggalMasuk) }) }}</span>
      </p>
    </section>

    <KaiwaCard :card="report.kaiwaCard">
      <router-link to="/portal/kaiwa" class="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
        {{ $t('portal.kaiwaCard.lihatRiwayat') }}
        <v-icon icon="mdi-chevron-right" size="16" />
      </router-link>
    </KaiwaCard>

    <!-- KPI tiles -->
    <section class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <router-link to="/portal/ujian" class="joy-surface p-4 block hover:border-slate-300">
        <p class="text-xs font-medium text-slate-500">{{ $t('portal.rataUjian') }}</p>
        <p class="text-2xl font-bold text-slate-900 tabular-nums mt-1">
          {{ num(report.kpi.rataUjian) }}<span v-if="report.kpi.rataUjian !== null" class="text-sm font-semibold text-slate-500"> {{ report.kpi.gradeUjian }}</span>
        </p>
        <p v-if="report.kpi.lulusKkmUjian !== null" class="text-xs mt-1" :class="report.kpi.lulusKkmUjian ? 'text-emerald-700' : 'text-red-600'">
          {{ $t(report.kpi.lulusKkmUjian ? 'portal.lulusKkm' : 'portal.bawahKkm', { kkm: report.settings.kkm_ujian }) }}
        </p>
      </router-link>
      <router-link to="/portal/kehadiran" class="joy-surface p-4 block hover:border-slate-300">
        <p class="text-xs font-medium text-slate-500">{{ $t('portal.kehadiran') }}</p>
        <p class="text-2xl font-bold tabular-nums mt-1" :class="report.kpi.kehadiranRendah ? 'text-red-600' : 'text-slate-900'">
          {{ report.kpi.rasioKehadiran === null ? '-' : `${num(report.kpi.rasioKehadiran)}%` }}
        </p>
        <p class="text-xs text-slate-500 mt-1">
          {{ report.absensi.hadir }}/{{ report.absensi.sesi }} {{ $t('portal.sesi').toLowerCase() }}
        </p>
      </router-link>
      <router-link to="/portal/ujian" class="joy-surface p-4 block hover:border-slate-300">
        <p class="text-xs font-medium text-slate-500">{{ $t('portal.peringkat') }}</p>
        <p class="text-2xl font-bold text-slate-900 tabular-nums mt-1">{{ report.peringkat?.posisi ?? '-' }}</p>
        <p class="text-xs text-slate-500 mt-1">
          <template v-if="report.peringkat?.posisi">{{ $t('portal.dariN', { n: report.peringkat.jumlahDinilai }) }} · </template>
          {{ $t('portal.rataKelas', { nilai: num(report.peringkat?.rataKelas) }) }}
        </p>
      </router-link>
      <router-link to="/portal/sikap" class="joy-surface p-4 block hover:border-slate-300">
        <p class="text-xs font-medium text-slate-500">{{ $t('portal.sikap') }}</p>
        <p class="text-2xl font-bold text-slate-900 tabular-nums mt-1">
          {{ num(report.kpi.skorSikap) }}<span v-if="report.kpi.skorSikap !== null" class="text-sm font-semibold text-slate-500"> {{ report.kpi.predikatSikap }}</span>
        </p>
        <p v-if="report.kpi.lulusKkmSikap !== null" class="text-xs mt-1" :class="report.kpi.lulusKkmSikap ? 'text-emerald-700' : 'text-red-600'">
          {{ $t(report.kpi.lulusKkmSikap ? 'portal.lulusKkm' : 'portal.bawahKkm', { kkm: report.settings.kkm_sikap }) }}
        </p>
      </router-link>
    </section>

    <!-- Latest exams -->
    <section class="joy-surface p-5">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-base font-bold text-slate-900 font-display">{{ $t('portal.ujianTerbaru') }}</h2>
        <router-link to="/portal/ujian" class="text-xs font-semibold text-primary hover:underline">{{ $t('portal.lihatSemua') }}</router-link>
      </div>
      <p v-if="!ujianTerbaru.length" class="text-sm text-slate-500">{{ $t('portal.ujianKosong') }}</p>
      <ul v-else class="divide-y divide-slate-100">
        <li v-for="u in ujianTerbaru" :key="u.id" class="py-2.5 flex items-center justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-900">{{ u.kode || '-' }}</p>
            <p class="text-xs text-slate-500">{{ tanggal(u.tanggal) }}</p>
          </div>
          <p class="text-lg font-bold tabular-nums shrink-0" :class="u.lulusKkm ? 'text-slate-900' : 'text-red-600'">
            {{ num(u.rata, 2) }} <span class="text-xs font-semibold text-slate-500">{{ u.grade }}</span>
          </p>
        </li>
      </ul>
    </section>

    <!-- Documents -->
    <section class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <router-link
        v-for="doc in DOKUMEN"
        :key="doc.to"
        :to="doc.to"
        class="joy-surface p-4 flex items-center gap-3 hover:border-slate-300"
      >
        <span class="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
          <v-icon :icon="doc.icon" size="22" />
        </span>
        <span class="min-w-0">
          <span class="block text-sm font-semibold text-slate-900">{{ $t(`portal.menu.${doc.key}`) }}</span>
          <span class="block text-xs text-slate-500">{{ $t(`portal.dokumen.${doc.key}Desc`) }}</span>
        </span>
        <v-icon icon="mdi-chevron-right" size="18" class="ml-auto text-slate-400" />
      </router-link>
    </section>

    <p class="text-center text-xs text-slate-400 pt-2 pb-6">{{ $t('portal.footer') }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { usePortalSession, usePortalFormat } from '../../services/portalSession.js';
import KaiwaCard from '../../components/portal/KaiwaCard.vue';

const DOKUMEN = [
  { key: 'rapor', to: '/portal/rapor', icon: 'mdi-file-certificate-outline' },
  { key: 'smartReport', to: '/portal/smart-report', icon: 'mdi-file-chart-outline' },
];

const { locale } = useI18n();
const { report } = usePortalSession();
const { num, tanggal } = usePortalFormat();

const ujianTerbaru = computed(() => [...(report.value?.ujian.daftar || [])].reverse().slice(0, 3));
</script>
