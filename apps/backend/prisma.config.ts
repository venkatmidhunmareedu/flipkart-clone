import "dotenv/config";
import path from "path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({ path: path.resolve(__dirname, ".env.development") });
dotenv.config({ path: path.resolve(__dirname, ".env"), override: true });

// Use DIRECT_URL for migrations (Supabase); fall back to DATABASE_URL for local dev
const migrationUrl =
  process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"] ?? "";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: migrationUrl,
  },
});
