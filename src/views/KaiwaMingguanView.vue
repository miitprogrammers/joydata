<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="min-w-0">
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('kaiwaMingguan.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">
          {{ $t('kaiwaMingguan.aturan', { n: data?.target ?? '-' }) }}
          <template v-if="data?.senseiWajib">{{ $t('kaiwaMingguan.aturanWajib', { nama: data.senseiWajib.nama }) }}</template>
          <template v-if="data?.berlakuMulai">{{ $t('kaiwaMingguan.berlakuMulai', { tanggal: tanggalPanjang(data.berlakuMulai) }) }}</template>
        </p>
      </div>
      <v-btn
        v-if="appStore.canAccess('rekap-nilai-kaiwa')"
        to="/nilai-kaiwa"
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-plus"
        class="text-none whitespace-nowrap shrink-0"
      >
        {{ $t('kaiwa.addBtn') }}
      </v-btn>
    </div>

    <!-- Filters: week, class, status, search -->
    <div class="joy-surface p-4">
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div class="sm:col-span-4 flex items-center gap-1">
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            size="small"
            :disabled="!data || !data.minggu.adaSebelumnya"
            :aria-label="$t('kaiwaMingguan.mingguSebelumnya')"
            @click="geserMinggu(-7)"
          />
          <div class="flex-1 text-center min-w-0">
            <div class="text-sm font-semibold text-slate-900 truncate">
              {{ data ? rentang(data.minggu.mulai, data.minggu.selesai) : '-' }}
            </div>
            <button
              v-if="data && !data.minggu.mingguIni"
              type="button"
              class="text-[11px] font-medium text-primary hover:underline"
              @click="keMingguIni"
            >
              {{ $t('kaiwaMingguan.keMingguIni') }}
            </button>
            <div v-else class="text-[11px] text-slate-500">{{ $t('kaiwaMingguan.mingguIni') }}</div>
          </div>
          <v-btn
            icon="mdi-chevron-right"
            variant="text"
            size="small"
            :disabled="!data || data.minggu.mingguIni"
            :aria-label="$t('kaiwaMingguan.mingguBerikutnya')"
            @click="geserMinggu(7)"
          />
        </div>
        <div class="sm:col-span-3">
          <v-select
            v-model="filterKelasId"
            :items="kelasFilterOptions"
            item-title="label"
            item-value="value"
            :label="$t('kaiwa.filterKelas')"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="loadData"
          />
        </div>
        <div class="sm:col-span-2">
          <v-select
            v-model="filterStatus"
            :items="statusFilterOptions"
            item-title="label"
            item-value="value"
            :label="$t('kaiwaMingguan.filterStatus')"
            variant="outlined"
            density="compact"
            hide-details
          />
        </div>
        <div class="sm:col-span-3">
          <v-text-field
            v-model="searchQuery"
            :placeholder="$t('kaiwaMingguan.cari')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
        </div>
      </div>
    </div>

    <template v-if="data">
      <div
        v-if="!data.senseiWajib"
        class="joy-surface px-4 py-2.5 text-xs text-amber-800 bg-amber-50/70 flex items-center gap-2"
      >
        <v-icon icon="mdi-information-outline" size="16" />
        <span>{{ $t('kaiwaMingguan.wajibBelumDiatur') }}</span>
      </div>
      <div
        v-if="data.ringkasan.tanpaSensei > 0"
        class="joy-surface px-4 py-2.5 text-xs text-amber-800 bg-amber-50/70 flex items-center gap-2"
      >
        <v-icon icon="mdi-account-question-outline" size="16" />
        <span>{{ $t('kaiwaMingguan.tanpaSensei', { n: data.ringkasan.tanpaSensei }) }}</span>
      </div>

      <!-- Summary -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="joy-surface p-4">
          <div class="text-xs font-medium text-slate-500">{{ $t('kaiwaMingguan.kpiTercapai') }}</div>
          <div class="mt-1.5 flex items-baseline gap-1.5 tabular-nums">
            <span class="text-2xl font-bold text-emerald-700">{{ data.ringkasan.tercapai }}</span>
            <span class="text-sm text-slate-500">/ {{ data.ringkasan.jumlahPeserta }}</span>
          </div>
          <div class="text-xs text-slate-500 mt-0.5">{{ persen(data.ringkasan.tercapai, data.ringkasan.jumlahPeserta) }}</div>
        </div>
        <div class="joy-surface p-4">
          <div class="text-xs font-medium text-slate-500">{{ $t('kaiwaMingguan.kpiKurangSesi', { n: data.target }) }}</div>
          <div class="mt-1.5 text-2xl font-bold tabular-nums" :class="data.ringkasan.kurangSesi ? 'text-amber-700' : 'text-slate-900'">
            {{ data.ringkasan.kurangSesi }}
          </div>
          <div class="text-xs text-slate-500 mt-0.5">{{ $t('kaiwaMingguan.peserta') }}</div>
        </div>
        <div class="joy-surface p-4">
          <div class="text-xs font-medium text-slate-500 truncate">
            {{ data.senseiWajib ? $t('kaiwaMingguan.kpiBelumWajib', { nama: namaPendek(data.senseiWajib.nama) }) : $t('kaiwaMingguan.kpiBelumWajibKosong') }}
          </div>
          <div class="mt-1.5 text-2xl font-bold tabular-nums" :class="data.ringkasan.belumWajib ? 'text-amber-700' : 'text-slate-900'">
            {{ data.senseiWajib ? data.ringkasan.belumWajib : '-' }}
          </div>
          <div class="text-xs text-slate-500 mt-0.5">{{ $t('kaiwaMingguan.peserta') }}</div>
        </div>
        <div class="joy-surface p-4">
          <div class="text-xs font-medium text-slate-500">{{ $t('kaiwaMingguan.kpiSesi') }}</div>
          <div class="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums">{{ data.ringkasan.jumlahSesi }}</div>
          <div class="text-xs text-slate-500 mt-0.5">
            {{ $t('kaiwaMingguan.rataPerPeserta', { n: rataSesi }) }}
          </div>
        </div>
      </div>

      <!-- Recent weeks -->
      <div class="joy-surface p-4">
        <div class="text-xs font-medium text-slate-500 mb-3">{{ $t('kaiwaMingguan.trenJudul') }}</div>
        <div class="grid grid-cols-6 gap-2 items-end max-w-xl">
          <button
            v-for="w in [...data.riwayat].reverse()"
            :key="w.mulai"
            type="button"
            class="flex flex-col items-center gap-1 group"
            :aria-label="`${rentang(w.mulai, w.selesai)}: ${w.tercapai}/${w.jumlahPeserta}`"
            @click="pilihMinggu(w.mulai)"
          >
            <span class="text-[11px] font-semibold text-slate-700">{{ persen(w.tercapai, w.jumlahPeserta) }}</span>
            <span class="w-full max-w-12 h-16 rounded bg-slate-100 relative overflow-hidden">
              <span
                class="absolute inset-x-0 bottom-0 rounded"
                :class="w.mulai === data.minggu.mulai ? 'bg-primary' : 'bg-slate-400 group-hover:bg-slate-500'"
                :style="{ height: `${w.jumlahPeserta ? (w.tercapai / w.jumlahPeserta) * 100 : 0}%` }"
              />
            </span>
            <span class="text-[10px]" :class="w.mulai === data.minggu.mulai ? 'text-primary font-semibold' : 'text-slate-500'">
              {{ tanggalPendek(w.mulai) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Per peserta -->
      <div class="joy-surface overflow-hidden">
        <div v-if="!displayedPeserta.length" class="p-10 text-center text-sm text-slate-500">{{ $t('kaiwaMingguan.kosong') }}</div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse joy-table">
            <thead>
              <tr>
                <th class="px-5 py-3">{{ $t('kaiwa.colPeserta') }}</th>
                <th class="px-4 py-3 whitespace-nowrap">{{ $t('kaiwaMingguan.colSesi') }}</th>
                <th v-if="data.senseiWajib" class="px-4 py-3 whitespace-nowrap">{{ namaPendek(data.senseiWajib.nama) }}</th>
                <th class="px-4 py-3">{{ $t('kaiwaMingguan.colSensei') }}</th>
                <th class="px-5 py-3 whitespace-nowrap">{{ $t('kaiwaMingguan.colStatus') }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="p in displayedPeserta" :key="p.pesertaId">
                <tr class="cursor-pointer hover:bg-slate-50" @click="toggle(p.pesertaId)">
                  <td class="px-5 py-2.5">
                    <div class="flex items-center gap-1.5">
                      <v-icon :icon="expanded.has(p.pesertaId) ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="16" class="text-slate-400" />
                      <div class="min-w-0">
                        <div class="font-semibold text-slate-900">{{ p.nama }}</div>
                        <div class="text-[11px] text-slate-500">{{ p.kelasNama }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-2.5 whitespace-nowrap">
                    <div class="flex items-center gap-1" :aria-label="`${p.jumlah}/${p.target}`">
                      <span
                        v-for="i in Math.max(p.target, p.jumlah)"
                        :key="i"
                        class="w-2.5 h-2.5 rounded-full"
                        :class="i <= p.jumlah ? (p.tercapai ? 'bg-emerald-500' : 'bg-primary') : 'border border-slate-300'"
                      />
                      <span class="ml-1.5 text-xs font-semibold tabular-nums text-slate-700">{{ p.jumlah }}/{{ p.target }}</span>
                    </div>
                  </td>
                  <td v-if="data.senseiWajib" class="px-4 py-2.5">
                    <v-icon
                      :icon="p.wajibTerpenuhi ? 'mdi-check-circle' : 'mdi-close-circle-outline'"
                      :color="p.wajibTerpenuhi ? 'success' : 'warning'"
                      size="18"
                      :aria-label="p.wajibTerpenuhi ? $t('kaiwaMingguan.sudah') : $t('kaiwaMingguan.belum')"
                    />
                  </td>
                  <td class="px-4 py-2.5 text-xs text-slate-700">
                    <span v-if="!p.sesi.length" class="text-slate-400">-</span>
                    <span v-else class="flex flex-wrap gap-1">
                      <span
                        v-for="s in senseiRingkas(p.sesi)"
                        :key="s.nama"
                        class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                        :class="s.wajib ? 'bg-amber-100 text-amber-800' : s.kosong ? 'bg-slate-100 text-slate-500 italic' : 'bg-slate-100 text-slate-700'"
                      >
                        {{ s.nama }}<template v-if="s.n > 1"> ×{{ s.n }}</template>
                      </span>
                    </span>
                  </td>
                  <td class="px-5 py-2.5 whitespace-nowrap">
                    <span
                      class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      :class="p.tercapai ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
                    >
                      {{ statusText(p) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="expanded.has(p.pesertaId)">
                  <td :colspan="data.senseiWajib ? 5 : 4" class="px-5 pb-3 pt-0 bg-slate-50/60">
                    <p v-if="!p.sesi.length" class="text-xs text-slate-500 py-2 pl-6">{{ $t('kaiwaMingguan.belumAdaSesi') }}</p>
                    <ul v-else class="py-1 pl-6 space-y-1">
                      <li v-for="s in p.sesi" :key="s.id" class="text-xs text-slate-700 flex items-center gap-3">
                        <span class="w-28 text-slate-500">{{ tanggalHari(s.tanggal) }}</span>
                        <span class="w-6 font-mono font-bold" :class="kaiwaGradeColor(s.grade)">{{ s.grade }}</span>
                        <span :class="s.senseiNama ? '' : 'italic text-amber-700'">{{ s.senseiNama || $t('kaiwaMingguan.senseiBelumDiisi') }}</span>
                      </li>
                    </ul>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';

const { t, locale } = useI18n();
const appStore = useAppStore();

const data = ref(null);
const minggu = ref('');
const filterKelasId = ref('all');
const filterStatus = ref('all');
const searchQuery = ref('');
const expanded = ref(new Set());

const intlLocale = computed(() => (locale.value === 'ja' ? 'ja-JP' : 'id-ID'));

const kelasFilterOptions = computed(() => [
  { value: 'all', label: t('app.all') },
  ...(data.value?.kelasOptions || []).map((k) => ({ value: k.id, label: k.namaKelas })),
]);

const statusFilterOptions = computed(() => [
  { value: 'all', label: t('app.all') },
  { value: 'belum', label: t('kaiwaMingguan.belumTercapai') },
  { value: 'tercapai', label: t('kaiwaMingguan.tercapai') },
]);

const displayedPeserta = computed(() => {
  const q = String(searchQuery.value || '').trim().toLowerCase();
  return (data.value?.peserta || []).filter((p) => {
    if (filterStatus.value === 'belum' && p.tercapai) return false;
    if (filterStatus.value === 'tercapai' && !p.tercapai) return false;
    if (q && !p.nama.toLowerCase().includes(q) && !String(p.mancationAkunId || '').includes(q)) return false;
    return true;
  });
});

const rataSesi = computed(() => {
  const r = data.value?.ringkasan;
  if (!r?.jumlahPeserta) return '-';
  return new Intl.NumberFormat(intlLocale.value, { maximumFractionDigits: 1 }).format(r.jumlahSesi / r.jumlahPeserta);
});

function toDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function rentang(mulai, selesai) {
  const short = { day: 'numeric', month: 'short' };
  const fmt = (iso, opts) => new Intl.DateTimeFormat(intlLocale.value, opts).format(toDate(iso));
  return `${fmt(mulai, short)} – ${fmt(selesai, { ...short, year: 'numeric' })}`;
}

function tanggalPendek(iso) {
  return new Intl.DateTimeFormat(intlLocale.value, { day: 'numeric', month: 'short' }).format(toDate(iso));
}

function tanggalPanjang(iso) {
  return new Intl.DateTimeFormat(intlLocale.value, { day: 'numeric', month: 'long', year: 'numeric' }).format(toDate(iso));
}

function tanggalHari(iso) {
  return new Intl.DateTimeFormat(intlLocale.value, { weekday: 'short', day: 'numeric', month: 'short' }).format(toDate(iso));
}

function persen(n, total) {
  return total ? `${Math.round((n / total) * 100)}%` : '-';
}

function namaPendek(nama) {
  return nama ? String(nama).split(/\s+/)[0] : '';
}

function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// One chip per sensei with the number of sessions; sessions without a sensei are grouped as such.
function senseiRingkas(sesi) {
  const wajibId = data.value?.senseiWajib?.id;
  const byNama = new Map();
  for (const s of sesi) {
    const nama = s.senseiNama ? namaPendek(s.senseiNama) : t('kaiwaMingguan.tanpaSenseiChip');
    const cur = byNama.get(nama) || { nama, n: 0, wajib: Boolean(wajibId) && s.senseiId === wajibId, kosong: !s.senseiNama };
    cur.n += 1;
    byNama.set(nama, cur);
  }
  return [...byNama.values()].sort((a, b) => Number(b.wajib) - Number(a.wajib) || b.n - a.n);
}

function statusText(p) {
  if (p.tercapai) return t('kaiwaMingguan.tercapai');
  if (p.kurang > 0 && !p.wajibTerpenuhi) return t('kaiwaMingguan.kurangDanWajib', { n: p.kurang });
  if (p.kurang > 0) return t('kaiwaMingguan.kurangN', { n: p.kurang });
  return t('kaiwaMingguan.belumWajib', { nama: namaPendek(data.value?.senseiWajib?.nama) });
}

function kaiwaGradeColor(g) {
  if (g === 'A') return 'text-emerald-700';
  if (g === 'B') return 'text-sky-700';
  if (g === 'C') return 'text-amber-700';
  return 'text-slate-400';
}

function toggle(id) {
  const next = new Set(expanded.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expanded.value = next;
}

async function loadData() {
  try {
    const params = new URLSearchParams();
    if (minggu.value) params.set('minggu', minggu.value);
    if (filterKelasId.value && filterKelasId.value !== 'all') params.set('kelasId', String(filterKelasId.value));
    data.value = await apiRequest(`/kaiwa/mingguan?${params.toString()}`);
    minggu.value = data.value.minggu.mulai;
  } catch (err) {
    const key = `messages.${err.code}`;
    appStore.notify(t(key) !== key ? t(key) : t('messages.GENERIC_ERROR'), 'error');
  }
}

function geserMinggu(days) {
  if (!data.value) return;
  minggu.value = addDays(data.value.minggu.mulai, days);
  loadData();
}

function pilihMinggu(mulai) {
  minggu.value = mulai;
  loadData();
}

function keMingguIni() {
  minggu.value = '';
  loadData();
}

onMounted(loadData);
</script>
