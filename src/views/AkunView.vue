<template>
  <div class="space-y-6 max-w-5xl">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 font-display">{{ $t('akun.heading') }}</h1>
      <p class="text-sm text-slate-600 mt-1">{{ $t('akun.subheading') }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column: Staff Session & Password -->
      <div class="space-y-6">
        <!-- Staff Session Profile -->
        <div class="joy-surface p-6 space-y-4">
          <h2 class="text-base font-semibold text-slate-900 font-display flex items-center gap-2">
            <v-icon size="20" color="primary">mdi-badge-account-outline</v-icon>
            {{ $t('akun.profileTitle') }}
          </h2>
          <dl class="divide-y divide-slate-100 text-sm">
            <div class="py-2.5 flex items-center justify-between gap-4">
              <dt class="text-slate-500">{{ $t('staff.nama') }}</dt>
              <dd class="font-semibold text-slate-900">{{ appStore.user?.nama || '-' }}</dd>
            </div>
            <div class="py-2.5 flex items-center justify-between gap-4">
              <dt class="text-slate-500">{{ $t('staff.username') }}</dt>
              <dd class="font-mono text-slate-800">{{ appStore.user?.username || '-' }}</dd>
            </div>
            <div class="py-2.5 flex items-center justify-between gap-4">
              <dt class="text-slate-500">{{ $t('staff.role') }}</dt>
              <dd class="font-medium text-slate-800">
                {{ locale === 'ja' ? appStore.user?.role?.roleNameJa : appStore.user?.role?.roleNameId }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Self Password Change -->
        <div class="joy-surface p-6">
          <h2 class="text-base font-semibold text-slate-900 font-display mb-4 flex items-center gap-2">
            <v-icon size="20" color="primary">mdi-key-outline</v-icon>
            {{ $t('akun.changePassTitle') }}
          </h2>
          <form class="space-y-4" @submit.prevent="submitPassword">
            <v-text-field
              v-model="oldPassword"
              :type="showOld ? 'text' : 'password'"
              :label="$t('akun.oldPassword')"
              :append-inner-icon="showOld ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              variant="outlined"
              density="comfortable"
              autocomplete="current-password"
              hide-details="auto"
              required
              @click:append-inner="showOld = !showOld"
            />
            <v-text-field
              v-model="newPassword"
              :type="showNew ? 'text' : 'password'"
              :label="$t('akun.newPassword')"
              :append-inner-icon="showNew ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              variant="outlined"
              density="comfortable"
              autocomplete="new-password"
              hide-details="auto"
              required
              @click:append-inner="showNew = !showNew"
            />
            <div class="pt-1">
              <v-btn
                type="submit"
                color="primary"
                variant="flat"
                class="text-none font-semibold"
                :loading="savingPassword"
              >
                {{ $t('akun.savePassBtn') }}
              </v-btn>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Column: PWA & Web Push Notification & Cron -->
      <div class="space-y-6">
        <!-- PWA Status -->
        <div class="joy-surface p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-semibold text-slate-900 font-display flex items-center gap-2">
              <v-icon size="20" color="primary">mdi-cellphone-arrow-down</v-icon>
              {{ $t('akun.pwaTitle') }}
            </h2>
            <v-chip
              size="small"
              :color="isStandalone ? 'success' : 'default'"
              variant="flat"
              class="font-semibold text-xs"
            >
              {{ isStandalone ? 'Standalone App' : 'Web Browser' }}
            </v-chip>
          </div>
          <p class="text-sm text-slate-600">
            {{ isStandalone ? $t('akun.pwaInstalled') : $t('akun.pwaReady') }}
          </p>
          <div v-if="!isStandalone" class="pt-1">
            <PWAInstallButton />
          </div>
        </div>

        <!-- Fase 4: Web Push Notification -->
        <div class="joy-surface p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-semibold text-slate-900 font-display flex items-center gap-2">
              <v-icon size="20" color="primary">mdi-bell-ring-outline</v-icon>
              {{ $t('akun.pushTitle') }}
            </h2>
            <v-chip
              size="small"
              :color="pushActive ? 'success' : 'default'"
              variant="flat"
              class="font-semibold text-xs"
            >
              {{ pushActive ? $t('akun.pushStatusActive') : $t('akun.pushStatusInactive') }}
            </v-chip>
          </div>

          <p class="text-sm text-slate-600">
            {{ $t('akun.pushDesc') }}
          </p>

          <div v-if="permissionDenied" class="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
            <v-icon size="16" color="error" class="mr-1">mdi-alert-circle</v-icon>
            {{ $t('akun.pushStatusPermissionDenied') }}
          </div>

          <div class="flex flex-wrap gap-3 pt-1">
            <v-btn
              v-if="!pushActive"
              color="primary"
              variant="flat"
              class="text-none font-semibold"
              prepend-icon="mdi-bell-plus"
              :loading="pushLoading"
              :disabled="!isPushSupported"
              @click="subscribePush"
            >
              {{ $t('akun.pushEnableBtn') }}
            </v-btn>

            <v-btn
              v-else
              color="error"
              variant="outlined"
              class="text-none font-semibold"
              prepend-icon="mdi-bell-off-outline"
              :loading="pushLoading"
              @click="unsubscribePush"
            >
              {{ $t('akun.pushDisableBtn') }}
            </v-btn>

            <v-btn
              color="primary"
              variant="outlined"
              class="text-none font-medium"
              prepend-icon="mdi-send-check"
              :loading="testingPush"
              @click="testPushNotification"
            >
              {{ $t('akun.pushTestBtn') }}
            </v-btn>
          </div>
        </div>

        <!-- Fase 4: Cron Pengingat Harian & Logs -->
        <div class="joy-surface p-6 space-y-4">
          <h2 class="text-base font-semibold text-slate-900 font-display flex items-center gap-2">
            <v-icon size="20" color="primary">mdi-clock-check-outline</v-icon>
            {{ $t('akun.cronTitle') }}
          </h2>
          <p class="text-sm text-slate-600">
            {{ $t('akun.cronDesc') }}
          </p>

          <div class="flex flex-wrap gap-3 pt-1">
            <v-btn
              color="primary"
              variant="tonal"
              class="text-none font-medium"
              prepend-icon="mdi-play-circle-outline"
              :loading="runningCron"
              @click="triggerManualCron"
            >
              {{ $t('akun.cronTriggerBtn') }}
            </v-btn>

            <v-btn
              variant="text"
              class="text-none text-slate-600"
              prepend-icon="mdi-history"
              @click="openLogsDialog"
            >
              {{ $t('akun.cronLogBtn') }}
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Push Logs Dialog -->
    <v-dialog v-model="logsDialogOpen" max-width="800">
      <div class="joy-surface p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <v-icon size="20" color="primary">mdi-history</v-icon>
            {{ $t('akun.cronLogTitle') }}
          </h3>
          <v-btn icon="mdi-close" variant="text" density="comfortable" @click="logsDialogOpen = false" />
        </div>

        <div v-if="loadingLogs" class="py-8 text-center text-slate-400">
          <v-progress-circular indeterminate size="28" color="primary" />
        </div>

        <div v-else-if="pushLogs.length === 0" class="py-8 text-center text-slate-500 text-sm">
          Belum ada riwayat pengiriman notifikasi push.
        </div>

        <div v-else class="overflow-x-auto max-h-96">
          <table class="w-full text-left text-xs text-slate-700">
            <thead class="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th class="py-2.5 px-3 font-semibold">{{ $t('akun.colJenis') }}</th>
                <th class="py-2.5 px-3 font-semibold">{{ $t('akun.colTanggal') }}</th>
                <th class="py-2.5 px-3 font-semibold">{{ $t('akun.colStaff') }}</th>
                <th class="py-2.5 px-3 font-semibold">{{ $t('akun.colStatus') }}</th>
                <th class="py-2.5 px-3 font-semibold">{{ $t('akun.colTerkirim') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-mono">
              <tr v-for="log in pushLogs" :key="log.id" class="hover:bg-slate-50">
                <td class="py-2 px-3 font-sans font-medium text-slate-900">{{ log.jenis }}</td>
                <td class="py-2 px-3">{{ log.tanggal }}</td>
                <td class="py-2 px-3 font-sans">{{ log.staffNama }}</td>
                <td class="py-2 px-3">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded text-[11px] font-sans font-semibold',
                      log.status === 'sent'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.status === 'no_subscription'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{ log.status }}
                  </span>
                </td>
                <td class="py-2 px-3 text-slate-500">{{ formatDate(log.sentAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';
import PWAInstallButton from '../components/PWAInstallButton.vue';

const { t, locale } = useI18n();
const appStore = useAppStore();

const oldPassword = ref('');
const newPassword = ref('');
const showOld = ref(false);
const showNew = ref(false);
const savingPassword = ref(false);

const isStandalone = ref(false);
const isPushSupported = ref(false);
const pushActive = ref(false);
const pushLoading = ref(false);
const testingPush = ref(false);
const runningCron = ref(false);
const permissionDenied = ref(false);

const logsDialogOpen = ref(false);
const loadingLogs = ref(false);
const pushLogs = ref([]);

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function formatDate(isoStr) {
  if (!isoStr) return '-';
  try {
    const d = new Date(isoStr);
    return d.toLocaleString(locale.value === 'ja' ? 'ja-JP' : 'id-ID', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoStr;
  }
}

async function checkPushStatus() {
  if (typeof window === 'undefined') return;
  isPushSupported.value = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  if (!isPushSupported.value) return;

  if (Notification.permission === 'denied') {
    permissionDenied.value = true;
  }

  try {
    const status = await apiRequest('/push/status');
    pushActive.value = Boolean(status?.subscribed);
  } catch (err) {
    console.warn('Failed to fetch push status:', err.message);
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    isStandalone.value =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
  }
  checkPushStatus();
});

async function submitPassword() {
  savingPassword.value = true;
  try {
    await apiRequest('/staff/me/password', {
      method: 'PATCH',
      body: {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
      },
    });
    oldPassword.value = '';
    newPassword.value = '';
    appStore.notify(t('messages.passwordUpdated'), 'success');
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    savingPassword.value = false;
  }
}

async function subscribePush() {
  if (!isPushSupported.value) return;
  pushLoading.value = true;
  try {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      permissionDenied.value = perm === 'denied';
      appStore.notify(t('akun.pushStatusPermissionDenied'), 'error');
      return;
    }
    permissionDenied.value = false;

    const keyRes = await apiRequest('/push/public-key');
    const vapidPublicKey = keyRes.publicKey;
    if (!vapidPublicKey) {
      throw new Error('VAPID public key not available');
    }

    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
    }

    const rawSub = sub.toJSON();
    await apiRequest('/push/subscribe', {
      method: 'POST',
      body: {
        endpoint: rawSub.endpoint,
        keys: rawSub.keys,
        userAgent: navigator.userAgent,
      },
    });

    pushActive.value = true;
    appStore.notify(locale.value === 'ja' ? 'Web Push通知を有効化しました。' : 'Notifikasi Web Push berhasil diaktifkan!', 'success');
  } catch (err) {
    console.error('Push subscribe error:', err);
    appStore.notify(err.message || 'Gagal mendaftarkan notifikasi push', 'error');
  } finally {
    pushLoading.value = false;
  }
}

async function unsubscribePush() {
  pushLoading.value = true;
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await apiRequest('/push/subscribe', {
          method: 'DELETE',
          body: { endpoint: sub.endpoint },
        });
        await sub.unsubscribe();
      }
    }
    pushActive.value = false;
    appStore.notify(locale.value === 'ja' ? '通知を無効化しました。' : 'Notifikasi Web Push dinonaktifkan.', 'info');
  } catch (err) {
    appStore.notify(err.message, 'error');
  } finally {
    pushLoading.value = false;
  }
}

async function testPushNotification() {
  testingPush.value = true;
  try {
    const res = await apiRequest('/push/test', { method: 'POST' });
    appStore.notify(t('akun.pushTestSuccess'), 'success');
    console.log('Test push response:', res);
  } catch (err) {
    appStore.notify(err.message, 'error');
  } finally {
    testingPush.value = false;
  }
}

async function triggerManualCron() {
  runningCron.value = true;
  try {
    const report = await apiRequest('/cron/trigger-pengingat', { method: 'POST' });
    const count = report.classesNeedingReminderCount || 0;
    const msg =
      locale.value === 'ja'
        ? `チェック完了: ${count} クラスにリマインダーを送信しました。`
        : `Pengecekan selesai: ${count} kelas membutuhkan pengingat absensi.`;
    appStore.notify(msg, 'success');
  } catch (err) {
    appStore.notify(err.message, 'error');
  } finally {
    runningCron.value = false;
  }
}

async function openLogsDialog() {
  logsDialogOpen.value = true;
  loadingLogs.value = true;
  try {
    pushLogs.value = await apiRequest('/push/logs');
  } catch (err) {
    console.warn('Failed to load push logs:', err);
  } finally {
    loadingLogs.value = false;
  }
}
</script>
