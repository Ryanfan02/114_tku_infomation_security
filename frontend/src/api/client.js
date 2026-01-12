
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";


export async function apiFetch(path, options) {
  const opt = options || {};
  const headers = opt.headers ? { ...opt.headers } : {};

  const hasBody = opt.body !== undefined && opt.body !== null;
  const hasContentType = headers["Content-Type"] || headers["content-type"];

  if (hasBody && !hasContentType) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...opt,
    headers,
    credentials: "include"
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let data = null;
  if (isJson) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => "");
  }

  if (!res.ok) {
    const message =
      data && typeof data === "object" && data.message
        ? data.message
        : `Request failed (${res.status})`;

    const err = new Error(message);

    err.status = res.status;

    err.data = data;
    throw err;
  }

  return data;
}
