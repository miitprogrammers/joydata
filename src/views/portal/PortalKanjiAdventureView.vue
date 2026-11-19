<template>
  <div class="space-y-4">
    <p v-if="error" role="alert" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>

    <!-- Map -->
    <template v-if="tahap === 'peta'">
      <section class="joy-surface p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h1 class="text-xl font-bold text-slate-900 font-display">{{ t('portal.kanjiAdventure.judul') }}</h1>
            <p class="text-sm text-slate-600 mt-1">{{ t('portal.kanjiAdventure.info') }}</p>
          </div>
          <v-btn
            variant="text"
            size="small"
            class="text-none shrink-0"
            prepend-icon="mdi-refresh"
            :loading="memuat"
            @click="muat()"
          >
            {{ t('portal.kanjiAdventure.muatUlang') }}
          </v-btn>
        </div>

        <div v-if="memuat && !volumes.length" class="mt-4"><v-skeleton-loader type="list-item-two-line@3" /></div>
        <template v-else>
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <span class="text-xs text-slate-500">{{ t('portal.tes.levelKanji') }}</span>
            <v-btn-toggle v-model="level" mandatory color="primary" variant="outlined" density="compact">
              <v-btn v-for="j in levelOptions" :key="j" :value="j" class="text-none">{{ j }}</v-btn>
            </v-btn-toggle>
          </div>

          <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              v-for="volume in volumeLevel"
              :key="volume.materi"
              type="button"
              class="rounded-xl border-2 px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
              :class="volume.materi === materi ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'"
              @click="pilihVolume(volume.materi)"
            >
              <span class="flex items-center justify-between gap-2">
                <span class="min-w-0">
                  <span class="block text-sm font-semibold text-slate-900 truncate">{{ judulVolume(volume) }}</span>
                  <span class="block text-[11px] text-slate-500">{{ t(labelStatus(statusVolume(volume), 'volume')) }}</span>
                </span>
                <v-icon :icon="ikonVolume(volume)" :color="warnaVolume(volume)" size="20" />
              </span>
              <span class="mt-2 block h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <span class="block h-full rounded-full bg-primary" :style="{ width: `${ringkasan(volume).persen}%` }" />
              </span>
              <span class="mt-1 flex items-center justify-between gap-2 text-[11px] text-slate-500 tabular-nums">
                <span>{{ t('portal.kanjiAdventure.dikuasai', { n: ringkasan(volume).dikuasai }) }}</span>
                <span v-if="ringkasan(volume).bosses" class="text-amber-700">{{ t('portal.kanjiAdventure.bossSisa', { n: ringkasan(volume).bosses }) }}</span>
                <span v-else-if="ringkasan(volume).selesai" class="text-emerald-700">{{ t('portal.kanjiAdventure.selesai') }}</span>
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
              <h2 class="text-base font-bold text-slate-900 font-display">{{ judulVolume(volumeAktif) }}</h2>
              <p class="text-xs text-slate-500">{{ t('portal.kanjiAdventure.chunkInfo') }}</p>
            </div>
            <span class="text-xs text-slate-500 tabular-nums">{{ t('portal.kanjiAdventure.dikuasaiDari', { d: ringkasan(volumeAktif).dikuasai, n: volumeAktif.jumlah }) }}</span>
          </div>
          <p v-if="peta.terkunci" class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{{ t('messages.VOLUME_TERKUNCI') }}</p>
          <div class="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div class="h-full rounded-full bg-primary transition-all" :style="{ width: `${ringkasan(volumeAktif).persen}%` }" />
          </div>

          <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div v-for="chunk in peta.chunks || []" :key="chunk.index" class="rounded-xl border-2 border-slate-200 bg-white p-3.5">
              <div class="flex items-center justify-between gap-2">
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-slate-900">{{ t('portal.kanjiAdventure.chunk', { n: chunk.index + 1 }) }}</p>
                  <p class="text-[11px] text-slate-500 tabular-nums">{{ t('portal.kanjiAdventure.chunkProgres', { d: chunk.dikuasai ?? 0, n: chunk.jumlah }) }}</p>
                </div>
                <v-icon :icon="ikonStatus(statusChunk(chunk))" :color="warnaStatus(statusChunk(chunk))" size="20" />
              </div>
              <div class="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div class="h-full rounded-full bg-primary" :style="{ width: `${chunk.jumlah ? ((chunk.dikuasai ?? 0) / chunk.jumlah) * 100 : 0}%` }" />
              </div>
              <div class="mt-2 flex items-center justify-between gap-2">
                <span class="text-[11px]" :class="kelasStatus(statusChunk(chunk))">{{ t(labelStatus(statusChunk(chunk), 'chunk')) }}</span>
                <v-btn
                  size="small"
                  class="text-none"
                  color="primary"
                  :variant="statusChunk(chunk) === 'selesai' ? 'tonal' : 'flat'"
                  :disabled="!bisaMulaiChunk(volumeAktif, chunk)"
                  :loading="memuatSesi === `chunk-${chunk.index}`"
                  @click="mulaiChunk(chunk)"
                >
                  {{ teksTombolChunk(chunk) }}
                </v-btn>
              </div>
            </div>
          </div>
        </section>

        <section class="joy-surface p-5" :class="peta.boss?.status === 'tersedia' ? 'bg-amber-50/40' : ''">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div class="min-w-0">
              <h2 class="flex items-center gap-1.5 text-base font-bold text-slate-900 font-display">
                <v-icon icon="mdi-sword" size="18" class="text-amber-700" />
                {{ t('portal.kanjiAdventure.bossJudul') }}
              </h2>
              <p class="mt-0.5 text-xs text-slate-600">
                {{ peta.boss?.status === 'terkunci' ? t('portal.kanjiAdventure.bossTerkunci') : peta.boss?.jumlah ? t('portal.kanjiAdventure.bossInfo') : t('portal.kanjiAdventure.bossKosong') }}
              </p>
            </div>
            <span class="rounded-full px-2.5 py-0.5 text-[11px] font-semibold" :class="kelasStatus(statusBoss(peta.boss))">
              {{ t(labelStatus(statusBoss(peta.boss), 'boss')) }}
            </span>
          </div>
          <div v-if="peta.boss?.items?.length" class="mt-3">
            <p class="text-[11px] font-semibold text-slate-500">{{ t('portal.kanjiAdventure.bossDaftar') }}</p>
            <div class="mt-1.5 flex flex-wrap gap-1.5">
              <span v-for="b in peta.boss.items" :key="b.id" class="rounded-lg border border-amber-200 bg-white px-2 py-1 text-sm font-semibold text-slate-900" lang="ja">{{ b.kanji }}</span>
            </div>
          </div>
          <div class="mt-3 flex flex-wrap items-center gap-2">
            <v-btn
              color="primary"
              variant="flat"
              class="text-none"
              :disabled="!bisaMulaiBoss(volumeAktif, peta.boss)"
              :loading="memuatSesi === 'boss'"
              prepend-icon="mdi-sword"
              @click="mulaiBoss"
            >
              {{ t('portal.kanjiAdventure.mulaiBoss') }}
            </v-btn>
            <span v-if="peta.boss?.jumlah" class="text-xs text-slate-600 tabular-nums">
              {{ t('portal.kanjiAdventure.jumlahBoss', { n: peta.boss.jumlah }) }}
              <template v-if="peta.boss?.items?.some((b) => b.salah > 1)"> · {{ t('portal.kanjiAdventure.perluPerhatian') }}</template>
            </span>
          </div>
        </section>
      </template>

      <section class="joy-surface p-5">
        <div class="mb-2 flex items-center justify-between gap-2">
          <h2 class="text-base font-bold text-slate-900 font-display">{{ t('portal.kanjiAdventure.riwayatJudul') }}</h2>
          <span v-if="riwayat.length" class="text-[11px] text-slate-500">{{ t('portal.kanjiAdventure.gradeInfo') }}</span>
        </div>
        <p v-if="!riwayat.length" class="text-sm text-slate-500">{{ t('portal.kanjiAdventure.riwayatKosong') }}</p>
        <ul v-else class="divide-y divide-slate-100">
          <li v-for="s in riwayat" :key="s.id" class="flex items-center justify-between gap-3 py-2.5">
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-900 truncate">{{ s.materiJudul || s.materi }}</p>
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
          {{ t('portal.kanjiAdventure.keluar') }}
        </v-btn>
      </div>
      <KanjiRunner
        :key="kunciSesi"
        :soal="sesi.soal"
        mode="latihan"
        :mengirim="mengirim"
        @selesai="kirimNilai"
        @progres="progresAktivitas = $event"
      />
    </template>

    <!-- Result of one step -->
    <template v-else-if="tahap === 'hasil' && hasil">
      <section class="joy-surface p-6 text-center">
        <v-icon :icon="hasil.chunkTuntas ? 'mdi-check-decagram-outline' : 'mdi-sword'" size="40" :class="hasil.chunkTuntas ? 'text-emerald-600' : 'text-amber-600'" />
        <p class="mt-2 text-xs font-medium text-slate-500">{{ sesiInfo.judul }}</p>
        <p class="text-xl font-bold text-slate-900 font-display">{{ hasil.chunkTuntas ? t('portal.kanjiAdventure.chunkTuntas') : t('portal.kanjiAdventure.hasilJudul') }}</p>
        <p class="mt-1 text-sm text-slate-600">{{ pesanHasil }}</p>
        <p v-if="hasil.bossesBaru" class="mt-1 text-xs font-medium text-amber-700">{{ t('portal.kanjiAdventure.bossBaru', { n: hasil.bossesBaru }) }}</p>
        <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div class="rounded-lg border border-slate-200 px-3 py-2">
            <p class="text-[11px] text-slate-500">{{ t('portal.kanjiAdventure.benarPenuh') }}</p>
            <p class="text-lg font-bold tabular-nums text-slate-900">{{ hasil.benar }}/{{ hasil.total }}</p>
          </div>
          <div class="rounded-lg border border-slate-200 px-3 py-2">
            <p class="text-[11px] text-slate-500">{{ t('portal.kanjiAdventure.skor') }}</p>
            <p class="text-lg font-bold tabular-nums" :class="hasil.lulus ? 'text-emerald-700' : 'text-slate-900'">{{ num(hasil.skor, 1) }}</p>
          </div>
          <div class="rounded-lg border border-slate-200 px-3 py-2">
            <p class="text-[11px] text-slate-500">{{ t('portal.kanjiAdventure.grade') }}</p>
            <p class="text-lg font-bold tabular-nums text-slate-900">{{ hasil.grade?.grade || '-' }}</p>
          </div>
          <div class="rounded-lg border border-slate-200 px-3 py-2">
            <p class="text-[11px] text-slate-500">{{ t('portal.kanjiAdventure.boss') }}</p>
            <p class="text-lg font-bold tabular-nums text-slate-900">{{ hasil.boss?.jumlah ?? 0 }}</p>
          </div>
        </div>
        <p class="mt-3 text-xs text-slate-500">{{ t('portal.kanjiAdventure.hasilInfo') }}</p>
      </section>

      <section v-if="hasil.detail?.length" class="joy-surface p-5">
        <details>
          <summary class="cursor-pointer select-none text-sm font-semibold text-slate-900">{{ t('portal.kanjiAdventure.pembahasan') }}</summary>
          <ul class="mt-3 divide-y divide-slate-100">
            <li v-for="d in hasil.detail" :key="d.itemId" class="flex items-start gap-3 py-2.5">
              <span class="w-16 shrink-0 break-words text-2xl font-bold text-slate-900" lang="ja">{{ d.kanji }}</span>
              <div class="min-w-0 flex-1 space-y-0.5 text-sm">
                <p :class="d.bacaanOk ? 'text-slate-700' : 'text-red-700'">
                  <v-icon :icon="d.bacaanOk ? 'mdi-check' : 'mdi-close'" size="14" />
                  <span lang="ja">{{ d.bacaanDipilih ?? '—' }}</span>
                  <template v-if="!d.bacaanOk"> → <span class="font-semibold text-slate-900" lang="ja">{{ d.bacaanBenar }}</span></template>
                </p>
                <p :class="d.artiOk ? 'text-slate-700' : 'text-red-700'">
                  <v-icon :icon="d.artiOk ? 'mdi-check' : 'mdi-close'" size="14" />
                  {{ d.artiDipilih ?? '—' }}
                  <template v-if="!d.artiOk"> → <span class="font-semibold text-slate-900">{{ d.artiBenar }}</span></template>
                </p>
              </div>
            </li>
          </ul>
        </details>
      </section>

      <div class="flex flex-wrap justify-center gap-2">
        <v-btn v-if="langkahBerikut" color="primary" variant="flat" class="text-none" prepend-icon="mdi-arrow-right" @click="mulaiChunk(langkahBerikut)">
          {{ t('portal.kanjiAdventure.lanjutLangkah') }}
        </v-btn>
        <v-btn v-else-if="bossSiap" color="primary" variant="flat" class="text-none" prepend-icon="mdi-sword" @click="mulaiBoss">
          {{ t('portal.kanjiAdventure.mulaiBoss') }}
        </v-btn>
        <v-btn v-else-if="perluUlang" color="primary" variant="flat" class="text-none" prepend-icon="mdi-refresh" @click="ulangi">
          {{ t('portal.kanjiAdventure.ulangiLangkah') }}
        </v-btn>
        <v-btn v-else-if="volumeBerikut" color="primary" variant="flat" class="text-none" prepend-icon="mdi-arrow-right" @click="bukaVolumeBerikut">
          {{ t('portal.kanjiAdventure.volumeBerikut') }}
        </v-btn>
        <v-btn variant="outlined" color="primary" class="text-none" @click="kembaliKePeta">
          {{ t('portal.kanjiAdventure.kembali') }}
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
import { useDetakAktivitas } from '../../services/aktivitasLatihan.js';
import KanjiRunner from '../../components/portal/tes/KanjiRunner.vue';
import {
  bisaMulaiBoss,
  bisaMulaiChunk,
  buatKlienAdventure,
  i18nStatusKey,
  ringkasProgresAdventure,
  statusBoss,
  statusChunk,
  statusVolume,
} from '../../services/kanjiAdventure.js';

const { t, te, locale } = useI18n();
const router = useRouter();
const appStore = useAppStore();
const { num } = usePortalFormat();
const klien = buatKlienAdventure();

const volumes = ref([]);
const level = ref('N5');
const materi = ref('');
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
const progresAktivitas = ref({ posisi: null, itemSelesai: 0 });

const levelOptions = computed(() => [...new Set(volumes.value.map((v) => v.jlpt).filter(Boolean))]);
const volumeLevel = computed(() => volumes.value.filter((v) => v.jlpt === level.value));
const volumeAktif = computed(() => volumes.value.find((v) => v.materi === materi.value) || null);

function ringkasan(volume) {
  return ringkasProgresAdventure(volume?.progres, volume);
}

function judulVolume(volume) {
  return volume?.judulPendek || String(volume?.judul || volume?.materi || '').replace(/^N\d · /, '');
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
  return status === 'selesai' ? 'mdi-trophy' : status === 'terkunci' ? 'mdi-lock' : 'mdi-book-open-variant';
}

function warnaVolume(volume) {
  const status = statusVolume(volume);
  return status === 'selesai' ? 'success' : status === 'terkunci' ? 'grey' : 'primary';
}

function teksTombolChunk(chunk) {
  const status = statusChunk(chunk);
  if (status === 'selesai') return t('portal.kanjiAdventure.ulang');
  if (status === 'tersedia') return chunk.dikuasai ? t('portal.kanjiAdventure.lanjut') : t('portal.kanjiAdventure.mulai');
  return t('portal.kanjiAdventure.chunkTerkunci');
}

function pesanGagal(err) {
  if (isPortalSessionExpired(err, router)) return;
  const kunci = `messages.${err?.code || 'GENERIC_ERROR'}`;
  error.value = te(kunci) ? t(kunci) : t('messages.GENERIC_ERROR');
  appStore.notify(error.value, 'error');
}

function pilihVolumeAwal() {
  return (
    volumes.value.find((v) => !v.terkunci && !v.progres?.selesai) ||
    volumes.value.find((v) => !v.terkunci) ||
    volumes.value[0]
  );
}

let muatPetaKe = 0;

async function pilihVolume(materiParam) {
  materi.value = materiParam;
  const volume = volumes.value.find((v) => v.materi === materiParam);
  if (volume?.jlpt) level.value = volume.jlpt;
  peta.value = null;
  const nomor = ++muatPetaKe;
  memuatPeta.value = true;
  try {
    const data = await klien.bacaVolume(materiParam);
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
      klien.riwayat().catch(() => ({ sesiAdventure: [] })),
    ]);
    volumes.value = Array.isArray(daftar) ? daftar : daftar?.volume || [];
    riwayat.value = Array.isArray(riwayatData?.sesiAdventure) ? riwayatData.sesiAdventure.slice(0, 6) : [];
    if (!volumes.value.length) {
      materi.value = '';
      peta.value = null;
      return;
    }
    if (!volumes.value.some((v) => v.materi === materi.value)) {
      materi.value = pilihVolumeAwal().materi;
    }
    level.value = volumeAktif.value?.jlpt || levelOptions.value[0] || 'N5';
    if (materi.value) await pilihVolume(materi.value);
  } catch (err) {
    pesanGagal(err);
  } finally {
    memuat.value = false;
  }
}

const aktivitas = useDetakAktivitas(({ detikAktif, selesai, keepalive }) => {
  if (!sesi.value?.sesiId) return null;
  return klien.detak(sesi.value.sesiId, {
    detikAktif,
    selesai,
    keepalive,
    ...progresAktivitas.value,
  });
});

function mulaiSesi(baru, info) {
  sesi.value = baru;
  sesiInfo.value = info;
  hasil.value = null;
  progresAktivitas.value = { posisi: null, itemSelesai: 0 };
  kunciSesi.value += 1;
  tahap.value = 'latihan';
  window.scrollTo({ top: 0 });
  aktivitas.mulai(0, 'kanji');
}

async function mulaiChunk(chunk) {
  if (!bisaMulaiChunk(volumeAktif.value, chunk)) return;
  memuatSesi.value = `chunk-${chunk.index}`;
  error.value = '';
  try {
    const baru = await klien.mulai({ materi: materi.value, chunkIndex: chunk.index });
    mulaiSesi(baru, {
      judul: `${judulVolume(volumeAktif.value)} · ${t('portal.kanjiAdventure.chunk', { n: chunk.index + 1 })}`,
      keterangan: t('portal.kanjiAdventure.chunkKeterangan', { n: chunk.jumlah }),
    });
  } catch (err) {
    pesanGagal(err);
  } finally {
    memuatSesi.value = '';
  }
}

async function mulaiBoss() {
  if (!bisaMulaiBoss(volumeAktif.value, peta.value?.boss)) return;
  memuatSesi.value = 'boss';
  error.value = '';
  try {
    const baru = await klien.mulai({ materi: materi.value, mode: 'boss' });
    mulaiSesi(baru, {
      judul: `${judulVolume(volumeAktif.value)} · ${t('portal.kanjiAdventure.boss')}`,
      keterangan: t('portal.kanjiAdventure.ronde', { n: baru.ronde }),
    });
  } catch (err) {
    pesanGagal(err);
  } finally {
    memuatSesi.value = '';
  }
}

async function kirimNilai(jawaban) {
  if (!sesi.value?.sesiId) return;
  mengirim.value = true;
  error.value = '';
  try {
    const res = await klien.nilai(sesi.value.sesiId, jawaban, { detikAktif: aktivitas.detikAktif() });
    hasil.value = res;
    tahap.value = 'hasil';
    await aktivitas.berhenti({ kirimAkhir: false });
    await muat();
    window.scrollTo({ top: 0 });
  } catch (err) {
    pesanGagal(err);
  } finally {
    mengirim.value = false;
  }
}

async function keluarSesi() {
  if (!window.confirm(t('portal.kanjiAdventure.konfirmasiKeluar'))) return;
  await aktivitas.berhenti();
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
  const mode = sesi.value?.mode;
  const chunkIndex = sesi.value?.chunkIndex;
  sesi.value = null;
  hasil.value = null;
  tahap.value = 'peta';
  if (mode === 'boss') {
    await mulaiBoss();
    return;
  }
  const chunk = peta.value?.chunks?.find((c) => c.index === chunkIndex);
  if (chunk) await mulaiChunk(chunk);
}

async function bukaVolumeBerikut() {
  if (!volumeBerikut.value) return;
  const berikut = volumeBerikut.value;
  sesi.value = null;
  hasil.value = null;
  tahap.value = 'peta';
  level.value = berikut.jlpt;
  await pilihVolume(berikut.materi);
  window.scrollTo({ top: 0 });
}

const langkahBerikut = computed(() => {
  if (!hasil.value?.chunkTuntas || sesi.value?.mode === 'boss') return null;
  const berikut = peta.value?.chunks?.find((c) => c.index === hasil.value.nextChunk);
  return berikut && ['tersedia', 'selesai'].includes(statusChunk(berikut)) ? berikut : null;
});

const bossSiap = computed(() => Boolean(hasil.value?.chunkTuntas && statusBoss(peta.value?.boss) === 'tersedia'));

const perluUlang = computed(() => Boolean(hasil.value && !hasil.value.chunkTuntas && !hasil.value.selesai));

const volumeBerikut = computed(() => {
  if (!hasil.value?.selesai) return null;
  const index = volumes.value.findIndex((v) => v.materi === materi.value);
  return index >= 0 && index < volumes.value.length - 1 ? volumes.value[index + 1] : null;
});

const adaVolumeBerikut = computed(() => Boolean(volumeBerikut.value));

const pesanHasil = computed(() => {
  if (hasil.value?.chunkTuntas) {
    if (sesi.value?.mode !== 'boss') return t('portal.kanjiAdventure.tuntasInfo');
    return adaVolumeBerikut.value
      ? t('portal.kanjiAdventure.volumeSelesaiInfo')
      : t('portal.kanjiAdventure.volumeSelesaiAkhir');
  }
  if (Number(hasil.value?.sisa) > 0) return t('portal.kanjiAdventure.sisaLangkah', { n: hasil.value.sisa });
  return t('portal.kanjiAdventure.gagalInfo');
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
  return window.confirm(t('portal.kanjiAdventure.konfirmasiKeluar'));
});

onMounted(muat);
</script>
