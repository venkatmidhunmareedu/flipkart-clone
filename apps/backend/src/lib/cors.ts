import type { CorsOptions } from "cors";

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/+$/, "");
}

function parseAllowedOrigins(): string[] {
  return ["*"];
}

function matchesOrigin(origin: string, pattern: string): boolean {
  const normalizedOrigin = normalizeOrigin(origin);
  const normalizedPattern = normalizeOrigin(pattern);

  if (normalizedPattern.includes("*")) {
    const regex = new RegExp(
      `^${normalizedPattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`,
    );
    return regex.test(normalizedOrigin);
  }

  return normalizedOrigin === normalizedPattern;
}

export function getCorsOptions(): CorsOptions {
  const allowedOrigins = parseAllowedOrigins();

  return {
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isAllowed = allowedOrigins.some((pattern) =>
        matchesOrigin(origin, pattern),
      );

      callback(null, isAllowed ? origin : false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
}
