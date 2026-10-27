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

async function tryRefreshToken() {
  const { refreshToken } = getStoredTokens();
  if (!refreshToken) return null;
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      clearStoredTokens();
      return null;
    }
    const data = await res.json();
    setStoredTokens(data.accessToken, data.refreshToken);
    return data;
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  pendingRequests.value++;
  try {
    return await sendRequest(path, options, true);
  } finally {
    pendingRequests.value--;
  }
}

async function sendRequest(path, options, allowRetry) {
  const { accessToken } = getStoredTokens();
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`/api${path}`, {
    ...options,
    headers,
    body:
      options.body && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body,
  });

  if (res.status === 401 && allowRetry && path !== '/auth/login' && path !== '/auth/refresh') {
    const refreshed = await tryRefreshToken();
    if (refreshed?.accessToken) {
      return sendRequest(path, options, false);
    }
  }

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const err = new Error(payload?.error || 'GENERIC_ERROR');
    err.status = res.status;
    err.code = payload?.error || 'GENERIC_ERROR';
    throw err;
  }

  return payload;
}
