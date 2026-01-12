const KEY = "auth_user";

export function saveUser(user: unknown) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function loadUser() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem(KEY);
}
