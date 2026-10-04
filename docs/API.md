# API and Service Architecture

## Browser boundary
The browser uses Supabase Auth and the publishable-key client for tenant-scoped CRUD permitted by RLS. It may call the onboarding RPC `create_business_with_setup`. It must not access secret credentials, provider APIs, or raw webhook payloads.

## Planned Edge Function endpoints
- `GET /functions/v1/whatsapp-webhook` — Meta webhook verification.
- `POST /functions/v1/whatsapp-webhook` — signature validation, idempotent persistence, and processing.
- `POST /functions/v1/whatsapp-send` — authenticated server-side outbound message request.
- `POST /functions/v1/ai-response` — server-side AI orchestration, validation, and usage tracking.
- `POST /functions/v1/invite-member` — role-checked invitation workflow.
- `POST /functions/v1/billing-webhook` — provider-verified subscription updates.

The exact public URLs use the project ID and function name. Functions include CORS headers, handle `OPTIONS`, explicitly verify authenticated JWTs for privileged calls, and prefix every log statement with the function name.

## Provider-neutral interfaces
Service abstractions normalize external providers:

```ts
interface AIProvider {
  generateResponse(input: AgentContext): Promise<GeneratedResponse>;
  classifyIntent(input: ConversationContext): Promise<IntentResult>;
  extractLead(input: ConversationContext): Promise<LeadExtraction | null>;
  detectEscalation(input: ConversationContext): Promise<EscalationDecision>;
}
```

WhatsApp adapters expose webhook verification, send message, and status normalization. Domain services do not import OpenAI or Meta-specific code.

## Error contract
Return structured categories: validation, authentication, authorization, integration, AI, database, network, and webhook errors. User-facing responses are safe and concise; detailed provider context stays in structured server logs and audit records.

## Idempotency
Webhook event IDs and provider message IDs are unique. A duplicate request returns a successful ignored/duplicate result without creating another message, AI response, lead, or analytics event.
