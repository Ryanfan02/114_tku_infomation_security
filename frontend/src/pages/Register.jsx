import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrength from "../components/PasswordStrength.jsx";
import { validateUsername, validatePassword } from "../lib/validators.ts";
import { registerApi } from "../api/auth.js";

export default function Register() {
  const nav = useNavigate();

  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (password !== password2) {
      setError("兩次密碼必須相同");
      return;
    }

    setLoading(true);
    try {
      
      await registerApi({
        email: username.trim(),
        password: password,
        confirmPassword: password2
      });

      nav("/login", { replace: true });
    } catch (err) {
 
      const msg =
        err && err.data && err.data.message
          ? err.data.message
          : "註冊失敗，請稍後再試";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-center">
      <div className="card stack auth-card register">
        <h2>註冊</h2>

        {error ? <div className="error">{error}</div> : null}

        <form className="stack" onSubmit={onSubmit}>
          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="帳號（Email）"
            autoComplete="username"
          />

          <input
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="密碼"
            autoComplete="new-password"
          />

          <PasswordStrength password={password} />

          <input
            className="input"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            type="password"
            placeholder="再次確認密碼"
            autoComplete="new-password"
          />

          <button className="btn" disabled={loading} type="submit">
            建立帳號
          </button>
        </form>

        <div className="small">
          已有帳號？<Link to="/login">去登入</Link>
        </div>
      </div>
    </div>
  );
}
