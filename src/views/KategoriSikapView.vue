<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('sikapKategori.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">{{ $t('sikapKategori.subheading') }}</p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-plus"
        class="text-none"
        @click="openCreate"
      >
        {{ $t('sikapKategori.addBtn') }}
      </v-btn>
    </div>

    <div class="flex items-center gap-2">
      <div class="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
          :class="filterSentiment === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          @click="filterSentiment = 'all'"
        >
          {{ $t('app.all') }} ({{ items.length }})
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
          :class="filterSentiment === 'positif' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          @click="filterSentiment = 'positif'"
        >
          {{ $t('sikapKategori.positif') }}
        </button>
        <button
          type="button"
          class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
          :class="filterSentiment === 'negatif' ? 'bg-white text-red-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
          @click="filterSentiment = 'negatif'"
        >
          {{ $t('sikapKategori.negatif') }}
        </button>
      </div>
    </div>

    <div class="joy-surface overflow-hidden">
      <div v-if="loading" class="p-6">
        <v-skeleton-loader type="table-row-divider@5" />
      </div>
      <div v-else-if="!filteredItems.length" class="p-8 text-center text-sm text-slate-500">
        {{ $t('app.noData') }}
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse joy-table">
          <thead>
            <tr>
              <th class="px-5 py-3 w-16">{{ $t('sikapKategori.urutan') }}</th>
              <th class="px-4 py-3">{{ $t('sikapKategori.namaId') }}</th>
              <th class="px-4 py-3">{{ $t('sikapKategori.namaJa') }}</th>
              <th class="px-4 py-3">{{ $t('sikapKategori.sentiment') }}</th>
              <th class="px-4 py-3 text-right">{{ $t('sikapKategori.bobot') }}</th>
              <th class="px-4 py-3">{{ $t('staff.status') }}</th>
              <th class="px-5 py-3 text-right">{{ $t('app.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="k in filteredItems" :key="k.id">
              <td class="px-5 py-2.5 tabular-nums font-mono text-slate-500">{{ k.urutan }}</td>
              <td class="px-4 py-2.5 font-semibold text-slate-900">{{ k.namaId }}</td>
              <td class="px-4 py-2.5 text-slate-700">{{ k.namaJa }}</td>
              <td
                class="px-4 py-2.5 text-xs font-semibold"
                :class="k.sentimentDefault === 'positif' ? 'text-emerald-700' : 'text-red-700'"
              >
                {{ k.sentimentDefault === 'positif' ? $t('sikapKategori.positif') : $t('sikapKategori.negatif') }}
              </td>
              <td
                class="px-4 py-2.5 text-right tabular-nums font-mono font-semibold"
                :class="k.sentimentDefault === 'positif' ? 'text-emerald-700' : 'text-red-700'"
              >
                {{ k.sentimentDefault === 'positif' ? `+${k.bobotDefault}` : `−${k.bobotDefault}` }}
              </td>
              <td class="px-4 py-2.5 text-xs font-semibold" :class="k.aktif ? 'text-emerald-700' : 'text-slate-400'">
                {{ k.aktif ? $t('app.active') : $t('app.inactive') }}
              </td>
              <td class="px-5 py-2.5 text-right whitespace-nowrap">
                <v-btn
                  icon="mdi-pencil-outline"
                  size="x-small"
                  variant="text"
                  :aria-label="`${$t('app.edit')} ${k.namaId}`"
                  @click="openEdit(k)"
                />
                <v-btn
                  icon="mdi-trash-can-outline"
                  size="x-small"
                  variant="text"
                  color="error"
                  :aria-label="`${$t('app.delete')} ${k.namaId}`"
                  @click="askDelete(k)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <v-dialog v-model="dialogOpen" max-width="520">
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 font-semibold text-slate-900 font-display">
          {{ editingId ? $t('app.edit') : $t('sikapKategori.addBtn') }}
        </div>
        <v-card-text class="pa-6 space-y-4">
          <v-text-field
            v-model="form.namaId"
            :label="$t('sikapKategori.namaId')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
          <v-text-field
            v-model="form.namaJa"
            :label="$t('sikapKategori.namaJa')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <v-select
              v-model="form.sentimentDefault"
              :items="sentimentOptions"
              item-title="label"
              item-value="value"
              :label="$t('sikapKategori.sentiment')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
            <v-text-field
              v-model.number="form.bobotDefault"
              type="number"
              min="1"
              max="100"
              :label="$t('sikapKategori.bobot')"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
            />
          </div>
          <v-text-field
            v-model.number="form.urutan"
            type="number"
            min="1"
            :label="$t('sikapKategori.urutan')"
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
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';

const { t } = useI18n();
const appStore = useAppStore();

const loading = ref(true);
const saving = ref(false);
const items = ref([]);
const filterSentiment = ref('all');

const dialogOpen = ref(false);
const editingId = ref(null);
const form = ref({
  namaId: '',
  namaJa: '',
  sentimentDefault: 'positif',
  bobotDefault: 5,
  urutan: 1,
  aktif: true,
});

const deleteDialog = ref(false);
const deleteTarget = ref(null);

const sentimentOptions = computed(() => [
  { value: 'positif', label: t('sikapKategori.positif') },
  { value: 'negatif', label: t('sikapKategori.negatif') },
]);

const filteredItems = computed(() => {
  if (filterSentiment.value === 'all') return items.value;
  return items.value.filter((k) => k.sentimentDefault === filterSentiment.value);
});

async function loadData() {
  loading.value = true;
  try {
    const res = await apiRequest('/kategori-sikap');
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
    sentimentDefault: filterSentiment.value === 'negatif' ? 'negatif' : 'positif',
    bobotDefault: 5,
    urutan: items.value.length + 1,
    aktif: true,
  };
  dialogOpen.value = true;
}

function openEdit(k) {
  editingId.value = k.id;
  form.value = {
    namaId: k.namaId,
    namaJa: k.namaJa,
    sentimentDefault: k.sentimentDefault,
    bobotDefault: k.bobotDefault,
    urutan: k.urutan,
    aktif: k.aktif,
  };
  dialogOpen.value = true;
}

async function submitForm() {
  saving.value = true;
  try {
    const body = {
      ...form.value,
      bobotDefault: Math.abs(Number(form.value.bobotDefault) || 5),
    };
    if (editingId.value) {
      await apiRequest(`/kategori-sikap/${editingId.value}`, { method: 'PATCH', body });
    } else {
      await apiRequest('/kategori-sikap', { method: 'POST', body });
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

function askDelete(k) {
  deleteTarget.value = k;
  deleteDialog.value = true;
}

async function confirmDelete() {
  if (!deleteTarget.value) return;
  saving.value = true;
  try {
    await apiRequest(`/kategori-sikap/${deleteTarget.value.id}`, { method: 'DELETE' });
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
