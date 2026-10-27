import { defineComponent, h } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '../stores/appStore.js';

import LoginView from '../views/LoginView.vue';
import OverviewView from '../views/OverviewView.vue';
import KelasView from '../views/KelasView.vue';
import PesertaView from '../views/PesertaView.vue';
import PesertaLuarView from '../views/PesertaLuarView.vue';
import StaffView from '../views/StaffView.vue';
import AkunView from '../views/AkunView.vue';
import KategoriSikapView from '../views/KategoriSikapView.vue';
import ProgramView from '../views/ProgramView.vue';
import RoleAksesView from '../views/RoleAksesView.vue';
import NilaiUjianView from '../views/NilaiUjianView.vue';
import NilaiKaiwaView from '../views/NilaiKaiwaView.vue';
import NilaiSikapView from '../views/NilaiSikapView.vue';
import AbsensiView from '../views/AbsensiView.vue';
import AuditLogView from '../views/AuditLogView.vue';
import ProgresView from '../views/ProgresView.vue';
import RaporView from '../views/RaporView.vue';
import PengaturanView from '../views/PengaturanView.vue';
import SmartReportView from '../views/SmartReportView.vue';

const NoAccessState = defineComponent({
  name: 'NoAccessState',
  setup() {
    const { locale } = useI18n();
    const appStore = useAppStore();
    return () =>
      h('div', { class: 'joy-surface p-8 max-w-xl mx-auto mt-8 space-y-3' }, [
        h(
          'h1',
          { class: 'text-xl font-bold text-slate-900 font-display' },
          locale.value === 'ja'
            ? 'アクセス可能なページがまだ設定されていません'
            : 'Belum Ada Halaman yang Diizinkan untuk Role Ini'
        ),
        h(
          'p',
          { class: 'text-sm text-slate-600' },
          locale.value === 'ja'
            ? `現在のロール（${appStore.user?.role?.roleNameJa || ''}）にはページ権限が割り当てられていません。管理者に「ロール・権限設定」から権限付与を依頼してください。`
            : `Akun Anda (${appStore.user?.role?.roleNameId || ''}) berhasil masuk, namun Administrator belum memberikan hak akses halaman pada menu Role & Akses.`
        ),
      ]);
  },
});

const PhasePlaceholder = defineComponent({
  name: 'PhasePlaceholder',
  setup() {
    const { t, locale } = useI18n();
    const appStore = useAppStore();
    return () => {
      const path = window.location.pathname;
      const pageMeta = appStore.allowedPages.find((p) => p.routePath === path);
      const title = pageMeta
        ? locale.value === 'ja'
          ? pageMeta.titleJa
          : pageMeta.titleId
        : path;
      const fase = pageMeta?.fase || 2;
      return h('div', { class: 'joy-surface p-8 max-w-2xl space-y-3' }, [
        h('h1', { class: 'text-2xl font-bold text-slate-900 font-display' }, title),
        h(
          'p',
          { class: 'text-sm text-slate-600' },
          t('akses.phaseBadgeNext', { fase })
        ),
      ]);
    };
  },
});

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true },
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: OverviewView,
    meta: { pageKode: 'dashboard' },
  },
  {
    path: '/kelas',
    name: 'data-kelas',
    component: KelasView,
    meta: { pageKode: 'data-kelas' },
  },
  {
    path: '/peserta',
    name: 'data-peserta',
    component: PesertaView,
    meta: { pageKode: 'data-peserta' },
  },
  {
    path: '/peserta-luar',
    name: 'peserta-luar',
    component: PesertaLuarView,
    meta: { pageKode: 'peserta-luar' },
  },
  {
    path: '/config/staff',
    name: 'crud-staff',
    component: StaffView,
    meta: { pageKode: 'crud-staff' },
  },
  {
    path: '/config/akun',
    name: 'akun-notifikasi',
    component: AkunView,
    meta: { pageKode: 'akun-notifikasi' },
  },
  {
    path: '/config/kategori-sikap',
    name: 'kategori-sikap',
    component: KategoriSikapView,
    meta: { pageKode: 'kategori-sikap' },
  },
  {
    path: '/config/program',
    name: 'program',
    component: ProgramView,
    meta: { pageKode: 'program' },
  },
  {
    path: '/config/akses',
    name: 'role-akses',
    component: RoleAksesView,
    meta: { pageKode: 'role-akses' },
  },
  // Fase 2 active academic & audit views
  { path: '/nilai-ujian', name: 'rekap-nilai-ujian', component: NilaiUjianView, meta: { pageKode: 'rekap-nilai-ujian' } },
  { path: '/nilai-kaiwa', name: 'rekap-nilai-kaiwa', component: NilaiKaiwaView, meta: { pageKode: 'rekap-nilai-kaiwa' } },
  { path: '/nilai-sikap', name: 'rekap-nilai-sikap', component: NilaiSikapView, meta: { pageKode: 'rekap-nilai-sikap' } },
  { path: '/absensi', name: 'rekap-absensi', component: AbsensiView, meta: { pageKode: 'rekap-absensi' } },
  { path: '/config/audit-log', name: 'riwayat-aktivitas', component: AuditLogView, meta: { pageKode: 'riwayat-aktivitas' } },
  // Fase 3 active views
  { path: '/progres', name: 'progres-peserta', component: ProgresView, meta: { pageKode: 'progres-peserta' } },
  { path: '/rapor', name: 'rapor-peserta', component: RaporView, meta: { pageKode: 'rapor-peserta' } },
  { path: '/config/pengaturan', name: 'pengaturan', component: PengaturanView, meta: { pageKode: 'pengaturan' } },
  // Fase 4: Smart Report (bundle PDF + resume AI)
  { path: '/smart-report', name: 'smart-report', component: SmartReportView, meta: { pageKode: 'smart-report' } },
  {
    path: '/no-access',
    name: 'no-access',
    component: NoAccessState,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const appStore = useAppStore();
  if (!appStore.initialized) {
    await appStore.restoreSession();
  }

  if (to.meta.public) {
    if (appStore.isAuthenticated) {
      return appStore.firstAllowedRoute();
    }
    return true;
  }

  if (!appStore.isAuthenticated) {
    return {
      path: '/login',
      query: to.query.autostart ? { autostart: to.query.autostart } : undefined,
    };
  }

  if (to.path === '/no-access' && appStore.allowedPages.length > 0) {
    return appStore.firstAllowedRoute();
  }

  if (to.meta.pageKode && !appStore.canAccess(to.meta.pageKode)) {
    const fallback = appStore.firstAllowedRoute();
    if (fallback !== to.path) {
      return fallback;
    }
  }

  return true;
});
