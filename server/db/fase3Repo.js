import {
  readLocalState,
  saveLocalState,
  appendAudit,
  ensureInitialized,
  getMode,
  getPool,
} from './engine.js';
import {
  computeNilaiUjianAvg,
  getGradeLabel,
  computeSikapSummary,
  computeAbsensiPesertaLintasKelas,
  validateSettingsPayload,
} from '../domain/rules.js';
import {
  isDemoSeedEnabled,
  SEED_MANCATION_STUDENTS,
  SEED_MANCATION_OUTSIDE_CANDIDATES,
} from './seedData.js';
import { formatPersonName } from '../domain/nameFormat.js';
import { mancationFotoUrl } from './mancation.js';
import { urutkanPeringkat, buildPesertaJourney } from '../domain/smartReport.js';
import { DEFAULT_KAIWA_TARGET, kaiwaRule, kaiwaCardRekap, todayJakarta, weekStartOf, addDays } from '../domain/kaiwaMingguan.js';
import { DEFAULT_EVALUASI_FISIK, ringkasFisik } from '../domain/evaluasiFisik.js';
import { DEFAULT_GRADE_LATIHAN } from '../domain/gradeLatihan.js';
import {
  DEFAULT_NILAI_AKHIR,
  poinGrade,
  MIN_FAKTOR,
  aturanNilaiAkhir,
  kualitasSesi,
  faktorKeseluruhan,
  hitungNilaiAkhir,
} from '../domain/nilaiAkhir.js';
import { VAPID_SETTINGS_KEY } from './fase4Repo.js';
import { listStaff } from './authStaffRepo.js';

export const DEFAULT_SETTINGS = {
  kkm_ujian: 70,
  kkm_sikap: 70,
  batas_grade: { A: 90, B: 75, C: 60 },
  sikap_basis: 75,
  ambang_kehadiran_rendah: 75,
  rentang_tren_bulan: 12,
  periode_default: 'auto',
  // Kaiwa Card: sessions needed per week, the sensei one of them must be with (staff id, null = none), and the
  // date the rule applies from (null = every week). The rule was set up in JOYdata in the week of 26 Oct 2026;
  // before it hardly any kaiwa was recorded, so earlier weeks cannot be judged.
  kaiwa_target_mingguan: DEFAULT_KAIWA_TARGET,
  kaiwa_sensei_wajib_id: null,
  kaiwa_berlaku_mulai: '2026-10-26',
  // Evaluasi Fisik: benchmarks per gender, weights, KKM and track length (domain/evaluasiFisik.js).
  evaluasi_fisik: DEFAULT_EVALUASI_FISIK,
  // Grade Latihan on Monitor Latihan: daily practice target in minutes and the weight of time (domain/gradeLatihan.js).
  grade_latihan: DEFAULT_GRADE_LATIHAN,
  // Nilai Akhir on Progres Peserta: the weight of every factor (domain/nilaiAkhir.js).
  nilai_akhir: DEFAULT_NILAI_AKHIR,
};

export function getStudentNameMap(state) {
  const map = new Map();
  const demo = isDemoSeedEnabled();
  if (demo) {
    for (const s of SEED_MANCATION_OUTSIDE_CANDIDATES || []) {
      map.set(Number(s.mancationAkunId), formatPersonName(s.nama));
    }
  }
  for (const s of state.mancationPesertaCache || []) {
    map.set(Number(s.mancationAkunId), formatPersonName(s.nama));
  }
  if (demo) {
    for (const s of SEED_MANCATION_STUDENTS || []) {
      map.set(Number(s.mancationAkunId), formatPersonName(s.nama));
    }
  }
  return map;
}

/** mancationAkunId → pas foto URL in Mancation, for peserta whose cached account has a photo. */
export function getStudentFotoMap(state) {
  const map = new Map();
  for (const s of state.mancationPesertaCache || []) {
    const url = mancationFotoUrl(s.mancationAkunId, s.fotoVersi);
    if (url) map.set(Number(s.mancationAkunId), url);
  }
  return map;
}

/**
 * Snapshot shaped like the local store for the report computations below. In postgres mode it is read
 * from the database only, so reports never touch the local file (which does not exist on Vercel).
 */
export async function loadReportState() {
  await ensureInitialized();
  if (getMode() !== 'postgres') return readLocalState();

  const query = (sql) => getPool().query(sql).then((res) => res.rows);
  const [kelas, peserta, staff, programs, sikapKategori, mancationPesertaCache, nilaiUjian, nilaiKaiwa, nilaiMensetsu, nilaiSikap, absensi, nilaiFisik] =
    await Promise.all([
      query(`SELECT id, nama_kelas AS "namaKelas", program_id AS "programId", tanggal_start::text AS "tanggalStart",
               description, mancation_class_id AS "mancationClassId", sensei_id AS "senseiId", status,
               deleted_at AS "deletedAt"
             FROM kelas`),
      query(`SELECT id, mancation_akun_id AS "mancationAkunId", kelas_id AS "kelasId", status_tag AS "statusTag",
               sumber, keterangan_luar_kelas AS "keteranganLuarKelas", tanggal_masuk::text AS "tanggalMasuk"
             FROM peserta`),
      query(`SELECT id, nama FROM staff`),
      query(`SELECT id, nama_id AS "namaId", nama_ja AS "namaJa" FROM program`),
      query(`SELECT id, nama_id AS "namaId", nama_ja AS "namaJa" FROM sikap_kategori`),
      query(`SELECT mancation_akun_id AS "mancationAkunId", nama, foto_versi::float8 AS "fotoVersi" FROM mancation_peserta_cache`),
      query(`SELECT id, peserta_id AS "pesertaId", kelas_id AS "kelasId", tanggal_ujian::text AS "tanggalUjian",
               nama_ujian AS "codeUjian", tipe_penilaian AS "pola", nilai_tunggal::float AS "nilaiTunggal",
               moji_goi::float AS "nilaiMojiGoi", COALESCE(bunpou, dokkai)::float AS "nilaiBunpou",
               choukai::float AS "nilaiChoukai", catatan
             FROM nilai_ujian`),
      query(`SELECT id, peserta_id AS "pesertaId", kelas_id AS "kelasId", tanggal_sesi::text AS "tanggalKaiwa",
               grade, topik, catatan AS "description", sensei_staff_id AS "senseiId"
             FROM nilai_kaiwa`),
      query(`SELECT id, peserta_id AS "pesertaId", kelas_id AS "kelasId", tanggal_sesi::text AS "tanggalMensetsu",
               grade, catatan AS "description", sensei_staff_id AS "senseiId"
             FROM nilai_mensetsu`),
      query(`SELECT id, peserta_id AS "pesertaId", kelas_id AS "kelasId", kategori_id AS "kategoriId",
               tanggal::text AS "tanggalPenilaian", sentiment, ABS(bobot)::float AS "bobot", keterangan AS "description"
             FROM nilai_sikap`),
      query(`SELECT id, peserta_id AS "pesertaId", kelas_id AS "kelasId", tanggal::text AS "tanggalAbsensi",
               status, keterangan AS "description", diinput_oleh_staff_id AS "penilaiId"
             FROM absensi`),
      query(`SELECT id, peserta_id AS "pesertaId", kelas_id AS "kelasId", tanggal::text AS tanggal, jenis_kelamin AS "jenisKelamin",
               push_up AS "pushUp", plank_detik AS "plankDetik", sit_up AS "sitUp",
               karung_bolak_balik::float AS "karungBolakBalik", lintasan_m::float AS "lintasanM", catatan
             FROM nilai_fisik`),
    ]);

  return {
    settings: await readStoredSettings(),
    kelas,
    peserta,
    staff,
    programs,
    sikapKategori,
    mancationPesertaCache,
    nilaiUjian,
    nilaiKaiwa,
    nilaiMensetsu,
    nilaiSikap,
    absensi,
    nilaiFisik,
  };
}

function resolveNilaiAvg(u) {
  if (u.nilaiAvg !== null && u.nilaiAvg !== undefined && Number.isFinite(Number(u.nilaiAvg))) {
    return Number(u.nilaiAvg);
  }
  return computeNilaiUjianAvg(u);
}

// Settings live in the `settings` table (one row per key) in postgres mode, in state.settings otherwise.
// The VAPID key pair shares that storage but is owned by fase4Repo and never returned from here.
async function readStoredSettings() {
  await ensureInitialized();
  let stored;
  if (getMode() !== 'postgres') {
    stored = readLocalState().settings || {};
  } else {
    const res = await getPool().query('SELECT key, value FROM settings WHERE key <> $1', [VAPID_SETTINGS_KEY]);
    stored = Object.fromEntries(res.rows.map((r) => [r.key, r.value]));
  }
  const { [VAPID_SETTINGS_KEY]: _vapid, ...settings } = stored;
  return settings;
}

async function writeStoredSettings(next) {
  if (getMode() !== 'postgres') {
    const state = readLocalState();
    const vapidKeys = state.settings?.[VAPID_SETTINGS_KEY];
    state.settings = { ...next, updatedAt: new Date().toISOString() };
    if (vapidKeys) state.settings[VAPID_SETTINGS_KEY] = vapidKeys;
    saveLocalState();
    return;
  }
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    for (const [key, value] of Object.entries(next)) {
      await client.query(
        `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2::jsonb, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, JSON.stringify(value)]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function getSystemSettings() {
  return {
    ...DEFAULT_SETTINGS,
    ...(await readStoredSettings()),
  };
}

export async function updateSystemSettings(payload, actor) {
  const val = validateSettingsPayload(payload);
  if (!val.ok) {
    throw new Error(val.code);
  }

  const dataLama = await getSystemSettings();
  const dataBaru = {
    ...DEFAULT_SETTINGS,
    kaiwa_target_mingguan: dataLama.kaiwa_target_mingguan,
    kaiwa_sensei_wajib_id: dataLama.kaiwa_sensei_wajib_id,
    kaiwa_berlaku_mulai: dataLama.kaiwa_berlaku_mulai,
    evaluasi_fisik: dataLama.evaluasi_fisik,
    grade_latihan: dataLama.grade_latihan,
    nilai_akhir: dataLama.nilai_akhir,
    ...val.normalized,
  };
  if (dataBaru.kaiwa_sensei_wajib_id !== dataLama.kaiwa_sensei_wajib_id && dataBaru.kaiwa_sensei_wajib_id !== null) {
    const staff = await listStaff();
    if (!staff.some((s) => s.id === dataBaru.kaiwa_sensei_wajib_id && s.active)) throw new Error('INVALID_KAIWA_SENSEI');
  }
  await writeStoredSettings(dataBaru);
  await appendAudit(actor, 'UPDATE_SETTINGS', 'settings', 1, { dataLama, dataBaru });

  return getSystemSettings();
}

export async function resetSystemSettings(actor) {
  const dataLama = await getSystemSettings();
  const dataBaru = { ...DEFAULT_SETTINGS };
  await writeStoredSettings(dataBaru);
  await appendAudit(actor, 'RESET_SETTINGS', 'settings', 1, { dataLama, dataBaru });

  return getSystemSettings();
}

const optionalDate = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? String(v) : null);

// Penempatan shown on the rapor: peserta_penempatan plus peserta.pendidikan_akhir in postgres mode,
// the pesertaPenempatan collection of the local store otherwise.
export async function loadPenempatan(pid, state = null) {
  if (getMode() !== 'postgres') {
    const local = state || readLocalState();
    return (local.pesertaPenempatan || []).find((p) => p.pesertaId === pid) || {
      pesertaId: pid,
      tanggalLulusUjian: null,
      perusahaanNaitei: '',
      jenisPekerjaan: '',
      lokasiKerja: '',
      rencanaMulaiKerja: null,
      pendidikanTerakhir: '',
      pendidikanTerakhirJa: '',
      catatanBebas: '',
    };
  }
  const res = await getPool().query(
    `SELECT p.id AS "pesertaId", pp.tanggal_lulus_ujian::text AS "tanggalLulusUjian",
            COALESCE(pp.perusahaan_naitei, '') AS "perusahaanNaitei", COALESCE(pp.jenis_pekerjaan, '') AS "jenisPekerjaan",
            COALESCE(pp.lokasi_kerja, '') AS "lokasiKerja", pp.rencana_mulai_kerja::text AS "rencanaMulaiKerja",
            p.pendidikan_akhir AS "pendidikanTerakhir", p.pendidikan_akhir_ja AS "pendidikanTerakhirJa",
            p.catatan_bebas AS "catatanBebas"
     FROM peserta p
     LEFT JOIN peserta_penempatan pp ON pp.peserta_id = p.id
     WHERE p.id = $1`,
    [pid]
  );
  if (!res.rows.length) throw new Error('NOT_FOUND');
  return res.rows[0];
}

export async function updatePesertaPenempatan(pesertaId, payload, actor) {
  const pid = Number(pesertaId);
  if (!Number.isInteger(pid) || pid <= 0) {
    throw new Error('VALIDATION_ERROR');
  }
  await ensureInitialized();

  const normalized = {
    pesertaId: pid,
    tanggalLulusUjian: optionalDate(payload?.tanggalLulusUjian),
    perusahaanNaitei: String(payload?.perusahaanNaitei || '').trim(),
    jenisPekerjaan: String(payload?.jenisPekerjaan || '').trim(),
    lokasiKerja: String(payload?.lokasiKerja || '').trim(),
    rencanaMulaiKerja: optionalDate(payload?.rencanaMulaiKerja),
    pendidikanTerakhir: String(payload?.pendidikanTerakhir || '').trim(),
    catatanBebas: String(payload?.catatanBebas || '').trim(),
    updatedAt: new Date().toISOString(),
  };
  // Left out by clients that predate the field: keep the stored value instead of clearing it.
  if (payload?.pendidikanTerakhirJa !== undefined) {
    normalized.pendidikanTerakhirJa = String(payload.pendidikanTerakhirJa || '').trim();
  }

  if (getMode() === 'postgres') {
    const dataLama = await loadPenempatan(pid);
    const client = await getPool().connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `UPDATE peserta SET pendidikan_akhir = $1, pendidikan_akhir_ja = COALESCE($3, pendidikan_akhir_ja), updated_at = NOW()
         WHERE id = $2`,
        [normalized.pendidikanTerakhir, pid, normalized.pendidikanTerakhirJa ?? null]
      );
      await client.query(
        `INSERT INTO peserta_penempatan
           (peserta_id, tanggal_lulus_ujian, perusahaan_naitei, jenis_pekerjaan, lokasi_kerja, rencana_mulai_kerja, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (peserta_id) DO UPDATE SET
           tanggal_lulus_ujian = EXCLUDED.tanggal_lulus_ujian, perusahaan_naitei = EXCLUDED.perusahaan_naitei,
           jenis_pekerjaan = EXCLUDED.jenis_pekerjaan, lokasi_kerja = EXCLUDED.lokasi_kerja,
           rencana_mulai_kerja = EXCLUDED.rencana_mulai_kerja, updated_at = NOW()`,
        [
          pid,
          normalized.tanggalLulusUjian,
          normalized.perusahaanNaitei,
          normalized.jenisPekerjaan,
          normalized.lokasiKerja,
          normalized.rencanaMulaiKerja,
        ]
      );
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
    const dataBaru = await loadPenempatan(pid);
    await appendAudit(actor, 'UPDATE_PENEMPATAN', 'peserta_penempatan', pid, { dataLama, dataBaru });
    return dataBaru;
  }

  const state = await readLocalState();
  const peserta = (state.peserta || []).find((p) => p.id === pid && !p.deletedAt);
  if (!peserta) {
    throw new Error('NOT_FOUND');
  }

  state.pesertaPenempatan = state.pesertaPenempatan || [];
  let existing = state.pesertaPenempatan.find((p) => p.pesertaId === pid);
  const dataLama = existing ? { ...existing } : null;

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
  await appendAudit(actor, 'UPDATE_PENEMPATAN', 'peserta_penempatan', pid, { dataLama, dataBaru: existing });

  return existing;
}

/**
 * Class and peserta pickers for the report pages (Progres, Rapor, Smart Report). Read from the report snapshot,
 * so these pages do not depend on access to Data Kelas / Data Peserta and do not trigger a Mancation sync.
 */
export async function getReportOptions() {
  const state = await loadReportState();
  const nameMap = getStudentNameMap(state);
  const peserta = (state.peserta || []).filter((p) => !p.deletedAt);
  const kelas = (state.kelas || [])
    .filter((k) => !k.deletedAt)
    .map((k) => ({
      id: k.id,
      namaKelas: k.namaKelas,
      status: k.status,
      jumlahPeserta: peserta.filter((p) => p.kelasId === k.id).length,
    }))
    .sort((a, b) => a.namaKelas.localeCompare(b.namaKelas, undefined, { numeric: true }));
  const namaKelas = new Map(kelas.map((k) => [k.id, k.namaKelas]));
  return {
    kelas,
    peserta: peserta
      .map((p) => ({
        id: p.id,
        nama: nameMap.get(Number(p.mancationAkunId)) || p.nama || `Peserta #${p.mancationAkunId}`,
        mancationAkunId: p.mancationAkunId,
        kelasId: p.kelasId,
        namaKelas: namaKelas.get(p.kelasId) || '-',
        sumber: p.sumber || 'roster',
      }))
      .sort((a, b) => a.nama.localeCompare(b.nama)),
  };
}

/**
 * Progres Peserta: every peserta's whole journey so far (not one month) — exam average and trend, kualitas kaiwa and
 * mensetsu from every session, sikap, attendance, Kaiwa Card weeks, Grade Latihan over all time, the latest fisik
 * test — and their Nilai Akhir (domain/nilaiAkhir.js); per class the means of its members.
 */
export async function getProgresData({ kelasId, tag } = {}) {
  const state = await loadReportState();
  const nameMap = getStudentNameMap(state);
  const settings = { ...DEFAULT_SETTINGS, ...(state.settings || {}) };
  const batasGrade = settings.batas_grade;
  const aturan = aturanNilaiAkhir(settings);
  const rule = kaiwaRule(settings);
  // Kaiwa Card counts finished weeks only: the running week would count as missed until Sunday.
  const mingguSelesai = addDays(weekStartOf(todayJakarta()), -1);
  // Grade Latihan over all time (latihanRepo imports this module, so it is loaded when needed).
  const { getStatistikLatihan } = await import('./latihanRepo.js');
  const latihan = await getStatistikLatihan({ periode: 'semua' }).catch(() => null);
  const latihanMap = new Map((latihan?.items || []).map((r) => [Number(r.pesertaId), r.grade]));

  const activeClasses = (state.kelas || []).filter((k) => !k.deletedAt);
  const kelasMap = new Map(activeClasses.map((k) => [k.id, k]));
  const staffMap = new Map((state.staff || []).map((s) => [s.id, s]));
  const kategori = new Map((state.sikapKategori || []).map((k) => [k.id, k]));
  const sikapRows = (state.nilaiSikap || []).map((s) => ({
    ...s,
    kategoriNamaId: kategori.get(s.kategoriId)?.namaId,
    kategoriNamaJa: kategori.get(s.kategoriId)?.namaJa,
  }));
  const kaiwaPerPeserta = new Map();
  for (const k of state.nilaiKaiwa || []) {
    if (!k.tanggalKaiwa) continue;
    if (!kaiwaPerPeserta.has(k.pesertaId)) kaiwaPerPeserta.set(k.pesertaId, []);
    kaiwaPerPeserta.get(k.pesertaId).push({ tanggal: String(k.tanggalKaiwa).slice(0, 10), senseiId: k.senseiId ?? null });
  }

  const semuaPeserta = (state.peserta || [])
    .filter((p) => !p.deletedAt)
    .map((student) => {
      const kelas = student.kelasId ? kelasMap.get(student.kelasId) : null;
      const anggotaKelas = Boolean(kelas) && (student.sumber || 'roster') === 'roster';
      const journey = buildPesertaJourney({
        pesertaId: student.id,
        kelasId: student.kelasId,
        ujianRows: state.nilaiUjian || [],
        kaiwaRows: state.nilaiKaiwa || [],
        mensetsuRows: state.nilaiMensetsu || [],
        sikapRows,
        absensiRows: state.absensi || [],
        fisikRows: state.nilaiFisik || [],
        settings,
      });
      const faktor = faktorKeseluruhan(journey, {
        kaiwaCard: anggotaKelas
          ? kaiwaCardRekap(kaiwaPerPeserta.get(student.id) || [], {
              rule,
              tanggalMasuk: student.tanggalMasuk || kelas.tanggalStart || null,
              hariIni: mingguSelesai,
            })
          : null,
        latihan: anggotaKelas ? latihanMap.get(Number(student.id)) || null : null,
        batasGrade,
      });
      const kualitas = (grades) => kualitasSesi(grades, batasGrade);
      return {
        pesertaId: Number(student.id),
        mancationAkunId: Number(student.mancationAkunId),
        nama: nameMap.get(Number(student.mancationAkunId)) || student.nama || `Peserta #${student.mancationAkunId}`,
        kelasId: student.kelasId ? Number(student.kelasId) : null,
        namaKelas: kelas ? kelas.namaKelas : student.sumber === 'manual' ? 'Peserta Luar Kelas' : '-',
        sumber: student.sumber || 'roster',
        keteranganLuarKelas: student.keteranganLuarKelas || null,
        statusTag: student.statusTag || 'standar',
        isSiapInterview: student.statusTag === 'siap_interview',
        rataUjian: journey.kpi.rataUjian,
        predikatUjian: journey.kpi.rataUjian === null ? null : journey.kpi.gradeUjian,
        lulusKkmUjian: journey.kpi.lulusKkmUjian,
        jumlahUjian: journey.kpi.jumlahUjian,
        trenUjian: journey.ujian.tren?.selisih ?? null,
        kualitasKaiwa: kualitas(journey.kaiwa.daftar.map((k) => k.grade)),
        kualitasMensetsu: kualitas(journey.mensetsu.daftar.map((m) => m.grade)),
        skorSikap: journey.kpi.skorSikap,
        predikatSikap: journey.kpi.skorSikap === null ? null : journey.kpi.predikatSikap,
        lulusKkmSikap: journey.kpi.lulusKkmSikap,
        rasioKehadiran: journey.absensi.rasio,
        hadir: journey.absensi.hadir,
        sesi: journey.absensi.sesi,
        kaiwaCard: faktor.kaiwaCard,
        latihan: faktor.latihan,
        fisik: faktor.fisik,
        nilaiAkhir: hitungNilaiAkhir(faktor, aturan, batasGrade),
      };
    });

  const mean1 = (values) => {
    const nums = values.filter((v) => v !== null && v !== undefined && Number.isFinite(Number(v)));
    return nums.length ? Math.round((nums.reduce((a, b) => a + Number(b), 0) / nums.length) * 10) / 10 : null;
  };
  const kelasSummaryList = activeClasses
    .map((k) => {
      const anggota = semuaPeserta.filter((p) => p.kelasId === k.id);
      const tagCounts = { standar: 0, berkembang: 0, siap_interview: 0 };
      for (const p of anggota) tagCounts[tagCounts[p.statusTag] !== undefined ? p.statusTag : 'standar'] += 1;
      const tambah = (key) =>
        anggota.reduce(
          (acc, p) => ({ A: acc.A + p[key].distribusi.A, B: acc.B + p[key].distribusi.B, C: acc.C + p[key].distribusi.C }),
          { A: 0, B: 0, C: 0 }
        );
      const sesi = anggota.reduce((n, p) => n + p.sesi, 0);
      const hadir = anggota.reduce((n, p) => n + p.hadir, 0);
      const nilaiAkhirDist = { A: 0, B: 0, C: 0, D: 0 };
      for (const p of anggota) if (p.nilaiAkhir.grade) nilaiAkhirDist[p.nilaiAkhir.grade] += 1;
      return {
        kelasId: k.id,
        namaKelas: k.namaKelas,
        senseiNama: staffMap.get(k.senseiId)?.nama || '-',
        jumlahPeserta: anggota.length,
        tagCounts,
        rataUjian: mean1(anggota.map((p) => p.rataUjian)),
        rataSikap: mean1(anggota.map((p) => p.skorSikap)),
        rasioKehadiran: sesi > 0 ? Math.round((hadir / sesi) * 1000) / 10 : null,
        kualitasKaiwa: mean1(anggota.map((p) => p.kualitasKaiwa.nilai)),
        kaiwaDistribusi: tambah('kualitasKaiwa'),
        mensetsuDistribusi: tambah('kualitasMensetsu'),
        nilaiAkhir: { rata: mean1(anggota.map((p) => p.nilaiAkhir.nilai)), distribusi: nilaiAkhirDist },
      };
    })
    // An empty class (left over from a new class formation) has nothing to sum up.
    .filter((k) => k.jumlahPeserta > 0);

  let pesertaList = semuaPeserta;
  if (kelasId) pesertaList = pesertaList.filter((p) => p.kelasId === Number(kelasId));
  if (tag) pesertaList = pesertaList.filter((p) => p.statusTag === tag);

  return {
    kelasSummary: kelasSummaryList,
    pesertaList,
    kandidatInterviewCount: semuaPeserta.filter((p) => p.statusTag === 'siap_interview').length,
    aturanNilaiAkhir: { ...aturan, batasGrade, poinGradeSesi: poinGrade(batasGrade), minFaktor: MIN_FAKTOR },
    settings,
  };
}

/** state: a loadReportState() snapshot the caller already has, to skip reading it again. */
export async function getStudentRapor({ pesertaId, periode, state: loadedState = null }) {
  const pid = Number(pesertaId);
  if (!Number.isInteger(pid) || pid <= 0) {
    throw new Error('VALIDATION_ERROR');
  }

  const state = loadedState || (await loadReportState());
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

  const penempatan = await loadPenempatan(pid, state);

  const ujianList = (state.nilaiUjian || [])
    .filter((u) => u.pesertaId === pid && u.tanggalUjian && String(u.tanggalUjian).startsWith(activeMonth))
    .map((u) => {
      const avg = resolveNilaiAvg(u);
      return {
        ...u,
        nilaiAvg: avg,
        grade: avg !== null ? getGradeLabel(avg, settings.batas_grade) : '-',
        lulusKkm: avg !== null ? avg >= settings.kkm_ujian : false,
      };
    })
    .sort((a, b) => String(a.tanggalUjian).localeCompare(String(b.tanggalUjian)));

  const kaiwaList = (state.nilaiKaiwa || [])
    .filter((k) => k.pesertaId === pid && k.tanggalKaiwa && String(k.tanggalKaiwa).startsWith(activeMonth))
    .sort((a, b) => String(b.tanggalKaiwa).localeCompare(String(a.tanggalKaiwa)));

  const latestKaiwa = kaiwaList.length > 0 ? kaiwaList[0] : null;

  const mensetsuList = (state.nilaiMensetsu || [])
    .filter((m) => m.pesertaId === pid && m.tanggalMensetsu && String(m.tanggalMensetsu).startsWith(activeMonth))
    .sort((a, b) => String(b.tanggalMensetsu).localeCompare(String(a.tanggalMensetsu)) || b.id - a.id);

  // Evaluasi Fisik of this month: the latest test shows, with how many tests the month had.
  const fisikBulan = ringkasFisik(
    (state.nilaiFisik || []).filter((f) => f.pesertaId === pid && f.tanggal && String(f.tanggal).startsWith(activeMonth)),
    settings
  );

  // Kaiwa Card weeks of this month (a week belongs to the month of its Monday).
  const rule = kaiwaRule(settings);
  const kaiwaCard = {
    ...kaiwaCardRekap(
      (state.nilaiKaiwa || [])
        .filter((k) => k.pesertaId === pid && k.tanggalKaiwa)
        .map((k) => ({ tanggal: String(k.tanggalKaiwa).slice(0, 10), senseiId: k.senseiId ?? null })),
      { rule, tanggalMasuk: student.tanggalMasuk || kelas?.tanggalStart || null, bulan: activeMonth }
    ),
    senseiWajibNama: rule.senseiWajibId ? (state.staff || []).find((s) => s.id === rule.senseiWajibId)?.nama || null : null,
  };

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

  const sikapSummary = computeSikapSummary(sikapLogs, settings.sikap_basis, settings.kkm_sikap, settings.batas_grade);

  const classId = student.kelasId;
  const classMembers = (state.peserta || []).filter((p) => p.kelasId === classId && !p.deletedAt);
  // Across every class the peserta sat in this month, so a peserta moved by Atur Formasi keeps the old class's sessions.
  const studentAbs = computeAbsensiPesertaLintasKelas(
    pid,
    (state.absensi || []).filter((a) => a.tanggalAbsensi && String(a.tanggalAbsensi).startsWith(activeMonth)),
    classId
  );

  const rataBulan = (avgs) =>
    avgs.length > 0 ? Math.round((avgs.reduce((a, b) => a + b, 0) / avgs.length) * 10) / 10 : null;
  const examAvgs = ujianList.map((u) => u.nilaiAvg).filter((v) => v !== null && Number.isFinite(v));
  const overallExamAvg = rataBulan(examAvgs);

  // Class rank of this month: every classmate's exam average of the month, attendance breaking ties. Kept to the
  // month so the rapor of a past month does not change when later scores come in.
  const allMonthAbsensi = (state.absensi || []).filter(
    (a) => a.tanggalAbsensi && String(a.tanggalAbsensi).startsWith(activeMonth)
  );
  const rankRows = classMembers.map((p) => ({
    pesertaId: p.id,
    nama: nameMap.get(Number(p.mancationAkunId)) || p.nama || '',
    rata: rataBulan(
      (state.nilaiUjian || [])
        .filter((u) => u.pesertaId === p.id && u.tanggalUjian && String(u.tanggalUjian).startsWith(activeMonth))
        .map(resolveNilaiAvg)
        .filter((v) => v !== null && Number.isFinite(v))
    ),
    rasioKehadiran: computeAbsensiPesertaLintasKelas(p.id, allMonthAbsensi, classId).rasioKehadiran,
  }));
  const ranked = urutkanPeringkat(rankRows, (r) => r.rata);
  const peringkat = classId
    ? {
        posisi: ranked.find((r) => r.pesertaId === pid)?.peringkat ?? null,
        jumlahDinilai: ranked.length,
        jumlahPeserta: classMembers.length,
      }
    : null;

  return {
    periode: activeMonth,
    student: {
      id: student.id,
      nama: resolvedNama,
      mancationAkunId: student.mancationAkunId,
      fotoUrl: getStudentFotoMap(state).get(Number(student.mancationAkunId)) || null,
      statusTag: student.statusTag || 'standar',
      // Follows the class start date unless set by hand (pesertaRepo.tanggalMasukToStore).
      tanggalMasuk: student.tanggalMasuk || kelas?.tanggalStart || null,
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
    peringkat,
    kpi: {
      rataUjian: overallExamAvg,
      gradeUjian: overallExamAvg !== null ? getGradeLabel(overallExamAvg, settings.batas_grade) : '-',
      lulusKkmUjian: overallExamAvg !== null ? overallExamAvg >= settings.kkm_ujian : false,
      gradeKaiwa: latestKaiwa ? latestKaiwa.grade : '-',
      sesiKaiwa: kaiwaList.length,
      gradeMensetsu: mensetsuList.length ? mensetsuList[0].grade : '-',
      sesiMensetsu: mensetsuList.length,
      skorSikap: sikapSummary.skorAkhir,
      predikatSikap: sikapSummary.label,
      lulusKkmSikap: sikapSummary.lulusKkm,
      rasioKehadiran: studentAbs.rasioKehadiran,
      sesiKelas: studentAbs.sesiKelas,
    },
    ujianList,
    kaiwaList,
    kaiwaCard,
    mensetsuList,
    fisik: { terakhir: fisikBulan.terakhir, jumlahTes: fisikBulan.daftar.length },
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

export async function exportAkademikData({ tipe = 'progres', periode, kelasId, locale = 'id' }) {
  const isJa = locale === 'ja';
  const activeMonth = periode || new Date().toISOString().slice(0, 7);

  function escapeCsv(val) {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return '"' + s + '"';
  }

  if (tipe === 'progres') {
    // The whole journey of every peserta, as on Progres Peserta (not one month).
    const data = await getProgresData({ kelasId });
    const headers = isJa
      ? ['ID', '氏名', 'クラス', '総合点', '総合評価', '試験平均', '試験判定', '会話の質', '会話回数', '面接練習の質', '面接練習回数', '態度スコア', '出席率(%)', '会話カード達成率(%)', '練習評価点', '体力評価', 'ステータスタグ']
      : ['ID', 'Nama Peserta', 'Kelas', 'Nilai Akhir', 'Grade Akhir', 'Rata-rata Ujian', 'Predikat Ujian', 'Kualitas Kaiwa', 'Sesi Kaiwa', 'Kualitas Mensetsu', 'Sesi Mensetsu', 'Skor Sikap', 'Rasio Kehadiran (%)', 'Kaiwa Card (%)', 'Nilai Grade Latihan', 'Nilai Fisik', 'Status Tag'];
    const atau = (v) => (v === null || v === undefined ? '-' : v);

    const rows = data.pesertaList.map((p) => [
      p.mancationAkunId || p.pesertaId,
      p.nama,
      p.namaKelas,
      atau(p.nilaiAkhir.nilai),
      atau(p.nilaiAkhir.grade),
      atau(p.rataUjian),
      atau(p.predikatUjian),
      p.kualitasKaiwa.nilai === null ? '-' : `${p.kualitasKaiwa.nilai} (${p.kualitasKaiwa.grade})`,
      p.kualitasKaiwa.jumlah,
      p.kualitasMensetsu.nilai === null ? '-' : `${p.kualitasMensetsu.nilai} (${p.kualitasMensetsu.grade})`,
      p.kualitasMensetsu.jumlah,
      atau(p.skorSikap),
      atau(p.rasioKehadiran),
      atau(p.kaiwaCard?.nilai),
      atau(p.latihan?.nilai),
      atau(p.fisik?.nilai),
      p.statusTag,
    ]);

    const headerLine = headers.map(escapeCsv).join(',');
    const rowLines = rows.map((r) => r.map(escapeCsv).join(','));
    const csvContent = [headerLine, ...rowLines].join('\n');

    return {
      filename: 'JOYdata-Progres-' + todayJakarta() + '.csv',
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
