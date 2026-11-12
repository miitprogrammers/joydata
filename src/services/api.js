import { pendingRequests } from './loadingState.js';

const ACCESS_KEY = 'joydata_access_token';
const REFRESH_KEY = 'joydata_refresh_token';

export function getStoredTokens() {
  return {
    accessToken: localStorage.getItem(ACCESS_KEY) || '',
    refreshToken: localStorage.getItem(REFRESH_KEY) || '',
  };
}

export function setStoredTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  else localStorage.removeItem(ACCESS_KEY);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  else localStorage.removeItem(REFRESH_KEY);
}

export function clearStoredTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// Called once when the server has really rejected the session (not on a network or server failure).
let sessionExpiredHandler = null;
export function onSessionExpired(handler) {
  sessionExpiredHandler = handler;
}

function codedError(code, status) {
  const err = new Error(code);
  err.code = code;
  err.status = status;
  return err;
}

/** Clears the tokens and tells the app, only for the first request that finds the session gone. */
function endSession() {
  const { accessToken, refreshToken } = getStoredTokens();
  clearStoredTokens();
  if ((accessToken || refreshToken) && sessionExpiredHandler) sessionExpiredHandler();
  return codedError('SESSION_EXPIRED', 401);
}

/**
 * 'ok' = new tokens stored; 'ditolak' = the server rejected the refresh token (session over);
 * 'gagal' = network or server failure, the tokens are kept so the next request can try again.
 */
async function doRefresh() {
  const { refreshToken } = getStoredTokens();
  if (!refreshToken) return 'ditolak';
  let res;
  try {
    res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    return 'gagal';
  }
  if (res.status === 401 || res.status === 403) return 'ditolak';
  if (!res.ok) return 'gagal';
  const data = await res.json().catch(() => null);
  if (!data?.accessToken) return 'gagal';
  setStoredTokens(data.accessToken, data.refreshToken);
  return 'ok';
}

// Requests that hit 401 together share one refresh instead of racing each other.
let refreshing = null;
function refreshTokens() {
  refreshing ||= doRefresh().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

async function rawFetch(path, options, accessToken) {
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {}),
  };
  try {
    return await fetch(`/api${path}`, {
      ...options,
      headers,
      body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
    });
  } catch {
    throw codedError('NETWORK_ERROR', 0);
  }
}

/** A fetch with the staff token: an expired access token is refreshed once and the request repeated. */
async function fetchWithAuth(path, options) {
  const sent = getStoredTokens().accessToken;
  const res = await rawFetch(path, options, sent);
  if (res.status !== 401 || path === '/auth/login' || path === '/auth/refresh') return res;

  // Another request may already have refreshed while this one was in flight.
  if (getStoredTokens().accessToken === sent) {
    const hasil = await refreshTokens();
    if (hasil === 'gagal') throw codedError('SERVICE_UNAVAILABLE', 503);
    if (hasil === 'ditolak') throw endSession();
  }
  const retry = await rawFetch(path, options, getStoredTokens().accessToken);
  if (retry.status === 401) throw endSession();
  return retry;
}

// options.diam = a background refresh (the live practice monitor): no loading bar.
export async function apiRequest(path, { diam = false, ...options } = {}) {
  if (!diam) pendingRequests.value++;
  try {
    const res = await fetchWithAuth(path, options);
    let payload = null;
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
    if (!res.ok) throw codedError(payload?.error || 'GENERIC_ERROR', res.status);
    return payload;
  } finally {
    if (!diam) pendingRequests.value--;
  }
}

/** A file download (CSV export) with the same token handling as apiRequest; resolves to the Blob. */
export async function apiDownload(path) {
  pendingRequests.value++;
  try {
    const res = await fetchWithAuth(path, {});
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      throw codedError(payload?.error || 'GENERIC_ERROR', res.status);
    }
    return await res.blob();
  } finally {
    pendingRequests.value--;
  }
}
