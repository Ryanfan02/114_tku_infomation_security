import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { serverError } from "./utils/errors.js";

import authRoutes from "./routes/auth.routes.js";
import itemsRoutes from "./routes/items.routes.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );

  app.use(apiLimiter);

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/items", itemsRoutes);


  app.use((err, req, res, next) => {
    console.error(err);
    return serverError(res, "Server error");
  });

  return app;
}
