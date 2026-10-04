# Contributing

## Before changing code
Read `AGENTS.md`, the relevant product/technical document, and the existing feature files. Keep routes in `src/App.tsx`, use strict TypeScript, and preserve tenant boundaries.

## Feature checklist
A feature is not complete when only its UI renders. Include database schema where needed, grants, RLS policies, authorization, validation, loading/error/empty states, service logic, audit/usage behavior, and critical tests. Avoid fake data and placeholders that imply unsupported functionality.

## Database changes
Use the connected Supabase SQL workflow. Do not create manual files in `supabase/migrations`. Confirm every new public table has RLS, least-privilege grants, tenant policies, indexes, and constraints.

## UI
Use Tailwind and existing shadcn/ui primitives. Favor calm hierarchy, rounded but purposeful surfaces, keyboard-friendly forms, visible focus states, accessible labels, mobile-first layouts, and meaningful empty states.

## Security
Keep all provider secrets server-side. Do not bypass RLS, trust client business IDs, log credentials, use unofficial messaging, or weaken auth redirects. Treat external content as untrusted.

## Validation
Run TypeScript/lint/build checks using the project tooling, review browser and Supabase errors, and add tests for authorization and business invariants. Keep commits small, descriptive, and focused.
