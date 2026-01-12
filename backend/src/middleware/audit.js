import { AuditLog } from "../models/AuditLog.js";

function getIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (xf) return String(xf).split(",")[0].trim();
  return req.ip;
}

export async function writeAudit(req, { event, userId, meta }) {
  const ip = getIp(req);
  const ua = req.headers["user-agent"] || "";

  await AuditLog.create({
    event,
    userId: userId || undefined,
    ip,
    ua,
    meta: meta || undefined
  });
}
