<template>
  <div class="space-y-5">
    <!-- Header -->
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('auditLog.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">{{ $t('auditLog.subheading') }}</p>
      </div>
      <v-btn
        variant="outlined"
        color="primary"
        size="small"
        prepend-icon="mdi-refresh"
        class="text-none whitespace-nowrap shrink-0"
        :loading="loading"
        @click="loadData"
      >
        {{ $t('app.refresh') }}
      </v-btn>
    </div>

    <!-- Filter Bar -->
    <div class="joy-surface p-4">
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div class="sm:col-span-3">
          <v-text-field
            v-model="filterPeriode"
            type="month"
            :label="$t('auditLog.filterPeriode')"
            variant="outlined"
            density="compact"
            clearable
            hide-details
            @update:model-value="loadData"
          />
        </div>
        <div class="sm:col-span-3">
          <v-select
            v-model="filterEntitas"
            :items="entitasSelectItems"
            item-title="label"
            item-value="value"
            :label="$t('auditLog.filterEntitas')"
            variant="outlined"
            density="compact"
            hide-details
          />
        </div>
        <div class="sm:col-span-6">
          <v-text-field
            v-model="searchQuery"
            :placeholder="$t('auditLog.searchPlaceholder')"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
            hide-details
          />
        </div>
      </div>
    </div>

    <!-- Audit Table -->
    <div class="joy-surface overflow-hidden">
      <div v-if="loading" class="p-6">
        <v-skeleton-loader type="table-row-divider@7" />
      </div>
      <div v-else-if="!displayedItems.length" class="p-8 text-center text-sm text-slate-500">
        {{ $t('app.noData') }}
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse joy-table">
          <thead>
            <tr>
              <th class="px-5 py-3 whitespace-nowrap">{{ $t('auditLog.colWaktu') }}</th>
              <th class="px-4 py-3 whitespace-nowrap">{{ $t('auditLog.colStaff') }}</th>
              <th class="px-4 py-3 whitespace-nowrap">{{ $t('auditLog.colAksi') }}</th>
              <th class="px-4 py-3 whitespace-nowrap">{{ $t('auditLog.colEntitas') }}</th>
              <th class="px-4 py-3">{{ $t('auditLog.colDetail') }}</th>
              <th class="px-5 py-3 text-right whitespace-nowrap">{{ $t('app.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in displayedItems" :key="row.id">
              <td class="px-5 py-2.5 tabular-nums font-mono text-xs text-slate-600 whitespace-nowrap">
                {{ formatTimestamp(row.createdAt) }}
              </td>
              <td class="px-4 py-2.5 text-sm font-semibold text-slate-900 whitespace-nowrap">
                {{ row.staffNama || 'System' }}
              </td>
              <td class="px-4 py-2.5 font-mono text-xs font-semibold whitespace-nowrap" :class="actionColorClass(row.aksi)">
                {{ row.aksi }}
              </td>
              <td class="px-4 py-2.5 text-xs text-slate-700 whitespace-nowrap font-mono tabular-nums">
                <span>{{ row.entitas }}</span>
                <span v-if="row.entitasId !== null && row.entitasId !== undefined && row.entitasId !== ''" class="text-slate-400">
                  · #{{ row.entitasId }}
                </span>
              </td>
              <td class="px-4 py-2.5 text-xs text-slate-600 font-mono max-w-md truncate">
                {{ summarizeDetail(row.detail) }}
              </td>
              <td class="px-5 py-2.5 text-right whitespace-nowrap">
                <v-btn
                  size="x-small"
                  variant="text"
                  color="primary"
                  class="text-none"
                  :aria-label="`${$t('auditLog.viewDetailBtn')} #${row.id}`"
                  @click="openDetail(row)"
                >
                  {{ $t('auditLog.viewDetailBtn') }}
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- JSON Detail Modal -->
    <v-dialog v-model="detailOpen" max-width="640">
      <v-card v-if="selectedRow" class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <div>
            <div class="font-semibold text-slate-900 font-display">{{ $t('auditLog.detailModalTitle') }}</div>
            <div class="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
              {{ selectedRow.aksi }} · {{ selectedRow.entitas }} #{{ selectedRow.entitasId }} · {{ formatTimestamp(selectedRow.createdAt) }}
            </div>
          </div>
        </div>
        <v-card-text class="pa-6 space-y-4">
          <div class="text-xs text-slate-600">
            <span class="font-semibold text-slate-800">{{ $t('auditLog.colStaff') }}:</span>
            {{ selectedRow.staffNama || 'System' }}
          </div>
          <pre
            class="p-4 rounded-lg bg-slate-950 text-slate-100 text-xs font-mono overflow-x-auto max-h-96 leading-relaxed"
          >{{ prettyJson(selectedRow.detail) }}</pre>
        </v-card-text>
        <div class="px-6 py-3 border-t border-slate-200 flex justify-end">
          <v-btn variant="text" class="text-none" @click="detailOpen = false">{{ $t('app.close') }}</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';

const { t } = useI18n();
const appStore = useAppStore();

const loading = ref(true);
const filterPeriode = ref('');
const filterEntitas = ref('all');
const searchQuery = ref('');

const items = ref([]);
const entitasOptions = ref([]);

const detailOpen = ref(false);
const selectedRow = ref(null);

const entitasSelectItems = computed(() => [
  { value: 'all', label: t('app.all') },
  ...entitasOptions.value.map((e) => ({ value: e, label: e })),
]);

const displayedItems = computed(() => {
  const q = String(searchQuery.value || '').trim().toLowerCase();
  return items.value.filter((r) => {
    if (filterEntitas.value !== 'all' && r.entitas !== filterEntitas.value) return false;
    if (
      q &&
      !String(r.staffNama || '').toLowerCase().includes(q) &&
      !String(r.aksi || '').toLowerCase().includes(q) &&
      !String(r.entitas || '').toLowerCase().includes(q) &&
      !String(r.entitasId || '').toLowerCase().includes(q) &&
      !summarizeDetail(r.detail).toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });
});

function actionColorClass(aksi) {
  const upper = String(aksi || '').toUpperCase();
  if (upper.startsWith('DELETE')) return 'text-red-700';
  if (upper.startsWith('CREATE') || upper.startsWith('UPSERT') || upper.startsWith('SUBMIT')) {
    return 'text-emerald-700';
  }
  return 'text-sky-700';
}

function formatTimestamp(iso) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString(appStore.locale === 'ja' ? 'ja-JP' : 'id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return String(iso);
  }
}

function parseDetailObj(detail) {
  if (!detail) return {};
  if (typeof detail === 'string') {
    try {
      return JSON.parse(detail);
    } catch {
      return { raw: detail };
    }
  }
  return detail;
}

function summarizeDetail(detail) {
  const obj = parseDetailObj(detail);
  const compact = JSON.stringify(obj);
  return compact && compact !== '{}' ? compact : '-';
}

function prettyJson(detail) {
  return JSON.stringify(parseDetailObj(detail), null, 2);
}

function openDetail(row) {
  selectedRow.value = row;
  detailOpen.value = true;
}

async function loadData() {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (filterPeriode.value) params.set('periode', filterPeriode.value);
    const res = await apiRequest(`/audit-log?${params.toString()}`);
    items.value = res.items || [];
    entitasOptions.value = res.entitasOptions || [];
  } catch (err) {
    const key = `messages.${err.code}`;
    appStore.notify(t(key) !== key ? t(key) : t('messages.GENERIC_ERROR'), 'error');
  } finally {
    loading.value = false;
  }
}

onMounted(loadData);
</script>
