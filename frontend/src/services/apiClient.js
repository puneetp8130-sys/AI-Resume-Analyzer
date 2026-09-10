import { API_BASE_URL, AUTH_TOKEN_STORAGE_KEY } from '../constants';

/**
 * Central HTTP client. Every API call in the app goes through here so
 * base URL, auth headers, JSON parsing, and error normalization live in
 * exactly one place. Components and pages never call fetch/axios directly.
 */

class ApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function getToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

async function request(path, { method = 'GET', body, isFormData = false, signal } = {}) {
  const headers = {};
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (networkError) {
    throw new ApiError('Unable to reach the server. Please check your connection.', 'NETWORK_ERROR', 0);
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (parseError) {
    payload = null;
  }

  if (!response.ok || !payload || payload.success === false) {
    const message = payload?.message || 'Something went wrong. Please try again.';
    const code = payload?.code || 'UNKNOWN_ERROR';
    throw new ApiError(message, code, response.status);
  }

  return payload.data;
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  del: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

export { ApiError };
