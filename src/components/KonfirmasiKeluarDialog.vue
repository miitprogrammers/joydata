<template>
  <v-dialog :model-value="modelValue" max-width="400" @update:model-value="emit('update:modelValue', $event)">
    <v-card rounded="lg">
      <v-card-title class="pt-5 px-5 text-base font-semibold text-slate-900 font-display">
        {{ $t('app.keluarJudul') }}
      </v-card-title>
      <v-card-text class="px-5 text-sm text-slate-600">
        {{ pesan }}
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" class="text-none" @click="emit('update:modelValue', false)">
          {{ $t('app.cancel') }}
        </v-btn>
        <v-btn color="error" variant="flat" class="text-none" prepend-icon="mdi-logout" @click="konfirmasi">
          {{ $t('app.logout') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
// Asks before signing out; the parent does the actual logout on "confirm".
defineProps({
  modelValue: { type: Boolean, default: false },
  pesan: { type: String, required: true },
});
const emit = defineEmits(['update:modelValue', 'confirm']);

function konfirmasi() {
  emit('update:modelValue', false);
  emit('confirm');
}
</script>
