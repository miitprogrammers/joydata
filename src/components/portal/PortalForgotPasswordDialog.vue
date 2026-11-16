<template>
  <v-dialog :model-value="modelValue" max-width="440" persistent @update:model-value="onClose">
    <v-card rounded="lg">
      <v-card-title class="pt-5 px-5 text-base font-semibold text-slate-900 font-display">
        {{ $t('portal.lupaSandiTitle') }}
      </v-card-title>
      <v-card-text class="px-5 pb-1">
        <p v-if="berhasil" class="text-sm text-slate-700">{{ $t('portal.lupaSandiBerhasil') }}</p>
        <form v-else id="portal-forgot-password" class="space-y-3" @submit.prevent="onSubmit">
          <p class="text-sm text-slate-600">{{ $t('portal.lupaSandiDesc') }}</p>
          <v-text-field
            v-model="email"
            type="email"
            :label="$t('portal.email')"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="comfortable"
            autocomplete="username"
            inputmode="email"
            hide-details="auto"
            required
          />
          <v-text-field
            v-model="tanggalLahir"
            type="date"
            :label="$t('portal.tanggalLahir')"
            prepend-inner-icon="mdi-cake-variant-outline"
            variant="outlined"
            density="comfortable"
            autocomplete="bday"
            :max="hariIni"
            hide-details="auto"
            required
          />
          <p v-if="errorMsg" class="text-xs font-medium text-red-700" role="alert">{{ errorMsg }}</p>
        </form>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <template v-if="berhasil">
          <v-btn color="primary" variant="flat" class="text-none" @click="selesai">
            {{ $t('portal.submit') }}
          </v-btn>
        </template>
        <template v-else>
          <v-btn variant="text" class="text-none" @click="onClose(false)">
            {{ $t('portal.tutup') }}
          </v-btn>
          <v-btn
            type="submit"
            form="portal-forgot-password"
            color="primary"
            variant="flat"
            class="text-none"
            :loading="submitting"
          >
            {{ $t('portal.lupaSandiKirim') }}
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { portalRequest } from '../../services/portalApi.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  initialEmail: { type: String, default: '' },
});
const emit = defineEmits(['update:modelValue', 'reset']);

const { t, te } = useI18n();

const email = ref('');
const tanggalLahir = ref('');
const submitting = ref(false);
const errorMsg = ref('');
const berhasil = ref(false);
const hariIni = computed(() => new Date().toISOString().slice(0, 10));

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return;
    email.value = props.initialEmail || '';
    tanggalLahir.value = '';
    errorMsg.value = '';
    berhasil.value = false;
  }
);

function onClose(value) {
  if (!submitting.value) emit('update:modelValue', value);
}

function selesai() {
  emit('update:modelValue', false);
}

async function onSubmit() {
  errorMsg.value = '';
  submitting.value = true;
  try {
    await portalRequest('/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value, tanggalLahir: tanggalLahir.value },
    });
    berhasil.value = true;
    emit('reset', email.value);
  } catch (err) {
    if (err.code === 'INVALID_RESET_DATA') errorMsg.value = t('portal.lupaSandiTidakCocok');
    else if (te(`messages.${err.code}`)) errorMsg.value = t(`messages.${err.code}`);
    else errorMsg.value = t('messages.GENERIC_ERROR');
  } finally {
    submitting.value = false;
  }
}
</script>
