<template>
  <div
    v-if="syncMeta && syncMeta.source === 'snapshot'"
    class="mb-4 px-4 py-2.5 rounded-lg border border-amber-200 bg-amber-50/70 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900"
  >
    <div class="flex items-center gap-2">
      <v-icon icon="mdi-database-clock-outline" size="16" color="warning" />
      <span>{{ $t('app.snapshotNotice') }}</span>
    </div>
    <v-btn
      v-if="showSyncBtn"
      size="x-small"
      variant="tonal"
      color="warning"
      prepend-icon="mdi-sync"
      class="text-none"
      :loading="syncing"
      @click="$emit('sync')"
    >
      {{ $t('app.syncMancation') }}
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  syncMeta: { type: Object, default: null },
  showSyncBtn: { type: Boolean, default: false },
  syncing: { type: Boolean, default: false },
});

defineEmits(['sync']);
</script>
