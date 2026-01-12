import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { validateUsername, validatePassword } from "../lib/validators.ts";

export default function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const u = validateUsername(username);
    if (!u.ok) {
      setError(u.message || "帳號格式不正確");
      return;
    }

    const p = validatePassword(password);
    if (!p.ok) {
      setError(p.message || "密碼格式不正確");
      return;
    }

    const result = await login(username, password);
    if (!result.ok) {
      setError(result.message || "帳號或密碼錯誤");
      return;
    }

    const from = loc.state && loc.state.from ? loc.state.from : "/dashboard";
    nav(from, { replace: true });
  }

  return (
    <div className="page-center">
      <div className="card stack auth-card">
        <h2>登入</h2>

        {error ? <div className="error">{error}</div> : null}

        <form className="stack" onSubmit={onSubmit}>
          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="帳號"
            autoComplete="username"
          />

          <input
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="密碼"
            autoComplete="current-password"
          />

          <button className="btn" disabled={loading} type="submit">
            登入
          </button>
        </form>

        <div className="small">
          沒有帳號？<Link to="/register">去註冊</Link>
        </div>
      </div>
    </div>
  );
}
