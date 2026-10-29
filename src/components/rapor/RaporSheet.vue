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
    <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
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

    <!-- Section 1: Rincian Ujian Tertulis -->
    <div class="space-y-2">
      <div class="flex items-center justify-between border-b border-slate-200 pb-1.5">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">
          1. {{ $t('rapor.secUjian') }}
        </h3>
        <span class="text-[11px] text-slate-500">
          {{ raporData.ujianList.length }} {{ $t('rapor.ujianTercatat') }}
        </span>
      </div>

      <table class="w-full text-left text-xs border border-slate-200 rounded">
        <thead class="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] font-semibold">
          <tr>
            <th class="py-2 px-2.5">Tanggal</th>
            <th class="py-2 px-2.5">Kode Ujian</th>
            <th class="py-2 px-2 text-center">Pola</th>
            <th class="py-2 px-2 text-center">Moji-Goi</th>
            <th class="py-2 px-2 text-center">Bunpou</th>
            <th class="py-2 px-2 text-center">Dokkai</th>
            <th class="py-2 px-2 text-center">Choukai</th>
            <th class="py-2 px-2 text-center">Tunggal</th>
            <th class="py-2 px-2.5 text-center font-bold">Rata-rata</th>
            <th class="py-2 px-2 text-center">Grade</th>
            <th class="py-2 px-2.5 text-center">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="raporData.ujianList.length === 0">
            <td colspan="11" class="py-4 text-center text-slate-400">
              {{ $t('rapor.belumAdaUjian') }}
            </td>
          </tr>
          <tr v-for="u in raporData.ujianList" :key="u.id" class="font-mono">
            <td class="py-1.5 px-2.5 text-slate-700 font-sans">{{ u.tanggalUjian }}</td>
            <td class="py-1.5 px-2.5 font-bold text-slate-800">{{ u.codeUjian }}</td>
            <td class="py-1.5 px-2 text-center text-[10px] text-slate-500 uppercase">{{ u.pola }}</td>
            <td class="py-1.5 px-2 text-center text-slate-600">{{ u.nilaiMojiGoi ?? '-' }}</td>
            <td class="py-1.5 px-2 text-center text-slate-600">{{ u.nilaiBunpou ?? '-' }}</td>
            <td class="py-1.5 px-2 text-center text-slate-600">{{ u.nilaiDokkai ?? '-' }}</td>
            <td class="py-1.5 px-2 text-center text-slate-600">{{ u.nilaiChoukai ?? '-' }}</td>
            <td class="py-1.5 px-2 text-center text-slate-600">{{ u.nilaiTunggal ?? '-' }}</td>
            <td class="py-1.5 px-2.5 text-center font-bold text-slate-900 bg-slate-50/50">
              {{ u.nilaiAvg !== null ? u.nilaiAvg : '-' }}
            </td>
            <td class="py-1.5 px-2 text-center font-bold">{{ u.grade }}</td>
            <td class="py-1.5 px-2.5 text-center text-[10px] font-sans font-semibold">
              <span :class="u.lulusKkm ? 'text-emerald-700' : 'text-red-600'">
                {{ u.lulusKkm ? $t('rapor.lulus') : $t('rapor.tidakLulus') }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section 2: Evaluasi Lisan & Percakapan (Kaiwa) -->
    <div class="space-y-2">
      <div class="flex items-center justify-between border-b border-slate-200 pb-1.5">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">
          2. {{ $t('rapor.secKaiwa') }}
        </h3>
        <span class="text-[11px] font-mono text-slate-600">
          Grade Akhir: <strong class="text-blue-700">{{ raporData.kpi.gradeKaiwa }}</strong>
        </span>
      </div>

      <table class="w-full text-left text-xs border border-slate-200 rounded">
        <thead class="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] font-semibold">
          <tr>
            <th class="py-2 px-2.5 w-28">Tanggal</th>
            <th class="py-2 px-2.5 w-20 text-center">Grade</th>
            <th class="py-2 px-4">Catatan & Evaluasi Percakapan Sensei</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="raporData.kaiwaList.length === 0">
            <td colspan="3" class="py-4 text-center text-slate-400">
              {{ $t('rapor.belumAdaKaiwa') }}
            </td>
          </tr>
          <tr v-for="k in raporData.kaiwaList" :key="k.id">
            <td class="py-1.5 px-2.5 font-mono text-slate-700">{{ k.tanggalKaiwa }}</td>
            <td class="py-1.5 px-2.5 text-center font-mono font-bold text-blue-800">{{ k.grade }}</td>
            <td class="py-1.5 px-4 text-slate-700 italic">
              {{ k.description || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section 3: Evaluasi Sikap & Kedisiplinan -->
    <div class="space-y-2">
      <div class="flex items-center justify-between border-b border-slate-200 pb-1.5">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">
          3. {{ $t('rapor.secSikap') }}
        </h3>
        <span class="text-[11px] text-slate-600">
          Basis: <strong class="font-mono">{{ raporData.sikapData.basis }}</strong> · Skor Akhir:
          <strong class="font-mono" :class="raporData.sikapData.lulusKkm ? 'text-emerald-700' : 'text-red-600'">
            {{ raporData.sikapData.skorAkhir }} ({{ raporData.sikapData.predikat }})
          </strong>
        </span>
      </div>

      <table class="w-full text-left text-xs border border-slate-200 rounded">
        <thead class="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] font-semibold">
          <tr>
            <th class="py-2 px-2.5 w-28">Tanggal</th>
            <th class="py-2 px-3">Kategori Kejadian</th>
            <th class="py-2 px-2 text-center w-20">Dampak</th>
            <th v-if="!portal" class="py-2 px-4">Keterangan / Catatan Observasi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-if="raporData.sikapData.logs.length === 0">
            <td :colspan="portal ? 3 : 4" class="py-3 text-center text-slate-400">
              {{ $t('rapor.tidakAdaInsidenSikap', { basis: raporData.sikapData.basis, predikat: raporData.sikapData.predikat }) }}
            </td>
          </tr>
          <tr v-for="s in raporData.sikapData.logs" :key="s.id">
            <td class="py-1.5 px-2.5 font-mono text-slate-700">{{ s.tanggalPenilaian }}</td>
            <td class="py-1.5 px-3 font-medium text-slate-800">
              {{ locale === 'ja' ? s.kategoriNamaJa : s.kategoriNamaId }}
            </td>
            <td class="py-1.5 px-2 text-center font-mono font-bold">
              <span v-if="s.sentiment === 'positif'" class="text-emerald-700">+{{ s.bobot }}</span>
              <span v-else class="text-red-600">−{{ s.bobot }}</span>
            </td>
            <td v-if="!portal" class="py-1.5 px-4 text-slate-600">
              {{ s.description || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
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
import { useI18n } from 'vue-i18n';

// The printable monthly rapor (A4), for staff (RaporView) and for the peserta portal.
defineProps<{
  raporData: any;
  // kkm_ujian, kkm_sikap, ambang_kehadiran_rendah
  settings: any;
  printDate: string;
  // Peserta portal: leaves out the status tag and the free-text sikap notes.
  portal?: boolean;
}>();

const { locale } = useI18n();
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
  .rapor-signatures {
    break-inside: avoid;
  }

  @page {
    size: A4 portrait;
    margin: 1cm 1.2cm;
  }
}
</style>
