import { useEffect, useState } from "react";
import { ArrowUpRight, BarChart3, BookOpen, Boxes, CheckCircle2, Clock3, Headphones, Loader2, MessageSquare, MoreHorizontal, Package, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import type { DashboardMetrics } from "@/types/workspace";
import { cn } from "@/lib/utils";

const emptyMetrics: DashboardMetrics = { totalConversations: 0, activeConversations: 0, aiResolvedConversations: 0, escalatedConversations: 0, messagesToday: 0, newConversationsToday: 0, leadsToday: 0, ordersToday: 0, customers: 0, products: 0, knowledgeItems: 0, connectedChannels: 0, aiMessagesThisPeriod: 0 };

export default function Dashboard() {
  const { activeBusiness, workspaceError } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>(emptyMetrics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(workspaceError);

  useEffect(() => {
    if (!activeBusiness) return;
    let mounted = true;
    const loadMetrics = async () => {
      setLoading(true); setError(null);
      const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);
      const today = startOfToday.toISOString();
      const monthStart = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1).toISOString().slice(0, 10);
      try {
        const [conversations, activeConversations, aiResolved, escalated, messagesToday, newConversations, leadsToday, ordersToday, customers, products, knowledgeItems, channels, usage] = await Promise.all([
          supabase.from("conversations").select("id", { count: "exact", head: true }).eq("business_id", activeBusiness.id),
          supabase.from("conversations").select("id", { count: "exact", head: true }).eq("business_id", activeBusiness.id).in("status", ["open", "ai_handling", "waiting_for_business", "human_assigned"]),
          supabase.from("conversations").select("id", { count: "exact", head: true }).eq("business_id", activeBusiness.id).eq("status", "resolved").eq("ai_status", "active"),
          supabase.from("conversations").select("id", { count: "exact", head: true }).eq("business_id", activeBusiness.id).eq("ai_status", "escalated"),
          supabase.from("conversation_messages").select("id", { count: "exact", head: true }).eq("business_id", activeBusiness.id).gte("created_at", today),
          supabase.from("conversations").select("id", { count: "exact", head: true }).eq("business_id", activeBusiness.id).gte("created_at", today),
          supabase.from("leads").select("id", { count: "exact", head: true }).eq("business_id", activeBusiness.id).gte("created_at", today),
          supabase.from("orders").select("id", { count: "exact", head: true }).eq("business_id", activeBusiness.id).gte("created_at", today),
          supabase.from("customers").select("id", { count: "exact", head: true }).eq("business_id", activeBusiness.id),
          supabase.from("products").select("id", { count: "exact", head: true }).eq("business_id", activeBusiness.id).eq("active", true),
          supabase.from("knowledge_items").select("id", { count: "exact", head: true }).eq("business_id", activeBusiness.id).eq("status", "published"),
          supabase.from("whatsapp_accounts").select("id", { count: "exact", head: true }).eq("business_id", activeBusiness.id).eq("status", "connected"),
          supabase.from("usage_records").select("ai_messages").eq("business_id", activeBusiness.id).gte("period_end", monthStart),
        ]);
        const result = [conversations, activeConversations, aiResolved, escalated, messagesToday, newConversations, leadsToday, ordersToday, customers, products, knowledgeItems, channels, usage];
        const failed = result.find((response) => response.error);
        if (failed?.error) throw failed.error;
        const usageMessages = (usage.data ?? []).reduce((sum, row) => sum + (row.ai_messages ?? 0), 0);
        if (mounted) setMetrics({ totalConversations: conversations.count ?? 0, activeConversations: activeConversations.count ?? 0, aiResolvedConversations: aiResolved.count ?? 0, escalatedConversations: escalated.count ?? 0, messagesToday: messagesToday.count ?? 0, newConversationsToday: newConversations.count ?? 0, leadsToday: leadsToday.count ?? 0, ordersToday: ordersToday.count ?? 0, customers: customers.count ?? 0, products: products.count ?? 0, knowledgeItems: knowledgeItems.count ?? 0, connectedChannels: channels.count ?? 0, aiMessagesThisPeriod: usageMessages });
      } catch (loadError) { if (mounted) setError(loadError instanceof Error ? loadError.message : "We could not load workspace metrics."); }
      finally { if (mounted) setLoading(false); }
    };
    void loadMetrics();
    return () => { mounted = false; };
  }, [activeBusiness]);

  if (!activeBusiness) return null;

  const serviceStats = [
    { label: "Total conversations", value: metrics.totalConversations, icon: MessageSquare, tone: "green" },
    { label: "Active conversations", value: metrics.activeConversations, icon: Headphones, tone: "blue" },
    { label: "AI resolved", value: metrics.aiResolvedConversations, icon: CheckCircle2, tone: "amber" },
    { label: "Human escalations", value: metrics.escalatedConversations, icon: Clock3, tone: "rose" },
  ];
  const todayStats = [
    { label: "Messages", value: metrics.messagesToday, icon: MessageSquare },
    { label: "New conversations", value: metrics.newConversationsToday, icon: Zap },
    { label: "New leads", value: metrics.leadsToday, icon: Users },
    { label: "Orders", value: metrics.ordersToday, icon: Package },
  ];

  return <div className="space-y-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0e6b53]">Overview</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#16352b] md:text-4xl">Good to see you, {activeBusiness.name}.</h1><p className="mt-2 text-sm text-[#718078]">Here is what is happening across your customer service workspace.</p></div><Button variant="outline" className="w-fit gap-2 rounded-xl border-[#d8e5dd] bg-white text-[#315044] hover:bg-[#f5faf7]"><BarChart3 className="h-4 w-4" />View analytics<ArrowUpRight className="h-3.5 w-3.5" /></Button></div>{error && <div className="rounded-2xl border border-[#f2c9c4] bg-[#fff4f2] px-4 py-3 text-sm text-[#a54d45]" role="alert">We could not load live metrics: {error}</div>}<section><div className="mb-4 flex items-center justify-between"><div><h2 className="text-base font-semibold text-[#264639]">Customer service</h2><p className="mt-1 text-xs text-[#83918a]">Live totals from your workspace</p></div><span className="flex items-center gap-1.5 text-xs font-semibold text-[#5e7569]"><span className="h-1.5 w-1.5 rounded-full bg-[#2eaa70]" />Live data</span></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{serviceStats.map((stat) => <MetricCard key={stat.label} {...stat} loading={loading} />)}</div></section><section><div className="mb-4"><h2 className="text-base font-semibold text-[#264639]">Today</h2><p className="mt-1 text-xs text-[#83918a]">Activity since the start of the day</p></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{todayStats.map((stat) => <div key={stat.label} className="flex items-center justify-between rounded-2xl border border-[#dfe9e3] bg-white px-4 py-4"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f0f6f2] text-[#0e6b53]"><stat.icon className="h-4 w-4" /></span><span className="text-sm font-medium text-[#62736b]">{stat.label}</span></div><span className="text-xl font-semibold tracking-[-0.03em] text-[#254639]">{loading ? "—" : stat.value}</span></div>)}</div></section><div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"><section className="rounded-3xl border border-[#dfe9e3] bg-white p-5 sm:p-6"><div className="flex items-start justify-between"><div><h2 className="text-base font-semibold text-[#264639]">Workspace readiness</h2><p className="mt-1 text-sm text-[#83918a]">The foundations that power useful AI responses.</p></div><MoreHorizontal className="h-5 w-5 text-[#a0aca6]" /></div><div className="mt-6 space-y-4"><ReadinessRow label="Business profile" detail={activeBusiness.description ? "Profile completed" : "Add a description in settings"} complete={Boolean(activeBusiness.name)} /><ReadinessRow label="Approved knowledge" detail={metrics.knowledgeItems ? `${metrics.knowledgeItems} published item${metrics.knowledgeItems === 1 ? "" : "s"}` : "Add FAQs, policies, and product answers"} complete={metrics.knowledgeItems > 0} /><ReadinessRow label="WhatsApp channel" detail={metrics.connectedChannels ? `${metrics.connectedChannels} connected channel${metrics.connectedChannels === 1 ? "" : "s"}` : "Connect via the official Meta Cloud API"} complete={metrics.connectedChannels > 0} /></div></section><section className="rounded-3xl bg-[#0e6b53] p-6 text-white"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15"><Zap className="h-5 w-5 text-[#f0b66e]" /></div><h2 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">Make every answer count.</h2><p className="mt-3 text-sm leading-6 text-[#c5e6d7]">Kijibu only uses knowledge your team approves. Add your first answer, then build a reliable service layer around it.</p><Button className="mt-6 rounded-xl bg-[#f0b66e] font-semibold text-[#3d2b16] hover:bg-[#e6a458]" onClick={() => window.location.assign("/knowledge")}>Open knowledge base<ArrowUpRight className="ml-2 h-4 w-4" /></Button></section></div><section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><MiniStat icon={Users} label="Customers" value={metrics.customers} /><MiniStat icon={Boxes} label="Active products" value={metrics.products} /><MiniStat icon={BookOpen} label="Published knowledge" value={metrics.knowledgeItems} /><MiniStat icon={Zap} label="AI messages this period" value={metrics.aiMessagesThisPeriod} /></section></div>;
}

function MetricCard({ label, value, icon: Icon, tone, loading }: { label: string; value: number; icon: typeof MessageSquare; tone: string; loading: boolean }) { const toneClasses: Record<string, string> = { green: "bg-[#e3f1eb] text-[#0e6b53]", blue: "bg-[#e8f0f8] text-[#3b6f9d]", amber: "bg-[#fff2df] text-[#b06e22]", rose: "bg-[#fce9e7] text-[#b4574d]" }; return <div className="rounded-2xl border border-[#dfe9e3] bg-white p-5"><div className="flex items-start justify-between"><span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", toneClasses[tone])}><Icon className="h-[18px] w-[18px]" /></span><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#a2aea8]">Live</span></div><p className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#234337]">{loading ? <Loader2 className="h-7 w-7 animate-spin text-[#b6c2bc]" /> : value}</p><p className="mt-1 text-sm text-[#718078]">{label}</p></div>; }
function ReadinessRow({ label, detail, complete }: { label: string; detail: string; complete: boolean }) { return <div className="flex items-center gap-3"><span className={cn("flex h-8 w-8 items-center justify-center rounded-full", complete ? "bg-[#e0f3e8] text-[#15915b]" : "bg-[#f0f3f1] text-[#94a49c]")}><CheckCircle2 className="h-4 w-4" /></span><div><p className="text-sm font-semibold text-[#315044]">{label}</p><p className="text-xs text-[#83918a]">{detail}</p></div></div>; }
function MiniStat({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) { return <div className="rounded-2xl border border-[#dfe9e3] bg-white px-4 py-4"><div className="flex items-center gap-2 text-[#83918a]"><Icon className="h-4 w-4" /><span className="text-xs font-medium">{label}</span></div><p className="mt-2 text-xl font-semibold text-[#315044]">{value}</p></div>; }
