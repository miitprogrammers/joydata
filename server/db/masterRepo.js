import {
  ensureInitialized,
  getMode,
  getPool,
  readLocalState,
  saveLocalState,
  appendAudit,
  appendLocalAudit,
} from './engine.js';

export async function listPrograms() {
  await ensureInitialized();
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `SELECT id, nama_id AS "namaId", nama_ja AS "namaJa", urutan, aktif FROM program ORDER BY urutan ASC, id ASC`
    );
    return res.rows;
  }
  const db = readLocalState();
  return [...db.programs].sort((a, b) => a.urutan - b.urutan || a.id - b.id);
}

export async function createProgram(payload, actor) {
  await ensureInitialized();
  const namaId = String(payload.namaId || '').trim();
  const namaJa = String(payload.namaJa || '').trim();
  const urutan = Number(payload.urutan || 1);
  const aktif = payload.aktif !== false;
  if (!namaId || !namaJa) throw new Error('VALIDATION_ERROR');

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `INSERT INTO program (nama_id, nama_ja, urutan, aktif) VALUES ($1, $2, $3, $4)
       RETURNING id, nama_id AS "namaId", nama_ja AS "namaJa", urutan, aktif`,
      [namaId, namaJa, urutan, aktif]
    );
    await appendAudit(actor, 'CREATE_PROGRAM', 'program', res.rows[0].id, { namaId, namaJa });
    return res.rows[0];
  }

  const db = readLocalState();
  const row = { id: db.seq.program++, namaId, namaJa, urutan, aktif, createdAt: new Date().toISOString() };
  db.programs.push(row);
  appendLocalAudit(db, actor, 'CREATE_PROGRAM', 'program', row.id, { namaId, namaJa });
  saveLocalState();
  return row;
}

export async function updateProgram(programId, payload, actor) {
  await ensureInitialized();
  const id = Number(programId);
  const namaId = String(payload.namaId || '').trim();
  const namaJa = String(payload.namaJa || '').trim();
  const urutan = Number(payload.urutan || 1);
  const aktif = payload.aktif !== false;
  if (!id || !namaId || !namaJa) throw new Error('VALIDATION_ERROR');

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `UPDATE program SET nama_id = $1, nama_ja = $2, urutan = $3, aktif = $4 WHERE id = $5
       RETURNING id, nama_id AS "namaId", nama_ja AS "namaJa", urutan, aktif`,
      [namaId, namaJa, urutan, aktif, id]
    );
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'UPDATE_PROGRAM', 'program', id, { namaId, namaJa, aktif });
    return res.rows[0];
  }

  const db = readLocalState();
  const row = db.programs.find((p) => p.id === id);
  if (!row) throw new Error('NOT_FOUND');
  row.namaId = namaId;
  row.namaJa = namaJa;
  row.urutan = urutan;
  row.aktif = aktif;
  appendLocalAudit(db, actor, 'UPDATE_PROGRAM', 'program', id, { namaId, namaJa, aktif });
  saveLocalState();
  return row;
}

export async function deleteProgram(programId, actor) {
  await ensureInitialized();
  const id = Number(programId);
  if (getMode() === 'postgres') {
    await getPool().query(`DELETE FROM program WHERE id = $1`, [id]);
    await appendAudit(actor, 'DELETE_PROGRAM', 'program', id, {});
    return { deleted: true };
  }
  const db = readLocalState();
  const idx = db.programs.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error('NOT_FOUND');
  db.programs.splice(idx, 1);
  for (const k of db.kelas) {
    if (k.programId === id) k.programId = null;
  }
  appendLocalAudit(db, actor, 'DELETE_PROGRAM', 'program', id, {});
  saveLocalState();
  return { deleted: true };
}

export async function listSikapKategori() {
  await ensureInitialized();
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `SELECT id, nama_id AS "namaId", nama_ja AS "namaJa", sentiment_default AS "sentimentDefault",
              bobot_default::float AS "bobotDefault", urutan, aktif
       FROM sikap_kategori ORDER BY sentiment_default DESC, urutan ASC, id ASC`
    );
    return res.rows;
  }
  const db = readLocalState();
  return [...db.sikapKategori].sort((a, b) => a.urutan - b.urutan || a.id - b.id);
}

export async function createSikapKategori(payload, actor) {
  await ensureInitialized();
  const namaId = String(payload.namaId || '').trim();
  const namaJa = String(payload.namaJa || '').trim();
  const sentimentDefault = payload.sentimentDefault === 'negatif' ? 'negatif' : 'positif';
  const bobotDefault = Math.abs(Number(payload.bobotDefault) || 5);
  const urutan = Number(payload.urutan || 1);
  const aktif = payload.aktif !== false;
  if (!namaId || !namaJa || bobotDefault <= 0) throw new Error('VALIDATION_ERROR');

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `INSERT INTO sikap_kategori (nama_id, nama_ja, sentiment_default, bobot_default, urutan, aktif)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nama_id AS "namaId", nama_ja AS "namaJa", sentiment_default AS "sentimentDefault", bobot_default::float AS "bobotDefault", urutan, aktif`,
      [namaId, namaJa, sentimentDefault, bobotDefault, urutan, aktif]
    );
    await appendAudit(actor, 'CREATE_SIKAP_KATEGORI', 'sikap_kategori', res.rows[0].id, { namaId, sentimentDefault, bobotDefault });
    return res.rows[0];
  }

  const db = readLocalState();
  const row = { id: db.seq.sikapKategori++, namaId, namaJa, sentimentDefault, bobotDefault, urutan, aktif, createdAt: new Date().toISOString() };
  db.sikapKategori.push(row);
  appendLocalAudit(db, actor, 'CREATE_SIKAP_KATEGORI', 'sikap_kategori', row.id, { namaId, sentimentDefault, bobotDefault });
  saveLocalState();
  return row;
}

export async function updateSikapKategori(katId, payload, actor) {
  await ensureInitialized();
  const id = Number(katId);
  const namaId = String(payload.namaId || '').trim();
  const namaJa = String(payload.namaJa || '').trim();
  const sentimentDefault = payload.sentimentDefault === 'negatif' ? 'negatif' : 'positif';
  const bobotDefault = Math.abs(Number(payload.bobotDefault) || 5);
  const urutan = Number(payload.urutan || 1);
  const aktif = payload.aktif !== false;
  if (!id || !namaId || !namaJa || bobotDefault <= 0) throw new Error('VALIDATION_ERROR');

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `UPDATE sikap_kategori
       SET nama_id = $1, nama_ja = $2, sentiment_default = $3, bobot_default = $4, urutan = $5, aktif = $6
       WHERE id = $7
       RETURNING id, nama_id AS "namaId", nama_ja AS "namaJa", sentiment_default AS "sentimentDefault", bobot_default::float AS "bobotDefault", urutan, aktif`,
      [namaId, namaJa, sentimentDefault, bobotDefault, urutan, aktif, id]
    );
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'UPDATE_SIKAP_KATEGORI', 'sikap_kategori', id, { namaId, sentimentDefault, bobotDefault });
    return res.rows[0];
  }

  const db = readLocalState();
  const row = db.sikapKategori.find((k) => k.id === id);
  if (!row) throw new Error('NOT_FOUND');
  row.namaId = namaId;
  row.namaJa = namaJa;
  row.sentimentDefault = sentimentDefault;
  row.bobotDefault = bobotDefault;
  row.urutan = urutan;
  row.aktif = aktif;
  appendLocalAudit(db, actor, 'UPDATE_SIKAP_KATEGORI', 'sikap_kategori', id, { namaId, sentimentDefault, bobotDefault });
  saveLocalState();
  return row;
}

export async function deleteSikapKategori(katId, actor) {
  await ensureInitialized();
  const id = Number(katId);
  if (getMode() === 'postgres') {
    await getPool().query(`DELETE FROM sikap_kategori WHERE id = $1`, [id]);
    await appendAudit(actor, 'DELETE_SIKAP_KATEGORI', 'sikap_kategori', id, {});
    return { deleted: true };
  }
  const db = readLocalState();
  const idx = db.sikapKategori.findIndex((k) => k.id === id);
  if (idx === -1) throw new Error('NOT_FOUND');
  db.sikapKategori.splice(idx, 1);
  appendLocalAudit(db, actor, 'DELETE_SIKAP_KATEGORI', 'sikap_kategori', id, {});
  saveLocalState();
  return { deleted: true };
}
