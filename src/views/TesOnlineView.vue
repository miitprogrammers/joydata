<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('tesOnline.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1 max-w-3xl">{{ $t('tesOnline.subheading') }}</p>
      </div>
      <v-btn color="primary" variant="flat" size="small" prepend-icon="mdi-plus" class="text-none shrink-0" @click="openCreate">
        {{ $t('tesOnline.addBtn') }}
      </v-btn>
    </div>

    <div class="joy-surface p-4 grid grid-cols-1 sm:grid-cols-12 gap-3">
      <div class="sm:col-span-4">
        <v-select
          v-model="filterKelasId"
          :items="kelasFilterOptions"
          item-title="label"
          item-value="value"
          :label="$t('tesOnline.filterKelas')"
          variant="outlined"
          density="compact"
          hide-details
        />
      </div>
      <div class="sm:col-span-4">
        <v-select
          v-model="filterStatus"
          :items="statusFilterOptions"
          item-title="label"
          item-value="value"
          :label="$t('tesOnline.filterStatus')"
          variant="outlined"
          density="compact"
          hide-details
        />
      </div>
    </div>

    <div class="joy-surface overflow-hidden">
      <div v-if="loading" class="p-6"><v-skeleton-loader type="table-row-divider@4" /></div>
      <div v-else-if="!displayedItems.length" class="p-8 text-center text-sm text-slate-500">{{ $t('tesOnline.kosong') }}</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse joy-table">
          <thead>
            <tr>
              <th class="px-5 py-3">{{ $t('tesOnline.colKode') }}</th>
              <th class="px-4 py-3">{{ $t('tesOnline.colMateri') }}</th>
              <th class="px-4 py-3">{{ $t('tesOnline.colNilai') }}</th>
              <th class="px-4 py-3">{{ $t('tesOnline.colStatus') }}</th>
              <th class="px-4 py-3 text-right">{{ $t('tesOnline.colProgres') }}</th>
              <th class="px-5 py-3 text-right">{{ $t('app.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in displayedItems" :key="s.id">
              <td class="px-5 py-2.5 whitespace-nowrap">
                <div class="flex items-center gap-1">
                  <span class="font-mono text-base font-bold tracking-widest text-slate-900">{{ s.kode }}</span>
                  <v-btn icon="mdi-content-copy" size="x-small" variant="text" :aria-label="$t('tesOnline.salinKode', { kode: s.kode })" @click="salin(s.kode)" />
                </div>
                <div class="text-xs text-slate-500">{{ s.namaKelas }}</div>
              </td>
              <td class="px-4 py-2.5">
                <div class="font-medium text-slate-900">{{ s.jenis === 'kanji' ? 'Kanji' : 'Dokkai' }} · {{ s.materiJudul }}</div>
                <div class="text-xs text-slate-500">{{ jumlahLabel(s) }}</div>
              </td>
              <td class="px-4 py-2.5 whitespace-nowrap">
                <div class="font-medium text-slate-900">{{ s.namaUjian }}</div>
                <div class="text-xs text-slate-500 tabular-nums">{{ s.tanggalUjian }}</div>
              </td>
              <td class="px-4 py-2.5 whitespace-nowrap">
                <span class="text-xs font-semibold" :class="statusClass(s)">{{ statusLabel(s) }}</span>
                <div v-if="s.berlakuSampai" class="text-[11px] text-slate-500 tabular-nums">
                  {{ $t('tesOnline.sampai', { waktu: waktuPendek(s.berlakuSampai) }) }}
                </div>
              </td>
              <td class="px-4 py-2.5 text-right tabular-nums whitespace-nowrap">
                <div class="font-medium text-slate-900">{{ s.jumlahSelesai }}/{{ s.jumlahPeserta }}</div>
                <div class="text-xs text-slate-500">
                  <template v-if="s.rataSkor !== null">{{ $t('tesOnline.rata', { nilai: s.rataSkor }) }}</template>
                  <template v-if="s.jumlahBerjalan"> · {{ $t('tesOnline.berjalan', { n: s.jumlahBerjalan }) }}</template>
                </div>
              </td>
              <td class="px-5 py-2.5 text-right whitespace-nowrap">
                <v-btn size="x-small" variant="tonal" color="primary" class="text-none mr-1" @click="openHasil(s)">{{ $t('tesOnline.hasilBtn') }}</v-btn>
                <v-btn
                  size="x-small"
                  variant="text"
                  class="text-none"
                  :loading="busyId === s.id"
                  @click="toggleStatus(s)"
                >
                  {{ s.status === 'aktif' ? $t('tesOnline.tutupBtn') : $t('tesOnline.bukaBtn') }}
                </v-btn>
                <v-btn
                  v-if="!s.jumlahSelesai"
                  icon="mdi-trash-can-outline"
                  size="x-small"
                  variant="text"
                  color="error"
                  :aria-label="`${$t('app.delete')} ${s.kode}`"
                  @click="hapus(s)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Open a code -->
    <v-dialog v-model="createOpen" max-width="600">
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 font-semibold text-slate-900 font-display">{{ $t('tesOnline.addTitle') }}</div>
        <v-card-text class="pa-6 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <v-select
              v-model="form.kelasId"
              :items="kelasOptions"
              item-title="namaKelas"
              item-value="id"
              :label="$t('tesOnline.kelas')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
            <v-btn-toggle v-model="form.jenis" mandatory color="primary" variant="outlined" density="comfortable" class="self-center">
              <v-btn value="kanji" class="text-none">Kanji</v-btn>
              <v-btn value="dokkai" class="text-none">Dokkai</v-btn>
            </v-btn-toggle>
            <v-select
              v-model="form.materi"
              :items="materiOptions"
              item-title="label"
              item-value="kode"
              :label="$t('tesOnline.materi')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
            <v-text-field
              v-model="form.jumlahSoal"
              type="number"
              min="1"
              :label="form.jenis === 'kanji' ? $t('tesOnline.jumlahKata') : $t('tesOnline.jumlahBacaan')"
              :hint="$t('tesOnline.jumlahHint', { n: materiAktif?.jumlah ?? '-' })"
              persistent-hint
              variant="outlined"
              density="comfortable"
            />
            <v-text-field
              v-model="form.tanggalUjian"
              type="date"
              :label="$t('tesOnline.tanggalUjian')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
            <v-text-field
              v-model="form.namaUjian"
              :label="$t('tesOnline.namaUjian')"
              :hint="$t('tesOnline.namaUjianHint')"
              persistent-hint
              maxlength="40"
              variant="outlined"
              density="comfortable"
              @update:model-value="namaUjianDiubah = true"
            />
            <v-text-field
              v-model="form.berlakuSampai"
              type="datetime-local"
              class="sm:col-span-2"
              :label="$t('tesOnline.berlakuSampai')"
              :hint="$t('tesOnline.berlakuHint')"
              persistent-hint
              variant="outlined"
              density="comfortable"
            />
          </div>
          <p class="text-xs text-slate-500">{{ $t('tesOnline.acakInfo') }}</p>
        </v-card-text>
        <div class="px-6 py-3.5 border-t border-slate-200 flex justify-end gap-2 bg-slate-50/50">
          <v-btn variant="text" class="text-none" @click="createOpen = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" class="text-none" :loading="saving" :disabled="!formValid" @click="submitCreate">
            {{ $t('tesOnline.buatBtn') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- The new code, big enough to read out or put on the board -->
    <v-dialog v-model="kodeBaruOpen" max-width="420">
      <v-card v-if="kodeBaru" class="rounded-xl pa-6 text-center">
        <p class="text-sm text-slate-600">{{ $t('tesOnline.kodeBaruInfo', { kelas: kodeBaru.namaKelas }) }}</p>
        <p class="mt-3 font-mono text-4xl font-black tracking-[0.3em] text-slate-900">{{ kodeBaru.kode }}</p>
        <p class="mt-2 text-xs text-slate-500">
          {{ kodeBaru.jenis === 'kanji' ? 'Kanji' : 'Dokkai' }} · {{ kodeBaru.materiJudul }} · {{ kodeBaru.namaUjian }}
        </p>
        <div class="mt-5 flex justify-center gap-2">
          <v-btn variant="outlined" color="primary" class="text-none" prepend-icon="mdi-content-copy" @click="salin(kodeBaru.kode)">
            {{ $t('tesOnline.salin') }}
          </v-btn>
          <v-btn color="primary" variant="flat" class="text-none" @click="kodeBaruOpen = false">{{ $t('app.close') }}</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Results of one code -->
    <v-dialog v-model="hasilOpen" max-width="860" scrollable>
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-3">
          <div v-if="hasilData">
            <div class="font-semibold text-slate-900 font-display">
              <span class="font-mono tracking-widest">{{ hasilData.sesi.kode }}</span> · {{ hasilData.sesi.namaKelas }}
            </div>
            <div class="text-xs text-slate-500 mt-0.5">
              {{ hasilData.sesi.jenis === 'kanji' ? 'Kanji' : 'Dokkai' }} · {{ hasilData.sesi.materiJudul }} ·
              {{ hasilData.sesi.namaUjian }} · {{ hasilData.sesi.tanggalUjian }}
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <v-btn icon="mdi-refresh" size="small" variant="text" :loading="hasilLoading" :aria-label="$t('app.refresh')" @click="loadHasil" />
            <v-btn icon="mdi-close" size="small" variant="text" :aria-label="$t('app.close')" @click="hasilOpen = false" />
          </div>
        </div>
        <v-card-text class="pa-0" style="max-height: 70vh">
          <div v-if="hasilLoading && !hasilData" class="p-6"><v-skeleton-loader type="table-row-divider@5" /></div>
          <table v-else-if="hasilData" class="w-full text-left border-collapse joy-table text-sm">
            <thead>
              <tr>
                <th class="px-5 py-2.5">{{ $t('tesOnline.colPeserta') }}</th>
                <th class="px-4 py-2.5">{{ $t('tesOnline.colStatus') }}</th>
                <th class="px-4 py-2.5 text-right">{{ $t('tesOnline.colSkor') }}</th>
                <th class="px-4 py-2.5 text-right">{{ $t('tesOnline.colDurasi') }}</th>
                <th class="px-5 py-2.5">{{ $t('tesOnline.colSalah') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in hasilData.rows" :key="r.pesertaId">
                <td class="px-5 py-2 font-medium text-slate-900">{{ r.nama }}</td>
                <td class="px-4 py-2 text-xs font-semibold" :class="hasilStatusClass(r.status)">{{ $t(`tesOnline.statusPeserta.${r.status}`) }}</td>
                <td class="px-4 py-2 text-right tabular-nums font-bold" :class="r.skor !== null && r.skor < 75 ? 'text-red-600' : 'text-slate-900'">
                  {{ r.skor ?? '-' }}
                  <div v-if="r.ringkasan && r.ringkasan.benarBacaan !== null" class="text-[11px] font-normal text-slate-500">
                    {{ $t('tesOnline.bacaArti', { baca: r.ringkasan.benarBacaan, arti: r.ringkasan.benarArti, n: r.ringkasan.total }) }}
                  </div>
                  <div v-else-if="r.ringkasan" class="text-[11px] font-normal text-slate-500">{{ r.ringkasan.benar }}/{{ r.ringkasan.total }}</div>
                </td>
                <td class="px-4 py-2 text-right tabular-nums text-slate-600">{{ durasi(r.durasiDetik) }}</td>
                <td class="px-5 py-2 text-xs text-slate-600">
                  <details v-if="r.ringkasan?.salah.length">
                    <summary class="cursor-pointer text-blue-700 select-none">{{ $t('tesOnline.nSalah', { n: r.ringkasan.salah.length }) }}</summary>
                    <ul class="mt-1 space-y-0.5" lang="ja">
                      <li v-for="(x, i) in r.ringkasan.salah" :key="i">{{ x }}</li>
                    </ul>
                  </details>
                  <span v-else-if="r.ringkasan">{{ $t('tesOnline.semuaBenar') }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';

const { t, locale } = useI18n();
const appStore = useAppStore();

const loading = ref(true);
const items = ref([]);
const kelasOptions = ref([]);
const katalog = ref({ kanji: [], dokkai: [] });
const filterKelasId = ref('all');
const filterStatus = ref('all');
const busyId = ref(null);

const createOpen = ref(false);
const saving = ref(false);
const form = ref({});
const namaUjianDiubah = ref(false);
const kodeBaruOpen = ref(false);
const kodeBaru = ref(null);

const hasilOpen = ref(false);
const hasilLoading = ref(false);
const hasilData = ref(null);
const hasilSesiId = ref(null);

function notifyError(err) {
  appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
}

const kelasFilterOptions = computed(() => [
  { value: 'all', label: t('app.all') },
  ...kelasOptions.value.map((k) => ({ value: k.id, label: k.namaKelas })),
]);
const statusFilterOptions = computed(() => [
  { value: 'all', label: t('app.all') },
  { value: 'bisa', label: t('tesOnline.statusAktif') },
  { value: 'tutup', label: t('tesOnline.statusTutupSemua') },
]);
const displayedItems = computed(() =>
  items.value.filter(
    (s) =>
      (filterKelasId.value === 'all' || s.kelasId === filterKelasId.value) &&
      (filterStatus.value === 'all' || (filterStatus.value === 'bisa') === s.bisaDipakai)
  )
);

const materiOptions = computed(() =>
  (katalog.value[form.value.jenis] || []).map((m) => ({ ...m, label: m.judul }))
);
const materiAktif = computed(() => materiOptions.value.find((m) => m.kode === form.value.materi));
const formValid = computed(() => form.value.kelasId && form.value.materi && form.value.tanggalUjian && String(form.value.namaUjian || '').trim());

watch(
  () => form.value.jenis,
  (jenis, lama) => {
    if (!jenis || jenis === lama || !createOpen.value) return;
    form.value.materi = (katalog.value[jenis] || [])[0]?.kode || null;
    form.value.jumlahSoal = jenis === 'kanji' ? 20 : '';
  }
);
watch(
  () => form.value.materi,
  () => {
    if (!namaUjianDiubah.value) form.value.namaUjian = materiAktif.value?.saranNamaUjian || '';
  }
);

function hariIni() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function jumlahLabel(s) {
  const total = katalog.value[s.jenis]?.find((m) => m.kode === s.materi)?.jumlah;
  const n = s.jumlahSoal ?? total;
  return t(s.jenis === 'kanji' ? 'tesOnline.nKataAcak' : 'tesOnline.nBacaanAcak', { n, total });
}

function statusLabel(s) {
  if (s.status === 'ditutup') return t('tesOnline.statusDitutup');
  return s.bisaDipakai ? t('tesOnline.statusAktif') : t('tesOnline.statusKedaluwarsa');
}
function statusClass(s) {
  return s.bisaDipakai ? 'text-emerald-700' : 'text-slate-500';
}
function hasilStatusClass(status) {
  return status === 'selesai' ? 'text-emerald-700' : status === 'berjalan' ? 'text-amber-700' : 'text-slate-400';
}

function waktuPendek(isoStr) {
  return new Intl.DateTimeFormat(locale.value === 'ja' ? 'ja-JP' : 'id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoStr));
}

function durasi(detik) {
  if (detik === null || detik === undefined) return '-';
  return `${Math.floor(detik / 60)}:${String(detik % 60).padStart(2, '0')}`;
}

async function salin(kode) {
  try {
    await navigator.clipboard.writeText(kode);
    appStore.notify(t('tesOnline.tersalin', { kode }), 'success');
  } catch {
    appStore.notify(kode, 'info');
  }
}

async function loadData() {
  loading.value = true;
  try {
    const res = await apiRequest('/tes-online');
    items.value = res.items || [];
    kelasOptions.value = res.kelasOptions || [];
    katalog.value = res.materi || { kanji: [], dokkai: [] };
  } catch (err) {
    notifyError(err);
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  namaUjianDiubah.value = false;
  const materi = katalog.value.kanji[0];
  form.value = {
    kelasId: filterKelasId.value !== 'all' ? filterKelasId.value : kelasOptions.value.find((k) => k.status === 'aktif')?.id ?? null,
    jenis: 'kanji',
    materi: materi?.kode || null,
    jumlahSoal: 20,
    tanggalUjian: hariIni(),
    namaUjian: materi?.saranNamaUjian || '',
    berlakuSampai: `${hariIni()}T23:59`,
  };
  createOpen.value = true;
}

async function submitCreate() {
  saving.value = true;
  try {
    const f = form.value;
    const created = await apiRequest('/tes-online', {
      method: 'POST',
      body: {
        ...f,
        jumlahSoal: f.jumlahSoal === '' || f.jumlahSoal === null ? null : Number(f.jumlahSoal),
        berlakuSampai: f.berlakuSampai ? new Date(f.berlakuSampai).toISOString() : null,
      },
    });
    createOpen.value = false;
    kodeBaru.value = created;
    kodeBaruOpen.value = true;
    await loadData();
  } catch (err) {
    notifyError(err);
  } finally {
    saving.value = false;
  }
}

async function toggleStatus(s) {
  busyId.value = s.id;
  try {
    const reopen = s.status !== 'aktif' || !s.bisaDipakai;
    const body = reopen ? { status: 'aktif' } : { status: 'ditutup' };
    // Reopening an expired code: it stays open until the end of today.
    if (reopen && s.berlakuSampai && new Date(s.berlakuSampai) <= new Date()) {
      body.berlakuSampai = new Date(`${hariIni()}T23:59`).toISOString();
    }
    await apiRequest(`/tes-online/${s.id}`, { method: 'PATCH', body });
    await loadData();
  } catch (err) {
    notifyError(err);
  } finally {
    busyId.value = null;
  }
}

async function hapus(s) {
  if (!window.confirm(t('tesOnline.konfirmasiHapus', { kode: s.kode }))) return;
  try {
    await apiRequest(`/tes-online/${s.id}`, { method: 'DELETE' });
    appStore.notify(t('messages.deleted'), 'success');
    await loadData();
  } catch (err) {
    notifyError(err);
  }
}

async function loadHasil() {
  hasilLoading.value = true;
  try {
    hasilData.value = await apiRequest(`/tes-online/${hasilSesiId.value}/hasil`);
  } catch (err) {
    notifyError(err);
  } finally {
    hasilLoading.value = false;
  }
}

function openHasil(s) {
  hasilSesiId.value = s.id;
  hasilData.value = null;
  hasilOpen.value = true;
  loadHasil();
}

onMounted(loadData);
</script>
