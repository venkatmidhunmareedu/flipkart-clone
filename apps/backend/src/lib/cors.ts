import type { CorsOptions } from "cors";


const allowedOrigins = [
  "https://flipkart-clone-frontend-ten.vercel.app/",
  "https://*.vercel.app/",
  "http://localhost:3000/",
];

export function getCorsOptions(): CorsOptions {
  return {
    origin(origin, callback) {
      const allowed = allowedOrigins;

      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowed.includes(origin)) {
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
