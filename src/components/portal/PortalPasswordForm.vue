<template>
  <form class="space-y-3" @submit.prevent="onSubmit">
    <v-text-field
      v-model="oldPassword"
      :type="show ? 'text' : 'password'"
      :label="$t('portal.sandiLama')"
      variant="outlined"
      density="comfortable"
      autocomplete="current-password"
      hide-details="auto"
      required
    />
    <v-text-field
      v-model="newPassword"
      :type="show ? 'text' : 'password'"
      :label="$t('portal.sandiBaru')"
      variant="outlined"
      density="comfortable"
      autocomplete="new-password"
      hide-details="auto"
      required
    />
    <v-text-field
      v-model="confirmPassword"
      :type="show ? 'text' : 'password'"
      :label="$t('portal.sandiUlang')"
      :append-inner-icon="show ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
      variant="outlined"
      density="comfortable"
      autocomplete="new-password"
      hide-details="auto"
      required
      @click:append-inner="show = !show"
    />
    <p v-if="errorMsg" class="text-xs font-medium text-red-700" role="alert">{{ errorMsg }}</p>
    <v-btn type="submit" color="primary" variant="flat" block class="text-none font-semibold" :loading="saving">
      {{ $t('portal.simpanSandi') }}
    </v-btn>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { portalRequest, setPortalToken } from '../../services/portalApi.js';

const emit = defineEmits(['saved']);
const { t, te } = useI18n();

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const show = ref(false);
const saving = ref(false);
const errorMsg = ref('');

async function onSubmit() {
  errorMsg.value = '';
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = t('portal.sandiTidakSama');
    return;
  }
  saving.value = true;
  try {
    const data = await portalRequest('/auth/password', {
      method: 'POST',
      body: { oldPassword: oldPassword.value, newPassword: newPassword.value },
    });
    // The server rotates the token when the password changes; keep the new one.
    setPortalToken(data.token);
    oldPassword.value = newPassword.value = confirmPassword.value = '';
    emit('saved', data.peserta);
  } catch (err) {
    errorMsg.value = te(`messages.${err.code}`) ? t(`messages.${err.code}`) : t('messages.GENERIC_ERROR');
  } finally {
    saving.value = false;
  }
}
</script>
