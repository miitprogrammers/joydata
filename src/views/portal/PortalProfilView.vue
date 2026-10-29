<template>
  <div v-if="report" class="space-y-4">
    <section class="joy-surface p-5">
      <h2 class="text-base font-bold text-slate-900 font-display mb-3">{{ $t('portal.profil.dataDiri') }}</h2>
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <div v-for="row in dataDiri" :key="row.label">
          <dt class="text-xs text-slate-500">{{ row.label }}</dt>
          <dd class="text-slate-900 break-words">{{ row.value || '-' }}</dd>
        </div>
      </dl>
    </section>

    <section v-if="adaPenempatan" class="joy-surface p-5">
      <h2 class="text-base font-bold text-slate-900 font-display mb-3">{{ $t('portal.penempatan') }}</h2>
      <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <template v-for="row in penempatanRows" :key="row.label">
          <div v-if="row.value">
            <dt class="text-xs text-slate-500">{{ row.label }}</dt>
            <dd class="text-slate-900">{{ row.value }}</dd>
          </div>
        </template>
      </dl>
    </section>

    <section class="joy-surface p-5">
      <h2 class="text-base font-bold text-slate-900 font-display">{{ $t('portal.gantiSandiDialog') }}</h2>
      <p class="text-xs text-slate-500 mt-1 mb-4">{{ $t('portal.profil.sandiDesc') }}</p>
      <div class="max-w-sm">
        <PortalPasswordForm :key="formKey" @saved="onPasswordChanged" />
      </div>
    </section>

    <section class="joy-surface p-5 flex items-center justify-between gap-3">
      <p class="text-sm text-slate-700">{{ $t('portal.profil.keluarDesc') }}</p>
      <v-btn variant="tonal" color="error" class="text-none" prepend-icon="mdi-logout" @click="logout">{{ $t('portal.keluar') }}</v-btn>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '../../stores/appStore.js';
import { usePortalSession, usePortalFormat, setPortalPeserta, clearPortalSession } from '../../services/portalSession.js';
import PortalPasswordForm from '../../components/portal/PortalPasswordForm.vue';

const router = useRouter();
const { t, locale } = useI18n();
const appStore = useAppStore();
const { peserta, report } = usePortalSession();
const { tanggal } = usePortalFormat();
const formKey = ref(0);

const dataDiri = computed(() => {
  const kelas = report.value.kelas;
  return [
    { label: t('portal.profil.nama'), value: report.value.peserta.nama },
    { label: t('portal.profil.email'), value: peserta.value?.email },
    { label: t('portal.profil.kelas'), value: kelas?.namaKelas },
    { label: t('portal.profil.program'), value: locale.value === 'ja' ? kelas?.programNamaJa : kelas?.programNama },
    { label: t('portal.profil.senseiKelas'), value: kelas?.senseiNama && kelas.senseiNama !== '-' ? kelas.senseiNama : '' },
    { label: t('portal.profil.tanggalMasuk'), value: report.value.peserta.tanggalMasuk ? tanggal(report.value.peserta.tanggalMasuk) : '' },
  ];
});

const penempatanRows = computed(() => {
  const p = report.value.penempatan || {};
  return [
    { label: t('portal.perusahaan'), value: p.perusahaanNaitei },
    { label: t('portal.jenisPekerjaan'), value: p.jenisPekerjaan },
    { label: t('portal.lokasi'), value: p.lokasiKerja },
    { label: t('portal.lulusUjianTanggal'), value: p.tanggalLulusUjian ? tanggal(p.tanggalLulusUjian) : '' },
    { label: t('portal.rencanaKerja'), value: p.rencanaMulaiKerja ? tanggal(p.rencanaMulaiKerja) : '' },
  ];
});
const adaPenempatan = computed(() => penempatanRows.value.some((r) => r.value));

function onPasswordChanged(session) {
  setPortalPeserta(session);
  formKey.value += 1;
  appStore.notify(t('portal.sandiTersimpan'), 'success');
}

function logout() {
  clearPortalSession();
  router.replace('/portal/login');
}
</script>
