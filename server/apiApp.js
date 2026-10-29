import express from 'express';
import {
  authenticateStaff,
  getStaffSessionById,
  getRoleAccessData,
  createRole,
  updateRole,
  deleteRole,
  setRoleAccessMatrix,
  listStaff,
  createStaff,
  updateStaff,
  resetStaffPassword,
  changeOwnPassword,
  softDeleteStaff,
  listPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  listSikapKategori,
  createSikapKategori,
  updateSikapKategori,
  deleteSikapKategori,
  syncMancationAndReconcile,
  listKelas,
  createKelas,
  updateKelas,
  softDeleteKelas,
  listPeserta,
  getPesertaDetail,
  updatePesertaSupplementAndPenempatan,
  changePesertaStatusTag,
  lookupOutsideAccount,
  createPesertaLuarKelas,
  deletePesertaLuarKelas,
  getOverviewData,
  listNilaiUjian,
  upsertNilaiUjian,
  updateNilaiUjian,
  deleteNilaiUjian,
  listNilaiKaiwa,
  createNilaiKaiwa,
  updateNilaiKaiwa,
  deleteNilaiKaiwa,
  getKaiwaMingguan,
  listNilaiSikap,
  createNilaiSikap,
  updateNilaiSikap,
  deleteNilaiSikap,
  getAbsensiBelumDiisi,
  getAbsensiPageData,
  submitAbsensiWizard,
  listAuditLogs,
} from './db/repository.js';
import {
  getProgresData,
  updatePesertaPenempatan,
  getSystemSettings,
  updateSystemSettings,
  resetSystemSettings,
  getDashboardChartsData,
  exportAkademikData,
  getReportOptions,
} from './db/fase3Repo.js';
import {
  getVapidPublicKey,
  getPushSubscriptionStatus,
  savePushSubscriptionRecord,
  removePushSubscriptionRecord,
  kirimPush,
  listPushLogs,
  runPengingatAbsensiCron,
} from './db/fase4Repo.js';
import {
  getSmartReportPeserta,
  getSmartReportKelas,
  generateSmartResume,
  updateSmartResume,
  getPortalReport,
  getPortalSmartReport,
  getPortalRapor,
  getRaporPeserta,
} from './db/smartReportRepo.js';
import {
  authenticatePeserta,
  changePesertaPassword,
  getPortalAccountStatus,
  resetPesertaPortalPassword,
  setPesertaPortalAktif,
} from './db/portalRepo.js';
import { signPortalToken, requirePeserta } from './middleware/portalAuth.js';
import { createPushNotificationPayload } from './domain/rules.js';

import { JAPAN_PREFECTURES } from './db/prefectures.js';
import {
  signTokens,
  verifyRefreshToken,
  requireAuth,
  requirePageAccess,
  requireAdminRole,
  requireRoleKodes,
} from './middleware/auth.js';

function handleRouteError(res, err) {
  const code = err?.message || 'INTERNAL_ERROR';
  const clientCodes = new Set([
    'VALIDATION_ERROR',
    'DUPLICATE_USERNAME',
    'DUPLICATE_ROLE_KODE',
    'DUPLICATE_MANCATION_CLASS_ID',
    'CANNOT_DELETE_SELF',
    'CANNOT_DEACTIVATE_SELF',
    'INVALID_OLD_PASSWORD',
    'SYSTEM_ROLE_PROTECTED',
    'ROLE_IN_USE',
    'ADMIN_LOCKOUT_PREVENTED',
    'INVALID_AKUN_ID',
    'INVALID_KETERANGAN_LUAR',
    'ALREADY_IN_ROSTER',
    'ALREADY_EXISTS_MANUAL',
    'MANCATION_ACCOUNT_NOT_FOUND',
    'INVALID_CLIENT_ID',
    'INVALID_POLA_UJIAN',
    'INVALID_UJIAN_SCORE',
    'EMPTY_VARIABLE_SCORES',
    'DUPLICATE_NILAI_UJIAN',
    'INVALID_KAIWA_GRADE',
    'KAIWA_SENSEI_REQUIRED',
    'INVALID_KAIWA_SENSEI',
    'INVALID_KAIWA_TARGET',
    'INVALID_SIKAP_BOBOT',
    'EMPTY_ABSENSI_ENTRIES',
    'INVALID_KKM_UJIAN',
    'INVALID_KKM_SIKAP',
    'INVALID_SIKAP_BASIS',
    'INVALID_AMBANG_KEHADIRAN',
    'INVALID_BATAS_GRADE',
    'INVALID_ENDPOINT',
    'MISSING_KEYS',
    'INVALID_KEYS',
    'INVALID_PAYLOAD',
    'SMART_REPORT_NO_DATA',
    'PORTAL_PASSWORD_TOO_SHORT',
    'PORTAL_PASSWORD_SAME',
    'PORTAL_NO_BIRTH_DATE',
  ]);
  // The AI service (Gemini / OpenRouter) is missing, refused or failed: not the client's fault, worth retrying later.
  const serviceCodes = new Set(['AI_NOT_CONFIGURED', 'AI_ACCESS_DENIED', 'AI_RATE_LIMITED', 'AI_OVERLOADED', 'AI_FAILED']);
  if (code === 'NOT_FOUND') {
    return res.status(404).json({ error: code });
  }
  if (serviceCodes.has(code)) {
    return res.status(503).json({ error: code });
  }
  if (clientCodes.has(code)) {
    return res.status(400).json({ error: code });
  }
  console.error('API Error:', err);
  return res.status(500).json({ error: 'SERVER_ERROR' });
}

export function createApiRouter() {
  const router = express.Router();
  router.use(express.json({ limit: '1mb' }));

  // Health & Public Reference
  router.get('/health', (_req, res) => {
    res.json({ ok: true, app: 'JOYdata' });
  });

  router.get('/prefectures', requireAuth, (_req, res) => {
    res.json({ items: JAPAN_PREFECTURES });
  });

  // Auth Endpoints
  router.post('/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body || {};
      const profile = await authenticateStaff(username, password);
      if (!profile) {
        return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
      }
      if (profile.inactive) {
        return res.status(403).json({ error: 'ACCOUNT_INACTIVE' });
      }
      const tokens = signTokens(profile);
      return res.json({
        ...tokens,
        user: profile,
      });
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/auth/refresh', async (req, res) => {
    try {
      const { refreshToken } = req.body || {};
      if (!refreshToken) return res.status(401).json({ error: 'MISSING_REFRESH_TOKEN' });
      const decoded = verifyRefreshToken(refreshToken);
      const profile = await getStaffSessionById(decoded.sub);
      if (!profile) return res.status(401).json({ error: 'SESSION_INVALID' });
      const tokens = signTokens(profile);
      return res.json({ ...tokens, user: profile });
    } catch {
      return res.status(401).json({ error: 'INVALID_REFRESH_TOKEN' });
    }
  });

  router.get('/auth/me', requireAuth, (req, res) => {
    res.json({ user: req.user });
  });

  // Akun & Ganti Sandi Sendiri
  router.patch('/staff/me/password', requireAuth, async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body || {};
      const result = await changeOwnPassword(req.user.id, oldPassword, newPassword);
      return res.json(result);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Portal Peserta: login email Mancation, data milik sendiri saja (token & secret terpisah dari staf)
  router.post('/portal/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body || {};
      const session = await authenticatePeserta(email, password);
      return res.json({ token: signPortalToken(session), peserta: session });
    } catch (err) {
      if (err.message === 'INVALID_CREDENTIALS') return res.status(401).json({ error: err.message });
      if (err.message === 'PORTAL_ACCOUNT_LOCKED') return res.status(423).json({ error: err.message });
      if (err.message === 'PORTAL_DISABLED') return res.status(403).json({ error: err.message });
      return handleRouteError(res, err);
    }
  });

  router.get('/portal/auth/me', requirePeserta({ allowPasswordChange: true }), (req, res) => {
    res.json({ peserta: req.peserta });
  });

  router.post('/portal/auth/password', requirePeserta({ allowPasswordChange: true }), async (req, res) => {
    try {
      const session = await changePesertaPassword(req.peserta.id, req.body?.oldPassword, req.body?.newPassword);
      // Changing the password raises versi_token, so the old token is replaced right away.
      return res.json({ token: signPortalToken(session), peserta: session });
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.get('/portal/dashboard', requirePeserta(), async (req, res) => {
    try {
      return res.json(await getPortalReport(req.peserta.id));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.get('/portal/rapor', requirePeserta(), async (req, res) => {
    try {
      return res.json(await getPortalRapor(req.peserta.id, req.query.periode));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.get('/portal/smart-report', requirePeserta(), async (req, res) => {
    try {
      return res.json(await getPortalSmartReport(req.peserta.id));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Overview / Dashboard Fase 1
  router.get('/overview', requireAuth, requirePageAccess('dashboard'), async (_req, res) => {
    try {
      const data = await getOverviewData();
      return res.json(data);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Mancation Live Sync Trigger
  router.post('/mancation/sync', requireAuth, async (_req, res) => {
    try {
      const syncResult = await syncMancationAndReconcile({ force: true });
      return res.json({
        source: syncResult.source,
        configured: syncResult.configured,
        syncedAt: syncResult.syncedAt,
        errorMessage: syncResult.errorMessage,
        totalStudents: syncResult.students.length,
      });
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Data Kelas + Referensi Dropdown (Program & Sensei)
  router.get('/kelas', requireAuth, requirePageAccess('data-kelas'), async (_req, res) => {
    try {
      const [kelasData, programs, staffList] = await Promise.all([
        listKelas(),
        listPrograms(),
        listStaff(),
      ]);
      return res.json({
        ...kelasData,
        programs: programs.filter((p) => p.aktif),
        senseiOptions: staffList.filter((s) => s.active),
      });
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/kelas', requireAuth, requirePageAccess('data-kelas'), async (req, res) => {
    try {
      const created = await createKelas(req.body || {}, req.user);
      return res.status(201).json(created);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.patch('/kelas/:id', requireAuth, requirePageAccess('data-kelas'), async (req, res) => {
    try {
      const updated = await updateKelas(req.params.id, req.body || {}, req.user);
      return res.json(updated);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.delete('/kelas/:id', requireAuth, requirePageAccess('data-kelas'), async (req, res) => {
    try {
      const result = await softDeleteKelas(req.params.id, req.user);
      return res.json(result);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Data Peserta (Roster Cabang JOY)
  router.get('/peserta', requireAuth, requirePageAccess('data-peserta'), async (req, res) => {
    try {
      const [pesertaData, kelasData] = await Promise.all([
        listPeserta({
          sumber: 'roster',
          kelasId: req.query.kelasId || null,
          statusTag: req.query.statusTag || null,
          search: req.query.search || '',
        }),
        listKelas(),
      ]);
      return res.json({
        ...pesertaData,
        kelasOptions: kelasData.items,
      });
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.get('/peserta/:id', requireAuth, async (req, res) => {
    try {
      const allowed = (req.user?.allowedPages || []).map((p) => p.kode);
      if (!allowed.includes('data-peserta') && !allowed.includes('peserta-luar') && !allowed.includes('progres-peserta')) {
        return res.status(403).json({ error: 'FORBIDDEN_PAGE_ACCESS' });
      }
      const detail = await getPesertaDetail(req.params.id);
      return res.json(detail);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.patch('/peserta/:id', requireAuth, async (req, res) => {
    try {
      const allowed = (req.user?.allowedPages || []).map((p) => p.kode);
      if (!allowed.includes('data-peserta') && !allowed.includes('peserta-luar')) {
        return res.status(403).json({ error: 'FORBIDDEN_PAGE_ACCESS' });
      }
      const updated = await updatePesertaSupplementAndPenempatan(req.params.id, req.body || {}, req.user);
      return res.json(updated);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Akun portal peserta (login email Mancation): status, reset sandi ke tanggal lahir, aktif/nonaktif.
  const requirePortalManager = requirePageAccess('data-peserta', 'peserta-luar');
  router.get('/peserta/:id/portal', requireAuth, requirePortalManager, async (req, res) => {
    try {
      return res.json(await getPortalAccountStatus(req.params.id));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/peserta/:id/portal/reset', requireAuth, requirePortalManager, async (req, res) => {
    try {
      return res.json(await resetPesertaPortalPassword(req.params.id, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.patch('/peserta/:id/portal', requireAuth, requirePortalManager, async (req, res) => {
    try {
      return res.json(await setPesertaPortalAktif(req.params.id, req.body?.aktif, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Guard khusus §7 & §12.2 mainIdea.md: HANYA role admin boleh mengubah statusTag!
  router.patch('/peserta/:id/tag', requireAuth, requireAdminRole, async (req, res) => {
    try {
      const updated = await changePesertaStatusTag(req.params.id, req.body || {}, req.user);
      return res.json(updated);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Peserta Luar Kelas (Alumni / Cuti / Keluar — Manual by mancationAkunId)
  router.get('/peserta-luar', requireAuth, requirePageAccess('peserta-luar'), async (req, res) => {
    try {
      const data = await listPeserta({
        sumber: 'manual',
        keteranganLuar: req.query.keterangan || null,
        statusTag: req.query.statusTag || null,
        search: req.query.search || '',
      });
      return res.json(data);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.get('/peserta-luar/lookup/:akunId', requireAuth, requirePageAccess('peserta-luar'), async (req, res) => {
    try {
      const info = await lookupOutsideAccount(req.params.akunId);
      return res.json(info);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/peserta-luar', requireAuth, requirePageAccess('peserta-luar'), async (req, res) => {
    try {
      const created = await createPesertaLuarKelas(req.body || {}, req.user);
      return res.status(201).json(created);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.delete('/peserta-luar/:id', requireAuth, requirePageAccess('peserta-luar'), async (req, res) => {
    try {
      const result = await deletePesertaLuarKelas(req.params.id, req.user);
      return res.json(result);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Crud Staff
  router.get('/staff', requireAuth, requirePageAccess('crud-staff'), async (_req, res) => {
    try {
      const [items, accessData] = await Promise.all([listStaff(), getRoleAccessData()]);
      return res.json({ items, roles: accessData.roles });
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/staff', requireAuth, requirePageAccess('crud-staff'), async (req, res) => {
    try {
      const created = await createStaff(req.body || {}, req.user);
      return res.status(201).json(created);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.patch('/staff/:id', requireAuth, requirePageAccess('crud-staff'), async (req, res) => {
    try {
      const updated = await updateStaff(req.params.id, req.body || {}, req.user);
      return res.json(updated);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.patch('/staff/:id/reset-password', requireAuth, requirePageAccess('crud-staff'), async (req, res) => {
    try {
      const result = await resetStaffPassword(req.params.id, req.body?.newPassword, req.user);
      return res.json(result);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.delete('/staff/:id', requireAuth, requirePageAccess('crud-staff'), async (req, res) => {
    try {
      const result = await softDeleteStaff(req.params.id, req.user);
      return res.json(result);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Master Program
  router.get('/program', requireAuth, requirePageAccess('program'), async (_req, res) => {
    try {
      return res.json({ items: await listPrograms() });
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/program', requireAuth, requirePageAccess('program'), async (req, res) => {
    try {
      return res.status(201).json(await createProgram(req.body || {}, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.patch('/program/:id', requireAuth, requirePageAccess('program'), async (req, res) => {
    try {
      return res.json(await updateProgram(req.params.id, req.body || {}, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.delete('/program/:id', requireAuth, requirePageAccess('program'), async (req, res) => {
    try {
      return res.json(await deleteProgram(req.params.id, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Master Kategori Sikap
  router.get('/kategori-sikap', requireAuth, requirePageAccess('kategori-sikap'), async (_req, res) => {
    try {
      return res.json({ items: await listSikapKategori() });
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/kategori-sikap', requireAuth, requirePageAccess('kategori-sikap'), async (req, res) => {
    try {
      return res.status(201).json(await createSikapKategori(req.body || {}, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.patch('/kategori-sikap/:id', requireAuth, requirePageAccess('kategori-sikap'), async (req, res) => {
    try {
      return res.json(await updateSikapKategori(req.params.id, req.body || {}, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.delete('/kategori-sikap/:id', requireAuth, requirePageAccess('kategori-sikap'), async (req, res) => {
    try {
      return res.json(await deleteSikapKategori(req.params.id, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Role & Akses Matrix
  router.get('/akses', requireAuth, requirePageAccess('role-akses'), async (_req, res) => {
    try {
      return res.json(await getRoleAccessData());
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/akses/roles', requireAuth, requirePageAccess('role-akses'), async (req, res) => {
    try {
      return res.status(201).json(await createRole(req.body || {}, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.patch('/akses/roles/:id', requireAuth, requirePageAccess('role-akses'), async (req, res) => {
    try {
      return res.json(await updateRole(req.params.id, req.body || {}, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.delete('/akses/roles/:id', requireAuth, requirePageAccess('role-akses'), async (req, res) => {
    try {
      return res.json(await deleteRole(req.params.id, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.put('/akses/matrix/:roleId', requireAuth, requirePageAccess('role-akses'), async (req, res) => {
    try {
      const pageKodes = await setRoleAccessMatrix(req.params.roleId, req.body?.pageKodes || [], req.user);
      return res.json({ roleId: Number(req.params.roleId), pageKodes });
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // =========================================================================
  // FASE 2: REKAP NILAI UJIAN, KAIWA, SIKAP, WIZARD ABSENSI, & AUDIT LOG
  // =========================================================================
  router.get('/nilai-ujian', requireAuth, requirePageAccess('rekap-nilai-ujian'), async (req, res) => {
    try {
      const data = await listNilaiUjian({
        periode: req.query.periode,
        kelasId: req.query.kelasId,
        search: req.query.search,
      });
      return res.json(data);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/nilai-ujian', requireAuth, requirePageAccess('rekap-nilai-ujian'), async (req, res) => {
    try {
      return res.status(201).json(await upsertNilaiUjian(req.body || {}, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.patch('/nilai-ujian/:id', requireAuth, requirePageAccess('rekap-nilai-ujian'), async (req, res) => {
    try {
      return res.json(await updateNilaiUjian(req.params.id, req.body || {}, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.delete('/nilai-ujian/:id', requireAuth, requirePageAccess('rekap-nilai-ujian'), async (req, res) => {
    try {
      return res.json(await deleteNilaiUjian(req.params.id, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Rekap Nilai Kaiwa (A/B/C, tanpa codeKaiwa, 3 metrik terpisah §13)
  router.get('/kaiwa', requireAuth, requirePageAccess('rekap-nilai-kaiwa'), async (req, res) => {
    try {
      const data = await listNilaiKaiwa({
        periode: req.query.periode,
        kelasId: req.query.kelasId,
        grade: req.query.grade,
        search: req.query.search,
      });
      return res.json(data);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Kaiwa Card: target sesi per minggu (Senin–Minggu) dan sensei wajib, per peserta
  router.get('/kaiwa/mingguan', requireAuth, requirePageAccess('kaiwa-mingguan'), async (req, res) => {
    try {
      return res.json(await getKaiwaMingguan({ minggu: req.query.minggu, kelasId: req.query.kelasId }));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/kaiwa', requireAuth, requirePageAccess('rekap-nilai-kaiwa'), async (req, res) => {
    try {
      return res.status(201).json(await createNilaiKaiwa(req.body || {}, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.patch('/kaiwa/:id', requireAuth, requirePageAccess('rekap-nilai-kaiwa'), async (req, res) => {
    try {
      return res.json(await updateNilaiKaiwa(req.params.id, req.body || {}, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.delete('/kaiwa/:id', requireAuth, requirePageAccess('rekap-nilai-kaiwa'), async (req, res) => {
    try {
      return res.json(await deleteNilaiKaiwa(req.params.id, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Rekap Nilai Sikap (Basis 75, Clamp 0-100, KKM 70 §4)
  router.get('/nilai-sikap', requireAuth, requirePageAccess('rekap-nilai-sikap'), async (req, res) => {
    try {
      const data = await listNilaiSikap({
        periode: req.query.periode,
        kelasId: req.query.kelasId,
        sentiment: req.query.sentiment,
        search: req.query.search,
      });
      return res.json(data);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/nilai-sikap', requireAuth, requirePageAccess('rekap-nilai-sikap'), async (req, res) => {
    try {
      return res.status(201).json(await createNilaiSikap(req.body || {}, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.patch('/nilai-sikap/:id', requireAuth, requirePageAccess('rekap-nilai-sikap'), async (req, res) => {
    try {
      return res.json(await updateNilaiSikap(req.params.id, req.body || {}, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.delete('/nilai-sikap/:id', requireAuth, requirePageAccess('rekap-nilai-sikap'), async (req, res) => {
    try {
      return res.json(await deleteNilaiSikap(req.params.id, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Rekap Absensi, Pengingat Belum Diisi, & Wizard Harian (§5 & §14.5)
  router.get('/absensi/belum-diisi', requireAuth, async (req, res) => {
    try {
      return res.json(await getAbsensiBelumDiisi(req.query.tanggal));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.get('/absensi', requireAuth, requirePageAccess('rekap-absensi'), async (req, res) => {
    try {
      const data = await getAbsensiPageData({
        periode: req.query.periode,
        kelasId: req.query.kelasId,
        tanggalWizard: req.query.tanggal,
      });
      return res.json(data);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/absensi/wizard', requireAuth, requirePageAccess('rekap-absensi'), async (req, res) => {
    try {
      return res.json(await submitAbsensiWizard(req.body || {}, req.user));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Riwayat Aktivitas / Audit Log (§14.5)
  router.get('/audit-log', requireAuth, requirePageAccess('riwayat-aktivitas'), async (req, res) => {
    try {
      const data = await listAuditLogs({
        periode: req.query.periode,
        entitas: req.query.entitas,
        search: req.query.search,
        limit: req.query.limit,
      });
      return res.json(data);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });


  // Fase 3 Endpoints: Progres Peserta (§12 mainIdea.md)
  router.get('/progres', requireAuth, requirePageAccess('progres-peserta'), async (req, res) => {
    try {
      const data = await getProgresData({
        periode: req.query.periode,
        kelasId: req.query.kelasId,
        tag: req.query.tag,
      });
      return res.json(data);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Class & peserta pickers shared by the report pages, so a role with only report access can still choose
  router.get(
    '/laporan/opsi',
    requireAuth,
    requirePageAccess('progres-peserta', 'rapor-peserta', 'smart-report'),
    async (_req, res) => {
      try {
        return res.json(await getReportOptions());
      } catch (err) {
        return handleRouteError(res, err);
      }
    }
  );

  // Fase 3 Endpoints: Rapor Peserta (§14.2 mainIdea.md)
  router.get('/rapor/:pesertaId', requireAuth, requirePageAccess('rapor-peserta'), async (req, res) => {
    try {
      const data = await getRaporPeserta({
        pesertaId: req.params.pesertaId,
        periode: req.query.periode,
      });
      return res.json(data);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Smart Report: full-journey bundle per peserta or per class, with an AI resume (Gemini).
  // Everyone with page access can read and print; only admin and manager write resumes (each call is billed).
  router.get('/smart-report/peserta/:id', requireAuth, requirePageAccess('smart-report'), async (req, res) => {
    try {
      return res.json(await getSmartReportPeserta({ pesertaId: req.params.id }));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.get('/smart-report/kelas/:id', requireAuth, requirePageAccess('smart-report'), async (req, res) => {
    try {
      return res.json(await getSmartReportKelas({ kelasId: req.params.id }));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post(
    '/smart-report/resume/:scope/:id',
    requireAuth,
    requirePageAccess('smart-report'),
    requireRoleKodes('admin', 'manager'),
    async (req, res) => {
      try {
        return res.json(await generateSmartResume({ scope: req.params.scope, id: req.params.id, actor: req.user }));
      } catch (err) {
        return handleRouteError(res, err);
      }
    }
  );

  router.put(
    '/smart-report/resume/:scope/:id',
    requireAuth,
    requirePageAccess('smart-report'),
    requireRoleKodes('admin', 'manager'),
    async (req, res) => {
      try {
        return res.json(
          await updateSmartResume({
            scope: req.params.scope,
            id: req.params.id,
            teksId: req.body?.teksId,
            teksJa: req.body?.teksJa,
            actor: req.user,
          })
        );
      } catch (err) {
        return handleRouteError(res, err);
      }
    }
  );

  // Fase 3 Endpoints: Update Data Penempatan 名簿 (§15 mainIdea.md)
  router.put('/peserta/:id/penempatan', requireAuth, async (req, res) => {
    try {
      const updated = await updatePesertaPenempatan(req.params.id, req.body || {}, req.user);
      return res.json(updated);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Fase 3 Endpoints: Pengaturan Sistem Global (§14.4 mainIdea.md)
  router.get('/settings', requireAuth, async (_req, res) => {
    try {
      return res.json(await getSystemSettings());
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.patch('/settings', requireAuth, requireAdminRole, async (req, res) => {
    try {
      const updated = await updateSystemSettings(req.body || {}, req.user);
      return res.json(updated);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/settings/reset', requireAuth, requireAdminRole, async (req, res) => {
    try {
      const reset = await resetSystemSettings(req.user);
      return res.json(reset);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Fase 3 Endpoints: Dashboard Enriched Charts Data (§11 mainIdea.md)
  router.get('/dashboard/charts', requireAuth, requirePageAccess('dashboard'), async (req, res) => {
    try {
      const charts = await getDashboardChartsData({ periode: req.query.periode });
      return res.json(charts);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Fase 3 Endpoints: Ekspor CSV/Data Akademik (§14.2 & §16 mainIdea.md)
  router.get('/export/rekap', requireAuth, async (req, res) => {
    try {
      const result = await exportAkademikData({
        tipe: req.query.tipe,
        periode: req.query.periode,
        kelasId: req.query.kelasId,
        locale: req.query.locale,
      });
      res.setHeader('Content-Type', result.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      return res.send(result.content);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Fase 4 Endpoints: Web Push Notification & VAPID (§14.8 mainIdea.md)
  router.get('/push/public-key', async (_req, res) => {
    try {
      return res.json({ publicKey: await getVapidPublicKey() });
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.get('/push/status', requireAuth, async (req, res) => {
    try {
      return res.json(await getPushSubscriptionStatus(req.user.id));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/push/subscribe', requireAuth, async (req, res) => {
    try {
      const result = await savePushSubscriptionRecord(req.user.id, req.body || {});
      return res.json(result);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.delete('/push/subscribe', requireAuth, async (req, res) => {
    try {
      const endpoint = req.body?.endpoint || req.query?.endpoint || null;
      const result = await removePushSubscriptionRecord(req.user.id, endpoint);
      return res.json(result);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/push/test', requireAuth, async (req, res) => {
    try {
      const payload = createPushNotificationPayload({
        jenis: 'uji_coba_push',
        titleId: 'Uji Coba Notifikasi JOYdata',
        titleJa: 'JOYdata テスト通知',
        bodyId: `Halo ${req.user.nama}! Notifikasi Web Push untuk perangkat Anda berhasil dihubungkan.`,
        bodyJa: `${req.user.nama}さん、Web Push通知の接続テストが正常に完了しました。`,
        deepLink: '/dashboard',
        metadata: { staffId: req.user.id, test: true },
      });

      const pushResult = await kirimPush({
        jenis: 'uji_coba_push',
        tanggal: new Date().toISOString().slice(0, 10),
        staffIds: [req.user.id],
        payload,
        force: true, // Allow test push multiple times
      });

      return res.json({ ok: true, result: pushResult, payload });
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.get('/push/logs', requireAuth, async (_req, res) => {
    try {
      return res.json(await listPushLogs(50));
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  // Fase 4 Endpoints: Vercel Cron Trigger Pengingat Absensi (§14.8 & §13 techStack.md)
  // Guarded by CRON_SECRET or requireAuth
  const cronGuard = (req, res, next) => {
    const secret = process.env.CRON_SECRET;
    const authHeader = req.headers.authorization;
    const bearerSecret = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const querySecret = req.query?.secret || req.headers['x-cron-secret'];

    if (secret && (bearerSecret === secret || querySecret === secret)) {
      return next();
    }
    // If running in development without CRON_SECRET or authenticated staff
    if (!secret) {
      return next();
    }
    // Fallback to staff authentication
    return requireAuth(req, res, next);
  };

  router.get('/cron/pengingat-absensi', cronGuard, async (req, res) => {
    try {
      const date = req.query.tanggal || null;
      const report = await runPengingatAbsensiCron(date, req.query.slot);
      return res.json(report);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  router.post('/cron/trigger-pengingat', requireAuth, async (req, res) => {
    try {
      const date = req.body?.tanggal || null;
      const report = await runPengingatAbsensiCron(date, 'manual');
      return res.json(report);
    } catch (err) {
      return handleRouteError(res, err);
    }
  });

  return router;
}
