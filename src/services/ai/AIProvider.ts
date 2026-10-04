export interface AgentContext {
  systemRules: string;
  businessInstructions: string;
  approvedKnowledge: Array<{ title: string; content: string }>;
  conversationHistory: Array<{ role: "customer" | "assistant" | "human"; content: string }>;
  customerContext?: { name?: string; location?: string; leadStatus?: string };
}

export interface GeneratedResponse {
  message: string;
  shouldEscalate: boolean;
  escalationReason?: string;
  intent?: string;
  inputTokens?: number;
  outputTokens?: number;
}

export interface AIProvider {
  generateResponse(context: AgentContext): Promise<GeneratedResponse>;
  classifyIntent(context: AgentContext): Promise<{ intent: string; confidence: number }>;
  extractLead(context: AgentContext): Promise<{ intent: string; score: number } | null>;
  detectEscalation(context: AgentContext): Promise<{ shouldEscalate: boolean; reason?: string }>;
}
