export type ValidationResult = { ok: boolean; message?: string };

function hasWhitespace(s: string): boolean {
  return /\s/.test(s);
}

function isAlphaNum(ch: string): boolean {
  const code = ch.charCodeAt(0);

  // 0-9
  if (code >= 48 && code <= 57) return true;

  // A-Z
  if (code >= 65 && code <= 90) return true;

  // a-z
  if (code >= 97 && code <= 122) return true;

  return false;
}

function isSymbol(ch: string): boolean {
  // 特殊符號：不是英數、不是底線、不是空白
  if (ch === "_") return false;
  if (isAlphaNum(ch)) return false;
  if (/\s/.test(ch)) return false;
  return true;
}

function symbolNotAtEdges(s: string): boolean {
  if (s.length === 0) return true;
  return !isSymbol(s[0]) && !isSymbol(s[s.length - 1]);
}

/**
 * 帳號規則（你要的）
 * - 只能是 Gmail 或台灣手機號碼
 * - Gmail: xxx@gmail.com 或 xxx@googlemail.com
 * - 手機: 09xxxxxxxx 或 +8869xxxxxxxx 或 8869xxxxxxxx
 * - 不可包含空白
 */
export function validateUsername(username: string): ValidationResult {
  const u = username.trim();

  if (u.length === 0) return { ok: false, message: "請輸入帳號" };
  if (hasWhitespace(u)) return { ok: false, message: "帳號不可包含空白" };

  const gmailPattern = /^[A-Za-z0-9._%+-]+@(gmail\.com|googlemail\.com)$/;
  const twMobilePattern = /^(09\d{8}|(\+?886)9\d{8})$/;

  if (gmailPattern.test(u)) return { ok: true };
  if (twMobilePattern.test(u)) return { ok: true };

  return { ok: false, message: "帳號必須為 Gmail 或台灣手機號碼" };
}

/**
 * 密碼規則（沿用你原本的要求）
 * - 必須大於 8 碼（>= 9）
 * - 不可包含空白
 * - 必須包含：至少 1 英文字母、1 數字、1 特殊符號
 * - 特殊符號不可放第一個或最後一個位置
 * - 特殊符號：任何非英數、非底線、非空白字元
 */
export function validatePassword(password: string): ValidationResult {
  if (password.length <= 8) {
    return { ok: false, message: "密碼必須大於 8 碼" };
  }

  if (hasWhitespace(password)) {
    return { ok: false, message: "密碼不可包含空白" };
  }

  if (!symbolNotAtEdges(password)) {
    return { ok: false, message: "密碼的特殊符號不可放在第一個或最後一個位置" };
  }

  let hasLetter = false;
  let hasDigit = false;
  let hasSym = false;

  for (let i = 0; i < password.length; i += 1) {
    const ch = password[i];
    const code = ch.charCodeAt(0);

    if (code >= 48 && code <= 57) hasDigit = true; // 0-9
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) hasLetter = true; // A-Z a-z
    if (isSymbol(ch)) hasSym = true;
  }

  if (!hasLetter) return { ok: false, message: "密碼需至少包含 1 個英文字母" };
  if (!hasDigit) return { ok: false, message: "密碼需至少包含 1 個數字" };
  if (!hasSym) return { ok: false, message: "密碼需至少包含 1 個特殊符號" };

  return { ok: true };
}

/**
 * 密碼強度分數：0~4
 * - 長度 > 8 先給 1 分
 * - 包含英文字母 +1
 * - 包含數字 +1
 * - 包含特殊符號 +1
 * - 同時有大寫 + 小寫：額外 +1（最多到 4）
 * - 如果特殊符號在頭或尾（理論上 validatePassword 已擋），這裡也會降分
 */
export function passwordStrengthScore(password: string): number {
  let score = 0;

  if (password.length > 8) score += 1;

  let hasLetter = false;
  let hasDigit = false;
  let hasSym = false;
  let hasUpper = false;
  let hasLower = false;

  for (let i = 0; i < password.length; i += 1) {
    const ch = password[i];
    const code = ch.charCodeAt(0);

    if (code >= 48 && code <= 57) hasDigit = true;

    if (code >= 65 && code <= 90) {
      hasLetter = true;
      hasUpper = true;
    }

    if (code >= 97 && code <= 122) {
      hasLetter = true;
      hasLower = true;
    }

    if (isSymbol(ch)) hasSym = true;
  }

  if (hasLetter) score += 1;
  if (hasDigit) score += 1;
  if (hasSym) score += 1;

  if (hasUpper && hasLower && score < 4) score += 1;

  if (score > 4) score = 4;

  if (!symbolNotAtEdges(password)) score = score > 0 ? score - 1 : 0;

  return score;
}
