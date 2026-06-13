import type { CorsOptions } from "cors";

function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/$/, "");
}


const allowedOrigins = [
  "https://flipkart-clone-frontend-ten.vercel.app",
  "https://*.vercel.app",
  "http://localhost:3000",
];

export function getCorsOptions(): CorsOptions {
  return {
    origin(origin, callback) {
      const allowed = allowedOrigins;

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
