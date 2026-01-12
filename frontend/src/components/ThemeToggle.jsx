import React, { useEffect, useState } from "react";

const KEY = "theme";

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    return;
  }
  document.documentElement.removeAttribute("data-theme");
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "dark") {
      setTheme("dark");
      applyTheme("dark");
      return;
    }
    setTheme("light");
    applyTheme("light");
  }, []);

  function toggle() {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem(KEY, "light");
      applyTheme("light");
      return;
    }

    setTheme("dark");
    localStorage.setItem(KEY, "dark");
    applyTheme("dark");
  }

  const label = theme === "dark" ? "淺色" : "深色";

  return (
    <div className="theme-toggle">
      <button className="theme-btn" onClick={toggle} type="button">
        {label}
      </button>
    </div>
  );
}
