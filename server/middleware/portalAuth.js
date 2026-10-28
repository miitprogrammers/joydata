import jwt from 'jsonwebtoken';
import { getPesertaPortalSession } from '../db/portalRepo.js';

// Peserta tokens use their own secret and audience: a peserta token never verifies in requireAuth (staff),
// so a peserta id can never be read as a staff id. Without PESERTA_JWT_SECRET the secret is derived from
// JWT_SECRET, which auth.js already requires on Vercel.
const PORTAL_SECRET =
  process.env.PESERTA_JWT_SECRET ||
  `${process.env.JWT_SECRET || 'joydata-internal-access-secret-key-2026'}:peserta-portal`;
const PORTAL_AUDIENCE = 'joydata-peserta';

export function signPortalToken(session) {
  return jwt.sign({ sub: session.id, tv: session.versiToken }, PORTAL_SECRET, {
    audience: PORTAL_AUDIENCE,
    expiresIn: '7d',
  });
}

/**
 * Lets a logged-in peserta through, as req.peserta. The token stops working once the password is changed or
 * reset (versi_token) or the account is switched off. Until the default password is changed only routes with
 * allowPasswordChange pass.
 */
export function requirePeserta({ allowPasswordChange = false } = {}) {
  return async (req, res, next) => {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'UNAUTHORIZED' });
    let decoded;
    try {
      decoded = jwt.verify(header.slice(7).trim(), PORTAL_SECRET, { audience: PORTAL_AUDIENCE });
    } catch {
      return res.status(401).json({ error: 'INVALID_TOKEN' });
    }
    try {
      const session = await getPesertaPortalSession(decoded.sub);
      if (!session || !session.aktif || session.versiToken !== decoded.tv) {
        return res.status(401).json({ error: 'SESSION_EXPIRED_OR_INACTIVE' });
      }
      if (session.wajibGantiSandi && !allowPasswordChange) {
        return res.status(403).json({ error: 'PORTAL_PASSWORD_CHANGE_REQUIRED' });
      }
      req.peserta = session;
      return next();
    } catch (err) {
      return next(err);
    }
  };
}
