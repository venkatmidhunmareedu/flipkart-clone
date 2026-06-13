# Module 00 — Project Setup & Infrastructure

Foundational setup: database, Prisma, environment, seed data.

---

## Status Legend
- ⬜ Pending
- ✅ Done
- 🔄 In progress

---

## Backend — Prisma & Database

- [x] **00-B-01** Copy schema from `SCHEMA.md` into `apps/backend/prisma/schema.prisma`
- [x] **00-B-02** Run initial Prisma migration against Supabase
  ```bash
  cd apps/backend
  pnpm prisma migrate dev --name init
  ```
- [x] **00-B-03** Verify `prisma.config.ts` points to correct `schema.prisma` path
- [x] **00-B-04** Generate Prisma client: `pnpm prisma generate`
- [x] **00-B-05** Create `apps/backend/src/lib/prisma.ts` — singleton PrismaClient export
  ```ts
  // src/lib/prisma.ts
  import { PrismaClient } from "@prisma/client";
  const prisma = globalThis.prisma ?? new PrismaClient();
  if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
  export default prisma;
  ```

## Backend — Environment

- [x] **00-B-06** Document all required env vars in `apps/backend/.env.example`:
  ```
  PORT=5000
  DATABASE_URL=postgresql://...
  DIRECT_URL=postgresql://...
  JWT_SECRET=
  NEXTAUTH_SECRET=
  GMAIL_USER=
  GMAIL_APP_PASSWORD=
  RAZORPAY_KEY_ID=
  RAZORPAY_KEY_SECRET=
  ```
- [x] **00-B-07** Add `apps/backend/.env.development` with local dev values (no secrets committed)

## Backend — Seed Script

- [x] **00-B-08** Create `apps/backend/prisma/seed.ts`:
  - Seed **10 top-level categories** with icons matching Flipkart navbar:
    `Electronics`, `Fashion`, `Mobiles`, `Beauty`, `Home`, `Appliances`, `Toys & Baby`, `Food & Health`, `Sports`, `Furniture`
  - Seed **3–5 sub-categories** under each top-level category
  - Seed **50+ products** spread across categories with realistic:
    - Indian brand names
    - MRP vs selling price gap (15–75% discount)
    - Multiple image URLs (use placeholder CDN or Unsplash)
    - `isFeatured: true` for ~10 products
  - Seed **1 default user** (`test@example.com`, password: `Test@1234`) for demo login
- [x] **00-B-09** Add seed command to `package.json`:
  ```json
  "prisma": { "seed": "tsx prisma/seed.ts" }
  ```
- [x] **00-B-10** Run seed: `pnpm prisma db seed`

## Frontend — Environment

- [x] **00-F-01** Create `apps/frontend/.env.local.example`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:5000
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=
  NEXT_PUBLIC_RAZORPAY_KEY_ID=
  ```

## Monorepo

- [x] **00-M-01** Verify `pnpm install` installs all workspaces cleanly
- [x] **00-M-02** Confirm `make run-all` starts both frontend (3000) and backend (5000) without errors
- [x] **00-M-03** Add `apps/backend/src/routes/health.routes.ts` returning `{ data: { status: "ok" } }` at `GET /api/health`
- [x] **00-M-04** Update root `README.md` with:
  - Tech stack table
  - Setup instructions (env, migrate, seed, run)
  - Assumptions list
  - Deployment links (fill after deploy)
