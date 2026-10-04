# Roadmap

## Complete foundation work
- Project architecture and engineering documentation.
- Supabase client and public/server environment boundary.
- Auth UI, session context, callbacks, recovery, logout, protected routes.
- Initial tenant schema, RLS, least-privilege grants, role helpers, transactional business creation.
- Resumable onboarding for business, AI agent, knowledge, WhatsApp readiness, and review.
- Responsive shell and live tenant-scoped dashboard counts.

## Phase 2 — Multi-tenancy hardening
Add membership invitations, role change workflows, suspension behavior, stricter owner/admin policies, and cross-tenant automated tests.

## Phase 3 — Dashboard and operations
Replace module foundations with paginated customer, product, knowledge, analytics, and settings workflows. Add shared loading, empty, and error patterns.

## Phase 4 — CRM and knowledge
Products/services, categories, knowledge CRUD, publication review, customers, tags, and lead workflows.

## Phase 5 — Conversations and handoff
Inbox layout, messages, assignments, notes, unread state, human takeover, escalation notifications, and audit events.

## Phase 6 — WhatsApp
Meta verification/signatures, account connection, inbound/outbound messages, media where supported, statuses, retry-safe webhooks, and usage tracking.

## Phase 7 — AI
OpenAI Edge Function provider, grounded context builder, intent/lead extraction, escalation, output validation, token/cost tracking, and evaluations.

## Phase 8 — Orders and analytics
Order lifecycle, real payment adapters, date-filtered metrics, revenue sourced from completed/verified orders, and usage dashboards.

## Phase 9 — Production readiness
RLS/security audit, rate limits, observability, performance, backups, deployment, incident response, and comprehensive unit/integration/E2E coverage.

## Future
Instagram, Messenger, Telegram, SMS, web chat, voice, CRM/e-commerce integrations, Tanzanian mobile money, advanced RAG, multi-provider AI, SSO, agencies, and white-label accounts.
