import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env, isProd } from "../config/env.js";
import { User } from "../models/User.js";
import { normalizeEmail } from "../utils/security.js";
import { created, ok, conflict, unauthorized } from "../utils/errors.js";
import { writeAudit } from "../middleware/audit.js";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: isProd(),
    sameSite: "lax",
    path: "/"
  };
}

export async function register(req, res) {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password);

  const existed = await User.findOne({ email }).select("_id");
  if (existed) {
    await writeAudit(req, { event: "register_conflict", meta: { email } });
    return conflict(res, "Account already exists");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    email,
    passwordHash,
    role: "user"
  });

  await writeAudit(req, { event: "register_success", userId: user._id, meta: { email } });

  return created(res, { message: "Registered" });
}

export async function login(req, res) {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password);

  const user = await User.findOne({ email }).select("_id email role passwordHash");


  if (!user) {
    await writeAudit(req, { event: "login_fail", meta: { email, reason: "no_user" } });
    return unauthorized(res, "Invalid credentials");
  }

  const okPw = await bcrypt.compare(password, user.passwordHash);
  if (!okPw) {
    await writeAudit(req, { event: "login_fail", userId: user._id, meta: { email, reason: "bad_pw" } });
    return unauthorized(res, "Invalid credentials");
  }

  const token = jwt.sign(
    { userId: String(user._id), role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  res.cookie(env.COOKIE_NAME, token, cookieOptions());

  await writeAudit(req, { event: "login_success", userId: user._id, meta: { email } });

  return ok(res, { message: "OK", user: { id: String(user._id), email: user.email, role: user.role } });
}

export async function logout(req, res) {
  res.clearCookie(env.COOKIE_NAME, { path: "/" });
  await writeAudit(req, { event: "logout", userId: req.user.userId });
  return ok(res, { message: "Logged out" });
}

export async function me(req, res) {
  return ok(res, { user: req.user });
}
