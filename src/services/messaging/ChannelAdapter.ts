export type ChannelName = "whatsapp" | "sms" | "instagram" | "messenger" | "telegram" | "webchat";

export interface InboundMessage {
  providerEventId: string;
  providerMessageId?: string;
  channel: ChannelName;
  senderAddress: string;
  senderName?: string;
  text?: string;
  receivedAt: string;
}

export interface OutboundMessage {
  recipientAddress: string;
  text: string;
  conversationId: string;
}

export interface ChannelAdapter {
  verifyWebhook(input: { mode?: string; token?: string; challenge?: string }): string | null;
  sendMessage(message: OutboundMessage): Promise<{ providerMessageId: string; status: "queued" | "sent" | "failed" }>;
  normalizeInbound(payload: unknown): InboundMessage[];
}
