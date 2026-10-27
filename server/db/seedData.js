/**
 * Demo/seed data switch. Defaults to enabled to preserve the original dev experience.
 * Set JOY_SEED_DEMO=false to bootstrap an empty dataset (only roles, pages, access,
 * admin account, settings, master program & sikap kategori) instead of the JOY demo data.
 */
export function isDemoSeedEnabled() {
  const raw = String(process.env.JOY_SEED_DEMO ?? 'true').trim().toLowerCase();
  return !['false', '0', 'no', 'off'].includes(raw);
}

export const SEED_ROLES = [
  { id: 1, kode: 'admin', roleNameId: 'Administrator', roleNameJa: '管理者', isSystem: true },
  { id: 2, kode: 'manager', roleNameId: 'Manager', roleNameJa: 'マネージャー', isSystem: true },
  { id: 3, kode: 'sensei', roleNameId: 'Sensei Pengajar', roleNameJa: '講師（先生）', isSystem: true },
  { id: 4, kode: 'viewer', roleNameId: 'Viewer (Staf Jepang)', roleNameJa: '閲覧者', isSystem: true },
];

export const SEED_PAGES = [
  // Main bar (10 halaman sesuai §8 mainIdea.md)
  { id: 1, kode: 'dashboard', bar: 'main', routePath: '/dashboard', titleId: 'Dashboard', titleJa: 'ダッシュボード', icon: 'mdi-view-dashboard-outline', urutan: 1, fase: 1 },
  { id: 2, kode: 'progres-peserta', bar: 'main', routePath: '/progres', titleId: 'Progres Peserta', titleJa: '受講生進捗', icon: 'mdi-chart-timeline-variant', urutan: 2, fase: 3 },
  { id: 3, kode: 'rekap-nilai-ujian', bar: 'main', routePath: '/nilai-ujian', titleId: 'Rekap Nilai Ujian', titleJa: '試験成績集計', icon: 'mdi-clipboard-text-outline', urutan: 3, fase: 2 },
  { id: 4, kode: 'rekap-nilai-kaiwa', bar: 'main', routePath: '/nilai-kaiwa', titleId: 'Rekap Nilai Kaiwa', titleJa: '会話評価集計', icon: 'mdi-account-voice', urutan: 4, fase: 2 },
  { id: 5, kode: 'rekap-nilai-sikap', bar: 'main', routePath: '/nilai-sikap', titleId: 'Rekap Nilai Sikap', titleJa: '態度・生活評価', icon: 'mdi-scale-balance', urutan: 5, fase: 2 },
  { id: 6, kode: 'rekap-absensi', bar: 'main', routePath: '/absensi', titleId: 'Rekap Absensi', titleJa: '出席管理', icon: 'mdi-calendar-check-outline', urutan: 6, fase: 2 },
  { id: 7, kode: 'data-kelas', bar: 'main', routePath: '/kelas', titleId: 'Data Kelas', titleJa: 'クラス管理', icon: 'mdi-google-classroom', urutan: 7, fase: 1 },
  { id: 8, kode: 'data-peserta', bar: 'main', routePath: '/peserta', titleId: 'Data Peserta', titleJa: '受講生名簿', icon: 'mdi-account-group-outline', urutan: 8, fase: 1 },
  { id: 9, kode: 'peserta-luar', bar: 'main', routePath: '/peserta-luar', titleId: 'Peserta Luar Kelas', titleJa: 'クラス外受講生（卒業・休学）', icon: 'mdi-account-arrow-right-outline', urutan: 9, fase: 1 },
  { id: 10, kode: 'rapor-peserta', bar: 'main', routePath: '/rapor', titleId: 'Rapor Peserta', titleJa: '個人成績表（PDF）', icon: 'mdi-file-certificate-outline', urutan: 10, fase: 3 },
  // Config bar (7 halaman sesuai §8 mainIdea.md)
  { id: 11, kode: 'crud-staff', bar: 'config', routePath: '/config/staff', titleId: 'Crud Staff', titleJa: 'スタッフ管理', icon: 'mdi-badge-account-horizontal-outline', urutan: 11, fase: 1 },
  { id: 12, kode: 'akun-notifikasi', bar: 'config', routePath: '/config/akun', titleId: 'Akun & Notifikasi Staff', titleJa: 'アカウント・通知設定', icon: 'mdi-bell-cog-outline', urutan: 12, fase: 1 },
  { id: 13, kode: 'kategori-sikap', bar: 'config', routePath: '/config/kategori-sikap', titleId: 'Kategori Sikap', titleJa: '態度評価カテゴリ', icon: 'mdi-tag-multiple-outline', urutan: 13, fase: 1 },
  { id: 14, kode: 'program', bar: 'config', routePath: '/config/program', titleId: 'Program', titleJa: 'プログラム管理', icon: 'mdi-book-education-outline', urutan: 14, fase: 1 },
  { id: 15, kode: 'pengaturan', bar: 'config', routePath: '/config/pengaturan', titleId: 'Pengaturan', titleJa: 'システム設定', icon: 'mdi-tune-variant', urutan: 15, fase: 3 },
  { id: 16, kode: 'role-akses', bar: 'config', routePath: '/config/akses', titleId: 'Role & Akses', titleJa: 'ロール・権限設定', icon: 'mdi-shield-key-outline', urutan: 16, fase: 1 },
  { id: 17, kode: 'riwayat-aktivitas', bar: 'config', routePath: '/config/audit-log', titleId: 'Riwayat Aktivitas', titleJa: '操作履歴ログ', icon: 'mdi-history', urutan: 17, fase: 2 },
];

export const SEED_PROGRAMS = [
  { id: 1, namaId: 'Tokutei Ginou (TG)', namaJa: '特定技能', urutan: 1, aktif: true },
  { id: 2, namaId: 'Ginou Jisshuusei (Magang)', namaJa: '技能実習', urutan: 2, aktif: true },
  { id: 3, namaId: 'Engineering / Gijinkoku', namaJa: '技術・人文知識・国際業務', urutan: 3, aktif: true },
  { id: 4, namaId: 'Kelas Persiapan N4', namaJa: 'N4対策基礎クラス', urutan: 4, aktif: true },
];

export const SEED_SIKAP_KATEGORI = [
  // 8 Positif (§4 mainIdea.md)
  { id: 1, namaId: 'Kehadiran & ketepatan waktu', namaJa: '出席・時間厳守', sentimentDefault: 'positif', bobotDefault: 5, urutan: 1, aktif: true },
  { id: 2, namaId: 'Kedisiplinan aturan & pakaian', namaJa: '規律・身だしなみ', sentimentDefault: 'positif', bobotDefault: 5, urutan: 2, aktif: true },
  { id: 3, namaId: 'Kerapian & kebersihan (5S/5R)', namaJa: '整理整頓・清掃（5S）', sentimentDefault: 'positif', bobotDefault: 5, urutan: 3, aktif: true },
  { id: 4, namaId: 'Kerja sama & membantu teman', namaJa: '協調性・相互扶助', sentimentDefault: 'positif', bobotDefault: 5, urutan: 4, aktif: true },
  { id: 5, namaId: 'Keaktifan pelatihan', namaJa: '授業への積極性', sentimentDefault: 'positif', bobotDefault: 5, urutan: 5, aktif: true },
  { id: 6, namaId: 'Horenso (lapor / konsultasi / komunikasi)', namaJa: '報連相（報告・連絡・相談）', sentimentDefault: 'positif', bobotDefault: 5, urutan: 6, aktif: true },
  { id: 7, namaId: 'Ibadah & kerohanian', namaJa: '礼拝・精神面の規律', sentimentDefault: 'positif', bobotDefault: 5, urutan: 7, aktif: true },
  { id: 8, namaId: 'Prestasi (ujian / lomba)', namaJa: '優秀成績・表彰', sentimentDefault: 'positif', bobotDefault: 10, urutan: 8, aktif: true },
  // 6 Negatif (§4 mainIdea.md — bobot disimpan magnitude positif)
  { id: 9, namaId: 'Terlambat', namaJa: '遅刻', sentimentDefault: 'negatif', bobotDefault: 5, urutan: 9, aktif: true },
  { id: 10, namaId: 'Tidak mengumpulkan tugas', namaJa: '課題未提出', sentimentDefault: 'negatif', bobotDefault: 10, urutan: 10, aktif: true },
  { id: 11, namaId: 'Mengganggu kelas', namaJa: '授業妨害・私語', sentimentDefault: 'negatif', bobotDefault: 10, urutan: 11, aktif: true },
  { id: 12, namaId: 'Alfa tanpa kabar', namaJa: '無断欠席', sentimentDefault: 'negatif', bobotDefault: 10, urutan: 12, aktif: true },
  { id: 13, namaId: 'Tidak sopan', namaJa: '礼儀不良・言葉遣い', sentimentDefault: 'negatif', bobotDefault: 15, urutan: 13, aktif: true },
  { id: 14, namaId: 'Pelanggaran berat (merokok, dsb.)', namaJa: '重大規律違反（喫煙等）', sentimentDefault: 'negatif', bobotDefault: 20, urutan: 14, aktif: true },
];

export const SEED_SETTINGS = {
  kkm_ujian: 70,
  kkm_sikap: 70,
  batas_grade: { A: 90, B: 75, C: 60 },
  sikap_basis: 75,
  rentang_tren_bulan: 12,
};

/**
 * Snapshot fallback untuk kelas & roster JOY (139, 142, 144) apabila koneksi MySQL mancation
 * belum dikonfigurasi pada Secrets atau sedang tidak terjangkau.
 * Begitu MySQL mancation aktif, data ini otomatis digantikan oleh hasil query live.
 */
export const SEED_MANCATION_CLASSES = [
  { mancationClassId: 139, namaKelas: 'JOY 1', programStudi: 'Tokutei Ginou', classStat: 1 },
  { mancationClassId: 142, namaKelas: 'JOY 2', programStudi: 'Tokutei Ginou', classStat: 1 },
  { mancationClassId: 144, namaKelas: 'JOY 3', programStudi: 'Ginou Jisshuusei', classStat: 1 },
];

export const SEED_MANCATION_STUDENTS = [
  // JOY 1 (mancationClassId: 139)
  { mancationAkunId: 9101, mancationClassId: 139, cliId: 9, nama: 'Rizky Pratama Putra', tanggalLahir: '2003-05-14', statusPernikahan: 'Belum Menikah', jumlahAnak: 0, agama: 'Islam', daerahAsal: 'Kab. Bandung, Jawa Barat', whatsapp: '081234560101' },
  { mancationAkunId: 9102, mancationClassId: 139, cliId: 9, nama: 'Siti Nurhaliza Rahma', tanggalLahir: '2004-01-22', statusPernikahan: 'Belum Menikah', jumlahAnak: 0, agama: 'Islam', daerahAsal: 'Kota Semarang, Jawa Tengah', whatsapp: '081234560102' },
  { mancationAkunId: 9103, mancationClassId: 139, cliId: 9, nama: 'Dimas Arya Saputra', tanggalLahir: '2002-11-08', statusPernikahan: 'Belum Menikah', jumlahAnak: 0, agama: 'Islam', daerahAsal: 'Kab. Sleman, DI Yogyakarta', whatsapp: '081234560103' },
  { mancationAkunId: 9104, mancationClassId: 139, cliId: 9, nama: 'Aulia Putri Maharani', tanggalLahir: null, statusPernikahan: '', jumlahAnak: null, agama: '', daerahAsal: '', whatsapp: '081234560104' },
  { mancationAkunId: 9105, mancationClassId: 139, cliId: 9, nama: 'Fajar Nugroho Wijaya', tanggalLahir: '2001-08-19', statusPernikahan: 'Menikah', jumlahAnak: 1, agama: 'Islam', daerahAsal: 'Kab. Cirebon, Jawa Barat', whatsapp: '081234560105' },
  // JOY 2 (mancationClassId: 142)
  { mancationAkunId: 9201, mancationClassId: 142, cliId: 9, nama: 'Bagas Adi Kurniawan', tanggalLahir: '2003-09-03', statusPernikahan: 'Belum Menikah', jumlahAnak: 0, agama: 'Islam', daerahAsal: 'Kab. Banyumas, Jawa Tengah', whatsapp: '081234560201' },
  { mancationAkunId: 9202, mancationClassId: 142, cliId: 9, nama: 'Nabila Azzahra', tanggalLahir: '2004-04-17', statusPernikahan: 'Belum Menikah', jumlahAnak: 0, agama: 'Islam', daerahAsal: 'Kota Malang, Jawa Timur', whatsapp: '081234560202' },
  { mancationAkunId: 9203, mancationClassId: 142, cliId: 9, nama: 'Hendra Gunawan', tanggalLahir: null, statusPernikahan: '', jumlahAnak: null, agama: '', daerahAsal: '', whatsapp: '081234560203' },
  { mancationAkunId: 9204, mancationClassId: 142, cliId: 9, nama: 'Putri Ayu Lestari', tanggalLahir: '2003-12-11', statusPernikahan: 'Belum Menikah', jumlahAnak: 0, agama: 'Hindu', daerahAsal: 'Kab. Gianyar, Bali', whatsapp: '081234560204' },
  // JOY 3 (mancationClassId: 144)
  { mancationAkunId: 9301, mancationClassId: 144, cliId: 9, nama: 'Muhammad Ilham Ramadhan', tanggalLahir: '2002-07-29', statusPernikahan: 'Belum Menikah', jumlahAnak: 0, agama: 'Islam', daerahAsal: 'Kota Bekasi, Jawa Barat', whatsapp: '081234560301' },
  { mancationAkunId: 9302, mancationClassId: 144, cliId: 9, nama: 'Dewi Sartika Sari', tanggalLahir: null, statusPernikahan: '', jumlahAnak: null, agama: '', daerahAsal: '', whatsapp: '081234560302' },
  { mancationAkunId: 9303, mancationClassId: 144, cliId: 9, nama: 'Rangga Pradipta', tanggalLahir: '2003-02-25', statusPernikahan: 'Belum Menikah', jumlahAnak: 0, agama: 'Kristen', daerahAsal: 'Kota Manado, Sulawesi Utara', whatsapp: '081234560303' },
];

// Akun kandidat cli_id = 9 di luar kelas JOY (id_kelas = 0 / 149 cuti) untuk lookup Peserta Luar Kelas
export const SEED_MANCATION_OUTSIDE_CANDIDATES = [
  { mancationAkunId: 9801, mancationClassId: 0, cliId: 9, nama: 'Bayu Setiawan (Alumni TG)', tanggalLahir: '2001-03-12', statusPernikahan: 'Belum Menikah', jumlahAnak: 0, agama: 'Islam', daerahAsal: 'Kab. Karawang, Jawa Barat', whatsapp: '081298010001' },
  { mancationAkunId: 9802, mancationClassId: 149, cliId: 9, nama: 'Rina Permata Sari', tanggalLahir: '2003-06-20', statusPernikahan: 'Belum Menikah', jumlahAnak: 0, agama: 'Islam', daerahAsal: 'Kab. Subang, Jawa Barat', whatsapp: '081298020002' },
  { mancationAkunId: 9803, mancationClassId: 0, cliId: 9, nama: 'Andika Pratama', tanggalLahir: '2002-10-05', statusPernikahan: 'Belum Menikah', jumlahAnak: 0, agama: 'Islam', daerahAsal: 'Kab. Tegal, Jawa Tengah', whatsapp: '081298030003' },
];
