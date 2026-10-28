import {
  ensureInitialized,
  getMode,
  getPool,
  readLocalState,
  saveLocalState,
  appendAudit,
  appendLocalAudit,
} from './engine.js';
import { isDemoSeedEnabled, SEED_MANCATION_OUTSIDE_CANDIDATES } from './seedData.js';
import { findPrefectureById } from './prefectures.js';
import { formatPersonName } from '../domain/nameFormat.js';
import {
  fetchMancationRoster,
  lookupMancationAccountById,
  getMancationStatusMeta,
} from './mancation.js';
import {
  reconcileRosterWithLocalPeserta,
  validateManualPesertaInput,
  VALID_STATUS_TAGS,
  VALID_KETERANGAN_LUAR,
} from '../domain/rules.js';

async function getSnapshotFallbackFromDb() {
  if (getMode() === 'postgres') {
    const pool = getPool();
    const [kRes, pRes] = await Promise.all([
      pool.query(`SELECT mancation_class_id AS "mancationClassId", nama_kelas AS "namaKelas", program_studi AS "programStudi", class_stat AS "classStat", synced_at AS "syncedAt" FROM mancation_kelas_cache`),
      pool.query(`SELECT mancation_akun_id AS "mancationAkunId", mancation_class_id AS "mancationClassId", nama, email, whatsapp, tanggal_lahir::text AS "tanggalLahir", status_pernikahan AS "statusPernikahan", jumlah_anak AS "jumlahAnak", agama, alamat AS "daerahAsal", synced_at AS "syncedAt" FROM mancation_peserta_cache`),
    ]);
    return {
      syncedAt: kRes.rows[0]?.syncedAt || new Date().toISOString(),
      classes: kRes.rows,
      students: pRes.rows.map((r) => ({ ...r, cliId: 9 })),
    };
  }
  const db = readLocalState();
  return {
    syncedAt: db.mancationKelasCache[0]?.syncedAt || new Date().toISOString(),
    classes: db.mancationKelasCache,
    students: db.mancationPesertaCache,
  };
}

export async function syncMancationAndReconcile() {
  await ensureInitialized();

  let activeClassIds = [139, 142, 144];
  let allLocalKelas = [];

  if (getMode() === 'postgres') {
    const kRes = await getPool().query(
      `SELECT id, nama_kelas AS "namaKelas", mancation_class_id AS "mancationClassId", deleted_at AS "deletedAt" FROM kelas WHERE deleted_at IS NULL`
    );
    allLocalKelas = kRes.rows;
  } else {
    allLocalKelas = readLocalState().kelas.filter((k) => !k.deletedAt);
  }

  const configuredIds = allLocalKelas
    .map((k) => Number(k.mancationClassId))
    .filter((n) => Number.isInteger(n) && n > 0);
  if (configuredIds.length > 0) {
    activeClassIds = [...new Set([...activeClassIds, ...configuredIds])];
  }

  const snapshotFallback = await getSnapshotFallbackFromDb();
  const mancationData = await fetchMancationRoster(activeClassIds, snapshotFallback);

  const kelasByMancationId = new Map(
    allLocalKelas.filter((k) => k.mancationClassId).map((k) => [Number(k.mancationClassId), k])
  );

  if (getMode() === 'postgres') {
    const pool = getPool();
    if (mancationData.source === 'live') {
      for (const mc of mancationData.classes) {
        await pool.query(
          `INSERT INTO mancation_kelas_cache (mancation_class_id, nama_kelas, program_studi, class_stat, synced_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (mancation_class_id) DO UPDATE SET
             nama_kelas = EXCLUDED.nama_kelas, program_studi = EXCLUDED.program_studi,
             class_stat = EXCLUDED.class_stat, synced_at = NOW()`,
          [mc.mancationClassId, mc.namaKelas, mc.programStudi || '', mc.classStat || 1]
        );
      }
      for (const ms of mancationData.students) {
        await pool.query(
          `INSERT INTO mancation_peserta_cache
            (mancation_akun_id, mancation_class_id, nama, email, whatsapp, tanggal_lahir, status_pernikahan, jumlah_anak, agama, alamat, synced_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
           ON CONFLICT (mancation_akun_id) DO UPDATE SET
             mancation_class_id = EXCLUDED.mancation_class_id, nama = EXCLUDED.nama,
             email = EXCLUDED.email, whatsapp = EXCLUDED.whatsapp,
             tanggal_lahir = EXCLUDED.tanggal_lahir, status_pernikahan = EXCLUDED.status_pernikahan,
             jumlah_anak = EXCLUDED.jumlah_anak, agama = EXCLUDED.agama,
             alamat = EXCLUDED.alamat, synced_at = NOW()`,
          [
            ms.mancationAkunId,
            ms.mancationClassId,
            ms.nama,
            ms.email || '',
            ms.whatsapp || '',
            ms.tanggalLahir || null,
            ms.statusPernikahan || '',
            ms.jumlahAnak ?? null,
            ms.agama || '',
            ms.daerahAsal || '',
          ]
        );
      }
    }

    const existingRes = await pool.query(
      `SELECT id, mancation_akun_id AS "mancationAkunId", kelas_id AS "kelasId", status_tag AS "statusTag", sumber, keterangan_luar_kelas AS "keteranganLuarKelas" FROM peserta`
    );
    const { toInsert, toUpdate } = reconcileRosterWithLocalPeserta(
      mancationData.students,
      existingRes.rows,
      kelasByMancationId
    );
    for (const ins of toInsert) {
      await pool.query(
        `INSERT INTO peserta (mancation_akun_id, kelas_id, status_tag, sumber, keterangan_luar_kelas, alasan)
         VALUES ($1, $2, $3, 'roster', NULL, '') ON CONFLICT (mancation_akun_id) DO NOTHING`,
        [ins.mancationAkunId, ins.kelasId, ins.statusTag]
      );
    }
    for (const upd of toUpdate) {
      await pool.query(
        `UPDATE peserta SET kelas_id = $1, sumber = 'roster', keterangan_luar_kelas = NULL, updated_at = NOW() WHERE id = $2`,
        [upd.kelasId, upd.id]
      );
    }
  } else {
    const db = readLocalState();
    const nowIso = new Date().toISOString();
    if (mancationData.source === 'live') {
      db.mancationKelasCache = mancationData.classes.map((c) => ({ ...c, syncedAt: nowIso }));
      const byAkun = new Map(db.mancationPesertaCache.map((s) => [Number(s.mancationAkunId), s]));
      for (const s of mancationData.students) {
        byAkun.set(Number(s.mancationAkunId), { ...s, syncedAt: nowIso });
      }
      db.mancationPesertaCache = [...byAkun.values()];
    }

    const { toInsert, toUpdate } = reconcileRosterWithLocalPeserta(
      mancationData.students,
      db.peserta,
      kelasByMancationId
    );
    for (const ins of toInsert) {
      db.peserta.push({
        id: db.seq.peserta++,
        mancationAkunId: ins.mancationAkunId,
        kelasId: ins.kelasId,
        statusTag: 'standar',
        sumber: 'roster',
        keteranganLuarKelas: null,
        alasan: '',
        tanggalMasuk: null,
        pendidikanAkhir: '',
        pendidikanAkhirJa: '',
        tanggalLahirLokal: null,
        statusPernikahanLokal: '',
        jumlahAnakLokal: null,
        agamaLokal: '',
        daerahAsalLokal: '',
        catatanBebas: '',
        createdAt: nowIso,
        updatedAt: nowIso,
      });
    }
    for (const upd of toUpdate) {
      const target = db.peserta.find((p) => p.id === upd.id);
      if (target) {
        target.kelasId = upd.kelasId;
        target.sumber = 'roster';
        target.keteranganLuarKelas = null;
        target.updatedAt = nowIso;
      }
    }
    if (toInsert.length > 0 || toUpdate.length > 0 || mancationData.source === 'live') {
      saveLocalState();
    }
  }

  return mancationData;
}

export async function listKelas() {
  const mancationData = await syncMancationAndReconcile();

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `SELECT k.id, k.nama_kelas AS "namaKelas", k.program_id AS "programId",
              k.tanggal_start::text AS "tanggalStart", k.description,
              k.mancation_class_id AS "mancationClassId", k.sensei_id AS "senseiId", k.status,
              pr.nama_id AS "programNamaId", pr.nama_ja AS "programNamaJa", st.nama AS "senseiNama",
              (SELECT COUNT(*)::int FROM peserta p WHERE p.kelas_id = k.id AND p.sumber = 'roster') AS "jumlahPeserta",
              (SELECT COUNT(*)::int FROM peserta p WHERE p.kelas_id = k.id AND p.sumber = 'roster' AND p.status_tag = 'siap_interview') AS "jumlahSiapInterview"
       FROM kelas k
       LEFT JOIN program pr ON pr.id = k.program_id
       LEFT JOIN staff st ON st.id = k.sensei_id
       WHERE k.deleted_at IS NULL ORDER BY k.status ASC, k.id ASC`
    );
    return {
      items: res.rows,
      mancationClasses: mancationData.classes,
      mancationSync: {
        source: mancationData.source,
        configured: mancationData.configured,
        syncedAt: mancationData.syncedAt,
        errorMessage: mancationData.errorMessage,
      },
    };
  }

  const db = readLocalState();
  const items = db.kelas
    .filter((k) => !k.deletedAt)
    .map((k) => {
      const pr = db.programs.find((p) => p.id === k.programId);
      const st = db.staff.find((s) => s.id === k.senseiId);
      const rosterInClass = db.peserta.filter((p) => p.kelasId === k.id && p.sumber === 'roster');
      return {
        ...k,
        programNamaId: pr?.namaId || '',
        programNamaJa: pr?.namaJa || '',
        senseiNama: st?.nama || '',
        jumlahPeserta: rosterInClass.length,
        jumlahSiapInterview: rosterInClass.filter((p) => p.statusTag === 'siap_interview').length,
      };
    });

  return {
    items,
    mancationClasses: mancationData.classes,
    mancationSync: {
      source: mancationData.source,
      configured: mancationData.configured,
      syncedAt: mancationData.syncedAt,
      errorMessage: mancationData.errorMessage,
    },
  };
}

export async function createKelas(payload, actor) {
  await ensureInitialized();
  const namaKelas = String(payload.namaKelas || '').trim();
  const programId = payload.programId ? Number(payload.programId) : null;
  const tanggalStart = String(payload.tanggalStart || '').slice(0, 10);
  const description = String(payload.description || '').trim();
  const mancationClassId = payload.mancationClassId ? Number(payload.mancationClassId) : null;
  const senseiId = payload.senseiId ? Number(payload.senseiId) : null;
  const status = payload.status === 'selesai' ? 'selesai' : 'aktif';

  if (!namaKelas || !/^\d{4}-\d{2}-\d{2}$/.test(tanggalStart)) throw new Error('VALIDATION_ERROR');

  if (getMode() === 'postgres') {
    const pool = getPool();
    if (mancationClassId) {
      const dup = await pool.query(`SELECT id FROM kelas WHERE mancation_class_id = $1 AND deleted_at IS NULL`, [mancationClassId]);
      if (dup.rows.length > 0) throw new Error('DUPLICATE_MANCATION_CLASS_ID');
    }
    const res = await pool.query(
      `INSERT INTO kelas (nama_kelas, program_id, tanggal_start, description, mancation_class_id, sensei_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, nama_kelas AS "namaKelas"`,
      [namaKelas, programId, tanggalStart, description, mancationClassId, senseiId, status]
    );
    await appendAudit(actor, 'CREATE_KELAS', 'kelas', res.rows[0].id, { namaKelas, mancationClassId });
    await syncMancationAndReconcile();
    return res.rows[0];
  }

  const db = readLocalState();
  if (mancationClassId && db.kelas.some((k) => !k.deletedAt && Number(k.mancationClassId) === mancationClassId)) {
    throw new Error('DUPLICATE_MANCATION_CLASS_ID');
  }
  const row = {
    id: db.seq.kelas++,
    namaKelas,
    programId,
    tanggalStart,
    description,
    mancationClassId,
    senseiId,
    status,
    deletedAt: null,
    createdAt: new Date().toISOString(),
  };
  db.kelas.push(row);
  appendLocalAudit(db, actor, 'CREATE_KELAS', 'kelas', row.id, { namaKelas, mancationClassId });
  saveLocalState();
  await syncMancationAndReconcile();
  return row;
}

export async function updateKelas(kelasId, payload, actor) {
  await ensureInitialized();
  const id = Number(kelasId);
  const namaKelas = String(payload.namaKelas || '').trim();
  const programId = payload.programId ? Number(payload.programId) : null;
  const tanggalStart = String(payload.tanggalStart || '').slice(0, 10);
  const description = String(payload.description || '').trim();
  const mancationClassId = payload.mancationClassId ? Number(payload.mancationClassId) : null;
  const senseiId = payload.senseiId ? Number(payload.senseiId) : null;
  const status = payload.status === 'selesai' ? 'selesai' : 'aktif';

  if (!id || !namaKelas || !/^\d{4}-\d{2}-\d{2}$/.test(tanggalStart)) throw new Error('VALIDATION_ERROR');

  if (getMode() === 'postgres') {
    const pool = getPool();
    if (mancationClassId) {
      const dup = await pool.query(`SELECT id FROM kelas WHERE mancation_class_id = $1 AND id <> $2 AND deleted_at IS NULL`, [mancationClassId, id]);
      if (dup.rows.length > 0) throw new Error('DUPLICATE_MANCATION_CLASS_ID');
    }
    const res = await pool.query(
      `UPDATE kelas SET nama_kelas = $1, program_id = $2, tanggal_start = $3, description = $4,
       mancation_class_id = $5, sensei_id = $6, status = $7 WHERE id = $8 AND deleted_at IS NULL RETURNING id, nama_kelas AS "namaKelas"`,
      [namaKelas, programId, tanggalStart, description, mancationClassId, senseiId, status, id]
    );
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'UPDATE_KELAS', 'kelas', id, { namaKelas, mancationClassId, status });
    await syncMancationAndReconcile();
    return res.rows[0];
  }

  const db = readLocalState();
  const target = db.kelas.find((k) => k.id === id && !k.deletedAt);
  if (!target) throw new Error('NOT_FOUND');
  if (mancationClassId && db.kelas.some((k) => !k.deletedAt && k.id !== id && Number(k.mancationClassId) === mancationClassId)) {
    throw new Error('DUPLICATE_MANCATION_CLASS_ID');
  }
  target.namaKelas = namaKelas;
  target.programId = programId;
  target.tanggalStart = tanggalStart;
  target.description = description;
  target.mancationClassId = mancationClassId;
  target.senseiId = senseiId;
  target.status = status;
  appendLocalAudit(db, actor, 'UPDATE_KELAS', 'kelas', id, { namaKelas, mancationClassId, status });
  saveLocalState();
  await syncMancationAndReconcile();
  return target;
}

export async function softDeleteKelas(kelasId, actor) {
  await ensureInitialized();
  const id = Number(kelasId);
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `UPDATE kelas SET deleted_at = NOW(), mancation_class_id = NULL WHERE id = $1 AND deleted_at IS NULL RETURNING id, nama_kelas`,
      [id]
    );
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'DELETE_KELAS', 'kelas', id, { namaKelas: res.rows[0].nama_kelas });
    return { deleted: true };
  }

  const db = readLocalState();
  const target = db.kelas.find((k) => k.id === id && !k.deletedAt);
  if (!target) throw new Error('NOT_FOUND');
  target.deletedAt = new Date().toISOString();
  target.mancationClassId = null;
  appendLocalAudit(db, actor, 'DELETE_KELAS', 'kelas', id, { namaKelas: target.namaKelas });
  saveLocalState();
  return { deleted: true };
}

function mergePesertaWithMancation(pRow, penempatanRow, kelasRow, mancationMap) {
  const m = mancationMap.get(Number(pRow.mancationAkunId)) || null;
  const pref = findPrefectureById(penempatanRow?.prefekturId);

  return {
    id: Number(pRow.id),
    mancationAkunId: Number(pRow.mancationAkunId),
    nama: formatPersonName(m?.nama) || `Peserta #${pRow.mancationAkunId}`,
    whatsapp: m?.whatsapp || '',
    kelasId: pRow.kelasId ? Number(pRow.kelasId) : null,
    namaKelas: kelasRow?.namaKelas || '',
    mancationClassId: kelasRow?.mancationClassId || m?.mancationClassId || null,
    statusTag: pRow.statusTag,
    sumber: pRow.sumber,
    keteranganLuarKelas: pRow.keteranganLuarKelas || null,
    alasan: pRow.alasan || '',
    tanggalLahir: m?.tanggalLahir || pRow.tanggalLahirLokal || null,
    statusPernikahan: m?.statusPernikahan || pRow.statusPernikahanLokal || '',
    jumlahAnak: m?.jumlahAnak != null ? m.jumlahAnak : pRow.jumlahAnakLokal ?? null,
    agama: m?.agama || pRow.agamaLokal || '',
    daerahAsal: m?.daerahAsal || pRow.daerahAsalLokal || '',
    tanggalLahirLokal: pRow.tanggalLahirLokal || null,
    statusPernikahanLokal: pRow.statusPernikahanLokal || '',
    jumlahAnakLokal: pRow.jumlahAnakLokal ?? null,
    agamaLokal: pRow.agamaLokal || '',
    daerahAsalLokal: pRow.daerahAsalLokal || '',
    hasMancationBiodata: Boolean(m?.tanggalLahir || m?.daerahAsal),
    // Follows the start date of the peserta's class until a different date is set by hand.
    tanggalMasuk: pRow.tanggalMasuk || kelasRow?.tanggalStart || null,
    tanggalMasukManual: Boolean(pRow.tanggalMasuk),
    tanggalMulaiKelas: kelasRow?.tanggalStart || null,
    pendidikanAkhir: pRow.pendidikanAkhir || '',
    pendidikanAkhirJa: pRow.pendidikanAkhirJa || '',
    catatanBebas: pRow.catatanBebas || '',
    penempatan: {
      tanggalLulusUjian: penempatanRow?.tanggalLulusUjian || null,
      perusahaanNaitei: penempatanRow?.perusahaanNaitei || '',
      jenisPekerjaan: penempatanRow?.jenisPekerjaan || '',
      prefekturId: penempatanRow?.prefekturId ? Number(penempatanRow.prefekturId) : null,
      prefekturNamaId: pref?.namaId || '',
      prefekturNamaJa: pref?.namaJa || '',
      lokasiKerja: penempatanRow?.lokasiKerja || '',
      rencanaMulaiKerja: penempatanRow?.rencanaMulaiKerja || null,
    },
  };
}

export async function listPeserta({ sumber = 'roster', kelasId = null, statusTag = null, keteranganLuar = null, search = '' } = {}) {
  const mancationData = await syncMancationAndReconcile();
  const snapshot = await getSnapshotFallbackFromDb();

  const mancationMap = new Map();
  for (const s of snapshot.students || []) mancationMap.set(Number(s.mancationAkunId), s);
  if (isDemoSeedEnabled()) {
    for (const s of SEED_MANCATION_OUTSIDE_CANDIDATES) {
      if (!mancationMap.has(s.mancationAkunId)) mancationMap.set(s.mancationAkunId, s);
    }
  }
  for (const s of mancationData.students || []) mancationMap.set(Number(s.mancationAkunId), s);

  let items = [];

  if (getMode() === 'postgres') {
    const pool = getPool();
    const [pRes, penRes, kRes] = await Promise.all([
      pool.query(
        `SELECT id, mancation_akun_id AS "mancationAkunId", kelas_id AS "kelasId", status_tag AS "statusTag",
                sumber, keterangan_luar_kelas AS "keteranganLuarKelas", alasan,
                tanggal_masuk::text AS "tanggalMasuk", pendidikan_akhir AS "pendidikanAkhir",
                pendidikan_akhir_ja AS "pendidikanAkhirJa",
                tanggal_lahir_lokal::text AS "tanggalLahirLokal", status_pernikahan_lokal AS "statusPernikahanLokal",
                jumlah_anak_lokal AS "jumlahAnakLokal", agama_lokal AS "agamaLokal",
                daerah_asal_lokal AS "daerahAsalLokal", catatan_bebas AS "catatanBebas"
         FROM peserta WHERE sumber = $1 ORDER BY id ASC`,
        [sumber]
      ),
      pool.query(
        `SELECT peserta_id AS "pesertaId", tanggal_lulus_ujian::text AS "tanggalLulusUjian",
                perusahaan_naitei AS "perusahaanNaitei", jenis_pekerjaan AS "jenisPekerjaan",
                prefektur_id AS "prefekturId", lokasi_kerja AS "lokasiKerja",
                rencana_mulai_kerja::text AS "rencanaMulaiKerja" FROM peserta_penempatan`
      ),
      pool.query(
        `SELECT id, nama_kelas AS "namaKelas", mancation_class_id AS "mancationClassId", tanggal_start::text AS "tanggalStart"
         FROM kelas WHERE deleted_at IS NULL`
      ),
    ]);

    const penMap = new Map(penRes.rows.map((r) => [Number(r.pesertaId), r]));
    const kMap = new Map(kRes.rows.map((k) => [Number(k.id), k]));

    for (const pRow of pRes.rows) {
      if (!mancationMap.has(Number(pRow.mancationAkunId))) {
        const lookedUp = await lookupMancationAccountById(pRow.mancationAkunId, snapshot);
        if (lookedUp) mancationMap.set(Number(pRow.mancationAkunId), lookedUp);
      }
    }

    items = pRes.rows.map((pRow) =>
      mergePesertaWithMancation(pRow, penMap.get(Number(pRow.id)), pRow.kelasId ? kMap.get(Number(pRow.kelasId)) : null, mancationMap)
    );
  } else {
    const db = readLocalState();
    const penMap = new Map(db.pesertaPenempatan.map((r) => [Number(r.pesertaId), r]));
    const kMap = new Map(db.kelas.filter((k) => !k.deletedAt).map((k) => [Number(k.id), k]));

    items = db.peserta
      .filter((p) => p.sumber === sumber)
      .map((pRow) =>
        mergePesertaWithMancation(pRow, penMap.get(Number(pRow.id)), pRow.kelasId ? kMap.get(Number(pRow.kelasId)) : null, mancationMap)
      );
  }

  if (kelasId) items = items.filter((x) => Number(x.kelasId) === Number(kelasId));
  if (statusTag && VALID_STATUS_TAGS.includes(statusTag)) items = items.filter((x) => x.statusTag === statusTag);
  if (keteranganLuar && VALID_KETERANGAN_LUAR.includes(keteranganLuar)) items = items.filter((x) => x.keteranganLuarKelas === keteranganLuar);

  const q = String(search || '').trim().toLowerCase();
  if (q) {
    items = items.filter(
      (x) =>
        x.nama.toLowerCase().includes(q) ||
        String(x.mancationAkunId).includes(q) ||
        x.penempatan.perusahaanNaitei.toLowerCase().includes(q) ||
        x.daerahAsal.toLowerCase().includes(q)
    );
  }

  return {
    items,
    mancationSync: {
      source: mancationData.source,
      configured: mancationData.configured,
      syncedAt: mancationData.syncedAt,
      errorMessage: mancationData.errorMessage,
    },
  };
}

export async function getPesertaDetail(pesertaId) {
  const id = Number(pesertaId);
  if (!id) throw new Error('NOT_FOUND');

  const [rosterRes, luarRes] = await Promise.all([
    listPeserta({ sumber: 'roster' }),
    listPeserta({ sumber: 'manual' }),
  ]);
  const found = [...rosterRes.items, ...luarRes.items].find((p) => p.id === id);
  if (!found) throw new Error('NOT_FOUND');

  let statusLogs = [];
  if (getMode() === 'postgres') {
    const logRes = await getPool().query(
      `SELECT l.id, l.status_lama AS "statusLama", l.status_baru AS "statusBaru",
              l.catatan, l.created_at AS "createdAt", COALESCE(s.nama, 'System') AS "staffNama"
       FROM peserta_status_log l LEFT JOIN staff s ON s.id = l.diubah_oleh_staff_id
       WHERE l.peserta_id = $1 ORDER BY l.created_at DESC, l.id DESC`,
      [id]
    );
    statusLogs = logRes.rows;
  } else {
    const db = readLocalState();
    statusLogs = db.pesertaStatusLog
      .filter((l) => Number(l.pesertaId) === id)
      .sort((a, b) => b.id - a.id)
      .map((l) => ({
        ...l,
        staffNama: db.staff.find((s) => s.id === l.diubahOlehStaffId)?.nama || 'Admin',
      }));
  }

  return { ...found, statusLogs };
}

function cleanOptionalDate(v) {
  if (!v) return null;
  const s = String(v).trim().slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}

// Only a date that differs from the class start is stored, so an unchanged peserta keeps following the class.
function tanggalMasukToStore(tanggalMasuk, tanggalMulaiKelas) {
  return tanggalMasuk && tanggalMasuk !== tanggalMulaiKelas ? tanggalMasuk : null;
}

export async function updatePesertaSupplementAndPenempatan(pesertaId, payload, actor) {
  await ensureInitialized();
  const id = Number(pesertaId);
  if (!id) throw new Error('VALIDATION_ERROR');

  const tanggalMasuk = cleanOptionalDate(payload.tanggalMasuk);
  const pendidikanAkhir = String(payload.pendidikanAkhir || '').trim();
  // Left out by clients that predate the field: keep the stored value instead of clearing it.
  const pendidikanAkhirJa = payload.pendidikanAkhirJa !== undefined ? String(payload.pendidikanAkhirJa || '').trim() : undefined;
  const catatanBebas = String(payload.catatanBebas || '').trim();
  const tanggalLahirLokal = cleanOptionalDate(payload.tanggalLahirLokal);
  const statusPernikahanLokal = String(payload.statusPernikahanLokal || '').trim();
  const jumlahAnakLokal =
    payload.jumlahAnakLokal !== '' && payload.jumlahAnakLokal != null
      ? Number(payload.jumlahAnakLokal)
      : null;
  const agamaLokal = String(payload.agamaLokal || '').trim();
  const daerahAsalLokal = String(payload.daerahAsalLokal || '').trim();

  const keteranganLuarKelas = VALID_KETERANGAN_LUAR.includes(payload.keteranganLuarKelas)
    ? payload.keteranganLuarKelas
    : undefined;
  const alasan = payload.alasan !== undefined ? String(payload.alasan || '').trim() : undefined;

  const pen = payload.penempatan || {};
  const tanggalLulusUjian = cleanOptionalDate(pen.tanggalLulusUjian);
  const perusahaanNaitei = String(pen.perusahaanNaitei || '').trim();
  const jenisPekerjaan = String(pen.jenisPekerjaan || '').trim();
  const prefekturId = pen.prefekturId ? Number(pen.prefekturId) : null;
  const lokasiKerja = String(pen.lokasiKerja || '').trim();
  const rencanaMulaiKerja = cleanOptionalDate(pen.rencanaMulaiKerja);

  if (getMode() === 'postgres') {
    const pool = getPool();
    const pCheck = await pool.query(
      `SELECT p.id, p.sumber, p.keterangan_luar_kelas, p.alasan, k.tanggal_start::text AS tanggal_mulai_kelas
       FROM peserta p LEFT JOIN kelas k ON k.id = p.kelas_id AND k.deleted_at IS NULL
       WHERE p.id = $1`,
      [id]
    );
    if (pCheck.rows.length === 0) throw new Error('NOT_FOUND');
    const cur = pCheck.rows[0];
    const tanggalMasukDisimpan = tanggalMasukToStore(tanggalMasuk, cur.tanggal_mulai_kelas);
    const nextKet = cur.sumber === 'manual' && keteranganLuarKelas ? keteranganLuarKelas : cur.keterangan_luar_kelas;
    const nextAlasan = cur.sumber === 'manual' && alasan !== undefined ? alasan : cur.alasan;

    await pool.query(
      `UPDATE peserta
       SET tanggal_masuk = $1, pendidikan_akhir = $2, catatan_bebas = $3,
           tanggal_lahir_lokal = $4, status_pernikahan_lokal = $5, jumlah_anak_lokal = $6,
           agama_lokal = $7, daerah_asal_lokal = $8,
           keterangan_luar_kelas = $9, alasan = $10, pendidikan_akhir_ja = COALESCE($12, pendidikan_akhir_ja),
           updated_at = NOW()
       WHERE id = $11`,
      [tanggalMasukDisimpan, pendidikanAkhir, catatanBebas, tanggalLahirLokal, statusPernikahanLokal, jumlahAnakLokal, agamaLokal, daerahAsalLokal, nextKet, nextAlasan, id, pendidikanAkhirJa ?? null]
    );

    await pool.query(
      `INSERT INTO peserta_penempatan
        (peserta_id, tanggal_lulus_ujian, perusahaan_naitei, jenis_pekerjaan, prefektur_id, lokasi_kerja, rencana_mulai_kerja, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (peserta_id) DO UPDATE SET
         tanggal_lulus_ujian = EXCLUDED.tanggal_lulus_ujian, perusahaan_naitei = EXCLUDED.perusahaan_naitei,
         jenis_pekerjaan = EXCLUDED.jenis_pekerjaan, prefektur_id = EXCLUDED.prefektur_id,
         lokasi_kerja = EXCLUDED.lokasi_kerja, rencana_mulai_kerja = EXCLUDED.rencana_mulai_kerja, updated_at = NOW()`,
      [id, tanggalLulusUjian, perusahaanNaitei, jenisPekerjaan, prefekturId, lokasiKerja, rencanaMulaiKerja]
    );

    await appendAudit(actor, 'UPDATE_PESERTA_MEIBO', 'peserta', id, { pendidikanAkhir, perusahaanNaitei, prefekturId });
    return getPesertaDetail(id);
  }

  const db = readLocalState();
  const target = db.peserta.find((p) => p.id === id);
  if (!target) throw new Error('NOT_FOUND');

  const kelasTarget = db.kelas.find((k) => k.id === target.kelasId && !k.deletedAt);
  target.tanggalMasuk = tanggalMasukToStore(tanggalMasuk, kelasTarget?.tanggalStart || null);
  target.pendidikanAkhir = pendidikanAkhir;
  if (pendidikanAkhirJa !== undefined) target.pendidikanAkhirJa = pendidikanAkhirJa;
  target.catatanBebas = catatanBebas;
  target.tanggalLahirLokal = tanggalLahirLokal;
  target.statusPernikahanLokal = statusPernikahanLokal;
  target.jumlahAnakLokal = jumlahAnakLokal;
  target.agamaLokal = agamaLokal;
  target.daerahAsalLokal = daerahAsalLokal;
  if (target.sumber === 'manual') {
    if (keteranganLuarKelas) target.keteranganLuarKelas = keteranganLuarKelas;
    if (alasan !== undefined) target.alasan = alasan;
  }
  target.updatedAt = new Date().toISOString();

  const existingPen = db.pesertaPenempatan.find((x) => Number(x.pesertaId) === id);
  if (existingPen) {
    existingPen.tanggalLulusUjian = tanggalLulusUjian;
    existingPen.perusahaanNaitei = perusahaanNaitei;
    existingPen.jenisPekerjaan = jenisPekerjaan;
    existingPen.prefekturId = prefekturId;
    existingPen.lokasiKerja = lokasiKerja;
    existingPen.rencanaMulaiKerja = rencanaMulaiKerja;
    existingPen.updatedAt = target.updatedAt;
  } else {
    db.pesertaPenempatan.push({
      pesertaId: id,
      tanggalLulusUjian,
      perusahaanNaitei,
      jenisPekerjaan,
      prefekturId,
      lokasiKerja,
      rencanaMulaiKerja,
      updatedAt: target.updatedAt,
    });
  }

  appendLocalAudit(db, actor, 'UPDATE_PESERTA_MEIBO', 'peserta', id, { pendidikanAkhir, perusahaanNaitei, prefekturId });
  saveLocalState();
  return getPesertaDetail(id);
}

export async function changePesertaStatusTag(pesertaId, payload, actor) {
  await ensureInitialized();
  const id = Number(pesertaId);
  const statusBaru = payload?.statusTag;
  const catatan = String(payload?.catatan || '').trim();
  if (!id || !VALID_STATUS_TAGS.includes(statusBaru)) throw new Error('VALIDATION_ERROR');

  if (getMode() === 'postgres') {
    const pool = getPool();
    const curRes = await pool.query(`SELECT status_tag FROM peserta WHERE id = $1`, [id]);
    if (curRes.rows.length === 0) throw new Error('NOT_FOUND');
    const statusLama = curRes.rows[0].status_tag;
    await pool.query(`UPDATE peserta SET status_tag = $1, updated_at = NOW() WHERE id = $2`, [statusBaru, id]);
    await pool.query(
      `INSERT INTO peserta_status_log (peserta_id, status_lama, status_baru, diubah_oleh_staff_id, catatan) VALUES ($1, $2, $3, $4, $5)`,
      [id, statusLama, statusBaru, actor?.id || null, catatan]
    );
    await appendAudit(actor, 'CHANGE_STATUS_TAG', 'peserta', id, { statusLama, statusBaru, catatan });
    return getPesertaDetail(id);
  }

  const db = readLocalState();
  const target = db.peserta.find((p) => p.id === id);
  if (!target) throw new Error('NOT_FOUND');
  const statusLama = target.statusTag;
  target.statusTag = statusBaru;
  target.updatedAt = new Date().toISOString();

  db.pesertaStatusLog.push({
    id: db.seq.pesertaStatusLog++,
    pesertaId: id,
    statusLama,
    statusBaru,
    diubahOlehStaffId: actor?.id || null,
    catatan,
    createdAt: target.updatedAt,
  });
  appendLocalAudit(db, actor, 'CHANGE_STATUS_TAG', 'peserta', id, { statusLama, statusBaru, catatan });
  saveLocalState();
  return getPesertaDetail(id);
}

export async function lookupOutsideAccount(akunId) {
  await ensureInitialized();
  const snapshot = await getSnapshotFallbackFromDb();
  const account = await lookupMancationAccountById(akunId, snapshot);

  let existing = null;
  if (getMode() === 'postgres') {
    const res = await getPool().query(`SELECT id, sumber FROM peserta WHERE mancation_akun_id = $1`, [Number(akunId)]);
    existing = res.rows[0] || null;
  } else {
    existing = readLocalState().peserta.find((p) => Number(p.mancationAkunId) === Number(akunId)) || null;
  }

  return {
    found: Boolean(account && Number(account.cliId ?? 9) === 9),
    account:
      account && Number(account.cliId ?? 9) === 9
        ? { ...account, nama: formatPersonName(account.nama) }
        : null,
    alreadyRegistered: Boolean(existing),
    existingSumber: existing?.sumber || null,
    candidateHints: (isDemoSeedEnabled() ? SEED_MANCATION_OUTSIDE_CANDIDATES : []).map((c) => ({
      mancationAkunId: c.mancationAkunId,
      nama: formatPersonName(c.nama),
    })),
  };
}

export async function createPesertaLuarKelas(payload, actor) {
  await ensureInitialized();
  const snapshot = await getSnapshotFallbackFromDb();
  const mancationAccount = await lookupMancationAccountById(payload?.mancationAkunId, snapshot);

  let existingList = [];
  if (getMode() === 'postgres') {
    const res = await getPool().query(`SELECT id, mancation_akun_id AS "mancationAkunId", sumber FROM peserta`);
    existingList = res.rows;
  } else {
    existingList = readLocalState().peserta;
  }

  const validation = validateManualPesertaInput(payload, existingList, mancationAccount);
  if (!validation.ok) throw new Error(validation.code);
  const norm = validation.normalized;

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `INSERT INTO peserta
        (mancation_akun_id, kelas_id, status_tag, sumber, keterangan_luar_kelas, alasan, tanggal_masuk, pendidikan_akhir, pendidikan_akhir_ja, catatan_bebas)
       VALUES ($1, NULL, $2, 'manual', $3, $4, $5, $6, $7, $8) RETURNING id`,
      [norm.mancationAkunId, norm.statusTag, norm.keteranganLuarKelas, norm.alasan, norm.tanggalMasuk, norm.pendidikanAkhir, norm.pendidikanAkhirJa, norm.catatanBebas]
    );
    await appendAudit(actor, 'CREATE_PESERTA_LUAR', 'peserta', res.rows[0].id, {
      mancationAkunId: norm.mancationAkunId,
      nama: mancationAccount.nama,
      keteranganLuarKelas: norm.keteranganLuarKelas,
    });
    return getPesertaDetail(res.rows[0].id);
  }

  const db = readLocalState();
  const nowIso = new Date().toISOString();
  const newRow = {
    id: db.seq.peserta++,
    mancationAkunId: norm.mancationAkunId,
    kelasId: null,
    statusTag: norm.statusTag,
    sumber: 'manual',
    keteranganLuarKelas: norm.keteranganLuarKelas,
    alasan: norm.alasan,
    tanggalMasuk: norm.tanggalMasuk,
    pendidikanAkhir: norm.pendidikanAkhir,
    pendidikanAkhirJa: norm.pendidikanAkhirJa,
    tanggalLahirLokal: null,
    statusPernikahanLokal: '',
    jumlahAnakLokal: null,
    agamaLokal: '',
    daerahAsalLokal: '',
    catatanBebas: norm.catatanBebas,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  db.peserta.push(newRow);
  appendLocalAudit(db, actor, 'CREATE_PESERTA_LUAR', 'peserta', newRow.id, {
    mancationAkunId: norm.mancationAkunId,
    nama: mancationAccount.nama,
    keteranganLuarKelas: norm.keteranganLuarKelas,
  });
  saveLocalState();
  return getPesertaDetail(newRow.id);
}

export async function deletePesertaLuarKelas(pesertaId, actor) {
  await ensureInitialized();
  const id = Number(pesertaId);

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `DELETE FROM peserta WHERE id = $1 AND sumber = 'manual' RETURNING id, mancation_akun_id`,
      [id]
    );
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'DELETE_PESERTA_LUAR', 'peserta', id, { mancationAkunId: res.rows[0].mancation_akun_id });
    return { deleted: true };
  }

  const db = readLocalState();
  const idx = db.peserta.findIndex((p) => p.id === id && p.sumber === 'manual');
  if (idx === -1) throw new Error('NOT_FOUND');
  const [removed] = db.peserta.splice(idx, 1);
  db.pesertaPenempatan = db.pesertaPenempatan.filter((x) => Number(x.pesertaId) !== id);
  appendLocalAudit(db, actor, 'DELETE_PESERTA_LUAR', 'peserta', id, { mancationAkunId: removed.mancationAkunId });
  saveLocalState();
  return { deleted: true };
}

export async function getOverviewData() {
  const [kelasData, rosterData, luarData] = await Promise.all([
    listKelas(),
    listPeserta({ sumber: 'roster' }),
    listPeserta({ sumber: 'manual' }),
  ]);

  const activeKelas = kelasData.items.filter((k) => k.status === 'aktif');
  const activeKelasIds = new Set(activeKelas.map((k) => k.id));
  const pesertaAktif = rosterData.items.filter((p) => activeKelasIds.has(p.kelasId));

  const tagCounts = {
    standar: pesertaAktif.filter((p) => p.statusTag === 'standar').length,
    berkembang: pesertaAktif.filter((p) => p.statusTag === 'berkembang').length,
    siap_interview: pesertaAktif.filter((p) => p.statusTag === 'siap_interview').length,
  };

  const naiteiCount = [...rosterData.items, ...luarData.items].filter((p) =>
    Boolean(p.penempatan?.perusahaanNaitei)
  ).length;

  let recentLogs = [];
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `SELECT id, staff_nama AS "staffNama", aksi, entitas, entitas_id AS "entitasId", created_at AS "createdAt"
       FROM audit_log ORDER BY created_at DESC LIMIT 8`
    );
    recentLogs = res.rows;
  } else {
    recentLogs = readLocalState().auditLog.slice(0, 8);
  }

  return {
    kpi: {
      pesertaAktif: pesertaAktif.length,
      kelasAktif: activeKelas.length,
      siapInterview: tagCounts.siap_interview,
      pesertaLuarKelas: luarData.items.length,
      sudahNaitei: naiteiCount,
    },
    tagCounts,
    classes: kelasData.items,
    recentLogs,
    mancationSync: rosterData.mancationSync,
    internalDbMode: getMode(),
    mancationMeta: getMancationStatusMeta(),
  };
}
