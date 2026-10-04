# Security Model

## Identity
Supabase Auth manages password credentials, sessions, email verification, recovery, refresh, and logout. Auth callback and reset routes are implemented with absolute browser-origin redirect URLs.

## Authorization
RLS is the database authorization boundary. Policies check `auth.uid()` through active `business_members` and role-specific helpers. The active business ID in local storage is only a UI preference. Server functions must verify the caller's JWT and tenant membership independently.

## Tenant isolation
All tenant data carries `business_id` or a secure tenant parent. Every new table requires RLS and least-privilege grants. Cross-tenant identifiers supplied by a browser are never trusted. RLS tests must attempt reads, inserts, updates, and deletes against a second business.

## Secrets
Only the public Supabase URL and publishable key are browser-safe. Supabase secret keys, OpenAI keys, WhatsApp access tokens, verify tokens, app secrets, and encryption material are Edge Function secrets. Stored credential references are not browser-readable. Rotate provider credentials and redact secrets from logs.

## Webhooks and external calls
Verify Meta webhook tokens/signatures, validate payloads, enforce event/message idempotency, and rate-limit external entry points. Use official WhatsApp Cloud API endpoints only. Treat customer content as untrusted input and do not allow it to override system or business safety instructions.

## Data handling
Validate input at the boundary, constrain status/payment values in SQL, avoid unnecessary customer data, and apply retention policies to raw payloads and logs. Payment status is changed only by a verified payment integration.

## Audit and incident response
Record role changes, invitations, integration changes, AI configuration changes, knowledge changes, assignments, escalations, orders, and subscription changes in `audit_logs`. Monitor function errors, webhook failures, AI failures, latency, and unusual access patterns. Keep a key rotation and tenant isolation incident runbook before launch.
