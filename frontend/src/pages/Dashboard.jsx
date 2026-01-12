import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import { listItemsApi, createItemApi, deleteItemApi } from "../api/items.js";

export default function Dashboard() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  async function loadItems() {
    setError("");
    setLoading(true);
    try {
      const data = await listItemsApi();
      const arr = data && data.items ? data.items : [];
      setItems(Array.isArray(arr) ? arr : []);
    } catch (err) {
      const msg =
        err && err.data && err.data.message
          ? err.data.message
          : "讀取資料失敗";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
    
  }, []);

  async function onCreate() {
    setError("");

    const t = String(title || "").trim();
    if (t.length === 0) {
      setError("標題不能為空");
      return;
    }
    if (t.length > 50) {
      setError("標題最多 50 字");
      return;
    }

    setCreating(true);
    try {
      const data = await createItemApi({ title: t, done: false });
      
      const item = data && data.item ? data.item : null;

      if (item && item._id) {
        setItems((prev) => [item, ...prev]);
        setTitle("");
      } else {
      
        setTitle("");
        await loadItems();
      }
    } catch (err) {
      const msg =
        err && err.data && err.data.message
          ? err.data.message
          : "新增失敗";
      setError(msg);
    } finally {
      setCreating(false);
    }
  }

  async function onDelete(id) {
    setError("");

    const safeId = String(id || "").trim();
    if (!safeId) return;

    try {
      await deleteItemApi(safeId);
      setItems((prev) => prev.filter((x) => String(x._id) !== safeId));
    } catch (err) {
      const msg =
        err && err.data && err.data.message
          ? err.data.message
          : "刪除失敗";
      setError(msg);
    }
  }

  return (
    <div className="container">
      <div className="dashTop">
        <div>
          <h2 style={{ margin: 0 }}>Dashboard</h2>

        
          <div className="small">
            登入者：{user?.userId ? user.userId : "unknown"}（{user?.role ? user.role : "?"}）
          </div>
        </div>

        
      </div>

      {error ? <div className="error">{error}</div> : null}

      <div className="card stack" style={{ marginTop: 12 }}>
        <h3>建立 Item（MongoDB）</h3>

        <div className="row" style={{ alignItems: "center" }}>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="標題"
          />

          <button className="btn" type="button" onClick={onCreate} disabled={creating}>
            {creating ? "新增中..." : "新增"}
          </button>
        </div>

        <div className="small">
          呼叫後端 API（MongoDB）。
        </div>
      </div>

      <div className="card stack" style={{ marginTop: 12 }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>我的 Items</h3>
          <button className="btn secondary" type="button" onClick={loadItems} disabled={loading}>
            {loading ? "載入中..." : "重新整理"}
          </button>
        </div>

        <div className="stack">
          {loading ? (
            <div className="small">載入中...</div>
          ) : items.length === 0 ? (
            <div className="small">目前沒有資料</div>
          ) : (
            items.map((it) => (
              <div
                key={it._id}
                className="row"
                style={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <div>{it.title}</div>

                <button
                  className="btn secondary"
                  type="button"
                  onClick={() => onDelete(it._id)}
                >
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
