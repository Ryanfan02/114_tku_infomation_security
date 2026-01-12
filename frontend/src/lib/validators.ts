export type ValidationResult = { ok: boolean; message?: string };

function hasWhitespace(s: string): boolean {
  return /\s/.test(s);
}

function isAlphaNum(ch: string): boolean {
  const code = ch.charCodeAt(0);

 
  if (code >= 48 && code <= 57) return true;


  if (code >= 65 && code <= 90) return true;

  
  if (code >= 97 && code <= 122) return true;

  return false;
}

function isSymbol(ch: string): boolean {
  
  if (ch === "_") return false;
  if (isAlphaNum(ch)) return false;
  if (/\s/.test(ch)) return false;
  return true;
}

function symbolNotAtEdges(s: string): boolean {
  if (s.length === 0) return true;
  return !isSymbol(s[0]) && !isSymbol(s[s.length - 1]);
}


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

    if (code >= 48 && code <= 57) hasDigit = true; 
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) hasLetter = true; 
    if (isSymbol(ch)) hasSym = true;
  }

  if (!hasLetter) return { ok: false, message: "密碼需至少包含 1 個英文字母" };
  if (!hasDigit) return { ok: false, message: "密碼需至少包含 1 個數字" };
  if (!hasSym) return { ok: false, message: "密碼需至少包含 1 個特殊符號" };

  return { ok: true };
}


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
