# Testing Strategy

## Foundation tests
- Auth callback routing, email verification, password recovery, session restoration, and logout.
- Protected routes with no session and with no business.
- Transactional business creation and onboarding resume after refresh.
- Role policy matrix for owner, admin, agent, and viewer.
- Cross-tenant SELECT/INSERT/UPDATE/DELETE attempts through Supabase RLS.
- Dashboard zero-state and database error rendering.

## Product tests
- Product visibility and AI-visible filtering.
- Knowledge publication and exclusion of draft/archived content.
- Customer/conversation creation and message ordering.
- Human escalation stopping automatic AI responses.
- Lead extraction and order/payment invariants.
- Notification targeting and audit events.

## Integration tests
- WhatsApp challenge/signature verification.
- Duplicate provider event and message handling.
- Outbound send retry/status transitions.
- AI output validation, prompt-injection resistance, and escalation decisions.
- Provider and database error classification.

## End-to-end
A browser flow should cover sign-up, callback, business creation, onboarding resume, dashboard metrics, and sign-out. Later flows cover connected WhatsApp inbound message, grounded AI response, escalation, staff reply, lead, and order.

## Quality gates
Strict TypeScript, lint, automated tests, RLS checks, inspected browser/server/Supabase logs, and no unhandled console errors. Test fixtures must be isolated and clearly development-only; never seed fake production analytics.
