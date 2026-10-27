<template>
  <div class="space-y-6">
    <!-- Non-print Header & Controls -->
    <div class="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 font-display">
          {{ $t('rapor.title') }}
        </h1>
        <p class="text-sm text-slate-600 mt-0.5">
          {{ $t('rapor.subtitle') }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="raporData"
          type="button"
          class="joy-btn-secondary text-xs flex items-center gap-1.5"
          @click="openPenempatanModal"
        >
          <v-icon icon="mdi-card-account-details-outline" size="16" />
          <span>{{ $t('rapor.editPenempatan') }}</span>
        </button>

        <button
          v-if="raporData"
          type="button"
          class="joy-btn-primary text-xs flex items-center gap-1.5 shadow-sm"
          @click="handlePrintRapor"
        >
          <v-icon icon="mdi-printer" size="16" />
          <span>{{ $t('rapor.cetakPdf') }}</span>
        </button>
      </div>
    </div>

    <!-- Non-print Selection Bar -->
    <div class="no-print joy-surface p-4 flex flex-wrap items-center gap-4">
      <!-- Student Selector -->
      <div class="flex-1 min-w-[240px]">
        <label class="block text-xs font-semibold text-slate-700 mb-1">
          {{ $t('rapor.pilihPeserta') }}:
        </label>
        <select
          v-model="selectedPesertaId"
          class="joy-input w-full py-1.5 px-3 text-xs font-medium"
          @change="fetchRapor"
        >
          <option value="">-- {{ $t('rapor.pilihPesertaPlaceholder') }} --</option>
          <option v-for="p in allPesertaList" :key="p.id" :value="p.id">
            {{ p.nama }} (ID #{{ p.mancationAkunId || p.id }}) - {{ p.namaKelas }}
          </option>
        </select>
      </div>

      <!-- Periode Picker -->
      <div class="w-40">
        <label class="block text-xs font-semibold text-slate-700 mb-1">
          {{ $t('common.periode') }}:
        </label>
        <input
          v-model="selectedPeriode"
          type="month"
          class="joy-input w-full py-1.5 px-2.5 text-xs font-medium"
          @change="fetchRapor"
        />
      </div>

      <!-- Reload button -->
      <div class="self-end pb-0.5">
        <button
          type="button"
          class="joy-btn-secondary text-xs py-2 px-3"
          :disabled="!selectedPesertaId || loading"
          @click="fetchRapor"
        >
          <v-icon icon="mdi-refresh" size="16" />
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="joy-surface p-12 text-center text-slate-500 no-print">
      <v-progress-circular indeterminate color="primary" size="32" class="mb-3" />
      <div class="text-sm font-medium">{{ $t('common.memuat') }}</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="joy-surface p-8 text-center text-red-600 bg-red-50/50 border border-red-200 no-print">
      <div class="text-sm font-semibold">{{ error }}</div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!raporData" class="joy-surface p-12 text-center text-slate-400 no-print">
      <v-icon icon="mdi-file-certificate-outline" size="48" class="text-slate-300 mb-2" />
      <div class="text-sm font-medium text-slate-600">{{ $t('rapor.silakanPilihPeserta') }}</div>
      <div class="text-xs text-slate-400 mt-1">{{ $t('rapor.petunjukPilih') }}</div>
    </div>

    <!-- PRINTABLE DIGITAL RAPOR SHEET (A4 ready) -->
    <div
      v-else
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

        <div>
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
            {{ $t('rapor.predikat') }}: <span class="font-bold text-slate-700">{{ raporData.kpi.gradeUjian }}</span> (KKM {{ appStore.settings.kkm_ujian }})
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
            {{ $t('rapor.predikat') }}: <span class="font-bold text-slate-700">{{ raporData.kpi.predikatSikap }}</span> (KKM {{ appStore.settings.kkm_sikap }})
          </div>
        </div>

        <div class="p-3 bg-white border border-slate-200 rounded-lg">
          <div class="text-[11px] font-medium text-slate-500">{{ $t('rapor.rasioKehadiran') }}</div>
          <div
            class="text-xl font-bold font-mono mt-1"
            :class="raporData.kpi.rasioKehadiran !== null && raporData.kpi.rasioKehadiran < appStore.settings.ambang_kehadiran_rendah ? 'text-red-600' : 'text-emerald-700'"
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
              <th class="py-2 px-4">Keterangan / Catatan Observasi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="raporData.sikapData.logs.length === 0">
              <td colspan="4" class="py-3 text-center text-slate-400">
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
              <td class="py-1.5 px-4 text-slate-600">
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
              <span class="text-slate-800 font-medium">{{ raporData.penempatan.pendidikanTerakhir || '-' }}</span>
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

    <!-- Edit Penempatan Modal (§15 mainIdea.md) -->
    <v-dialog v-model="penempatanModal" max-width="500">
      <div class="bg-white rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-base font-bold text-slate-900 font-display">
            {{ $t('rapor.modalPenempatanJudul') }}
          </h3>
          <button type="button" class="text-slate-400 hover:text-slate-600" @click="penempatanModal = false">
            <v-icon icon="mdi-close" size="20" />
          </button>
        </div>

        <form class="space-y-3 text-xs" @submit.prevent="savePenempatan">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              Tanggal Lulus Ujian (合格日):
            </label>
            <input
              v-model="penempatanForm.tanggalLulusUjian"
              type="date"
              class="joy-input w-full p-2 text-xs"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              Perusahaan Naitei (内定企業名):
            </label>
            <input
              v-model="penempatanForm.perusahaanNaitei"
              type="text"
              class="joy-input w-full p-2 text-xs"
              placeholder="Contoh: Toyota Boshoku / Tokyo Kaigo KK"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              Jenis Pekerjaan (内定した業務):
            </label>
            <input
              v-model="penempatanForm.jenisPekerjaan"
              type="text"
              class="joy-input w-full p-2 text-xs"
              placeholder="Contoh: Kaigo / Pengelasan / Fabrikasi"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              Lokasi Kerja / Prefektur (勤務地):
            </label>
            <input
              v-model="penempatanForm.lokasiKerja"
              type="text"
              class="joy-input w-full p-2 text-xs"
              placeholder="Contoh: Aichi / Tokyo / Kanagawa"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              Rencana Mulai Kerja (就業開始予定日):
            </label>
            <input
              v-model="penempatanForm.rencanaMulaiKerja"
              type="date"
              class="joy-input w-full p-2 text-xs"
            />
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">
              Pendidikan Terakhir (最終学歴):
            </label>
            <input
              v-model="penempatanForm.pendidikanTerakhir"
              type="text"
              class="joy-input w-full p-2 text-xs"
              placeholder="Contoh: SMK Mesin / S1 Sastra Jepang / SMA IPA"
            />
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" class="joy-btn-secondary text-xs" @click="penempatanModal = false">
              {{ $t('common.batal') }}
            </button>
            <button type="submit" class="joy-btn-primary text-xs" :disabled="savingPenempatan">
              {{ savingPenempatan ? $t('common.menyimpan') : $t('common.simpan') }}
            </button>
          </div>
        </form>
      </div>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '../stores/appStore.js';
import { apiRequest } from '../services/api.js';

const route = useRoute();
const { t, locale } = useI18n();
const appStore = useAppStore();

const selectedPesertaId = ref<string | number>('');
const selectedPeriode = ref(new Date().toISOString().slice(0, 7));

const loading = ref(false);
const error = ref('');
const allPesertaList = ref<any[]>([]);
const raporData = ref<any>(null);

const printDate = computed(() => {
  return new Date().toLocaleDateString(locale.value === 'ja' ? 'ja-JP' : 'id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Penempatan Form Modal
const penempatanModal = ref(false);
const savingPenempatan = ref(false);
const penempatanForm = ref({
  tanggalLulusUjian: '',
  perusahaanNaitei: '',
  jenisPekerjaan: '',
  lokasiKerja: '',
  rencanaMulaiKerja: '',
  pendidikanTerakhir: '',
});

async function loadAllPeserta() {
  try {
    const data = await apiRequest('/peserta');
    allPesertaList.value = data.items || [];
  } catch (err: any) {
    console.error('Failed to load students', err);
  }
}

async function fetchRapor() {
  if (!selectedPesertaId.value) {
    raporData.value = null;
    return;
  }
  loading.value = true;
  error.value = '';
  try {
    const data = await apiRequest(`/rapor/${selectedPesertaId.value}?periode=${selectedPeriode.value}`);
    raporData.value = data;
  } catch (err: any) {
    error.value = err.message || 'Gagal memuat rapor peserta';
  } finally {
    loading.value = false;
  }
}

function handlePrintRapor() {
  window.print();
}

function openPenempatanModal() {
  if (!raporData.value) return;
  const p = raporData.value.penempatan || {};
  penempatanForm.value = {
    tanggalLulusUjian: p.tanggalLulusUjian || '',
    perusahaanNaitei: p.perusahaanNaitei || '',
    jenisPekerjaan: p.jenisPekerjaan || '',
    lokasiKerja: p.lokasiKerja || '',
    rencanaMulaiKerja: p.rencanaMulaiKerja || '',
    pendidikanTerakhir: p.pendidikanTerakhir || '',
  };
  penempatanModal.value = true;
}

async function savePenempatan() {
  if (!selectedPesertaId.value) return;
  savingPenempatan.value = true;
  try {
    const updated = await apiRequest(`/peserta/${selectedPesertaId.value}/penempatan`, {
      method: 'PUT',
      body: penempatanForm.value,
    });
    if (raporData.value) {
      raporData.value.penempatan = updated;
    }
    appStore.notify(t('rapor.penempatanBerhasilDisimpan'), 'success');
    penempatanModal.value = false;
  } catch (err: any) {
    appStore.notify(err.message || 'Gagal menyimpan data penempatan', 'error');
  } finally {
    savingPenempatan.value = false;
  }
}

onMounted(async () => {
  await loadAllPeserta();
  if (route.query.pesertaId) {
    selectedPesertaId.value = String(route.query.pesertaId);
  } else if (allPesertaList.value.length > 0) {
    selectedPesertaId.value = allPesertaList.value[0].id;
  }
  if (route.query.periode) {
    selectedPeriode.value = String(route.query.periode);
  }
  if (selectedPesertaId.value) {
    await fetchRapor();
  }
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
  .rapor-signatures {
    break-inside: avoid;
  }

  @page {
    size: A4 portrait;
    margin: 1cm 1.2cm;
  }
}
</style>
