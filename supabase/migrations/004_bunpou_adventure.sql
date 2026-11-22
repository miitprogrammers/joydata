-- Bunpou Adventure: satu baris progres per peserta per volume. tahap dibekukan saat volume dibuka.
CREATE TABLE IF NOT EXISTS bunpou_adventure_progres (
  peserta_id INTEGER NOT NULL REFERENCES peserta(id) ON DELETE CASCADE,
  volume VARCHAR(16) NOT NULL,
  tahap JSONB NOT NULL DEFAULT '[]'::jsonb,
  tahap_terbuka INTEGER NOT NULL DEFAULT 0,
  benar JSONB NOT NULL DEFAULT '{}'::jsonb,
  dikuasai JSONB NOT NULL DEFAULT '[]'::jsonb,
  bosses JSONB NOT NULL DEFAULT '[]'::jsonb,
  salah JSONB NOT NULL DEFAULT '{}'::jsonb,
  jejak JSONB NOT NULL DEFAULT '{}'::jsonb,
  bos_ronde INTEGER NOT NULL DEFAULT 0,
  selesai BOOLEAN NOT NULL DEFAULT FALSE,
  perlu_perhatian BOOLEAN NOT NULL DEFAULT FALSE,
  riwayat JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (peserta_id, volume)
);
CREATE INDEX IF NOT EXISTS idx_bunpou_adventure_progres_peserta ON bunpou_adventure_progres (peserta_id);

-- Kertas yang sedang dikerjakan (kunci hanya di server). Dihapus setelah dinilai atau kedaluwarsa.
CREATE TABLE IF NOT EXISTS bunpou_adventure_sesi (
  id VARCHAR(64) PRIMARY KEY,
  peserta_id INTEGER NOT NULL REFERENCES peserta(id) ON DELETE CASCADE,
  volume VARCHAR(16) NOT NULL,
  mode VARCHAR(16) NOT NULL DEFAULT 'tahap',
  tahap_index INTEGER NOT NULL,
  ronde INTEGER NOT NULL DEFAULT 0,
  aktivitas_id INTEGER,
  pola_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  soal JSONB NOT NULL DEFAULT '[]'::jsonb,
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  kedaluwarsa_pada TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_bunpou_adventure_sesi_peserta ON bunpou_adventure_sesi (peserta_id);
CREATE INDEX IF NOT EXISTS idx_bunpou_adventure_sesi_kedaluwarsa ON bunpou_adventure_sesi (kedaluwarsa_pada);

-- latihan_sesi.jenis menerima 'bunpou'. Hanya diganti sekali (dicek dari definisinya).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'latihan_sesi_jenis_check' AND pg_get_constraintdef(oid) LIKE '%bunpou%'
  ) THEN
    ALTER TABLE latihan_sesi DROP CONSTRAINT IF EXISTS latihan_sesi_jenis_check;
    ALTER TABLE latihan_sesi ADD CONSTRAINT latihan_sesi_jenis_check
      CHECK (jenis IN ('flashcard', 'kanji', 'dokkai', 'bunpou'));
  END IF;
END $$;
