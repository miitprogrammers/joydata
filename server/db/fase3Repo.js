import {
  readLocalState,
  saveLocalState,
  appendAudit,
} from './engine.js';
import {
  computeNilaiUjianAvg,
  getGradeLabel,
  computeSikapSummary,
  computeClassMonthlyAbsensi,
  computeKaiwaMetricsForPeriod,
  computeProgresStudentMetrics,
  validateSettingsPayload,
} from '../domain/rules.js';
import {
  SEED_MANCATION_STUDENTS,
  SEED_MANCATION_OUTSIDE_CANDIDATES,
} from './seedData.js';

export const DEFAULT_SETTINGS = {
  kkm_ujian: 70,
  kkm_sikap: 70,
  batas_grade: { A: 90, B: 75, C: 60 },
  sikap_basis: 75,
  ambang_kehadiran_rendah: 75,
  rentang_tren_bulan: 12,
  periode_default: 'auto',
};

function getStudentNameMap(state) {
  const map = new Map();
  for (const s of SEED_MANCATION_OUTSIDE_CANDIDATES || []) {
    map.set(Number(s.mancationAkunId), s.nama);
  }
  for (const s of state.mancationPesertaCache || []) {
    map.set(Number(s.mancationAkunId), s.nama);
  }
  for (const s of SEED_MANCATION_STUDENTS || []) {
    map.set(Number(s.mancationAkunId), s.nama);
  }
  return map;
}

function resolveNilaiAvg(u) {
  if (u.nilaiAvg !== null && u.nilaiAvg !== undefined && Number.isFinite(Number(u.nilaiAvg))) {
    return Number(u.nilaiAvg);
  }
  return computeNilaiUjianAvg(u);
}

export async function getSystemSettings() {
  const state = await readLocalState();
  return {
    ...DEFAULT_SETTINGS,
    ...(state.settings || {}),
  };
}

export async function updateSystemSettings(payload, staffId) {
  const val = validateSettingsPayload(payload);
  if (!val.ok) {
    throw new Error(val.code);
  }

  const state = await readLocalState();
  const oldSettings = { ...state.settings };
  state.settings = {
    ...DEFAULT_SETTINGS,
    ...val.normalized,
    updatedAt: new Date().toISOString(),
  };

  await saveLocalState(state);
  await appendAudit({
    staffId,
    aksi: 'UPDATE_SETTINGS',
    entitas: 'settings',
    entitasId: 1,
    dataLama: oldSettings,
    dataBaru: state.settings,
  });

  return state.settings;
}

export async function resetSystemSettings(staffId) {
  const state = await readLocalState();
  const oldSettings = { ...state.settings };
  state.settings = {
    ...DEFAULT_SETTINGS,
    updatedAt: new Date().toISOString(),
  };

  await saveLocalState(state);
  await appendAudit({
    staffId,
    aksi: 'RESET_SETTINGS',
    entitas: 'settings',
    entitasId: 1,
    dataLama: oldSettings,
    dataBaru: state.settings,
  });

  return state.settings;
}

export async function updatePesertaPenempatan(pesertaId, payload, staffId) {
  const pid = Number(pesertaId);
  if (!Number.isInteger(pid) || pid <= 0) {
    throw new Error('VALIDATION_ERROR');
  }

  const state = await readLocalState();
  const peserta = (state.peserta || []).find((p) => p.id === pid && !p.deletedAt);
  if (!peserta) {
    throw new Error('NOT_FOUND');
  }

  state.pesertaPenempatan = state.pesertaPenempatan || [];
  let existing = state.pesertaPenempatan.find((p) => p.pesertaId === pid);
  const dataLama = existing ? { ...existing } : null;

  const normalized = {
    pesertaId: pid,
    tanggalLulusUjian: payload?.tanggalLulusUjian || null,
    perusahaanNaitei: String(payload?.perusahaanNaitei || '').trim(),
    jenisPekerjaan: String(payload?.jenisPekerjaan || '').trim(),
    lokasiKerja: String(payload?.lokasiKerja || '').trim(),
    rencanaMulaiKerja: payload?.rencanaMulaiKerja || null,
    pendidikanTerakhir: String(payload?.pendidikanTerakhir || '').trim(),
    catatanBebas: String(payload?.catatanBebas || '').trim(),
    updatedAt: new Date().toISOString(),
  };

  if (existing) {
    Object.assign(existing, normalized);
  } else {
    state.seq = state.seq || {};
    state.seq.pesertaPenempatan = (state.seq.pesertaPenempatan || 0) + 1;
    existing = {
      id: state.seq.pesertaPenempatan,
      ...normalized,
      createdAt: new Date().toISOString(),
    };
    state.pesertaPenempatan.push(existing);
  }

  await saveLocalState(state);
  await appendAudit({
    staffId,
    aksi: 'UPDATE_PENEMPATAN',
    entitas: 'peserta_penempatan',
    entitasId: pid,
    dataLama,
    dataBaru: existing,
  });

  return existing;
}

export async function getProgresData({ periode, kelasId, tag }) {
  const state = await readLocalState();
  const activeMonth = periode || new Date().toISOString().slice(0, 7);
  const nameMap = getStudentNameMap(state);

  const activeClasses = (state.kelas || []).filter((k) => !k.deletedAt);
  const activePeserta = (state.peserta || []).filter((p) => !p.deletedAt).map((p) => ({
    ...p,
    nama: nameMap.get(Number(p.mancationAkunId)) || p.nama || ('Peserta #' + p.mancationAkunId),
  }));

  const kelasMap = new Map(activeClasses.map((k) => [k.id, k]));
  const staffMap = new Map((state.staff || []).map((s) => [s.id, s]));

  const ujianInPeriod = (state.nilaiUjian || [])
    .filter((u) => u.tanggalUjian && String(u.tanggalUjian).startsWith(activeMonth))
    .map((u) => ({
      ...u,
      nilaiAvg: resolveNilaiAvg(u),
    }));

  const kaiwaInPeriod = (state.nilaiKaiwa || []).filter(
    (k) => k.tanggalKaiwa && String(k.tanggalKaiwa).startsWith(activeMonth)
  );
  const sikapInPeriod = (state.nilaiSikap || []).filter(
    (s) => s.tanggalPenilaian && String(s.tanggalPenilaian).startsWith(activeMonth)
  );
  const absensiInPeriod = (state.absensi || []).filter(
    (a) => a.tanggalAbsensi && String(a.tanggalAbsensi).startsWith(activeMonth)
  );

  const settings = { ...DEFAULT_SETTINGS, ...(state.settings || {}) };

  const kelasSummaryList = [];
  for (const k of activeClasses) {
    const classStudents = activePeserta.filter((p) => p.kelasId === k.id);
    const studentIds = classStudents.map((p) => p.id);

    const classUjian = ujianInPeriod.filter((u) => u.kelasId === k.id);
    const classKaiwa = kaiwaInPeriod.filter((c) => c.kelasId === k.id);
    const classSikap = sikapInPeriod.filter((s) => s.kelasId === k.id);
    const classAbsensi = absensiInPeriod.filter((a) => a.kelasId === k.id);

    const absensiCalc = computeClassMonthlyAbsensi(studentIds, classAbsensi);
    const kaiwaCalc = computeKaiwaMetricsForPeriod(studentIds, classKaiwa);

    const validExamAvgs = classUjian
      .map((u) => (u.nilaiAvg !== null ? Number(u.nilaiAvg) : null))
      .filter((v) => v !== null);
    const avgUjian =
      validExamAvgs.length > 0
        ? Math.round((validExamAvgs.reduce((a, b) => a + b, 0) / validExamAvgs.length) * 10) / 10
        : null;

    const tagCounts = { standar: 0, berkembang: 0, siap_interview: 0 };
    for (const p of classStudents) {
      const t = p.statusTag || 'standar';
      if (tagCounts[t] !== undefined) tagCounts[t]++;
      else tagCounts.standar++;
    }

    let sumSikap = 0;
    for (const p of classStudents) {
      const pSikap = classSikap.filter((s) => s.pesertaId === p.id);
      const summ = computeSikapSummary(pSikap, settings.sikap_basis, settings.kkm_sikap);
      sumSikap += summ.skorAkhir;
    }
    const avgSikap = classStudents.length > 0 ? Math.round((sumSikap / classStudents.length) * 10) / 10 : null;

    const sensei = staffMap.get(k.senseiId);

    kelasSummaryList.push({
      kelasId: k.id,
      namaKelas: k.namaKelas,
      senseiNama: sensei?.nama || '-',
      jumlahPeserta: classStudents.length,
      tagCounts,
      rataUjian: avgUjian,
      rataSikap: avgSikap,
      rasioKehadiran: absensiCalc.rasioKelas,
      sesiAbsensi: absensiCalc.sesiKelas,
      kaiwaDistribusi: kaiwaCalc.distribusi,
      rataPoinKaiwa: kaiwaCalc.rataPoinOrdinal,
      totalSesiKaiwa: kaiwaCalc.jumlahSesi,
    });
  }

  let targetStudents = activePeserta;
  if (kelasId) {
    const kId = Number(kelasId);
    targetStudents = targetStudents.filter((p) => p.kelasId === kId);
  }
  if (tag) {
    targetStudents = targetStudents.filter((p) => (p.statusTag || 'standar') === tag);
  }

  const pesertaList = [];
  for (const student of targetStudents) {
    const studentUjian = ujianInPeriod.filter((u) => u.pesertaId === student.id);
    const studentKaiwa = kaiwaInPeriod.filter((k) => k.pesertaId === student.id);
    const studentSikap = sikapInPeriod.filter((s) => s.pesertaId === student.id);

    const sikapSummary = computeSikapSummary(studentSikap, settings.sikap_basis, settings.kkm_sikap);

    const studentClassId = student.kelasId;
    const classAllAbsensi = absensiInPeriod.filter((a) => a.kelasId === studentClassId);
    const classRoster = activePeserta.filter((p) => p.kelasId === studentClassId).map((p) => p.id);
    const classCalc = computeClassMonthlyAbsensi(classRoster, classAllAbsensi);
    const studentAbsensiStat = classCalc.studentStats.get(student.id) || {
      rasioKehadiran: null,
      hadir: 0,
      sesiKelas: classCalc.sesiKelas,
    };

    const metrics = computeProgresStudentMetrics({
      student,
      ujianRows: studentUjian,
      kaiwaRows: studentKaiwa,
      sikapSummary,
      absensiStats: studentAbsensiStat,
    });

    const k = student.kelasId ? kelasMap.get(student.kelasId) : null;
    pesertaList.push({
      ...metrics,
      nama: student.nama,
      namaKelas: k ? k.namaKelas : (student.sumber === 'manual' ? 'Peserta Luar Kelas' : '-'),
      sumber: student.sumber || 'roster',
      keteranganLuarKelas: student.keteranganLuarKelas || null,
    });
  }

  const kandidatInterviewCount = activePeserta.filter((p) => p.statusTag === 'siap_interview').length;

  return {
    periode: activeMonth,
    kelasSummary: kelasSummaryList,
    pesertaList,
    kandidatInterviewCount,
    settings,
  };
}

export async function getStudentRapor({ pesertaId, periode }) {
  const pid = Number(pesertaId);
  if (!Number.isInteger(pid) || pid <= 0) {
    throw new Error('VALIDATION_ERROR');
  }

  const state = await readLocalState();
  const student = (state.peserta || []).find((p) => p.id === pid && !p.deletedAt);
  if (!student) {
    throw new Error('NOT_FOUND');
  }

  const nameMap = getStudentNameMap(state);
  const resolvedNama = nameMap.get(Number(student.mancationAkunId)) || student.nama || ('Peserta #' + student.mancationAkunId);

  const activeMonth = periode || new Date().toISOString().slice(0, 7);
  const settings = { ...DEFAULT_SETTINGS, ...(state.settings || {}) };

  const kelas = student.kelasId ? (state.kelas || []).find((k) => k.id === student.kelasId) : null;
  const program = kelas?.programId ? (state.programs || []).find((pr) => pr.id === kelas.programId) : null;
  const sensei = kelas?.senseiId ? (state.staff || []).find((s) => s.id === kelas.senseiId) : null;

  const penempatan = (state.pesertaPenempatan || []).find((p) => p.pesertaId === pid) || {
    pesertaId: pid,
    tanggalLulusUjian: null,
    perusahaanNaitei: '',
    jenisPekerjaan: '',
    lokasiKerja: '',
    rencanaMulaiKerja: null,
    pendidikanTerakhir: '',
    catatanBebas: '',
  };

  const ujianList = (state.nilaiUjian || [])
    .filter((u) => u.pesertaId === pid && u.tanggalUjian && String(u.tanggalUjian).startsWith(activeMonth))
    .map((u) => {
      const avg = resolveNilaiAvg(u);
      return {
        ...u,
        nilaiAvg: avg,
        grade: avg !== null ? getGradeLabel(avg) : '-',
        lulusKkm: avg !== null ? avg >= settings.kkm_ujian : false,
      };
    })
    .sort((a, b) => String(a.tanggalUjian).localeCompare(String(b.tanggalUjian)));

  const kaiwaList = (state.nilaiKaiwa || [])
    .filter((k) => k.pesertaId === pid && k.tanggalKaiwa && String(k.tanggalKaiwa).startsWith(activeMonth))
    .sort((a, b) => String(b.tanggalKaiwa).localeCompare(String(a.tanggalKaiwa)));

  const latestKaiwa = kaiwaList.length > 0 ? kaiwaList[0] : null;

  const kategoriMap = new Map((state.sikapKategori || []).map((k) => [k.id, k]));
  const sikapLogs = (state.nilaiSikap || [])
    .filter((s) => s.pesertaId === pid && s.tanggalPenilaian && String(s.tanggalPenilaian).startsWith(activeMonth))
    .map((s) => {
      const kat = s.kategoriId ? kategoriMap.get(s.kategoriId) : null;
      return {
        ...s,
        kategoriNamaId: kat?.namaId || 'Lainnya',
        kategoriNamaJa: kat?.namaJa || 'その他',
      };
    })
    .sort((a, b) => String(a.tanggalPenilaian).localeCompare(String(b.tanggalPenilaian)));

  const sikapSummary = computeSikapSummary(sikapLogs, settings.sikap_basis, settings.kkm_sikap);

  const classId = student.kelasId;
  const classAbsensi = (state.absensi || []).filter(
    (a) => a.kelasId === classId && a.tanggalAbsensi && String(a.tanggalAbsensi).startsWith(activeMonth)
  );
  const classRoster = (state.peserta || []).filter((p) => p.kelasId === classId && !p.deletedAt).map((p) => p.id);
  const classCalc = computeClassMonthlyAbsensi(classRoster, classAbsensi);
  const studentAbs = classCalc.studentStats.get(pid) || {
    hadir: 0,
    sakit: 0,
    izin: 0,
    alfa: 0,
    sesiKelas: classCalc.sesiKelas,
    rasioKehadiran: null,
    rasioKetidakhadiran: null,
  };

  const examAvgs = ujianList.map((u) => u.nilaiAvg).filter((v) => v !== null && Number.isFinite(v));
  const overallExamAvg =
    examAvgs.length > 0 ? Math.round((examAvgs.reduce((a, b) => a + b, 0) / examAvgs.length) * 10) / 10 : null;

  return {
    periode: activeMonth,
    student: {
      id: student.id,
      nama: resolvedNama,
      mancationAkunId: student.mancationAkunId,
      statusTag: student.statusTag || 'standar',
      tanggalMasuk: student.tanggalMasuk || null,
      sumber: student.sumber || 'roster',
      keteranganLuarKelas: student.keteranganLuarKelas || null,
    },
    kelas: kelas
      ? {
          id: kelas.id,
          namaKelas: kelas.namaKelas,
          programNama: program?.namaId || '-',
          programNamaJa: program?.namaJa || '-',
          senseiNama: sensei?.nama || '-',
        }
      : null,
    penempatan,
    kpi: {
      rataUjian: overallExamAvg,
      gradeUjian: overallExamAvg !== null ? getGradeLabel(overallExamAvg) : '-',
      lulusKkmUjian: overallExamAvg !== null ? overallExamAvg >= settings.kkm_ujian : false,
      gradeKaiwa: latestKaiwa ? latestKaiwa.grade : '-',
      sesiKaiwa: kaiwaList.length,
      skorSikap: sikapSummary.skorAkhir,
      predikatSikap: sikapSummary.label,
      lulusKkmSikap: sikapSummary.lulusKkm,
      rasioKehadiran: studentAbs.rasioKehadiran,
      sesiKelas: studentAbs.sesiKelas,
    },
    ujianList,
    kaiwaList,
    sikapData: {
      basis: settings.sikap_basis,
      kkm: settings.kkm_sikap,
      skorAkhir: sikapSummary.skorAkhir,
      predikat: sikapSummary.label,
      lulusKkm: sikapSummary.lulusKkm,
      logs: sikapLogs,
    },
    absensiData: {
      sesiKelas: studentAbs.sesiKelas,
      hadir: studentAbs.hadir,
      sakit: studentAbs.sakit,
      izin: studentAbs.izin,
      alfa: studentAbs.alfa,
      rasioKehadiran: studentAbs.rasioKehadiran,
      rasioTidakHadir: studentAbs.rasioKetidakhadiran,
    },
    settings,
  };
}

export async function getDashboardChartsData({ periode }) {
  const state = await readLocalState();
  const activeMonth = periode || new Date().toISOString().slice(0, 7);
  const settings = { ...DEFAULT_SETTINGS, ...(state.settings || {}) };
  const nameMap = getStudentNameMap(state);

  const activeClasses = (state.kelas || []).filter((k) => !k.deletedAt);
  const activePeserta = (state.peserta || []).filter((p) => !p.deletedAt).map((p) => ({
    ...p,
    nama: nameMap.get(Number(p.mancationAkunId)) || p.nama || ('Peserta #' + p.mancationAkunId),
  }));

  const [yearStr, monthStr] = activeMonth.split('-');
  const baseYear = Number(yearStr);
  const baseMonth = Number(monthStr);

  const months = [];
  for (let i = 5; i >= 0; i--) {
    let m = baseMonth - i;
    let y = baseYear;
    while (m <= 0) {
      m += 12;
      y -= 1;
    }
    months.push(y + '-' + String(m).padStart(2, '0'));
  }

  const trenUjian = months.map((m) => {
    const examsInM = (state.nilaiUjian || []).filter(
      (u) => u.tanggalUjian && String(u.tanggalUjian).startsWith(m)
    );
    const avgs = examsInM.map((u) => resolveNilaiAvg(u)).filter((v) => v !== null);
    const avg = avgs.length > 0 ? Math.round((avgs.reduce((a, b) => a + b, 0) / avgs.length) * 10) / 10 : null;
    return { bulan: m, rataRata: avg, jumlahUjian: examsInM.length };
  });

  const examsInCurrentMonth = (state.nilaiUjian || []).filter(
    (u) => u.tanggalUjian && String(u.tanggalUjian).startsWith(activeMonth)
  );
  const distribusiUjian = { A: 0, B: 0, C: 0, D: 0 };
  for (const u of examsInCurrentMonth) {
    const avg = resolveNilaiAvg(u);
    if (avg !== null) {
      const g = getGradeLabel(avg);
      if (distribusiUjian[g] !== undefined) distribusiUjian[g]++;
    }
  }

  const absensiInCurrentMonth = (state.absensi || []).filter(
    (a) => a.tanggalAbsensi && String(a.tanggalAbsensi).startsWith(activeMonth)
  );
  const rasioKehadiranPerKelas = activeClasses.map((k) => {
    const roster = activePeserta.filter((p) => p.kelasId === k.id).map((p) => p.id);
    const classAbs = absensiInCurrentMonth.filter((a) => a.kelasId === k.id);
    const calc = computeClassMonthlyAbsensi(roster, classAbs);
    return {
      kelasId: k.id,
      namaKelas: k.namaKelas,
      rasio: calc.rasioKelas,
      sesi: calc.sesiKelas,
      isRendah: calc.rasioKelas !== null && calc.rasioKelas < settings.ambang_kehadiran_rendah,
    };
  });

  const kaiwaInCurrentMonth = (state.nilaiKaiwa || []).filter(
    (k) => k.tanggalKaiwa && String(k.tanggalKaiwa).startsWith(activeMonth)
  );
  const kaiwaDist = computeKaiwaMetricsForPeriod(
    activePeserta.map((p) => p.id),
    kaiwaInCurrentMonth
  );

  const sikapInCurrentMonth = (state.nilaiSikap || []).filter(
    (s) => s.tanggalPenilaian && String(s.tanggalPenilaian).startsWith(activeMonth)
  );
  let positifCount = 0;
  let negatifCount = 0;
  for (const s of sikapInCurrentMonth) {
    if (s.sentiment === 'positif') positifCount++;
    else if (s.sentiment === 'negatif') negatifCount++;
  }

  const studentWatchlistSikap = [];
  const studentWatchlistKehadiran = [];

  for (const p of activePeserta) {
    const k = activeClasses.find((c) => c.id === p.kelasId);
    const pSikap = sikapInCurrentMonth.filter((s) => s.pesertaId === p.id);
    const summ = computeSikapSummary(pSikap, settings.sikap_basis, settings.kkm_sikap);
    if (summ.skorAkhir < settings.kkm_sikap) {
      studentWatchlistSikap.push({
        pesertaId: p.id,
        nama: p.nama,
        namaKelas: k?.namaKelas || '-',
        skor: summ.skorAkhir,
        predikat: summ.label,
        lulusKkm: summ.lulusKkm,
      });
    }

    if (p.kelasId) {
      const classAbs = absensiInCurrentMonth.filter((a) => a.kelasId === p.kelasId);
      const roster = activePeserta.filter((m) => m.kelasId === p.kelasId).map((m) => m.id);
      const calc = computeClassMonthlyAbsensi(roster, classAbs);
      const stat = calc.studentStats.get(p.id);
      if (stat && stat.rasioKehadiran !== null && stat.rasioKehadiran < settings.ambang_kehadiran_rendah) {
        studentWatchlistKehadiran.push({
          pesertaId: p.id,
          nama: p.nama,
          namaKelas: k?.namaKelas || '-',
          rasio: stat.rasioKehadiran,
          hadir: stat.hadir,
          sesi: stat.sesiKelas,
        });
      }
    }
  }

  studentWatchlistSikap.sort((a, b) => a.skor - b.skor);
  studentWatchlistKehadiran.sort((a, b) => (a.rasio ?? 0) - (b.rasio ?? 0));

  return {
    periode: activeMonth,
    trenUjian,
    distribusiUjian,
    rasioKehadiranPerKelas,
    distribusiKaiwa: kaiwaDist.distribusi,
    rataPoinKaiwa: kaiwaDist.rataPoinOrdinal,
    totalSesiKaiwa: kaiwaDist.jumlahSesi,
    sikapSentimen: {
      positif: positifCount,
      negatif: negatifCount,
      total: positifCount + negatifCount,
    },
    watchlist: {
      sikapRendah: studentWatchlistSikap.slice(0, 5),
      kehadiranRendah: studentWatchlistKehadiran.slice(0, 5),
    },
  };
}

export async function exportAkademikData({ tipe = 'progres', periode, kelasId, locale = 'id' }) {
  const isJa = locale === 'ja';
  const state = await readLocalState();
  const activeMonth = periode || new Date().toISOString().slice(0, 7);

  function escapeCsv(val) {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return '"' + s + '"';
  }

  if (tipe === 'progres') {
    const data = await getProgresData({ periode: activeMonth, kelasId });
    const headers = isJa
      ? ['ID', '氏名', 'クラス', '試験平均', '試験判定', '会話直近', '態度スコア', '態度判定', '出席率(%)', 'ステータスタグ']
      : ['ID', 'Nama Peserta', 'Kelas', 'Rata-rata Ujian', 'Predikat Ujian', 'Grade Kaiwa Terakhir', 'Skor Sikap', 'Predikat Sikap', 'Rasio Kehadiran (%)', 'Status Tag'];

    const rows = data.pesertaList.map((p) => [
      p.mancationAkunId || p.pesertaId,
      p.nama,
      p.namaKelas,
      p.rataUjian !== null ? p.rataUjian : '-',
      p.predikatUjian || '-',
      p.gradeKaiwaTerakhir || '-',
      p.skorSikap,
      p.predikatSikap,
      p.rasioKehadiran !== null ? p.rasioKehadiran + '%' : '-',
      p.statusTag,
    ]);

    const headerLine = headers.map(escapeCsv).join(',');
    const rowLines = rows.map((r) => r.map(escapeCsv).join(','));
    const csvContent = [headerLine, ...rowLines].join('\n');

    return {
      filename: 'JOYdata-Progres-' + activeMonth + '.csv',
      content: csvContent,
      mimeType: 'text/csv; charset=utf-8',
    };
  }

  return {
    filename: 'JOYdata-Export-' + activeMonth + '.csv',
    content: '""\n',
    mimeType: 'text/csv; charset=utf-8',
  };
}
