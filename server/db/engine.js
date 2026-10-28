import fs from 'node:fs';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import {
  isDemoSeedEnabled,
  SEED_ROLES,
  SEED_PAGES,
  SEED_PROGRAMS,
  SEED_SIKAP_KATEGORI,
  SEED_SETTINGS,
  SEED_MANCATION_CLASSES,
  SEED_MANCATION_STUDENTS,
  SEED_MANCATION_OUTSIDE_CANDIDATES,
} from './seedData.js';

const { Pool } = pg;

function hasValidPostgresUrl() {
  const url = process.env.DATABASE_URL || '';
  if (!url || !url.startsWith('postgres')) return false;
  if (url.includes('YOUR_DB_PASSWORD') || url.includes('your-project-ref')) return false;
  return true;
}

let pgPool = null;
let initialized = false;
let initPromise = null;
let storageMode = 'local'; // 'postgres' | 'local'
let localState = null;

export const LOCAL_DB_PATH = path.resolve(process.cwd(), '.data', 'joydata-db.json');

export function getPool() {
  return pgPool;
}

export function getMode() {
  return storageMode;
}

function createPgPoolIfConfigured() {
  if (!pgPool && hasValidPostgresUrl()) {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      connectionTimeoutMillis: 8000,
      ssl: process.env.DATABASE_URL.includes('localhost')
        ? false
        : { rejectUnauthorized: false },
    });
    pgPool.on('error', (err) => {
      console.error('PostgreSQL pool idle error:', err.message);
    });
  }
  return pgPool;
}

export function createInitialLocalState({ demo = isDemoSeedEnabled() } = {}) {
  const now = new Date().toISOString();
  const adminHash = bcrypt.hashSync('admin123', 10);
  const senseiHash = bcrypt.hashSync('sensei123', 10);
  const managerHash = bcrypt.hashSync('manager123', 10);
  const viewerHash = bcrypt.hashSync('viewer123', 10);

  const roles = SEED_ROLES.map((r) => ({ ...r, createdAt: now }));
  const pages = SEED_PAGES.map((p) => ({ ...p }));
  // Seed awal §8 mainIdea.md: hanya admin mendapat seluruh 17 halaman; role lain kosong
  const access = pages.map((p) => ({ roleId: 1, pageId: p.id }));

  const staff = [
    { id: 1, nama: 'Admin Utama JOY', username: 'admin', passwordHash: adminHash, roleId: 1, active: true, deletedAt: null, createdAt: now },
  ];
  if (demo) {
    staff.push(
      { id: 2, nama: 'Tanaka Kenji (Sensei JOY 1)', username: 'sensei_joy1', passwordHash: senseiHash, roleId: 3, active: true, deletedAt: null, createdAt: now },
      { id: 3, nama: 'Dewi Anggraini (Sensei JOY 2)', username: 'sensei_joy2', passwordHash: senseiHash, roleId: 3, active: true, deletedAt: null, createdAt: now },
      { id: 4, nama: 'Rizal Hakim (Sensei JOY 3)', username: 'sensei_joy3', passwordHash: senseiHash, roleId: 3, active: true, deletedAt: null, createdAt: now },
      { id: 5, nama: 'Budi Santoso (Manager)', username: 'manager_joy', passwordHash: managerHash, roleId: 2, active: true, deletedAt: null, createdAt: now },
      { id: 6, nama: 'Yamamoto Haruka (Viewer JP)', username: 'viewer_jp', passwordHash: viewerHash, roleId: 4, active: true, deletedAt: null, createdAt: now },
    );
  }

  const programs = SEED_PROGRAMS.map((p) => ({ ...p, createdAt: now }));

  const kelas = demo
    ? [
        { id: 1, namaKelas: 'JOY 1', programId: 1, tanggalStart: '2026-01-12', description: 'Kelas intensif Tokutei Ginou Kaigo & Pengolahan Makanan', mancationClassId: 139, senseiId: 2, status: 'aktif', deletedAt: null, createdAt: now },
        { id: 2, namaKelas: 'JOY 2', programId: 1, tanggalStart: '2026-02-09', description: 'Kelas menengah N4 persiapan JFT-Basic & SSW', mancationClassId: 142, senseiId: 3, status: 'aktif', deletedAt: null, createdAt: now },
        { id: 3, namaKelas: 'JOY 3', programId: 2, tanggalStart: '2026-03-02', description: 'Kelas dasar Ginou Jisshuusei manufaktur & konstruksi', mancationClassId: 144, senseiId: 4, status: 'aktif', deletedAt: null, createdAt: now },
      ]
    : [];

  const peserta = demo
    ? SEED_MANCATION_STUDENTS.map((s, idx) => {
        const k = kelas.find((kl) => kl.mancationClassId === s.mancationClassId);
        const defaultTags = ['siap_interview', 'siap_interview', 'berkembang', 'standar', 'berkembang'];
        const tag = defaultTags[idx % defaultTags.length];
        return {
          id: idx + 1,
          mancationAkunId: s.mancationAkunId,
          kelasId: k ? k.id : null,
          statusTag: tag,
          sumber: 'roster',
          keteranganLuarKelas: null,
          alasan: '',
          tanggalMasuk: k ? k.tanggalStart : '2026-01-12',
          pendidikanAkhir: idx % 3 === 0 ? 'SMK Teknik Mesin' : idx % 3 === 1 ? 'SMA IPA' : 'D3 Keperawatan',
          tanggalLahirLokal: null,
          statusPernikahanLokal: '',
          jumlahAnakLokal: null,
          agamaLokal: '',
          daerahAsalLokal: '',
          catatanBebas: idx === 0 ? 'Lulus JFT-Basic A2 & SSW Pengolahan Makanan' : '',
          createdAt: now,
          updatedAt: now,
        };
      })
    : [];

  if (demo) {
    peserta.push({
      id: peserta.length + 1,
      mancationAkunId: 9801,
      kelasId: null,
      statusTag: 'siap_interview',
      sumber: 'manual',
      keteranganLuarKelas: 'alumni',
      alasan: 'Telah berangkat kerja ke Jepang (Aichi)',
      tanggalMasuk: '2025-07-10',
      pendidikanAkhir: 'SMK Otomotif',
      tanggalLahirLokal: null,
      statusPernikahanLokal: '',
      jumlahAnakLokal: null,
      agamaLokal: '',
      daerahAsalLokal: '',
      catatanBebas: 'Alumni angkatan sebelumnya',
      createdAt: now,
      updatedAt: now,
    });
  }

  const pesertaPenempatan = demo
    ? [
        {
          pesertaId: 1,
          tanggalLulusUjian: '2026-08-18',
          perusahaanNaitei: 'Kabushikigaisha Tokai Foods (東海フーズ株式会社)',
          jenisPekerjaan: 'Pengolahan Makanan (飲食料品製造業)',
          prefekturId: 23,
          lokasiKerja: 'Nagoya, Aichi',
          rencanaMulaiKerja: '2026-12-01',
          updatedAt: now,
        },
        {
          pesertaId: 2,
          tanggalLulusUjian: '2026-09-04',
          perusahaanNaitei: 'Sakura Care Fukushi Kai (さくら福祉会)',
          jenisPekerjaan: 'Kaigo / Perawat Lansia (介護)',
          prefekturId: 27,
          lokasiKerja: 'Sakai, Osaka',
          rencanaMulaiKerja: '2027-01-15',
          updatedAt: now,
        },
        {
          pesertaId: peserta.length,
          tanggalLulusUjian: '2025-12-12',
          perusahaanNaitei: 'Meinan Seiki Co., Ltd. (名南精機株式会社)',
          jenisPekerjaan: 'Manufaktur Komponen (素形材・産業機械)',
          prefekturId: 23,
          lokasiKerja: 'Toyota, Aichi',
          rencanaMulaiKerja: '2026-04-01',
          updatedAt: now,
        },
      ]
    : [];

  const pesertaStatusLog = demo
    ? [
        {
          id: 1,
          pesertaId: 1,
          statusLama: 'berkembang',
          statusBaru: 'siap_interview',
          diubahOlehStaffId: 1,
          catatan: 'Nilai kaiwa stabil A dan lulus simulasi mensetsu.',
          createdAt: now,
        },
        {
          id: 2,
          pesertaId: 2,
          statusLama: 'berkembang',
          statusBaru: 'siap_interview',
          diubahOlehStaffId: 1,
          catatan: 'Sertifikat SSW Kaigo sudah terbit.',
          createdAt: now,
        },
      ]
    : [];

  const curYm = now.slice(0, 7);
  const nilaiUjian = demo
    ? [
        { id: 1, pesertaId: 1, kelasId: 1, tanggalUjian: `${curYm}-06`, codeUjian: 'M001', pola: 'variable', nilaiTunggal: null, nilaiMojiGoi: 90, nilaiBunpou: 86, nilaiDokkai: 88, nilaiChoukai: 84, catatan: 'Ujian evaluasi N4 pekan 1', penilaiId: 2, createdAt: now },
        { id: 2, pesertaId: 2, kelasId: 1, tanggalUjian: `${curYm}-06`, codeUjian: 'M001', pola: 'variable', nilaiTunggal: null, nilaiMojiGoi: 92, nilaiBunpou: 88, nilaiDokkai: 90, nilaiChoukai: 86, catatan: 'Konsisten sangat baik', penilaiId: 2, createdAt: now },
        { id: 3, pesertaId: 3, kelasId: 1, tanggalUjian: `${curYm}-06`, codeUjian: 'M001', pola: 'variable', nilaiTunggal: null, nilaiMojiGoi: 76, nilaiBunpou: 72, nilaiDokkai: 74, nilaiChoukai: null, catatan: 'Sesi choukai izin klinik', penilaiId: 2, createdAt: now },
        { id: 4, pesertaId: 4, kelasId: 1, tanggalUjian: `${curYm}-06`, codeUjian: 'M001', pola: 'variable', nilaiTunggal: null, nilaiMojiGoi: 64, nilaiBunpou: 62, nilaiDokkai: 68, nilaiChoukai: 60, catatan: 'Perlu pendampingan bunpou', penilaiId: 2, createdAt: now },
        { id: 5, pesertaId: 6, kelasId: 2, tanggalUjian: `${curYm}-09`, codeUjian: 'M002', pola: 'variable', nilaiTunggal: null, nilaiMojiGoi: 85, nilaiBunpou: 82, nilaiDokkai: 80, nilaiChoukai: 83, catatan: 'Simulasi JFT-Basic', penilaiId: 3, createdAt: now },
        { id: 6, pesertaId: 10, kelasId: 3, tanggalUjian: `${curYm}-10`, codeUjian: 'HIRAGANA-01', pola: 'tunggal', nilaiTunggal: 88, nilaiMojiGoi: null, nilaiBunpou: null, nilaiDokkai: null, nilaiChoukai: null, catatan: 'Tes dasar penulisan kana', penilaiId: 4, createdAt: now },
        { id: 7, pesertaId: 11, kelasId: 3, tanggalUjian: `${curYm}-10`, codeUjian: 'HIRAGANA-01', pola: 'tunggal', nilaiTunggal: 79, nilaiMojiGoi: null, nilaiBunpou: null, nilaiDokkai: null, nilaiChoukai: null, catatan: 'Lancar membaca', penilaiId: 4, createdAt: now },
      ]
    : [];

  const nilaiKaiwa = demo
    ? [
        { id: 1, pesertaId: 1, kelasId: 1, tanggalKaiwa: `${curYm}-04`, grade: 'B', description: 'Perkenalan diri masih agak cepat', penilaiId: 2, createdAt: now },
        { id: 2, pesertaId: 1, kelasId: 1, tanggalKaiwa: `${curYm}-14`, grade: 'A', description: 'Jikoshoukai & tanya jawab mensetsu sangat lancar', penilaiId: 2, createdAt: now },
        { id: 3, pesertaId: 2, kelasId: 1, tanggalKaiwa: `${curYm}-14`, grade: 'A', description: 'Keigo sopan dan pengucapan jelas', penilaiId: 2, createdAt: now },
        { id: 4, pesertaId: 3, kelasId: 1, tanggalKaiwa: `${curYm}-14`, grade: 'B', description: 'Respons cukup baik, perlu memperkaya kosakata kerja', penilaiId: 2, createdAt: now },
        { id: 5, pesertaId: 4, kelasId: 1, tanggalKaiwa: `${curYm}-14`, grade: 'C', description: 'Masih ragu menyusun kalimat spontan', penilaiId: 2, createdAt: now },
        { id: 6, pesertaId: 6, kelasId: 2, tanggalKaiwa: `${curYm}-15`, grade: 'A', description: 'Simulasi mensetsu pengolahan makanan baik', penilaiId: 3, createdAt: now },
        { id: 7, pesertaId: 7, kelasId: 2, tanggalKaiwa: `${curYm}-15`, grade: 'B', description: 'Intonasi baik, latihan mendengar pertanyaan panjang', penilaiId: 3, createdAt: now },
      ]
    : [];

  const nilaiSikap = demo
    ? [
        { id: 1, pesertaId: 1, kelasId: 1, kategoriId: 3, tanggalPenilaian: `${curYm}-05`, sentiment: 'positif', bobot: 5, description: 'Memimpin piket 5S ruang kelas dengan rapi', penilaiId: 2, createdAt: now },
        { id: 2, pesertaId: 1, kelasId: 1, kategoriId: 8, tanggalPenilaian: `${curYm}-12`, sentiment: 'positif', bobot: 10, description: 'Nilai tertinggi evaluasi mingguan kelas JOY 1', penilaiId: 2, createdAt: now },
        { id: 3, pesertaId: 2, kelasId: 1, kategoriId: 6, tanggalPenilaian: `${curYm}-08`, sentiment: 'positif', bobot: 5, description: 'Disiplin menerapkan Horenso ke Sensei', penilaiId: 2, createdAt: now },
        { id: 4, pesertaId: 4, kelasId: 1, kategoriId: 10, tanggalPenilaian: `${curYm}-11`, sentiment: 'negatif', bobot: 10, description: 'Terlambat mengumpulkan buku latihan kanji', penilaiId: 2, createdAt: now },
        { id: 5, pesertaId: 6, kelasId: 2, kategoriId: 5, tanggalPenilaian: `${curYm}-13`, sentiment: 'positif', bobot: 5, description: 'Aktif membantu rekan latihan kaiwa', penilaiId: 3, createdAt: now },
      ]
    : [];

  const absensi = demo
    ? [
        { id: 1, pesertaId: 1, kelasId: 1, tanggalAbsensi: `${curYm}-01`, status: 'hadir', description: '', penilaiId: 2, updatedAt: now },
        { id: 2, pesertaId: 2, kelasId: 1, tanggalAbsensi: `${curYm}-01`, status: 'hadir', description: '', penilaiId: 2, updatedAt: now },
        { id: 3, pesertaId: 3, kelasId: 1, tanggalAbsensi: `${curYm}-01`, status: 'hadir', description: '', penilaiId: 2, updatedAt: now },
        { id: 4, pesertaId: 4, kelasId: 1, tanggalAbsensi: `${curYm}-01`, status: 'sakit', description: 'Surat dokter klinik', penilaiId: 2, updatedAt: now },
        { id: 5, pesertaId: 5, kelasId: 1, tanggalAbsensi: `${curYm}-01`, status: 'hadir', description: '', penilaiId: 2, updatedAt: now },
        { id: 6, pesertaId: 1, kelasId: 1, tanggalAbsensi: `${curYm}-02`, status: 'hadir', description: '', penilaiId: 2, updatedAt: now },
        { id: 7, pesertaId: 2, kelasId: 1, tanggalAbsensi: `${curYm}-02`, status: 'hadir', description: '', penilaiId: 2, updatedAt: now },
        { id: 8, pesertaId: 3, kelasId: 1, tanggalAbsensi: `${curYm}-02`, status: 'izin', description: 'Urus paspor imigrasi', penilaiId: 2, updatedAt: now },
        { id: 9, pesertaId: 4, kelasId: 1, tanggalAbsensi: `${curYm}-02`, status: 'hadir', description: '', penilaiId: 2, updatedAt: now },
        { id: 10, pesertaId: 5, kelasId: 1, tanggalAbsensi: `${curYm}-02`, status: 'hadir', description: '', penilaiId: 2, updatedAt: now },
        { id: 11, pesertaId: 6, kelasId: 2, tanggalAbsensi: `${curYm}-02`, status: 'hadir', description: '', penilaiId: 3, updatedAt: now },
        { id: 12, pesertaId: 7, kelasId: 2, tanggalAbsensi: `${curYm}-02`, status: 'hadir', description: '', penilaiId: 3, updatedAt: now },
        { id: 13, pesertaId: 8, kelasId: 2, tanggalAbsensi: `${curYm}-02`, status: 'alfa', description: 'Tanpa keterangan pagi', penilaiId: 3, updatedAt: now },
        { id: 14, pesertaId: 9, kelasId: 2, tanggalAbsensi: `${curYm}-02`, status: 'hadir', description: '', penilaiId: 3, updatedAt: now },
      ]
    : [];

  const sikapKategori = SEED_SIKAP_KATEGORI.map((k) => ({ ...k, createdAt: now }));

  const auditLog = [
    {
      id: 1,
      staffId: 1,
      staffNama: 'Admin Utama JOY',
      aksi: 'SYSTEM_SEED',
      entitas: 'system',
      entitasId: 'init',
      detail: { info: 'Inisialisasi awal database JOYdata Cabang JOY' },
      createdAt: now,
    },
  ];

  const mancationKelasCache = demo
    ? SEED_MANCATION_CLASSES.map((c) => ({ ...c, syncedAt: now }))
    : [];
  const mancationPesertaCache = demo
    ? [...SEED_MANCATION_STUDENTS, ...SEED_MANCATION_OUTSIDE_CANDIDATES].map((s) => ({ ...s, syncedAt: now }))
    : [];

  return {
    roles,
    pages,
    access,
    staff,
    programs,
    kelas,
    peserta,
    pesertaPenempatan,
    pesertaStatusLog,
    nilaiUjian,
    nilaiKaiwa,
    nilaiSikap,
    absensi,
    sikapKategori,
    settings: { ...SEED_SETTINGS },
    auditLog,
    mancationKelasCache,
    mancationPesertaCache,
    seq: {
      role: roles.length + 1,
      staff: staff.length + 1,
      program: programs.length + 1,
      kelas: kelas.length + 1,
      peserta: peserta.length + 1,
      pesertaStatusLog: pesertaStatusLog.length + 1,
      sikapKategori: sikapKategori.length + 1,
      nilaiUjian: nilaiUjian.length + 1,
      nilaiKaiwa: nilaiKaiwa.length + 1,
      nilaiSikap: nilaiSikap.length + 1,
      absensi: absensi.length + 1,
      auditLog: auditLog.length + 1,
    },
  };
}

function ensurePhase2Collections(state) {
  let dirty = false;
  if (!Array.isArray(state.nilaiUjian)) {
    const fresh = createInitialLocalState();
    state.nilaiUjian = fresh.nilaiUjian;
    state.nilaiKaiwa = fresh.nilaiKaiwa;
    state.nilaiSikap = fresh.nilaiSikap;
    state.absensi = fresh.absensi;
    state.seq = { ...fresh.seq, ...(state.seq || {}) };
    dirty = true;
  }
  if (!Array.isArray(state.pushSubscriptions)) {
    state.pushSubscriptions = [];
    dirty = true;
  }
  if (!Array.isArray(state.pushLogs)) {
    state.pushLogs = [];
    dirty = true;
  }
  if (!Array.isArray(state.smartReportResume)) {
    state.smartReportResume = [];
    dirty = true;
  }
  if (!Array.isArray(state.pesertaAkun)) {
    state.pesertaAkun = [];
    dirty = true;
  }
  for (const p of SEED_PAGES) {
    if ((state.pages || []).some((existing) => existing.kode === p.kode)) continue;
    const { defaultRoles = [], ...page } = p;
    state.pages.push({ ...page });
    for (const role of (state.roles || []).filter((r) => defaultRoles.includes(r.kode))) {
      state.access.push({ roleId: role.id, pageId: page.id });
    }
    dirty = true;
  }
  state.seq = state.seq || {};
  state.seq.nilaiUjian = state.seq.nilaiUjian || (state.nilaiUjian.length + 1);
  state.seq.nilaiKaiwa = state.seq.nilaiKaiwa || ((state.nilaiKaiwa || []).length + 1);
  state.seq.nilaiSikap = state.seq.nilaiSikap || ((state.nilaiSikap || []).length + 1);
  state.seq.absensi = state.seq.absensi || ((state.absensi || []).length + 1);
  state.seq.pushSubscription = state.seq.pushSubscription || ((state.pushSubscriptions || []).length + 1);
  state.seq.pushLog = state.seq.pushLog || ((state.pushLogs || []).length + 1);
  return dirty;
}

export function readLocalState() {
  if (localState) return localState;
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
      localState = JSON.parse(raw);
      if (ensurePhase2Collections(localState)) {
        saveLocalState();
      }
      return localState;
    }
  } catch (err) {
    console.warn('Rebuilding local DB state:', err.message);
  }
  localState = createInitialLocalState();
  saveLocalState();
  return localState;
}

export function writeLocalStateFile(state) {
  fs.mkdirSync(path.dirname(LOCAL_DB_PATH), { recursive: true });
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(state, null, 2), 'utf8');
}

export function saveLocalState() {
  if (!localState) return;
  writeLocalStateFile(localState);
}

async function initPostgresSchemaAndSeed(pool) {
  const sqlPath = path.resolve(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
  const ddl = fs.readFileSync(sqlPath, 'utf8');
  await pool.query(ddl);

  for (const r of SEED_ROLES) {
    await pool.query(
      `INSERT INTO role (id, kode, role_name_id, role_name_ja, is_system)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (kode) DO UPDATE SET role_name_id = EXCLUDED.role_name_id, role_name_ja = EXCLUDED.role_name_ja`,
      [r.id, r.kode, r.roleNameId, r.roleNameJa, r.isSystem]
    );
  }
  await pool.query(`SELECT setval('role_id_seq', GREATEST((SELECT COALESCE(MAX(id), 1) FROM role), 4))`);

  const existingPageKodes = new Set((await pool.query(`SELECT kode FROM page`)).rows.map((r) => r.kode));
  for (const p of SEED_PAGES) {
    await pool.query(
      `INSERT INTO page (id, kode, bar, route_path, title_id, title_ja, icon, urutan, fase)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (kode) DO UPDATE SET
         bar = EXCLUDED.bar,
         route_path = EXCLUDED.route_path,
         title_id = EXCLUDED.title_id,
         title_ja = EXCLUDED.title_ja,
         icon = EXCLUDED.icon,
         urutan = EXCLUDED.urutan,
         fase = EXCLUDED.fase`,
      [p.id, p.kode, p.bar, p.routePath, p.titleId, p.titleJa, p.icon, p.urutan, p.fase]
    );
    // A page added after the first install starts with its default roles; later access changes stay with the admin.
    if (existingPageKodes.size > 0 && !existingPageKodes.has(p.kode) && p.defaultRoles?.length) {
      await pool.query(
        `INSERT INTO access (role_id, page_id)
         SELECT r.id, pg.id FROM role r, page pg WHERE r.kode = ANY($1) AND pg.kode = $2
         ON CONFLICT DO NOTHING`,
        [p.defaultRoles, p.kode]
      );
    }
  }

  const adminRoleRes = await pool.query(`SELECT id FROM role WHERE kode = 'admin' LIMIT 1`);
  const adminRoleId = adminRoleRes.rows[0].id;
  const existingAccess = await pool.query(`SELECT COUNT(*)::int AS cnt FROM access WHERE role_id = $1`, [adminRoleId]);
  if (existingAccess.rows[0].cnt === 0) {
    await pool.query(
      `INSERT INTO access (role_id, page_id) SELECT $1, id FROM page ON CONFLICT DO NOTHING`,
      [adminRoleId]
    );
  }

  const staffCount = await pool.query(`SELECT COUNT(*)::int AS cnt FROM staff`);
  let demoStaffSeeded = false;
  if (staffCount.rows[0].cnt === 0) {
    const adminHash = bcrypt.hashSync('admin123', 10);
    const roleMapRes = await pool.query(`SELECT id, kode FROM role`);
    const rMap = Object.fromEntries(roleMapRes.rows.map((r) => [r.kode, r.id]));

    await pool.query(
      `INSERT INTO staff (nama, username, password_hash, role_id, active)
       VALUES ('Admin Utama JOY', 'admin', $1, $2, TRUE)
       ON CONFLICT (username) DO NOTHING`,
      [adminHash, rMap.admin]
    );

    if (isDemoSeedEnabled()) {
      const senseiHash = bcrypt.hashSync('sensei123', 10);
      const managerHash = bcrypt.hashSync('manager123', 10);
      const viewerHash = bcrypt.hashSync('viewer123', 10);

      await pool.query(
        `INSERT INTO staff (nama, username, password_hash, role_id, active) VALUES
         ('Tanaka Kenji (Sensei JOY 1)', 'sensei_joy1', $1, $2, TRUE),
         ('Dewi Anggraini (Sensei JOY 2)', 'sensei_joy2', $1, $2, TRUE),
         ('Rizal Hakim (Sensei JOY 3)', 'sensei_joy3', $1, $2, TRUE),
         ('Budi Santoso (Manager)', 'manager_joy', $3, $4, TRUE),
         ('Yamamoto Haruka (Viewer JP)', 'viewer_jp', $5, $6, TRUE)
         ON CONFLICT (username) DO NOTHING`,
        [senseiHash, rMap.sensei, managerHash, rMap.manager, viewerHash, rMap.viewer]
      );
      demoStaffSeeded = true;
    }
  }

  const progCount = await pool.query(`SELECT COUNT(*)::int AS cnt FROM program`);
  if (progCount.rows[0].cnt === 0) {
    for (const pr of SEED_PROGRAMS) {
      await pool.query(
        `INSERT INTO program (nama_id, nama_ja, urutan, aktif) VALUES ($1, $2, $3, $4)`,
        [pr.namaId, pr.namaJa, pr.urutan, pr.aktif]
      );
    }
  }

  const kelasCount = await pool.query(`SELECT COUNT(*)::int AS cnt FROM kelas`);
  // Only seed demo kelas together with the demo sensei accounts, otherwise they would
  // be created with sensei_id = NULL (dangling) after a reset removed the demo staff.
  if (demoStaffSeeded && kelasCount.rows[0].cnt === 0) {
    const progs = await pool.query(`SELECT id FROM program ORDER BY urutan ASC`);
    const senseis = await pool.query(
      `SELECT s.id FROM staff s JOIN role r ON r.id = s.role_id WHERE r.kode = 'sensei' ORDER BY s.id ASC`
    );
    const p1 = progs.rows[0]?.id || null;
    const p2 = progs.rows[1]?.id || p1;
    await pool.query(
      `INSERT INTO kelas (nama_kelas, program_id, tanggal_start, description, mancation_class_id, sensei_id, status)
       VALUES
       ('JOY 1', $1, '2026-01-12', 'Kelas intensif Tokutei Ginou Kaigo & Pengolahan Makanan', 139, $3, 'aktif'),
       ('JOY 2', $1, '2026-02-09', 'Kelas menengah N4 persiapan JFT-Basic & SSW', 142, $4, 'aktif'),
       ('JOY 3', $2, '2026-03-02', 'Kelas dasar Ginou Jisshuusei manufaktur & konstruksi', 144, $5, 'aktif')
       ON CONFLICT (mancation_class_id) DO NOTHING`,
      [p1, p2, senseis.rows[0]?.id || null, senseis.rows[1]?.id || null, senseis.rows[2]?.id || null]
    );
  }

  const katCount = await pool.query(`SELECT COUNT(*)::int AS cnt FROM sikap_kategori`);
  if (katCount.rows[0].cnt === 0) {
    for (const k of SEED_SIKAP_KATEGORI) {
      await pool.query(
        `INSERT INTO sikap_kategori (nama_id, nama_ja, sentiment_default, bobot_default, urutan, aktif)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [k.namaId, k.namaJa, k.sentimentDefault, k.bobotDefault, k.urutan, k.aktif]
      );
    }
  }
}

export async function ensureInitialized() {
  if (initialized) return storageMode;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const pool = createPgPoolIfConfigured();
    if (pool) {
      try {
        await initPostgresSchemaAndSeed(pool);
        storageMode = 'postgres';
        initialized = true;
        return storageMode;
      } catch (err) {
        pgPool = null;
        pool.end().catch(() => {});
        // Vercel has no writable disk for the local store: fail this request and retry Postgres on the next.
        if (process.env.VERCEL) throw err;
        console.warn('PostgreSQL unavailable, activating local persistent store:', err.message);
      }
    }
    if (process.env.VERCEL) {
      throw new Error('DATABASE_URL is not configured; the local store cannot be used on Vercel');
    }
    readLocalState();
    storageMode = 'local';
    initialized = true;
    return storageMode;
  })();

  try {
    return await initPromise;
  } finally {
    initPromise = null;
  }
}

export function appendLocalAudit(db, actor, aksi, entitas, entitasId, detail = {}) {
  const id = db.seq.auditLog++;
  db.auditLog.unshift({
    id,
    staffId: actor?.id || null,
    staffNama: actor?.nama || 'System',
    aksi,
    entitas,
    entitasId: String(entitasId),
    detail,
    createdAt: new Date().toISOString(),
  });
  if (db.auditLog.length > 500) db.auditLog.length = 500;
}

export async function appendAudit(actor, aksi, entitas, entitasId, detail = {}) {
  await ensureInitialized();
  if (storageMode === 'postgres') {
    await pgPool.query(
      `INSERT INTO audit_log (staff_id, staff_nama, aksi, entitas, entitas_id, detail)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [actor?.id || null, actor?.nama || 'System', aksi, entitas, String(entitasId), JSON.stringify(detail)]
    );
  } else {
    const db = readLocalState();
    appendLocalAudit(db, actor, aksi, entitas, entitasId, detail);
    saveLocalState();
  }
}
