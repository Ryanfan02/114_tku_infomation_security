import { forbidden } from "../utils/errors.js";

export function requireRole(roles) {
  return (req, res, next) => {
    const role = req.user && req.user.role;
    if (!role) return forbidden(res, "Forbidden");

    if (!roles.includes(role)) {
      return forbidden(res, "Forbidden");
    }
    next();
  };
}

export function requireOwnerOrAdmin(getOwnerId) {
  return async (req, res, next) => {
    const role = req.user && req.user.role;
    const userId = req.user && req.user.userId;

    if (!role || !userId) return forbidden(res, "Forbidden");

    if (role === "admin") {
      return next();
    }

    const ownerId = await getOwnerId(req);
    if (!ownerId) return forbidden(res, "Forbidden");

    if (String(ownerId) !== String(userId)) {
      return forbidden(res, "Forbidden");
    }

    next();
  };
}
