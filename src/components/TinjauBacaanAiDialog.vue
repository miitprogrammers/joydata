<template>
  <v-dialog :model-value="modelValue" max-width="920" scrollable @update:model-value="(v) => !v && tutup()">
    <v-card class="rounded-xl">
      <div class="px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-3">
        <div v-if="sesi">
          <div class="font-semibold text-slate-900 font-display">
            {{ $t('tesOnline.ai.judul') }} · <span class="font-mono tracking-widest">{{ sesi.kode }}</span>
          </div>
          <div class="text-xs text-slate-500 mt-0.5">
            {{ sesi.namaKelas }} · {{ sesi.materiJudul }} · {{ $t('tesOnline.ai.pola', { jlpt: sesi.jlpt }) }} ·
            {{ $t('tesOnline.ai.kanjiDari', { volume: volumeLabel(sesi.kanjiVolume) }) }}
          </div>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <label class="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
            <input v-model="furigana" type="checkbox" class="accent-blue-700" />
            {{ $t('portal.tes.furigana') }}
          </label>
          <v-btn icon="mdi-close" size="small" variant="text" :aria-label="$t('app.close')" @click="tutup" />
        </div>
      </div>

      <v-card-text class="pa-0" style="max-height: 70vh">
        <p class="px-6 py-3 bg-amber-50 text-xs text-amber-900 leading-relaxed">{{ $t('tesOnline.ai.petunjuk') }}</p>
        <div v-if="membuat" class="px-6 py-4 flex items-center gap-3 text-sm text-slate-700 border-b border-slate-100">
          <v-progress-circular indeterminate size="20" width="2" color="primary" />
          {{ $t('tesOnline.ai.menulis', { n: jumlahDiminta }) }}
        </div>
        <div v-if="loading" class="p-6"><v-skeleton-loader type="paragraph@3" /></div>
        <p v-else-if="sesi && !sesi.bacaan.length && !membuat" class="px-6 py-8 text-center text-sm text-slate-500">
          {{ $t('tesOnline.ai.kosong') }}
        </p>
        <section v-for="(b, i) in sesi?.bacaan || []" :key="b.id" class="px-6 py-4 border-b border-slate-100">
          <div class="flex items-start justify-between gap-3">
            <h3 class="text-base font-semibold text-slate-900" lang="ja">
              {{ i + 1 }}. <FuriganaText :text="b.judul" :furigana="furigana" />
            </h3>
            <v-btn
              icon="mdi-trash-can-outline"
              size="x-small"
              variant="text"
              color="error"
              :loading="sibuk === b.id"
              :disabled="Boolean(sibuk) || membuat"
              :aria-label="$t('tesOnline.ai.hapus')"
              @click="hapus(b)"
            />
          </div>
          <p class="mt-2 rounded-lg bg-slate-50 border border-slate-100 p-3 text-base leading-[2.3] text-slate-900" lang="ja">
            <FuriganaText :text="b.teks" :furigana="furigana" />
          </p>
          <details class="mt-1">
            <summary class="text-xs font-medium text-blue-700 cursor-pointer select-none">{{ $t('tesOnline.ai.terjemahan') }}</summary>
            <p class="mt-1 text-xs text-slate-700 leading-relaxed">{{ b.terjemahan }}</p>
          </details>
          <div v-for="(s, si) in b.soal" :key="s.id" class="mt-3">
            <p class="text-sm font-medium text-slate-900" lang="ja">{{ si + 1 }}. <FuriganaText :text="s.tanya" :furigana="furigana" /></p>
            <p class="text-xs text-slate-500">{{ s.tanyaId }}</p>
            <ul class="mt-1 space-y-1">
              <li
                v-for="(o, oi) in s.opsi"
                :key="oi"
                class="flex items-center gap-2 rounded-md px-2 py-1 text-sm"
                :class="oi === s.benar ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'"
              >
                <span class="w-5 text-xs font-semibold text-slate-500">{{ 'ABC'[oi] }}</span>
                <span class="flex-1">{{ o }}</span>
                <span v-if="oi === s.benar" class="text-[11px] font-semibold text-emerald-700">{{ $t('tesOnline.ai.kunci') }}</span>
                <button
                  v-else
                  type="button"
                  class="text-[11px] font-medium text-blue-700 hover:underline disabled:opacity-40"
                  :disabled="Boolean(sibuk) || membuat"
                  @click="jadikanKunci(b, s, oi)"
                >
                  {{ $t('tesOnline.ai.jadikanKunci') }}
                </button>
              </li>
            </ul>
            <p class="mt-1 text-xs text-slate-600" lang="ja">{{ s.pembahasan }}</p>
          </div>
        </section>
      </v-card-text>

      <div class="px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div class="flex items-center gap-2">
          <v-select
            v-model="tambahJumlah"
            :items="[1, 2, 4, 8]"
            :label="$t('tesOnline.ai.jumlahTambah')"
            variant="outlined"
            density="compact"
            hide-details
            style="width: 130px"
          />
          <v-btn variant="outlined" color="primary" class="text-none" prepend-icon="mdi-creation-outline" :loading="membuat" :disabled="Boolean(sibuk)" @click="tambah(tambahJumlah)">
            {{ $t('tesOnline.ai.tambah') }}
          </v-btn>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="sesi" class="text-xs tabular-nums" :class="kurang ? 'text-amber-700' : 'text-slate-500'">
            {{ kurang ? $t('tesOnline.ai.kurang', { n: sesi.bacaan.length, per: sesi.jumlahSoal }) : $t('tesOnline.ai.ringkas', { n: sesi.bacaan.length, per: perPeserta }) }}
          </span>
          <v-btn color="primary" variant="flat" class="text-none" :loading="mengaktifkan" :disabled="!sesi?.bacaan.length || membuat || Boolean(sibuk)" @click="aktifkan">
            {{ $t('tesOnline.ai.aktifkan') }}
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api.js';
import { useAppStore } from '../stores/appStore.js';
import FuriganaText from './portal/tes/FuriganaText.vue';

// Review of an AI dokkai code while it is a draft: keys can be moved, passages removed or added; activating it
// opens the code for peserta and adds the passages to the practice bank.
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  sesiId: { type: Number, default: null },
  // Passages to ask for right away when the draft has none yet (a code just created).
  buatAwal: { type: Number, default: 0 },
});
const emit = defineEmits(['update:modelValue', 'changed', 'aktif']);

const { t } = useI18n();
const appStore = useAppStore();

const sesi = ref(null);
const loading = ref(false);
const membuat = ref(false);
const jumlahDiminta = ref(0);
const sibuk = ref(null);
const mengaktifkan = ref(false);
const furigana = ref(true);
const tambahJumlah = ref(4);
let berubah = false;

const perPeserta = computed(() => (sesi.value?.jumlahSoal ? Math.min(sesi.value.jumlahSoal, sesi.value.bacaan.length) : sesi.value?.bacaan.length));
const kurang = computed(() => sesi.value?.jumlahSoal && sesi.value.bacaan.length && sesi.value.bacaan.length < sesi.value.jumlahSoal);

function volumeLabel(volume) {
  if (!volume) return t('tesOnline.semuaVolume');
  return volume.map((v) => (v === 'DASAR' ? t('tesOnline.volDasar') : `Vol ${v.slice(3)}`)).join(', ');
}

function gagal(err) {
  appStore.notify(t(`messages.${err.code}`) || t('messages.GENERIC_ERROR'), 'error');
}

async function muat() {
  loading.value = true;
  try {
    sesi.value = await apiRequest(`/tes-online/${props.sesiId}`);
  } catch (err) {
    gagal(err);
  } finally {
    loading.value = false;
  }
}

async function tambah(n) {
  membuat.value = true;
  jumlahDiminta.value = n;
  try {
    const res = await apiRequest(`/tes-online/${props.sesiId}/ai`, { method: 'POST', body: { jumlah: n } });
    sesi.value = res.sesi;
    berubah = true;
    appStore.notify(
      res.ditolak ? t('tesOnline.ai.hasilDitolak', { n: res.dibuat, ditolak: res.ditolak }) : t('tesOnline.ai.hasil', { n: res.dibuat }),
      res.ditolak ? 'warning' : 'success'
    );
  } catch (err) {
    gagal(err);
  } finally {
    membuat.value = false;
  }
}

async function hapus(b) {
  if (!window.confirm(t('tesOnline.ai.konfirmasiHapus'))) return;
  sibuk.value = b.id;
  try {
    sesi.value = await apiRequest(`/tes-online/${props.sesiId}/bacaan/${b.id}`, { method: 'DELETE' });
    berubah = true;
  } catch (err) {
    gagal(err);
  } finally {
    sibuk.value = null;
  }
}

async function jadikanKunci(b, s, benar) {
  sibuk.value = b.id;
  try {
    sesi.value = await apiRequest(`/tes-online/${props.sesiId}/bacaan/${b.id}`, { method: 'PATCH', body: { soalId: s.id, benar } });
    berubah = true;
  } catch (err) {
    gagal(err);
  } finally {
    sibuk.value = null;
  }
}

async function aktifkan() {
  mengaktifkan.value = true;
  try {
    const aktif = await apiRequest(`/tes-online/${props.sesiId}`, { method: 'PATCH', body: { status: 'aktif' } });
    berubah = false;
    emit('aktif', aktif);
    emit('update:modelValue', false);
  } catch (err) {
    gagal(err);
  } finally {
    mengaktifkan.value = false;
  }
}

function tutup() {
  if (membuat.value) return;
  if (berubah) emit('changed');
  berubah = false;
  emit('update:modelValue', false);
}

watch(
  () => props.modelValue,
  async (open) => {
    if (!open || !props.sesiId) return;
    sesi.value = null;
    berubah = false;
    await muat();
    if (props.buatAwal > 0 && sesi.value && !sesi.value.bacaan.length) await tambah(props.buatAwal);
  }
);
</script>
