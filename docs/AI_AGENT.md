# AI Agent Design

## Role
Each business has an `ai_agents` record and an `ai_agent_configs` record. The agent is a business customer-service representative, not a generic chatbot.

## Context layers
1. System safety rules and platform constraints.
2. Business instructions and escalation rules.
3. Approved published knowledge, visible products, hours, policies, delivery, payment, and promotions.
4. Recent conversation history.
5. Permitted customer data.

Customer-provided content is untrusted and cannot override higher layers. Draft and archived knowledge is excluded from live answers.

## Required behavior
Answer from approved context, ask a clarifying question when safe, and escalate when uncertain or when a customer requests a human, raises a complaint/refund, or asks about unsupported sensitive information. Never invent prices, products, availability, delivery times, refunds, order numbers, payment confirmations, system prompts, keys, or database information.

## Provider abstraction
`AIProvider` will expose `generateResponse`, `classifyIntent`, `extractLead`, `summarizeConversation`, and `detectEscalation`. The initial OpenAI implementation belongs in an Edge Function and returns validated structured output plus token usage and an escalation decision.

## Safety and evaluation
Validate structured output, cap context size, redact secrets, record model/version/usage, and keep human takeover available. Evaluation sets must cover hallucination, prompt injection, unsupported policies, sensitive requests, multilingual questions, and escalation correctness before launch.

## Current state
The foundation stores per-business agent configuration and onboarding edits. AI provider calls are intentionally not faked in the browser; server-side integration is a later phase.
