<template>
  <div class="space-y-4">
    <p v-if="error" role="alert" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>

    <!-- Map -->
    <template v-if="tahap === 'peta'">
      <section class="joy-surface p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h1 class="text-xl font-bold text-slate-900 font-display">{{ t('portal.bunpouAdventure.judul') }}</h1>
            <p class="text-sm text-slate-600 mt-1">{{ t('portal.bunpouAdventure.info') }}</p>
          </div>
          <v-btn
            variant="text"
            size="small"
            class="text-none shrink-0"
            prepend-icon="mdi-refresh"
            :loading="memuat"
            @click="muat()"
          >
            {{ t('portal.bunpouAdventure.muatUlang') }}
          </v-btn>
        </div>

        <details class="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <summary class="cursor-pointer select-none font-semibold text-slate-900">{{ t('portal.bunpouAdventure.aturanJudul') }}</summary>
          <ul class="mt-2 list-disc space-y-1 pl-5">
            <li>{{ t('portal.bunpouAdventure.aturan1') }}</li>
            <li>{{ t('portal.bunpouAdventure.aturan2') }}</li>
            <li>{{ t('portal.bunpouAdventure.aturan3') }}</li>
            <li>{{ t('portal.bunpouAdventure.aturan4') }}</li>
          </ul>
        </details>

        <div v-if="memuat && !volumes.length" class="mt-4"><v-skeleton-loader type="list-item-two-line@3" /></div>
        <template v-else>
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <span class="text-xs text-slate-500">{{ t('portal.bunpouAdventure.level') }}</span>
            <v-btn-toggle v-model="level" mandatory color="primary" variant="outlined" density="compact">
              <v-btn v-for="j in levelOptions" :key="j" :value="j" class="text-none">{{ j }}</v-btn>
            </v-btn-toggle>
          </div>

          <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              v-for="volume in volumeLevel"
              :key="volume.kode"
              type="button"
              class="rounded-xl border-2 px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
              :class="[
                volume.kode === kode ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300',
                statusVolume(volume) === 'segera' ? 'opacity-80' : '',
              ]"
              @click="pilihVolume(volume.kode)"
            >
              <span class="flex items-center justify-between gap-2">
                <span class="min-w-0">
                  <span class="block text-sm font-semibold text-slate-900 truncate">{{ judulVolume(volume, t) }}</span>
                  <span class="block text-[11px]" :class="statusVolume(volume) === 'segera' ? 'font-semibold text-violet-700' : 'text-slate-500'">{{ t(labelStatus(statusVolume(volume), 'volume')) }}</span>
                </span>
                <v-icon :icon="ikonVolume(volume)" :color="warnaVolume(volume)" size="20" />
              </span>
              <span class="mt-2 block h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <span class="block h-full rounded-full bg-primary" :style="{ width: `${ringkasan(volume).persen}%` }" />
              </span>
              <span class="mt-1 flex items-center justify-between gap-2 text-[11px] text-slate-500 tabular-nums">
                <span>{{ t('portal.bunpouAdventure.dikuasaiDari', { d: ringkasan(volume).dikuasai, n: volume.jumlahPola }) }}</span>
                <span v-if="ringkasan(volume).bos" class="text-amber-700">{{ t('portal.bunpouAdventure.bosSisa', { n: ringkasan(volume).bos }) }}</span>
                <span v-else-if="ringkasan(volume).selesai" class="text-emerald-700">{{ t('portal.bunpouAdventure.selesai') }}</span>
              </span>
            </button>
          </div>
        </template>
      </section>

      <div v-if="memuatPeta" class="joy-surface p-5"><v-skeleton-loader type="list-item-two-line@2" /></div>

      <template v-else-if="peta && volumeAktif">
        <section class="joy-surface p-5">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div class="min-w-0">
              <h2 class="text-base font-bold text-slate-900 font-display">{{ judulVolume(volumeAktif, t) }}</h2>
              <p class="text-xs text-slate-500">{{ t('portal.bunpouAdventure.tahapInfo') }}</p>
            </div>
            <span class="text-xs text-slate-500 tabular-nums">{{ t('portal.bunpouAdventure.dikuasaiDari', { d: ringkasan(volumeAktif).dikuasai, n: volumeAktif.jumlahPola }) }}</span>
          </div>
          <p v-if="!volumeDirilis(volumeAktif)" class="mt-3 rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-800">{{ t('portal.bunpouAdventure.segeraInfo') }}</p>
          <p v-else-if="peta.terkunci" class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{{ t('portal.bunpouAdventure.terkunciInfo') }}</p>
          <div class="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div class="h-full rounded-full bg-primary transition-all" :style="{ width: `${ringkasan(volumeAktif).persen}%` }" />
          </div>

          <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div v-for="item in peta.tahap || []" :key="item.index" class="rounded-xl border-2 border-slate-200 bg-white p-3.5">
              <div class="flex items-center justify-between gap-2">
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-900">{{ labelTahap(item, t) }}</p>
                  <p class="text-[11px] text-slate-500 tabular-nums">{{ t('portal.bunpouAdventure.tahap', { n: item.index + 1 }) }} · {{ t('portal.bunpouAdventure.tahapProgres', { d: item.dikuasai ?? 0, n: item.jumlah }) }}</p>
                </div>
                <v-icon :icon="ikonStatus(statusTahap(item))" :color="warnaStatus(statusTahap(item))" size="20" />
              </div>
              <div class="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div class="h-full rounded-full bg-primary" :style="{ width: `${item.jumlah ? ((item.dikuasai ?? 0) / item.jumlah) * 100 : 0}%` }" />
              </div>
              <div class="mt-2 flex items-center justify-between gap-2">
                <span class="rounded-full px-2 py-0.5 text-[11px]" :class="kelasStatus(statusTahap(item))">{{ t(labelStatus(statusTahap(item), 'tahap')) }}</span>
                <v-btn
                  size="small"
                  class="text-none"
                  color="primary"
                  :variant="statusTahap(item) === 'selesai' ? 'tonal' : 'flat'"
                  :disabled="!bisaMulaiTahap(volumeAktif, item)"
                  :loading="memuatSesi === `tahap-${item.index}`"
                  @click="mulaiTahap(item)"
                >
                  {{ teksTombolTahap(item) }}
                </v-btn>
              </div>
            </div>
          </div>
        </section>

        <section class="joy-surface p-5" :class="peta.bos?.status === 'tersedia' ? 'bg-amber-50/40' : ''">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div class="min-w-0">
              <h2 class="flex items-center gap-1.5 text-base font-bold text-slate-900 font-display">
                <v-icon icon="mdi-sword" size="18" class="text-amber-700" />
                {{ t('portal.bunpouAdventure.bosJudul') }}
              </h2>
              <p class="mt-0.5 text-xs text-slate-600">
                {{ peta.bos?.status === 'terkunci' ? t('portal.bunpouAdventure.bosTerkunci') : peta.bos?.jumlah ? t('portal.bunpouAdventure.bosInfo') : t('portal.bunpouAdventure.bosKosong') }}
              </p>
            </div>
            <span class="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" :class="kelasStatus(statusBos(peta.bos))">
              {{ t(labelStatus(statusBos(peta.bos), 'bos')) }}
            </span>
          </div>
          <div v-if="peta.bos?.pola?.length" class="mt-3">
            <p class="text-[11px] font-semibold text-slate-500">{{ t('portal.bunpouAdventure.bosDaftar') }}</p>
            <ul class="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <li v-for="p in peta.bos.pola" :key="p.id" class="rounded-lg border border-amber-200 bg-white px-2.5 py-1.5">
                <p class="text-sm font-semibold text-slate-900" lang="ja" translate="no">{{ p.pola }}</p>
                <p class="text-[11px] text-slate-500">{{ p.arti }} · <span class="tabular-nums">{{ t('portal.bunpouAdventure.salahKali', { n: p.salah }) }}</span></p>
              </li>
            </ul>
          </div>
          <div class="mt-3 flex flex-wrap items-center gap-2">
            <v-btn
              color="primary"
              variant="flat"
              class="text-none"
              :disabled="!bisaMulaiBos(volumeAktif, peta.bos)"
              :loading="memuatSesi === 'bos'"
              prepend-icon="mdi-sword"
              @click="mulaiBos"
            >
              {{ t('portal.bunpouAdventure.mulaiBos') }}
            </v-btn>
            <span v-if="peta.bos?.jumlah" class="text-xs text-slate-600 tabular-nums">
              {{ t('portal.bunpouAdventure.bosJumlah', { n: peta.bos.jumlah }) }}
              · {{ t('portal.bunpouAdventure.bosRonde', { n: peta.bos.rondeBerikut, m: peta.bos.ukuranRonde ?? ukuranRondeBos(peta.bos.jumlah) }) }}
            </span>
          </div>
        </section>
      </template>

      <section class="joy-surface p-5">
        <div class="mb-2 flex items-center justify-between gap-2">
          <h2 class="text-base font-bold text-slate-900 font-display">{{ t('portal.bunpouAdventure.riwayatJudul') }}</h2>
          <span v-if="riwayat.length" class="text-[11px] text-slate-500">{{ t('portal.bunpouAdventure.gradeInfo') }}</span>
        </div>
        <p v-if="!riwayat.length" class="text-sm text-slate-500">{{ t('portal.bunpouAdventure.riwayatKosong') }}</p>
        <ul v-else class="divide-y divide-slate-100">
          <li v-for="s in riwayat" :key="s.id" class="flex items-center justify-between gap-3 py-2.5">
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-900 truncate">{{ s.materiJudul || s.judul || s.materi }}</p>
              <p class="text-[11px] text-slate-500">{{ waktuSesi(s) }} · {{ durasiSesi(s.detikAktif) }}</p>
            </div>
            <p class="shrink-0 text-base font-bold tabular-nums" :class="Number(s.skor) >= 75 ? 'text-slate-900' : 'text-amber-700'">{{ num(s.skor, 1) }}</p>
          </li>
        </ul>
      </section>
    </template>

    <!-- A paper is running -->
    <template v-else-if="tahap === 'latihan' && sesi">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <p class="text-sm font-bold text-slate-900 truncate">{{ sesiInfo.judul }}</p>
          <p class="text-xs text-slate-500">{{ sesiInfo.keterangan }}</p>
        </div>
        <v-btn size="small" variant="text" class="text-none shrink-0" prepend-icon="mdi-close" @click="keluarSesi">
          {{ t('portal.bunpouAdventure.keluar') }}
        </v-btn>
      </div>
      <BintangRunner
        :key="kunciSesi"
        ref="runner"
        :sesi-id="sesi.sesiId"
        :soal="sesi.soal"
        :mengirim="mengirim"
        @selesai="kirimNilai"
      />
    </template>

    <!-- Result of one session -->
    <template v-else-if="tahap === 'hasil' && hasil">
      <section class="joy-surface p-6 text-center">
        <v-icon :icon="tuntas ? 'mdi-check-decagram-outline' : 'mdi-star-four-points'" size="40" :class="tuntas ? 'text-emerald-600' : 'text-amber-600'" />
        <p class="mt-2 text-xs font-medium text-slate-500">{{ sesiInfo.judul }}</p>
        <p class="text-xl font-bold text-slate-900 font-display">{{ judulHasil }}</p>
        <p class="mt-1 text-sm text-slate-600">{{ pesanHasil }}</p>
        <ul class="mt-3 space-y-1 text-sm">
          <li v-if="modeTahap" class="font-semibold text-slate-900 tabular-nums">{{ t('portal.bunpouAdventure.polaDikuasai', { d: polaDikuasai, n: polaSesi }) }}</li>
          <li v-if="hasil.bosBaru" class="font-medium text-amber-700">{{ t('portal.bunpouAdventure.polaKeBos', { n: hasil.bosBaru }) }}</li>
          <li v-if="modeTahap && hasil.tahapTuntas" class="font-medium text-emerald-700">{{ t('portal.bunpouAdventure.tahapBerikutTerbuka') }}</li>
          <li v-if="!modeTahap && hasil.sisa > 0" class="font-medium text-slate-700 tabular-nums">
            {{ t('portal.bunpouAdventure.rondeBos', { n: hasil.bos?.ukuranRonde ?? ukuranRondeBos(hasil.bos?.jumlah ?? hasil.sisa), total: hasil.bos?.jumlah ?? hasil.sisa }) }}
          </li>
        </ul>
        <div class="mt-4 grid grid-cols-3 gap-2">
          <div class="rounded-lg border border-slate-200 px-3 py-2">
            <p class="text-[11px] text-slate-500">{{ t('portal.bunpouAdventure.benarPenuh') }}</p>
            <p class="text-lg font-bold tabular-nums text-slate-900">{{ hasil.benar }}/{{ hasil.total }}</p>
          </div>
          <div class="rounded-lg border border-slate-200 px-3 py-2">
            <p class="text-[11px] text-slate-500">{{ t('portal.bunpouAdventure.skor') }}</p>
            <p class="text-lg font-bold tabular-nums" :class="hasil.lulus ? 'text-emerald-700' : 'text-slate-900'">{{ num(hasil.skor, 1) }}</p>
          </div>
          <div class="rounded-lg border border-slate-200 px-3 py-2">
            <p class="text-[11px] text-slate-500">{{ t('portal.bunpouAdventure.grade') }}</p>
            <p class="text-lg font-bold tabular-nums text-slate-900">{{ hasil.grade?.grade || '-' }}</p>
          </div>
        </div>
        <p class="mt-3 text-xs text-slate-500">{{ t('portal.bunpouAdventure.hasilInfo') }}</p>
      </section>

      <section v-if="tinjauan.length" class="joy-surface p-5">
        <details>
          <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">{{ t('portal.bunpouAdventure.tinjau') }}</summary>
          <ul class="mt-3 divide-y divide-slate-100">
            <li v-for="r in tinjauan" :key="r.soalId" class="py-3 text-sm">
              <p class="flex items-start gap-2 text-base leading-[2.1] text-slate-900" lang="ja" translate="no">
                <v-icon :icon="r.benar ? 'mdi-check-circle' : 'mdi-close-circle'" :class="r.benar ? 'text-emerald-600' : 'text-red-600'" size="18" class="mt-2 shrink-0" />
                <span class="min-w-0 break-words">
                  <FuriganaText :text="r.kalimat.sebelum" />
                  <span v-for="(b, i) in r.kalimat.bagian" :key="i" class="rounded px-0.5" :class="b.bintang ? 'bg-amber-200 font-bold' : ''"><FuriganaText :text="b.teks" /></span>
                  <FuriganaText :text="r.kalimat.sesudah" />
                </span>
              </p>
              <p class="mt-0.5 pl-7 text-xs text-slate-500 tabular-nums">
                {{ t('portal.bunpouAdventure.jawabanBintang', { n: r.kunci }) }}
                <template v-if="!r.benar"> · {{ r.dipilih ?? '—' }} → {{ r.kunci }}</template>
              </p>
            </li>
          </ul>
        </details>
      </section>

      <div class="flex flex-wrap justify-center gap-2">
        <v-btn v-if="tahapBerikut" color="primary" variant="flat" class="text-none" prepend-icon="mdi-arrow-right" @click="mulaiTahap(tahapBerikut)">
          {{ t('portal.bunpouAdventure.lanjutTahap') }}
        </v-btn>
        <v-btn v-else-if="bosSiap" color="primary" variant="flat" class="text-none" prepend-icon="mdi-sword" @click="mulaiBos">
          {{ t('portal.bunpouAdventure.mulaiBos') }}
        </v-btn>
        <v-btn v-else-if="perluUlang" color="primary" variant="flat" class="text-none" prepend-icon="mdi-refresh" @click="ulangi">
          {{ modeTahap ? t('portal.bunpouAdventure.ulangiTahap') : t('portal.bunpouAdventure.mulaiBos') }}
        </v-btn>
        <v-btn v-else-if="volumeBerikut" color="primary" variant="flat" class="text-none" prepend-icon="mdi-arrow-right" @click="bukaVolumeBerikut">
          {{ t('portal.bunpouAdventure.volumeBerikut') }}
        </v-btn>
        <v-btn variant="outlined" color="primary" class="text-none" @click="kembaliKePeta">
          {{ t('portal.bunpouAdventure.kembali') }}
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useAppStore } from '../../stores/appStore.js';
import { isPortalSessionExpired, usePortalFormat } from '../../services/portalSession.js';
import BintangRunner from '../../components/portal/bunpou/BintangRunner.vue';
import FuriganaText from '../../components/portal/tes/FuriganaText.vue';
import {
  bisaMulaiBos,
  bisaMulaiTahap,
  buatKlienBunpou,
  i18nStatusKey,
  jumlahPolaSesi,
  judulVolume,
  labelTahap,
  polaDikuasaiSesi,
  ringkasProgresBunpou,
  statusBos,
  statusTahap,
  statusVolume,
  susunKalimat,
  ukuranRondeBos,
  volumeDirilis,
} from '../../services/bunpouAdventure.js';

const { t, te, locale } = useI18n();
const router = useRouter();
const appStore = useAppStore();
const { num } = usePortalFormat();
const klien = buatKlienBunpou();

const volumes = ref([]);
const level = ref('N5');
const kode = ref('');
const peta = ref(null);
const riwayat = ref([]);
const memuat = ref(false);
const memuatPeta = ref(false);
const memuatSesi = ref('');
const error = ref('');

const tahap = ref('peta');
const sesi = ref(null);
const sesiInfo = ref({ judul: '', keterangan: '' });
const hasil = ref(null);
const kunciSesi = ref(0);
const mengirim = ref(false);
const runner = ref(null);

const levelOptions = computed(() => [...new Set(volumes.value.map((v) => v.jlpt).filter(Boolean))]);
const volumeLevel = computed(() => volumes.value.filter((v) => v.jlpt === level.value));
const volumeAktif = computed(() => volumes.value.find((v) => v.kode === kode.value) || null);

function ringkasan(volume) {
  return ringkasProgresBunpou(volume?.progres, volume);
}

function labelStatus(status, jenis) {
  return i18nStatusKey(status, jenis);
}

function ikonStatus(status) {
  if (status === 'selesai') return 'mdi-check-circle';
  if (status === 'tersedia') return 'mdi-play-circle';
  return 'mdi-lock';
}

function warnaStatus(status) {
  if (status === 'selesai') return 'success';
  if (status === 'tersedia') return 'primary';
  return 'grey';
}

function kelasStatus(status) {
  if (status === 'selesai') return 'bg-emerald-100 text-emerald-800';
  if (status === 'tersedia') return 'bg-blue-50 text-blue-800';
  return 'bg-slate-100 text-slate-500';
}

function ikonVolume(volume) {
  const status = statusVolume(volume);
  if (status === 'selesai') return 'mdi-trophy';
  if (status === 'segera') return 'mdi-clock-outline';
  return status === 'terkunci' ? 'mdi-lock' : 'mdi-star-four-points';
}

function warnaVolume(volume) {
  const status = statusVolume(volume);
  if (status === 'selesai') return 'success';
  return status === 'terkunci' || status === 'segera' ? 'grey' : 'primary';
}

function teksTombolTahap(item) {
  const status = statusTahap(item);
  if (status === 'selesai') return t('portal.bunpouAdventure.ulang');
  if (status === 'tersedia') return item.dikuasai ? t('portal.bunpouAdventure.lanjut') : t('portal.bunpouAdventure.mulai');
  return t('portal.bunpouAdventure.tahapTerkunci');
}

function pesanGagal(err) {
  if (isPortalSessionExpired(err, router)) return;
  const kunci = `messages.${err?.code || 'GENERIC_ERROR'}`;
  error.value = te(kunci) ? t(kunci) : t('messages.GENERIC_ERROR');
  appStore.notify(error.value, 'error');
}

function pilihVolumeAwal() {
  return (
    volumes.value.find((v) => volumeDirilis(v) && !v.terkunci && !v.progres?.selesai) ||
    volumes.value.find((v) => !v.terkunci) ||
    volumes.value[0]
  );
}

let muatPetaKe = 0;

async function pilihVolume(kodeParam) {
  kode.value = kodeParam;
  const volume = volumes.value.find((v) => v.kode === kodeParam);
  if (volume?.jlpt) level.value = volume.jlpt;
  peta.value = null;
  const nomor = ++muatPetaKe;
  memuatPeta.value = true;
  try {
    const data = await klien.bacaVolume(kodeParam);
    if (nomor === muatPetaKe) peta.value = data;
  } catch (err) {
    if (nomor === muatPetaKe) pesanGagal(err);
  } finally {
    if (nomor === muatPetaKe) memuatPeta.value = false;
  }
}

async function muat() {
  memuat.value = true;
  error.value = '';
  try {
    const [daftar, riwayatData] = await Promise.all([
      klien.daftarVolume(),
      klien.riwayat().catch(() => ({ sesiBunpou: [] })),
    ]);
    volumes.value = Array.isArray(daftar) ? daftar : daftar?.volume || [];
    riwayat.value = Array.isArray(riwayatData?.sesiBunpou) ? riwayatData.sesiBunpou.slice(0, 6) : [];
    if (!volumes.value.length) {
      kode.value = '';
      peta.value = null;
      return;
    }
    if (!volumes.value.some((v) => v.kode === kode.value)) {
      kode.value = pilihVolumeAwal().kode;
    }
    level.value = volumeAktif.value?.jlpt || levelOptions.value[0] || 'N5';
    if (kode.value) await pilihVolume(kode.value);
  } catch (err) {
    pesanGagal(err);
  } finally {
    memuat.value = false;
  }
}

function mulaiSesi(baru, info) {
  sesi.value = baru;
  sesiInfo.value = info;
  hasil.value = null;
  kunciSesi.value += 1;
  tahap.value = 'latihan';
  window.scrollTo({ top: 0 });
}

async function mulaiTahap(item) {
  if (!bisaMulaiTahap(volumeAktif.value, item)) return;
  memuatSesi.value = `tahap-${item.index}`;
  error.value = '';
  try {
    const baru = await klien.mulai({ volume: kode.value, tahapIndex: item.index });
    mulaiSesi(baru, {
      judul: `${judulVolume(volumeAktif.value, t)} · ${labelTahap(item, t)}`,
      keterangan: t('portal.bunpouAdventure.sesiTahap', { n: jumlahPolaSesi(baru.soal) }),
    });
  } catch (err) {
    pesanGagal(err);
  } finally {
    memuatSesi.value = '';
  }
}

async function mulaiBos() {
  if (!bisaMulaiBos(volumeAktif.value, peta.value?.bos)) return;
  memuatSesi.value = 'bos';
  error.value = '';
  try {
    const baru = await klien.mulai({ volume: kode.value, mode: 'bos' });
    mulaiSesi(baru, {
      judul: `${judulVolume(volumeAktif.value, t)} · ${t('portal.bunpouAdventure.bos')}`,
      keterangan: t('portal.bunpouAdventure.ronde', { n: baru.ronde }),
    });
  } catch (err) {
    pesanGagal(err);
  } finally {
    memuatSesi.value = '';
  }
}

async function kirimNilai({ jawaban, detikAktif }) {
  if (!sesi.value?.sesiId || mengirim.value) return;
  mengirim.value = true;
  error.value = '';
  try {
    const res = await klien.nilai(sesi.value.sesiId, jawaban, { detikAktif });
    hasil.value = res;
    tahap.value = 'hasil';
    await runner.value?.berhenti({ kirimAkhir: false });
    await muat();
    window.scrollTo({ top: 0 });
  } catch (err) {
    if (err?.code === 'SESI_TIDAK_ADA') {
      // The paper expired or was handed in elsewhere: stop the heartbeat quietly and go back to the map.
      await runner.value?.berhenti({ kirimAkhir: false });
      sesi.value = null;
      hasil.value = null;
      tahap.value = 'peta';
      await muat();
      pesanGagal(err);
    } else {
      runner.value?.bukaKirimLagi();
      pesanGagal(err);
    }
  } finally {
    mengirim.value = false;
  }
}

async function keluarSesi() {
  if (!window.confirm(t('portal.bunpouAdventure.konfirmasiKeluar'))) return;
  await runner.value?.berhenti();
  sesi.value = null;
  hasil.value = null;
  tahap.value = 'peta';
  await muat();
}

function kembaliKePeta() {
  sesi.value = null;
  hasil.value = null;
  tahap.value = 'peta';
  window.scrollTo({ top: 0 });
}

async function ulangi() {
  const modeSesi = sesi.value?.mode;
  const tahapIndex = sesi.value?.tahapIndex;
  sesi.value = null;
  hasil.value = null;
  tahap.value = 'peta';
  if (modeSesi === 'bos') {
    await mulaiBos();
    return;
  }
  const item = peta.value?.tahap?.find((x) => x.index === tahapIndex);
  if (item) await mulaiTahap(item);
}

async function bukaVolumeBerikut() {
  if (!volumeBerikut.value) return;
  const berikut = volumeBerikut.value;
  sesi.value = null;
  hasil.value = null;
  tahap.value = 'peta';
  level.value = berikut.jlpt;
  await pilihVolume(berikut.kode);
  window.scrollTo({ top: 0 });
}

const modeTahap = computed(() => hasil.value?.mode !== 'bos');
const polaSesi = computed(() => jumlahPolaSesi(sesi.value?.soal));
const polaDikuasai = computed(() => polaDikuasaiSesi(sesi.value?.soal, hasil.value?.sisa));

// A tahap is done when all its patterns are mastered; a boss round is "tuntas" when the whole volume is done.
const tuntas = computed(() => Boolean(modeTahap.value ? hasil.value?.tahapTuntas : hasil.value?.selesai));

const tahapBerikut = computed(() => {
  if (!modeTahap.value || !hasil.value?.tahapTuntas) return null;
  const berikut = peta.value?.tahap?.find((x) => x.index === (hasil.value.tahapIndex ?? -1) + 1);
  return berikut && ['tersedia', 'selesai'].includes(statusTahap(berikut)) ? berikut : null;
});

const bosSiap = computed(() => Boolean(hasil.value?.tahapTuntas && modeTahap.value && statusBos(peta.value?.bos) === 'tersedia'));

// After a boss round with patterns left, the next round starts from the boss card.
const bosLanjut = computed(() => !modeTahap.value && !hasil.value?.selesai && statusBos(peta.value?.bos) === 'tersedia');

const perluUlang = computed(() => {
  if (!hasil.value || hasil.value.selesai) return false;
  if (modeTahap.value) return !hasil.value.tahapTuntas;
  return bosLanjut.value;
});

const volumeBerikut = computed(() => {
  if (!hasil.value?.selesai) return null;
  const urut = volumes.value.filter((v) => v.jlpt === volumeAktif.value?.jlpt);
  const index = urut.findIndex((v) => v.kode === kode.value);
  return index >= 0 && index < urut.length - 1 ? urut[index + 1] : null;
});

const judulHasil = computed(() => {
  if (!modeTahap.value) return hasil.value?.selesai ? t('portal.bunpouAdventure.bosTuntas') : t('portal.bunpouAdventure.hasilBosJudul');
  return hasil.value?.tahapTuntas ? t('portal.bunpouAdventure.tahapTuntas') : t('portal.bunpouAdventure.hasilJudul');
});

const pesanHasil = computed(() => {
  if (!hasil.value) return '';
  if (modeTahap.value) {
    if (hasil.value.tahapTuntas) return t('portal.bunpouAdventure.tuntasInfo');
    return Number(hasil.value.sisa) > 0
      ? t('portal.bunpouAdventure.sisaTahap', { n: hasil.value.sisa })
      : t('portal.bunpouAdventure.gagalInfo');
  }
  if (hasil.value.selesai) {
    return volumeBerikut.value ? t('portal.bunpouAdventure.volumeSelesaiInfo') : t('portal.bunpouAdventure.volumeSelesaiAkhir');
  }
  return t('portal.bunpouAdventure.sisaBos', { n: hasil.value.sisa });
});

// Per question: the full sentence in order with the ★ piece marked, from the paper of this session.
const tinjauan = computed(() => {
  const kertasPerId = new Map((sesi.value?.soal || []).map((k) => [k.id, k]));
  return (hasil.value?.detail || [])
    .map((d) => {
      const kertas = kertasPerId.get(d.soalId);
      return kertas ? { ...d, kalimat: susunKalimat(kertas) } : null;
    })
    .filter(Boolean);
});

const fmtWaktu = computed(() =>
  new Intl.DateTimeFormat(locale.value === 'ja' ? 'ja-JP' : 'id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
);

function waktuSesi(sesiRiwayat) {
  const iso = sesiRiwayat?.selesaiAt || sesiRiwayat?.mulaiAt;
  return iso ? fmtWaktu.value.format(new Date(iso)) : '-';
}

function durasiSesi(detik) {
  const total = Math.max(0, Math.floor(Number(detik) || 0));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

onBeforeRouteLeave(() => {
  if (tahap.value !== 'latihan') return true;
  return window.confirm(t('portal.bunpouAdventure.konfirmasiKeluar'));
});

onMounted(muat);
</script>
