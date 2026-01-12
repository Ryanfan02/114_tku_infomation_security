import { apiFetch } from "./client.js";

export function listItemsApi() {
  return apiFetch("/api/items", { method: "GET" });
}

export function createItemApi(body) {
  // body: { title, done }
  return apiFetch("/api/items", {
    method: "POST",
    body: JSON.stringify(body)
  });
}

export function updateItemApi(id, body) {
  const safeId = String(id || "").trim();
  return apiFetch(`/api/items/${safeId}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });
}

export function deleteItemApi(id) {
  const safeId = String(id || "").trim();
  return apiFetch(`/api/items/${safeId}`, {
    method: "DELETE"
  });
}
