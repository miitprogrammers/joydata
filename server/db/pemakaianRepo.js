import { ensureInitialized, getMode, getPool, readLocalState, saveLocalState } from './engine.js';
import { todayJakarta } from '../domain/kaiwaMingguan.js';
import { detikLaporan, totalSetelahLaporan, DETIK_SEHARI } from '../domain/pemakaianPortal.js';

/**
 * Adds a portal report (active seconds since the previous one) to today's total and returns
 * { tanggal, detik }: today's Jakarta date and the total so far. detik 0 only reads the total.
 */
export async function laporPemakaianPortal(pesertaId, detik) {
  await ensureInitialized();
  const tanggal = todayJakarta();
  const tambah = detikLaporan(detik);

  if (getMode() === 'postgres') {
    const pool = getPool();
    if (!tambah) {
      const res = await pool.query(
        `SELECT detik FROM pemakaian_portal WHERE peserta_id = $1 AND tanggal = $2`,
        [pesertaId, tanggal]
      );
      return { tanggal, detik: Number(res.rows[0]?.detik) || 0 };
    }
    const res = await pool.query(
      `INSERT INTO pemakaian_portal (peserta_id, tanggal, detik, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (peserta_id, tanggal) DO UPDATE SET
         detik = LEAST($4, pemakaian_portal.detik + EXCLUDED.detik), updated_at = NOW()
       RETURNING detik`,
      [pesertaId, tanggal, tambah, DETIK_SEHARI]
    );
    return { tanggal, detik: Number(res.rows[0].detik) };
  }

  const db = readLocalState();
  db.pemakaianPortal ||= [];
  let row = db.pemakaianPortal.find((r) => r.pesertaId === pesertaId && r.tanggal === tanggal);
  if (!tambah) return { tanggal, detik: row?.detik || 0 };
  if (!row) {
    row = { pesertaId, tanggal, detik: 0 };
    db.pemakaianPortal.push(row);
  }
  row.detik = totalSetelahLaporan(row.detik, tambah);
  row.updatedAt = new Date().toISOString();
  saveLocalState();
  return { tanggal, detik: row.detik };
}
