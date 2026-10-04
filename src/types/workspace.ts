export type BusinessRole = "owner" | "admin" | "agent" | "viewer";

export interface WorkspaceBusiness {
  id: string;
  name: string;
  category: string | null;
  country: string;
  region: string | null;
  city: string | null;
  description: string | null;
  status: "active" | "suspended" | "archived";
}

export interface WorkspaceMembership {
  businessId: string;
  role: BusinessRole;
  business: WorkspaceBusiness;
}

export interface OnboardingDraft {
  business?: Record<string, string>;
  agent?: {
    name?: string;
    greeting?: string;
    language?: string;
    tone?: string;
    instructions?: string;
  };
  knowledge?: {
    title?: string;
    content?: string;
  };
}

export interface DashboardMetrics {
  totalConversations: number;
  activeConversations: number;
  aiResolvedConversations: number;
  escalatedConversations: number;
  messagesToday: number;
  newConversationsToday: number;
  leadsToday: number;
  ordersToday: number;
  customers: number;
  products: number;
  knowledgeItems: number;
  connectedChannels: number;
  aiMessagesThisPeriod: number;
}
