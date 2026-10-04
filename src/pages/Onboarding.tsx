import { FormEvent, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Check, ChevronLeft, ChevronRight, CircleCheck, FileText, MessageCircle, PencilLine, Sparkles, Store, TestTube2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/features/auth/AuthContext";
import type { OnboardingDraft } from "@/types/workspace";
import { cn } from "@/lib/utils";

const steps = [
  { id: 2, title: "Business", description: "Tell us about your business", icon: Store },
  { id: 3, title: "AI agent", description: "Shape how it speaks", icon: Sparkles },
  { id: 4, title: "Knowledge", description: "Add an approved answer", icon: FileText },
  { id: 5, title: "WhatsApp", description: "Prepare your channel", icon: MessageCircle },
  { id: 6, title: "Test", description: "Review your setup", icon: TestTube2 },
];

const initialBusiness = { name: "", category: "", country: "Tanzania", region: "", city: "", phone: "", email: "", website: "", address: "", description: "" };
const initialAgent = { name: "Kijibu Assistant", greeting: "Hello! How can I help you today?", language: "English", tone: "Warm and professional", instructions: "" };
const initialKnowledge = { title: "", content: "" };

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, activeBusiness, setActiveBusinessId, refreshWorkspace } = useAuth();
  const [step, setStep] = useState(2);
  const [business, setBusiness] = useState(initialBusiness);
  const [agent, setAgent] = useState(initialAgent);
  const [knowledge, setKnowledge] = useState(initialKnowledge);
  const [completed, setCompleted] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentIndex = Math.max(0, steps.findIndex((item) => item.id === step));
  const progress = useMemo(() => Math.round(((currentIndex + 1) / steps.length) * 100), [currentIndex]);

  useEffect(() => {
    if (!activeBusiness) {
      setHydrating(false);
      return;
    }
    let mounted = true;
    const loadProgress = async () => {
      const [{ data: progressRow }, { data: agentRow }] = await Promise.all([
        supabase.from("onboarding_progress").select("current_step, completed_steps, draft_data, completed_at").eq("business_id", activeBusiness.id).maybeSingle(),
        supabase.from("ai_agents").select("id, name, ai_agent_configs(greeting, language, tone, instructions)").eq("business_id", activeBusiness.id).maybeSingle(),
      ]);
      if (!mounted) return;
      if (progressRow?.completed_at) {
        navigate("/dashboard", { replace: true });
        return;
      }
      const draft = (progressRow?.draft_data ?? {}) as OnboardingDraft;
      setBusiness((value) => ({ ...value, ...(draft.business ?? {}), name: activeBusiness.name, category: activeBusiness.category ?? value.category, country: activeBusiness.country, region: activeBusiness.region ?? value.region, city: activeBusiness.city ?? value.city, description: activeBusiness.description ?? value.description }));
      setCompleted(Array.isArray(progressRow?.completed_steps) ? progressRow.completed_steps as number[] : []);
      setStep(Math.min(6, Math.max(2, progressRow?.current_step ?? 3)));
      if (agentRow) {
        const config = Array.isArray(agentRow.ai_agent_configs) ? agentRow.ai_agent_configs[0] : agentRow.ai_agent_configs;
        setAgent((value) => ({ ...value, name: agentRow.name ?? value.name, greeting: config?.greeting ?? value.greeting, language: config?.language ?? value.language, tone: config?.tone ?? value.tone, instructions: config?.instructions ?? value.instructions }));
      }
      setHydrating(false);
    };
    void loadProgress();
    return () => { mounted = false; };
  }, [activeBusiness, navigate]);

  const saveProgress = async (nextStep: number, nextCompleted: number[], draftData: OnboardingDraft) => {
    if (!activeBusiness) return;
    const { error: saveError } = await supabase.from("onboarding_progress").upsert({ business_id: activeBusiness.id, current_step: nextStep, completed_steps: nextCompleted, draft_data: draftData, updated_at: new Date().toISOString() });
    if (saveError) throw saveError;
  };

  const handleBusiness = async (event: FormEvent) => {
    event.preventDefault();
    if (!business.name.trim()) return setError("Add your business name to continue.");
    setLoading(true); setError(null);
    try {
      if (!activeBusiness) {
        const { data, error: createError } = await supabase.rpc("create_business_with_setup", { p_name: business.name, p_category: business.category, p_country: business.country, p_region: business.region, p_city: business.city, p_phone: business.phone, p_email: business.email, p_website: business.website, p_address: business.address, p_description: business.description });
        if (createError) throw createError;
        const businessId = String(data);
        setActiveBusinessId(businessId);
        await refreshWorkspace();
      } else {
        const { error: updateError } = await supabase.from("businesses").update({ name: business.name, category: business.category || null, country: business.country, region: business.region || null, city: business.city || null, phone: business.phone || null, email: business.email || null, website: business.website || null, address: business.address || null, description: business.description || null }).eq("id", activeBusiness.id);
        if (updateError) throw updateError;
        await saveProgress(3, Array.from(new Set([...completed, 2])), { business, agent, knowledge });
      }
      setCompleted((value) => Array.from(new Set([...value, 2]))); setStep(3);
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "We could not save your business yet."); }
    finally { setLoading(false); }
  };

  const handleAgent = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeBusiness) return;
    setLoading(true); setError(null);
    try {
      const { data: agentRow, error: agentError } = await supabase.from("ai_agents").select("id").eq("business_id", activeBusiness.id).single();
      if (agentError) throw agentError;
      const { error: updateAgentError } = await supabase.from("ai_agents").update({ name: agent.name, updated_at: new Date().toISOString() }).eq("id", agentRow.id);
      if (updateAgentError) throw updateAgentError;
      const { error: updateConfigError } = await supabase.from("ai_agent_configs").update({ greeting: agent.greeting, language: agent.language, tone: agent.tone, instructions: agent.instructions || null, business_description: business.description || null, updated_at: new Date().toISOString() }).eq("agent_id", agentRow.id);
      if (updateConfigError) throw updateConfigError;
      const nextCompleted = Array.from(new Set([...completed, 3]));
      await saveProgress(4, nextCompleted, { business, agent, knowledge });
      setCompleted(nextCompleted); setStep(4);
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "We could not save the agent settings yet."); }
    finally { setLoading(false); }
  };

  const handleKnowledge = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeBusiness || !user) return;
    setLoading(true); setError(null);
    try {
      if (knowledge.title.trim() && knowledge.content.trim()) {
        const { error: knowledgeError } = await supabase.from("knowledge_items").insert({ business_id: activeBusiness.id, title: knowledge.title.trim(), content: knowledge.content.trim(), category: "business_information", status: "published", created_by: user.id, updated_by: user.id });
        if (knowledgeError) throw knowledgeError;
      }
      const nextCompleted = Array.from(new Set([...completed, 4]));
      await saveProgress(5, nextCompleted, { business, agent, knowledge });
      setCompleted(nextCompleted); setStep(5);
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "We could not save that knowledge item yet."); }
    finally { setLoading(false); }
  };

  const advanceSimpleStep = async (nextStep: number, completeStep: number) => {
    if (!activeBusiness) return;
    setLoading(true); setError(null);
    try {
      const nextCompleted = Array.from(new Set([...completed, completeStep]));
      await saveProgress(nextStep, nextCompleted, { business, agent, knowledge });
      setCompleted(nextCompleted); setStep(nextStep);
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "We could not save your progress yet."); }
    finally { setLoading(false); }
  };

  const finish = async () => {
    if (!activeBusiness) return;
    setLoading(true); setError(null);
    try {
      const nextCompleted = Array.from(new Set([...completed, 5, 6, 7]));
      const { error: finishError } = await supabase.from("onboarding_progress").update({ current_step: 7, completed_steps: nextCompleted, completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("business_id", activeBusiness.id);
      if (finishError) throw finishError;
      navigate("/dashboard", { replace: true });
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : "We could not complete onboarding yet."); }
    finally { setLoading(false); }
  };

  if (hydrating) return <div className="flex min-h-screen items-center justify-center bg-[#f6f8f7] text-sm font-semibold text-[#0e6b53]">Loading your setup…</div>;

  return <main className="min-h-screen bg-[#f6f8f7] px-4 py-6 text-[#16352b] sm:px-8 sm:py-10"><div className="mx-auto max-w-6xl"><header className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0e6b53] text-lg font-bold text-white">K</span><span className="text-xl font-bold tracking-[-0.04em]">kijibu<span className="text-[#d78b35]">.</span></span></div><span className="text-sm font-medium text-[#7a8a82]">Workspace setup · {progress}%</span></header><div className="mt-10 grid gap-8 lg:grid-cols-[250px_1fr] lg:gap-14"><aside><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0e6b53]">Get started</p><h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.05em]">Set up your customer service workspace.</h1><p className="mt-3 text-sm leading-6 text-[#718078]">A few thoughtful details help Kijibu give your team and customers better answers.</p><div className="mt-9 space-y-2">{steps.map((item, index) => { const Icon = item.icon; const active = item.id === step; const done = completed.includes(item.id); return <div key={item.id} className={cn("flex gap-3 rounded-2xl p-3", active && "bg-white shadow-sm") }><span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", done ? "bg-[#dff2e8] text-[#0e6b53]" : active ? "bg-[#0e6b53] text-white" : "bg-[#e9efeb] text-[#8b9b93]")}>{done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}</span><div><p className={cn("text-sm font-semibold", active ? "text-[#16352b]" : "text-[#708078]")}>{index + 1}. {item.title}</p><p className="mt-0.5 text-xs text-[#96a49e]">{item.description}</p></div></div>; })}</div></aside><section className="rounded-[28px] border border-[#dfe9e3] bg-white p-5 shadow-[0_20px_60px_rgba(33,74,57,0.06)] sm:p-8"><div className="mb-8 h-1.5 overflow-hidden rounded-full bg-[#edf2ef]"><div className="h-full rounded-full bg-[#0e6b53] transition-all" style={{ width: `${progress}%` }} /></div>{error && <div className="mb-6 rounded-2xl border border-[#f2c9c4] bg-[#fff4f2] px-4 py-3 text-sm text-[#a54d45]" role="alert">{error}</div>}{step === 2 && <form onSubmit={handleBusiness}><StepHeader icon={<Store />} eyebrow="Step 1 of 5" title="Tell us about your business" description="This information shapes your workspace and the context your AI agent uses." /><div className="mt-8 grid gap-5 sm:grid-cols-2"><Field label="Business name" id="business-name" value={business.name} onChange={(value) => setBusiness({ ...business, name: value })} required /><Field label="Category" id="category" value={business.category} onChange={(value) => setBusiness({ ...business, category: value })} placeholder="e.g. Retail, hospitality, services" /><Field label="Country" id="country" value={business.country} onChange={(value) => setBusiness({ ...business, country: value })} /><Field label="Region" id="region" value={business.region} onChange={(value) => setBusiness({ ...business, region: value })} placeholder="e.g. Dar es Salaam" /><Field label="City" id="city" value={business.city} onChange={(value) => setBusiness({ ...business, city: value })} /><Field label="Business phone" id="phone" value={business.phone} onChange={(value) => setBusiness({ ...business, phone: value })} /><Field label="Business email" id="email" type="email" value={business.email} onChange={(value) => setBusiness({ ...business, email: value })} /><Field label="Website" id="website" value={business.website} onChange={(value) => setBusiness({ ...business, website: value })} /><div className="sm:col-span-2"><Field label="Address" id="address" value={business.address} onChange={(value) => setBusiness({ ...business, address: value })} /></div><div className="sm:col-span-2 space-y-2"><Label htmlFor="description">Short business description</Label><Textarea id="description" value={business.description} onChange={(event) => setBusiness({ ...business, description: event.target.value })} placeholder="What do you sell or help customers with?" className="min-h-24 rounded-xl border-[#dfe9e3]" /></div></div><Footer loading={loading} /></form>}{step === 3 && <form onSubmit={handleAgent}><StepHeader icon={<Sparkles />} eyebrow="Step 2 of 5" title="Shape your AI agent" description="Give your assistant a clear voice and boundaries. You can refine this later." /><div className="mt-8 space-y-5"><Field label="Agent name" id="agent-name" value={agent.name} onChange={(value) => setAgent({ ...agent, name: value })} required /><div className="space-y-2"><Label htmlFor="greeting">Opening greeting</Label><Textarea id="greeting" value={agent.greeting} onChange={(event) => setAgent({ ...agent, greeting: event.target.value })} className="min-h-24 rounded-xl border-[#dfe9e3]" /></div><div className="grid gap-5 sm:grid-cols-2"><Field label="Language" id="language" value={agent.language} onChange={(value) => setAgent({ ...agent, language: value })} /><Field label="Tone" id="tone" value={agent.tone} onChange={(value) => setAgent({ ...agent, tone: value })} /></div><div className="space-y-2"><Label htmlFor="instructions">Business-specific instructions <span className="font-normal text-[#9aa8a1]">(optional)</span></Label><Textarea id="instructions" value={agent.instructions} onChange={(event) => setAgent({ ...agent, instructions: event.target.value })} placeholder="For example: always offer human help for refund requests." className="min-h-28 rounded-xl border-[#dfe9e3]" /></div></div><Footer loading={loading} back={() => setStep(2)} /></form>}{step === 4 && <form onSubmit={handleKnowledge}><StepHeader icon={<FileText />} eyebrow="Step 3 of 5" title="Add your first approved answer" description="Start with something customers ask often. Only published knowledge is available to the AI." /><div className="mt-8 space-y-5"><Field label="Title" id="knowledge-title" value={knowledge.title} onChange={(value) => setKnowledge({ ...knowledge, title: value })} placeholder="e.g. Opening hours" /><div className="space-y-2"><Label htmlFor="knowledge-content">Answer</Label><Textarea id="knowledge-content" value={knowledge.content} onChange={(event) => setKnowledge({ ...knowledge, content: event.target.value })} placeholder="Write the exact, approved answer your team wants customers to receive." className="min-h-48 rounded-xl border-[#dfe9e3]" /></div><p className="rounded-xl bg-[#f5faf7] px-4 py-3 text-xs leading-5 text-[#61756b]">You can skip this for now, but the AI will not answer questions until approved knowledge is available.</p></div><Footer loading={loading} back={() => setStep(3)} /></form>}{step === 5 && <div><StepHeader icon={<MessageCircle />} eyebrow="Step 4 of 5" title="Prepare your WhatsApp channel" description="Kijibu uses Meta's official WhatsApp Business Platform. Credentials stay server-side and are never sent to the browser." /><div className="mt-8 rounded-2xl border border-[#dfe9e3] bg-[#f8fbf9] p-5"><div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dff2e8] text-[#0e6b53]"><CircleCheck className="h-5 w-5" /></div><div><h3 className="font-semibold text-[#244438]">Integration foundation ready</h3><p className="mt-1 text-sm leading-6 text-[#718078]">The secure account connection screen will be enabled when your Meta credentials are configured in a server-side Edge Function.</p></div></div></div><div className="mt-5 flex gap-3 rounded-2xl border border-[#f0dfc6] bg-[#fffaf3] p-4 text-sm leading-6 text-[#82643b]"><PencilLine className="mt-1 h-4 w-4 shrink-0" />No channel is marked connected until Meta confirms it.</div><Footer loading={loading} back={() => setStep(4)} onNext={() => void advanceSimpleStep(6, 5)} nextLabel="Continue to test" /></div>}{step === 6 && <div><StepHeader icon={<TestTube2 />} eyebrow="Step 5 of 5" title="Review before you go live" description="Your workspace is ready for the next phase: server-side AI and WhatsApp processing." /><div className="mt-8 grid gap-3 sm:grid-cols-3"><ReviewCard label="Business" value={business.name || "Not set"} /><ReviewCard label="Agent" value={agent.name || "Not set"} /><ReviewCard label="Knowledge" value={knowledge.title || "Add from dashboard"} /></div><div className="mt-6 rounded-2xl bg-[#eef8f2] p-5"><h3 className="font-semibold text-[#1d5d46]">What happens next</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-[#557466]"><li>• Add products, FAQs, policies, and other approved business knowledge.</li><li>• Connect WhatsApp through the official Meta Cloud API when credentials are available.</li><li>• Invite staff and review every AI escalation from the shared inbox.</li></ul></div><Footer loading={loading} back={() => setStep(5)} onNext={() => void finish()} nextLabel="Open workspace" /></div>}</section></div></div></main>;
}

function StepHeader({ icon, eyebrow, title, description }: { icon: React.ReactNode; eyebrow: string; title: string; description: string }) { return <div><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e3f1eb] text-[#0e6b53]">{icon}</div><p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#0e6b53]">{eyebrow}</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#16352b]">{title}</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#718078]">{description}</p></div>; }
function Field({ label, id, value, onChange, placeholder, type = "text", required = false }: { label: string; id: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; required?: boolean }) { return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} className="h-11 rounded-xl border-[#dfe9e3] bg-[#fbfdfc]" /></div>; }
function Footer({ loading, back, onNext, nextLabel = "Continue" }: { loading: boolean; back?: () => void; onNext?: () => void; nextLabel?: string }) { return <div className="mt-9 flex items-center justify-between border-t border-[#edf1ee] pt-6"><Button type={back ? "button" : "submit"} variant="ghost" onClick={back} className={cn("gap-2 rounded-xl text-[#6c7e75]", !back && "invisible")}><ChevronLeft className="h-4 w-4" />Back</Button>{onNext ? <Button type="button" onClick={onNext} disabled={loading} className="gap-2 rounded-xl bg-[#0e6b53] px-5 font-semibold hover:bg-[#095641]">{loading ? "Saving…" : nextLabel}<ChevronRight className="h-4 w-4" /></Button> : <Button type="submit" disabled={loading} className="gap-2 rounded-xl bg-[#0e6b53] px-5 font-semibold hover:bg-[#095641]">{loading ? "Saving…" : nextLabel}<ChevronRight className="h-4 w-4" /></Button>}</div>; }
function ReviewCard({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-[#dfe9e3] p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#92a199]">{label}</p><p className="mt-2 truncate text-sm font-semibold text-[#29483b]">{value}</p></div>; }
