function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || "4000"),

  MONGO_URI: requireEnv("MONGO_URI", process.env.MONGO_URI),
  JWT_SECRET: requireEnv("JWT_SECRET", process.env.JWT_SECRET),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",

  COOKIE_NAME: process.env.COOKIE_NAME || "access_token",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173"
};

export function isProd() {
  return env.NODE_ENV === "production";
}
