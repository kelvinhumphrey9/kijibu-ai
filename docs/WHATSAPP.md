# WhatsApp Integration

## Provider
Use the official Meta WhatsApp Business Platform / Cloud API only. Unofficial automation is forbidden.

## Flow
Customer -> Meta WhatsApp -> verified Kijibu webhook -> idempotent event record -> account/business resolution -> customer/conversation upsert -> AI or human route -> Cloud API response -> message/status persistence -> analytics/audit.

## Security
Webhook verification tokens and app secrets remain in Edge Function secrets. Verify GET challenge requests and POST signatures. Do not expose access tokens to the SPA. Validate account ownership and tenant membership server-side.

## Idempotency
`whatsapp_webhooks.provider_event_id` and message provider IDs are unique. Persist an event before processing, treat duplicates as successful no-ops, and ensure retries cannot create duplicate customer messages or AI replies.

## Message lifecycle
Normalize text and supported media into `conversation_messages`. Track received, queued, sent, delivered, read, and failed statuses. Preserve provider IDs and safe error metadata. Templates are used when Meta requires them; payment/order status is never inferred from message delivery.

## Current state
The database foundation includes `whatsapp_accounts` and `whatsapp_webhooks` with RLS and browser access revoked for raw events. The actual Meta webhook and outbound Edge Functions are part of the WhatsApp phase and must be tested against retries and signature failures.
