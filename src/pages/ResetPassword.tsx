import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/features/auth/AuthContext";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Use at least 8 characters for your password.");
    if (password !== confirmation) return setError("The passwords do not match.");
    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (updateError) return setError(updateError.message);
    navigate(user ? "/dashboard" : "/login", { replace: true });
  };

  return <main className="flex min-h-screen items-center justify-center bg-[#f6f8f7] px-5 py-10"><div className="w-full max-w-md"><Link to="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#60736a] hover:text-[#0e6b53]"><ArrowLeft className="h-4 w-4" />Back to sign in</Link><div className="rounded-3xl border border-[#dfe9e3] bg-white p-7 shadow-[0_18px_50px_rgba(33,74,57,0.07)]"><div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3f1eb] text-[#0e6b53]"><LockKeyhole className="h-5 w-5" /></div><h1 className="text-2xl font-semibold tracking-[-0.04em] text-[#16352b]">Set a new password</h1><p className="mt-2 text-sm leading-6 text-[#718078]">Choose a secure password for your Kijibu workspace.</p><form onSubmit={handleSubmit} className="mt-7 space-y-5"><div className="space-y-2"><Label htmlFor="password">New password</Label><Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required /></div><div className="space-y-2"><Label htmlFor="confirmation">Confirm password</Label><Input id="confirmation" type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" required /></div>{error && <p className="rounded-xl bg-[#fff1ef] px-3 py-2 text-sm text-[#b04e45]" role="alert">{error}</p>}<Button type="submit" disabled={saving} className="h-11 w-full rounded-xl bg-[#0e6b53] font-semibold hover:bg-[#095641]">{saving ? "Saving…" : "Update password"}</Button></form></div></div></main>;
}
