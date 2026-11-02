<template>
  <div class="space-y-4">
    <!-- Running test or practice -->
    <template v-if="tahap === 'tes'">
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="text-sm font-bold text-slate-900 truncate">{{ judulTes }}</p>
          <p class="text-xs" :class="mode === 'resmi' ? 'text-blue-700 font-medium' : 'text-slate-500'">
            {{ mode === 'resmi' ? $t('portal.tes.modeResmi', { kode: resmi.sesi.namaUjian }) : $t('portal.tes.modeLatihan') }}
          </p>
        </div>
        <v-btn size="small" variant="text" class="text-none shrink-0" prepend-icon="mdi-close" @click="keluarTes">{{ $t('portal.tes.keluar') }}</v-btn>
      </div>
      <KanjiRunner
        v-if="jenis === 'kanji'"
        :key="kunciTes"
        :soal="soal"
        :mode="mode"
        :mulai-at="resmi?.mulaiAt || null"
        :mengirim="mengirim"
        @selesai="selesai"
      />
      <DokkaiRunner v-else :key="kunciTes" :soal="soal" :mode="mode" :mengirim="mengirim" @selesai="selesai" />
    </template>

    <HasilTes
      v-else-if="tahap === 'hasil'"
      :hasil="hasil"
      :judul="judulTes"
      :detik="detik"
      :tersimpan-info="tersimpanInfo"
      :bisa-ulang="mode === 'latihan'"
      @ulang="mulaiLatihan"
      @kembali="kembali"
    />

    <template v-else>
      <!-- Official test with a code from the sensei -->
      <section class="joy-surface p-5">
        <h2 class="text-base font-bold text-slate-900 font-display">{{ $t('portal.tes.resmiJudul') }}</h2>
        <p class="text-sm text-slate-600 mt-1">{{ $t('portal.tes.resmiInfo') }}</p>
        <form class="mt-3 flex gap-2" @submit.prevent="cekKode">
          <v-text-field
            v-model="kodeInput"
            :label="$t('portal.tes.kodeLabel')"
            variant="outlined"
            density="comfortable"
            hide-details
            maxlength="12"
            autocomplete="off"
            autocapitalize="characters"
            spellcheck="false"
            class="font-mono"
            @update:model-value="sesiKode = null"
          />
          <v-btn type="submit" color="primary" variant="flat" class="text-none" height="48" :loading="memeriksaKode" :disabled="!kodeInput.trim()">
            {{ $t('portal.tes.cekKode') }}
          </v-btn>
        </form>
        <div v-if="sesiKode" class="mt-3 rounded-xl border border-blue-200 bg-blue-50/60 p-4 space-y-2">
          <p class="text-sm font-semibold text-slate-900">
            {{ sesiKode.jenis === 'kanji' ? 'Kanji' : 'Dokkai' }} · {{ sesiKode.materiJudul }}
          </p>
          <ul class="text-xs text-slate-700 space-y-0.5">
            <li>{{ $t(sesiKode.jenis === 'kanji' ? 'portal.tes.infoJumlahKanji' : 'portal.tes.infoJumlahDokkai', { n: sesiKode.jumlah }) }}</li>
            <li>{{ $t('portal.tes.infoNilai', { kode: sesiKode.namaUjian, tanggal: tanggal(sesiKode.tanggalUjian) }) }}</li>
            <li>{{ $t('portal.tes.infoSekali') }}</li>
          </ul>
          <v-btn color="primary" variant="flat" class="text-none" :loading="memulai" prepend-icon="mdi-play" @click="mulaiResmi">
            {{ sesiKode.sudahDimulai ? $t('portal.tes.lanjutkanTes') : $t('portal.tes.mulaiTes') }}
          </v-btn>
        </div>
      </section>

      <!-- Practice: nothing is stored -->
      <section class="joy-surface p-5">
        <h2 class="text-base font-bold text-slate-900 font-display">{{ $t('portal.tes.latihanJudul') }}</h2>
        <p class="text-sm text-slate-600 mt-1">{{ $t('portal.tes.latihanInfo') }}</p>
        <v-btn-toggle v-model="jenisLatihan" mandatory color="primary" variant="outlined" density="comfortable" class="mt-3">
          <v-btn value="kanji" class="text-none">Kanji</v-btn>
          <v-btn value="dokkai" class="text-none">Dokkai</v-btn>
        </v-btn-toggle>
        <div class="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
          <button
            v-for="m in materiLatihan"
            :key="m.kode"
            type="button"
            class="rounded-xl border-2 px-3 py-2.5 text-left transition-colors"
            :class="materiDipilih === m.kode ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-300'"
            @click="materiDipilih = m.kode"
          >
            <span class="block text-sm font-semibold text-slate-900">{{ m.judul }}</span>
            <span class="block text-[11px] text-slate-500 mt-0.5">
              {{ $t(jenisLatihan === 'kanji' ? 'portal.tes.nKata' : 'portal.tes.nBacaan', { n: m.jumlah }) }}
            </span>
          </button>
        </div>
        <div class="mt-3 flex flex-wrap items-end gap-3">
          <v-select
            v-model="jumlahLatihan"
            :items="pilihanJumlah"
            item-title="label"
            item-value="value"
            :label="$t(jenisLatihan === 'kanji' ? 'portal.tes.jumlahSoal' : 'portal.tes.jumlahBacaan')"
            variant="outlined"
            density="comfortable"
            hide-details
            style="max-width: 200px"
          />
          <v-btn color="primary" variant="flat" class="text-none" height="48" :disabled="!materiDipilih" :loading="memuatLatihan" @click="mulaiLatihan">
            {{ $t('portal.tes.mulaiLatihan') }}
          </v-btn>
        </div>
      </section>

      <section class="joy-surface p-5">
        <h2 class="text-base font-bold text-slate-900 font-display mb-2">{{ $t('portal.tes.riwayatJudul') }}</h2>
        <p v-if="!riwayat.length" class="text-sm text-slate-500">{{ $t('portal.tes.riwayatKosong') }}</p>
        <ul v-else class="divide-y divide-slate-100">
          <li v-for="r in riwayat" :key="r.id" class="py-3 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm font-semibold text-slate-900">{{ r.namaUjian }}</p>
              <p class="text-xs text-slate-500 truncate">
                {{ r.jenis === 'kanji' ? 'Kanji' : 'Dokkai' }} · {{ r.materiJudul }} · {{ tanggal(r.tanggalUjian) }}
              </p>
            </div>
            <p class="text-lg font-bold tabular-nums shrink-0" :class="r.skor >= 75 ? 'text-slate-900' : 'text-red-600'">{{ num(r.skor, 2) }}</p>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { portalRequest } from '../../services/portalApi.js';
import { usePortalFormat, isPortalSessionExpired, loadPortalSession } from '../../services/portalSession.js';
import { useAppStore } from '../../stores/appStore.js';
import KanjiRunner from '../../components/portal/tes/KanjiRunner.vue';
import DokkaiRunner from '../../components/portal/tes/DokkaiRunner.vue';
import HasilTes from '../../components/portal/tes/HasilTes.vue';

const { t } = useI18n();
const router = useRouter();
const appStore = useAppStore();
const { num, tanggal } = usePortalFormat();

const katalog = ref({ kanji: [], dokkai: [] });
const riwayat = ref([]);

// pilih → tes → hasil
const tahap = ref('pilih');
const mode = ref('latihan');
const jenis = ref('kanji');
const soal = ref([]);
const judulTes = ref('');
const kunciTes = ref(0);
const resmi = ref(null);
const hasil = ref(null);
const detik = ref(0);
let mulaiTes = 0;
const mengirim = ref(false);

const kodeInput = ref('');
const sesiKode = ref(null);
const memeriksaKode = ref(false);
const memulai = ref(false);

const jenisLatihan = ref('kanji');
const materiDipilih = ref('DASAR');
const jumlahLatihan = ref(20);
const memuatLatihan = ref(false);

const materiLatihan = computed(() => katalog.value[jenisLatihan.value] || []);
const pilihanJumlah = computed(() =>
  jenisLatihan.value === 'kanji'
    ? [10, 20, 30, 50].map((n) => ({ value: n, label: String(n) })).concat({ value: 0, label: t('portal.tes.semua') })
    : [1, 3, 5].map((n) => ({ value: n, label: String(n) })).concat({ value: 0, label: t('portal.tes.semua') })
);
watch(jenisLatihan, (j) => {
  materiDipilih.value = j === 'kanji' ? 'DASAR' : 'L1';
  jumlahLatihan.value = j === 'kanji' ? 20 : 0;
});

const tersimpanInfo = computed(() =>
  mode.value === 'resmi' && hasil.value?.tersimpan
    ? t('portal.tes.tersimpan', { kode: hasil.value.sesi.namaUjian, tanggal: tanggal(hasil.value.sesi.tanggalUjian) })
    : ''
);

function gagal(err) {
  if (isPortalSessionExpired(err, router)) return;
  appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
}

async function muat() {
  try {
    const res = await portalRequest('/tes');
    katalog.value = res.materi;
    riwayat.value = res.riwayat;
  } catch (err) {
    gagal(err);
  }
}

function mulaiRunner({ jenisTes, modeTes, daftarSoal, judul }) {
  jenis.value = jenisTes;
  mode.value = modeTes;
  soal.value = daftarSoal;
  judulTes.value = judul;
  kunciTes.value += 1;
  hasil.value = null;
  mulaiTes = Date.now();
  tahap.value = 'tes';
  window.scrollTo({ top: 0 });
}

async function mulaiLatihan() {
  memuatLatihan.value = true;
  try {
    const params = new URLSearchParams({ jenis: jenisLatihan.value, materi: materiDipilih.value, jumlah: String(jumlahLatihan.value || '') });
    const res = await portalRequest(`/tes/latihan?${params}`);
    resmi.value = null;
    mulaiRunner({ jenisTes: res.jenis, modeTes: 'latihan', daftarSoal: res.soal, judul: `${res.jenis === 'kanji' ? 'Kanji' : 'Dokkai'} · ${res.materiJudul}` });
  } catch (err) {
    gagal(err);
  } finally {
    memuatLatihan.value = false;
  }
}

async function cekKode() {
  memeriksaKode.value = true;
  sesiKode.value = null;
  try {
    sesiKode.value = await portalRequest('/tes/kode', { method: 'POST', body: { kode: kodeInput.value } });
  } catch (err) {
    gagal(err);
  } finally {
    memeriksaKode.value = false;
  }
}

async function mulaiResmi() {
  memulai.value = true;
  try {
    const res = await portalRequest('/tes/mulai', { method: 'POST', body: { kode: kodeInput.value } });
    resmi.value = res;
    mulaiRunner({
      jenisTes: res.sesi.jenis,
      modeTes: 'resmi',
      daftarSoal: res.soal,
      judul: `${res.sesi.jenis === 'kanji' ? 'Kanji' : 'Dokkai'} · ${res.sesi.materiJudul}`,
    });
    mulaiTes = new Date(res.mulaiAt).getTime();
  } catch (err) {
    gagal(err);
  } finally {
    memulai.value = false;
  }
}

async function selesai(jawaban) {
  mengirim.value = true;
  try {
    hasil.value =
      mode.value === 'resmi'
        ? await portalRequest(`/tes/${resmi.value.percobaanId}/selesai`, { method: 'POST', body: { jawaban } })
        : await portalRequest('/tes/latihan/nilai', { method: 'POST', body: { jenis: jenis.value, soal: soal.value, jawaban } });
    detik.value = Math.max(0, Math.round((Date.now() - mulaiTes) / 1000));
    tahap.value = 'hasil';
    window.scrollTo({ top: 0 });
    if (mode.value === 'resmi') {
      sesiKode.value = null;
      kodeInput.value = '';
      // The new score shows up on the Nilai Ujian page and the dashboard.
      loadPortalSession({ force: true }).catch(() => {});
      muat();
    }
  } catch (err) {
    gagal(err);
  } finally {
    mengirim.value = false;
  }
}

function keluarTes() {
  const pesan = mode.value === 'resmi' ? t('portal.tes.konfirmasiKeluarResmi') : t('portal.tes.konfirmasiKeluar');
  if (!window.confirm(pesan)) return;
  tahap.value = 'pilih';
}

function kembali() {
  tahap.value = 'pilih';
  window.scrollTo({ top: 0 });
}

onBeforeRouteLeave(() => {
  if (tahap.value !== 'tes') return true;
  return window.confirm(mode.value === 'resmi' ? t('portal.tes.konfirmasiKeluarResmi') : t('portal.tes.konfirmasiKeluar'));
});

onMounted(muat);
</script>
