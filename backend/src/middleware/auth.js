import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { unauthorized } from "../utils/errors.js";

export function requireAuth(req, res, next) {
  const token = req.cookies[env.COOKIE_NAME];

  if (!token) {
    return unauthorized(res, "Unauthorized");
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = {
      userId: payload.userId,
      role: payload.role
    };
    next();
  } catch (e) {
    return unauthorized(res, "Unauthorized");
  }
}
