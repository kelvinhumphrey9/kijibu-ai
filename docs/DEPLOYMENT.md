# Deployment

## Environments
Use separate Supabase projects or isolated environments for development, staging, and production. Register each preview/deployment origin and auth callback path in Supabase URL configuration.

## Frontend
Build the Vite SPA with the public `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` only. Configure SPA fallback routing at the host. Never bake server-only provider credentials into frontend build output.

## Supabase
Deploy Edge Functions through the project deployment pipeline. Store `SUPABASE_URL`, publishable/secret server keys, OpenAI, WhatsApp, and future provider credentials as managed function secrets. Do not edit `config.toml` or commit generated secrets.

## Database
Apply schema changes using connected Supabase database tooling. Verify grants, RLS policies, constraints, indexes, and rollback/backup considerations before enabling a feature. Do not hand-write migration files in this repository.

## Operations
Monitor Auth errors, function errors, webhook failures, AI latency/cost, message volume, database health, and subscription usage. Maintain backups, point-in-time recovery, secret rotation, incident response, and data retention policies before production launch.

## Release checklist
TypeScript/lint pass, auth callbacks tested, RLS cross-tenant tests pass, no client secrets, Edge Function logs inspected, webhook signature/idempotency tests pass, empty/error/loading states reviewed, and deployment callback URLs verified.
