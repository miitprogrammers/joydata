import bcrypt from 'bcryptjs';
import {
  ensureInitialized,
  getMode,
  getPool,
  readLocalState,
  saveLocalState,
  appendAudit,
  appendLocalAudit,
} from './engine.js';
import { validateAccessMatrixUpdate } from '../domain/rules.js';

function mapPgPage(p) {
  return {
    kode: p.kode,
    bar: p.bar,
    routePath: p.route_path,
    titleId: p.title_id,
    titleJa: p.title_ja,
    icon: p.icon,
    urutan: Number(p.urutan),
    fase: Number(p.fase),
  };
}

function formatStaffAuthPayload(staffRow, roleRow, allowedPages) {
  return {
    id: Number(staffRow.id),
    nama: staffRow.nama,
    username: staffRow.username,
    active: Boolean(staffRow.active),
    role: {
      id: Number(roleRow.id),
      kode: roleRow.kode,
      roleNameId: roleRow.roleNameId ?? roleRow.role_name_id,
      roleNameJa: roleRow.roleNameJa ?? roleRow.role_name_ja,
    },
    allowedPages,
  };
}

export async function authenticateStaff(username, password) {
  await ensureInitialized();
  const cleanUser = String(username || '').trim();
  if (!cleanUser || !password) return null;

  if (getMode() === 'postgres') {
    const pool = getPool();
    const res = await pool.query(
      `SELECT s.*, r.kode AS role_kode, r.role_name_id, r.role_name_ja
       FROM staff s JOIN role r ON r.id = s.role_id
       WHERE LOWER(s.username) = LOWER($1) AND s.deleted_at IS NULL LIMIT 1`,
      [cleanUser]
    );
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    if (!row.active) return { inactive: true };
    const valid = await bcrypt.compare(password, row.password_hash);
    if (!valid) return null;

    const accRes = await pool.query(
      `SELECT p.kode, p.bar, p.route_path, p.title_id, p.title_ja, p.icon, p.urutan, p.fase
       FROM access a JOIN page p ON p.id = a.page_id
       WHERE a.role_id = $1 ORDER BY p.urutan ASC`,
      [row.role_id]
    );
    return formatStaffAuthPayload(
      row,
      { id: row.role_id, kode: row.role_kode, role_name_id: row.role_name_id, role_name_ja: row.role_name_ja },
      accRes.rows.map(mapPgPage)
    );
  }

  const db = readLocalState();
  const staffRow = db.staff.find(
    (s) => !s.deletedAt && s.username.toLowerCase() === cleanUser.toLowerCase()
  );
  if (!staffRow) return null;
  if (!staffRow.active) return { inactive: true };
  const valid = await bcrypt.compare(password, staffRow.passwordHash);
  if (!valid) return null;

  const roleRow = db.roles.find((r) => r.id === staffRow.roleId);
  const pageIds = new Set(db.access.filter((a) => a.roleId === staffRow.roleId).map((a) => a.pageId));
  const allowedPages = db.pages.filter((p) => pageIds.has(p.id)).sort((a, b) => a.urutan - b.urutan);
  return formatStaffAuthPayload(staffRow, roleRow, allowedPages);
}

export async function getStaffSessionById(staffId) {
  await ensureInitialized();
  const id = Number(staffId);
  if (!id) return null;

  if (getMode() === 'postgres') {
    const pool = getPool();
    const res = await pool.query(
      `SELECT s.*, r.kode AS role_kode, r.role_name_id, r.role_name_ja
       FROM staff s JOIN role r ON r.id = s.role_id
       WHERE s.id = $1 AND s.deleted_at IS NULL AND s.active = TRUE LIMIT 1`,
      [id]
    );
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const accRes = await pool.query(
      `SELECT p.kode, p.bar, p.route_path, p.title_id, p.title_ja, p.icon, p.urutan, p.fase
       FROM access a JOIN page p ON p.id = a.page_id
       WHERE a.role_id = $1 ORDER BY p.urutan ASC`,
      [row.role_id]
    );
    return formatStaffAuthPayload(
      row,
      { id: row.role_id, kode: row.role_kode, role_name_id: row.role_name_id, role_name_ja: row.role_name_ja },
      accRes.rows.map(mapPgPage)
    );
  }

  const db = readLocalState();
  const staffRow = db.staff.find((s) => s.id === id && !s.deletedAt && s.active);
  if (!staffRow) return null;
  const roleRow = db.roles.find((r) => r.id === staffRow.roleId);
  const pageIds = new Set(db.access.filter((a) => a.roleId === staffRow.roleId).map((a) => a.pageId));
  const allowedPages = db.pages.filter((p) => pageIds.has(p.id)).sort((a, b) => a.urutan - b.urutan);
  return formatStaffAuthPayload(staffRow, roleRow, allowedPages);
}

export async function getRoleAccessData() {
  await ensureInitialized();
  if (getMode() === 'postgres') {
    const pool = getPool();
    const [rolesRes, pagesRes, accRes] = await Promise.all([
      pool.query(`SELECT id, kode, role_name_id AS "roleNameId", role_name_ja AS "roleNameJa", is_system AS "isSystem" FROM role ORDER BY id ASC`),
      pool.query(`SELECT id, kode, bar, route_path AS "routePath", title_id AS "titleId", title_ja AS "titleJa", icon, urutan, fase FROM page ORDER BY urutan ASC`),
      pool.query(`SELECT a.role_id AS "roleId", p.kode AS "pageKode" FROM access a JOIN page p ON p.id = a.page_id`),
    ]);
    const matrix = {};
    for (const r of rolesRes.rows) matrix[r.id] = [];
    for (const a of accRes.rows) {
      if (!matrix[a.roleId]) matrix[a.roleId] = [];
      matrix[a.roleId].push(a.pageKode);
    }
    return { roles: rolesRes.rows, pages: pagesRes.rows, matrix };
  }

  const db = readLocalState();
  const matrix = {};
  for (const r of db.roles) matrix[r.id] = [];
  for (const a of db.access) {
    const pgItem = db.pages.find((p) => p.id === a.pageId);
    if (pgItem && matrix[a.roleId]) matrix[a.roleId].push(pgItem.kode);
  }
  return {
    roles: db.roles,
    pages: [...db.pages].sort((a, b) => a.urutan - b.urutan),
    matrix,
  };
}

export async function createRole(payload, actor) {
  await ensureInitialized();
  const kode = String(payload.kode || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  const roleNameId = String(payload.roleNameId || '').trim();
  const roleNameJa = String(payload.roleNameJa || '').trim();
  if (!kode || !roleNameId || !roleNameJa) throw new Error('VALIDATION_ERROR');

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `INSERT INTO role (kode, role_name_id, role_name_ja, is_system)
       VALUES ($1, $2, $3, FALSE)
       RETURNING id, kode, role_name_id AS "roleNameId", role_name_ja AS "roleNameJa", is_system AS "isSystem"`,
      [kode, roleNameId, roleNameJa]
    );
    await appendAudit(actor, 'CREATE_ROLE', 'role', res.rows[0].id, { kode, roleNameId });
    return res.rows[0];
  }

  const db = readLocalState();
  if (db.roles.some((r) => r.kode === kode)) throw new Error('DUPLICATE_ROLE_KODE');
  const newRole = { id: db.seq.role++, kode, roleNameId, roleNameJa, isSystem: false, createdAt: new Date().toISOString() };
  db.roles.push(newRole);
  appendLocalAudit(db, actor, 'CREATE_ROLE', 'role', newRole.id, { kode, roleNameId });
  saveLocalState();
  return newRole;
}

export async function updateRole(roleId, payload, actor) {
  await ensureInitialized();
  const id = Number(roleId);
  const roleNameId = String(payload.roleNameId || '').trim();
  const roleNameJa = String(payload.roleNameJa || '').trim();
  if (!id || !roleNameId || !roleNameJa) throw new Error('VALIDATION_ERROR');

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `UPDATE role SET role_name_id = $1, role_name_ja = $2 WHERE id = $3
       RETURNING id, kode, role_name_id AS "roleNameId", role_name_ja AS "roleNameJa", is_system AS "isSystem"`,
      [roleNameId, roleNameJa, id]
    );
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'UPDATE_ROLE', 'role', id, { roleNameId, roleNameJa });
    return res.rows[0];
  }

  const db = readLocalState();
  const r = db.roles.find((x) => x.id === id);
  if (!r) throw new Error('NOT_FOUND');
  r.roleNameId = roleNameId;
  r.roleNameJa = roleNameJa;
  appendLocalAudit(db, actor, 'UPDATE_ROLE', 'role', id, { roleNameId, roleNameJa });
  saveLocalState();
  return r;
}

export async function deleteRole(roleId, actor) {
  await ensureInitialized();
  const id = Number(roleId);

  if (getMode() === 'postgres') {
    const pool = getPool();
    const rRes = await pool.query(`SELECT is_system, kode FROM role WHERE id = $1`, [id]);
    if (rRes.rows.length === 0) throw new Error('NOT_FOUND');
    if (rRes.rows[0].is_system) throw new Error('SYSTEM_ROLE_PROTECTED');
    const inUse = await pool.query(`SELECT COUNT(*)::int AS cnt FROM staff WHERE role_id = $1 AND deleted_at IS NULL`, [id]);
    if (inUse.rows[0].cnt > 0) throw new Error('ROLE_IN_USE');
    await pool.query(`DELETE FROM role WHERE id = $1`, [id]);
    await appendAudit(actor, 'DELETE_ROLE', 'role', id, { kode: rRes.rows[0].kode });
    return { deleted: true };
  }

  const db = readLocalState();
  const idx = db.roles.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error('NOT_FOUND');
  if (db.roles[idx].isSystem) throw new Error('SYSTEM_ROLE_PROTECTED');
  if (db.staff.some((s) => !s.deletedAt && s.roleId === id)) throw new Error('ROLE_IN_USE');
  const [removed] = db.roles.splice(idx, 1);
  db.access = db.access.filter((a) => a.roleId !== id);
  appendLocalAudit(db, actor, 'DELETE_ROLE', 'role', id, { kode: removed.kode });
  saveLocalState();
  return { deleted: true };
}

export async function setRoleAccessMatrix(roleId, selectedPageKodes, actor) {
  await ensureInitialized();
  const id = Number(roleId);

  if (getMode() === 'postgres') {
    const pool = getPool();
    const rRes = await pool.query(`SELECT id, kode FROM role WHERE id = $1`, [id]);
    if (rRes.rows.length === 0) throw new Error('NOT_FOUND');
    const pagesRes = await pool.query(`SELECT id, kode FROM page`);
    const validation = validateAccessMatrixUpdate({
      isAdminRole: rRes.rows[0].kode === 'admin',
      selectedPageKodes,
      allValidPageKodes: pagesRes.rows.map((p) => p.kode),
    });
    if (!validation.ok) throw new Error(validation.code);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(`DELETE FROM access WHERE role_id = $1`, [id]);
      for (const kode of validation.pageKodes) {
        const pgRow = pagesRes.rows.find((p) => p.kode === kode);
        if (pgRow) await client.query(`INSERT INTO access (role_id, page_id) VALUES ($1, $2)`, [id, pgRow.id]);
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
    await appendAudit(actor, 'UPDATE_ACCESS_MATRIX', 'role', id, { pageKodes: validation.pageKodes });
    return validation.pageKodes;
  }

  const db = readLocalState();
  const role = db.roles.find((r) => r.id === id);
  if (!role) throw new Error('NOT_FOUND');
  const validation = validateAccessMatrixUpdate({
    isAdminRole: role.kode === 'admin',
    selectedPageKodes,
    allValidPageKodes: db.pages.map((p) => p.kode),
  });
  if (!validation.ok) throw new Error(validation.code);

  db.access = db.access.filter((a) => a.roleId !== id);
  for (const kode of validation.pageKodes) {
    const p = db.pages.find((x) => x.kode === kode);
    if (p) db.access.push({ roleId: id, pageId: p.id });
  }
  appendLocalAudit(db, actor, 'UPDATE_ACCESS_MATRIX', 'role', id, { pageKodes: validation.pageKodes });
  saveLocalState();
  return validation.pageKodes;
}

export async function listStaff() {
  await ensureInitialized();
  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `SELECT s.id, s.nama, s.username, s.role_id AS "roleId", s.active, s.created_at AS "createdAt",
              r.kode AS "roleKode", r.role_name_id AS "roleNameId", r.role_name_ja AS "roleNameJa"
       FROM staff s JOIN role r ON r.id = s.role_id
       WHERE s.deleted_at IS NULL ORDER BY s.id ASC`
    );
    return res.rows;
  }

  const db = readLocalState();
  return db.staff
    .filter((s) => !s.deletedAt)
    .map((s) => {
      const r = db.roles.find((x) => x.id === s.roleId);
      return {
        id: s.id,
        nama: s.nama,
        username: s.username,
        roleId: s.roleId,
        active: s.active,
        createdAt: s.createdAt,
        roleKode: r?.kode || '',
        roleNameId: r?.roleNameId || '',
        roleNameJa: r?.roleNameJa || '',
      };
    });
}

export async function createStaff(payload, actor) {
  await ensureInitialized();
  const nama = String(payload.nama || '').trim();
  const username = String(payload.username || '').trim();
  const password = String(payload.password || '');
  const roleId = Number(payload.roleId);
  const active = payload.active !== false;

  if (!nama || !username || password.length < 6 || !roleId) throw new Error('VALIDATION_ERROR');
  const passwordHash = await bcrypt.hash(password, 10);

  if (getMode() === 'postgres') {
    const pool = getPool();
    const dup = await pool.query(`SELECT id FROM staff WHERE LOWER(username) = LOWER($1)`, [username]);
    if (dup.rows.length > 0) throw new Error('DUPLICATE_USERNAME');
    const res = await pool.query(
      `INSERT INTO staff (nama, username, password_hash, role_id, active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nama, username, role_id AS "roleId", active, created_at AS "createdAt"`,
      [nama, username, passwordHash, roleId, active]
    );
    await appendAudit(actor, 'CREATE_STAFF', 'staff', res.rows[0].id, { nama, username, roleId });
    return res.rows[0];
  }

  const db = readLocalState();
  if (db.staff.some((s) => s.username.toLowerCase() === username.toLowerCase())) throw new Error('DUPLICATE_USERNAME');
  const row = { id: db.seq.staff++, nama, username, passwordHash, roleId, active, deletedAt: null, createdAt: new Date().toISOString() };
  db.staff.push(row);
  appendLocalAudit(db, actor, 'CREATE_STAFF', 'staff', row.id, { nama, username, roleId });
  saveLocalState();
  return row;
}

export async function updateStaff(staffId, payload, actor) {
  await ensureInitialized();
  const id = Number(staffId);
  const nama = String(payload.nama || '').trim();
  const username = String(payload.username || '').trim();
  const roleId = Number(payload.roleId);
  const active = Boolean(payload.active);

  if (!id || !nama || !username || !roleId) throw new Error('VALIDATION_ERROR');
  if (actor && Number(actor.id) === id && !active) throw new Error('CANNOT_DEACTIVATE_SELF');

  if (getMode() === 'postgres') {
    const pool = getPool();
    const dup = await pool.query(`SELECT id FROM staff WHERE LOWER(username) = LOWER($1) AND id <> $2`, [username, id]);
    if (dup.rows.length > 0) throw new Error('DUPLICATE_USERNAME');
    const res = await pool.query(
      `UPDATE staff SET nama = $1, username = $2, role_id = $3, active = $4
       WHERE id = $5 AND deleted_at IS NULL RETURNING id, nama, username, role_id AS "roleId", active`,
      [nama, username, roleId, active, id]
    );
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'UPDATE_STAFF', 'staff', id, { nama, username, roleId, active });
    return res.rows[0];
  }

  const db = readLocalState();
  const target = db.staff.find((s) => s.id === id && !s.deletedAt);
  if (!target) throw new Error('NOT_FOUND');
  if (db.staff.some((s) => s.id !== id && s.username.toLowerCase() === username.toLowerCase())) throw new Error('DUPLICATE_USERNAME');
  target.nama = nama;
  target.username = username;
  target.roleId = roleId;
  target.active = active;
  appendLocalAudit(db, actor, 'UPDATE_STAFF', 'staff', id, { nama, username, roleId, active });
  saveLocalState();
  return target;
}

export async function resetStaffPassword(staffId, newPassword, actor) {
  await ensureInitialized();
  const id = Number(staffId);
  if (!id || String(newPassword || '').length < 6) throw new Error('VALIDATION_ERROR');
  const hash = await bcrypt.hash(String(newPassword), 10);

  if (getMode() === 'postgres') {
    const res = await getPool().query(`UPDATE staff SET password_hash = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING id`, [hash, id]);
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'RESET_STAFF_PASSWORD', 'staff', id, {});
    return { updated: true };
  }

  const db = readLocalState();
  const target = db.staff.find((s) => s.id === id && !s.deletedAt);
  if (!target) throw new Error('NOT_FOUND');
  target.passwordHash = hash;
  appendLocalAudit(db, actor, 'RESET_STAFF_PASSWORD', 'staff', id, {});
  saveLocalState();
  return { updated: true };
}

export async function changeOwnPassword(staffId, oldPassword, newPassword) {
  await ensureInitialized();
  const id = Number(staffId);
  if (!id || !oldPassword || String(newPassword || '').length < 6) throw new Error('VALIDATION_ERROR');

  if (getMode() === 'postgres') {
    const pool = getPool();
    const res = await pool.query(`SELECT id, nama, password_hash FROM staff WHERE id = $1 AND deleted_at IS NULL`, [id]);
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    const valid = await bcrypt.compare(String(oldPassword), res.rows[0].password_hash);
    if (!valid) throw new Error('INVALID_OLD_PASSWORD');
    const hash = await bcrypt.hash(String(newPassword), 10);
    await pool.query(`UPDATE staff SET password_hash = $1 WHERE id = $2`, [hash, id]);
    await appendAudit({ id, nama: res.rows[0].nama }, 'CHANGE_OWN_PASSWORD', 'staff', id, {});
    return { updated: true };
  }

  const db = readLocalState();
  const target = db.staff.find((s) => s.id === id && !s.deletedAt);
  if (!target) throw new Error('NOT_FOUND');
  const valid = await bcrypt.compare(String(oldPassword), target.passwordHash);
  if (!valid) throw new Error('INVALID_OLD_PASSWORD');
  target.passwordHash = await bcrypt.hash(String(newPassword), 10);
  appendLocalAudit(db, { id, nama: target.nama }, 'CHANGE_OWN_PASSWORD', 'staff', id, {});
  saveLocalState();
  return { updated: true };
}

export async function softDeleteStaff(staffId, actor) {
  await ensureInitialized();
  const id = Number(staffId);
  if (actor && Number(actor.id) === id) throw new Error('CANNOT_DELETE_SELF');

  if (getMode() === 'postgres') {
    const res = await getPool().query(
      `UPDATE staff SET deleted_at = NOW(), active = FALSE WHERE id = $1 AND deleted_at IS NULL RETURNING id, username`,
      [id]
    );
    if (res.rows.length === 0) throw new Error('NOT_FOUND');
    await appendAudit(actor, 'DELETE_STAFF', 'staff', id, { username: res.rows[0].username });
    return { deleted: true };
  }

  const db = readLocalState();
  const target = db.staff.find((s) => s.id === id && !s.deletedAt);
  if (!target) throw new Error('NOT_FOUND');
  target.deletedAt = new Date().toISOString();
  target.active = false;
  appendLocalAudit(db, actor, 'DELETE_STAFF', 'staff', id, { username: target.username });
  saveLocalState();
  return { deleted: true };
}
