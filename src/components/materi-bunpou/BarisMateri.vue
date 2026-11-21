<template>
  <button
    type="button"
    class="baris"
    :class="{ pilih }"
    role="option"
    :aria-selected="pilih"
    :disabled="belum"
    :title="belum ? $t('materiBunpou.belumTooltip') : undefined"
    @click="$emit('buka', materi.id)"
  >
    <div>
      <div class="pola"><JP :text="materi.pola" /></div>
      <div class="romaji">{{ materi.romaji }}</div>
    </div>
    <div class="arti-wrap">
      <div class="arti"><TeksCampur :text="materi.arti" /></div>
      <div class="chips">
        <span class="chip" :class="materi.tingkat.toLowerCase()">{{ chipBab }}</span>
        <span v-if="materi.sumber?.modulN4?.length" class="chip modul">{{ chipModul }}</span>
      </div>
    </div>
    <div class="kanan">
      <span class="status" :class="materi.status">
        <i class="mdi" :class="IKON[materi.status]"></i>
        <span class="status-teks">{{ $t(`materiBunpou.status.${materi.status}`) }}</span>
      </span>
      <i v-if="!belum" class="mdi mdi-chevron-right panah"></i>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import JP from './JP.vue';
import TeksCampur from './TeksCampur.vue';

const props = defineProps({
  materi: { type: Object, required: true },
  pilih: { type: Boolean, default: false },
});
defineEmits(['buka']);
const { t } = useI18n();

const IKON = { draf: 'mdi-circle', ditinjau: 'mdi-check-circle', belum: 'mdi-circle-outline' };
const belum = computed(() => props.materi.status === 'belum');
const chipBab = computed(() => {
  const bab = props.materi.sumber?.minnaBab || [];
  return bab.length ? t('materiBunpou.chipBab', { tingkat: props.materi.tingkat, bab: bab.join(', ') }) : props.materi.tingkat;
});
const chipModul = computed(() => {
  const nomor = props.materi.sumber.modulN4.map((n) => `#${n}`).join(' ');
  return t('materiBunpou.chipModul', { nomor }) + (props.materi.level ? ` · ${props.materi.level}` : '');
});
</script>

<style scoped>
.baris {
  display: grid;
  grid-template-columns: minmax(150px, 220px) 1fr auto;
  gap: 4px 18px;
  align-items: center;
  padding: 14px 18px;
  border: 0;
  border-top: 1px solid #e2e8f0;
  width: 100%;
  text-align: left;
  background: #fff;
  cursor: pointer;
  font: inherit;
  color: inherit;
}
.baris:first-child {
  border-top: 0;
}
.baris:hover:not(:disabled),
.baris.pilih {
  background: #eff6ff;
}
.baris.pilih {
  box-shadow: inset 3px 0 0 #1d4ed8;
}
.baris:disabled {
  cursor: default;
  opacity: 0.55;
}
.pola {
  font-size: 24px;
  font-weight: 500;
}
.romaji {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}
.arti {
  font-size: 15px;
  color: #0f172a;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  border-radius: 6px;
  padding: 2px 8px;
  background: #f1f5f9;
  color: #334155;
  white-space: nowrap;
}
.chip.n5 {
  background: #e0f2fe;
  color: #075985;
}
.chip.n4 {
  background: #ede9fe;
  color: #5b21b6;
}
.chip.modul {
  background: #fffbeb;
  color: #b45309;
}
.status {
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}
.status.draf {
  color: #b45309;
}
.status.ditinjau {
  color: #047857;
}
.status.belum {
  color: #94a3b8;
}
.panah {
  font-size: 22px;
  color: #94a3b8;
}
.kanan {
  display: flex;
  align-items: center;
  gap: 10px;
}
@media (max-width: 600px) {
  .baris {
    grid-template-columns: 1fr auto;
    padding: 12px 14px;
  }
  .arti-wrap {
    grid-column: 1 / -1;
    grid-row: 2;
  }
  .kanan {
    grid-row: 1;
    grid-column: 2;
  }
  .status-teks {
    display: none;
  }
}
</style>
