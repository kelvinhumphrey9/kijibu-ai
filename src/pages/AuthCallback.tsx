import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { loading, user, memberships } = useAuth();
  const recovery = window.location.hash.includes("type=recovery") || new URLSearchParams(window.location.search).get("type") === "recovery";

  useEffect(() => {
    if (loading || !user) return;
    navigate(recovery ? "/reset-password" : memberships.length > 0 ? "/dashboard" : "/onboarding", { replace: true });
  }, [loading, memberships.length, navigate, recovery, user]);

  if (!loading && !user && !recovery) return <Navigate to="/login" replace />;

  return <div className="flex min-h-screen items-center justify-center bg-[#f6f8f7] text-[#0e6b53]"><div className="flex items-center gap-3 text-sm font-semibold"><Loader2 className="h-5 w-5 animate-spin" />Securing your workspace…</div></div>;
}
