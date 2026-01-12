const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * API Client
 * - 若後端用 HttpOnly cookie 存 token：一定要 credentials: "include"
 */
export async function apiFetch(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options && options.headers ? options.headers : {})
    },
    credentials: "include"
  });

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const err = new Error((data && data.message) ? data.message : "Request failed");
    // @ts-ignore
    err.status = res.status;
    // @ts-ignore
    err.data = data;
    throw err;
  }

  return data;
}
