<template>
  <v-dialog :model-value="modelValue" fullscreen @update:model-value="(v) => (v ? $emit('update:modelValue', true) : tutup())">
    <v-card class="flex flex-col h-full">
      <div class="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div class="text-lg font-semibold text-slate-900 font-display">{{ $t('formasi.title') }}</div>
          <p class="text-xs text-slate-500 mt-0.5 max-w-3xl">{{ $t('formasi.subtitle') }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <v-text-field
            v-model="filter"
            :placeholder="$t('formasi.filterPlaceholder')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
            hide-details
            style="min-width: 220px"
          />
          <v-btn
            variant="outlined"
            color="primary"
            size="small"
            prepend-icon="mdi-account-plus-outline"
            class="text-none"
            :disabled="loading || !kelas.length"
            @click="bukaTambah"
          >
            {{ $t('formasi.tambahBtn') }}
          </v-btn>
          <v-btn icon="mdi-close" variant="text" size="small" :aria-label="$t('app.close')" @click="tutup" />
        </div>
      </div>

      <div class="flex-1 overflow-auto p-4 bg-slate-50">
        <v-skeleton-loader v-if="loading" type="table-row-divider@6" />
        <div v-else class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))">
          <section v-for="kolom in kolomList" :key="kolom.key" class="joy-surface flex flex-col">
            <header class="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-2">
              <div>
                <div class="font-semibold text-slate-900">{{ kolom.nama }}</div>
                <div class="text-xs text-slate-500 tabular-nums">
                  {{ kolom.mancationClassId ? `Mancation #${kolom.mancationClassId}` : $t('formasi.tanpaKelasHint') }}
                </div>
              </div>
              <div class="text-right tabular-nums">
                <div class="text-lg font-semibold text-slate-900">{{ kolom.rows.length }}</div>
                <div v-if="kolom.masuk || kolom.keluar" class="text-xs text-amber-700">
                  +{{ kolom.masuk }} / −{{ kolom.keluar }}
                </div>
              </div>
            </header>
            <ul class="divide-y divide-slate-100">
              <li
                v-for="row in kolom.rowsTampil"
                :key="row.akun"
                class="pl-2 pr-3 py-1 flex items-center gap-1"
                :class="row.berubah ? 'bg-amber-50' : ''"
              >
                <v-checkbox-btn v-model="dipilih" :value="row.akun" density="compact" />
                <div class="min-w-0 flex-1">
                  <div class="text-sm text-slate-900 truncate">{{ row.nama }}</div>
                  <div class="text-xs text-slate-500 tabular-nums truncate">
                    #{{ row.akun }}<span v-if="row.berubah" class="text-amber-700"> · {{ row.asalLabel }}</span>
                  </div>
                </div>
                <v-menu location="bottom end">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-swap-horizontal"
                      size="x-small"
                      variant="text"
                      :aria-label="$t('formasi.pindahkanAria', { nama: row.nama })"
                    />
                  </template>
                  <v-list density="compact">
                    <v-list-subheader>{{ $t('formasi.pindahKe') }}</v-list-subheader>
                    <v-list-item
                      v-for="opt in tujuanUntuk(row)"
                      :key="opt.value"
                      :title="opt.title"
                      @click="pindahkan([row.akun], opt.value)"
                    />
                  </v-list>
                </v-menu>
              </li>
              <li v-if="!kolom.rowsTampil.length" class="px-4 py-6 text-center text-xs text-slate-400">
                {{ $t('formasi.kosong') }}
              </li>
            </ul>
          </section>
        </div>
      </div>

      <div class="px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-white">
        <div class="flex flex-wrap items-center gap-2">
          <template v-if="dipilih.length">
            <span class="text-sm text-slate-700 tabular-nums">{{ $t('formasi.dipilih', { count: dipilih.length }) }}</span>
            <v-select
              v-model="tujuanMassal"
              :items="semuaTujuan"
              item-title="title"
              item-value="value"
              :label="$t('formasi.pindahKe')"
              variant="outlined"
              density="compact"
              hide-details
              style="min-width: 200px"
            />
            <v-btn
              size="small"
              variant="tonal"
              color="primary"
              class="text-none"
              :disabled="tujuanMassal === null"
              @click="pindahkan(dipilih, tujuanMassal)"
            >
              {{ $t('formasi.terapkan') }}
            </v-btn>
            <v-btn size="small" variant="text" class="text-none" @click="dipilih = []">{{ $t('formasi.batalPilih') }}</v-btn>
          </template>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm tabular-nums" :class="perubahan.length ? 'text-amber-700 font-medium' : 'text-slate-500'">
            {{ $t('formasi.jumlahPerubahan', { count: perubahan.length }) }}
          </span>
          <v-btn variant="text" class="text-none" :disabled="!perubahan.length" @click="resetPerubahan">
            {{ $t('formasi.reset') }}
          </v-btn>
          <v-btn color="primary" variant="flat" class="text-none" :disabled="!perubahan.length" @click="konfirmasiOpen = true">
            {{ $t('formasi.simpan') }}
          </v-btn>
        </div>
      </div>
    </v-card>

    <v-dialog v-model="tambahOpen" max-width="680" scrollable>
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200">
          <div class="font-semibold text-slate-900 font-display">{{ $t('formasi.tambahJudul') }}</div>
          <p class="text-xs text-slate-500 mt-0.5">{{ $t('formasi.tambahInfo') }}</p>
        </div>
        <v-card-text class="pa-6 space-y-4" style="max-height: 70vh">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <v-text-field
              v-model="cariQuery"
              class="sm:col-span-2"
              autofocus
              prepend-inner-icon="mdi-magnify"
              :label="$t('formasi.cariLabel')"
              :hint="$t('formasi.cariHint')"
              persistent-hint
              :loading="mencari"
              variant="outlined"
              density="comfortable"
              @update:model-value="jadwalkanCari"
            />
            <v-select
              v-model="kelasTambah"
              :items="kelas"
              item-title="namaKelas"
              item-value="id"
              :label="$t('formasi.tambahKeKelas')"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </div>
          <ul v-if="hasilCari.length" class="divide-y divide-slate-100 border border-slate-200 rounded-lg">
            <li v-for="a in hasilCari" :key="a.mancationAkunId" class="px-4 py-2.5 flex items-center gap-3">
              <div class="min-w-0 flex-1">
                <div class="text-sm font-medium text-slate-900 truncate">{{ a.nama }}</div>
                <div class="text-xs text-slate-500 tabular-nums truncate">
                  #{{ a.mancationAkunId }} · {{ a.email || '-' }}
                  <template v-if="a.terdaftar"> · {{ $t('formasi.terdaftar', { tanggal: a.terdaftar }) }}</template>
                </div>
                <div class="text-xs" :class="statusAkun(a).warna">{{ statusAkun(a).teks }}</div>
              </div>
              <v-btn
                v-if="statusAkun(a).bisa"
                size="small"
                variant="tonal"
                color="primary"
                prepend-icon="mdi-plus"
                class="text-none"
                :disabled="!kelasTambah"
                @click="tambahkan(a)"
              >
                {{ $t('formasi.tambahkan') }}
              </v-btn>
            </li>
          </ul>
          <p v-else-if="cariSelesai" class="text-sm text-slate-500">{{ $t('formasi.tidakDitemukan') }}</p>
          <p v-if="cariTerbatas" class="text-xs text-slate-500">
            {{ $t('formasi.cariTerbatas', { count: hasilCari.length }) }}
          </p>
        </v-card-text>
        <div class="px-6 py-3.5 border-t border-slate-200 flex justify-end bg-slate-50/50">
          <v-btn variant="text" class="text-none" @click="tambahOpen = false">{{ $t('app.close') }}</v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="konfirmasiOpen" max-width="640" scrollable>
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 font-semibold text-slate-900 font-display">
          {{ $t('formasi.konfirmasiJudul') }}
        </div>
        <v-card-text class="pa-6 space-y-4" style="max-height: 65vh">
          <p class="text-sm text-slate-700">{{ $t('formasi.konfirmasiInfo', { count: perubahan.length }) }}</p>
          <table class="w-full text-left border-collapse joy-table text-sm">
            <thead>
              <tr>
                <th class="px-3 py-2">{{ $t('formasi.kolNama') }}</th>
                <th class="px-3 py-2">{{ $t('formasi.kolDari') }}</th>
                <th class="px-3 py-2">{{ $t('formasi.kolKe') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in ringkasan" :key="r.akun">
                <td class="px-3 py-1.5">
                  <div class="text-slate-900">{{ r.nama }}</div>
                  <div class="text-xs text-slate-500 tabular-nums">#{{ r.akun }}</div>
                </td>
                <td class="px-3 py-1.5 text-slate-600">{{ r.dari }}</td>
                <td class="px-3 py-1.5 font-medium" :class="r.ke === null ? 'text-red-700' : 'text-slate-900'">
                  {{ r.ke === null ? $t('formasi.cabut') : r.ke }}
                </td>
              </tr>
            </tbody>
          </table>
        </v-card-text>
        <div class="px-6 py-3.5 border-t border-slate-200 flex justify-end gap-2 bg-slate-50/50">
          <v-btn variant="text" class="text-none" @click="konfirmasiOpen = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" class="text-none" :loading="saving" @click="simpan">
            {{ $t('formasi.simpan') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
});
const emit = defineEmits(['update:modelValue', 'saved']);

const { t } = useI18n();
const appStore = useAppStore();

// Board column (and menu value) for peserta without a class; the API gets kelasId null for it.
const TANPA = 'tanpa';

const loading = ref(false);
const saving = ref(false);
const kelas = ref([]);
const pesertaAsal = ref([]);
// Accounts added from the Mancation search, and the staged class of every peserta that changes (akun → kelasId | null).
const tambahan = ref({});
const tujuan = ref({});

const filter = ref('');
const dipilih = ref([]);
const tujuanMassal = ref(null);
const konfirmasiOpen = ref(false);

const tambahOpen = ref(false);
const cariQuery = ref('');
const kelasTambah = ref(null);
const hasilCari = ref([]);
const mencari = ref(false);
const cariSelesai = ref(false);
const cariTerbatas = ref(false);

const kelasById = computed(() => new Map(kelas.value.map((k) => [k.id, k])));

function namaKelas(kelasId) {
  return kelasId === null ? t('formasi.tanpaKelas') : kelasById.value.get(kelasId)?.namaKelas || `#${kelasId}`;
}

const orangByAkun = computed(() => {
  const map = new Map();
  for (const p of pesertaAsal.value) {
    map.set(p.mancationAkunId, { akun: p.mancationAkunId, nama: p.nama, asalKelasId: p.kelasId, baru: false });
  }
  for (const a of Object.values(tambahan.value)) {
    map.set(a.mancationAkunId, { akun: a.mancationAkunId, nama: a.nama, asalKelasId: null, baru: true });
  }
  return map;
});

function efektif(o) {
  return o.akun in tujuan.value ? tujuan.value[o.akun] : o.asalKelasId;
}

const kolomList = computed(() => {
  const q = String(filter.value || '').trim().toLowerCase();
  const orang = [...orangByAkun.value.values()].sort((a, b) => a.nama.localeCompare(b.nama));
  const kolom = [
    ...kelas.value.map((k) => ({ key: k.id, kelasId: k.id, nama: k.namaKelas, mancationClassId: k.mancationClassId })),
    { key: TANPA, kelasId: null, nama: t('formasi.tanpaKelas'), mancationClassId: null },
  ];
  return kolom.map((k) => {
    const rows = orang
      .filter((o) => efektif(o) === k.kelasId)
      .map((o) => ({
        ...o,
        berubah: o.akun in tujuan.value,
        asalLabel: o.baru ? t('formasi.baru') : t('formasi.dari', { kelas: namaKelas(o.asalKelasId) }),
      }));
    return {
      ...k,
      rows,
      rowsTampil: q ? rows.filter((r) => r.nama.toLowerCase().includes(q) || String(r.akun).includes(q)) : rows,
      masuk: rows.filter((r) => r.berubah).length,
      keluar: orang.filter((o) => !o.baru && o.asalKelasId === k.kelasId && efektif(o) !== k.kelasId).length,
    };
  });
});

const semuaTujuan = computed(() => [
  ...kelas.value.map((k) => ({ value: k.id, title: k.namaKelas })),
  { value: TANPA, title: t('formasi.cabut') },
]);

function tujuanUntuk(row) {
  const sekarang = efektif(row);
  return semuaTujuan.value
    .filter((opt) => (opt.value === TANPA ? sekarang !== null : opt.value !== sekarang))
    .map((opt) => (opt.value === TANPA && row.baru ? { ...opt, title: t('formasi.batalTambah') } : opt));
}

function pindahkan(akunList, nilai) {
  const ke = nilai === TANPA ? null : nilai;
  const nextTujuan = { ...tujuan.value };
  const nextTambahan = { ...tambahan.value };
  for (const akun of akunList) {
    const o = orangByAkun.value.get(akun);
    if (!o) continue;
    if (o.baru && ke === null) {
      delete nextTambahan[akun];
      delete nextTujuan[akun];
    } else if (o.asalKelasId === ke) {
      delete nextTujuan[akun];
    } else {
      nextTujuan[akun] = ke;
    }
  }
  tujuan.value = nextTujuan;
  tambahan.value = nextTambahan;
  dipilih.value = dipilih.value.filter((a) => !akunList.includes(a));
}

const perubahan = computed(() =>
  Object.entries(tujuan.value).map(([akun, kelasId]) => ({ mancationAkunId: Number(akun), kelasId }))
);

const ringkasan = computed(() =>
  perubahan.value
    .map(({ mancationAkunId, kelasId }) => {
      const o = orangByAkun.value.get(mancationAkunId);
      return {
        akun: mancationAkunId,
        nama: o?.nama || `#${mancationAkunId}`,
        dari: o?.baru ? t('formasi.luarJoy') : namaKelas(o?.asalKelasId ?? null),
        ke: kelasId === null ? null : namaKelas(kelasId),
      };
    })
    .sort((a, b) => String(a.ke).localeCompare(String(b.ke)) || a.nama.localeCompare(b.nama))
);

function resetPerubahan() {
  tujuan.value = {};
  tambahan.value = {};
  dipilih.value = [];
}

async function loadData() {
  loading.value = true;
  try {
    const res = await apiRequest('/kelas/formasi');
    kelas.value = res.kelas || [];
    pesertaAsal.value = res.peserta || [];
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return;
    resetPerubahan();
    filter.value = '';
    loadData();
  }
);

function tutup() {
  if (perubahan.value.length && !window.confirm(t('formasi.konfirmasiTutup'))) return;
  emit('update:modelValue', false);
}

async function simpan() {
  saving.value = true;
  try {
    const res = await apiRequest('/kelas/formasi', { method: 'PUT', body: { perubahan: perubahan.value } });
    appStore.notify(
      t(res.sinkron ? 'formasi.tersimpan' : 'formasi.tersimpanBelumSinkron', { count: res.berubah }),
      res.sinkron ? 'success' : 'warning'
    );
    konfirmasiOpen.value = false;
    resetPerubahan();
    emit('saved');
    await loadData();
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    saving.value = false;
  }
}

function bukaTambah() {
  kelasTambah.value ||= kelas.value[0]?.id ?? null;
  tambahOpen.value = true;
}

let cariTimer = null;
let cariSeq = 0;

function jadwalkanCari() {
  clearTimeout(cariTimer);
  cariTimer = setTimeout(cariAkun, 350);
}

async function cariAkun() {
  const q = String(cariQuery.value || '').trim();
  const seq = ++cariSeq;
  if (q.length < 3 && !/^\d+$/.test(q)) {
    hasilCari.value = [];
    cariSelesai.value = false;
    cariTerbatas.value = false;
    mencari.value = false;
    return;
  }
  mencari.value = true;
  try {
    const res = await apiRequest(`/kelas/formasi/cari-akun?q=${encodeURIComponent(q)}`);
    if (seq !== cariSeq) return;
    hasilCari.value = res.items || [];
    cariTerbatas.value = Boolean(res.terbatas);
    cariSelesai.value = true;
  } catch (err) {
    if (seq === cariSeq) appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    if (seq === cariSeq) mencari.value = false;
  }
}

// Only accounts without any class can be taken in; peserta already on the board are simply moved.
function statusAkun(a) {
  const o = orangByAkun.value.get(a.mancationAkunId);
  if (o) {
    const sekarang = efektif(o);
    if (sekarang === kelasTambah.value) {
      return { bisa: false, teks: t('formasi.sudahDiKelas', { kelas: namaKelas(sekarang) }), warna: 'text-emerald-700' };
    }
    return { bisa: true, teks: t('formasi.adaDiPapan', { kelas: namaKelas(sekarang) }), warna: 'text-slate-500' };
  }
  if (a.posisi === 'kosong') {
    const luar = a.keteranganLuarKelas
      ? ` · ${t('formasi.pesertaLuar', { ket: t(`luarTypes.${a.keteranganLuarKelas}`) })}`
      : '';
    return { bisa: true, teks: t('formasi.posisiKosong') + luar, warna: 'text-slate-500' };
  }
  return { bisa: false, teks: t('formasi.posisiLain', { kelas: a.namaKelas }), warna: 'text-red-700' };
}

function tambahkan(a) {
  const akun = a.mancationAkunId;
  if (!orangByAkun.value.has(akun)) {
    tambahan.value = { ...tambahan.value, [akun]: { mancationAkunId: akun, nama: a.nama } };
  }
  pindahkan([akun], kelasTambah.value);
}
</script>
