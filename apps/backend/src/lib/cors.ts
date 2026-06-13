import type { CorsOptions } from "cors";

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, "");
}

export function getAllowedOrigins(): string[] {
  const raw =
    process.env.ALLOWED_ORIGINS ??
    process.env.CORS_ORIGIN ??
    "http://localhost:3000";

  return raw
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);
}

export function getCorsOptions(): CorsOptions {
  return {
    origin(origin, callback) {
      const allowed = getAllowedOrigins();

      if (!origin) {
        callback(null, true);
        return;
      }

      const normalized = normalizeOrigin(origin);
      if (allowed.includes(normalized)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
}
