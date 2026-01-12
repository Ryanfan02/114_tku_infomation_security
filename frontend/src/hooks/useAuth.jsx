import React, { createContext, useContext, useMemo, useState } from "react";
import { loadUser, saveUser, clearUser } from "../lib/authStorage.ts";
import { loginApi, logoutApi, meApi } from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadUser());
  const [loading, setLoading] = useState(false);

  async function login(username, password) {
    setLoading(true);
    try {
      await loginApi({ username, password });
      const me = await meApi(); // 需要後端 /auth/me
      setUser(me);
      saveUser(me);
      return { ok: true };
    } catch {
      // 錯誤訊息控管：統一不洩漏帳號是否存在
      return { ok: false, message: "帳號或密碼錯誤" };
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try { await logoutApi(); } catch {}
    setLoading(false);
    setUser(null);
    clearUser();
  }

  // F3：可用於 token 過期 / 401 時強制登出
  function forceLogout() {
    setUser(null);
    clearUser();
  }

  const value = useMemo(
    () => ({ user, loading, login, logout, forceLogout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
