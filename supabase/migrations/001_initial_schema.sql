-- =============================================================================
-- JOYdata — Initial PostgreSQL Schema & Seed (Supabase Compatible)
-- Cabang JOY — LPK Mizuno Semangat Bangsa
-- Catatan Keputusan:
--   1. Data penempatan 名簿 & 最終学歴 (pendidikan_akhir) dikelola manual di JOYdata.
--   2. Kolom statusMancation / 現状 TIDAK digunakan sesuai keputusan pengguna.
-- =============================================================================

CREATE TABLE IF NOT EXISTS role (
  id SERIAL PRIMARY KEY,
  kode VARCHAR(50) NOT NULL UNIQUE,
  role_name_id VARCHAR(100) NOT NULL,
  role_name_ja VARCHAR(100) NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page (
  id SERIAL PRIMARY KEY,
  kode VARCHAR(60) NOT NULL UNIQUE,
  bar VARCHAR(20) NOT NULL CHECK (bar IN ('main', 'config')),
  route_path VARCHAR(120) NOT NULL UNIQUE,
  title_id VARCHAR(120) NOT NULL,
  title_ja VARCHAR(120) NOT NULL,
  icon VARCHAR(80) NOT NULL DEFAULT 'mdi-file-document-outline',
  urutan INTEGER NOT NULL DEFAULT 0,
  fase INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS access (
  role_id INTEGER NOT NULL REFERENCES role(id) ON DELETE CASCADE,
  page_id INTEGER NOT NULL REFERENCES page(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, page_id)
);

CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(150) NOT NULL,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role_id INTEGER NOT NULL REFERENCES role(id) ON DELETE RESTRICT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS program (
  id SERIAL PRIMARY KEY,
  nama_id VARCHAR(150) NOT NULL,
  nama_ja VARCHAR(150) NOT NULL,
  urutan INTEGER NOT NULL DEFAULT 0,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kelas (
  id SERIAL PRIMARY KEY,
  nama_kelas VARCHAR(120) NOT NULL,
  program_id INTEGER NULL REFERENCES program(id) ON DELETE SET NULL,
  tanggal_start DATE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  mancation_class_id INTEGER NULL UNIQUE,
  sensei_id INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'selesai')),
  deleted_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS peserta (
  id SERIAL PRIMARY KEY,
  mancation_akun_id INTEGER NOT NULL UNIQUE,
  kelas_id INTEGER NULL REFERENCES kelas(id) ON DELETE SET NULL,
  status_tag VARCHAR(30) NOT NULL DEFAULT 'standar' CHECK (status_tag IN ('standar', 'berkembang', 'siap_interview')),
  sumber VARCHAR(20) NOT NULL DEFAULT 'roster' CHECK (sumber IN ('roster', 'manual')),
  keterangan_luar_kelas VARCHAR(20) NULL CHECK (keterangan_luar_kelas IS NULL OR keterangan_luar_kelas IN ('keluar', 'alumni', 'cuti')),
  alasan TEXT NOT NULL DEFAULT '',
  tanggal_masuk DATE NULL,
  pendidikan_akhir VARCHAR(160) NOT NULL DEFAULT '',
  pendidikan_akhir_ja VARCHAR(200) NOT NULL DEFAULT '',
  tanggal_lahir_lokal DATE NULL,
  status_pernikahan_lokal VARCHAR(60) NOT NULL DEFAULT '',
  jumlah_anak_lokal INTEGER NULL,
  agama_lokal VARCHAR(60) NOT NULL DEFAULT '',
  daerah_asal_lokal VARCHAR(120) NOT NULL DEFAULT '',
  catatan_bebas TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Added after the first install: Japanese version of pendidikan_akhir for the ja locale and the rapor.
ALTER TABLE peserta ADD COLUMN IF NOT EXISTS pendidikan_akhir_ja VARCHAR(200) NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS peserta_penempatan (
  peserta_id INTEGER PRIMARY KEY REFERENCES peserta(id) ON DELETE CASCADE,
  tanggal_lulus_ujian DATE NULL,
  perusahaan_naitei VARCHAR(200) NOT NULL DEFAULT '',
  jenis_pekerjaan VARCHAR(200) NOT NULL DEFAULT '',
  prefektur_id INTEGER NULL,
  lokasi_kerja VARCHAR(160) NOT NULL DEFAULT '',
  rencana_mulai_kerja DATE NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS peserta_status_log (
  id SERIAL PRIMARY KEY,
  peserta_id INTEGER NOT NULL REFERENCES peserta(id) ON DELETE CASCADE,
  status_lama VARCHAR(30) NOT NULL,
  status_baru VARCHAR(30) NOT NULL,
  diubah_oleh_staff_id INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
  catatan TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sikap_kategori (
  id SERIAL PRIMARY KEY,
  nama_id VARCHAR(150) NOT NULL,
  nama_ja VARCHAR(150) NOT NULL,
  sentiment_default VARCHAR(20) NOT NULL CHECK (sentiment_default IN ('positif', 'negatif')),
  bobot_default NUMERIC(5,2) NOT NULL CHECK (bobot_default > 0),
  urutan INTEGER NOT NULL DEFAULT 0,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nilai_ujian (
  id SERIAL PRIMARY KEY,
  peserta_id INTEGER NOT NULL REFERENCES peserta(id) ON DELETE CASCADE,
  kelas_id INTEGER NULL REFERENCES kelas(id) ON DELETE SET NULL,
  tanggal_ujian DATE NOT NULL,
  nama_ujian VARCHAR(160) NOT NULL DEFAULT '',
  tipe_penilaian VARCHAR(20) NOT NULL CHECK (tipe_penilaian IN ('tunggal', 'variable')),
  nilai_tunggal NUMERIC(5,2) NULL CHECK (nilai_tunggal IS NULL OR (nilai_tunggal >= 0 AND nilai_tunggal <= 100)),
  moji_goi NUMERIC(5,2) NULL CHECK (moji_goi IS NULL OR (moji_goi >= 0 AND moji_goi <= 100)),
  bunpou NUMERIC(5,2) NULL CHECK (bunpou IS NULL OR (bunpou >= 0 AND bunpou <= 100)),
  dokkai NUMERIC(5,2) NULL CHECK (dokkai IS NULL OR (dokkai >= 0 AND dokkai <= 100)),
  choukai NUMERIC(5,2) NULL CHECK (choukai IS NULL OR (choukai >= 0 AND choukai <= 100)),
  catatan TEXT NOT NULL DEFAULT '',
  diinput_oleh_staff_id INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nilai_kaiwa (
  id SERIAL PRIMARY KEY,
  peserta_id INTEGER NOT NULL REFERENCES peserta(id) ON DELETE CASCADE,
  kelas_id INTEGER NULL REFERENCES kelas(id) ON DELETE SET NULL,
  tanggal_sesi DATE NOT NULL,
  topik VARCHAR(160) NOT NULL DEFAULT '',
  grade CHAR(1) NOT NULL CHECK (grade IN ('A', 'B', 'C')),
  catatan TEXT NOT NULL DEFAULT '',
  diinput_oleh_staff_id INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
  sensei_staff_id INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Added after the first install: the sensei who held the kaiwa (Kaiwa Card), separate from the staff who typed it
-- in. Older rows typed in by a sensei are theirs; rows typed in by another role stay empty until a staff fills them.
ALTER TABLE nilai_kaiwa ADD COLUMN IF NOT EXISTS sensei_staff_id INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL;
UPDATE nilai_kaiwa k SET sensei_staff_id = k.diinput_oleh_staff_id
FROM staff s JOIN role r ON r.id = s.role_id
WHERE k.sensei_staff_id IS NULL AND s.id = k.diinput_oleh_staff_id AND r.kode = 'sensei';

CREATE TABLE IF NOT EXISTS nilai_sikap (
  id SERIAL PRIMARY KEY,
  peserta_id INTEGER NOT NULL REFERENCES peserta(id) ON DELETE CASCADE,
  kelas_id INTEGER NULL REFERENCES kelas(id) ON DELETE SET NULL,
  kategori_id INTEGER NULL REFERENCES sikap_kategori(id) ON DELETE SET NULL,
  tanggal DATE NOT NULL,
  sentiment VARCHAR(20) NOT NULL CHECK (sentiment IN ('positif', 'negatif')),
  bobot NUMERIC(5,2) NOT NULL CHECK (bobot > 0),
  keterangan TEXT NOT NULL DEFAULT '',
  diinput_oleh_staff_id INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS absensi (
  id SERIAL PRIMARY KEY,
  peserta_id INTEGER NOT NULL REFERENCES peserta(id) ON DELETE CASCADE,
  kelas_id INTEGER NOT NULL REFERENCES kelas(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('hadir', 'sakit', 'izin', 'alfa')),
  keterangan TEXT NOT NULL DEFAULT '',
  diinput_oleh_staff_id INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (peserta_id, kelas_id, tanggal)
);

CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(80) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  staff_id INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
  staff_nama VARCHAR(150) NOT NULL DEFAULT '',
  aksi VARCHAR(80) NOT NULL,
  entitas VARCHAR(80) NOT NULL,
  entitas_id VARCHAR(80) NOT NULL DEFAULT '',
  detail JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_subscription (
  id SERIAL PRIMARY KEY,
  staff_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT NOT NULL DEFAULT '',
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_log (
  id SERIAL PRIMARY KEY,
  tipe_jadwal VARCHAR(40) NOT NULL,
  tanggal DATE NOT NULL,
  jumlah_terkirim INTEGER NOT NULL DEFAULT 0,
  detail JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mancation_kelas_cache (
  mancation_class_id INTEGER PRIMARY KEY,
  nama_kelas VARCHAR(150) NOT NULL,
  program_studi VARCHAR(150) NOT NULL DEFAULT '',
  class_stat INTEGER NOT NULL DEFAULT 1,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mancation_peserta_cache (
  mancation_akun_id INTEGER PRIMARY KEY,
  mancation_class_id INTEGER NULL,
  nama VARCHAR(160) NOT NULL,
  email VARCHAR(160) NOT NULL DEFAULT '',
  whatsapp VARCHAR(60) NOT NULL DEFAULT '',
  nik VARCHAR(40) NOT NULL DEFAULT '',
  gender VARCHAR(20) NOT NULL DEFAULT '',
  tanggal_lahir DATE NULL,
  tempat_lahir VARCHAR(120) NOT NULL DEFAULT '',
  alamat TEXT NOT NULL DEFAULT '',
  agama VARCHAR(60) NOT NULL DEFAULT '',
  status_pernikahan VARCHAR(60) NOT NULL DEFAULT '',
  jumlah_anak INTEGER NULL,
  tinggi_cm NUMERIC(5,1) NULL,
  berat_kg NUMERIC(5,1) NULL,
  gol_darah VARCHAR(10) NOT NULL DEFAULT '',
  pendidikan_raw VARCHAR(160) NOT NULL DEFAULT '',
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Smart Report: resume AI (Gemini) per peserta atau per kelas, ID + JA. data_hash = sidik data sumber
-- saat resume dibuat, untuk menandai resume yang sudah usang setelah nilai berubah.
CREATE TABLE IF NOT EXISTS smart_report_resume (
  scope VARCHAR(20) NOT NULL CHECK (scope IN ('peserta', 'kelas')),
  ref_id INTEGER NOT NULL,
  teks_id TEXT NOT NULL DEFAULT '',
  teks_ja TEXT NOT NULL DEFAULT '',
  data_hash VARCHAR(64) NOT NULL DEFAULT '',
  model VARCHAR(80) NOT NULL DEFAULT '',
  dibuat_oleh_staff_id INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
  dibuat_at TIMESTAMPTZ NULL,
  diedit_oleh_staff_id INTEGER NULL REFERENCES staff(id) ON DELETE SET NULL,
  diedit_at TIMESTAMPTZ NULL,
  PRIMARY KEY (scope, ref_id)
);

-- Portal peserta: login dengan email Mancation. Tanpa baris / password_hash NULL = masih memakai sandi awal
-- (tanggal lahir ddmmyy) yang wajib diganti saat login pertama. versi_token naik setiap sandi diganti atau
-- direset sehingga token lama tidak berlaku lagi.
CREATE TABLE IF NOT EXISTS peserta_akun (
  peserta_id INTEGER PRIMARY KEY REFERENCES peserta(id) ON DELETE CASCADE,
  password_hash TEXT NULL,
  wajib_ganti_sandi BOOLEAN NOT NULL DEFAULT TRUE,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  gagal_login INTEGER NOT NULL DEFAULT 0,
  terkunci_sampai TIMESTAMPTZ NULL,
  versi_token INTEGER NOT NULL DEFAULT 0,
  login_terakhir TIMESTAMPTZ NULL,
  sandi_diubah_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_peserta_kelas ON peserta(kelas_id);
CREATE INDEX IF NOT EXISTS idx_peserta_sumber ON peserta(sumber);
CREATE INDEX IF NOT EXISTS idx_absensi_kelas_tanggal ON absensi(kelas_id, tanggal);
CREATE INDEX IF NOT EXISTS idx_nilai_ujian_peserta_tgl ON nilai_ujian(peserta_id, tanggal_ujian);
CREATE UNIQUE INDEX IF NOT EXISTS idx_nilai_ujian_unique ON nilai_ujian(peserta_id, kelas_id, tanggal_ujian, nama_ujian);
CREATE INDEX IF NOT EXISTS idx_nilai_kaiwa_peserta_tgl ON nilai_kaiwa(peserta_id, tanggal_sesi);
CREATE INDEX IF NOT EXISTS idx_nilai_kaiwa_tanggal ON nilai_kaiwa(tanggal_sesi);
CREATE INDEX IF NOT EXISTS idx_nilai_sikap_peserta_tgl ON nilai_sikap(peserta_id, tanggal);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

-- SQL Views untuk perhitungan turunan tanpa drift
CREATE OR REPLACE VIEW v_nilai_ujian_avg AS
SELECT
  nu.*,
  CASE
    WHEN nu.tipe_penilaian = 'tunggal' THEN nu.nilai_tunggal
    ELSE ROUND((
      (COALESCE(nu.moji_goi, 0) + COALESCE(nu.bunpou, 0) + COALESCE(nu.dokkai, 0) + COALESCE(nu.choukai, 0))
      / NULLIF(
          (CASE WHEN nu.moji_goi IS NOT NULL THEN 1 ELSE 0 END) +
          (CASE WHEN nu.bunpou IS NOT NULL THEN 1 ELSE 0 END) +
          (CASE WHEN nu.dokkai IS NOT NULL THEN 1 ELSE 0 END) +
          (CASE WHEN nu.choukai IS NOT NULL THEN 1 ELSE 0 END),
        0)
    )::numeric, 2)
  END AS nilai_avg
FROM nilai_ujian nu;

CREATE OR REPLACE VIEW v_absensi_rasio_bulanan AS
WITH sesi_kelas AS (
  SELECT
    kelas_id,
    TO_CHAR(tanggal, 'YYYY-MM') AS periode,
    COUNT(DISTINCT tanggal) AS total_sesi_kelas
  FROM absensi
  GROUP BY kelas_id, TO_CHAR(tanggal, 'YYYY-MM')
)
SELECT
  a.peserta_id,
  a.kelas_id,
  TO_CHAR(a.tanggal, 'YYYY-MM') AS periode,
  sk.total_sesi_kelas AS total_hari_diisi,
  COUNT(*) FILTER (WHERE a.status = 'hadir') AS jumlah_hadir,
  COUNT(*) FILTER (WHERE a.status = 'sakit') AS jumlah_sakit,
  COUNT(*) FILTER (WHERE a.status = 'izin') AS jumlah_izin,
  COUNT(*) FILTER (WHERE a.status = 'alfa') AS jumlah_alfa,
  ROUND(
    (COUNT(*) FILTER (WHERE a.status = 'hadir')::numeric / NULLIF(sk.total_sesi_kelas, 0)) * 100,
    2
  ) AS rasio_hadir_persen
FROM absensi a
JOIN sesi_kelas sk
  ON sk.kelas_id = a.kelas_id AND sk.periode = TO_CHAR(a.tanggal, 'YYYY-MM')
GROUP BY a.peserta_id, a.kelas_id, TO_CHAR(a.tanggal, 'YYYY-MM'), sk.total_sesi_kelas;

CREATE OR REPLACE VIEW v_sikap_skor_bulanan AS
SELECT
  ns.peserta_id,
  ns.kelas_id,
  TO_CHAR(ns.tanggal, 'YYYY-MM') AS periode,
  GREATEST(
    0,
    LEAST(
      100,
      75 + SUM(CASE WHEN ns.sentiment = 'positif' THEN ABS(ns.bobot) ELSE -ABS(ns.bobot) END)
    )
  ) AS skor_akhir,
  COALESCE(SUM(CASE WHEN ns.sentiment = 'positif' THEN ABS(ns.bobot) ELSE 0 END), 0) AS poin_positif,
  COALESCE(SUM(CASE WHEN ns.sentiment = 'negatif' THEN ABS(ns.bobot) ELSE 0 END), 0) AS poin_negatif,
  COUNT(*) FILTER (WHERE ns.sentiment = 'positif') AS jumlah_positif,
  COUNT(*) FILTER (WHERE ns.sentiment = 'negatif') AS jumlah_negatif
FROM nilai_sikap ns
GROUP BY ns.peserta_id, ns.kelas_id, TO_CHAR(ns.tanggal, 'YYYY-MM');

CREATE OR REPLACE VIEW v_kaiwa_distribusi_bulanan AS
WITH latest_kaiwa AS (
  SELECT DISTINCT ON (nk.peserta_id, nk.kelas_id, TO_CHAR(nk.tanggal_sesi, 'YYYY-MM'))
    nk.peserta_id,
    nk.kelas_id,
    TO_CHAR(nk.tanggal_sesi, 'YYYY-MM') AS periode,
    nk.grade,
    nk.tanggal_sesi
  FROM nilai_kaiwa nk
  ORDER BY nk.peserta_id, nk.kelas_id, TO_CHAR(nk.tanggal_sesi, 'YYYY-MM'), nk.tanggal_sesi DESC, nk.id DESC
)
SELECT
  kelas_id,
  periode,
  COUNT(*) FILTER (WHERE grade = 'A') AS jumlah_a,
  COUNT(*) FILTER (WHERE grade = 'B') AS jumlah_b,
  COUNT(*) FILTER (WHERE grade = 'C') AS jumlah_c
FROM latest_kaiwa
GROUP BY kelas_id, periode;

CREATE OR REPLACE VIEW v_kaiwa_tren_bulanan AS
SELECT
  nk.kelas_id,
  TO_CHAR(nk.tanggal_sesi, 'YYYY-MM') AS periode,
  ROUND(
    AVG(
      CASE nk.grade
        WHEN 'A' THEN 3
        WHEN 'B' THEN 2
        ELSE 1
      END
    )::numeric,
    2
  ) AS rata_poin_ordinal
FROM nilai_kaiwa nk
GROUP BY nk.kelas_id, TO_CHAR(nk.tanggal_sesi, 'YYYY-MM');

CREATE OR REPLACE VIEW v_kaiwa_sesi_bulanan AS
SELECT
  nk.kelas_id,
  TO_CHAR(nk.tanggal_sesi, 'YYYY-MM') AS periode,
  COUNT(*) AS jumlah_sesi
FROM nilai_kaiwa nk
GROUP BY nk.kelas_id, TO_CHAR(nk.tanggal_sesi, 'YYYY-MM');
