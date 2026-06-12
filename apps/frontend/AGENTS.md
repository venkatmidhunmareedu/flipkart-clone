See root `../../AGENTS.md` for monorepo layout, dev commands, and e-commerce domain rules.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Frontend specifics

- App Router under `app/`; Tailwind 4 for styling
- API base URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`)
- Flipkart palette: primary `#2874f0`, accent `#ffe500`
- Reuse `@repo/ui` components from `packages/ui` before creating new primitives
