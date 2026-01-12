import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx";

const KEY = "items_local_v1";

function loadItems() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
}

function saveItems(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export default function Dashboard() {
  const { user } = useAuth();

  const [items, setItems] = useState(() => loadItems());
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    saveItems(items);
  }, [items]);

  function onCreate() {
    setError("");
    const t = title.trim();
    if (t.length === 0) {
      setError("標題不能為空");
      return;
    }
    if (t.length > 50) {
      setError("標題最多 50 字");
      return;
    }

    const newItem = { _id: `${Date.now()}`, title: t };
    setItems((prev) => [newItem, ...prev]);
    setTitle("");
  }

  function onDelete(id) {
    setItems((prev) => prev.filter((x) => x._id !== id));
  }

  return (
    <div className="container">
      <div className="dashTop">
        <div>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <div className="small">登入者：{user?.username}（{user?.role}）</div>
        </div>

        {/* 登出改到右上角 TopRightControls */}
      </div>

      {error ? <div className="error">{error}</div> : null}

      <div className="card stack" style={{ marginTop: 12 }}>
        <h3>建立 Item（本機測試）</h3>
        <div className="row" style={{ alignItems: "center" }}>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="標題"
          />
          <button className="btn" type="button" onClick={onCreate}>
            新增
          </button>
        </div>
        <div className="small">目前先存 localStorage，等後端完成再改成 MongoDB。</div>
      </div>

      <div className="card stack" style={{ marginTop: 12 }}>
        <h3>我的 Items</h3>
        <div className="stack">
          {items.length === 0 ? (
            <div className="small">目前沒有資料</div>
          ) : (
            items.map((it) => (
              <div
                key={it._id}
                className="row"
                style={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <div>{it.title}</div>
                <button className="btn secondary" type="button" onClick={() => onDelete(it._id)}>
                  刪除
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
