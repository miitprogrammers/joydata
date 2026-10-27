import {
  ensureInitialized,
  getMode,
  getPool,
  readLocalState,
  saveLocalState,
  appendAudit,
  appendLocalAudit,
} from './engine.js';
import { listStaff } from './authStaffRepo.js';
import { listSikapKategori } from './masterRepo.js';
import { listKelas, listPeserta } from './pesertaRepo.js';
import {
  getGradeLabel,
  computeNilaiUjianAvg,
  validateAndNormalizeNilaiUjian,
  validateAndNormalizeNilaiKaiwa,
  computeKaiwaMetricsForPeriod,
  validateAndNormalizeNilaiSikap,
  computeSikapSummary,
  VALID_ABSENSI_STATUS,
  computeClassMonthlyAbsensi,
} from '../domain/rules.js';

function currentYearMonth() {
  return new Date().toISOString().slice(0, 7);
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

async function loadAcademicLookups() {
  const [pesertaData, kelasData, staffItems, kategoriItems] = await Promise.all([
    listPeserta({ sumber: 'roster' }),
    listKelas(),
    listStaff(),
    listSikapKategori(),
  ]);

  const pesertaById = new Map(pesertaData.items.map((p) => [Number(p.id), p]));
  const kelasById = new Map(kelasData.items.map((k) => [Number(k.id), k]));
  const staffById = new Map(staffItems.map((s) => [Number(s.id), s]));
  const kategoriById = new Map(kategoriItems.map((k) => [Number(k.id), k]));

  return {
    syncMeta: pesertaData.syncMeta,
    rosterItems: pesertaData.items,
    kelasOptions: kelasData.items,
    kategoriOptions: kategoriItems.filter((k) => k.aktif),
    pesertaById,
    kelasById,
    staffById,
    kategoriById,
  };
}

// ============================================================================
// 1. REKAP NILAI UJIAN (Pola Tunggal & Pola Variable)
// ============================================================================
export async function listNilaiUjian({ periode, kelasId, search } = {}) {
  await ensureInitialized();
  const ym = /^\d{4}-\d{2}$/.test(String(periode || '')) ? String(periode) : currentYearMonth();
  const kId = kelasId ? Number(kelasId) : null;
  const q = String(search || '').trim().toLowerCase();

  const lookups = await loadAcademicLookups();
  let rawRows = [];

  if (getMode() === 'postgres') {
    const params = [ym];
    let sql = `
      SELECT
        id,
        peserta_id AS "pesertaId",
        kelas_id AS "kelasId",
        tanggal_ujian::text AS "tanggalUjian",
        nama_ujian AS "codeUjian",
        tipe_penilaian AS "pola",
        nilai_tunggal::float AS "nilaiTunggal",
        moji_goi::float AS "nilaiMojiGoi",
        bunpou::float AS "nilaiBunpou",
        dokkai::float AS "nilaiDokkai",
        choukai::float AS "nilaiChoukai",
        nilai_avg::float AS "nilaiAvg",
        catatan,
        diinput_oleh_staff_id AS "penilaiId",
        created_at AS "createdAt"
      FROM v_nilai_ujian_avg
      WHERE TO_CHAR(tanggal_ujian, 'YYYY-MM') = $1
    `;
    if (kId) {
      params.push(kId);
      sql += ` AND kelas_id = $${params.length}`;
    }
    sql += ` ORDER BY tanggal_ujian DESC, id DESC`;
    const res = await getPool().query(sql, params);
    rawRows = res.rows;
  } else {
    const db = readLocalState();
    rawRows = db.nilaiUjian
      .filter((r) => String(r.tanggalUjian || '').startsWith(ym) && (!kId || Number(r.kelasId) === kId))
      .map((r) => ({
        ...r,
        nilaiAvg: computeNilaiUjianAvg(r),
      }))
      .sort((a, b) => String(b.tanggalUjian).localeCompare(String(a.tanggalUjian)) || b.id - a.id);
  }

  const enrichedAll = rawRows.map((r) => {
    const p = lookups.pesertaById.get(Number(r.pesertaId));
    const kl = lookups.kelasById.get(Number(r.kelasId));
    const st = lookups.staffById.get(Number(r.penilaiId));
    const avg = r.nilaiAvg != null ? Math.round(Number(r.nilaiAvg) * 100) / 100 : null;
    return {
      ...r,
      nilaiAvg: avg,
      gradeLabel: getGradeLabel(avg),
      pesertaNama: p?.nama || `Peserta #${r.pesertaId}`,
      mancationAkunId: p?.mancationAkunId || null,
      kelasNama: kl?.namaKelas || '-',
      penilaiNama: st?.nama || '-',
    };
  });

  const items = q
    ? enrichedAll.filter(
        (r) =>
          r.pesertaNama.toLowerCase().includes(q) ||
          String(r.mancationAkunId || '').includes(q) ||
          String(r.codeUjian || '').toLowerCase().includes(q)
      )
    : enrichedAll;

  // KPI dihitung dari seluruh baris penilaian pada filter aktif (§11 mainIdea.md)
  const kkm = 70;
  const validAvgs = items.map((r) => r.nilaiAvg).filter((v) => v !== null);
  const rataRataPeriode =
    validAvgs.length > 0
      ? Math.round((validAvgs.reduce((acc, n) => acc + n, 0) / validAvgs.length) * 10) / 10
      : null;

  const distribusi = { A: 0, B: 0, C: 0, D: 0 };
  let lulusKkmCount = 0;
  for (const v of validAvgs) {
    const lbl = getGradeLabel(v);
    if (distribusi[lbl] !== undefined) distribusi[lbl] += 1;
    if (v >= kkm) lulusKkmCount += 1;
  }

  // Ringkasan rata-rata per peserta roster
  const targetRoster = kId
    ? lookups.rosterItems.filter((p) => Number(p.kelasId) === kId)
    : lookups.rosterItems;

  const byPeserta = new Map();
  for (const r of enrichedAll) {
    const pid = Number(r.pesertaId);
    if (!byPeserta.has(pid)) byPeserta.set(pid, []);
    if (r.nilaiAvg !== null) byPeserta.get(pid).push(r.nilaiAvg);
  }

  const studentSummary = targetRoster
    .map((p) => {
      const vals = byPeserta.get(Number(p.id)) || [];
      const avg =
        vals.length > 0
          ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10
          : null;
      return {
        pesertaId: p.id,
        mancationAkunId: p.mancationAkunId,
        pesertaNama: p.nama,
        kelasId: p.kelasId,
        kelasNama: p.namaKelas,
        jumlahUjian: vals.length,
        rataRata: avg,
        gradeLabel: getGradeLabel(avg),
        lulusKkm: avg !== null ? avg >= kkm : null,
      };
    })
    .filter((s) =>
      q
        ? s.pesertaNama.toLowerCase().includes(q) || String(s.mancationAkunId || '').includes(q)
        : true
    );

  return {
    periode: ym,
    syncMeta: lookups.syncMeta,
    kpi: {
      totalBaris: items.length,
      rataRataPeriode,
      distribusi,
      lulusKkmCount,
      kkm,
    },
    items,
    studentSummary,
    kelasOptions: lookups.kelasOptions,
    rosterOptions: lookups.rosterItems,
  };
}

export async function upsertNilaiUjian(payload, actor) {
  await ensureInitialized();
  const check = validateAndNormalizeNilaiUjian(payload);
  if (!check.ok) throw new Error(check.code);
  const d = check.normalized;

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `INSERT INTO nilai_ujian
        (peserta_id, kelas_id, tanggal_ujian, nama_ujian, tipe_penilaian, nilai_tunggal, moji_goi, bunpou, dokkai, choukai, catatan, diinput_oleh_staff_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (peserta_id, kelas_id, tanggal_ujian, nama_ujian)
       DO UPDATE SET
         tipe_penilaian = EXCLUDED.tipe_penilaian,
         nilai_tunggal = EXCLUDED.nilai_tunggal,
         moji_goi = EXCLUDED.moji_goi,
         bunpou = EXCLUDED.bunpou,
         dokkai = EXCLUDED.dokkai,
         choukai = EXCLUDED.choukai,
         catatan = EXCLUDED.catatan,
         diinput_oleh_staff_id = EXCLUDED.diinput_oleh_staff_id
       RETURNING id`,
      [
        d.pesertaId,
        d.kelasId,
        d.tanggalUjian,
        d.codeUjian,
        d.pola,
        d.nilaiTunggal,
        d.nilaiMojiGoi,
        d.nilaiBunpou,
        d.nilaiDokkai,
        d.nilaiChoukai,
        d.catatan,
        actor?.id || null,
      ]
    );
    await appendAudit(actor, 'UPSERT_NILAI_UJIAN', 'nilai_ujian', res.rows[0].id, { dataBaru: d });
    return { id: res.rows[0].id, ...d };
  }

  const db = readLocalState();
  const existing = db.nilaiUjian.find(
    (r) =>
      Number(r.pesertaId) === d.pesertaId &&
      Number(r.kelasId) === d.kelasId &&
      r.tanggalUjian === d.tanggalUjian &&
      String(r.codeUjian).toLowerCase() === d.codeUjian.toLowerCase()
  );

  if (existing) {
    const dataLama = { ...existing };
    Object.assign(existing, {
      pola: d.pola,
      codeUjian: d.codeUjian,
      nilaiTunggal: d.nilaiTunggal,
      nilaiMojiGoi: d.nilaiMojiGoi,
      nilaiBunpou: d.nilaiBunpou,
      nilaiDokkai: d.nilaiDokkai,
      nilaiChoukai: d.nilaiChoukai,
      catatan: d.catatan,
      penilaiId: actor?.id || existing.penilaiId,
    });
    appendLocalAudit(db, actor, 'UPSERT_NILAI_UJIAN', 'nilai_ujian', existing.id, { dataLama, dataBaru: d });
    saveLocalState();
    return { ...existing, nilaiAvg: d.nilaiAvg };
  }

  const created = {
    id: db.seq.nilaiUjian++,
    pesertaId: d.pesertaId,
    kelasId: d.kelasId,
    tanggalUjian: d.tanggalUjian,
    codeUjian: d.codeUjian,
    pola: d.pola,
    nilaiTunggal: d.nilaiTunggal,
    nilaiMojiGoi: d.nilaiMojiGoi,
    nilaiBunpou: d.nilaiBunpou,
    nilaiDokkai: d.nilaiDokkai,
    nilaiChoukai: d.nilaiChoukai,
    catatan: d.catatan,
    penilaiId: actor?.id || null,
    createdAt: new Date().toISOString(),
  };
  db.nilaiUjian.push(created);
  appendLocalAudit(db, actor, 'UPSERT_NILAI_UJIAN', 'nilai_ujian', created.id, { dataBaru: d });
  saveLocalState();
  return { ...created, nilaiAvg: d.nilaiAvg };
}

export async function updateNilaiUjian(idRaw, payload, actor) {
  await ensureInitialized();
  const id = Number(idRaw);
  const check = validateAndNormalizeNilaiUjian(payload);
  if (!id || !check.ok) throw new Error(check.code || 'VALIDATION_ERROR');
  const d = check.normalized;

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `UPDATE nilai_ujian SET
         peserta_id = $1, kelas_id = $2, tanggal_ujian = $3, nama_ujian = $4,
         tipe_penilaian = $5, nilai_tunggal = $6, moji_goi = $7, bunpou = $8,
         dokkai = $9, choukai = $10, catatan = $11, diinput_oleh_staff_id = $12
       WHERE id = $13 RETURNING id`,
      [
        d.pesertaId,
        d.kelasId,
        d.tanggalUjian,
        d.codeUjian,
        d.pola,
        d.nilaiTunggal,
        d.nilaiMojiGoi,
        d.nilaiBunpou,
        d.nilaiDokkai,
        d.nilaiChoukai,
        d.catatan,
        actor?.id || null,
        id,
      ]
    );
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'UPDATE_NILAI_UJIAN', 'nilai_ujian', id, { dataBaru: d });
    return { id, ...d };
  }

  const db = readLocalState();
  const row = db.nilaiUjian.find((r) => r.id === id);
  if (!row) throw new Error('NOT_FOUND');
  const duplicate = db.nilaiUjian.find(
    (r) =>
      r.id !== id &&
      Number(r.pesertaId) === d.pesertaId &&
      Number(r.kelasId) === d.kelasId &&
      r.tanggalUjian === d.tanggalUjian &&
      String(r.codeUjian).toLowerCase() === d.codeUjian.toLowerCase()
  );
  if (duplicate) throw new Error('DUPLICATE_NILAI_UJIAN');

  const dataLama = { ...row };
  Object.assign(row, {
    pesertaId: d.pesertaId,
    kelasId: d.kelasId,
    tanggalUjian: d.tanggalUjian,
    codeUjian: d.codeUjian,
    pola: d.pola,
    nilaiTunggal: d.nilaiTunggal,
    nilaiMojiGoi: d.nilaiMojiGoi,
    nilaiBunpou: d.nilaiBunpou,
    nilaiDokkai: d.nilaiDokkai,
    nilaiChoukai: d.nilaiChoukai,
    catatan: d.catatan,
    penilaiId: actor?.id || row.penilaiId,
  });
  appendLocalAudit(db, actor, 'UPDATE_NILAI_UJIAN', 'nilai_ujian', id, { dataLama, dataBaru: d });
  saveLocalState();
  return { ...row, nilaiAvg: d.nilaiAvg };
}

export async function deleteNilaiUjian(idRaw, actor) {
  await ensureInitialized();
  const id = Number(idRaw);
  if (getMode() === 'postgres') {
    const res = await getPool().query(`DELETE FROM nilai_ujian WHERE id = $1 RETURNING *`, [id]);
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'DELETE_NILAI_UJIAN', 'nilai_ujian', id, { dataLama: res.rows[0] });
    return { deleted: true };
  }
  const db = readLocalState();
  const idx = db.nilaiUjian.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error('NOT_FOUND');
  const [removed] = db.nilaiUjian.splice(idx, 1);
  appendLocalAudit(db, actor, 'DELETE_NILAI_UJIAN', 'nilai_ujian', id, { dataLama: removed });
  saveLocalState();
  return { deleted: true };
}

// ============================================================================
// 2. REKAP NILAI KAIWA (Grade A/B/C, Tanpa codeKaiwa, 3 Metrik Terpisah §13.1)
// ============================================================================
export async function listNilaiKaiwa({ periode, kelasId, grade, search } = {}) {
  await ensureInitialized();
  const ym = /^\d{4}-\d{2}$/.test(String(periode || '')) ? String(periode) : currentYearMonth();
  const kId = kelasId ? Number(kelasId) : null;
  const gFilter = grade && ['A', 'B', 'C'].includes(String(grade).toUpperCase()) ? String(grade).toUpperCase() : null;
  const q = String(search || '').trim().toLowerCase();

  const lookups = await loadAcademicLookups();
  let rawRows = [];

  if (getMode() === 'postgres') {
    const params = [ym];
    let sql = `
      SELECT
        id,
        peserta_id AS "pesertaId",
        kelas_id AS "kelasId",
        tanggal_sesi::text AS "tanggalKaiwa",
        grade,
        catatan AS "description",
        diinput_oleh_staff_id AS "penilaiId",
        created_at AS "createdAt"
      FROM nilai_kaiwa
      WHERE TO_CHAR(tanggal_sesi, 'YYYY-MM') = $1
    `;
    if (kId) {
      params.push(kId);
      sql += ` AND kelas_id = $${params.length}`;
    }
    sql += ` ORDER BY tanggal_sesi DESC, id DESC`;
    const res = await getPool().query(sql, params);
    rawRows = res.rows;
  } else {
    const db = readLocalState();
    rawRows = db.nilaiKaiwa
      .filter((r) => String(r.tanggalKaiwa || '').startsWith(ym) && (!kId || Number(r.kelasId) === kId))
      .sort((a, b) => String(b.tanggalKaiwa).localeCompare(String(a.tanggalKaiwa)) || b.id - a.id);
  }

  const targetRoster = kId
    ? lookups.rosterItems.filter((p) => Number(p.kelasId) === kId)
    : lookups.rosterItems;
  const targetRosterIds = targetRoster.map((p) => p.id);

  // 3 Metrik Terpisah §13.1 mainIdea.md
  const metrics = computeKaiwaMetricsForPeriod(targetRosterIds, rawRows);

  const countByPeserta = new Map();
  for (const r of rawRows) {
    const pid = Number(r.pesertaId);
    countByPeserta.set(pid, (countByPeserta.get(pid) || 0) + 1);
  }

  const studentSummary = targetRoster
    .map((p) => {
      const latest = metrics.latestByPeserta.get(Number(p.id)) || null;
      return {
        pesertaId: p.id,
        mancationAkunId: p.mancationAkunId,
        pesertaNama: p.nama,
        kelasId: p.kelasId,
        kelasNama: p.namaKelas,
        latestGrade: latest ? latest.grade : null,
        latestTanggal: latest ? latest.tanggalKaiwa : null,
        latestDescription: latest ? latest.description : '',
        jumlahSesi: countByPeserta.get(Number(p.id)) || 0,
      };
    })
    .filter((s) => {
      if (gFilter && s.latestGrade !== gFilter) return false;
      if (q && !s.pesertaNama.toLowerCase().includes(q) && !String(s.mancationAkunId || '').includes(q)) return false;
      return true;
    });

  const enrichedItems = rawRows
    .map((r) => {
      const p = lookups.pesertaById.get(Number(r.pesertaId));
      const kl = lookups.kelasById.get(Number(r.kelasId));
      const st = lookups.staffById.get(Number(r.penilaiId));
      return {
        ...r,
        pesertaNama: p?.nama || `Peserta #${r.pesertaId}`,
        mancationAkunId: p?.mancationAkunId || null,
        kelasNama: kl?.namaKelas || '-',
        penilaiNama: st?.nama || '-',
      };
    })
    .filter((r) => {
      if (gFilter && r.grade !== gFilter) return false;
      if (
        q &&
        !r.pesertaNama.toLowerCase().includes(q) &&
        !String(r.mancationAkunId || '').includes(q) &&
        !String(r.description || '').toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

  return {
    periode: ym,
    syncMeta: lookups.syncMeta,
    metrics: {
      distribusi: metrics.distribusi,
      rataPoinOrdinal: metrics.rataPoinOrdinal,
      jumlahSesi: metrics.jumlahSesi,
      totalPeserta: targetRoster.length,
    },
    studentSummary,
    items: enrichedItems,
    kelasOptions: lookups.kelasOptions,
    rosterOptions: lookups.rosterItems,
  };
}

export async function createNilaiKaiwa(payload, actor) {
  await ensureInitialized();
  const check = validateAndNormalizeNilaiKaiwa(payload);
  if (!check.ok) throw new Error(check.code);
  const d = check.normalized;

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `INSERT INTO nilai_kaiwa (peserta_id, kelas_id, tanggal_sesi, topik, grade, catatan, diinput_oleh_staff_id)
       VALUES ($1, $2, $3, '', $4, $5, $6) RETURNING id`,
      [d.pesertaId, d.kelasId, d.tanggalKaiwa, d.grade, d.description, actor?.id || null]
    );
    await appendAudit(actor, 'CREATE_NILAI_KAIWA', 'nilai_kaiwa', res.rows[0].id, { dataBaru: d });
    return { id: res.rows[0].id, ...d };
  }

  const db = readLocalState();
  const created = {
    id: db.seq.nilaiKaiwa++,
    pesertaId: d.pesertaId,
    kelasId: d.kelasId,
    tanggalKaiwa: d.tanggalKaiwa,
    grade: d.grade,
    description: d.description,
    penilaiId: actor?.id || null,
    createdAt: new Date().toISOString(),
  };
  db.nilaiKaiwa.push(created);
  appendLocalAudit(db, actor, 'CREATE_NILAI_KAIWA', 'nilai_kaiwa', created.id, { dataBaru: d });
  saveLocalState();
  return created;
}

export async function updateNilaiKaiwa(idRaw, payload, actor) {
  await ensureInitialized();
  const id = Number(idRaw);
  const check = validateAndNormalizeNilaiKaiwa(payload);
  if (!id || !check.ok) throw new Error(check.code || 'VALIDATION_ERROR');
  const d = check.normalized;

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `UPDATE nilai_kaiwa SET peserta_id = $1, kelas_id = $2, tanggal_sesi = $3, grade = $4, catatan = $5, diinput_oleh_staff_id = $6
       WHERE id = $7 RETURNING id`,
      [d.pesertaId, d.kelasId, d.tanggalKaiwa, d.grade, d.description, actor?.id || null, id]
    );
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'UPDATE_NILAI_KAIWA', 'nilai_kaiwa', id, { dataBaru: d });
    return { id, ...d };
  }

  const db = readLocalState();
  const row = db.nilaiKaiwa.find((r) => r.id === id);
  if (!row) throw new Error('NOT_FOUND');
  const dataLama = { ...row };
  Object.assign(row, {
    pesertaId: d.pesertaId,
    kelasId: d.kelasId,
    tanggalKaiwa: d.tanggalKaiwa,
    grade: d.grade,
    description: d.description,
    penilaiId: actor?.id || row.penilaiId,
  });
  appendLocalAudit(db, actor, 'UPDATE_NILAI_KAIWA', 'nilai_kaiwa', id, { dataLama, dataBaru: d });
  saveLocalState();
  return row;
}

export async function deleteNilaiKaiwa(idRaw, actor) {
  await ensureInitialized();
  const id = Number(idRaw);
  if (getMode() === 'postgres') {
    const res = await getPool().query(`DELETE FROM nilai_kaiwa WHERE id = $1 RETURNING *`, [id]);
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'DELETE_NILAI_KAIWA', 'nilai_kaiwa', id, { dataLama: res.rows[0] });
    return { deleted: true };
  }
  const db = readLocalState();
  const idx = db.nilaiKaiwa.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error('NOT_FOUND');
  const [removed] = db.nilaiKaiwa.splice(idx, 1);
  appendLocalAudit(db, actor, 'DELETE_NILAI_KAIWA', 'nilai_kaiwa', id, { dataLama: removed });
  saveLocalState();
  return { deleted: true };
}

// ============================================================================
// 3. REKAP NILAI SIKAP (Basis 75, Clamp 0-100, KKM 70, Magnitude Positif §4)
// ============================================================================
export async function listNilaiSikap({ periode, kelasId, sentiment, search } = {}) {
  await ensureInitialized();
  const ym = /^\d{4}-\d{2}$/.test(String(periode || '')) ? String(periode) : currentYearMonth();
  const kId = kelasId ? Number(kelasId) : null;
  const sFilter = sentiment === 'positif' || sentiment === 'negatif' ? sentiment : null;
  const q = String(search || '').trim().toLowerCase();

  const lookups = await loadAcademicLookups();
  let rawRows = [];

  if (getMode() === 'postgres') {
    const params = [ym];
    let sql = `
      SELECT
        id,
        peserta_id AS "pesertaId",
        kelas_id AS "kelasId",
        kategori_id AS "kategoriId",
        tanggal::text AS "tanggalPenilaian",
        sentiment,
        ABS(bobot)::float AS "bobot",
        keterangan AS "description",
        diinput_oleh_staff_id AS "penilaiId",
        created_at AS "createdAt"
      FROM nilai_sikap
      WHERE TO_CHAR(tanggal, 'YYYY-MM') = $1
    `;
    if (kId) {
      params.push(kId);
      sql += ` AND kelas_id = $${params.length}`;
    }
    sql += ` ORDER BY tanggal DESC, id DESC`;
    const res = await getPool().query(sql, params);
    rawRows = res.rows;
  } else {
    const db = readLocalState();
    rawRows = db.nilaiSikap
      .filter((r) => String(r.tanggalPenilaian || '').startsWith(ym) && (!kId || Number(r.kelasId) === kId))
      .sort((a, b) => String(b.tanggalPenilaian).localeCompare(String(a.tanggalPenilaian)) || b.id - a.id);
  }

  const targetRoster = kId
    ? lookups.rosterItems.filter((p) => Number(p.kelasId) === kId)
    : lookups.rosterItems;

  const eventsByPeserta = new Map();
  for (const r of rawRows) {
    const pid = Number(r.pesertaId);
    if (!eventsByPeserta.has(pid)) eventsByPeserta.set(pid, []);
    eventsByPeserta.get(pid).push(r);
  }

  const kkm = 70;
  const basis = 75;

  const allStudentSummaries = targetRoster.map((p) => {
    const evs = eventsByPeserta.get(Number(p.id)) || [];
    const sum = computeSikapSummary(evs, basis, kkm);
    return {
      pesertaId: p.id,
      mancationAkunId: p.mancationAkunId,
      pesertaNama: p.nama,
      kelasId: p.kelasId,
      kelasNama: p.namaKelas,
      ...sum,
    };
  });

  const rataSkorSikap =
    allStudentSummaries.length > 0
      ? Math.round(
          (allStudentSummaries.reduce((acc, s) => acc + s.skorAkhir, 0) / allStudentSummaries.length) * 10
        ) / 10
      : basis;

  const diBawahKkmCount = allStudentSummaries.filter((s) => !s.lulusKkm).length;
  const jumlahKejadianPositif = rawRows.filter((r) => r.sentiment === 'positif').length;
  const jumlahKejadianNegatif = rawRows.filter((r) => r.sentiment === 'negatif').length;

  const studentSummary = allStudentSummaries.filter((s) =>
    q ? s.pesertaNama.toLowerCase().includes(q) || String(s.mancationAkunId || '').includes(q) : true
  );

  const items = rawRows
    .map((r) => {
      const p = lookups.pesertaById.get(Number(r.pesertaId));
      const kl = lookups.kelasById.get(Number(r.kelasId));
      const st = lookups.staffById.get(Number(r.penilaiId));
      const kat = r.kategoriId ? lookups.kategoriById.get(Number(r.kategoriId)) : null;
      return {
        ...r,
        pesertaNama: p?.nama || `Peserta #${r.pesertaId}`,
        mancationAkunId: p?.mancationAkunId || null,
        kelasNama: kl?.namaKelas || '-',
        penilaiNama: st?.nama || '-',
        kategoriNamaId: kat?.namaId || '-',
        kategoriNamaJa: kat?.namaJa || '-',
      };
    })
    .filter((r) => {
      if (sFilter && r.sentiment !== sFilter) return false;
      if (
        q &&
        !r.pesertaNama.toLowerCase().includes(q) &&
        !String(r.mancationAkunId || '').includes(q) &&
        !String(r.description || '').toLowerCase().includes(q) &&
        !String(r.kategoriNamaId || '').toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });

  return {
    periode: ym,
    syncMeta: lookups.syncMeta,
    kpi: {
      rataSkorSikap,
      jumlahKejadianPositif,
      jumlahKejadianNegatif,
      diBawahKkmCount,
      kkm,
      basis,
    },
    studentSummary,
    items,
    kategoriOptions: lookups.kategoriOptions,
    kelasOptions: lookups.kelasOptions,
    rosterOptions: lookups.rosterItems,
  };
}

export async function createNilaiSikap(payload, actor) {
  await ensureInitialized();
  const check = validateAndNormalizeNilaiSikap(payload);
  if (!check.ok) throw new Error(check.code);
  const d = check.normalized;

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `INSERT INTO nilai_sikap (peserta_id, kelas_id, kategori_id, tanggal, sentiment, bobot, keterangan, diinput_oleh_staff_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [d.pesertaId, d.kelasId, d.kategoriId, d.tanggalPenilaian, d.sentiment, d.bobot, d.description, actor?.id || null]
    );
    await appendAudit(actor, 'CREATE_NILAI_SIKAP', 'nilai_sikap', res.rows[0].id, { dataBaru: d });
    return { id: res.rows[0].id, ...d };
  }

  const db = readLocalState();
  const created = {
    id: db.seq.nilaiSikap++,
    pesertaId: d.pesertaId,
    kelasId: d.kelasId,
    kategoriId: d.kategoriId,
    tanggalPenilaian: d.tanggalPenilaian,
    sentiment: d.sentiment,
    bobot: d.bobot,
    description: d.description,
    penilaiId: actor?.id || null,
    createdAt: new Date().toISOString(),
  };
  db.nilaiSikap.push(created);
  appendLocalAudit(db, actor, 'CREATE_NILAI_SIKAP', 'nilai_sikap', created.id, { dataBaru: d });
  saveLocalState();
  return created;
}

export async function updateNilaiSikap(idRaw, payload, actor) {
  await ensureInitialized();
  const id = Number(idRaw);
  const check = validateAndNormalizeNilaiSikap(payload);
  if (!id || !check.ok) throw new Error(check.code || 'VALIDATION_ERROR');
  const d = check.normalized;

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `UPDATE nilai_sikap SET
         peserta_id = $1, kelas_id = $2, kategori_id = $3, tanggal = $4,
         sentiment = $5, bobot = $6, keterangan = $7, diinput_oleh_staff_id = $8
       WHERE id = $9 RETURNING id`,
      [d.pesertaId, d.kelasId, d.kategoriId, d.tanggalPenilaian, d.sentiment, d.bobot, d.description, actor?.id || null, id]
    );
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'UPDATE_NILAI_SIKAP', 'nilai_sikap', id, { dataBaru: d });
    return { id, ...d };
  }

  const db = readLocalState();
  const row = db.nilaiSikap.find((r) => r.id === id);
  if (!row) throw new Error('NOT_FOUND');
  const dataLama = { ...row };
  Object.assign(row, {
    pesertaId: d.pesertaId,
    kelasId: d.kelasId,
    kategoriId: d.kategoriId,
    tanggalPenilaian: d.tanggalPenilaian,
    sentiment: d.sentiment,
    bobot: d.bobot,
    description: d.description,
    penilaiId: actor?.id || row.penilaiId,
  });
  appendLocalAudit(db, actor, 'UPDATE_NILAI_SIKAP', 'nilai_sikap', id, { dataLama, dataBaru: d });
  saveLocalState();
  return row;
}

export async function deleteNilaiSikap(idRaw, actor) {
  await ensureInitialized();
  const id = Number(idRaw);
  if (getMode() === 'postgres') {
    const res = await getPool().query(`DELETE FROM nilai_sikap WHERE id = $1 RETURNING *`, [id]);
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'DELETE_NILAI_SIKAP', 'nilai_sikap', id, { dataLama: res.rows[0] });
    return { deleted: true };
  }
  const db = readLocalState();
  const idx = db.nilaiSikap.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error('NOT_FOUND');
  const [removed] = db.nilaiSikap.splice(idx, 1);
  appendLocalAudit(db, actor, 'DELETE_NILAI_SIKAP', 'nilai_sikap', id, { dataLama: removed });
  saveLocalState();
  return { deleted: true };
}

// ============================================================================
// 4. REKAP ABSENSI & WIZARD HARIAN + PENGINGAT BELUM DIISI (§5 & §14.5)
// ============================================================================
export async function getAbsensiBelumDiisi(tanggalRaw) {
  await ensureInitialized();
  const tanggal = /^\d{4}-\d{2}-\d{2}$/.test(String(tanggalRaw || '')) ? String(tanggalRaw) : todayIsoDate();
  const kelasData = await listKelas();
  const activeKelas = kelasData.items.filter((k) => k.status === 'aktif');

  let recordedKelasIds = new Set();
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `SELECT DISTINCT kelas_id AS "kelasId" FROM absensi WHERE tanggal = $1`,
      [tanggal]
    );
    recordedKelasIds = new Set(res.rows.map((r) => Number(r.kelasId)));
  } else {
    const db = readLocalState();
    recordedKelasIds = new Set(
      db.absensi.filter((a) => a.tanggalAbsensi === tanggal).map((a) => Number(a.kelasId))
    );
  }

  const belumDiisi = activeKelas
    .filter((k) => !recordedKelasIds.has(Number(k.id)))
    .map((k) => ({
      id: k.id,
      namaKelas: k.namaKelas,
      senseiNama: k.senseiNama || '-',
      jumlahPeserta: k.jumlahPeserta || 0,
    }));

  return {
    tanggal,
    totalKelasAktif: activeKelas.length,
    belumDiisi,
  };
}

export async function getAbsensiPageData({ periode, kelasId, tanggalWizard } = {}) {
  await ensureInitialized();
  const ym = /^\d{4}-\d{2}$/.test(String(periode || '')) ? String(periode) : currentYearMonth();
  const tgl = /^\d{4}-\d{2}-\d{2}$/.test(String(tanggalWizard || '')) ? String(tanggalWizard) : todayIsoDate();

  const lookups = await loadAcademicLookups();
  const defaultKelas = lookups.kelasOptions.find((k) => k.status === 'aktif') || lookups.kelasOptions[0] || null;
  const targetKelasId = kelasId ? Number(kelasId) : defaultKelas ? Number(defaultKelas.id) : null;

  let monthRows = [];
  let wizardDayRows = [];

  if (targetKelasId) {
    if (getMode() === 'postgres') {
      const [mRes, dRes] = await Promise.all([
        getPool().query(
          `SELECT id, peserta_id AS "pesertaId", kelas_id AS "kelasId", tanggal::text AS "tanggalAbsensi",
                  status, keterangan AS "description", diinput_oleh_staff_id AS "penilaiId"
           FROM absensi
           WHERE kelas_id = $1 AND TO_CHAR(tanggal, 'YYYY-MM') = $2`,
          [targetKelasId, ym]
        ),
        getPool().query(
          `SELECT id, peserta_id AS "pesertaId", kelas_id AS "kelasId", tanggal::text AS "tanggalAbsensi",
                  status, keterangan AS "description", diinput_oleh_staff_id AS "penilaiId"
           FROM absensi
           WHERE kelas_id = $1 AND tanggal = $2`,
          [targetKelasId, tgl]
        ),
      ]);
      monthRows = mRes.rows;
      wizardDayRows = dRes.rows;
    } else {
      const db = readLocalState();
      monthRows = db.absensi.filter(
        (r) => Number(r.kelasId) === targetKelasId && String(r.tanggalAbsensi || '').startsWith(ym)
      );
      wizardDayRows = db.absensi.filter(
        (r) => Number(r.kelasId) === targetKelasId && r.tanggalAbsensi === tgl
      );
    }
  }

  const classRoster = targetKelasId
    ? lookups.rosterItems.filter((p) => Number(p.kelasId) === targetKelasId)
    : [];
  const classRosterIds = classRoster.map((p) => p.id);

  // Rekap bulanan memakai rumus S = COUNT(DISTINCT tanggalAbsensi) §5 mainIdea.md
  const monthlyCalc = computeClassMonthlyAbsensi(classRosterIds, monthRows);

  const studentRecap = classRoster.map((p) => {
    const st = monthlyCalc.studentStats.get(Number(p.id)) || {
      hadir: 0,
      sakit: 0,
      izin: 0,
      alfa: 0,
      sesiKelas: monthlyCalc.sesiKelas,
      nonHadir: 0,
      rasioKehadiran: null,
      rasioKetidakhadiran: null,
    };
    return {
      pesertaId: p.id,
      mancationAkunId: p.mancationAkunId,
      pesertaNama: p.nama,
      tanggalMasuk: p.tanggalMasuk || null,
      ...st,
    };
  });

  // Wizard harian: default 'hadir' bila sesi tanggal tersebut belum diisi!
  const dayByPeserta = new Map(wizardDayRows.map((r) => [Number(r.pesertaId), r]));
  const alreadyRecorded = wizardDayRows.length > 0;

  const wizardRows = classRoster.map((p) => {
    const saved = dayByPeserta.get(Number(p.id));
    return {
      pesertaId: p.id,
      mancationAkunId: p.mancationAkunId,
      pesertaNama: p.nama,
      status: saved ? saved.status : 'hadir',
      description: saved ? saved.description || '' : '',
    };
  });

  const pengingatHariIni = await getAbsensiBelumDiisi(todayIsoDate());

  return {
    periode: ym,
    tanggalWizard: tgl,
    kelasId: targetKelasId,
    syncMeta: lookups.syncMeta,
    kelasOptions: lookups.kelasOptions,
    monthly: {
      sesiKelas: monthlyCalc.sesiKelas,
      tanggalTercatat: monthlyCalc.tanggalTercatat,
      rasioKelas: monthlyCalc.rasioKelas,
      jumlahPesertaRoster: classRoster.length,
      studentRecap,
    },
    wizard: {
      alreadyRecorded,
      rows: wizardRows,
    },
    pengingatHariIni,
  };
}

export async function submitAbsensiWizard(payload, actor) {
  await ensureInitialized();
  const kelasId = Number(payload?.kelasId);
  const tanggalAbsensi = String(payload?.tanggalAbsensi || '').trim();
  const entries = Array.isArray(payload?.entries) ? payload.entries : [];

  if (!Number.isInteger(kelasId) || kelasId <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(tanggalAbsensi)) {
    throw new Error('VALIDATION_ERROR');
  }
  if (entries.length === 0) {
    throw new Error('EMPTY_ABSENSI_ENTRIES');
  }

  const normalizedEntries = entries.map((e) => {
    const pesertaId = Number(e?.pesertaId);
    const status = String(e?.status || 'hadir').toLowerCase();
    const description = String(e?.description || '').trim();
    if (!Number.isInteger(pesertaId) || pesertaId <= 0 || !VALID_ABSENSI_STATUS.includes(status)) {
      throw new Error('VALIDATION_ERROR');
    }
    return { pesertaId, status, description };
  });

  if (getMode() === 'postgres') {
    const client = await getPool().connect();
    try {
      await client.query('BEGIN');
      for (const item of normalizedEntries) {
        await client.query(
          `INSERT INTO absensi (peserta_id, kelas_id, tanggal, status, keterangan, diinput_oleh_staff_id, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())
           ON CONFLICT (peserta_id, kelas_id, tanggal)
           DO UPDATE SET
             status = EXCLUDED.status,
             keterangan = EXCLUDED.keterangan,
             diinput_oleh_staff_id = EXCLUDED.diinput_oleh_staff_id,
             updated_at = NOW()`,
          [item.pesertaId, kelasId, tanggalAbsensi, item.status, item.description, actor?.id || null]
        );
      }
      await client.query(
        `INSERT INTO audit_log (staff_id, staff_nama, aksi, entitas, entitas_id, detail)
         VALUES ($1, $2, 'SUBMIT_ABSENSI_HARIAN', 'absensi', $3, $4)`,
        [
          actor?.id || null,
          actor?.nama || 'System',
          `${kelasId}:${tanggalAbsensi}`,
          JSON.stringify({
            kelasId,
            tanggalAbsensi,
            totalPeserta: normalizedEntries.length,
            hadir: normalizedEntries.filter((x) => x.status === 'hadir').length,
            nonHadir: normalizedEntries.filter((x) => x.status !== 'hadir').length,
          }),
        ]
      );
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    return { savedCount: normalizedEntries.length, kelasId, tanggalAbsensi };
  }

  const db = readLocalState();
  const nowIso = new Date().toISOString();
  for (const item of normalizedEntries) {
    const existing = db.absensi.find(
      (r) =>
        Number(r.pesertaId) === item.pesertaId &&
        Number(r.kelasId) === kelasId &&
        r.tanggalAbsensi === tanggalAbsensi
    );
    if (existing) {
      existing.status = item.status;
      existing.description = item.description;
      existing.penilaiId = actor?.id || existing.penilaiId;
      existing.updatedAt = nowIso;
    } else {
      db.absensi.push({
        id: db.seq.absensi++,
        pesertaId: item.pesertaId,
        kelasId,
        tanggalAbsensi,
        status: item.status,
        description: item.description,
        penilaiId: actor?.id || null,
        updatedAt: nowIso,
      });
    }
  }

  appendLocalAudit(db, actor, 'SUBMIT_ABSENSI_HARIAN', 'absensi', `${kelasId}:${tanggalAbsensi}`, {
    kelasId,
    tanggalAbsensi,
    totalPeserta: normalizedEntries.length,
    hadir: normalizedEntries.filter((x) => x.status === 'hadir').length,
    nonHadir: normalizedEntries.filter((x) => x.status !== 'hadir').length,
  });
  saveLocalState();
  return { savedCount: normalizedEntries.length, kelasId, tanggalAbsensi };
}

// ============================================================================
// 5. RIWAYAT AKTIVITAS (AUDIT LOG §14.5)
// ============================================================================
export async function listAuditLogs({ periode, entitas, search, limit = 250 } = {}) {
  await ensureInitialized();
  const ym = /^\d{4}-\d{2}$/.test(String(periode || '')) ? String(periode) : '';
  const ent = String(entitas || '').trim();
  const q = String(search || '').trim().toLowerCase();
  const maxRows = Math.min(Math.max(Number(limit) || 250, 20), 500);

  let rows = [];
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `SELECT id, staff_id AS "staffId", staff_nama AS "staffNama", aksi, entitas,
              entitas_id AS "entitasId", detail, created_at AS "createdAt"
       FROM audit_log
       ORDER BY created_at DESC, id DESC
       LIMIT $1`,
      [maxRows]
    );
    rows = res.rows;
  } else {
    const db = readLocalState();
    rows = db.auditLog.slice(0, maxRows);
  }

  const entitasOptions = [...new Set(rows.map((r) => r.entitas).filter(Boolean))].sort();

  const items = rows.filter((r) => {
    if (ym && !String(r.createdAt || '').startsWith(ym)) return false;
    if (ent && r.entitas !== ent) return false;
    if (
      q &&
      !String(r.staffNama || '').toLowerCase().includes(q) &&
      !String(r.aksi || '').toLowerCase().includes(q) &&
      !String(r.entitas || '').toLowerCase().includes(q) &&
      !String(r.entitasId || '').toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });

  return {
    items,
    entitasOptions,
  };
}
