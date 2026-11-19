-- Kanji Adventure: one row per paper handed to a peserta.
-- The generated questions (with their key) live on the server only, so grading works after a restart,
-- a cold start or on another server instance. A row is deleted once the paper is graded or expires.
CREATE TABLE IF NOT EXISTS kanji_adventure_sesi (
  id VARCHAR(64) PRIMARY KEY,
  peserta_id INTEGER NOT NULL REFERENCES peserta(id) ON DELETE CASCADE,
  materi VARCHAR(16) NOT NULL,
  mode VARCHAR(16) NOT NULL DEFAULT 'reguler',
  chunk_index INTEGER NOT NULL,
  ronde INTEGER NOT NULL DEFAULT 1,
  aktivitas_id INTEGER,
  item_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  soal JSONB NOT NULL DEFAULT '[]'::jsonb,
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  kedaluwarsa_pada TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_kanji_adventure_sesi_peserta
  ON kanji_adventure_sesi (peserta_id);

CREATE INDEX IF NOT EXISTS idx_kanji_adventure_sesi_kedaluwarsa
  ON kanji_adventure_sesi (kedaluwarsa_pada);
