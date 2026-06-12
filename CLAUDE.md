# Flipkart Clone — Agent Guide

E-commerce monorepo (Flipkart-style marketplace). Turborepo + pnpm.

## Repository layout

| Path | Purpose |
|------|---------|
| `apps/frontend` | Next.js 16 app (React 19, Tailwind 4, App Router) |
| `apps/backend` | Express 5 REST API (TypeScript, tsup) |
| `packages/ui` | Shared React components (`@repo/ui`) |
| `packages/eslint-config` | Shared ESLint configs |
| `packages/typescript-config` | Shared tsconfig bases |

## Dev commands

```bash
pnpm install          # install all workspaces
make run-frontend     # Next.js on default port 3000
make run-backend      # Express on PORT (default 5000)
make run-all          # both apps via turbo
pnpm build            # build all packages
pnpm lint             # lint all packages
pnpm check-types      # typecheck all packages
```

Filter a single workspace: `pnpm --filter backend dev` or `turbo run dev --filter=frontend`.

## Architecture conventions

- **API prefix**: `/api/*` on the backend (e.g. `/api/users`).
- **Env**: Backend reads `PORT` from `.env` / `.env.development` via dotenv in `src/index.ts`.
- **Shared UI**: Import from `@repo/ui` in the frontend; do not duplicate primitives.
- **Types**: Prefer shared types in a `packages/` workspace when both apps need them (create `packages/types` when needed).
- **Currency & locale**: INR (₹), Indian pincode delivery, MRP vs selling price, discount badges.

## Backend patterns

```
apps/backend/src/
  app.ts              # express app, middleware, route mounting
  index.ts            # server entry, dotenv, listen
  routes/*.routes.ts  # route definitions
  controllers/        # request handlers (add as features grow)
  services/           # business logic (add as features grow)
```

- Export the Express app from `app.ts`; keep `index.ts` as the listen entry only.
- One router file per resource: `products.routes.ts`, `orders.routes.ts`, etc.
- Return JSON with consistent shapes: `{ data }` for success, `{ error: { message, code } }` for errors.

## Frontend patterns

- App Router under `apps/frontend/app/`.
- See `apps/frontend/AGENTS.md` for Next.js 16-specific rules (read `node_modules/next/dist/docs/` before writing Next code).
- Flipkart-style UI: blue primary (`#2874f0`), yellow accent (`#ffe500`), clean product cards, filter sidebar on listing pages.

## E-commerce domain map

Planned feature areas — use matching skills in `.cursor/skills/`:

| Domain | Backend routes | Frontend routes |
|--------|----------------|-----------------|
| Catalog | `/api/products`, `/api/categories` | `/`, `/search`, `/p/[slug]` |
| Cart | `/api/cart` | `/cart` |
| Checkout | `/api/orders`, `/api/addresses` | `/checkout` |
| Auth | `/api/auth` | `/login`, `/account` |
| Wishlist | `/api/wishlist` | `/wishlist` |

## What not to do

- Do not commit `.env` files with secrets.
- Do not add a database ORM until a `packages/db` or similar workspace is introduced — ask which DB to use first.
- Keep changes scoped: one feature per PR-sized diff.
- Match existing code style (double quotes in backend, follow frontend ESLint).
