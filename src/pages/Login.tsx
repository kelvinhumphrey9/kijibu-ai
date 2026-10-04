import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const callbackUrl = () => new URL("/auth/callback", window.location.origin).href;

export default function Login() {
  return (
    <main className="min-h-screen bg-[#f6f8f7] lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-[#0e6b53] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="relative z-10">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d6f0e4] text-lg font-bold text-[#0e6b53]">K</span><span className="text-xl font-bold tracking-[-0.04em]">kijibu<span className="text-[#f0b66e]">.</span></span></div>
          <div className="mt-28 max-w-lg">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#a8ddc4]">Customer service, with context</p>
            <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.055em] xl:text-6xl">Turn every WhatsApp conversation into a better customer experience.</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-[#c5e6d7]">Kijibu gives your team one calm place to manage AI-assisted conversations, leads, orders, and the knowledge behind every answer.</p>
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-6 text-sm text-[#c5e6d7]"><span>Built for ambitious businesses in East Africa</span><ArrowUpRight className="h-5 w-5 text-[#f0b66e]" /></div>
        <div className="absolute -right-28 top-24 h-72 w-72 rounded-full border-[24px] border-[#2a8b6f]/60" /><div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full border-[32px] border-[#125e4b]" />
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[460px]">
          <div className="mb-8 lg:hidden"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0e6b53] text-lg font-bold text-white">K</span><span className="text-xl font-bold tracking-[-0.04em] text-[#16352b]">kijibu<span className="text-[#d78b35]">.</span></span></div></div>
          <div className="mb-8"><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0e6b53]"><MessageCircle className="h-3.5 w-3.5" />Workspace access</p><h2 className="text-3xl font-semibold tracking-[-0.045em] text-[#16352b]">Welcome back</h2><p className="mt-2 text-sm leading-6 text-[#6f7f77]">Sign in to continue building customer relationships that last.</p></div>
          <div className="rounded-3xl border border-[#dfe9e3] bg-white p-5 shadow-[0_18px_50px_rgba(33,74,57,0.07)] sm:p-7">
            <Auth supabaseClient={supabase} redirectTo={callbackUrl()} providers={[]} theme="light" appearance={{ theme: ThemeSupa, variables: { default: { colors: { brand: "#0e6b53", brandAccent: "#095641", inputBorder: "#d9e5de", inputBorderFocus: "#0e6b53", inputBorderHover: "#abcbbd", inputBackground: "#fbfdfc", inputText: "#16352b", messageText: "#c3564e", anchorTextColor: "#0e6b53" }, radii: { borderRadiusButton: "12px", buttonBorderRadius: "12px", inputBorderRadius: "12px" } } } }} />
          </div>
          <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#83928b]"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#2b9d6a]" />Your workspace is protected by Supabase Auth and tenant-level database policies.</div>
        </div>
      </section>
    </main>
  );
}
