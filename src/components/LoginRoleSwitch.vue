<template>
  <nav class="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 mb-6" :aria-label="$t('login.masukSebagai')">
    <router-link
      v-for="o in opsi"
      :key="o.key"
      :to="o.to"
      replace
      class="flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors"
      :class="o.key === aktif ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'"
      :aria-current="o.key === aktif ? 'page' : undefined"
    >
      <v-icon :icon="o.icon" size="16" />
      {{ $t(o.label) }}
    </router-link>
  </nav>
</template>

<script setup>
// Staff and peserta sign in on separate pages; this switch links the two.
defineProps({
  aktif: { type: String, required: true }, // 'staf' | 'peserta'
});

const opsi = [
  { key: 'staf', to: '/login', icon: 'mdi-badge-account-horizontal-outline', label: 'login.staf' },
  { key: 'peserta', to: '/portal/login', icon: 'mdi-account-school-outline', label: 'login.peserta' },
];
</script>
