<template>
  <section class="sr-resume space-y-2" :class="{ 'no-print': !resume }">
    <div class="flex items-center justify-between gap-2 border-b border-slate-200 pb-1.5">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
        <v-icon icon="mdi-creation-outline" size="14" class="text-blue-800" />
        {{ title }}
      </h3>
      <div v-if="canWrite && !editing" class="no-print flex items-center gap-1.5">
        <button
          type="button"
          class="joy-btn-secondary text-[11px] py-1 px-2.5"
          :disabled="isBusy || locked"
          @click="startEdit"
        >
          {{ resume ? $t('smartReport.resumeEdit') : $t('smartReport.resumeTulisManual') }}
        </button>
        <button
          type="button"
          class="joy-btn-primary text-[11px] py-1 px-2.5 flex items-center gap-1"
          :disabled="isBusy || locked"
          @click="runGenerate"
        >
          <v-icon icon="mdi-creation" size="14" />
          {{ resume ? $t('smartReport.resumeBuatUlang') : $t('smartReport.resumeBuat') }}
        </button>
      </div>
    </div>

    <div v-if="isBusy" class="no-print text-xs text-slate-500 flex items-center gap-2 py-1">
      <v-progress-circular indeterminate size="14" width="2" color="primary" />
      {{ $t('smartReport.resumeMembuat') }}
    </div>

    <div
      v-if="resume?.usang && !editing"
      class="no-print bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded-md p-2 flex items-start gap-1.5"
    >
      <v-icon icon="mdi-alert-outline" size="14" class="mt-px" />
      <span>{{ $t('smartReport.resumeUsang') }}</span>
    </div>

    <div v-if="editing" class="no-print space-y-2">
      <label class="block text-[11px] font-semibold text-slate-600">Bahasa Indonesia</label>
      <textarea v-model="draftId" rows="7" class="joy-input w-full p-2 text-xs leading-relaxed" />
      <label class="block text-[11px] font-semibold text-slate-600">日本語</label>
      <textarea v-model="draftJa" rows="7" class="joy-input w-full p-2 text-xs leading-relaxed" />
      <div class="flex justify-end gap-2">
        <button type="button" class="joy-btn-secondary text-xs" :disabled="saving" @click="editing = false">
          {{ $t('common.batal') }}
        </button>
        <button
          type="button"
          class="joy-btn-primary text-xs"
          :disabled="saving || !draftId.trim() || !draftJa.trim()"
          @click="runSave"
        >
          {{ saving ? $t('common.menyimpan') : $t('smartReport.resumeSimpan') }}
        </button>
      </div>
    </div>

    <template v-else-if="resume">
      <div class="space-y-2.5">
        <div class="flex gap-2.5">
          <span class="sr-lang-tag">ID</span>
          <p class="text-[11.5px] leading-relaxed text-slate-800 whitespace-pre-line text-justify">{{ resume.teksId }}</p>
        </div>
        <div class="flex gap-2.5">
          <span class="sr-lang-tag">JA</span>
          <p class="text-[11.5px] leading-relaxed text-slate-800 whitespace-pre-line text-justify" lang="ja">{{ resume.teksJa }}</p>
        </div>
      </div>
      <div v-if="portal" class="text-[10px] text-slate-400 italic">
        <span v-if="resume.tanggal">{{ $t('smartReport.resumeDiperbarui', { tanggal: formatDate(resume.tanggal) }) }}</span>
      </div>
      <div v-else class="text-[10px] text-slate-400 italic">
        <span v-if="resume.dibuatAt">
          {{ $t('smartReport.resumeSumberAi', { model: resume.model || 'Gemini', tanggal: formatDate(resume.dibuatAt) }) }}
        </span>
        <span v-if="resume.dieditAt">
          {{
            resume.dibuatAt
              ? $t('smartReport.resumeDiedit', { nama: resume.dieditOleh || '-', tanggal: formatDate(resume.dieditAt) })
              : $t('smartReport.resumeManual', { nama: resume.dieditOleh || '-', tanggal: formatDate(resume.dieditAt) })
          }}
        </span>
      </div>
    </template>

    <div v-else class="text-xs text-slate-400 italic">
      {{ $t('smartReport.resumeBelumAda') }}
      <span v-if="!canWrite">{{ $t('smartReport.resumeHanyaBaca') }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export interface SmartResume {
  teksId: string;
  teksJa: string;
  model: string | null;
  dibuatAt: string | null;
  dibuatOleh: string | null;
  dieditAt: string | null;
  dieditOleh: string | null;
  usang: boolean;
  // Peserta portal only: last written or edited, instead of the fields above.
  tanggal?: string | null;
}

const props = defineProps<{
  title: string;
  resume: SmartResume | null;
  canWrite: boolean;
  // Peserta portal: only the text and its date.
  portal?: boolean;
  // Set by the parent while it writes this resume as part of a bulk run.
  busy?: boolean;
  // Set by the parent during a bulk run, so no resume is written twice at the same time.
  locked?: boolean;
  generate: () => Promise<void>;
  save: (payload: { teksId: string; teksJa: string }) => Promise<void>;
}>();

const { locale } = useI18n();

const editing = ref(false);
const draftId = ref('');
const draftJa = ref('');
const generating = ref(false);
const saving = ref(false);

const isBusy = computed(() => generating.value || saving.value || !!props.busy);

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(locale.value === 'ja' ? 'ja-JP' : 'id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function startEdit() {
  draftId.value = props.resume?.teksId || '';
  draftJa.value = props.resume?.teksJa || '';
  editing.value = true;
}

async function runGenerate() {
  generating.value = true;
  try {
    await props.generate();
  } finally {
    generating.value = false;
  }
}

async function runSave() {
  saving.value = true;
  try {
    await props.save({ teksId: draftId.value, teksJa: draftJa.value });
    editing.value = false;
  } catch {
    // The parent already reported the error; keep the draft open.
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.sr-lang-tag {
  flex-shrink: 0;
  height: fit-content;
  margin-top: 1px;
  padding: 1px 5px;
  border-radius: 4px;
  background: #eff6ff;
  color: #1e3a8a;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.05em;
}
</style>
