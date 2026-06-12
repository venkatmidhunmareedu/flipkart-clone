# Backend — Agent Guide

Express 5 REST API. See root `AGENTS.md` for monorepo commands.

## Entry points

- `src/index.ts` — dotenv, starts server on `PORT` (default 5000)
- `src/app.ts` — Express app, CORS, JSON middleware, route mounting

## Adding a feature

1. Create `src/routes/<resource>.routes.ts`
2. Mount in `app.ts`: `app.use("/api/<resource>", <resource>Routes)`
3. Add controller in `src/controllers/` when logic grows beyond a few lines
4. Add service in `src/services/` for reusable business logic

## Response format

```json
{ "data": { ... } }
{ "error": { "message": "...", "code": "VALIDATION_ERROR" } }
```

## Env

- `PORT` — server port (`.env` or `.env.development`)
- Add new vars to `.env.development`; never commit secrets
