import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginApi, logoutApi, meApi } from "../api/auth.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshMe() {
    try {
      const data = await meApi(); 
      setUser(data && data.user ? data.user : null);
      return data && data.user ? data.user : null;
    } catch (err) {
      
      setUser(null);
      return null;
    }
  }

  async function login(email, password) {
    await loginApi({ email, password });   
    const u = await refreshMe();           
    return u;
  }

  async function logout() {
    try {
      await logoutApi();
    } finally {
      setUser(null);
    }
  }

  useEffect(() => {
 
    refreshMe().finally(() => setLoading(false));
  
  }, []);

  const value = useMemo(() => {
    return {
      user,
      loading,
      login,
      logout,
      refreshMe
    };
  }, [user, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
