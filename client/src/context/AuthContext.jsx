import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/auth/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = authService.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(authService.mapUser(firebaseUser));
        await authService.getToken();
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const { user: u } = await authService.login(email, password);
      setUser(authService.mapUser(u));
      return u;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const register = useCallback(async (email, password, displayName) => {
    setError(null);
    try {
      const { user: u } = await authService.register(email, password, displayName);
      setUser(authService.mapUser(u));
      return u;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const { user: u } = await authService.loginWithGoogle();
      setUser(authService.mapUser(u));
      return u;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    isDevMode: authService.isDevMode(),
    login,
    register,
    loginWithGoogle,
    logout,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
