import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

export function ProtectedRoute({ requireBusiness = false, children }: { requireBusiness?: boolean; children?: ReactNode }) {
  const { loading, user, activeBusiness } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f6f8f7] text-[#52625b]"><Loader2 className="h-5 w-5 animate-spin" aria-label="Loading" /></div>;
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (requireBusiness && !activeBusiness) return <Navigate to="/onboarding" replace />;

  return children ?? <Outlet />;
}
