<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('program.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">{{ $t('program.subheading') }}</p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-plus"
        class="text-none"
        @click="openCreate"
      >
        {{ $t('program.addBtn') }}
      </v-btn>
    </div>

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
              <th class="px-5 py-3 w-20">{{ $t('program.urutan') }}</th>
              <th class="px-4 py-3">{{ $t('program.namaId') }}</th>
              <th class="px-4 py-3">{{ $t('program.namaJa') }}</th>
              <th class="px-4 py-3">{{ $t('staff.status') }}</th>
              <th class="px-5 py-3 text-right">{{ $t('app.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in items" :key="p.id">
              <td class="px-5 py-2.5 tabular-nums font-mono text-slate-500">{{ p.urutan }}</td>
              <td class="px-4 py-2.5 font-semibold text-slate-900">{{ p.namaId }}</td>
              <td class="px-4 py-2.5 text-slate-700">{{ p.namaJa }}</td>
              <td class="px-4 py-2.5 text-xs font-semibold" :class="p.aktif ? 'text-emerald-700' : 'text-slate-400'">
                {{ p.aktif ? $t('app.active') : $t('app.inactive') }}
              </td>
              <td class="px-5 py-2.5 text-right whitespace-nowrap">
                <v-btn
                  icon="mdi-pencil-outline"
                  size="x-small"
                  variant="text"
                  :aria-label="`${$t('app.edit')} ${p.namaId}`"
                  @click="openEdit(p)"
                />
                <v-btn
                  icon="mdi-trash-can-outline"
                  size="x-small"
                  variant="text"
                  color="error"
                  :aria-label="`${$t('app.delete')} ${p.namaId}`"
                  @click="askDelete(p)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Dialog -->
    <v-dialog v-model="dialogOpen" max-width="500">
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 font-semibold text-slate-900 font-display">
          {{ editingId ? $t('app.edit') : $t('program.addBtn') }}
        </div>
        <v-card-text class="pa-6 space-y-4">
          <v-text-field
            v-model="form.namaId"
            :label="$t('program.namaId')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
          <v-text-field
            v-model="form.namaJa"
            :label="$t('program.namaJa')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
          <v-text-field
            v-model.number="form.urutan"
            type="number"
            min="1"
            :label="$t('program.urutan')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
          <v-switch
            v-model="form.aktif"
            color="primary"
            :label="form.aktif ? $t('app.active') : $t('app.inactive')"
            hide-details
          />
        </v-card-text>
        <div class="px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
          <v-btn variant="text" class="text-none" @click="dialogOpen = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" class="text-none" :loading="saving" @click="submitForm">
            {{ $t('app.save') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="pa-5 rounded-xl">
        <div class="text-base font-semibold text-slate-900 mb-2">{{ deleteTarget?.namaId }}</div>
        <p class="text-sm text-slate-600 mb-5">{{ $t('app.delete') }}?</p>
        <div class="flex justify-end gap-2">
          <v-btn variant="text" class="text-none" @click="deleteDialog = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="error" variant="flat" class="text-none" :loading="saving" @click="confirmDelete">
            {{ $t('app.delete') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';

const { t } = useI18n();
const appStore = useAppStore();

const loading = ref(true);
const saving = ref(false);
const items = ref([]);

const dialogOpen = ref(false);
const editingId = ref(null);
const form = ref({
  namaId: '',
  namaJa: '',
  urutan: 1,
  aktif: true,
});

const deleteDialog = ref(false);
const deleteTarget = ref(null);

async function loadData() {
  loading.value = true;
  try {
    const res = await apiRequest('/program');
    items.value = res.items || [];
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.value = {
    namaId: '',
    namaJa: '',
    urutan: items.value.length + 1,
    aktif: true,
  };
  dialogOpen.value = true;
}

function openEdit(p) {
  editingId.value = p.id;
  form.value = {
    namaId: p.namaId,
    namaJa: p.namaJa,
    urutan: p.urutan,
    aktif: p.aktif,
  };
  dialogOpen.value = true;
}

async function submitForm() {
  saving.value = true;
  try {
    if (editingId.value) {
      await apiRequest(`/program/${editingId.value}`, { method: 'PATCH', body: form.value });
    } else {
      await apiRequest('/program', { method: 'POST', body: form.value });
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

function askDelete(p) {
  deleteTarget.value = p;
  deleteDialog.value = true;
}

async function confirmDelete() {
  if (!deleteTarget.value) return;
  saving.value = true;
  try {
    await apiRequest(`/program/${deleteTarget.value.id}`, { method: 'DELETE' });
    deleteDialog.value = false;
    appStore.notify(t('messages.deleted'), 'success');
    await loadData();
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    saving.value = false;
  }
}

onMounted(loadData);
</script>
