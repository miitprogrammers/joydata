<template>
  <v-dialog
    :model-value="modelValue"
    max-width="780"
    scrollable
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card v-if="detail" class="rounded-xl">
      <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
        <div>
          <div class="text-lg font-semibold text-slate-900 font-display">
            {{ detail.nama }}
          </div>
          <div class="text-xs text-slate-500 flex items-center gap-2 mt-0.5 tabular-nums">
            <span>ID #{{ detail.mancationAkunId }}</span>
            <span aria-hidden="true">·</span>
            <span>{{ detail.namaKelas || $t(`luarTypes.${detail.keteranganLuarKelas || 'alumni'}`) }}</span>
            <span aria-hidden="true">·</span>
            <span class="font-medium text-slate-700">{{ $t(`tags.${detail.statusTag}`) }}</span>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" :aria-label="$t('app.close')" @click="$emit('update:modelValue', false)" />
      </div>

      <v-tabs v-model="activeTab" color="primary" density="compact" class="px-6 border-b border-slate-200">
        <v-tab value="meibo" class="text-none text-xs font-medium">{{ $t('peserta.tabMeibo') }}</v-tab>
        <v-tab value="biodata" class="text-none text-xs font-medium">{{ $t('peserta.tabBiodata') }}</v-tab>
        <v-tab value="tag" class="text-none text-xs font-medium">{{ $t('peserta.tabStatusTag') }}</v-tab>
      </v-tabs>

      <v-card-text class="pa-6" style="max-height: 68vh">
        <v-window v-model="activeTab">
          <!-- Tab 1: Pendidikan Akhir & Penempatan 名簿 (tanpa 現状) -->
          <v-window-item value="meibo">
            <div class="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <v-text-field
                v-model="form.tanggalMasuk"
                type="date"
                :label="$t('peserta.tanggalMasuk')"
                :hint="tanggalMasukHint"
                persistent-hint
                :append-inner-icon="tanggalMasukBedaKelas ? 'mdi-restore' : undefined"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                @click:append-inner="form.tanggalMasuk = detail.tanggalMulaiKelas"
              />
              <v-text-field
                v-model="form.pendidikanAkhir"
                :label="$t('peserta.pendidikanAkhir')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <v-text-field
                v-model="form.pendidikanAkhirJa"
                :label="$t('peserta.pendidikanAkhirJa')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="md:col-span-2"
              />

              <template v-if="detail.sumber === 'manual'">
                <v-select
                  v-model="form.keteranganLuarKelas"
                  :items="luarOptions"
                  item-title="label"
                  item-value="value"
                  :label="$t('pesertaLuar.colKeterangan')"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
                <v-text-field
                  v-model="form.alasan"
                  :label="$t('pesertaLuar.colAlasan')"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
              </template>

              <v-text-field
                v-model="form.penempatan.tanggalLulusUjian"
                type="date"
                :label="$t('peserta.tanggalLulusUjian')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <v-text-field
                v-model="form.penempatan.rencanaMulaiKerja"
                type="date"
                :label="$t('peserta.rencanaMulaiKerja')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <v-text-field
                v-model="form.penempatan.perusahaanNaitei"
                :label="$t('peserta.perusahaanNaitei')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <v-text-field
                v-model="form.penempatan.jenisPekerjaan"
                :label="$t('peserta.jenisPekerjaan')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <v-select
                v-model="form.penempatan.prefekturId"
                :items="prefectureOptions"
                item-title="label"
                item-value="id"
                clearable
                :label="$t('peserta.prefektur')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <v-text-field
                v-model="form.penempatan.lokasiKerja"
                :label="$t('peserta.lokasiKerjaDetail')"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </div>

            <div class="mt-4">
              <v-textarea
                v-model="form.catatanBebas"
                :label="$t('peserta.catatanBebas')"
                rows="2"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
            </div>
          </v-window-item>

          <!-- Tab 2: Biodata Mancation & Pelengkap Lokal -->
          <v-window-item value="biodata">
            <p class="text-xs text-slate-600 mb-4">
              {{ $t('peserta.biodataInfo') }}
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <v-text-field
                v-model="form.tanggalLahirLokal"
                type="date"
                :label="$t('peserta.tanggalLahir')"
                :placeholder="detail.tanggalLahir || ''"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <v-text-field
                v-model="form.statusPernikahanLokal"
                :label="$t('peserta.statusPernikahan')"
                :placeholder="detail.statusPernikahan || ''"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <v-text-field
                v-model="form.jumlahAnakLokal"
                type="number"
                min="0"
                :label="$t('peserta.jumlahAnak')"
                :placeholder="detail.jumlahAnak != null ? String(detail.jumlahAnak) : ''"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <v-text-field
                v-model="form.agamaLokal"
                :label="$t('peserta.agama')"
                :placeholder="detail.agama || ''"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
              />
              <div class="md:col-span-2">
                <v-text-field
                  v-model="form.daerahAsalLokal"
                  :label="$t('peserta.daerahAsal')"
                  :placeholder="detail.daerahAsal || ''"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
              </div>
            </div>
          </v-window-item>

          <!-- Tab 3: Status Tag Mensetsu (Admin Only) & Riwayat -->
          <v-window-item value="tag">
            <div class="pb-5 mb-5 border-b border-slate-200">
              <div class="text-sm font-semibold text-slate-900 mb-2">
                {{ $t('peserta.changeTagHeading') }}
              </div>
              <div v-if="appStore.isAdmin" class="space-y-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <v-select
                    v-model="tagForm.statusTag"
                    :items="tagOptions"
                    item-title="label"
                    item-value="value"
                    :label="$t('peserta.selectNewTag')"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                  />
                  <v-text-field
                    v-model="tagForm.catatan"
                    :label="$t('peserta.tagNote')"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                  />
                </div>
                <div>
                  <v-btn
                    color="primary"
                    variant="flat"
                    class="text-none"
                    :loading="savingTag"
                    @click="submitTagChange"
                  >
                    {{ $t('peserta.applyTagBtn') }}
                  </v-btn>
                </div>
              </div>
              <div v-else class="text-xs text-slate-500">
                {{ $t('peserta.adminOnlyTagNotice') }}
              </div>
            </div>

            <div>
              <div class="text-sm font-semibold text-slate-900 mb-3">
                {{ $t('peserta.historyHeading') }}
              </div>
              <div v-if="!detail.statusLogs?.length" class="text-xs text-slate-500">
                {{ $t('peserta.noHistory') }}
              </div>
              <div v-else class="divide-y divide-slate-100">
                <div
                  v-for="log in detail.statusLogs"
                  :key="log.id"
                  class="py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs"
                >
                  <div>
                    <span class="text-slate-500">{{ $t(`tags.${log.statusLama}`) }}</span>
                    <span class="mx-1.5 text-slate-400">→</span>
                    <span class="font-semibold text-slate-900">{{ $t(`tags.${log.statusBaru}`) }}</span>
                    <span v-if="log.catatan" class="text-slate-600 ml-2">· {{ log.catatan }}</span>
                  </div>
                  <div class="text-slate-400 tabular-nums shrink-0">
                    {{ log.staffNama }} · {{ formatDateTime(log.createdAt) }}
                  </div>
                </div>
              </div>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>

      <div class="px-6 py-3.5 border-t border-slate-200 flex items-center justify-end gap-2 bg-slate-50/50">
        <v-btn variant="text" class="text-none" @click="$emit('update:modelValue', false)">
          {{ $t('app.close') }}
        </v-btn>
        <v-btn
          v-if="activeTab !== 'tag'"
          color="primary"
          variant="flat"
          class="text-none"
          :loading="saving"
          @click="submitMeibo"
        >
          {{ $t('app.save') }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  pesertaId: { type: Number, default: null },
  prefectures: { type: Array, default: () => [] },
});

const emit = defineEmits(['update:modelValue', 'saved']);

const { t, locale } = useI18n();
const appStore = useAppStore();

const activeTab = ref('meibo');
const detail = ref(null);
const saving = ref(false);
const savingTag = ref(false);

const form = ref({
  tanggalMasuk: '',
  pendidikanAkhir: '',
  pendidikanAkhirJa: '',
  catatanBebas: '',
  keteranganLuarKelas: 'alumni',
  alasan: '',
  tanggalLahirLokal: '',
  statusPernikahanLokal: '',
  jumlahAnakLokal: null,
  agamaLokal: '',
  daerahAsalLokal: '',
  penempatan: {
    tanggalLulusUjian: '',
    perusahaanNaitei: '',
    jenisPekerjaan: '',
    prefekturId: null,
    lokasiKerja: '',
    rencanaMulaiKerja: '',
  },
});

const tagForm = ref({
  statusTag: 'standar',
  catatan: '',
});

const tagOptions = computed(() => [
  { value: 'standar', label: t('tags.standar') },
  { value: 'berkembang', label: t('tags.berkembang') },
  { value: 'siap_interview', label: t('tags.siap_interview') },
]);

// Tanggal masuk follows the class start date; the server stores it only when it is set to a different date.
const tanggalMasukBedaKelas = computed(() =>
  Boolean(
    detail.value?.tanggalMulaiKelas &&
      form.value.tanggalMasuk &&
      form.value.tanggalMasuk !== detail.value.tanggalMulaiKelas
  )
);

const tanggalMasukHint = computed(() => {
  const tanggal = detail.value?.tanggalMulaiKelas;
  if (!tanggal) return '';
  return tanggalMasukBedaKelas.value
    ? t('peserta.tanggalMasukManual', { tanggal })
    : t('peserta.tanggalMasukIkutKelas', { tanggal });
});

const luarOptions = computed(() => [
  { value: 'alumni', label: t('luarTypes.alumni') },
  { value: 'cuti', label: t('luarTypes.cuti') },
  { value: 'keluar', label: t('luarTypes.keluar') },
]);

const prefectureOptions = computed(() =>
  props.prefectures.map((p) => ({
    id: p.id,
    label: locale.value === 'ja' ? p.namaJa : `${p.namaId} (${p.namaJa})`,
  }))
);

function populateForm(d) {
  detail.value = d;
  form.value = {
    tanggalMasuk: d.tanggalMasuk || '',
    pendidikanAkhir: d.pendidikanAkhir || '',
    pendidikanAkhirJa: d.pendidikanAkhirJa || '',
    catatanBebas: d.catatanBebas || '',
    keteranganLuarKelas: d.keteranganLuarKelas || 'alumni',
    alasan: d.alasan || '',
    tanggalLahirLokal: d.tanggalLahirLokal || d.tanggalLahir || '',
    statusPernikahanLokal: d.statusPernikahanLokal || d.statusPernikahan || '',
    jumlahAnakLokal: d.jumlahAnakLokal ?? d.jumlahAnak ?? null,
    agamaLokal: d.agamaLokal || d.agama || '',
    daerahAsalLokal: d.daerahAsalLokal || d.daerahAsal || '',
    penempatan: {
      tanggalLulusUjian: d.penempatan?.tanggalLulusUjian || '',
      perusahaanNaitei: d.penempatan?.perusahaanNaitei || '',
      jenisPekerjaan: d.penempatan?.jenisPekerjaan || '',
      prefekturId: d.penempatan?.prefekturId || null,
      lokasiKerja: d.penempatan?.lokasiKerja || '',
      rencanaMulaiKerja: d.penempatan?.rencanaMulaiKerja || '',
    },
  };
  tagForm.value = {
    statusTag: d.statusTag || 'standar',
    catatan: '',
  };
}

async function loadDetail() {
  if (!props.pesertaId) return;
  try {
    const res = await apiRequest(`/peserta/${props.pesertaId}`);
    populateForm(res);
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  }
}

watch(
  () => [props.modelValue, props.pesertaId],
  ([open, id]) => {
    if (open && id) {
      activeTab.value = 'meibo';
      loadDetail();
    }
  }
);

async function submitMeibo() {
  if (!detail.value) return;
  saving.value = true;
  try {
    const updated = await apiRequest(`/peserta/${detail.value.id}`, {
      method: 'PATCH',
      body: form.value,
    });
    populateForm(updated);
    appStore.notify(t('messages.saved'), 'success');
    emit('saved');
    emit('update:modelValue', false);
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    saving.value = false;
  }
}

async function submitTagChange() {
  if (!detail.value) return;
  savingTag.value = true;
  try {
    const updated = await apiRequest(`/peserta/${detail.value.id}/tag`, {
      method: 'PATCH',
      body: tagForm.value,
    });
    populateForm(updated);
    appStore.notify(t('messages.saved'), 'success');
    emit('saved');
  } catch (err) {
    appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
  } finally {
    savingTag.value = false;
  }
}

function formatDateTime(iso) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString(locale.value === 'ja' ? 'ja-JP' : 'id-ID', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return String(iso).slice(0, 10);
  }
}
</script>
