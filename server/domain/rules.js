/**
 * Pure domain rules for JOYdata (Cabang JOY — LPK Mizuno Semangat Bangsa).
 * Decoupled from Express, PostgreSQL, and MySQL so every invariant is unit-testable.
 */

export const VALID_STATUS_TAGS = ['standar', 'berkembang', 'siap_interview'];
export const VALID_KETERANGAN_LUAR = ['keluar', 'alumni', 'cuti'];
export const PROTECTED_ADMIN_PAGES = ['role-akses', 'crud-staff'];

/**
 * Checks whether a staff role's allowed page list grants access to a given page code.
 */
export function canAccessPage(allowedPageKodes, pageKode) {
  if (!Array.isArray(allowedPageKodes) || !pageKode) return false;
  return allowedPageKodes.includes(pageKode);
}

/**
 * Only staff with role kode === 'admin' can change peserta.statusTag (§7 mainIdea.md).
 */
export function canChangeStatusTag(roleKode) {
  return roleKode === 'admin';
}

/**
 * Validates updates to Role & Access matrix so admin never loses access to Role & Akses or Crud Staff.
 */
export function validateAccessMatrixUpdate({ isAdminRole, selectedPageKodes, allValidPageKodes }) {
  if (!Array.isArray(selectedPageKodes)) {
    return { ok: false, code: 'INVALID_PAGES' };
  }
  const validSet = new Set(allValidPageKodes);
  const filtered = [...new Set(selectedPageKodes)].filter((k) => validSet.has(k));

  if (isAdminRole) {
    for (const reqKode of PROTECTED_ADMIN_PAGES) {
      if (!filtered.includes(reqKode)) {
        return {
          ok: false,
          code: 'ADMIN_LOCKOUT_PREVENTED',
          missingPage: reqKode,
        };
      }
    }
  }

  return { ok: true, pageKodes: filtered };
}

/**
 * Reconciles live/cached mancation roster with local peserta rows (§14.1 mainIdea.md):
 * - Matches 1-to-1 by mancationAkunId.
 * - Automatically promotes 'manual' (Peserta Luar Kelas) -> 'roster' if the student now has a JOY class!
 * - Preserves manual JOYdata fields (statusTag, tanggalMasuk, pendidikanAkhir, catatanBebas).
 */
export function reconcileRosterWithLocalPeserta(mancationStudents, existingPesertaList, kelasByMancationId) {
  const existingByAkun = new Map(
    existingPesertaList.map((p) => [Number(p.mancationAkunId), p])
  );

  const toInsert = [];
  const toUpdate = [];

  for (const mStudent of mancationStudents) {
    const akunId = Number(mStudent.mancationAkunId);
    const localKelas = kelasByMancationId.get(Number(mStudent.mancationClassId));
    if (!localKelas || localKelas.deletedAt) continue;

    const existing = existingByAkun.get(akunId);
    if (!existing) {
      toInsert.push({
        mancationAkunId: akunId,
        kelasId: localKelas.id,
        statusTag: 'standar',
        sumber: 'roster',
        keteranganLuarKelas: null,
        alasan: '',
      });
    } else if (
      existing.sumber === 'manual' ||
      existing.kelasId !== localKelas.id ||
      existing.keteranganLuarKelas !== null
    ) {
      toUpdate.push({
        id: existing.id,
        mancationAkunId: akunId,
        kelasId: localKelas.id,
        sumber: 'roster',
        keteranganLuarKelas: null,
        promotedFromManual: existing.sumber === 'manual',
      });
    }
  }

  return { toInsert, toUpdate };
}

/**
 * Validates manual input for Peserta Luar Kelas (§14.2 mainIdea.md).
 */
export function validateManualPesertaInput(input, existingPesertaList, mancationAccount) {
  const akunId = Number(input?.mancationAkunId);
  if (!Number.isInteger(akunId) || akunId <= 0) {
    return { ok: false, code: 'INVALID_AKUN_ID' };
  }

  if (!VALID_KETERANGAN_LUAR.includes(input?.keteranganLuarKelas)) {
    return { ok: false, code: 'INVALID_KETERANGAN_LUAR' };
  }

  const duplicate = existingPesertaList.find((p) => Number(p.mancationAkunId) === akunId);
  if (duplicate) {
    return {
      ok: false,
      code: duplicate.sumber === 'roster' ? 'ALREADY_IN_ROSTER' : 'ALREADY_EXISTS_MANUAL',
    };
  }

  if (!mancationAccount) {
    return { ok: false, code: 'MANCATION_ACCOUNT_NOT_FOUND' };
  }

  if (Number(mancationAccount.cliId ?? 9) !== 9) {
    return { ok: false, code: 'INVALID_CLIENT_ID' };
  }

  return {
    ok: true,
    normalized: {
      mancationAkunId: akunId,
      kelasId: null,
      statusTag: VALID_STATUS_TAGS.includes(input.statusTag) ? input.statusTag : 'standar',
      sumber: 'manual',
      keteranganLuarKelas: input.keteranganLuarKelas,
      alasan: String(input.alasan || '').trim(),
      pendidikanAkhir: String(input.pendidikanAkhir || '').trim(),
      tanggalMasuk: input.tanggalMasuk || null,
      catatanBebas: String(input.catatanBebas || '').trim(),
    },
  };
}

export const VALID_POLA_UJIAN = ['tunggal', 'variable'];
export const VALID_KAIWA_GRADES = ['A', 'B', 'C'];
export const VALID_ABSENSI_STATUS = ['hadir', 'sakit', 'izin', 'alfa'];

export function getGradeLabel(score, batas = { A: 90, B: 75, C: 60 }) {
  if (score === null || score === undefined || Number.isNaN(Number(score))) return '-';
  const n = Number(score);
  if (n >= (batas.A ?? 90)) return 'A';
  if (n >= (batas.B ?? 75)) return 'B';
  if (n >= (batas.C ?? 60)) return 'C';
  return 'D';
}

/**
 * Pure calculation for Nilai Sikap (§4 mainIdea.md):
 * Basis 75, positive magnitude bobot, clamped to [0, 100].
 */
export function computeSikapScore(events, basis = 75) {
  if (!Array.isArray(events) || events.length === 0) return basis;
  let total = basis;
  for (const ev of events) {
    const magnitude = Math.abs(Number(ev.bobot) || 0);
    if (ev.sentiment === 'positif') total += magnitude;
    else if (ev.sentiment === 'negatif') total -= magnitude;
  }
  return Math.max(0, Math.min(100, Math.round(total * 100) / 100));
}

export function computeSikapSummary(events, basis = 75, kkm = 70) {
  let poinPositif = 0;
  let poinNegatif = 0;
  let jumlahPositif = 0;
  let jumlahNegatif = 0;

  if (Array.isArray(events)) {
    for (const ev of events) {
      const mag = Math.abs(Number(ev.bobot) || 0);
      if (ev.sentiment === 'positif') {
        poinPositif += mag;
        jumlahPositif += 1;
      } else if (ev.sentiment === 'negatif') {
        poinNegatif += mag;
        jumlahNegatif += 1;
      }
    }
  }

  const skorAkhir = Math.max(0, Math.min(100, Math.round((basis + poinPositif - poinNegatif) * 100) / 100));
  return {
    basis,
    poinPositif: Math.round(poinPositif * 100) / 100,
    poinNegatif: Math.round(poinNegatif * 100) / 100,
    jumlahPositif,
    jumlahNegatif,
    skorAkhir,
    label: getGradeLabel(skorAkhir),
    lulusKkm: skorAkhir >= kkm,
  };
}

/**
 * Pure calculation for Nilai Ujian AVG (§2 & §3 mainIdea.md):
 * Computed dynamically over NOT NULL variables so optional blank variables never drag down average.
 */
export function computeNilaiUjianAvg(row) {
  if (!row) return null;
  const pola = row.pola || row.tipePenilaian;
  if (pola === 'tunggal') {
    return row.nilaiTunggal != null && row.nilaiTunggal !== '' ? Number(row.nilaiTunggal) : null;
  }
  const parts = [
    row.nilaiMojiGoi ?? row.mojiGoi,
    row.nilaiBunpou ?? row.bunpou,
    row.nilaiDokkai ?? row.dokkai,
    row.nilaiChoukai ?? row.choukai,
  ]
    .filter((v) => v !== null && v !== undefined && v !== '')
    .map(Number);
  if (parts.length === 0) return null;
  const sum = parts.reduce((acc, n) => acc + n, 0);
  return Math.round((sum / parts.length) * 100) / 100;
}

function parseOptionalScore(val) {
  if (val === null || val === undefined || String(val).trim() === '') return null;
  const num = Number(val);
  if (!Number.isFinite(num) || num < 0 || num > 100) return NaN;
  return Math.round(num * 100) / 100;
}

export function validateAndNormalizeNilaiUjian(input) {
  const pesertaId = Number(input?.pesertaId);
  const kelasId = Number(input?.kelasId);
  const tanggalUjian = String(input?.tanggalUjian || '').trim();
  const codeUjian = String(input?.codeUjian || '').trim();
  const pola = input?.pola || input?.tipePenilaian;
  const catatan = String(input?.catatan || '').trim();

  if (!Number.isInteger(pesertaId) || pesertaId <= 0 || !Number.isInteger(kelasId) || kelasId <= 0) {
    return { ok: false, code: 'VALIDATION_ERROR' };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggalUjian) || !codeUjian) {
    return { ok: false, code: 'VALIDATION_ERROR' };
  }
  if (!VALID_POLA_UJIAN.includes(pola)) {
    return { ok: false, code: 'INVALID_POLA_UJIAN' };
  }

  if (pola === 'tunggal') {
    const tunggal = parseOptionalScore(input.nilaiTunggal);
    if (tunggal === null || Number.isNaN(tunggal)) {
      return { ok: false, code: 'INVALID_UJIAN_SCORE' };
    }
    const normalized = {
      pesertaId,
      kelasId,
      tanggalUjian,
      codeUjian,
      pola: 'tunggal',
      nilaiTunggal: tunggal,
      nilaiMojiGoi: null,
      nilaiBunpou: null,
      nilaiDokkai: null,
      nilaiChoukai: null,
      catatan,
    };
    return {
      ok: true,
      normalized: { ...normalized, nilaiAvg: computeNilaiUjianAvg(normalized) },
    };
  }

  const mojiGoi = parseOptionalScore(input.nilaiMojiGoi ?? input.mojiGoi);
  const bunpou = parseOptionalScore(input.nilaiBunpou ?? input.bunpou);
  const dokkai = parseOptionalScore(input.nilaiDokkai ?? input.dokkai);
  const choukai = parseOptionalScore(input.nilaiChoukai ?? input.choukai);

  if ([mojiGoi, bunpou, dokkai, choukai].some((v) => Number.isNaN(v))) {
    return { ok: false, code: 'INVALID_UJIAN_SCORE' };
  }
  if ([mojiGoi, bunpou, dokkai, choukai].every((v) => v === null)) {
    return { ok: false, code: 'EMPTY_VARIABLE_SCORES' };
  }

  const normalized = {
    pesertaId,
    kelasId,
    tanggalUjian,
    codeUjian,
    pola: 'variable',
    nilaiTunggal: null,
    nilaiMojiGoi: mojiGoi,
    nilaiBunpou: bunpou,
    nilaiDokkai: dokkai,
    nilaiChoukai: choukai,
    catatan,
  };

  return {
    ok: true,
    normalized: { ...normalized, nilaiAvg: computeNilaiUjianAvg(normalized) },
  };
}

export function validateAndNormalizeNilaiKaiwa(input) {
  const pesertaId = Number(input?.pesertaId);
  const kelasId = Number(input?.kelasId);
  const tanggalKaiwa = String(input?.tanggalKaiwa || '').trim();
  const grade = String(input?.grade || '').trim().toUpperCase();
  const description = String(input?.description ?? input?.catatan ?? '').trim();

  if (!Number.isInteger(pesertaId) || pesertaId <= 0 || !Number.isInteger(kelasId) || kelasId <= 0) {
    return { ok: false, code: 'VALIDATION_ERROR' };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggalKaiwa)) {
    return { ok: false, code: 'VALIDATION_ERROR' };
  }
  if (!VALID_KAIWA_GRADES.includes(grade)) {
    return { ok: false, code: 'INVALID_KAIWA_GRADE' };
  }

  return {
    ok: true,
    normalized: {
      pesertaId,
      kelasId,
      tanggalKaiwa,
      grade,
      description,
    },
  };
}

/**
 * Computes the 3 distinct Kaiwa metrics (§13.1 mainIdea.md):
 * 1. Distribusi grade kelas: 1 peserta = 1 nilai (grade terakhir pada periode; tanpa sesi = 'belumAda', bukan C).
 * 2. Tren perkembangan: rata-rata poin ordinal (A=3, B=2, C=1) dari semua baris sesi.
 * 3. Aktivitas kaiwa: jumlah sesi penilaian pada periode.
 */
export function computeKaiwaMetricsForPeriod(rosterPesertaIds, kaiwaRows) {
  const rows = Array.isArray(kaiwaRows) ? kaiwaRows : [];
  const sorted = [...rows].sort((a, b) => {
    const da = String(a.tanggalKaiwa || '');
    const db = String(b.tanggalKaiwa || '');
    if (da !== db) return db.localeCompare(da);
    return Number(b.id || 0) - Number(a.id || 0);
  });

  const latestByPeserta = new Map();
  for (const r of sorted) {
    const pid = Number(r.pesertaId);
    if (!latestByPeserta.has(pid)) {
      latestByPeserta.set(pid, r);
    }
  }

  const distribusi = { A: 0, B: 0, C: 0, belumAda: 0 };
  for (const pidRaw of rosterPesertaIds || []) {
    const pid = Number(pidRaw);
    const latest = latestByPeserta.get(pid);
    if (!latest) {
      distribusi.belumAda += 1;
    } else if (latest.grade === 'A' || latest.grade === 'B' || latest.grade === 'C') {
      distribusi[latest.grade] += 1;
    } else {
      distribusi.belumAda += 1;
    }
  }

  let ordinalSum = 0;
  let ordinalCount = 0;
  for (const r of rows) {
    if (r.grade === 'A') {
      ordinalSum += 3;
      ordinalCount += 1;
    } else if (r.grade === 'B') {
      ordinalSum += 2;
      ordinalCount += 1;
    } else if (r.grade === 'C') {
      ordinalSum += 1;
      ordinalCount += 1;
    }
  }

  return {
    distribusi,
    latestByPeserta,
    rataPoinOrdinal: ordinalCount > 0 ? Math.round((ordinalSum / ordinalCount) * 100) / 100 : null,
    jumlahSesi: rows.length,
  };
}

export function validateAndNormalizeNilaiSikap(input) {
  const pesertaId = Number(input?.pesertaId);
  const kelasId = Number(input?.kelasId);
  const kategoriId = input?.kategoriId ? Number(input.kategoriId) : null;
  const tanggalPenilaian = String(input?.tanggalPenilaian || '').trim();
  const sentiment = input?.sentiment === 'negatif' ? 'negatif' : input?.sentiment === 'positif' ? 'positif' : '';
  const rawBobot = Number(input?.bobot);
  const description = String(input?.description ?? input?.keterangan ?? '').trim();

  if (!Number.isInteger(pesertaId) || pesertaId <= 0 || !Number.isInteger(kelasId) || kelasId <= 0) {
    return { ok: false, code: 'VALIDATION_ERROR' };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggalPenilaian) || !sentiment) {
    return { ok: false, code: 'VALIDATION_ERROR' };
  }
  const bobot = Math.abs(rawBobot);
  if (!Number.isFinite(bobot) || bobot <= 0 || bobot > 100) {
    return { ok: false, code: 'INVALID_SIKAP_BOBOT' };
  }

  return {
    ok: true,
    normalized: {
      pesertaId,
      kelasId,
      kategoriId,
      tanggalPenilaian,
      sentiment,
      bobot: Math.round(bobot * 100) / 100,
      description,
    },
  };
}

/**
 * Pure calculation for single-student Absensi ratio.
 */
export function computeAbsensiRasio(records) {
  if (!Array.isArray(records) || records.length === 0) {
    return { totalHariDiisi: 0, hadir: 0, sakit: 0, izin: 0, alfa: 0, rasioPersen: null };
  }
  let hadir = 0;
  let sakit = 0;
  let izin = 0;
  let alfa = 0;
  for (const r of records) {
    if (r.status === 'hadir') hadir += 1;
    else if (r.status === 'sakit') sakit += 1;
    else if (r.status === 'izin') izin += 1;
    else if (r.status === 'alfa') alfa += 1;
  }
  const total = hadir + sakit + izin + alfa;
  if (total === 0) {
    return { totalHariDiisi: 0, hadir: 0, sakit: 0, izin: 0, alfa: 0, rasioPersen: null };
  }
  return {
    totalHariDiisi: total,
    hadir,
    sakit,
    izin,
    alfa,
    rasioPersen: Math.round((hadir / total) * 10000) / 100,
  };
}

/**
 * Pure calculation for Class Monthly Absensi (§5 mainIdea.md & §12 #12 techStack.md):
 * - S = COUNT(DISTINCT tanggalAbsensi) for that class & month.
 * - If S === 0 -> ratios are null (displayed as '-').
 * - If S > 0 -> denominator is S for every roster student; student with 0 records gets 0% (NOT '-').
 * - Class ratio = sum(hadir_p) / (S * rosterCount).
 */
export function computeClassMonthlyAbsensi(rosterPesertaIds, absensiRows) {
  const rows = Array.isArray(absensiRows) ? absensiRows : [];
  const rosterIds = (rosterPesertaIds || []).map(Number);
  const rosterSet = new Set(rosterIds);

  const sessionDates = new Set();
  for (const r of rows) {
    if (r.tanggalAbsensi) sessionDates.add(String(r.tanggalAbsensi).slice(0, 10));
  }
  const S = sessionDates.size;

  const byPeserta = new Map();
  for (const pid of rosterIds) {
    byPeserta.set(pid, { hadir: 0, sakit: 0, izin: 0, alfa: 0 });
  }

  for (const r of rows) {
    const pid = Number(r.pesertaId);
    if (!byPeserta.has(pid)) {
      byPeserta.set(pid, { hadir: 0, sakit: 0, izin: 0, alfa: 0 });
    }
    const bucket = byPeserta.get(pid);
    if (r.status === 'hadir') bucket.hadir += 1;
    else if (r.status === 'sakit') bucket.sakit += 1;
    else if (r.status === 'izin') bucket.izin += 1;
    else if (r.status === 'alfa') bucket.alfa += 1;
  }

  let totalHadirRoster = 0;
  const studentStats = new Map();

  for (const [pid, counts] of byPeserta.entries()) {
    if (rosterSet.has(pid)) {
      totalHadirRoster += counts.hadir;
    }
    if (S === 0) {
      studentStats.set(pid, {
        ...counts,
        sesiKelas: 0,
        nonHadir: 0,
        rasioKehadiran: null,
        rasioKetidakhadiran: null,
      });
    } else {
      const nonHadir = Math.max(0, S - counts.hadir);
      const rasioHadir = Math.round((counts.hadir / S) * 1000) / 10;
      const rasioTidakHadir = Math.round((nonHadir / S) * 1000) / 10;
      studentStats.set(pid, {
        ...counts,
        sesiKelas: S,
        nonHadir,
        rasioKehadiran: rasioHadir,
        rasioKetidakhadiran: rasioTidakHadir,
      });
    }
  }

  const rasioKelas =
    S > 0 && rosterIds.length > 0
      ? Math.round((totalHadirRoster / (S * rosterIds.length)) * 1000) / 10
      : null;

  return {
    sesiKelas: S,
    tanggalTercatat: [...sessionDates].sort(),
    rasioKelas,
    studentStats,
  };
}



/**
 * Fase 3: Validates institutional global settings payload.
 */
export function validateSettingsPayload(input) {
  const kkmUjian = Number(input?.kkm_ujian ?? input?.kkmUjian);
  const kkmSikap = Number(input?.kkm_sikap ?? input?.kkmSikap);
  const sikapBasis = Number(input?.sikap_basis ?? input?.basisSikap);
  const ambangKehadiranRendah = Number(input?.ambang_kehadiran_rendah ?? input?.ambangKehadiranRendah ?? 75);

  if (!Number.isFinite(kkmUjian) || kkmUjian < 0 || kkmUjian > 100) {
    return { ok: false, code: 'INVALID_KKM_UJIAN' };
  }
  if (!Number.isFinite(kkmSikap) || kkmSikap < 0 || kkmSikap > 100) {
    return { ok: false, code: 'INVALID_KKM_SIKAP' };
  }
  if (!Number.isFinite(sikapBasis) || sikapBasis < 0 || sikapBasis > 100) {
    return { ok: false, code: 'INVALID_SIKAP_BASIS' };
  }
  if (!Number.isFinite(ambangKehadiranRendah) || ambangKehadiranRendah < 0 || ambangKehadiranRendah > 100) {
    return { ok: false, code: 'INVALID_AMBANG_KEHADIRAN' };
  }

  const batasGrade = input?.batas_grade || input?.batasGrade || {};
  const a = Number(batasGrade.A ?? 90);
  const b = Number(batasGrade.B ?? 75);
  const c = Number(batasGrade.C ?? 60);

  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c) || a <= b || b <= c || c < 0 || a > 100) {
    return { ok: false, code: 'INVALID_BATAS_GRADE' };
  }

  return {
    ok: true,
    normalized: {
      kkm_ujian: Math.round(kkmUjian * 10) / 10,
      kkm_sikap: Math.round(kkmSikap * 10) / 10,
      sikap_basis: Math.round(sikapBasis),
      ambang_kehadiran_rendah: Math.round(ambangKehadiranRendah * 10) / 10,
      batas_grade: { A: Math.round(a), B: Math.round(b), C: Math.round(c) },
      rentang_tren_bulan: Number(input?.rentang_tren_bulan ?? 12),
      periode_default: String(input?.periode_default || 'auto'),
    },
  };
}

/**
 * Fase 3: Computes student progress metrics across Ujian, Kaiwa, Sikap, and Absensi.
 */
export function computeProgresStudentMetrics({
  student,
  ujianRows = [],
  kaiwaRows = [],
  sikapSummary = { skorAkhir: 75, label: 'B', lulusKkm: true },
  absensiStats = { rasioKehadiran: null, hadir: 0, sesiKelas: 0 },
}) {
  const ujianAvgs = (ujianRows || [])
    .map((r) => (r.nilaiAvg !== null && r.nilaiAvg !== undefined ? Number(r.nilaiAvg) : null))
    .filter((v) => v !== null && Number.isFinite(v));

  const rataUjian =
    ujianAvgs.length > 0
      ? Math.round((ujianAvgs.reduce((acc, v) => acc + v, 0) / ujianAvgs.length) * 10) / 10
      : null;

  const predikatUjian = rataUjian !== null ? getGradeLabel(rataUjian) : null;
  const lulusKkmUjian = rataUjian !== null ? rataUjian >= 70 : null;

  // Kaiwa latest grade
  const sortedKaiwa = [...(kaiwaRows || [])].sort((a, b) => {
    const da = String(a.tanggalKaiwa || '');
    const db = String(b.tanggalKaiwa || '');
    if (da !== db) return db.localeCompare(da);
    return Number(b.id || 0) - Number(a.id || 0);
  });
  const gradeKaiwaTerakhir = sortedKaiwa.length > 0 ? sortedKaiwa[0].grade : null;

  return {
    pesertaId: Number(student?.id),
    mancationAkunId: Number(student?.mancationAkunId),
    nama: student?.nama || '',
    kelasId: student?.kelasId ? Number(student.kelasId) : null,
    statusTag: student?.statusTag || 'standar',
    isSiapInterview: student?.statusTag === 'siap_interview',
    ujianCount: ujianAvgs.length,
    rataUjian,
    predikatUjian,
    lulusKkmUjian,
    gradeKaiwaTerakhir,
    sesiKaiwaCount: sortedKaiwa.length,
    skorSikap: sikapSummary?.skorAkhir ?? 75,
    predikatSikap: sikapSummary?.label ?? 'B',
    lulusKkmSikap: sikapSummary?.lulusKkm ?? true,
    rasioKehadiran: absensiStats?.rasioKehadiran ?? null,
    hadirCount: absensiStats?.hadir ?? 0,
    sesiKelasCount: absensiStats?.sesiKelas ?? 0,
  };
}

/**
 * Fase 4: Validates Web Push subscription payload from browser PushManager.
 */
export function validatePushSubscription(payload) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, code: 'INVALID_PAYLOAD' };
  }
  const endpoint = String(payload.endpoint || '').trim();
  if (!endpoint || !endpoint.startsWith('https://')) {
    return { ok: false, code: 'INVALID_ENDPOINT' };
  }

  const keys = payload.keys;
  if (!keys || typeof keys !== 'object') {
    return { ok: false, code: 'MISSING_KEYS' };
  }
  const p256dh = String(keys.p256dh || '').trim();
  const auth = String(keys.auth || '').trim();

  if (!p256dh || !auth) {
    return { ok: false, code: 'INVALID_KEYS' };
  }

  return {
    ok: true,
    subscription: {
      endpoint,
      keys: { p256dh, auth },
      userAgent: String(payload.userAgent || '').slice(0, 255),
    },
  };
}

/**
 * Fase 4: Enforces UNIQUE(jenis, tanggal, staffId) deduplication for push notifications (§14.8 mainIdea.md).
 */
export function isPushDuplicate(pushLogs = [], { jenis, tanggal, staffId }) {
  if (!jenis || !tanggal || !staffId) return false;
  const targetStaffId = Number(staffId);
  return pushLogs.some(
    (log) =>
      log.jenis === jenis &&
      String(log.tanggal) === String(tanggal) &&
      Number(log.staffId) === targetStaffId
  );
}

/**
 * Fase 4: Formats bilingual Web Push notification payload.
 */
export function createPushNotificationPayload({ jenis, titleId, titleJa, bodyId, bodyJa, deepLink, metadata = {} }) {
  return {
    jenis,
    titles: {
      id: titleId || 'Pemberitahuan JOYdata',
      ja: titleJa || 'JOYdata 通知',
    },
    bodies: {
      id: bodyId || 'Ada pembaruan data akademik di JOYdata.',
      ja: bodyJa || 'JOYdataのアカデミックデータが更新されました。',
    },
    icon: '/joydata-icon-192.svg',
    badge: '/joydata-icon-192.svg',
    deepLink: deepLink || '/dashboard',
    timestamp: new Date().toISOString(),
    metadata,
  };
}

/**
 * Fase 4: Identifies active classes that have not yet recorded attendance for targetDate (§14.8 & §14.5 mainIdea.md).
 * Filters out weekends and holiday dates (t_harilibur).
 */
export function identifyClassesNeedingAbsensiReminder({
  classes = [],
  absensiRecords = [],
  targetDate,
  hariLiburList = [],
}) {
  if (!targetDate) return { isWorkDay: false, reason: 'NO_DATE', classesNeedingReminder: [] };

  // Parse YYYY-MM-DD
  const dateObj = new Date(`${targetDate}T00:00:00Z`);
  const dayOfWeek = dateObj.getUTCDay(); // 0 is Sunday, 6 is Saturday
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { isWorkDay: false, reason: 'WEEKEND', classesNeedingReminder: [] };
  }

  const isHoliday = (hariLiburList || []).some(
    (h) => String(h.tanggal || h).slice(0, 10) === targetDate
  );
  if (isHoliday) {
    return { isWorkDay: false, reason: 'HOLIDAY', classesNeedingReminder: [] };
  }

  // Active classes
  const activeClasses = classes.filter(
    (c) => !c.deletedAt && (c.classStat === 1 || c.status === 'aktif' || !c.status)
  );

  // Group attendance records by classId for targetDate
  const recordedClassIds = new Set(
    (absensiRecords || [])
      .filter((r) => String(r.tanggalAbsensi).slice(0, 10) === targetDate)
      .map((r) => Number(r.kelasId))
  );

  const classesNeedingReminder = activeClasses.filter(
    (c) => !recordedClassIds.has(Number(c.id))
  );

  return {
    isWorkDay: true,
    reason: null,
    classesNeedingReminder: classesNeedingReminder.map((c) => ({
      kelasId: Number(c.id),
      namaKelas: c.namaKelas,
      mancationClassId: c.mancationClassId,
      senseiPengajarId: c.senseiPengajar ? Number(c.senseiPengajar) : null,
    })),
  };
}

