<template>
  <v-container fluid class="pa-4" max-width="1100">
    <div class="d-flex align-center flex-wrap ga-3 mb-4">
      <v-icon icon="mdi-sword-cross" size="32" color="primary" />
      <div>
        <h1 class="text-h5 font-weight-bold mb-0">{{ t('portal.kanjiAdventure.judul') }}</h1>
        <div class="text-body-2 text-medium-emphasis">{{ t('portal.kanjiAdventure.info') }}</div>
      </div>
      <v-spacer />
      <v-btn variant="text" size="small" prepend-icon="mdi-refresh" :loading="memuat" @click="muat">
        {{ t('portal.kanjiAdventure.cobaLagi') }}
      </v-btn>
    </div>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
      {{ t('portal.kanjiAdventure.gagalMuat') }} {{ error }}
      <template #append>
        <v-btn variant="text" size="small" @click="muat">{{ t('portal.kanjiAdventure.cobaLagi') }}</v-btn>
      </template>
    </v-alert>

    <section class="mb-6">
      <h2 class="text-subtitle-1 font-weight-bold mb-3">{{ t('portal.kanjiAdventure.pilihVolume') }}</h2>
      <v-row dense>
        <v-col v-for="volume in volumes" :key="volume.materi" cols="12" sm="6" md="4">
          <v-card
            variant="outlined"
            :class="['pa-3', 'cursor-pointer', { 'border-primary': volume.materi === materi }]"
            @click="pilihVolume(volume.materi)"
          >
            <div class="d-flex align-center ga-2">
              <v-icon :icon="ikonVolume(volume)" :color="warnaVolume(volume)" />
              <div class="flex-grow-1">
                <div class="font-weight-bold">{{ volume.judul || volume.materi }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ t(labelStatus(statusVolume(volume), 'volume')) }}
                </div>
              </div>
            </div>
            <v-progress-linear
              class="mt-3"
              :model-value="ringkasProgresAdventure(volume.progres, volume).persen"
              color="primary"
              height="6"
              rounded
            />
            <div class="text-caption text-medium-emphasis mt-1">
              {{ t('portal.kanjiAdventure.dikuasai', { n: ringkasProgresAdventure(volume.progres, volume).dikuasai }) }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <template v-if="peta">
      <section class="mb-6">
        <h2 class="text-subtitle-1 font-weight-bold mb-1">{{ t('portal.kanjiAdventure.petaJudul') }}</h2>
        <div class="text-body-2 text-medium-emphasis mb-3">{{ t('portal.kanjiAdventure.chunkInfo') }}</div>
        <div class="d-flex flex-wrap ga-3">
          <v-card
            v-for="chunk in peta.chunks || []"
            :key="chunk.index"
            variant="outlined"
            class="pa-3"
            min-width="150"
          >
            <div class="d-flex align-center ga-2 mb-2">
              <v-icon :icon="ikonStatus(statusChunk(chunk))" :color="warnaStatus(statusChunk(chunk))" size="20" />
              <div>
                <div class="font-weight-bold">{{ t('portal.kanjiAdventure.chunk', { n: chunk.index + 1 }) }}</div>
                <div class="text-caption text-medium-emphasis">{{ chunk.jumlah }} kanji</div>
              </div>
            </div>
            <div class="text-caption mb-2">{{ t(labelStatus(statusChunk(chunk), 'chunk')) }}</div>
            <v-btn
              block
              size="small"
              color="primary"
              :disabled="!bisaMulaiChunk(volumeAktif, chunk)"
              @click="mulaiChunk(chunk)"
            >
              {{ statusChunk(chunk) === 'selesai' ? t('portal.kanjiAdventure.ulang') : t('portal.kanjiAdventure.mulai') }}
            </v-btn>
          </v-card>
        </div>
      </section>

      <section class="mb-6">
        <v-card variant="tonal" color="deep-purple" class="pa-4">
          <div class="d-flex align-center ga-2 mb-2">
            <v-icon icon="mdi-shield-sword" />
            <div class="text-subtitle-1 font-weight-bold">{{ t('portal.kanjiAdventure.bossJudul') }}</div>
            <v-spacer />
            <v-chip size="small" :color="warnaStatus(statusBoss(peta.boss))" variant="flat">
              {{ t(labelStatus(statusBoss(peta.boss), 'boss')) }}
            </v-chip>
          </div>
          <div class="text-body-2 mb-3">{{ t('portal.kanjiAdventure.bossInfo') }}</div>
          <div class="text-caption mb-3">
            {{ t('portal.kanjiAdventure.jumlahBoss', { n: peta.boss?.jumlah || 0 }) }}
          </div>
          <v-btn
            color="deep-purple"
            :disabled="!bisaMulaiBoss(volumeAktif, peta.boss)"
            prepend-icon="mdi-sword"
            @click="mulaiBoss"
          >
            {{ t('portal.kanjiAdventure.mulaiBoss') }}
          </v-btn>
        </v-card>
      </section>
    </template>

    <section>
      <h2 class="text-subtitle-1 font-weight-bold mb-3">{{ t('portal.kanjiAdventure.riwayatJudul') }}</h2>
      <v-card variant="outlined">
        <v-list v-if="riwayat.length" lines="two">
          <v-list-item
            v-for="sesi in riwayat"
            :key="sesi.id || sesi.sesiId || sesi.waktu"
            :title="sesi.judul || sesi.materi"
            :subtitle="`${t('portal.kanjiAdventure.ronde', { n: sesi.ronde || 1 })} · ${sesi.waktu || ''}`"
          >
            <template #append>
              <v-chip size="small" variant="tonal">{{ sesi.nilai ?? sesi.skor ?? '-' }}</v-chip>
            </template>
          </v-list-item>
        </v-list>
        <div v-else class="pa-4 text-body-2 text-medium-emphasis">
          {{ t('portal.kanjiAdventure.riwayatKosong') }}
        </div>
      </v-card>
    </section>
  </v-container>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
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

const { t } = useI18n();
const router = useRouter();
const klien = buatKlienAdventure();

const volumes = ref([]);
const materi = ref('');
const peta = ref(null);
const riwayat = ref([]);
const memuat = ref(false);
const error = ref('');

const volumeAktif = computed(() => volumes.value.find((item) => item.materi === materi.value) || null);

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

function ikonVolume(volume) {
  const status = statusVolume(volume);
  return status === 'selesai' ? 'mdi-trophy' : status === 'terkunci' ? 'mdi-lock' : 'mdi-book-open-variant';
}

function warnaVolume(volume) {
  const status = statusVolume(volume);
  return status === 'selesai' ? 'success' : status === 'terkunci' ? 'grey' : 'primary';
}

async function muat() {
  memuat.value = true;
  error.value = '';
  try {
    const [daftar, riwayatData] = await Promise.all([klien.daftarVolume(), klien.riwayat({ batas: 5 })]);
    volumes.value = Array.isArray(daftar) ? daftar : daftar?.volume || [];
    riwayat.value = Array.isArray(riwayatData?.sesiAdventure) ? riwayatData.sesiAdventure : [];
    const pilihan = volumeAktif.value || volumes.value[0];
    if (pilihan) await pilihVolume(pilihan.materi);
  } catch (err) {
    error.value = err?.code || err?.message || 'GAGAL';
  } finally {
    memuat.value = false;
  }
}

async function pilihVolume(materiParam) {
  materi.value = materiParam;
  peta.value = null;
  try {
    peta.value = await klien.bacaVolume(materiParam);
  } catch (err) {
    error.value = err?.code || err?.message || 'GAGAL';
  }
}

function keTes(sesi, info) {
  sessionStorage.setItem('kanjiAdventureSesi', JSON.stringify({ ...sesi, ...info }));
  router.push('/portal/tes');
}

async function mulaiChunk(chunk) {
  if (!bisaMulaiChunk(volumeAktif.value, chunk)) return;
  try {
    const sesi = await klien.mulai({ materi: materi.value, chunkIndex: chunk.index });
    keTes(sesi, { mode: 'reguler', chunkIndex: chunk.index });
  } catch (err) {
    error.value = err?.code || err?.message || 'GAGAL';
  }
}

async function mulaiBoss() {
  if (!bisaMulaiBoss(volumeAktif.value, peta.value?.boss)) return;
  try {
    const sesi = await klien.mulai({ materi: materi.value, mode: 'boss' });
    keTes(sesi, { mode: 'boss', chunkIndex: -1 });
  } catch (err) {
    error.value = err?.code || err?.message || 'GAGAL';
  }
}

onMounted(muat);
</script>
