import jwt from 'jsonwebtoken';
import { getStaffSessionById } from '../db/repository.js';
import { canAccessPage, canChangeStatusTag } from '../domain/rules.js';

// The fallback secrets are public (they are in this file), so a deployment must never run on them.
if (process.env.VERCEL && (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET)) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be set in the Vercel environment variables');
}

const ACCESS_SECRET = process.env.JWT_SECRET || 'joydata-internal-access-secret-key-2026';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'joydata-internal-refresh-secret-key-2026';

export function signTokens(staffProfile) {
  const accessToken = jwt.sign(
    {
      sub: staffProfile.id,
      username: staffProfile.username,
      roleKode: staffProfile.role.kode,
    },
    ACCESS_SECRET,
    { expiresIn: '12h' }
  );

  const refreshToken = jwt.sign(
    {
      sub: staffProfile.id,
      type: 'refresh',
    },
    REFRESH_SECRET,
    { expiresIn: '14d' }
  );

  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
  const token = header.slice(7).trim();
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    const freshSession = await getStaffSessionById(decoded.sub);
    if (!freshSession) {
      return res.status(401).json({ error: 'SESSION_EXPIRED_OR_INACTIVE' });
    }
    req.user = freshSession;
    return next();
  } catch {
    return res.status(401).json({ error: 'INVALID_TOKEN' });
  }
}

/** Allows the request when the role may open any one of the given pages. */
export function requirePageAccess(...pageKodes) {
  return (req, res, next) => {
    const allowedKodes = (req.user?.allowedPages || []).map((p) => p.kode);
    if (!pageKodes.some((kode) => canAccessPage(allowedKodes, kode))) {
      return res.status(403).json({
        error: 'FORBIDDEN_PAGE_ACCESS',
        pageKode: pageKodes.join('|'),
      });
    }
    return next();
  };
}

export function requireRoleKodes(...roleKodes) {
  return (req, res, next) => {
    if (!roleKodes.includes(req.user?.role?.kode)) {
      return res.status(403).json({ error: 'ROLE_NOT_ALLOWED' });
    }
    return next();
  };
}

export function requireAdminRole(req, res, next) {
  if (!canChangeStatusTag(req.user?.role?.kode)) {
    return res.status(403).json({ error: 'ADMIN_ROLE_REQUIRED' });
  }
  return next();
}
