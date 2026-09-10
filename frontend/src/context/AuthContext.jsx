import React, { createContext, useCallback, useEffect, useState } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getStoredUser());
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const token = authService.getStoredToken();
    if (!token) {
      setIsInitializing(false);
      return;
    }

    authService
      .fetchCurrentUser()
      .then((freshUser) => setUser(freshUser))
      .catch(() => {
        authService.logout();
        setUser(null);
      })
      .finally(() => setIsInitializing(false));
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (details) => {
    const data = await authService.register(details);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isInitializing,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
