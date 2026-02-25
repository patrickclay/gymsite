# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a **Next.js 16** (App Router) gym website called "Seen Fitness" — a class scheduling and booking platform. See `README.md` for tech stack and project structure, and `docs/gym_website_prd.md` for the full product spec.

### Common commands

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (port 3000) |
| Lint | `npm run lint` |
| Build | `npm run build` |
| No test framework is configured | — |

### Environment variables

Copy `.env.example` to `.env.local`. The app requires Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) for schedule/admin/booking features. Static pages (landing, classes, blog, about, location) render without Supabase. Placeholder values in `.env.local` allow the dev server to start; pages calling Supabase will show runtime errors until real credentials are provided.

### Key gotchas

- **No test runner**: There are no automated tests or test dependencies. Validation is manual only.
- **Supabase is external**: The app uses hosted Supabase (not local). The `/schedule`, `/admin`, and booking API routes will throw if Supabase env vars are missing or invalid.
- **Resend / AI Gateway are optional**: Email and AI description features degrade gracefully when their API keys are absent.
- **Stripe is declared in `.env.example` but not yet implemented in code** — no Stripe integration exists yet.
- **Product spec rule**: When shipping product-facing features, update `docs/gym_website_prd.md` and bump its revision history (see `.cursor/rules/update-product-spec.mdc`).
