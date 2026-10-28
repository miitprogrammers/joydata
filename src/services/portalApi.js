import { pendingRequests } from './loadingState.js';

// Peserta portal session: its own token under its own key, never mixed with the staff tokens in api.js.
const PORTAL_TOKEN_KEY = 'joydata_portal_token';

export function getPortalToken() {
  return localStorage.getItem(PORTAL_TOKEN_KEY) || '';
}

export function setPortalToken(token) {
  if (token) localStorage.setItem(PORTAL_TOKEN_KEY, token);
  else localStorage.removeItem(PORTAL_TOKEN_KEY);
}

/** Calls /api/portal{path}. A 401 clears the stored session; the error carries the API code. */
export async function portalRequest(path, options = {}) {
  pendingRequests.value++;
  try {
    const token = getPortalToken();
    const res = await fetch(`/api/portal${path}`, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
    });
    let payload = null;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
    if (!res.ok) {
      if (res.status === 401 && path !== '/auth/login') setPortalToken('');
      const err = new Error(payload?.error || 'GENERIC_ERROR');
      err.status = res.status;
      err.code = payload?.error || 'GENERIC_ERROR';
      throw err;
    }
    return payload;
  } finally {
    pendingRequests.value--;
  }
}
