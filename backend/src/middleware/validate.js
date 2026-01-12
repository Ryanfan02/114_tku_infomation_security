import { badRequest } from "../utils/errors.js";
import { isValidEmail, checkPasswordStrength } from "../utils/security.js";

export function validateRegisterBody(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (!email || !password || !confirmPassword) {
    return badRequest(res, "Missing fields");
  }

  if (!isValidEmail(email)) {
    return badRequest(res, "Invalid email format");
  }

  if (String(password) !== String(confirmPassword)) {
    return badRequest(res, "Password confirmation mismatch");
  }

  if (!checkPasswordStrength(password)) {
    return badRequest(res, "Weak password", {
      rule: ">=8 chars and include upper/lower/digit"
    });
  }

  next();
}

export function validateLoginBody(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return badRequest(res, "Missing fields");
  }

  if (!isValidEmail(email)) {
    return badRequest(res, "Invalid email format");
  }

  next();
}

export function validateItemBody(req, res, next) {
  const title = req.body.title;

  if (!title) {
    return badRequest(res, "Missing title");
  }

  if (String(title).trim().length < 1) {
    return badRequest(res, "Invalid title");
  }

  next();
}
