import { apiFetch } from "./client.js";

export function registerApi(body) {
  return apiFetch("/auth/register", { method: "POST", body: JSON.stringify(body) });
}

export function loginApi(body) {
  return apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) });
}

export function logoutApi() {
  return apiFetch("/auth/logout", { method: "POST" });
}

export function meApi() {
  // 需要後端提供 GET /api/auth/me
  return apiFetch("/auth/me", { method: "GET" });
}
