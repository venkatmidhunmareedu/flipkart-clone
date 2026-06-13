# Flipkart Clone

A full-stack Flipkart-style e-commerce marketplace built as a Turborepo monorepo.

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, TanStack Query |
| Backend | Express 5, TypeScript, Prisma 7 |
| Database | PostgreSQL (Supabase recommended) |
| Auth | NextAuth.js (email OTP, credentials) |
| Payments | Razorpay (test mode) |
| Monorepo | pnpm workspaces + Turborepo |

## Project structure

```
apps/
  frontend/   Next.js storefront
  backend/    Express REST API
packages/
  ui/         Shared React components
  eslint-config/
  typescript-config/
```

## Prerequisites

- Node.js 18+
- pnpm 9+
- PostgreSQL database (local or [Supabase](https://supabase.com))

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Backend environment

Copy the example env and fill in your database credentials:

```bash
cp apps/backend/.env.example apps/backend/.env.development
```

Required variables:

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default `5000`) |
| `DATABASE_URL` | PostgreSQL connection string (pooler URL for Supabase) |
| `DIRECT_URL` | Direct PostgreSQL URL (required for Prisma migrations on Supabase) |
| `JWT_SECRET` | Secret for JWT signing |
| `NEXTAUTH_SECRET` | Must match frontend NextAuth secret |
| `GMAIL_USER` | Gmail address for OTP emails (optional in dev) |
| `GMAIL_APP_PASSWORD` | Gmail app password for SMTP |
| `RAZORPAY_KEY_ID` | Razorpay test/live key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |

### 3. Database migrate & seed

```bash
cd apps/backend
pnpm prisma migrate dev --name init
pnpm prisma generate
pnpm prisma db seed
```

Demo user after seed: `test@example.com` / `Test@1234`

### 4. Frontend environment

```bash
cp apps/frontend/.env.local.example apps/frontend/.env.local
```

Set `NEXTAUTH_SECRET` to the same value as the backend.

### 5. Run dev servers

From repo root:

```bash
make run-all        # both frontend (3000) and backend (5000)
make run-frontend   # frontend only
make run-backend    # backend only
```

Verify backend health: [http://localhost:5000/api/health](http://localhost:5000/api/health)

## Assumptions

- Money stored as integers in **paise** (₹1 = 100 paise)
- Email-only OTP verification (no phone OTP)
- Indian pincodes validated as 6 digits
- Cart and order prices snapshotted server-side at add/checkout time
- Razorpay used in test mode until production keys are configured

## Deployment

| App | URL |
|-----|-----|
| Frontend | _TBD_ |
| Backend API | _TBD_ |

## Documentation

- [PRD.md](./PRD.md) — product requirements
- [SCHEMA.md](./SCHEMA.md) — database schema reference
- [ARCHITECTURE.md](./ARCHITECTURE.md) — system architecture
- [todos/](./todos/) — implementation task breakdown by module

## License

Private — for learning and portfolio use.
