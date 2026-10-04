import { useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LayoutDashboard, LogOut, Menu, MessageSquare, Package, PanelLeftClose, PanelLeftOpen, Settings, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";

const primaryNavigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inbox", href: "/inbox", icon: MessageSquare },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Products", href: "/products", icon: Package },
];

const workspaceNavigation = [
  { label: "Leads", href: "/leads" },
  { label: "Knowledge", href: "/knowledge" },
  { label: "Orders", href: "/orders" },
  { label: "Analytics", href: "/analytics" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, memberships, activeBusiness, setActiveBusinessId, signOut } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.user_metadata?.full_name ?? user?.email ?? "KI").slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };

  const navigation = (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center px-5">
        <Link to="/dashboard" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0e6b53] text-lg font-bold text-white shadow-sm">K</span>
          {!collapsed && <span className="text-xl font-bold tracking-[-0.04em] text-[#16352b]">kijibu<span className="text-[#d78b35]">.</span></span>}
        </Link>
      </div>
      <div className="px-3 pb-4">
        <p className={cn("mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a59d]", collapsed && "text-center text-[8px]")}>{collapsed ? "" : "Workspace"}</p>
        <nav className="space-y-1" aria-label="Primary navigation">
          {primaryNavigation.map(({ label, href, icon: Icon }) => (
            <NavLink key={href} to={href} onClick={() => setMobileOpen(false)} className={({ isActive }) => cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors", isActive ? "bg-[#e3f1eb] text-[#0e6b53]" : "text-[#63736c] hover:bg-[#f0f5f2] hover:text-[#16352b]", collapsed && "justify-center px-2")} title={collapsed ? label : undefined}>
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="px-3">
        <p className={cn("mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a59d]", collapsed && "text-center text-[8px]")}>{collapsed ? "" : "Manage"}</p>
        <nav className="space-y-1" aria-label="Workspace management navigation">
          {workspaceNavigation.map(({ label, href }) => (
            <NavLink key={href} to={href} onClick={() => setMobileOpen(false)} className={({ isActive }) => cn("block rounded-xl px-3 py-2 text-sm font-medium transition-colors", isActive ? "bg-[#e3f1eb] font-semibold text-[#0e6b53]" : "text-[#63736c] hover:bg-[#f0f5f2] hover:text-[#16352b]", collapsed && "px-2 text-center text-xs")}>
              {collapsed ? label.slice(0, 1) : label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mt-auto space-y-1 border-t border-[#e5ebe7] p-3">
        <NavLink to="/team" onClick={() => setMobileOpen(false)} className={({ isActive }) => cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium", isActive ? "bg-[#e3f1eb] text-[#0e6b53]" : "text-[#63736c] hover:bg-[#f0f5f2]", collapsed && "justify-center px-2")} title={collapsed ? "Team" : undefined}>
          <Users className="h-[18px] w-[18px]" />{!collapsed && "Team"}
        </NavLink>
        <NavLink to="/settings" onClick={() => setMobileOpen(false)} className={({ isActive }) => cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium", isActive ? "bg-[#e3f1eb] text-[#0e6b53]" : "text-[#63736c] hover:bg-[#f0f5f2]", collapsed && "justify-center px-2")} title={collapsed ? "Settings" : undefined}>
          <Settings className="h-[18px] w-[18px]" />{!collapsed && "Settings"}
        </NavLink>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f8f7] text-[#16352b]">
      <aside className={cn("fixed inset-y-0 left-0 z-40 hidden border-r border-[#e5ebe7] bg-white transition-all lg:block", collapsed ? "w-[76px]" : "w-[248px]")}>
        {navigation}
        <button type="button" onClick={() => setCollapsed((value) => !value)} className="absolute -right-3 top-24 hidden h-7 w-7 items-center justify-center rounded-full border border-[#dfe9e3] bg-white text-[#6a7c74] shadow-sm lg:flex" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
        </button>
      </aside>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-[#16352b]/20 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-[278px] border-r border-[#e5ebe7] bg-white transition-transform lg:hidden", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <button type="button" onClick={() => setMobileOpen(false)} className="absolute right-4 top-5 rounded-lg p-1 text-[#63736c]" aria-label="Close navigation"><X className="h-5 w-5" /></button>
        {navigation}
      </aside>
      <div className={cn("min-h-screen transition-all", collapsed ? "lg:pl-[76px]" : "lg:pl-[248px]")}>
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#e5ebe7]/80 bg-[#f6f8f7]/95 px-4 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-[#53665d] lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu className="h-5 w-5" /></Button>
            <div className="hidden items-center gap-2 text-sm text-[#7a8a82] sm:flex"><span className="font-semibold text-[#16352b]">Workspace</span><span>/</span><span>Overview</span></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden items-center gap-2 rounded-xl border border-[#dfe9e3] bg-white px-3 py-2 text-left sm:flex">
              <span className="h-2 w-2 rounded-full bg-[#29a36a]" />
              <select value={activeBusiness?.id ?? ""} onChange={(event) => setActiveBusinessId(event.target.value)} className="max-w-[150px] appearance-none bg-transparent pr-5 text-xs font-semibold text-[#334b40] outline-none" aria-label="Active business">
                {memberships.map((membership) => <option key={membership.businessId} value={membership.businessId}>{membership.business.name}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-[#90a19a]" />
            </div>
            <button type="button" className="relative rounded-xl p-2.5 text-[#6d7f76] hover:bg-white" aria-label="Notifications"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#d78b35]" /></button>
            <button type="button" className="hidden items-center gap-2 rounded-xl px-2 py-1.5 text-left hover:bg-white md:flex" onClick={handleSignOut} title="Sign out">
              <Avatar className="h-8 w-8 border border-white shadow-sm"><AvatarFallback className="bg-[#d9eee5] text-xs font-bold text-[#0e6b53]">{initials}</AvatarFallback></Avatar>
              <span className="max-w-[125px] truncate text-xs font-semibold text-[#334b40]">{user?.user_metadata?.full_name ?? user?.email}</span>
              <LogOut className="h-3.5 w-3.5 text-[#96a49e]" />
            </button>
            <button type="button" onClick={handleSignOut} className="rounded-xl p-2 text-[#6d7f76] md:hidden" aria-label="Sign out"><LogOut className="h-4 w-4" /></button>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 py-7 md:px-8 md:py-9">{children}</main>
      </div>
    </div>
  );
}
