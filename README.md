# SECURITY 專案（前後端 + MongoDB + CI/CD Static Analysis）

本專案是一個「具備註冊/登入 + 受保護頁面 + CRUD Items」的前後端系統，後端採用 Express + MongoDB（Docker），前端採用 React (Vite)。
系統重點是把常見的資安設計（bcrypt、RBAC/Ownership、Rate Limiting、JWT HttpOnly Cookie、安全日誌）完整落地，並串接到前端操作。

---

## 1. 功能概覽

### 使用者流程
1. 使用者先註冊帳號（Email + 密碼 + 再次確認密碼）
2. 註冊成功後登入
3. 登入後才能進入 Dashboard
4. 在 Dashboard 可建立 / 查看 / 刪除 Items（資料存入 MongoDB）
5. 登出後無法再存取受保護 API 或頁面

### 系統功能
- ✅ 註冊 / 登入 / 登出
- ✅ 使用 HttpOnly Cookie 儲存 JWT（避免前端 JS 直接讀取 token）
- ✅ Items CRUD（新增/列表/刪除，資料落地 MongoDB）
- ✅ Ownership（只能刪除/修改自己建立的資料；admin 可例外）
- ✅ Rate Limiting（全站 API + login/register 更嚴格）
- ✅ Audit Log（註冊/登入成功失敗、重要 CRUD 行為記錄）

---

## 2. 使用的技術

### Frontend
- React (Vite)
- React Router
- Fetch API（`credentials: "include"` 以支援 HttpOnly cookie）
- 自訂 UI components（PasswordStrength、ThemeToggle、Calendar 等）

### Backend
- Node.js + Express
- MongoDB + Mongoose
- bcrypt（密碼雜湊）
- jsonwebtoken（JWT）
- express-rate-limit（Rate limiting）
- cookie-parser + cors（cookie / 跨域設定）
- Audit Log collection（安全日誌）

### DevOps / CI
- Docker / Docker Compose（後端 + MongoDB 一鍵啟動）
- GitHub Actions
  - CodeQL（靜態安全掃描）
  - npm audit（依賴漏洞掃描）
  - ESLint（若有設定 lint script 可啟用）

---

## 3. 專案目錄結構

```txt
SECURITY/
├── .github/workflows/
│   ├── codeql.yml
│   └── node-ci.yml
├── backend/
│   ├── src/
│   │   ├── config/            # env/db 設定
│   │   ├── controllers/       # auth/items controller
│   │   ├── middleware/        # auth/rbac/rateLimit/validate/audit
│   │   ├── models/            # User/Item/AuditLog
│   │   ├── routes/            # auth.routes/items.routes
│   │   ├── utils/             # errors/security
│   │   ├── app.js
│   │   └── server.js
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── package.json
│   └── .env                   # 本機用（不要 commit）
└── frontend/
    ├── src/
    │   ├── api/               # client/auth/items
    │   ├── components/
    │   ├── hooks/
    │   ├── lib/
    │   └── pages/             # Login/Register/Dashboard
    ├── package.json
    └── .env
```

---

## 4. 系統架構圖（完整）

```mermaid
flowchart LR
  U[User Browser] -->|HTTP (5173)| FE[Frontend: React(Vite)]
  FE -->|Fetch + credentials include| API[Backend: Express API (4000)]
  API -->|Mongoose| DB[(MongoDB 27017)]

  API -->|JWT in HttpOnly Cookie| FE
  API --> LOG[AuditLog Collection]
  DB --- LOG

  subgraph Security
    A[bcrypt hash+salt]
    B[RBAC/Ownership]
    C[Rate Limiting]
    D[JWT exp + HttpOnly Cookie]
    E[Audit Log]
  end

  API --- A
  API --- B
  API --- C
  API --- D
  API --- E
```

---

## 5. API 簡表

### Auth
- `POST /api/auth/register`：註冊（email, password, confirmPassword）
- `POST /api/auth/login`：登入（email, password）→ 設定 HttpOnly cookie
- `POST /api/auth/logout`：登出（清 cookie）
- `GET /api/auth/me`：取得目前登入者資訊（需 cookie）

### Items（需登入）
- `GET /api/items`：列出 items（user 只看自己；admin 可看全部）
- `POST /api/items`：新增 item（title, done）
- `PUT /api/items/:id`：更新 item（Ownership / admin）
- `DELETE /api/items/:id`：刪除 item（Ownership / admin）

---

## 6. 環境變數設定

### 6.1 Backend（必填）
在 `backend/` 建立 `.env`（不要 commit）：

```env
NODE_ENV=development
PORT=4000

# MongoDB (docker compose 內部連線用 mongo service name)
MONGO_URI=mongodb://root:rootpass@mongo:27017/appdb?authSource=admin

# JWT
JWT_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_STRING_1234567890_ABCDEFGHIJKLMNOPQRSTUVWXYZ
JWT_EXPIRES_IN=15m

# Cookie / CORS
COOKIE_NAME=access_token
CORS_ORIGIN=http://localhost:5173
```

### 6.2 Frontend（必填）
在 `frontend/` 建立 `.env`：

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_APP_ENV=dev
```

---

## 7. 如何啟動（推薦：Docker 啟動後端 + DB）

### 7.1 啟動後端 + MongoDB（Docker Compose）
進入 `backend/`：

```bash
docker compose up -d --build
```

確認：
- API: `http://localhost:4000/health`
- MongoDB: `localhost:27017`

### 7.2 啟動前端（Vite）
進入 `frontend/`：

```bash
npm install
npm run dev
```

前端網址：
- `http://localhost:5173`

---

## 8. MongoDB Compass 連線方式

在 MongoDB Compass URI 輸入：

```txt
mongodb://root:rootpass@localhost:27017/appdb?authSource=admin
```

資料庫：
- `appdb.users`
- `appdb.items`
- `appdb.auditlogs`

---

## 9. 安全設計（5 點對應）

1) **bcrypt 密碼雜湊與加鹽**  
- DB 存 `passwordHash`，登入用 `bcrypt.compare`

2) **權限控制（RBAC / Ownership）**  
- item 具有 `ownerId`
- 非擁有者不可更新/刪除（403），admin 可例外

3) **Rate Limiting**  
- 全站 API limiter
- login/register 更嚴格 limiter

4) **JWT Token 安全（HttpOnly Cookie + 過期）**  
- token 具 exp 過期
- cookie 使用 HttpOnly（避免被 JS 讀取）

5) **安全日誌 Audit Log**  
- 註冊/登入成功失敗、重要 CRUD 記錄到 `auditlogs`

---

## 10. CI/CD 靜態分析（加分項）

本專案包含 GitHub Actions workflow：
- CodeQL：靜態安全掃描
- Node CI：npm audit、（可選）eslint、frontend build

路徑：
- `.github/workflows/codeql.yml`
- `.github/workflows/node-ci.yml`

Push 後可在 GitHub → Actions 看到 pipeline 執行結果。

---

## 11. Demo 影片（請在此放連結）


- Demo 影片連結：`（貼上你的影片網址）`

---

## 12. 備註
- 本系統採用 MongoDB（非 SQL），傳統 SQL injection 不適用；針對注入風險可用「輸入驗證 + 僅用白名單欄位組 query」方式防止 NoSQL/operator injection。
- items CRUD 已串接 MongoDB，可透過 MongoDB Compass 驗證資料實際落地。
