import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import type { WorkspaceBusiness, WorkspaceMembership } from "@/types/workspace";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  memberships: WorkspaceMembership[];
  activeBusiness: WorkspaceBusiness | null;
  activeMembership: WorkspaceMembership | null;
  loading: boolean;
  workspaceError: string | null;
  setActiveBusinessId: (businessId: string) => void;
  refreshWorkspace: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const ACTIVE_BUSINESS_KEY = "kijibu.activeBusinessId";

type MembershipRow = {
  business_id: string;
  role: WorkspaceMembership["role"];
};

const loadMemberships = async (currentSession: Session | null) => {
  if (!currentSession) return [];

  const { data: membershipRows, error: membershipError } = await supabase
    .from("business_members")
    .select("business_id, role")
    .eq("user_id", currentSession.user.id)
    .eq("status", "active");

  if (membershipError) throw membershipError;

  const rows = (membershipRows ?? []) as MembershipRow[];
  if (rows.length === 0) return [];

  const { data: businesses, error: businessesError } = await supabase
    .from("businesses")
    .select("id, name, category, country, region, city, description, status")
    .in("id", rows.map((row) => row.business_id))
    .eq("status", "active");

  if (businessesError) throw businessesError;

  const businessMap = new Map((businesses ?? []).map((business) => [business.id, business as WorkspaceBusiness]));
  return rows.flatMap((row) => {
    const business = businessMap.get(row.business_id);
    return business ? [{ businessId: row.business_id, role: row.role, business }] : [];
  });
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [memberships, setMemberships] = useState<WorkspaceMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [activeBusinessId, setActiveBusinessIdState] = useState<string | null>(() => localStorage.getItem(ACTIVE_BUSINESS_KEY));

  const refreshWorkspace = useCallback(async () => {
    setWorkspaceError(null);
    try {
      const nextMemberships = await loadMemberships(session);
      setMemberships(nextMemberships);
      const savedId = localStorage.getItem(ACTIVE_BUSINESS_KEY);
      const nextActiveId = nextMemberships.some((membership) => membership.businessId === savedId)
        ? savedId
        : nextMemberships[0]?.businessId ?? null;
      setActiveBusinessIdState(nextActiveId);
      if (nextActiveId) localStorage.setItem(ACTIVE_BUSINESS_KEY, nextActiveId);
      else localStorage.removeItem(ACTIVE_BUSINESS_KEY);
    } catch (error) {
      setWorkspaceError(error instanceof Error ? error.message : "Unable to load your workspace.");
      setMemberships([]);
    }
  }, [session]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    }).finally(() => {
      if (mounted) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setTimeout(() => {
        if (mounted) void refreshWorkspace();
      }, 0);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [refreshWorkspace]);

  useEffect(() => {
    if (!loading) void refreshWorkspace();
  }, [loading, refreshWorkspace]);

  const setActiveBusinessId = (businessId: string) => {
    setActiveBusinessIdState(businessId);
    localStorage.setItem(ACTIVE_BUSINESS_KEY, businessId);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(ACTIVE_BUSINESS_KEY);
    setMemberships([]);
  };

  const activeMembership = memberships.find((membership) => membership.businessId === activeBusinessId) ?? memberships[0] ?? null;
  const value = useMemo<AuthContextValue>(() => ({
    user: session?.user ?? null,
    session,
    memberships,
    activeBusiness: activeMembership?.business ?? null,
    activeMembership,
    loading,
    workspaceError,
    setActiveBusinessId,
    refreshWorkspace,
    signOut,
  }), [activeMembership, loading, memberships, refreshWorkspace, session, workspaceError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
