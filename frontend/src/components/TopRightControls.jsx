import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx";

const THEME_KEY = "theme";
const ACCENT_KEY = "accent";

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    return;
  }
  document.documentElement.removeAttribute("data-theme");
}

function applyAccent(color) {
  document.documentElement.style.setProperty("--accent", color);
}

export default function TopRightControls() {
  const { user, logout } = useAuth();

  const [theme, setTheme] = useState("light");
  const [accent, setAccent] = useState("#2563eb"); // 預設藍色

  // 顏色選項（你也可以自己換）
  const colors = ["#2563eb", "#16a34a", "#f97316", "#a855f7", "#ef4444"];

  useEffect(() => {
    // theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") {
      setTheme("dark");
      applyTheme("dark");
    } else {
      setTheme("light");
      applyTheme("light");
    }

    // accent
    const savedAccent = localStorage.getItem(ACCENT_KEY);
    if (savedAccent) {
      setAccent(savedAccent);
      applyAccent(savedAccent);
    } else {
      applyAccent("#2563eb");
    }
  }, []);

  function toggleTheme() {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem(THEME_KEY, "light");
      applyTheme("light");
      return;
    }

    setTheme("dark");
    localStorage.setItem(THEME_KEY, "dark");
    applyTheme("dark");
  }

  function pickAccent(color) {
    setAccent(color);
    localStorage.setItem(ACCENT_KEY, color);
    applyAccent(color);
  }

  let themeLabel = "深色";
  if (theme === "dark") themeLabel = "淺色";

  return (
    <div className="topRightControls">
      {/* 主題切換 */}
      <button className="theme-btn" type="button" onClick={toggleTheme}>
        {themeLabel}
      </button>

      {/* 顏色切換 */}
      <div className="accentRow" aria-label="accent colors">
        {colors.map((c) => {
          const isActive = c === accent;
          const cls = isActive ? "accentDot active" : "accentDot";

          return (
            <button
              key={c}
              type="button"
              className={cls}
              onClick={() => pickAccent(c)}
              style={{ background: c }}
              title={c}
            />
          );
        })}
      </div>

      {/* 登出（只有登入後才顯示） */}
      {user ? (
        <button className="btn secondary" type="button" onClick={logout}>
          登出
        </button>
      ) : null}
    </div>
  );
}
