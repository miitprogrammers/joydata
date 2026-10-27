<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('akses.heading') }}</h1>
        <p class="text-sm text-slate-600 mt-1">{{ $t('akses.subheading') }}</p>
      </div>
      <v-btn
        color="primary"
        variant="tonal"
        size="small"
        prepend-icon="mdi-plus"
        class="text-none"
        @click="openRoleDialog()"
      >
        {{ $t('akses.addRoleBtn') }}
      </v-btn>
    </div>

    <div v-if="loading" class="joy-surface p-6">
      <v-skeleton-loader type="article, table-row-divider@5" />
    </div>

    <template v-else>
      <!-- Role Selector Bar (Interactive Segmented Buttons) -->
      <div class="joy-surface p-4 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-medium text-slate-500 mr-1">{{ $t('akses.selectRole') }}</span>
          <div class="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              v-for="r in roles"
              :key="r.id"
              type="button"
              class="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
              :class="selectedRoleId === r.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
              @click="selectRole(r.id)"
            >
              {{ locale === 'ja' ? r.roleNameJa : r.roleNameId }}
              <span class="text-slate-400 font-normal ml-1 tabular-nums">({{ (matrix[r.id] || []).length }})</span>
            </button>
          </div>
        </div>

        <div v-if="selectedRole" class="flex items-center gap-2">
          <v-btn
            size="x-small"
            variant="text"
            icon="mdi-pencil-outline"
            :aria-label="`${$t('app.edit')} ${selectedRole.roleNameId}`"
            @click="openRoleDialog(selectedRole)"
          />
          <v-btn
            v-if="!selectedRole.isSystem"
            size="x-small"
            variant="text"
            color="error"
            icon="mdi-trash-can-outline"
            :aria-label="`${$t('app.delete')} ${selectedRole.roleNameId}`"
            @click="askDeleteRole(selectedRole)"
          />
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            prepend-icon="mdi-content-save-outline"
            class="text-none font-semibold"
            :loading="savingMatrix"
            @click="saveMatrix"
          >
            {{ $t('akses.saveMatrixBtn') }}
          </v-btn>
        </div>
      </div>

      <p v-if="selectedRole?.kode === 'admin'" class="text-xs text-slate-500 px-1">
        {{ $t('akses.adminProtectedHint') }}
      </p>

      <!-- 2-Column Permission Matrix: Main Bar (10) & Config Bar (7) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Main Pages -->
        <div class="joy-surface overflow-hidden">
          <div class="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900 font-display">
              {{ $t('akses.mainPagesGroup') }}
            </h2>
            <div class="flex items-center gap-3 text-xs">
              <button
                type="button"
                class="font-medium text-blue-700 hover:underline"
                @click="toggleGroup('main', true)"
              >
                {{ $t('app.all') }}
              </button>
            </div>
          </div>
          <div class="divide-y divide-slate-100">
            <label
              v-for="p in mainPages"
              :key="p.kode"
              class="px-5 py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
            >
              <div class="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                  :checked="draftKodes.includes(p.kode)"
                  :disabled="isLockedForAdmin(p.kode)"
                  @change="toggleKode(p.kode, $event.target.checked)"
                />
                <div class="min-w-0">
                  <div class="text-sm font-medium text-slate-900 truncate">
                    {{ locale === 'ja' ? p.titleJa : p.titleId }}
                  </div>
                  <div class="text-xs text-slate-500 truncate">
                    <span class="font-mono">{{ p.routePath }}</span>
                    <span class="mx-1.5" aria-hidden="true">·</span>
                    <span :class="Number(p.fase) <= 2 ? 'text-emerald-700 font-medium' : 'text-slate-500'">
                      {{ Number(p.fase) <= 2 ? $t('akses.phaseBadge1') : $t('akses.phaseBadgeNext', { fase: p.fase }) }}
                    </span>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Config Pages -->
        <div class="joy-surface overflow-hidden">
          <div class="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <h2 class="text-sm font-semibold text-slate-900 font-display">
              {{ $t('akses.configPagesGroup') }}
            </h2>
            <div class="flex items-center gap-3 text-xs">
              <button
                type="button"
                class="font-medium text-blue-700 hover:underline"
                @click="toggleGroup('config', true)"
              >
                {{ $t('app.all') }}
              </button>
            </div>
          </div>
          <div class="divide-y divide-slate-100">
            <label
              v-for="p in configPages"
              :key="p.kode"
              class="px-5 py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
            >
              <div class="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                  :checked="draftKodes.includes(p.kode)"
                  :disabled="isLockedForAdmin(p.kode)"
                  @change="toggleKode(p.kode, $event.target.checked)"
                />
                <div class="min-w-0">
                  <div class="text-sm font-medium text-slate-900 truncate">
                    {{ locale === 'ja' ? p.titleJa : p.titleId }}
                  </div>
                  <div class="text-xs text-slate-500 truncate">
                    <span class="font-mono">{{ p.routePath }}</span>
                    <span class="mx-1.5" aria-hidden="true">·</span>
                    <span :class="Number(p.fase) <= 2 ? 'text-emerald-700 font-medium' : 'text-slate-500'">
                      {{ Number(p.fase) <= 2 ? $t('akses.phaseBadge1') : $t('akses.phaseBadgeNext', { fase: p.fase }) }}
                    </span>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </template>

    <!-- Create / Edit Custom Role Dialog -->
    <v-dialog v-model="roleDialog" max-width="480">
      <v-card class="rounded-xl">
        <div class="px-6 py-4 border-b border-slate-200 font-semibold text-slate-900 font-display">
          {{ editingRole ? $t('app.edit') : $t('akses.addRoleBtn') }}
        </div>
        <v-card-text class="pa-6 space-y-4">
          <v-text-field
            v-model="roleForm.kode"
            :label="$t('akses.kodeRole')"
            :disabled="Boolean(editingRole)"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
          <v-text-field
            v-model="roleForm.roleNameId"
            :label="$t('akses.namaRoleId')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
          <v-text-field
            v-model="roleForm.roleNameJa"
            :label="$t('akses.namaRoleJa')"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-card-text>
        <div class="px-6 py-3 border-t border-slate-200 flex justify-end gap-2">
          <v-btn variant="text" class="text-none" @click="roleDialog = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="primary" variant="flat" class="text-none" :loading="savingRole" @click="submitRole">
            {{ $t('app.save') }}
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete Role Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="pa-5 rounded-xl">
        <div class="text-base font-semibold text-slate-900 mb-2">
          {{ deleteTarget?.roleNameId }}
        </div>
        <p class="text-sm text-slate-600 mb-5">{{ $t('app.delete') }}?</p>
        <div class="flex justify-end gap-2">
          <v-btn variant="text" class="text-none" @click="deleteDialog = false">{{ $t('app.cancel') }}</v-btn>
          <v-btn color="error" variant="flat" class="text-none" :loading="savingRole" @click="confirmDeleteRole">
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
const savingMatrix = ref(false);
const savingRole = ref(false);

const roles = ref([]);
const pages = ref([]);
const matrix = ref({});
const selectedRoleId = ref(null);
const draftKodes = ref([]);

const roleDialog = ref(false);
const editingRole = ref(null);
const roleForm = ref({ kode: '', roleNameId: '', roleNameJa: '' });

const deleteDialog = ref(false);
const deleteTarget = ref(null);

const selectedRole = computed(() => roles.value.find((r) => r.id === selectedRoleId.value) || null);
const mainPages = computed(() => pages.value.filter((p) => p.bar === 'main'));
const configPages = computed(() => pages.value.filter((p) => p.bar === 'config'));

function isLockedForAdmin(kode) {
  return selectedRole.value?.kode === 'admin' && (kode === 'role-akses' || kode === 'crud-staff');
}

function selectRole(roleId) {
  selectedRoleId.value = roleId;
  draftKodes.value = [...(matrix.value[roleId] || [])];
}

function toggleKode(kode, checked) {
  if (isLockedForAdmin(kode)) return;
  const next = new Set(draftKodes.value);
  if (checked) next.add(kode);
  else next.delete(kode);
  draftKodes.value = Array.from(next);
}

function toggleGroup(bar, selectAll) {
  const groupKodes = pages.value.filter((p) => p.bar === bar).map((p) => p.kode);
  const next = new Set(draftKodes.value);
  for (const k of groupKodes) {
    if (isLockedForAdmin(k)) {
      next.add(k);
    } else if (selectAll) {
      next.add(k);
    } else {
      next.delete(k);
    }
  }
  draftKodes.value = Array.from(next);
}

async function loadData(keepSelected = true) {
  loading.value = true;
  try {
    const res = await apiRequest('/akses');
    roles.value = res.roles || [];
    pages.value = res.pages || [];
    matrix.value = res.matrix || {};
    const targetId =
      keepSelected && selectedRoleId.value && roles.value.some((r) => r.id === selectedRoleId.value)
        ? selectedRoleId.value
        : roles.value[0]?.id || null;
    if (targetId) selectRole(targetId);
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    loading.value = false;
  }
}

async function saveMatrix() {
  if (!selectedRoleId.value) return;
  savingMatrix.value = true;
  try {
    const res = await apiRequest(`/akses/matrix/${selectedRoleId.value}`, {
      method: 'PUT',
      body: { pageKodes: draftKodes.value },
    });
    matrix.value[selectedRoleId.value] = res.pageKodes || [];
    draftKodes.value = [...(res.pageKodes || [])];
    if (appStore.user?.role?.id === selectedRoleId.value) {
      await appStore.refreshSessionProfile();
    }
    appStore.notify(t('messages.saved'), 'success');
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    savingMatrix.value = false;
  }
}

function openRoleDialog(role = null) {
  editingRole.value = role;
  roleForm.value = role
    ? { kode: role.kode, roleNameId: role.roleNameId, roleNameJa: role.roleNameJa }
    : { kode: '', roleNameId: '', roleNameJa: '' };
  roleDialog.value = true;
}

async function submitRole() {
  savingRole.value = true;
  try {
    if (editingRole.value) {
      await apiRequest(`/akses/roles/${editingRole.value.id}`, {
        method: 'PATCH',
        body: roleForm.value,
      });
    } else {
      const created = await apiRequest('/akses/roles', {
        method: 'POST',
        body: roleForm.value,
      });
      selectedRoleId.value = created.id;
    }
    roleDialog.value = false;
    appStore.notify(t('messages.saved'), 'success');
    await loadData(true);
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    savingRole.value = false;
  }
}

function askDeleteRole(role) {
  deleteTarget.value = role;
  deleteDialog.value = true;
}

async function confirmDeleteRole() {
  if (!deleteTarget.value) return;
  savingRole.value = true;
  try {
    await apiRequest(`/akses/roles/${deleteTarget.value.id}`, { method: 'DELETE' });
    deleteDialog.value = false;
    appStore.notify(t('messages.deleted'), 'success');
    await loadData(false);
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    savingRole.value = false;
  }
}

onMounted(() => loadData(false));
</script>
