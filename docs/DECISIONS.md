# Architecture Decision Record

## ADR-001: Supabase is the initial platform boundary
Supabase provides Auth, PostgreSQL, RLS, and Edge Functions with one operational boundary suited to the MVP. External providers remain behind functions so they can be replaced later.

## ADR-002: RLS is mandatory authorization
Frontend filters improve query efficiency but are never security. Membership and role policies execute in PostgreSQL for every tenant operation.

## ADR-003: Business creation is transactional
A business without owner membership, settings, progress, agent, and baseline subscription is unusable. `create_business_with_setup` creates the foundation atomically and is callable only by authenticated users.

## ADR-004: Approved knowledge is the AI source of truth
The agent may only use published business knowledge and visible products. No generic fallback facts or fabricated records are allowed.

## ADR-005: Official WhatsApp Cloud API only
The product depends on Meta's supported platform for policy, security, delivery status, and future scale. Unofficial automation is explicitly out of scope.

## ADR-006: Honest deferred modules
Navigation foundations may communicate scope, but they must not present sample records or pretend external integrations exist. Each module becomes real only with database, authorization, service logic, states, and tests.

## ADR-007: Connected database is schema source of truth
This environment applies SQL through connected Supabase tooling. Manual migration files are not created in the repository because an external system generates database artifacts.
