import express from "express";
import { registerLimiter, loginLimiter } from "../middleware/rateLimit.js";
import { validateRegisterBody, validateLoginBody } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { register, login, logout, me } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerLimiter, validateRegisterBody, register);
router.post("/login", loginLimiter, validateLoginBody, login);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, me);

export default router;
