# Product Requirements Document

## Problem
Businesses receive important customer questions in chat but lack consistent answers, shared context, lead capture, and a reliable handoff to staff. Generic chatbots invent information and do not fit local business workflows.

## Vision and market
Kijibu AI is a customer-service operating system for businesses in Tanzania and East Africa. It starts with WhatsApp and expands to additional channels while preserving one customer, conversation, knowledge, and analytics model.

## Personas
- SaaS owner: manages businesses, subscriptions, usage, integrations, and health.
- Business owner: configures the business, AI agent, knowledge, products, team, channels, and reporting.
- Staff: works within role permissions to handle conversations and customer operations.
- Customer: communicates with a business through WhatsApp or future channels.

## MVP scope
Authentication, verified sessions, secure onboarding, multi-tenant RLS, dashboard metrics, products, approved knowledge, customer records, conversations/inbox, human escalation, official WhatsApp Cloud API, grounded AI responses, and basic analytics.

## Foundation acceptance criteria
- A user can register/sign in, recover a password, sign out, and return through a secure callback.
- A signed-in user can create one or more businesses; owner membership and baseline records are created atomically.
- Onboarding progress persists in Supabase and resumes after refresh.
- A user cannot query another tenant's rows even if they change a browser-supplied business ID.
- The workspace shell is usable on desktop, tablet, and mobile.
- Dashboard values come from tenant-scoped database queries and empty data renders as zero/empty states.
- Secrets are server-only and no unofficial messaging path is used.

## Business rules
AI may only use approved business knowledge. It must not invent prices, availability, policies, order numbers, payments, or internal prompts. Explicit human requests, uncertainty, complaints, refunds, and unsupported sensitive issues escalate. Paid status requires real provider confirmation.

## Success metrics
Activation rate, completed onboarding, connected WhatsApp accounts, first approved knowledge item, AI resolution rate, human escalation quality, response time, qualified leads, order conversion, retention, and support satisfaction.

## Future scope
Additional channels, richer inbox workflows, RAG/embeddings, appointments, sales agents, payments/mobile money, CRM/e-commerce integrations, enterprise SSO, agencies, and white-label accounts.

## Out of scope for foundation
Fake analytics, invented provider connections, client-side secrets, generic chatbot behavior, unofficial WhatsApp automation, and enterprise billing before core message reliability is proven.
