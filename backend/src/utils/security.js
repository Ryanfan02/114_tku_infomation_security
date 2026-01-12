export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isValidEmail(email) {
  const v = String(email || "").trim();

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(v);
}


export function checkPasswordStrength(password) {
  const p = String(password || "");
  if (p.length < 8) return false;

  let hasUpper = false;
  let hasLower = false;
  let hasDigit = false;

  for (let i = 0; i < p.length; i += 1) {
    const c = p[i];
    if (c >= "A" && c <= "Z") hasUpper = true;
    if (c >= "a" && c <= "z") hasLower = true;
    if (c >= "0" && c <= "9") hasDigit = true;
  }

  if (!hasUpper) return false;
  if (!hasLower) return false;
  if (!hasDigit) return false;
  return true;
}
