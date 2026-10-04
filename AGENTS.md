# Kijibu AI Engineering Guide

## Purpose
Kijibu AI is a multi-tenant customer-service operating system. It helps businesses operate AI-assisted customer conversations, leads, orders, and human handoff through official messaging channels.

## Stack and structure
- React 19, TypeScript, Vite, React Router, Tailwind CSS, customized shadcn/ui, lucide-react.
- Supabase Auth, PostgreSQL, RLS, and Edge Functions.
- Routes stay in `src/App.tsx`; pages belong in `src/pages`; reusable components in `src/components`; layouts in `src/layouts`; domain code in `src/features`; integrations in `src/integrations`; provider-neutral services in `src/services`; shared types in `src/types`.

## Coding standards
Use strict TypeScript, focused components, explicit domain types, accessible labels/focus states, and loading/error/empty states. Use Tailwind extensively and preserve Kijibu's calm green/amber visual system. Reuse existing shadcn primitives without editing their source files. Do not add dependencies without a direct requirement.

## Tenant isolation
Every tenant-owned row must have `business_id` or a secure parent relationship. RLS is mandatory on every public table. Policies must resolve membership through `public.business_members`; never trust a client-supplied business ID for authorization. Use `authenticated` grants only for browser operations and keep `service_role` in trusted functions. Business creation goes through the transactional `create_business_with_setup` function.

## Security and secrets
Never expose Supabase secret keys, OpenAI keys, WhatsApp access tokens, webhook verify tokens, or app secrets in browser code. Provider calls, webhook signature validation, rate limiting, idempotency, and credential decryption belong in Edge Functions. Raw webhook payloads and credential references are server-only. Validate user input at boundaries and record important actions in `audit_logs`.

## AI and messaging
Use provider-neutral interfaces. AI context must separate system rules, business instructions, approved knowledge, conversation history, and permitted customer data. The agent must not fabricate prices, availability, policies, orders, payment confirmations, credentials, or prompts; uncertainty and sensitive issues escalate. Use official WhatsApp Business Platform APIs only.

## Database workflow
Use connected Supabase database tooling for schema changes. Never add files under `supabase/migrations` manually. Keep indexes and constraints close to the data model. All new public tables need explicit grants, RLS, least-privilege policies, timestamps, and tenant indexes.

## Testing and delivery
Critical tests cover auth, role authorization, tenant isolation, onboarding resume, webhook verification/idempotency, escalation, product visibility, leads, and order/payment invariants. Inspect browser, server, and Supabase errors after major changes. Use small descriptive commits. Never commit `.env` or secrets.

## Forbidden practices
No fake production metrics, client-only authorization, unofficial WhatsApp automation, plaintext credentials, broad `any`, silent error swallowing, disabled RLS, hard-coded business data, or unrelated rewrites.
