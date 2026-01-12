import { apiFetch } from "./client.js";

export function listItemsApi() {
  return apiFetch("/items", { method: "GET" });
}

export function createItemApi(body) {
  return apiFetch("/items", { method: "POST", body: JSON.stringify(body) });
}

export function updateItemApi(id, body) {
  return apiFetch(`/items/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export function deleteItemApi(id) {
  return apiFetch(`/items/${id}`, { method: "DELETE" });
}
