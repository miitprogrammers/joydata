import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canAccessPage,
  canChangeStatusTag,
  validateAccessMatrixUpdate,
  reconcileRosterWithLocalPeserta,
  validateManualPesertaInput,
  computeSikapScore,
  computeSikapSummary,
  computeNilaiUjianAvg,
  validateAndNormalizeNilaiUjian,
  validateAndNormalizeNilaiKaiwa,
  computeKaiwaMetricsForPeriod,
  validateAndNormalizeNilaiSikap,
  computeAbsensiRasio,
  computeClassMonthlyAbsensi,
} from './rules.js';

test('RBAC: only admin can change peserta statusTag and admin lockout is prevented', () => {
  assert.equal(canChangeStatusTag('admin'), true);
  assert.equal(canChangeStatusTag('sensei'), false);
  assert.equal(canChangeStatusTag('manager'), false);
  assert.equal(canAccessPage(['dashboard', 'data-peserta'], 'data-peserta'), true);
  assert.equal(canAccessPage(['dashboard'], 'crud-staff'), false);

  const lockoutAttempt = validateAccessMatrixUpdate({
    isAdminRole: true,
    selectedPageKodes: ['dashboard'],
    allValidPageKodes: ['dashboard', 'role-akses', 'crud-staff'],
  });
  assert.equal(lockoutAttempt.ok, false);
  assert.equal(lockoutAttempt.code, 'ADMIN_LOCKOUT_PREVENTED');

  const validAdminMatrix = validateAccessMatrixUpdate({
    isAdminRole: true,
    selectedPageKodes: ['dashboard', 'role-akses', 'crud-staff'],
    allValidPageKodes: ['dashboard', 'role-akses', 'crud-staff'],
  });
  assert.equal(validAdminMatrix.ok, true);
});

test('Roster reconciliation promotes manual Peserta Luar Kelas to roster when assigned to JOY class', () => {
  const kelasByMancationId = new Map([
    [139, { id: 1, namaKelas: 'JOY 1', deletedAt: null }],
    [142, { id: 2, namaKelas: 'JOY 2', deletedAt: null }],
  ]);

  const existingPeserta = [
    {
      id: 10,
      mancationAkunId: 5001,
      kelasId: null,
      statusTag: 'berkembang',
      sumber: 'manual',
      keteranganLuarKelas: 'cuti',
    },
    {
      id: 11,
      mancationAkunId: 5002,
      kelasId: 1,
      statusTag: 'siap_interview',
      sumber: 'roster',
      keteranganLuarKelas: null,
    },
  ];

  const mancationRoster = [
    { mancationAkunId: 5001, mancationClassId: 139 },
    { mancationAkunId: 5002, mancationClassId: 139 },
    { mancationAkunId: 5003, mancationClassId: 142 },
  ];

  const { toInsert, toUpdate } = reconcileRosterWithLocalPeserta(
    mancationRoster,
    existingPeserta,
    kelasByMancationId
  );

  assert.equal(toInsert.length, 1);
  assert.equal(toInsert[0].mancationAkunId, 5003);
  assert.equal(toInsert[0].kelasId, 2);
  assert.equal(toInsert[0].sumber, 'roster');

  assert.equal(toUpdate.length, 1);
  assert.equal(toUpdate[0].mancationAkunId, 5001);
  assert.equal(toUpdate[0].sumber, 'roster');
  assert.equal(toUpdate[0].keteranganLuarKelas, null);
  assert.equal(toUpdate[0].promotedFromManual, true);
});

test('Peserta Luar Kelas manual validation enforces unique mancationAkunId and cli_id = 9', () => {
  const existing = [{ id: 1, mancationAkunId: 5001, sumber: 'roster' }];

  const dup = validateManualPesertaInput(
    { mancationAkunId: 5001, keteranganLuarKelas: 'alumni' },
    existing,
    { mancationAkunId: 5001, cliId: 9 }
  );
  assert.equal(dup.ok, false);
  assert.equal(dup.code, 'ALREADY_IN_ROSTER');

  const wrongClient = validateManualPesertaInput(
    { mancationAkunId: 6001, keteranganLuarKelas: 'alumni' },
    existing,
    { mancationAkunId: 6001, cliId: 4 }
  );
  assert.equal(wrongClient.ok, false);
  assert.equal(wrongClient.code, 'INVALID_CLIENT_ID');

  const valid = validateManualPesertaInput(
    { mancationAkunId: 6002, keteranganLuarKelas: 'alumni', alasan: 'Sudah berangkat TG Kaigo' },
    existing,
    { mancationAkunId: 6002, cliId: 9 }
  );
  assert.equal(valid.ok, true);
  assert.equal(valid.normalized.sumber, 'manual');
  assert.equal(valid.normalized.keteranganLuarKelas, 'alumni');
});

test('Academic formulas follow JOYdata specification without drift', () => {
  assert.equal(
    computeSikapScore([
      { sentiment: 'positif', bobot: 10 },
      { sentiment: 'negatif', bobot: 25 },
    ]),
    60
  );
  assert.equal(computeSikapScore([{ sentiment: 'positif', bobot: 50 }]), 100);
  assert.equal(computeSikapScore([{ sentiment: 'negatif', bobot: 90 }]), 0);

  assert.equal(
    computeNilaiUjianAvg({ tipePenilaian: 'variable', mojiGoi: 80, bunpou: 70, dokkai: null, choukai: 90 }),
    80
  );
  assert.equal(computeNilaiUjianAvg({ tipePenilaian: 'tunggal', nilaiTunggal: 87.5 }), 87.5);

  const abs = computeAbsensiRasio([
    { status: 'hadir' },
    { status: 'hadir' },
    { status: 'hadir' },
    { status: 'sakit' },
  ]);
  assert.equal(abs.totalHariDiisi, 4);
  assert.equal(abs.rasioPersen, 75);
});

test('Fase 2 Nilai Ujian validation enforces tunggal vs variable invariants', () => {
  const emptyVar = validateAndNormalizeNilaiUjian({
    pesertaId: 1,
    kelasId: 1,
    tanggalUjian: '2026-10-15',
    codeUjian: 'M001',
    pola: 'variable',
  });
  assert.equal(emptyVar.ok, false);
  assert.equal(emptyVar.code, 'EMPTY_VARIABLE_SCORES');

  const partialVar = validateAndNormalizeNilaiUjian({
    pesertaId: 1,
    kelasId: 1,
    tanggalUjian: '2026-10-15',
    codeUjian: 'M001',
    pola: 'variable',
    nilaiTunggal: 99,
    nilaiMojiGoi: 88,
    nilaiBunpou: 84,
    nilaiDokkai: 92,
    nilaiChoukai: '',
  });
  assert.equal(partialVar.ok, true);
  assert.equal(partialVar.normalized.nilaiTunggal, null);
  assert.equal(partialVar.normalized.nilaiChoukai, null);
  assert.equal(partialVar.normalized.nilaiAvg, 88);

  const tunggal = validateAndNormalizeNilaiUjian({
    pesertaId: 2,
    kelasId: 3,
    tanggalUjian: '2026-10-16',
    codeUjian: 'DASAR-01',
    pola: 'tunggal',
    nilaiTunggal: 91,
    nilaiMojiGoi: 50,
  });
  assert.equal(tunggal.ok, true);
  assert.equal(tunggal.normalized.nilaiMojiGoi, null);
  assert.equal(tunggal.normalized.nilaiAvg, 91);
});

test('Fase 2 Nilai Kaiwa enforces A/B/C only and computes 3 separate metrics', () => {
  assert.equal(
    validateAndNormalizeNilaiKaiwa({ pesertaId: 1, kelasId: 1, tanggalKaiwa: '2026-10-10', grade: 'D' }).ok,
    false
  );

  const metrics = computeKaiwaMetricsForPeriod([1, 2, 3], [
    { id: 1, pesertaId: 1, tanggalKaiwa: '2026-10-02', grade: 'C' },
    { id: 2, pesertaId: 1, tanggalKaiwa: '2026-10-18', grade: 'A' }, // latest for student 1 is A
    { id: 3, pesertaId: 2, tanggalKaiwa: '2026-10-12', grade: 'B' }, // latest for student 2 is B
    // student 3 has no kaiwa -> belumAda (NOT C!)
  ]);
  assert.deepEqual(metrics.distribusi, { A: 1, B: 1, C: 0, belumAda: 1 });
  assert.equal(metrics.jumlahSesi, 3);
  // ordinal points: (1 + 3 + 2) / 3 = 2
  assert.equal(metrics.rataPoinOrdinal, 2);
});

test('Fase 2 Nilai Sikap enforces positive magnitude bobot and KKM 70 vs Label C', () => {
  const norm = validateAndNormalizeNilaiSikap({
    pesertaId: 1,
    kelasId: 1,
    tanggalPenilaian: '2026-10-12',
    sentiment: 'negatif',
    bobot: -10, // even if negative passed, stored as positive magnitude 10!
  });
  assert.equal(norm.ok, true);
  assert.equal(norm.normalized.bobot, 10);

  const summary = computeSikapSummary([norm.normalized], 75, 70);
  assert.equal(summary.skorAkhir, 65);
  assert.equal(summary.label, 'C'); // 65 is Label C (>=60)
  assert.equal(summary.lulusKkm, false); // yet < 70 KKM!
});

test('Fase 2 Class Monthly Absensi uses class session count S and distinguishes S=0 (-) vs 0%', () => {
  const emptyMonth = computeClassMonthlyAbsensi([1, 2], []);
  assert.equal(emptyMonth.sesiKelas, 0);
  assert.equal(emptyMonth.rasioKelas, null);
  assert.equal(emptyMonth.studentStats.get(1).rasioKehadiran, null);

  const activeMonth = computeClassMonthlyAbsensi([1, 2], [
    { pesertaId: 1, tanggalAbsensi: '2026-10-01', status: 'hadir' },
    { pesertaId: 1, tanggalAbsensi: '2026-10-02', status: 'hadir' },
    // student 2 has 0 records while S=2 -> 0% (NOT null)
  ]);
  assert.equal(activeMonth.sesiKelas, 2);
  assert.equal(activeMonth.studentStats.get(1).rasioKehadiran, 100);
  assert.equal(activeMonth.studentStats.get(2).rasioKehadiran, 0);
  assert.equal(activeMonth.rasioKelas, 50);
});



test('Fase 3: validateSettingsPayload enforces KKM, basis, and grade thresholds invariants', async () => {
  const { validateSettingsPayload } = await import('./rules.js');
  const invalid = validateSettingsPayload({
    kkm_ujian: 120, // out of range
    kkm_sikap: 70,
    sikap_basis: 75,
  });
  assert.equal(invalid.ok, false);
  assert.equal(invalid.code, 'INVALID_KKM_UJIAN');

  const invalidGrade = validateSettingsPayload({
    kkm_ujian: 70,
    kkm_sikap: 70,
    sikap_basis: 75,
    batas_grade: { A: 80, B: 85, C: 60 }, // A must be > B
  });
  assert.equal(invalidGrade.ok, false);
  assert.equal(invalidGrade.code, 'INVALID_BATAS_GRADE');

  const valid = validateSettingsPayload({
    kkm_ujian: 70,
    kkm_sikap: 70,
    sikap_basis: 75,
    ambang_kehadiran_rendah: 75,
    batas_grade: { A: 90, B: 75, C: 60 },
  });
  assert.equal(valid.ok, true);
  assert.equal(valid.normalized.kkm_ujian, 70);
  assert.equal(valid.normalized.sikap_basis, 75);
});

test('Fase 3: computeProgresStudentMetrics correctly aggregates multi-domain indicators and interview status', async () => {
  const { computeProgresStudentMetrics } = await import('./rules.js');
  const metrics = computeProgresStudentMetrics({
    student: { id: 10, mancationAkunId: 9101, nama: 'Rizky Pratama', statusTag: 'siap_interview' },
    ujianRows: [
      { nilaiAvg: 90 },
      { nilaiAvg: 80 },
    ],
    kaiwaRows: [
      { id: 1, tanggalKaiwa: '2026-10-05', grade: 'B' },
      { id: 2, tanggalKaiwa: '2026-10-20', grade: 'A' },
    ],
    sikapSummary: { skorAkhir: 85, label: 'B', lulusKkm: true },
    absensiStats: { rasioKehadiran: 100, hadir: 2, sesiKelas: 2 },
  });

  assert.equal(metrics.pesertaId, 10);
  assert.equal(metrics.rataUjian, 85);
  assert.equal(metrics.predikatUjian, 'B');
  assert.equal(metrics.lulusKkmUjian, true);
  assert.equal(metrics.gradeKaiwaTerakhir, 'A');
  assert.equal(metrics.sesiKaiwaCount, 2);
  assert.equal(metrics.skorSikap, 85);
  assert.equal(metrics.rasioKehadiran, 100);
  assert.equal(metrics.isSiapInterview, true);
});

test('Fase 4: validatePushSubscription validates payload and extracts keys', async () => {
  const { validatePushSubscription } = await import('./rules.js');
  const invalidEndpoint = validatePushSubscription({ endpoint: 'http://insecure.com' });
  assert.equal(invalidEndpoint.ok, false);
  assert.equal(invalidEndpoint.code, 'INVALID_ENDPOINT');

  const missingKeys = validatePushSubscription({ endpoint: 'https://fcm.googleapis.com/fcm/send/xyz' });
  assert.equal(missingKeys.ok, false);
  assert.equal(missingKeys.code, 'MISSING_KEYS');

  const valid = validatePushSubscription({
    endpoint: 'https://fcm.googleapis.com/fcm/send/xyz',
    keys: { p256dh: 'BNcRdre...', auth: 'tBHIt8...' },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5)',
  });
  assert.equal(valid.ok, true);
  assert.equal(valid.subscription.endpoint, 'https://fcm.googleapis.com/fcm/send/xyz');
  assert.equal(valid.subscription.keys.p256dh, 'BNcRdre...');
});

test('Fase 4: isPushDuplicate enforces UNIQUE(jenis, tanggal, staffId)', async () => {
  const { isPushDuplicate } = await import('./rules.js');
  const logs = [
    { id: 1, jenis: 'pengingat_absensi', tanggal: '2026-10-27', staffId: 3 },
  ];

  assert.equal(isPushDuplicate(logs, { jenis: 'pengingat_absensi', tanggal: '2026-10-27', staffId: 3 }), true);
  assert.equal(isPushDuplicate(logs, { jenis: 'pengingat_absensi', tanggal: '2026-10-27', staffId: 1 }), false);
  assert.equal(isPushDuplicate(logs, { jenis: 'pengingat_absensi', tanggal: '2026-10-28', staffId: 3 }), false);
});

test('Fase 4: identifyClassesNeedingAbsensiReminder excludes weekends, holidays, and already recorded classes', async () => {
  const { identifyClassesNeedingAbsensiReminder } = await import('./rules.js');
  
  // Test weekend (2026-10-25 was Sunday)
  const weekendResult = identifyClassesNeedingAbsensiReminder({
    classes: [{ id: 1, namaKelas: 'JOY 1', classStat: 1 }],
    absensiRecords: [],
    targetDate: '2026-10-25',
  });
  assert.equal(weekendResult.isWorkDay, false);
  assert.equal(weekendResult.reason, 'WEEKEND');

  // Test holiday
  const holidayResult = identifyClassesNeedingAbsensiReminder({
    classes: [{ id: 1, namaKelas: 'JOY 1', classStat: 1 }],
    absensiRecords: [],
    targetDate: '2026-10-27',
    hariLiburList: [{ tanggal: '2026-10-27' }],
  });
  assert.equal(holidayResult.isWorkDay, false);
  assert.equal(holidayResult.reason, 'HOLIDAY');

  // Test normal workday with 1 recorded and 1 unrecorded class
  const workdayResult = identifyClassesNeedingAbsensiReminder({
    classes: [
      { id: 1, namaKelas: 'JOY 1', classStat: 1, senseiPengajar: 3 },
      { id: 2, namaKelas: 'JOY 2', classStat: 1, senseiPengajar: 4 },
    ],
    absensiRecords: [
      { id: 101, kelasId: 1, tanggalAbsensi: '2026-10-27' },
    ],
    targetDate: '2026-10-27',
    hariLiburList: [],
  });
  assert.equal(workdayResult.isWorkDay, true);
  assert.equal(workdayResult.classesNeedingReminder.length, 1);
  assert.equal(workdayResult.classesNeedingReminder[0].kelasId, 2);
  assert.equal(workdayResult.classesNeedingReminder[0].senseiPengajarId, 4);
});

