# Kijibu AI

Kijibu AI is a production-oriented, multi-tenant customer-service operating system for businesses in Tanzania and East Africa. The platform is designed around official WhatsApp Business Platform messaging, grounded AI responses, and human handoff.

## Foundation status

Phase 1 and the Phase 2 foundation are in progress:

- React, TypeScript, Vite, React Router, Tailwind, and customized shadcn/ui primitives.
- Supabase Auth with email/password UI, session persistence, callback handling, password recovery, and protected routes.
- PostgreSQL tenant tables with UUID keys, foreign keys, indexes, RLS, membership-aware policies, and server-only credential/webhook access.
- Transactional business creation through `public.create_business_with_setup`.
- Resumable business onboarding for profile, AI agent, approved knowledge, WhatsApp readiness, and setup review.
- Responsive workspace shell and tenant-scoped dashboard metrics sourced from Supabase.

The remaining product modules are intentionally represented as honest foundations until their database workflows, authorization, error states, and tests are implemented.

## Local development

1. Copy `.env.example` to `.env` and set the public Supabase URL and publishable key.
2. Install dependencies with the project's package manager.
3. Start the Vite development server.

Never put `SUPABASE_SECRET_KEY`, OpenAI keys, or WhatsApp tokens in `VITE_*` variables. Configure server-only secrets in Supabase Edge Function secrets.

## Project map

- `src/App.tsx` — routes and providers
- `src/features/auth` — session and workspace context
- `src/layouts` — authenticated SaaS shell
- `src/pages` — route-level experiences
- `src/integrations/supabase` — browser-safe Supabase client
- `src/types` — shared domain types
- `docs` — product, technical, security, and delivery documentation
- `AGENTS.md` — instructions for engineering agents

## Database changes

The connected Supabase project is the source of truth for database changes. Apply SQL through the project database tooling. Do not create or edit manual migration files in this repository.

## Documentation

Start with [`AGENTS.md`](./AGENTS.md), then read [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md), [`docs/DATABASE.md`](./docs/DATABASE.md), and [`docs/ROADMAP.md`](./docs/ROADMAP.md).
