import { apiClient } from './apiClient';
import { AUTH_TOKEN_STORAGE_KEY, AUTH_USER_STORAGE_KEY } from '../constants';

/**
 * Only this module knows the shape of auth API calls. AuthContext and
 * components call these functions, never apiClient directly.
 */

async function register({ name, email, password }) {
  const data = await apiClient.post('/api/auth/register', { name, email, password });
  persistSession(data);
  return data;
}

async function login({ email, password }) {
  const data = await apiClient.post('/api/auth/login', { email, password });
  persistSession(data);
  return data;
}

async function fetchCurrentUser() {
  const data = await apiClient.get('/api/auth/me');
  return data.user;
}

function persistSession({ user, token }) {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}

function getStoredUser() {
  const raw = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export const authService = {
  register,
  login,
  fetchCurrentUser,
  logout: clearSession,
  getStoredUser,
  getStoredToken,
};
