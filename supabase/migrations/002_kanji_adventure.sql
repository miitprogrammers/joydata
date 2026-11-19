-- Kanji Adventure: satu baris progres per peserta per volume.
-- itemIds dibekukan sekali saat volume dibuka supaya peta chunk tidak bergeser
-- kalau bank soal berubah di tengah jalan. Dikuasai/bosses/riwayat boleh tumbuh.
CREATE TABLE IF NOT EXISTS kanji_adventure_progres (
  peserta_id INTEGER NOT NULL REFERENCES peserta(id) ON DELETE CASCADE,
  materi VARCHAR(16) NOT NULL,
  item_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  dikuasai JSONB NOT NULL DEFAULT '[]'::jsonb,
  bosses JSONB NOT NULL DEFAULT '[]'::jsonb,
  boss_ronde INTEGER NOT NULL DEFAULT 0,
  chunk_terbuka INTEGER NOT NULL DEFAULT 0,
  selesai BOOLEAN NOT NULL DEFAULT FALSE,
  perlu_perhatian BOOLEAN NOT NULL DEFAULT FALSE,
  riwayat JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (peserta_id, materi)
);

CREATE INDEX IF NOT EXISTS idx_kanji_adventure_progres_peserta
  ON kanji_adventure_progres (peserta_id);
