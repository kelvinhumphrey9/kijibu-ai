# Database Architecture

## Current foundation tables
The connected Supabase project currently contains these public tables: `profiles`, `businesses`, `business_members`, `business_settings`, `onboarding_progress`, `ai_agents`, `ai_agent_configs`, `whatsapp_accounts`, `whatsapp_webhooks`, `customers`, `conversations`, `conversation_messages`, `products`, `knowledge_items`, `leads`, `orders`, `order_items`, `analytics_events`, `notifications`, `subscriptions`, `usage_records`, `audit_logs`, and `api_credentials`.

Conversation assignments, notes, product categories, plan catalog configuration, and richer message/media tables are deliberately deferred to their implementation phases rather than being represented as fake UI.

## Conventions
- UUID primary keys and timezone-aware timestamps.
- Tenant-owned tables include `business_id`; child records also keep a direct tenant key where practical.
- Foreign keys cascade tenant deletion or set nullable references appropriately.
- Check constraints protect role, status, channel, payment, quantity, and onboarding-step values.
- Indexed access includes membership pairs, business/status, business/updated time, message/conversation time, and provider event IDs.

## Onboarding transaction
`public.create_business_with_setup(...)` is a `SECURITY DEFINER` function with an empty search path. It requires `auth.uid()`, validates the business name, inserts the business and owner membership, creates settings/progress/agent/config/subscription records, and returns the business UUID. Execution is revoked from `PUBLIC` and granted only to `authenticated`.

## RLS model
RLS is enabled on every public table. `public.is_business_member` and `public.has_business_role` are stable, search-path-hardened security-definer helpers. Member policies are read-only where appropriate; owner/admin policies protect settings, AI config, products, knowledge, channels, and team changes. Agent policies permit conversation and order operations. Browser access to `api_credentials` and raw `whatsapp_webhooks` is revoked. Anonymous access is revoked from all public application tables.

## Dashboard data
Dashboard counts are direct tenant-scoped Supabase queries over conversations, messages, leads, orders, customers, products, published knowledge, connected WhatsApp accounts, and current-period usage. No production metrics are seeded or hard-coded.

## Schema workflow
The connected Supabase database is the source of truth. Apply database changes through the connected SQL tooling; do not create or modify manual migration files in this repository. Every new table must include grants, RLS, explicit policies, tenant indexes, and constraints before browser access is added.
