<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('staff.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">{{ $t('staff.subheading') }}</p>
      </div>
      <v-btn
        color="primary"
        variant="flat"
        size="small"
        prepend-icon="mdi-plus"
        class="text-none"
        @click="openCreate"
      >
        {{ $t('staff.addBtn') }}
      </v-btn>
    </div>

    <div class="joy-surface overflow-hidden">
      <div v-if="loading" class="p-6">
        <v-skeleton-loader type="table-row-divider@4" />
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse joy-table">
          <thead>
            <tr>
              <th class="px-5 py-3">{{ $t('staff.nama') }}</th>
              <th class="px-4 py-3">{{ $t('staff.username') }}</th>
              <th class="px-4 py-3">{{ $t('staff.role') }}</th>
              <th class="px-4 py-3">{{ $t('staff.status') }}</th>
              <th class="px-5 py-3 text-right">{{ $t('app.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in items" :key="s.id">
              <td class="px-5 py-2.5 font-semibold text-slate-900">{{ s.nama }}</td>
              <td class="px-4 py-2.5 tabular-nums text-slate-700">{{ s.username }}</td>
              <td class="px-4 py-2.5 text-slate-700">
                {{ locale === 'ja' ? s.roleNameJa : s.roleNameId }}
              </td>
              <td class="px-4 py-2.5 text-xs font-semibold" :class="s.active ? 'text-emerald-700' : 'text-slate-400'">
                {{ s.active ? $t('app.active') : $t('app.inactive') }}
              </td>
              <td class="px-5 py-2.5 text-right whitespace-nowrap">
                <v-btn
                  size="x-small"
                  variant="tonal"
                  color="primary"
                  class="text-none mr-1"
                  @click="openResetPassword(s)"
                >
                  {{ $t('staff.resetPassBtn') }}
                </v-btn>
                <v-btn
                  icon="mdi-pencil-outline"
                  size="x-small"
                  variant="text"
                  :aria-label="`${$t('app.edit')} ${s.nama}`"
                  @click="openEdit(s)"
                />
                <v-btn
                  v-if="s.id !== appStore.user?.id"
                  icon="mdi-trash-can-outline"
                  size="x-small"
                  variant="text"
                  color="error"
                  :aria-label="`${$t('app.delete')} ${s.nama}`"
                  @click="askDelete(s)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Staff Dialog -->
    <v-dialog v-model="dialogOpen" max-width="520">
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 font-semibold text-slate-900 font-display">
          {{ editingId ? $t('app.edit') : $t('staff.addBtn') }}
        </div>
        <v-card-text class="pa-6 space-y-4">
          <v-text-field
            v-model="form.nama"
            :label="$t('staff.nama')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
          <v-text-field
            v-model="form.username"
            :label="$t('staff.username')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
          <v-text-field
            v-if="!editingId"
            v-model="form.password"
            type="password"
            :label="$t('staff.password')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
          <v-select
            v-model="form.roleId"
            :items="roleChoices"
            item-title="label"
            item-value="id"
            :label="$t('staff.role')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
          <v-switch
            v-model="form.active"
            :label="form.active ? $t('app.active') : $t('app.inactive')"
            color="primary"
            inset
            hide-details
            :disabled="editingId === appStore.user?.id"
          />
        </v-card-text>
        <div class="px-6 py-3.5 border-t border-slate-200 flex justify-end gap-2 bg-slate-50/50">
          <v-btn variant="text" class="text-none" @click="dialogOpen = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" class="text-none" :loading="saving" @click="submitStaff">
            {{ $t('app.save') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Reset Password Dialog -->
    <v-dialog v-model="resetDialog" max-width="440">
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 font-semibold text-slate-900 font-display">
          {{ $t('staff.resetPassTitle') }} · {{ resetTarget?.username }}
        </div>
        <v-card-text class="pa-6">
          <v-text-field
            v-model="newPassword"
            type="password"
            :label="$t('staff.newPassword')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-card-text>
        <div class="px-6 py-3.5 border-t border-slate-200 flex justify-end gap-2 bg-slate-50/50">
          <v-btn variant="text" class="text-none" @click="resetDialog = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" class="text-none" :loading="saving" @click="submitReset">
            {{ $t('app.save') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="pa-5 rounded-xl">
        <div class="text-base font-semibold text-slate-900 mb-2">{{ deleteTarget?.nama }}</div>
        <p class="text-sm text-slate-600 mb-5">{{ $t('staff.confirmDelete') }}</p>
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

const { t, locale } = useI18n();
const appStore = useAppStore();

const loading = ref(true);
const saving = ref(false);
const items = ref([]);
const roles = ref([]);

const dialogOpen = ref(false);
const editingId = ref(null);
const form = ref({
  nama: '',
  username: '',
  password: '',
  roleId: null,
  active: true,
});

const resetDialog = ref(false);
const resetTarget = ref(null);
const newPassword = ref('');

const deleteDialog = ref(false);
const deleteTarget = ref(null);

const roleChoices = computed(() =>
  roles.value.map((r) => ({
    id: r.id,
    label: locale.value === 'ja' ? `${r.roleNameJa} (${r.kode})` : `${r.roleNameId} (${r.kode})`,
  }))
);

async function loadData() {
  loading.value = true;
  try {
    const res = await apiRequest('/staff');
    items.value = res.items || [];
    roles.value = res.roles || [];
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.value = {
    nama: '',
    username: '',
    password: '',
    roleId: roles.value.find((r) => r.kode === 'sensei')?.id || roles.value[0]?.id || null,
    active: true,
  };
  dialogOpen.value = true;
}

function openEdit(s) {
  editingId.value = s.id;
  form.value = {
    nama: s.nama,
    username: s.username,
    password: '',
    roleId: s.roleId,
    active: s.active,
  };
  dialogOpen.value = true;
}

async function submitStaff() {
  saving.value = true;
  try {
    if (editingId.value) {
      await apiRequest(`/staff/${editingId.value}`, { method: 'PATCH', body: form.value });
    } else {
      await apiRequest('/staff', { method: 'POST', body: form.value });
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

function openResetPassword(s) {
  resetTarget.value = s;
  newPassword.value = '';
  resetDialog.value = true;
}

async function submitReset() {
  if (!resetTarget.value) return;
  saving.value = true;
  try {
    await apiRequest(`/staff/${resetTarget.value.id}/reset-password`, {
      method: 'PATCH',
      body: { newPassword: newPassword.value },
    });
    resetDialog.value = false;
    appStore.notify(t('messages.passwordUpdated'), 'success');
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    saving.value = false;
  }
}

function askDelete(s) {
  deleteTarget.value = s;
  deleteDialog.value = true;
}

async function confirmDelete() {
  if (!deleteTarget.value) return;
  saving.value = true;
  try {
    await apiRequest(`/staff/${deleteTarget.value.id}`, { method: 'DELETE' });
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
