# Kijibu AI Architecture

## Product boundary
The SPA handles authenticated business operations and presentation. Supabase PostgreSQL is the tenant data boundary. Supabase Edge Functions are the trusted server boundary for secrets, WhatsApp webhooks, AI providers, asynchronous processing, rate limits, and external APIs.

## Frontend
`src/App.tsx` owns routing. `AuthProvider` restores the Supabase session and loads active `business_members`. `ProtectedRoute` blocks unauthenticated access and requires an active business for workspace pages. `AppShell` provides responsive navigation and tenant switching. Pages query tenant-scoped data through the browser-safe Supabase client; RLS remains the authorization boundary.

## Authentication and onboarding
Supabase Auth handles email/password, verification callbacks, sessions, logout, and password recovery. A signed-in user may create a business only through the transactional `create_business_with_setup` function. That function creates the owner membership, settings, onboarding progress, initial AI agent/config, and free subscription atomically. Onboarding progress stores `current_step`, `completed_steps`, `draft_data`, and `completed_at` so the flow resumes after interruption.

## Multi-tenancy
A user can belong to multiple businesses. Active business selection is a convenience stored locally; it is not authorization. Every data query is filtered by the selected business for efficiency, while RLS policies verify active membership or role. Direct child tables carry `business_id` for defense in depth and indexed access.

## Domain architecture
Future domain features belong in focused modules: conversations/inbox, customers, leads, products, knowledge, orders, analytics, team, settings, and integrations. Provider-neutral services should sit between pages and external providers. Channel adapters should normalize messages into a channel-neutral conversation model.

## AI architecture
An `AIProvider` abstraction will accept separated system rules, business instructions, approved published knowledge, permitted customer context, and recent conversation history. It returns a validated response, intent, escalation decision, and usage metadata. OpenAI is an initial provider implemented behind an Edge Function; browser code never calls it.

## WhatsApp architecture
Meta webhook verification and signature checks happen in an Edge Function. An event ID is persisted in `whatsapp_webhooks` before processing. A unique provider event constraint makes retries idempotent. Processing resolves the account and tenant, upserts a customer/conversation, stores the inbound message, routes to AI or human handling, sends through the official Cloud API, persists the outbound message/status, and records usage/audit events.

## Observability and resilience
Structured Edge Function logs use a function-name prefix. Product-level history uses `audit_logs`, `usage_records`, and webhook records. Failed outbound messages and AI failures become visible error states and retry candidates; errors are never silently swallowed. Long-running webhook work should move to a queue or asynchronous function boundary.

## Extensibility
Messaging channels implement a channel adapter. AI vendors implement `AIProvider`. Billing providers implement subscription adapters. This keeps WhatsApp, OpenAI, and future Instagram, Messenger, Telegram, SMS, web chat, and local payment integrations out of core business models.
