import { pendingRequests } from './loadingState.js';

// Peserta portal session: its own token under its own key, never mixed with the staff tokens in api.js.
const PORTAL_TOKEN_KEY = 'joydata_portal_token';
// The server sends a renewed token in this header once the current one is a day old (sliding 7-day session).
const RENEWED_TOKEN_HEADER = 'X-Portal-Token';

export function getPortalToken() {
  return localStorage.getItem(PORTAL_TOKEN_KEY) || '';
}

export function setPortalToken(token) {
  if (token) localStorage.setItem(PORTAL_TOKEN_KEY, token);
  else localStorage.removeItem(PORTAL_TOKEN_KEY);
}

// Called once when the server has rejected the peserta session (expired, password changed or reset, portal off).
let sessionExpiredHandler = null;
export function onPortalSessionExpired(handler) {
  sessionExpiredHandler = handler;
}

async function send(path, options, token) {
  try {
    return await fetch(`/api/portal${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
    });
  } catch {
    const err = new Error('NETWORK_ERROR');
    err.code = 'NETWORK_ERROR';
    throw err;
  }
}

/**
 * Calls /api/portal{path}. A 401 ends the stored session (once, via onPortalSessionExpired); the error carries
 * the API code. options.diam = a background call (practice signals): no loading bar.
 */
export async function portalRequest(path, { diam = false, ...options } = {}) {
  if (!diam) pendingRequests.value++;
  try {
    let used = getPortalToken();
    let res = await send(path, options, used);
    // A request sent with a token that has since been replaced (password change) is repeated with the new one.
    if (res.status === 401 && used && getPortalToken() && getPortalToken() !== used) {
      used = getPortalToken();
      res = await send(path, options, used);
    }
    // Only renew the token this request used: a newer one stored meanwhile (password change) must stay.
    const renewed = res.headers.get(RENEWED_TOKEN_HEADER);
    if (res.ok && renewed && used && getPortalToken() === used) setPortalToken(renewed);

    let payload = null;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
    if (!res.ok) {
      if (res.status === 401 && path !== '/auth/login' && used && getPortalToken() === used) {
        setPortalToken('');
        sessionExpiredHandler?.();
      }
      const err = new Error(payload?.error || 'GENERIC_ERROR');
      err.status = res.status;
      err.code = payload?.error || 'GENERIC_ERROR';
      throw err;
    }
    return payload;
  } finally {
    if (!diam) pendingRequests.value--;
  }
}
