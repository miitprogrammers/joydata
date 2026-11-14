<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 font-display">{{ $t('progres.title') }}</h1>
        <p class="text-sm text-slate-600 mt-0.5">{{ $t('progres.subtitle') }}</p>
      </div>
      <button type="button" class="joy-btn-secondary text-xs flex items-center gap-1.5" :disabled="exporting" @click="handleExportCsv">
        <v-icon icon="mdi-download" size="16" />
        <span>{{ $t('progres.exportCsv') }}</span>
      </button>
    </div>

    <!-- Mode & filters -->
    <div class="joy-surface p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
        <button
          type="button"
          class="px-4 py-1.5 rounded-md text-xs font-semibold transition-all"
          :class="viewMode === 'peserta' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
          @click="viewMode = 'peserta'"
        >
          <v-icon icon="mdi-account-group" size="16" class="mr-1" />
          {{ $t('progres.modePeserta') }}
        </button>
        <button
          type="button"
          class="px-4 py-1.5 rounded-md text-xs font-semibold transition-all"
          :class="viewMode === 'kelas' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
          @click="viewMode = 'kelas'"
        >
          <v-icon icon="mdi-google-classroom" size="16" class="mr-1" />
          {{ $t('progres.modeKelas') }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-1.5 text-xs text-slate-600">
          <span class="font-medium">{{ $t('common.kelas') }}:</span>
          <select v-model="selectedKelasId" class="joy-input py-1 px-2.5 text-xs font-medium" @change="fetchData">
            <option value="">{{ $t('common.semuaKelas') }}</option>
            <option v-for="k in kelasList" :key="k.id" :value="k.id">{{ k.namaKelas }}</option>
          </select>
        </div>
        <div class="flex items-center gap-1.5 text-xs text-slate-600">
          <span class="font-medium">Tag:</span>
          <select v-model="selectedTag" class="joy-input py-1 px-2.5 text-xs font-medium" @change="fetchData">
            <option value="">{{ $t('common.semuaTag') }}</option>
            <option value="standar">{{ $t('tag.standar') }}</option>
            <option value="berkembang">{{ $t('tag.berkembang') }}</option>
            <option value="siap_interview">{{ $t('tag.siap_interview') }}</option>
          </select>
        </div>
        <button
          type="button"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5"
          :class="
            selectedTag === 'siap_interview'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          "
          @click="toggleSiapInterviewFilter"
        >
          <span>🎯</span>
          <span>{{ $t('progres.kandidatInterview') }}</span>
          <span
            class="px-1.5 rounded text-[10px] font-bold"
            :class="selectedTag === 'siap_interview' ? 'bg-emerald-700 text-white' : 'bg-emerald-200 text-emerald-900'"
          >{{ kandidatInterviewCount }}</span>
        </button>
      </div>
    </div>

    <!-- How the Nilai Akhir and kualitas kaiwa are computed -->
    <details v-if="aturan" class="joy-surface px-5 py-3 text-xs text-slate-600">
      <summary class="cursor-pointer select-none font-semibold text-primary">{{ $t('progres.rumusJudul') }}</summary>
      <ul class="mt-2 space-y-1.5 max-w-4xl leading-relaxed list-disc pl-4">
        <li>{{ $t('progres.rumusKeseluruhan') }}</li>
        <li>{{ $t('progres.rumusFaktor', { daftar: daftarBobot }) }}</li>
        <li>{{ $t('progres.rumusNilaiAkhir', { min: aturan.minFaktor, a: aturan.batasGrade.A, b: aturan.batasGrade.B, c: aturan.batasGrade.C }) }}</li>
        <li>{{ $t('progres.rumusKualitas', { pa: angka(aturan.poinGradeSesi.A), pb: angka(aturan.poinGradeSesi.B), pc: angka(aturan.poinGradeSesi.C) }) }}</li>
      </ul>
    </details>

    <div v-if="loading && !pesertaList.length" class="joy-surface p-12 text-center text-slate-500">
      <v-progress-circular indeterminate color="primary" size="32" class="mb-3" />
      <div class="text-sm font-medium">{{ $t('common.memuat') }}</div>
    </div>

    <div v-else-if="error" class="joy-surface p-8 text-center text-red-600 bg-red-50/50 border border-red-200">
      <div class="text-sm font-semibold">{{ error }}</div>
      <button type="button" class="mt-3 joy-btn-secondary text-xs" @click="fetchData">{{ $t('common.cobaLagi') }}</button>
    </div>

    <template v-else>
      <!-- PER CLASS -->
      <div v-if="viewMode === 'kelas'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="summary in kelasSummaryList" :key="summary.kelasId" class="joy-surface p-5 flex flex-col justify-between gap-4">
          <div>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-slate-900 font-display">{{ summary.namaKelas }}</h3>
              <span class="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">{{ summary.jumlahPeserta }} {{ $t('common.peserta') }}</span>
            </div>
            <div class="text-xs text-slate-500 mt-0.5">Sensei: <span class="font-medium text-slate-700">{{ summary.senseiNama }}</span></div>

            <div class="mt-3 pt-3 border-t border-slate-100">
              <div class="flex items-baseline justify-between">
                <span class="text-xs text-slate-600">{{ $t('progres.rataNilaiAkhir') }}</span>
                <span class="text-lg font-bold text-slate-900">
                  {{ angka(summary.nilaiAkhir.rata) }}
                  <span v-if="summary.nilaiAkhir.rata !== null" class="text-xs font-semibold text-slate-500">{{ gradeDari(summary.nilaiAkhir.rata) }}</span>
                </span>
              </div>
              <div class="mt-1.5 flex flex-wrap gap-1.5">
                <span v-for="g in ['A', 'B', 'C', 'D']" :key="g" class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold" :class="warnaGrade(g)">
                  {{ g }} <span class="tabular-nums">{{ summary.nilaiAkhir.distribusi[g] }}</span>
                </span>
              </div>
            </div>

            <div class="mt-3 pt-3 border-t border-slate-100">
              <div class="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{{ $t('progres.distribusiTag') }}</div>
              <div class="grid grid-cols-3 gap-1.5 text-center">
                <div class="p-1.5 rounded bg-slate-50 border border-slate-100">
                  <div class="text-[10px] text-slate-500">{{ $t('tag.standar') }}</div>
                  <div class="text-xs font-bold text-slate-800">{{ summary.tagCounts.standar }}</div>
                </div>
                <div class="p-1.5 rounded bg-blue-50/60 border border-blue-100">
                  <div class="text-[10px] text-blue-600">{{ $t('tag.berkembang') }}</div>
                  <div class="text-xs font-bold text-blue-800">{{ summary.tagCounts.berkembang }}</div>
                </div>
                <div class="p-1.5 rounded bg-emerald-50/80 border border-emerald-100">
                  <div class="text-[10px] text-emerald-700">{{ $t('tag.siap_interview') }}</div>
                  <div class="text-xs font-bold text-emerald-800">{{ summary.tagCounts.siap_interview }}</div>
                </div>
              </div>
            </div>

            <div class="mt-3.5 space-y-1 text-xs">
              <div class="flex items-center justify-between py-1 border-b border-slate-50">
                <span class="text-slate-600">{{ $t('progres.rataUjianKelas') }}</span>
                <span class="font-semibold tabular-nums" :class="lemah(summary.rataUjian, appStore.settings.kkm_ujian) ? 'text-red-600' : 'text-slate-900'">{{ angka(summary.rataUjian) }}</span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-slate-50">
                <span class="text-slate-600">{{ $t('progres.rataSikapKelas') }}</span>
                <span class="font-semibold tabular-nums" :class="lemah(summary.rataSikap, appStore.settings.kkm_sikap) ? 'text-red-600' : 'text-slate-900'">{{ angka(summary.rataSikap) }}</span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-slate-50">
                <span class="text-slate-600">{{ $t('progres.rasioKehadiranKelas') }}</span>
                <span class="font-semibold tabular-nums" :class="lemah(summary.rasioKehadiran, appStore.settings.ambang_kehadiran_rendah) ? 'text-red-600' : 'text-slate-900'">
                  {{ summary.rasioKehadiran === null ? '-' : `${angka(summary.rasioKehadiran)}%` }}
                </span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-slate-50">
                <span class="text-slate-600">{{ $t('progres.kualitasKaiwaKelas') }}</span>
                <span class="font-semibold tabular-nums text-slate-900">
                  {{ angka(summary.kualitasKaiwa) }}
                  <span v-if="summary.kualitasKaiwa !== null" class="text-[11px] text-slate-500">{{ gradeDari(summary.kualitasKaiwa) }}</span>
                </span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="text-slate-600">{{ $t('progres.sesiKaiwaDist') }}</span>
                <span class="tabular-nums text-[11px] text-slate-700">A {{ summary.kaiwaDistribusi.A }} · B {{ summary.kaiwaDistribusi.B }} · C {{ summary.kaiwaDistribusi.C }}</span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="text-slate-600">{{ $t('progres.sesiMensetsuDist') }}</span>
                <span class="tabular-nums text-[11px] text-slate-700">A {{ summary.mensetsuDistribusi.A }} · B {{ summary.mensetsuDistribusi.B }} · C {{ summary.mensetsuDistribusi.C }}</span>
              </div>
            </div>
          </div>

          <button type="button" class="w-full joy-btn-secondary text-xs justify-center" @click="selectClassAndSwitchToStudentMode(summary.kelasId)">
            <v-icon icon="mdi-account-search" size="14" class="mr-1" />
            <span>{{ $t('progres.lihatDaftarSiswa') }}</span>
          </button>
        </div>
      </div>

      <!-- PER PESERTA -->
      <div v-else class="joy-surface overflow-hidden" :class="loading ? 'opacity-60' : ''">
        <div class="px-4 py-2.5 border-b border-slate-200 text-[11px] text-slate-500">{{ $t('progres.urutkanInfo') }}</div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold align-bottom">
              <tr>
                <th class="py-2.5 px-2 w-8 text-center">#</th>
                <th
                  v-for="k in KOLOM"
                  :key="k.key"
                  class="py-2.5 px-2"
                  :class="k.key === 'nama' ? 'text-left' : 'text-center'"
                  :aria-sort="ariaUrut(k.key)"
                >
                  <!-- Long headers wrap to two lines, so the whole table fits a laptop screen -->
                  <button type="button" class="inline-flex items-center gap-0.5 leading-tight hover:text-slate-900" :class="k.key === 'nama' ? 'text-left' : 'text-center'" @click="urutkan(k.key)">
                    <span class="max-w-[90px]">{{ $t(k.label) }}</span>
                    <v-icon :icon="ikonUrut(k.key)" size="13" class="shrink-0" :class="urutan.kolom === k.key ? 'text-primary' : 'text-slate-300'" />
                  </button>
                </th>
                <th class="py-2.5 px-2 text-right">{{ $t('common.aksi') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="pesertaTampil.length === 0">
                <td :colspan="KOLOM.length + 2" class="py-10 text-center text-slate-400">{{ $t('common.tidakAdaData') }}</td>
              </tr>
              <tr
                v-for="(p, idx) in pesertaTampil"
                :key="p.pesertaId"
                class="hover:bg-slate-50/80 transition-colors align-top"
                :class="p.statusTag === 'siap_interview' ? 'bg-emerald-50/20' : ''"
              >
                <td class="py-3 px-2 text-center text-slate-400 tabular-nums">{{ idx + 1 }}</td>
                <!-- Peserta -->
                <td class="py-3 px-2 min-w-[130px]">
                  <div class="font-semibold text-slate-900">{{ p.nama }}</div>
                  <div class="text-[11px] text-slate-500">
                    {{ p.namaKelas }}
                    <span v-if="p.sumber === 'manual'" class="ml-1 px-1 rounded bg-amber-100 text-amber-800 text-[9px]">{{ $t('progres.luarKelas') }}</span>
                  </div>
                </td>
                <!-- Nilai Akhir -->
                <td class="py-3 px-2 text-center">
                  <button
                    v-if="p.nilaiAkhir.grade"
                    type="button"
                    class="inline-flex flex-col items-center rounded-lg px-2 py-1 hover:bg-slate-100"
                    :title="$t('progres.lihatRincian')"
                    @click="bukaRincian(p)"
                  >
                    <span class="inline-flex items-center gap-1.5">
                      <span class="w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold" :class="warnaGrade(p.nilaiAkhir.grade)">{{ p.nilaiAkhir.grade }}</span>
                      <span class="text-sm font-bold tabular-nums text-slate-900">{{ angka(p.nilaiAkhir.nilai) }}</span>
                    </span>
                    <span class="text-[10px] text-slate-500 underline decoration-dotted">{{ $t('progres.nFaktor', { n: p.nilaiAkhir.dinilai }) }}</span>
                  </button>
                  <button v-else type="button" class="text-[11px] text-slate-400 hover:underline" @click="bukaRincian(p)">{{ $t('progres.belumCukup') }}</button>
                </td>
                <!-- Exams -->
                <td class="py-3 px-2 text-center">
                  <template v-if="p.rataUjian !== null">
                    <div class="tabular-nums">
                      <span class="font-bold" :class="p.lulusKkmUjian ? 'text-slate-900' : 'text-red-600'">{{ angka(p.rataUjian) }}</span>
                      <span class="text-[10px] text-slate-400 ml-1">{{ p.predikatUjian }}</span>
                    </div>
                    <div class="text-[10px] text-slate-500 whitespace-nowrap">
                      {{ $t('progres.nUjian', { n: p.jumlahUjian }) }}
                      <span
                        v-if="p.trenUjian !== null"
                        class="ml-1 font-semibold"
                        :class="p.trenUjian > 0 ? 'text-emerald-700' : p.trenUjian < 0 ? 'text-red-600' : 'text-slate-500'"
                        :title="$t('progres.trenTitle')"
                      >{{ p.trenUjian > 0 ? '↑' : p.trenUjian < 0 ? '↓' : '→' }}{{ angka(Math.abs(p.trenUjian)) }}</span>
                    </div>
                  </template>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <!-- Kualitas kaiwa / mensetsu -->
                <td v-for="kunci in ['kualitasKaiwa', 'kualitasMensetsu']" :key="kunci" class="py-3 px-2 text-center">
                  <template v-if="p[kunci].nilai !== null">
                    <div class="inline-flex items-center gap-1.5">
                      <span class="font-bold px-1.5 py-0.5 rounded text-xs" :class="warnaGrade(p[kunci].grade)">{{ p[kunci].grade }}</span>
                      <span class="font-semibold tabular-nums text-slate-900">{{ angka(p[kunci].nilai) }}</span>
                    </div>
                    <div class="text-[10px] text-slate-500 whitespace-nowrap">
                      {{ $t('progres.nSesi', { n: p[kunci].jumlah }) }} · A{{ p[kunci].distribusi.A }} B{{ p[kunci].distribusi.B }} C{{ p[kunci].distribusi.C }}
                    </div>
                  </template>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <!-- Sikap -->
                <td class="py-3 px-2 text-center tabular-nums">
                  <template v-if="p.skorSikap !== null">
                    <span class="font-bold" :class="p.lulusKkmSikap ? 'text-slate-900' : 'text-red-600'">{{ angka(p.skorSikap) }}</span>
                    <span class="text-[10px] text-slate-400 ml-1">{{ p.predikatSikap }}</span>
                  </template>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <!-- Kehadiran -->
                <td class="py-3 px-2 text-center tabular-nums">
                  <template v-if="p.rasioKehadiran !== null">
                    <div class="font-bold" :class="p.rasioKehadiran < appStore.settings.ambang_kehadiran_rendah ? 'text-red-600' : 'text-slate-900'">{{ angka(p.rasioKehadiran) }}%</div>
                    <div class="text-[10px] text-slate-500 whitespace-nowrap">{{ $t('progres.hadirDari', { hadir: p.hadir, sesi: p.sesi }) }}</div>
                  </template>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <!-- Kaiwa Card -->
                <td class="py-3 px-2 text-center tabular-nums">
                  <template v-if="p.kaiwaCard">
                    <div class="font-bold text-slate-900">{{ angka(p.kaiwaCard.nilai, 0) }}%</div>
                    <div class="text-[10px] text-slate-500 whitespace-nowrap">{{ $t('progres.mingguTercapai', { tercapai: p.kaiwaCard.tercapai, minggu: p.kaiwaCard.minggu }) }}</div>
                  </template>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <!-- Latihan -->
                <td class="py-3 px-2 text-center tabular-nums">
                  <template v-if="p.latihan">
                    <div class="inline-flex items-center gap-1.5">
                      <span class="font-bold px-1.5 py-0.5 rounded text-xs" :class="warnaGrade(p.latihan.grade)">{{ p.latihan.grade }}</span>
                      <span class="font-semibold text-slate-900">{{ angka(p.latihan.nilai) }}</span>
                    </div>
                    <div class="text-[10px] text-slate-500 whitespace-nowrap">{{ $t('progres.menitHari', { n: angka(p.latihan.menitPerHari, 0) }) }}</div>
                  </template>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <!-- Fisik -->
                <td class="py-3 px-2 text-center tabular-nums">
                  <span v-if="p.fisik" class="font-bold" :class="p.fisik.lulusKkm === false ? 'text-red-600' : 'text-slate-900'">{{ angka(p.fisik.nilai) }}</span>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <!-- Tag -->
                <td class="py-3 px-2 text-center">
                  <span
                    class="inline-flex items-center justify-center px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap"
                    :title="$t(`tag.${p.statusTag}`)"
                    :class="{
                      'bg-slate-100 text-slate-700': p.statusTag === 'standar',
                      'bg-blue-50 text-blue-700 border border-blue-200': p.statusTag === 'berkembang',
                      'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold': p.statusTag === 'siap_interview',
                    }"
                  >
                    {{ tagPendek(p.statusTag) }}
                  </span>
                </td>
                <td class="py-3 px-2 text-right whitespace-nowrap">
                  <button
                    v-if="isAdmin"
                    type="button"
                    class="p-1 rounded text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    :title="$t('progres.ubahTag')"
                    @click="openChangeTagDialog(p)"
                  >
                    <v-icon icon="mdi-tag-edit" size="16" />
                  </button>
                  <router-link
                    v-if="appStore.canAccess('smart-report')"
                    :to="{ path: '/smart-report', query: { mode: 'peserta', pesertaId: String(p.pesertaId), ...(p.kelasId ? { kelasId: String(p.kelasId) } : {}) } }"
                    class="p-1 rounded text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors inline-block"
                    :title="$t('progres.bukaSmartReport')"
                  >
                    <v-icon icon="mdi-file-chart-outline" size="16" />
                  </router-link>
                  <router-link
                    v-if="appStore.canAccess('rapor-peserta')"
                    :to="`/rapor?pesertaId=${p.pesertaId}&periode=${bulanIni}`"
                    class="p-1 rounded text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors inline-block"
                    :title="$t('progres.bukaRapor')"
                  >
                    <v-icon icon="mdi-file-document-outline" size="16" />
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Nilai Akhir breakdown -->
    <v-dialog v-model="rincianOpen" max-width="720" scrollable>
      <v-card v-if="rincian" class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 flex items-center gap-3">
          <span
            v-if="rincian.nilaiAkhir.grade"
            class="w-10 h-10 rounded-full shrink-0 inline-flex items-center justify-center text-lg font-black"
            :class="warnaGrade(rincian.nilaiAkhir.grade)"
          >{{ rincian.nilaiAkhir.grade }}</span>
          <div class="min-w-0 flex-1">
            <p class="text-base font-bold text-slate-900 truncate">{{ rincian.nama }}</p>
            <p class="text-xs text-slate-500">
              {{ $t('progres.rincianJudul') }} ·
              <template v-if="rincian.nilaiAkhir.nilai !== null">{{ angka(rincian.nilaiAkhir.nilai) }}</template>
              <template v-else>{{ $t('progres.belumCukupDesc', { n: rincian.nilaiAkhir.dinilai, min: aturan?.minFaktor }) }}</template>
            </p>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" :aria-label="$t('app.close')" @click="rincianOpen = false" />
        </div>
        <v-card-text class="p-0">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 text-slate-600">
                <tr>
                  <th class="px-5 py-2 font-semibold">{{ $t('progres.colFaktor') }}</th>
                  <th class="px-3 py-2 font-semibold text-right">{{ $t('progres.colNilai') }}</th>
                  <th class="px-3 py-2 font-semibold text-right">{{ $t('progres.colBobot') }}</th>
                  <th class="px-3 py-2 font-semibold text-right">{{ $t('progres.colBobotDipakai') }}</th>
                  <th class="px-3 py-2 font-semibold text-right">{{ $t('progres.colKontribusi') }}</th>
                  <th class="px-5 py-2 font-semibold">{{ $t('progres.colKeterangan') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="r in rincian.nilaiAkhir.rincian" :key="r.faktor" :class="r.nilai === null ? 'text-slate-400' : ''">
                  <td class="px-5 py-2.5 font-medium" :class="r.nilai === null ? '' : 'text-slate-900'">{{ $t(`progres.faktor.${r.faktor}`) }}</td>
                  <td class="px-3 py-2.5 text-right tabular-nums font-semibold">{{ r.nilai === null ? '-' : angka(r.nilai) }}</td>
                  <td class="px-3 py-2.5 text-right tabular-nums">{{ r.bobot }}%</td>
                  <td class="px-3 py-2.5 text-right tabular-nums">{{ r.bobotEfektif === null ? '-' : `${angka(r.bobotEfektif)}%` }}</td>
                  <td class="px-3 py-2.5 text-right tabular-nums">{{ r.kontribusi === null ? '-' : angka(r.kontribusi) }}</td>
                  <td class="px-5 py-2.5">{{ r.nilai === null ? $t('progres.belumAdaData') : keterangan(r) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Admin change tag dialog -->
    <v-dialog v-model="changeTagDialog" max-width="440">
      <div class="bg-white rounded-xl p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-base font-bold text-slate-900 font-display">{{ $t('progres.ubahStatusTagJudul') }}</h3>
          <button type="button" class="text-slate-400 hover:text-slate-600" @click="changeTagDialog = false">
            <v-icon icon="mdi-close" size="20" />
          </button>
        </div>

        <div v-if="selectedStudentForTag" class="space-y-4 text-xs">
          <div class="p-3 bg-slate-50 rounded-lg">
            <div class="font-bold text-slate-900 text-sm">{{ selectedStudentForTag.nama }}</div>
            <div class="text-slate-500 text-[11px] font-mono mt-0.5">
              ID #{{ selectedStudentForTag.mancationAkunId || selectedStudentForTag.pesertaId }} · {{ selectedStudentForTag.namaKelas }}
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-2">{{ $t('progres.pilihStatusTag') }}:</label>
            <div class="space-y-2">
              <label
                class="flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all"
                :class="newStatusTag === 'standar' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:bg-slate-50'"
              >
                <input v-model="newStatusTag" type="radio" value="standar" name="statusTagRadio" />
                <div>
                  <div class="font-bold text-slate-800">{{ $t('tag.standar') }}</div>
                  <div class="text-[11px] text-slate-500">{{ $t('tag.standarDesc') }}</div>
                </div>
              </label>
              <label
                class="flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all"
                :class="newStatusTag === 'berkembang' ? 'border-blue-600 bg-blue-50/40' : 'border-slate-200 hover:bg-slate-50'"
              >
                <input v-model="newStatusTag" type="radio" value="berkembang" name="statusTagRadio" />
                <div>
                  <div class="font-bold text-blue-800">{{ $t('tag.berkembang') }}</div>
                  <div class="text-[11px] text-slate-500">{{ $t('tag.berkembangDesc') }}</div>
                </div>
              </label>
              <label
                class="flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all"
                :class="newStatusTag === 'siap_interview' ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 hover:bg-slate-50'"
              >
                <input v-model="newStatusTag" type="radio" value="siap_interview" name="statusTagRadio" />
                <div>
                  <div class="font-bold text-emerald-800">🎯 {{ $t('tag.siap_interview') }}</div>
                  <div class="text-[11px] text-slate-500">{{ $t('tag.siapInterviewDesc') }}</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label class="block font-semibold text-slate-700 mb-1">{{ $t('progres.alasanCatatan') }}:</label>
            <textarea v-model="statusTagNote" rows="2" class="joy-input w-full p-2 text-xs" :placeholder="$t('progres.alasanCatatanPlaceholder')" />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button type="button" class="joy-btn-secondary text-xs" @click="changeTagDialog = false">{{ $t('common.batal') }}</button>
          <button type="button" class="joy-btn-primary text-xs" :disabled="savingTag" @click="submitChangeStatusTag">
            {{ savingTag ? $t('common.menyimpan') : $t('common.simpan') }}
          </button>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '../stores/appStore.js';
import { apiRequest, apiDownload } from '../services/api.js';

const { t, locale } = useI18n();
const appStore = useAppStore();

const isAdmin = computed(() => appStore.isAdmin);

const viewMode = ref<'peserta' | 'kelas'>('peserta');
const selectedKelasId = ref('');
const selectedTag = ref('');
// The rapor is monthly: its link opens this month.
const bulanIni = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date()).slice(0, 7);

const loading = ref(false);
const error = ref('');
const exporting = ref(false);

const kelasList = ref<any[]>([]);
const kelasSummaryList = ref<any[]>([]);
const pesertaList = ref<any[]>([]);
const kandidatInterviewCount = ref(0);
const aturan = ref<any>(null);

const changeTagDialog = ref(false);
const selectedStudentForTag = ref<any>(null);
const newStatusTag = ref('standar');
const statusTagNote = ref('');
const savingTag = ref(false);

const rincianOpen = ref(false);
const rincian = ref<any>(null);

// --- formatting -----------------------------------------------------------------------------------------------------

const angka = (v: any, digits = 1) =>
  v === null || v === undefined ? '-' : new Intl.NumberFormat(locale.value === 'ja' ? 'ja-JP' : 'id-ID', { maximumFractionDigits: digits }).format(v);
const WARNA_GRADE: Record<string, string> = {
  A: 'bg-emerald-100 text-emerald-800',
  B: 'bg-blue-100 text-blue-800',
  C: 'bg-amber-100 text-amber-800',
  D: 'bg-red-100 text-red-700',
};
const warnaGrade = (g: string) => WARNA_GRADE[g] || 'bg-slate-100 text-slate-600';
const gradeDari = (v: number) => {
  const b = aturan.value?.batasGrade || appStore.settings.batas_grade;
  return v >= b.A ? 'A' : v >= b.B ? 'B' : v >= b.C ? 'C' : 'D';
};
const lemah = (v: any, batas: number) => v !== null && v !== undefined && v < batas;
// "Berkembang (Persiapan Mensetsu)" → "Berkembang" in the table; the full label is the hover text.
const tagPendek = (tag: string) => t(`tag.${tag}`).split(/\s*[(（]/)[0];
const daftarBobot = computed(() =>
  aturan.value ? Object.entries(aturan.value.bobot).map(([k, w]) => `${t(`progres.faktor.${k}`)} ${w}%`).join(', ') : ''
);

function keterangan(r: any) {
  switch (r.faktor) {
    case 'ujian':
      return t('progres.ketUjian', { n: r.jumlah });
    case 'kehadiran':
      return t('progres.ketKehadiran', { hadir: r.hadir, sesi: r.sesi });
    case 'sikap':
      return t('progres.ketSikap', { n: r.bulan });
    case 'kaiwa':
    case 'mensetsu':
      return t('progres.ketSesi', { n: r.jumlah, grade: r.grade, a: r.distribusi.A, b: r.distribusi.B, c: r.distribusi.C });
    case 'kaiwaCard':
      return t('progres.ketKaiwaCard', { tercapai: r.tercapai, minggu: r.minggu });
    case 'latihan':
      return t('progres.ketLatihan', { menit: angka(r.menitPerHari, 0), hari: r.hari, grade: r.grade });
    case 'fisik':
      return t('progres.ketFisik', { tanggal: r.tanggal });
    default:
      return '';
  }
}

// --- sorting --------------------------------------------------------------------------------------------------------

type Kolom = 'nama' | 'nilaiAkhir' | 'ujian' | 'kaiwa' | 'mensetsu' | 'sikap' | 'kehadiran' | 'kaiwaCard' | 'latihan' | 'fisik' | 'tag';
const KOLOM: { key: Kolom; label: string }[] = [
  { key: 'nama', label: 'progres.colPeserta' },
  { key: 'nilaiAkhir', label: 'progres.colNilaiAkhir' },
  { key: 'ujian', label: 'progres.colUjian' },
  { key: 'kaiwa', label: 'progres.colKaiwa' },
  { key: 'mensetsu', label: 'progres.colMensetsu' },
  { key: 'sikap', label: 'progres.colSikap' },
  { key: 'kehadiran', label: 'progres.colKehadiran' },
  { key: 'kaiwaCard', label: 'progres.colKaiwaCard' },
  { key: 'latihan', label: 'progres.colLatihan' },
  { key: 'fisik', label: 'progres.colFisik' },
  { key: 'tag', label: 'progres.colTag' },
];
const URUT_TAG: Record<string, number> = { standar: 0, berkembang: 1, siap_interview: 2 };
const NILAI_KOLOM: Record<Kolom, (p: any) => any> = {
  nama: (p) => p.nama,
  nilaiAkhir: (p) => p.nilaiAkhir.nilai,
  ujian: (p) => p.rataUjian,
  kaiwa: (p) => p.kualitasKaiwa.nilai,
  mensetsu: (p) => p.kualitasMensetsu.nilai,
  sikap: (p) => p.skorSikap,
  kehadiran: (p) => p.rasioKehadiran,
  kaiwaCard: (p) => p.kaiwaCard?.nilai ?? null,
  latihan: (p) => p.latihan?.nilai ?? null,
  fisik: (p) => p.fisik?.nilai ?? null,
  tag: (p) => URUT_TAG[p.statusTag] ?? 0,
};

// A per-browser convenience; storage may be unavailable.
const KUNCI_URUTAN = 'joydata_progres_urutan';
function bacaUrutan(): { kolom: Kolom; arah: 'turun' | 'naik' } {
  try {
    const v = JSON.parse(localStorage.getItem(KUNCI_URUTAN) || 'null');
    if (v && v.kolom in NILAI_KOLOM && (v.arah === 'turun' || v.arah === 'naik')) return v;
  } catch {
    // default order
  }
  return { kolom: 'nilaiAkhir', arah: 'turun' };
}
const urutan = ref(bacaUrutan());

/** The same column flips the direction; another starts with the best (or A–Z for names) first. */
function urutkan(kolom: Kolom) {
  const sama = urutan.value.kolom === kolom;
  const awal = kolom === 'nama' ? 'naik' : 'turun';
  urutan.value = { kolom, arah: sama ? (urutan.value.arah === 'turun' ? 'naik' : 'turun') : awal };
  try {
    localStorage.setItem(KUNCI_URUTAN, JSON.stringify(urutan.value));
  } catch {
    // not remembered, still sorted
  }
}
const ikonUrut = (k: Kolom) => (urutan.value.kolom !== k ? 'mdi-swap-vertical' : urutan.value.arah === 'turun' ? 'mdi-arrow-down' : 'mdi-arrow-up');
const ariaUrut = (k: Kolom) => (urutan.value.kolom !== k ? 'none' : urutan.value.arah === 'turun' ? 'descending' : 'ascending');

// Empty values always go last; ties fall back to the name.
const pesertaTampil = computed(() => {
  const { kolom, arah } = urutan.value;
  const nilai = NILAI_KOLOM[kolom];
  const f = arah === 'turun' ? -1 : 1;
  return [...pesertaList.value].sort((a, b) => {
    const va = nilai(a);
    const vb = nilai(b);
    if (va === null || va === undefined || vb === null || vb === undefined) {
      if ((va ?? null) === (vb ?? null)) return a.nama.localeCompare(b.nama);
      return va === null || va === undefined ? 1 : -1;
    }
    const banding = typeof va === 'string' ? va.localeCompare(vb) : va - vb;
    return f * banding || a.nama.localeCompare(b.nama);
  });
});

// --- loading & actions ----------------------------------------------------------------------------------------------

// From the report pickers endpoint: /kelas belongs to Data Kelas, which a role with only Progres access cannot open.
async function fetchClasses() {
  try {
    const data = await apiRequest('/laporan/opsi');
    kelasList.value = data.kelas || [];
  } catch (err: any) {
    console.error('Failed to load classes', err);
  }
}

async function fetchData() {
  loading.value = true;
  error.value = '';
  try {
    const params = new URLSearchParams();
    if (selectedKelasId.value) params.set('kelasId', selectedKelasId.value);
    if (selectedTag.value) params.set('tag', selectedTag.value);
    const data = await apiRequest(`/progres?${params.toString()}`);
    kelasSummaryList.value = data.kelasSummary || [];
    pesertaList.value = data.pesertaList || [];
    kandidatInterviewCount.value = data.kandidatInterviewCount || 0;
    aturan.value = data.aturanNilaiAkhir || null;
  } catch (err: any) {
    error.value = err.message || t('messages.GENERIC_ERROR');
  } finally {
    loading.value = false;
  }
}

function bukaRincian(p: any) {
  rincian.value = p;
  rincianOpen.value = true;
}

function toggleSiapInterviewFilter() {
  selectedTag.value = selectedTag.value === 'siap_interview' ? '' : 'siap_interview';
  fetchData();
}

function selectClassAndSwitchToStudentMode(kelasId: number) {
  selectedKelasId.value = String(kelasId);
  viewMode.value = 'peserta';
  fetchData();
}

function openChangeTagDialog(student: any) {
  selectedStudentForTag.value = student;
  newStatusTag.value = student.statusTag || 'standar';
  statusTagNote.value = '';
  changeTagDialog.value = true;
}

async function submitChangeStatusTag() {
  if (!selectedStudentForTag.value) return;
  savingTag.value = true;
  try {
    await apiRequest(`/peserta/${selectedStudentForTag.value.pesertaId}/tag`, {
      method: 'PATCH',
      body: { statusTag: newStatusTag.value, note: statusTagNote.value },
    });
    appStore.notify(t('progres.tagBerhasilDiubah'), 'success');
    changeTagDialog.value = false;
    await fetchData();
  } catch (err: any) {
    appStore.notify(err.message || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    savingTag.value = false;
  }
}

async function handleExportCsv() {
  exporting.value = true;
  try {
    const params = new URLSearchParams({ tipe: 'progres', locale: locale.value });
    if (selectedKelasId.value) params.set('kelasId', selectedKelasId.value);
    const blob = await apiDownload(`/export/rekap?${params.toString()}`);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JOYdata-Progres-${new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date())}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    appStore.notify(t('progres.eksporBerhasil'), 'success');
  } catch (err: any) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    exporting.value = false;
  }
}

onMounted(async () => {
  await fetchClasses();
  await fetchData();
});
</script>
