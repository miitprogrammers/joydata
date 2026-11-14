<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('dashboard.judul') }}</h1>
        <p class="text-sm text-slate-600 mt-1">
          <template v-if="dash">{{ $t('dashboard.subjudul', { peserta: dash.pesertaAktif, kelas: dash.perKelas.length, tanggal: tglPanjang(dash.hariIni) }) }}</template>
          <template v-else>{{ $t('app.loading') }}</template>
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <v-btn
          icon="mdi-refresh"
          variant="text"
          size="small"
          :loading="memuat && Boolean(dash)"
          :aria-label="$t('dashboard.muatUlang')"
          @click="muat"
        />
        <v-btn variant="outlined" color="primary" size="small" prepend-icon="mdi-sync" class="text-none" :loading="syncing" @click="triggerSync">
          {{ $t('app.syncMancation') }}
        </v-btn>
        <v-btn
          v-if="appStore.canAccess('data-peserta')"
          color="primary"
          variant="flat"
          size="small"
          prepend-icon="mdi-account-group-outline"
          class="text-none"
          to="/peserta"
        >
          {{ $t('dashboard.bukaPeserta') }}
        </v-btn>
      </div>
    </div>

    <MancationSyncBanner :sync-meta="overview?.mancationSync" :syncing="syncing" @sync="triggerSync" />

    <div v-if="!dash && memuat" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <v-skeleton-loader v-for="n in 6" :key="n" type="article" class="joy-surface" />
    </div>

    <div v-else-if="!dash && gagal" class="joy-surface p-8 text-center space-y-3">
      <p class="text-sm text-slate-700">{{ $t('dashboard.gagalMuat') }}</p>
      <v-btn variant="tonal" color="primary" class="text-none" @click="muat">{{ $t('common.cobaLagi') }}</v-btn>
    </div>

    <!-- The previous figures stay, dimmed, while a refresh loads -->
    <div v-if="dash" class="space-y-6 transition-opacity" :class="memuat ? 'opacity-60' : ''">
      <!-- ============ TODAY ============ -->
      <section class="space-y-3">
        <h2 class="text-base font-bold text-slate-900 font-display">
          {{ $t('dashboard.hariIni') }} <span class="text-sm font-normal text-slate-500">· {{ tglPanjang(dash.hariIni) }}</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Absensi today -->
          <div class="joy-surface p-4 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs font-medium text-slate-500">{{ $t('dashboard.absensiHariIni') }}</p>
              <router-link v-if="bisa('rekap-absensi')" to="/absensi" class="text-xs font-semibold text-primary hover:underline">{{ $t('dashboard.buka') }}</router-link>
            </div>
            <ul class="mt-2 space-y-1.5">
              <li v-for="k in dash.hari.absensi.kelas" :key="k.kelasId" class="flex items-center justify-between gap-2 text-sm">
                <span class="font-semibold text-slate-900 truncate">{{ k.namaKelas }}</span>
                <span v-if="k.terisi" class="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                  <v-icon icon="mdi-check-circle" size="14" />{{ $t('dashboard.terisi') }}
                </span>
                <span v-else class="inline-flex items-center gap-1.5 text-xs font-medium text-amber-800">
                  <v-icon icon="mdi-alert-circle-outline" size="14" />{{ $t('dashboard.belumDiisi') }}
                  <router-link
                    v-if="bisa('rekap-absensi')"
                    :to="`/absensi?tanggal=${dash.hariIni}&kelasId=${k.kelasId}`"
                    class="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-900 hover:bg-amber-200"
                  >{{ $t('dashboard.isi') }}</router-link>
                </span>
              </li>
            </ul>
            <template v-if="adaAbsensiHariIni">
              <p class="mt-3 text-xs text-slate-600">
                <span v-for="(s, i) in STATUS" :key="s">
                  <span v-if="i" class="text-slate-300 mx-1">·</span>
                  {{ $t(`portal.status.${s}`) }} <span class="font-semibold tabular-nums text-slate-900">{{ dash.hari.absensi.status[s] }}</span>
                </span>
              </p>
              <ul v-if="dash.hari.absensi.tidakHadir.length" class="mt-2 space-y-1">
                <li v-for="p in dash.hari.absensi.tidakHadir.slice(0, 5)" :key="p.pesertaId" class="flex items-center justify-between gap-2 text-xs">
                  <span class="truncate text-slate-800">{{ p.nama }} <span class="text-slate-400">· {{ p.namaKelas }}</span></span>
                  <span class="shrink-0 rounded px-1.5 py-0.5 font-medium" :class="warnaStatus(p.status)">{{ $t(`portal.status.${p.status}`) }}</span>
                </li>
                <li v-if="dash.hari.absensi.tidakHadir.length > 5" class="text-xs text-slate-500">
                  {{ $t('dashboard.nLainnya', { n: dash.hari.absensi.tidakHadir.length - 5 }) }}
                </li>
              </ul>
              <p v-else class="mt-2 text-xs text-emerald-700">{{ $t('dashboard.semuaHadir') }}</p>
            </template>
          </div>

          <!-- Practice today -->
          <component
            :is="bisa('monitor-latihan') ? 'router-link' : 'div'"
            :to="bisa('monitor-latihan') ? '/monitor-latihan' : undefined"
            class="joy-surface p-4 block min-w-0"
            :class="bisa('monitor-latihan') ? 'hover:border-slate-300' : ''"
          >
            <p class="text-xs font-medium text-slate-500">{{ $t('dashboard.latihanHariIni') }}</p>
            <p class="mt-1 text-2xl font-bold text-slate-900 leading-tight">
              {{ dash.hari.latihan.peserta }}<span class="ml-1 text-sm font-semibold text-slate-500">/ {{ dash.pesertaAktif }}</span>
            </p>
            <p class="text-xs text-slate-600">{{ $t('dashboard.pesertaSudahLatihan') }}</p>
            <p class="mt-2 text-xs text-slate-600">{{ $t('dashboard.totalWaktu', { waktu: durasi(dash.hari.latihan.detikAktif) }) }}</p>
            <p class="mt-1 flex items-center gap-1.5 text-xs" :class="dash.hari.latihan.sedangLatihan ? 'text-emerald-700 font-medium' : 'text-slate-500'">
              <span v-if="dash.hari.latihan.sedangLatihan" class="relative flex h-2 w-2">
                <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {{ dash.hari.latihan.sedangLatihan ? $t('dashboard.sedangLatihan', { n: dash.hari.latihan.sedangLatihan }) : $t('dashboard.tidakAdaYangLatihan') }}
            </p>
          </component>

          <!-- Kaiwa Card this week -->
          <component
            :is="bisa('kaiwa-mingguan') ? 'router-link' : 'div'"
            :to="bisa('kaiwa-mingguan') ? '/kaiwa-mingguan' : undefined"
            class="joy-surface p-4 block min-w-0"
            :class="bisa('kaiwa-mingguan') ? 'hover:border-slate-300' : ''"
          >
            <p class="text-xs font-medium text-slate-500">{{ $t('dashboard.kaiwaMingguIni') }}</p>
            <p class="mt-1 text-2xl font-bold text-slate-900 leading-tight">
              {{ dash.hari.kaiwa.tercapai }}<span class="ml-1 text-sm font-semibold text-slate-500">/ {{ dash.hari.kaiwa.dinilai }}</span>
            </p>
            <p class="text-xs text-slate-600">{{ $t('dashboard.pesertaTercapai') }}</p>
            <div class="mt-2 h-2 w-full rounded-full bg-blue-100 overflow-hidden">
              <div class="h-full rounded-full bg-blue-600" :style="{ width: `${dash.hari.kaiwa.dinilai ? (dash.hari.kaiwa.tercapai / dash.hari.kaiwa.dinilai) * 100 : 0}%` }" />
            </div>
            <p class="mt-2 text-xs text-slate-600">
              {{ dash.hari.kaiwa.sisaHari ? $t('dashboard.sisaHari', { rentang: rentangMinggu(dash.hari.kaiwa.minggu), n: dash.hari.kaiwa.sisaHari }) : $t('dashboard.hariTerakhir', { rentang: rentangMinggu(dash.hari.kaiwa.minggu) }) }}
            </p>
            <p class="text-xs text-slate-500">
              {{ dash.hari.kaiwa.senseiWajib ? $t('dashboard.kaiwaAturanWajib', { target: dash.hari.kaiwa.target, sensei: dash.hari.kaiwa.senseiWajib }) : $t('dashboard.kaiwaAturan', { target: dash.hari.kaiwa.target }) }}
            </p>
            <p v-if="dash.hari.kaiwa.dinilai - dash.hari.kaiwa.sudahMulai > 0" class="mt-1 text-xs font-medium text-amber-800">
              {{ $t('dashboard.belumKaiwa', { n: dash.hari.kaiwa.dinilai - dash.hari.kaiwa.sudahMulai }) }}
            </p>
          </component>
        </div>
      </section>

      <!-- ============ THIS MONTH ============ -->
      <section class="space-y-3">
        <h2 class="text-base font-bold text-slate-900 font-display">
          {{ $t('dashboard.bulanIni') }} <span class="text-sm font-normal text-slate-500">· {{ namaBulan(dash.periode) }} · {{ $t('dashboard.dibanding', { bulan: namaBulan(dash.periodeLalu) }) }}</span>
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <DashStat
            :label="$t('dashboard.rataUjian')"
            :nilai="angka(b.ujian.rata)"
            :satuan="b.ujian.rata !== null ? grade(b.ujian.rata) : ''"
            :delta="b.ujian.delta"
            :delta-teks="teksDelta(b.ujian.delta)"
            :to="bisa('rekap-nilai-ujian') ? '/nilai-ujian' : ''"
          >
            {{ $t('dashboard.ujianSub', { lulus: b.ujian.lulusKkm, peserta: b.ujian.peserta, kkm: dash.aturan.kkmUjian, ujian: b.ujian.jumlahUjian }) }}
          </DashStat>
          <DashStat
            :label="$t('dashboard.kehadiran')"
            :nilai="angka(b.kehadiran.rasio)"
            :satuan="b.kehadiran.rasio !== null ? '%' : ''"
            :delta="b.kehadiran.delta"
            :delta-teks="teksDelta(b.kehadiran.delta)"
            :to="bisa('rekap-absensi') ? '/absensi' : ''"
          >
            {{ $t('dashboard.kehadiranSub', { hadir: b.kehadiran.hadir, sesi: b.kehadiran.sesi }) }}
          </DashStat>
          <DashStat
            :label="$t('dashboard.sikap')"
            :nilai="angka(b.sikap.rata)"
            :delta="b.sikap.delta"
            :delta-teks="teksDelta(b.sikap.delta)"
            :to="bisa('rekap-nilai-sikap') ? '/nilai-sikap' : ''"
          >
            {{ $t('dashboard.sikapSub', { bawah: b.sikap.bawahKkm, kkm: dash.aturan.kkmSikap, positif: b.sikap.positif, negatif: b.sikap.negatif }) }}
          </DashStat>
          <DashStat
            :label="$t('dashboard.kaiwaCard')"
            :nilai="angka(b.kaiwaCard.persen, 0)"
            :satuan="b.kaiwaCard.persen !== null ? '%' : ''"
            :to="bisa('kaiwa-mingguan') ? '/kaiwa-mingguan' : ''"
          >
            {{ b.kaiwaCard.minggu ? $t('dashboard.kaiwaCardSub', { tercapai: b.kaiwaCard.tercapai, minggu: b.kaiwaCard.minggu, sesi: b.kaiwaCard.sesi }) : $t('dashboard.kaiwaCardBelum', { sesi: b.kaiwaCard.sesi }) }}
          </DashStat>
          <DashStat
            :label="$t('dashboard.latihan7')"
            :nilai="angka(b.latihan.menitPerHari, 0)"
            :satuan="b.latihan.menitPerHari !== null ? $t('dashboard.menitPerHari') : ''"
            :to="bisa('monitor-latihan') ? '/monitor-latihan' : ''"
          >
            {{ $t('dashboard.latihan7Sub', { berlatih: b.latihan.berlatih, total: dash.pesertaAktif }) }}
          </DashStat>
          <DashStat
            :label="$t('dashboard.mensetsu')"
            :nilai="b.mensetsu.sesi"
            :satuan="$t('dashboard.sesi')"
            :to="bisa('rekap-mensetsu') ? '/mensetsu' : ''"
          >
            {{ $t('dashboard.mensetsuPeserta', { n: b.mensetsu.peserta }) }}
            <span v-for="g in ['A', 'B', 'C']" :key="g" class="whitespace-nowrap"> · {{ g }} {{ b.mensetsu.distribusi[g] }}</span>
          </DashStat>
        </div>
      </section>

      <!-- ============ EXAMS + PRACTICE ============ -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section class="joy-surface p-5 lg:col-span-2 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <h2 class="text-base font-bold text-slate-900 font-display">{{ $t('dashboard.nilaiUjian') }}</h2>
            <router-link v-if="bisa('rekap-nilai-ujian')" to="/nilai-ujian" class="text-xs font-semibold text-primary hover:underline">{{ $t('dashboard.buka') }}</router-link>
          </div>

          <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="min-w-0">
              <p class="text-xs font-medium text-slate-500">{{ $t('dashboard.tren6Bulan') }}</p>
              <DashTrenUjian
                :tren="dash.trenUjian"
                :kkm="dash.aturan.kkmUjian"
                :angka="angka"
                :bulan-pendek="bulanPendek"
                :teks-tooltip="teksTren"
              />
            </div>
            <div class="min-w-0 space-y-5">
              <div>
                <p class="text-xs font-medium text-slate-500">{{ $t('dashboard.perBagian', { bulan: namaBulan(dash.periode) }) }}</p>
                <ul v-if="adaBagian" class="mt-2 space-y-2.5">
                  <li v-for="k in BAGIAN" :key="k">
                    <div class="flex items-baseline justify-between gap-2 text-xs">
                      <span class="text-slate-700">{{ $t(`portal.bagian.${k}`) }}</span>
                      <span>
                        <span class="font-semibold tabular-nums" :class="lemah(b.ujian.bagian[k]) ? 'text-red-600' : 'text-slate-900'">{{ angka(b.ujian.bagian[k]) }}</span>
                        <span v-if="selisihBagian(k) !== null" class="ml-1.5 text-[11px] tabular-nums text-slate-500">{{ tandaAngka(selisihBagian(k)) }}</span>
                      </span>
                    </div>
                    <div class="relative mt-1 h-2 rounded-full bg-blue-100">
                      <div class="h-full rounded-full bg-blue-600" :style="{ width: `${b.ujian.bagian[k] ?? 0}%` }" />
                      <span class="absolute -top-0.5 h-3 w-px bg-amber-500" :style="{ left: `${dash.aturan.kkmUjian}%` }" :title="`KKM ${dash.aturan.kkmUjian}`" />
                    </div>
                  </li>
                </ul>
                <p v-else class="mt-2 text-xs text-slate-500">{{ $t('dashboard.bagianKosong') }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-slate-500 mb-2">{{ $t('dashboard.sebaranGrade') }}</p>
                <DashSegmen :bagian="segmenGrade(b.ujian.distribusi)" />
              </div>
            </div>
          </div>

          <div class="mt-5">
            <p class="text-xs font-medium text-slate-500 mb-2">{{ $t('dashboard.ujianTerbaru') }}</p>
            <p v-if="!dash.ujianTerbaru.length" class="text-sm text-slate-500">{{ $t('dashboard.ujianKosong') }}</p>
            <div v-else class="overflow-x-auto rounded-lg border border-slate-200">
              <table class="w-full text-left border-collapse joy-table text-sm">
                <thead>
                  <tr>
                    <th class="px-3 py-2">{{ $t('dashboard.colTanggal') }}</th>
                    <th class="px-3 py-2">{{ $t('dashboard.colKode') }}</th>
                    <th class="px-3 py-2">{{ $t('dashboard.colKelas') }}</th>
                    <th class="px-3 py-2 text-right">{{ $t('dashboard.colPeserta') }}</th>
                    <th class="px-3 py-2 text-right">{{ $t('dashboard.colRata') }}</th>
                    <th class="px-3 py-2 text-right">{{ $t('dashboard.colLulus', { kkm: dash.aturan.kkmUjian }) }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="u in dash.ujianTerbaru" :key="`${u.tanggal}|${u.kode}`">
                    <td class="px-3 py-2 text-xs text-slate-600 whitespace-nowrap">{{ tglPendek(u.tanggal) }}</td>
                    <td class="px-3 py-2 font-mono text-xs font-semibold text-slate-900 whitespace-nowrap">{{ u.kode || '-' }}</td>
                    <td class="px-3 py-2 text-xs text-slate-600">{{ u.kelas.join(', ') || '-' }}</td>
                    <td class="px-3 py-2 text-right tabular-nums">{{ u.peserta }}</td>
                    <td class="px-3 py-2 text-right tabular-nums font-semibold" :class="u.rata < dash.aturan.kkmUjian ? 'text-red-600' : 'text-slate-900'">{{ angka(u.rata) }}</td>
                    <td class="px-3 py-2 text-right tabular-nums">{{ angka(u.persenLulus, 0) }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section class="joy-surface p-5 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <h2 class="text-base font-bold text-slate-900 font-display">{{ $t('dashboard.latihanMandiri') }}</h2>
            <router-link v-if="bisa('monitor-latihan')" to="/monitor-latihan" class="text-xs font-semibold text-primary hover:underline">{{ $t('dashboard.buka') }}</router-link>
          </div>
          <p class="mt-1 text-xs text-slate-500">{{ $t('dashboard.latihanHarianDesc') }}</p>
          <DashLatihanHarian
            :harian="dash.latihanHarian"
            :label-jenis="labelJenis"
            :durasi="durasi"
            :teks-tooltip="teksLatihanHarian"
            :satuan-jam="$t('dashboard.satuanJam')"
          />
          <div class="mt-5">
            <p class="text-xs font-medium text-slate-500 mb-2">{{ $t('dashboard.gradeLatihan7') }}</p>
            <DashSegmen :bagian="segmenGrade(b.latihan.grade)" />
            <p v-if="dash.aturan.gradeLatihan" class="mt-2 text-[11px] text-slate-500">
              {{ $t('dashboard.gradeLatihanDesc', { target: dash.aturan.gradeLatihan.targetMenitHarian, bw: dash.aturan.gradeLatihan.bobotWaktu }) }}
            </p>
          </div>
        </section>
      </div>

      <!-- ============ CLASSES SIDE BY SIDE ============ -->
      <section class="joy-surface overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 class="text-base font-bold text-slate-900 font-display">{{ $t('dashboard.perbandinganKelas') }}</h2>
            <p class="text-xs text-slate-500 mt-0.5">{{ $t('dashboard.perbandinganDesc', { bulan: namaBulan(dash.periode) }) }}</p>
          </div>
          <router-link v-if="bisa('data-kelas')" to="/kelas" class="text-xs font-semibold text-primary hover:underline">{{ $t('dashboard.kelolaKelas') }}</router-link>
        </div>
        <p v-if="!dash.perKelas.length" class="p-6 text-sm text-slate-500">{{ $t('dashboard.kelasKosong') }}</p>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse joy-table text-sm">
            <thead>
              <tr>
                <th class="px-5 py-2.5">{{ $t('dashboard.colKelas') }}</th>
                <th class="px-3 py-2.5 text-right">{{ $t('dashboard.colPeserta') }}</th>
                <th class="px-3 py-2.5 text-right">{{ $t('dashboard.colUjian') }}</th>
                <th class="px-3 py-2.5 text-right">{{ $t('dashboard.colKehadiran') }}</th>
                <th class="px-3 py-2.5 text-right">{{ $t('dashboard.colSikap') }}</th>
                <th class="px-3 py-2.5 text-right">{{ $t('dashboard.colKaiwaMinggu') }}</th>
                <th class="px-3 py-2.5 text-right">{{ $t('dashboard.colLatihan') }}</th>
                <th class="px-5 py-2.5 text-right">{{ $t('dashboard.colFisik') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="k in dash.perKelas" :key="k.kelasId" class="align-top">
                <td class="px-5 py-3 min-w-[180px]">
                  <p class="font-semibold text-slate-900">{{ k.namaKelas }}</p>
                  <p class="text-xs text-slate-500">{{ [k.senseiNama, locale === 'ja' ? k.programNamaJa : k.programNama].filter(Boolean).join(' · ') || '-' }}</p>
                </td>
                <td class="px-3 py-3 text-right tabular-nums">{{ k.peserta }}</td>
                <td class="px-3 py-3 text-right">
                  <p class="tabular-nums font-semibold" :class="k.ujian.rata !== null && k.ujian.rata < dash.aturan.kkmUjian ? 'text-red-600' : 'text-slate-900'">{{ angka(k.ujian.rata) }}</p>
                  <p v-if="k.ujian.dinilai" class="text-[11px] text-slate-500 whitespace-nowrap">{{ $t('dashboard.lulusDari', { lulus: k.ujian.lulusKkm, n: k.ujian.dinilai }) }}</p>
                </td>
                <td class="px-3 py-3 text-right">
                  <p class="tabular-nums font-semibold" :class="k.kehadiran.rasio !== null && k.kehadiran.rasio < dash.aturan.ambangKehadiran ? 'text-red-600' : 'text-slate-900'">
                    {{ k.kehadiran.rasio === null ? '-' : `${angka(k.kehadiran.rasio)}%` }}
                  </p>
                  <p v-if="k.kehadiran.sesi" class="text-[11px] text-slate-500 whitespace-nowrap">{{ $t('dashboard.hadirDari', { hadir: k.kehadiran.hadir, sesi: k.kehadiran.sesi }) }}</p>
                </td>
                <td class="px-3 py-3 text-right">
                  <p class="tabular-nums font-semibold" :class="k.sikap.rata !== null && k.sikap.rata < dash.aturan.kkmSikap ? 'text-red-600' : 'text-slate-900'">{{ angka(k.sikap.rata) }}</p>
                  <p v-if="k.sikap.bawahKkm" class="text-[11px] text-red-600 whitespace-nowrap">{{ $t('dashboard.bawahKkmN', { n: k.sikap.bawahKkm }) }}</p>
                </td>
                <td class="px-3 py-3 text-right tabular-nums">
                  <span class="font-semibold text-slate-900">{{ k.kaiwaMingguIni.tercapai }}</span><span class="text-slate-500">/{{ k.kaiwaMingguIni.dinilai }}</span>
                </td>
                <td class="px-3 py-3 text-right">
                  <p class="tabular-nums font-semibold text-slate-900 whitespace-nowrap">{{ k.latihan.menitPerHari === null ? '-' : `${angka(k.latihan.menitPerHari, 0)} ${$t('dashboard.menitPerHari')}` }}</p>
                  <p v-if="k.latihan.nilai !== null" class="text-[11px] text-slate-500 whitespace-nowrap">{{ $t('dashboard.nilaiGrade', { nilai: angka(k.latihan.nilai) }) }}</p>
                </td>
                <td class="px-5 py-3 text-right">
                  <p class="tabular-nums font-semibold text-slate-900">{{ angka(k.fisik.rata) }}</p>
                  <p class="text-[11px] text-slate-500 whitespace-nowrap">{{ $t('dashboard.nDites', { n: k.fisik.dites, total: k.peserta }) }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ============ NEEDS ATTENTION ============ -->
      <section class="joy-surface overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200 space-y-3">
          <div>
            <h2 class="text-base font-bold text-slate-900 font-display">
              {{ $t('dashboard.perhatian') }} <span class="text-sm font-normal text-slate-500">· {{ dash.perhatian.length }}</span>
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">{{ $t('dashboard.perhatianDesc', { hari: dash.aturan.hariTanpaLatihan }) }}</p>
          </div>
          <div v-if="dash.perhatian.length" class="flex flex-wrap gap-1.5">
            <button
              v-for="f in filterPerhatian"
              :key="f.key"
              type="button"
              class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium"
              :class="filterAlasan === f.key ? 'border-primary bg-blue-50 text-blue-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'"
              :aria-pressed="filterAlasan === f.key"
              @click="pilihFilter(f.key)"
            >
              <v-icon v-if="f.ikon" :icon="f.ikon" size="13" />{{ f.label }}
              <span class="tabular-nums text-slate-500">{{ f.jumlah }}</span>
            </button>
          </div>
        </div>
        <p v-if="!dash.perhatian.length" class="p-6 text-sm text-emerald-700">{{ $t('dashboard.tidakAdaPerhatian') }}</p>
        <template v-else>
          <ul class="divide-y divide-slate-100">
            <li v-for="p in perhatianTampil" :key="p.pesertaId" class="px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <div class="sm:w-56 shrink-0 min-w-0">
                <p class="text-sm font-semibold text-slate-900 truncate">{{ p.nama }}</p>
                <p class="text-xs text-slate-500">{{ p.namaKelas }}</p>
              </div>
              <div class="flex flex-wrap gap-1.5 flex-1">
                <span
                  v-for="a in p.alasan"
                  :key="a.jenis"
                  class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
                  :class="a.jenis === filterAlasan ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'"
                >
                  <v-icon :icon="IKON_ALASAN[a.jenis]" size="13" />{{ teksAlasan(a) }}
                </span>
              </div>
              <router-link
                v-if="bisa('rapor-peserta')"
                :to="`/rapor?pesertaId=${p.pesertaId}&periode=${dash.periode}`"
                class="shrink-0 text-xs font-semibold text-primary hover:underline"
              >{{ $t('dashboard.rapor') }}</router-link>
            </li>
          </ul>
          <div v-if="perhatianTersaring.length > BATAS_PERHATIAN" class="px-5 py-2.5 border-t border-slate-100">
            <button type="button" class="text-xs font-semibold text-primary hover:underline" @click="semuaPerhatian = !semuaPerhatian">
              {{ semuaPerhatian ? $t('dashboard.tampilkanSedikit') : $t('dashboard.tampilkanSemua', { n: perhatianTersaring.length }) }}
            </button>
          </div>
        </template>
      </section>

      <!-- ============ READINESS, SIKAP NOTES, SYSTEM ============ -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section class="joy-surface p-5 min-w-0">
          <h2 class="text-base font-bold text-slate-900 font-display mb-3">{{ $t('dashboard.kesiapan') }}</h2>
          <ul v-if="overview" class="space-y-3">
            <li v-for="item in tagRows" :key="item.key">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="font-medium text-slate-700">{{ item.label }}</span>
                <span class="tabular-nums text-slate-900 font-semibold">{{ item.count }}</span>
              </div>
              <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full" :class="item.barClass" :style="{ width: `${item.pct}%` }" />
              </div>
            </li>
          </ul>
          <dl v-if="overview" class="mt-4 grid grid-cols-2 gap-3">
            <div class="rounded-lg border border-slate-200 px-3 py-2">
              <dt class="text-[11px] text-slate-500">{{ $t('dashboard.naitei') }}</dt>
              <dd class="text-lg font-bold text-slate-900">{{ overview.kpi.sudahNaitei }}</dd>
            </div>
            <component
              :is="bisa('peserta-luar') ? 'router-link' : 'div'"
              :to="bisa('peserta-luar') ? '/peserta-luar' : undefined"
              class="rounded-lg border border-slate-200 px-3 py-2 block"
              :class="bisa('peserta-luar') ? 'hover:border-slate-300' : ''"
            >
              <dt class="text-[11px] text-slate-500">{{ $t('dashboard.pesertaLuar') }}</dt>
              <dd class="text-lg font-bold text-slate-900">{{ overview.kpi.pesertaLuarKelas }}</dd>
            </component>
          </dl>
          <p class="mt-4 text-xs text-slate-600">
            <v-icon icon="mdi-run" size="14" class="text-slate-500 mr-1" />
            <template v-if="b.fisik.dites">{{ $t('dashboard.fisikRingkas', { rata: angka(b.fisik.rata), dites: b.fisik.dites, total: dash.pesertaAktif, bawah: b.fisik.bawahKkm }) }}</template>
            <template v-else>{{ $t('dashboard.fisikBelum') }}</template>
            <router-link v-if="bisa('evaluasi-fisik')" to="/evaluasi-fisik" class="ml-1 font-semibold text-primary hover:underline">{{ $t('dashboard.buka') }}</router-link>
          </p>
        </section>

        <section class="joy-surface p-5 min-w-0">
          <div class="flex items-center justify-between gap-2 mb-2">
            <h2 class="text-base font-bold text-slate-900 font-display">{{ $t('dashboard.sikapTerbaru') }}</h2>
            <router-link v-if="bisa('rekap-nilai-sikap')" to="/nilai-sikap" class="text-xs font-semibold text-primary hover:underline">{{ $t('app.all') }}</router-link>
          </div>
          <p v-if="!dash.sikapTerbaru.length" class="text-sm text-slate-500">{{ $t('dashboard.sikapKosong') }}</p>
          <ul v-else class="divide-y divide-slate-100">
            <li v-for="s in dash.sikapTerbaru" :key="s.id" class="py-2.5 flex items-start gap-2">
              <v-icon
                :icon="s.sentiment === 'positif' ? 'mdi-thumb-up-outline' : 'mdi-alert-circle-outline'"
                :color="s.sentiment === 'positif' ? 'success' : 'warning'"
                size="16"
                class="mt-0.5 shrink-0"
              />
              <div class="min-w-0 flex-1">
                <div class="flex items-baseline gap-2">
                  <p class="text-sm font-semibold text-slate-900 truncate">{{ s.nama }}</p>
                  <span class="ml-auto shrink-0 text-xs font-semibold tabular-nums" :class="s.sentiment === 'positif' ? 'text-emerald-700' : 'text-red-600'">
                    {{ s.sentiment === 'positif' ? '+' : '−' }}{{ angka(s.bobot) }}
                  </span>
                </div>
                <p class="text-xs text-slate-600">{{ locale === 'ja' ? s.kategoriNamaJa : s.kategoriNamaId }}<span class="text-slate-400"> · {{ s.namaKelas }} · {{ tglPendek(s.tanggal) }}</span></p>
                <p v-if="s.keterangan" class="text-xs text-slate-500 mt-0.5 line-clamp-2">{{ s.keterangan }}</p>
              </div>
            </li>
          </ul>
        </section>

        <section class="joy-surface p-5 min-w-0">
          <div class="flex items-center justify-between gap-2 mb-2">
            <h2 class="text-base font-bold text-slate-900 font-display">{{ $t('dashboard.aktivitasSistem') }}</h2>
            <router-link v-if="bisa('riwayat-aktivitas')" to="/config/audit-log" class="text-xs font-semibold text-primary hover:underline">{{ $t('app.all') }}</router-link>
          </div>
          <ul v-if="overview?.recentLogs?.length" class="divide-y divide-slate-100">
            <li v-for="log in overview.recentLogs.slice(0, 6)" :key="log.id" class="py-2 text-xs flex items-center justify-between gap-2">
              <div class="truncate">
                <span class="font-medium text-slate-800">{{ log.staffNama }}</span>
                <span class="text-slate-400 mx-1">·</span>
                <span class="text-slate-600">{{ log.aksi }}</span>
              </div>
              <span class="text-slate-400 tabular-nums shrink-0">{{ waktuPendek(log.createdAt) }}</span>
            </li>
          </ul>
          <p v-else class="text-sm text-slate-500">-</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';
import MancationSyncBanner from '../components/MancationSyncBanner.vue';
import DashStat from '../components/dashboard/DashStat.vue';
import DashTrenUjian from '../components/dashboard/DashTrenUjian.vue';
import DashLatihanHarian from '../components/dashboard/DashLatihanHarian.vue';
import DashSegmen from '../components/dashboard/DashSegmen.vue';

const { t, locale } = useI18n();
const appStore = useAppStore();

const STATUS = ['hadir', 'sakit', 'izin', 'alfa'];
const BAGIAN = ['mojiGoi', 'bunpou', 'choukai'];
const BATAS_PERHATIAN = 10;
const IKON_ALASAN = {
  ujian: 'mdi-clipboard-text-outline',
  kehadiran: 'mdi-calendar-remove-outline',
  sikap: 'mdi-scale-balance',
  kaiwa: 'mdi-account-voice',
  latihan: 'mdi-cards-outline',
  fisik: 'mdi-run',
};

const dash = ref(null);
const overview = ref(null);
const memuat = ref(false);
const gagal = ref(false);
const syncing = ref(false);
const filterAlasan = ref('semua');
const semuaPerhatian = ref(false);

const b = computed(() => dash.value?.bulan);
const bisa = (kode) => appStore.canAccess(kode);

// --- formatting -----------------------------------------------------------------------------------------------------

const intl = computed(() => (locale.value === 'ja' ? 'ja-JP' : 'id-ID'));
const angka = (v, digits = 1) =>
  v === null || v === undefined ? '-' : new Intl.NumberFormat(intl.value, { maximumFractionDigits: digits }).format(v);
const tandaAngka = (v) => `${v > 0 ? '+' : v < 0 ? '−' : '±'}${angka(Math.abs(v))}`;
// Noon WIB of a date, so the day never slips in another time zone.
const tgl = (iso, opsi) => new Intl.DateTimeFormat(intl.value, { timeZone: 'Asia/Jakarta', ...opsi }).format(new Date(`${iso}T12:00:00+07:00`));
const tglPanjang = (iso) => tgl(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const tglPendek = (iso) => tgl(iso, { day: 'numeric', month: 'short' });
const namaBulan = (ym) => tgl(`${ym}-15`, { month: 'long', year: 'numeric' });
const bulanPendek = (ym) => tgl(`${ym}-15`, { month: 'short' });
const rentangMinggu = (m) => `${tglPendek(m.mulai)} – ${tglPendek(m.selesai)}`;
const waktuPendek = (iso) =>
  iso ? new Intl.DateTimeFormat(intl.value, { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : '-';

function durasi(detik) {
  const menit = Math.round((detik || 0) / 60);
  return menit >= 60 ? t('monitorLatihan.jamMenit', { jam: Math.floor(menit / 60), menit: menit % 60 }) : t('monitorLatihan.menit', { n: menit });
}

function grade(v) {
  const g = dash.value.aturan.batasGrade;
  return v >= g.A ? 'A' : v >= g.B ? 'B' : v >= g.C ? 'C' : 'D';
}

const teksDelta = (d) => (d === null || d === undefined ? '' : t('dashboard.deltaDari', { delta: tandaAngka(d), bulan: bulanPendek(dash.value.periodeLalu) }));
const teksTren = (tr) =>
  tr.rata === null
    ? t('dashboard.trenKosong', { bulan: namaBulan(tr.bulan) })
    : t('dashboard.trenTooltip', { bulan: namaBulan(tr.bulan), nilai: angka(tr.rata), peserta: tr.peserta, ujian: tr.jumlahUjian });
const teksLatihanHarian = (h) =>
  t('dashboard.latihanTooltip', { tanggal: tgl(h.tanggal, { weekday: 'short', day: 'numeric', month: 'short' }), total: durasi(h.total), peserta: h.peserta });

const labelJenis = computed(() => ({
  flashcard: t('monitorLatihan.jenisFlashcard'),
  kanji: t('monitorLatihan.jenisKanji'),
  dokkai: t('monitorLatihan.jenisDokkai'),
}));

const WARNA_GRADE = { A: 'bg-emerald-500', B: 'bg-blue-500', C: 'bg-amber-500', D: 'bg-red-500' };
const segmenGrade = (dist) => ['A', 'B', 'C', 'D'].map((g) => ({ key: g, label: g, nilai: dist[g] || 0, warna: WARNA_GRADE[g] }));

const warnaStatus = (s) => (s === 'alfa' ? 'bg-red-50 text-red-700' : s === 'sakit' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-700');
const adaAbsensiHariIni = computed(() => dash.value.hari.absensi.kelas.some((k) => k.terisi));

// --- exams per section ----------------------------------------------------------------------------------------------

const adaBagian = computed(() => BAGIAN.some((k) => b.value.ujian.bagian[k] !== null));
const selisihBagian = (k) => {
  const ini = b.value.ujian.bagian[k];
  const lalu = b.value.ujian.bagianLalu?.[k];
  return ini === null || lalu === null || lalu === undefined ? null : Math.round((ini - lalu) * 10) / 10;
};
const lemah = (v) => v !== null && v < dash.value.aturan.kkmUjian;

// --- needs attention ------------------------------------------------------------------------------------------------

const filterPerhatian = computed(() => {
  const jumlah = (jenis) => dash.value.perhatian.filter((p) => p.alasan.some((a) => a.jenis === jenis)).length;
  return [
    { key: 'semua', label: t('dashboard.semua'), jumlah: dash.value.perhatian.length },
    ...Object.keys(IKON_ALASAN)
      .map((k) => ({ key: k, label: t(`dashboard.alasan.${k}`), ikon: IKON_ALASAN[k], jumlah: jumlah(k) }))
      .filter((f) => f.jumlah > 0),
  ];
});
const perhatianTersaring = computed(() =>
  filterAlasan.value === 'semua' ? dash.value.perhatian : dash.value.perhatian.filter((p) => p.alasan.some((a) => a.jenis === filterAlasan.value))
);
const perhatianTampil = computed(() => (semuaPerhatian.value ? perhatianTersaring.value : perhatianTersaring.value.slice(0, BATAS_PERHATIAN)));

function pilihFilter(key) {
  filterAlasan.value = key;
  semuaPerhatian.value = false;
}

function teksAlasan(a) {
  const aturan = dash.value.aturan;
  switch (a.jenis) {
    case 'ujian':
      return t('dashboard.alasanUjian', { nilai: angka(a.nilai), kkm: aturan.kkmUjian });
    case 'kehadiran':
      return t('dashboard.alasanKehadiran', { nilai: angka(a.nilai), batas: aturan.ambangKehadiran });
    case 'sikap':
      return t('dashboard.alasanSikap', { nilai: angka(a.nilai), kkm: aturan.kkmSikap });
    case 'kaiwa':
      return t(a.wajibTerpenuhi ? 'dashboard.alasanKaiwa' : 'dashboard.alasanKaiwaWajib', { jumlah: a.jumlah, target: a.target });
    case 'latihan':
      return a.hari === null ? t('dashboard.alasanLatihanBelum') : t('dashboard.alasanLatihan', { hari: a.hari });
    case 'fisik':
      return t('dashboard.alasanFisik', { nilai: angka(a.nilai) });
    default:
      return a.jenis;
  }
}

// --- readiness ------------------------------------------------------------------------------------------------------

const tagRows = computed(() => {
  const dist = overview.value?.tagCounts || {};
  const total = (dist.standar || 0) + (dist.berkembang || 0) + (dist.siap_interview || 0) || 1;
  return [
    { key: 'standar', barClass: 'bg-slate-400' },
    { key: 'berkembang', barClass: 'bg-blue-600' },
    { key: 'siap_interview', barClass: 'bg-emerald-600' },
  ].map((r) => ({ ...r, label: t(`tag.${r.key}`), count: dist[r.key] || 0, pct: Math.round(((dist[r.key] || 0) / total) * 100) }));
});

// --- loading --------------------------------------------------------------------------------------------------------

async function muat() {
  memuat.value = true;
  gagal.value = false;
  const [hasilDash, hasilOverview] = await Promise.allSettled([apiRequest('/dashboard/ringkasan'), apiRequest('/overview')]);
  if (hasilDash.status === 'fulfilled') dash.value = hasilDash.value;
  else {
    gagal.value = true;
    if (dash.value) appStore.notify(t('dashboard.gagalMuat'), 'error');
  }
  if (hasilOverview.status === 'fulfilled') overview.value = hasilOverview.value;
  memuat.value = false;
}

async function triggerSync() {
  syncing.value = true;
  try {
    const res = await apiRequest('/mancation/sync', { method: 'POST' });
    appStore.notify(t('app.syncSuccess', { classes: res.stats.classes, students: res.stats.students }), 'success');
    await muat();
  } catch (err) {
    appStore.notify(err.message || t('dashboard.gagalSync'), 'error');
  } finally {
    syncing.value = false;
  }
}

onMounted(muat);
</script>
