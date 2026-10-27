<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('kelas.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">{{ $t('kelas.subheading') }}</p>
      </div>
      <div class="flex items-center gap-2">
        <v-btn
          variant="outlined"
          color="primary"
          size="small"
          prepend-icon="mdi-sync"
          class="text-none"
          :loading="syncing"
          @click="triggerSync"
        >
          {{ $t('app.syncMancation') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          size="small"
          prepend-icon="mdi-plus"
          class="text-none"
          @click="openCreate"
        >
          {{ $t('kelas.addBtn') }}
        </v-btn>
      </div>
    </div>

    <MancationSyncBanner :sync-meta="syncMeta" :syncing="syncing" @sync="triggerSync" />

    <div class="joy-surface overflow-hidden">
      <div v-if="loading" class="p-6">
        <v-skeleton-loader type="table-row-divider@4" />
      </div>
      <div v-else-if="!items.length" class="p-8 text-center text-sm text-slate-500">
        {{ $t('app.noData') }}
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse joy-table">
          <thead>
            <tr>
              <th class="px-5 py-3">{{ $t('kelas.namaKelas') }}</th>
              <th class="px-4 py-3">{{ $t('kelas.mancationId') }}</th>
              <th class="px-4 py-3">{{ $t('kelas.program') }}</th>
              <th class="px-4 py-3">{{ $t('kelas.tanggalStart') }}</th>
              <th class="px-4 py-3">{{ $t('kelas.sensei') }}</th>
              <th class="px-4 py-3 text-right">{{ $t('kelas.jumlahPeserta') }}</th>
              <th class="px-4 py-3">{{ $t('kelas.status') }}</th>
              <th class="px-5 py-3 text-right">{{ $t('app.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td class="px-5 py-2.5">
                <div class="font-semibold text-slate-900">{{ item.namaKelas }}</div>
                <div v-if="item.description" class="text-xs text-slate-500 truncate max-w-xs">
                  {{ item.description }}
                </div>
              </td>
              <td class="px-4 py-2.5 tabular-nums text-slate-700">
                {{ item.mancationClassId || '-' }}
              </td>
              <td class="px-4 py-2.5 text-slate-700">
                {{ locale === 'ja' ? item.programNamaJa || item.programNamaId : item.programNamaId || '-' }}
              </td>
              <td class="px-4 py-2.5 tabular-nums text-slate-700">
                {{ item.tanggalStart }}
              </td>
              <td class="px-4 py-2.5 text-slate-700">
                {{ item.senseiNama || '-' }}
              </td>
              <td class="px-4 py-2.5 text-right tabular-nums font-medium">
                {{ item.jumlahPeserta }}
              </td>
              <td class="px-4 py-2.5 text-xs font-medium" :class="item.status === 'aktif' ? 'text-emerald-700' : 'text-slate-500'">
                {{ item.status === 'aktif' ? $t('kelas.statusAktif') : $t('kelas.statusSelesai') }}
              </td>
              <td class="px-5 py-2.5 text-right whitespace-nowrap">
                <v-btn
                  icon="mdi-pencil-outline"
                  size="x-small"
                  variant="text"
                  :aria-label="`${$t('app.edit')} ${item.namaKelas}`"
                  @click="openEdit(item)"
                />
                <v-btn
                  icon="mdi-trash-can-outline"
                  size="x-small"
                  variant="text"
                  color="error"
                  :aria-label="`${$t('app.delete')} ${item.namaKelas}`"
                  @click="confirmDeleteItem(item)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <v-dialog v-model="dialogOpen" max-width="580">
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 font-semibold text-slate-900 font-display">
          {{ editingId ? $t('kelas.editTitle') : $t('kelas.addTitle') }}
        </div>
        <v-card-text class="pa-6 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <v-text-field
              v-model="form.namaKelas"
              :label="$t('kelas.namaKelas')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              required
            />
            <v-text-field
              v-model="form.tanggalStart"
              type="date"
              :label="$t('kelas.tanggalStart')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              required
            />
            <v-select
              v-model="form.programId"
              :items="programChoices"
              item-title="label"
              item-value="id"
              clearable
              :label="$t('kelas.program')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
            <v-select
              v-model="form.senseiId"
              :items="senseiOptions"
              item-title="nama"
              item-value="id"
              clearable
              :label="$t('kelas.sensei')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
            <v-text-field
              v-model="form.mancationClassId"
              type="number"
              :label="$t('kelas.mancationId')"
              placeholder="139 / 142 / 144"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
            <v-select
              v-model="form.status"
              :items="statusChoices"
              item-title="label"
              item-value="value"
              :label="$t('kelas.status')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>
          <v-textarea
            v-model="form.description"
            :label="$t('kelas.description')"
            rows="2"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-card-text>
        <div class="px-6 py-3.5 border-t border-slate-200 flex justify-end gap-2 bg-slate-50/50">
          <v-btn variant="text" class="text-none" @click="dialogOpen = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" class="text-none" :loading="saving" @click="submitForm">
            {{ $t('app.save') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="pa-5 rounded-xl">
        <div class="text-base font-semibold text-slate-900 mb-2">{{ deleteTarget?.namaKelas }}</div>
        <p class="text-sm text-slate-600 mb-5">{{ $t('kelas.confirmDelete') }}</p>
        <div class="flex justify-end gap-2">
          <v-btn variant="text" class="text-none" @click="deleteDialog = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="error" variant="flat" class="text-none" :loading="deleting" @click="executeDelete">
            {{ $t('app.delete') }}
          </v-btn>
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
import MancationSyncBanner from '../components/MancationSyncBanner.vue';

const { t, locale } = useI18n();
const appStore = useAppStore();

const loading = ref(true);
const syncing = ref(false);
const saving = ref(false);
const deleting = ref(false);

const items = ref([]);
const programs = ref([]);
const senseiOptions = ref([]);
const syncMeta = ref(null);

const dialogOpen = ref(false);
const editingId = ref(null);
const form = ref({
  namaKelas: '',
  programId: null,
  tanggalStart: new Date().toISOString().slice(0, 10),
  description: '',
  mancationClassId: null,
  senseiId: null,
  status: 'aktif',
});

const deleteDialog = ref(false);
const deleteTarget = ref(null);

const programChoices = computed(() =>
  programs.value.map((p) => ({
    id: p.id,
    label: locale.value === 'ja' ? p.namaJa : p.namaId,
  }))
);

const statusChoices = computed(() => [
  { value: 'aktif', label: t('kelas.statusAktif') },
  { value: 'selesai', label: t('kelas.statusSelesai') },
]);

async function loadData() {
  loading.value = true;
  try {
    const res = await apiRequest('/kelas');
    items.value = res.items || [];
    programs.value = res.programs || [];
    senseiOptions.value = res.senseiOptions || [];
    syncMeta.value = res.mancationSync || null;
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    loading.value = false;
  }
}

async function triggerSync() {
  syncing.value = true;
  try {
    const res = await apiRequest('/mancation/sync', { method: 'POST' });
    appStore.notify(t('messages.synced', { count: res.totalStudents }), 'success');
    await loadData();
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    syncing.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.value = {
    namaKelas: '',
    programId: programs.value[0]?.id || null,
    tanggalStart: new Date().toISOString().slice(0, 10),
    description: '',
    mancationClassId: null,
    senseiId: null,
    status: 'aktif',
  };
  dialogOpen.value = true;
}

function openEdit(item) {
  editingId.value = item.id;
  form.value = {
    namaKelas: item.namaKelas,
    programId: item.programId,
    tanggalStart: item.tanggalStart,
    description: item.description || '',
    mancationClassId: item.mancationClassId,
    senseiId: item.senseiId,
    status: item.status || 'aktif',
  };
  dialogOpen.value = true;
}

async function submitForm() {
  saving.value = true;
  try {
    if (editingId.value) {
      await apiRequest(`/kelas/${editingId.value}`, { method: 'PATCH', body: form.value });
    } else {
      await apiRequest('/kelas', { method: 'POST', body: form.value });
    }
    dialogOpen.value = false;
    appStore.notify(t('messages.saved'), 'success');
    await loadData();
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    saving.value = false;
  }
}

function confirmDeleteItem(item) {
  deleteTarget.value = item;
  deleteDialog.value = true;
}

async function executeDelete() {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    await apiRequest(`/kelas/${deleteTarget.value.id}`, { method: 'DELETE' });
    deleteDialog.value = false;
    appStore.notify(t('messages.deleted'), 'success');
    await loadData();
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    deleting.value = false;
  }
}

onMounted(loadData);
</script>
