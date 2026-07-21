import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as authService from "../services/auth";
import { getToken, setToken as persistToken } from "../services/api";

const AuthContext = createContext(null);

/**
 * Wrap your app with <AuthProvider> to give every page access to the
 * signed-in user. Restores the session on load via GET /api/auth/me
 * if a JWT is already in localStorage.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => {
        persistToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const data = await authService.login(email, password);
      persistToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setError(null);
    try {
      const data = await authService.register(name, email, password);
      persistToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    persistToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Use this hook in any component to access the signed-in user. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
