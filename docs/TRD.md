# Technical Requirements Document

## Stack
React, TypeScript strict mode, Vite, React Router, Tailwind CSS, customized shadcn/ui, Supabase Auth, PostgreSQL, RLS, and Supabase Edge Functions. External providers are accessed only behind server-side adapters.

## Frontend requirements
Routes remain in `src/App.tsx`. The app must provide protected routing, session restoration, tenant selection, responsive layouts, accessible forms, loading/error/empty states, and server-side pagination for large collections. The public client uses only the Supabase URL and publishable key.

## Data requirements
Use UUIDs, foreign keys, timezone-aware timestamps, check constraints, tenant indexes, least-privilege grants, and RLS on every public table. Tenant access is based on active membership and role helpers, not browser filtering. Sensitive provider references and webhook payloads are not browser-readable.

## API and provider requirements
Edge Functions own WhatsApp verification/signatures, outbound messaging, AI calls, secret access, rate limiting, structured logs, and asynchronous processing. Service interfaces remain provider-neutral: `WhatsAppService`, `AIProvider`, `CustomerService`, `ConversationService`, `LeadService`, `OrderService`, `KnowledgeService`, `AnalyticsService`, and `NotificationService`.

## AI requirements
The provider receives system safety rules, business instructions, approved published knowledge, recent conversation history, and permitted customer context as separate inputs. Responses require output validation, escalation detection, usage accounting, and no unsupported claims.

## Webhook requirements
Verify the request, resolve the account, persist the provider event ID with a unique constraint, ignore duplicates, process inbound messages, update the conversation, and persist every outbound attempt and status. Retry-safe transitions must not duplicate messages or AI replies.

## Security requirements
Use Auth, RLS, role checks, input validation, signature verification, rate limiting architecture, audit logs, encrypted/managed secrets, and least privilege. Never expose secret keys or bypass RLS.

## Performance and recovery
Use indexed counts, pagination, debounced search, lazy route modules where useful, and bounded conversation history. Functions should emit structured logs and be retry-safe. Backups, point-in-time recovery, key rotation, and incident runbooks must be configured before production launch.

## Quality gates
TypeScript, lint, unit tests for domain invariants, RLS/tenant integration tests, webhook idempotency tests, auth callback tests, and end-to-end onboarding/inbox tests are required before production claims.
