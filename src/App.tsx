import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppShell } from "@/layouts/AppShell";
import ModulePlaceholder from "@/pages/ModulePlaceholder";
import NotFound from "@/pages/NotFound";

const AuthCallback = lazy(() => import("@/pages/AuthCallback"));
const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/Login"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));

const queryClient = new QueryClient();

function PageFallback() {
  return <div className="flex min-h-screen items-center justify-center bg-[#f6f8f7] text-[#0e6b53]"><Loader2 className="h-5 w-5 animate-spin" aria-label="Loading page" /></div>;
}

const workspaceModules: Record<string, { title: string; description: string }> = {
  "/inbox": { title: "Inbox", description: "A shared workspace for AI-assisted conversations, assignment, internal notes, and human handoff." },
  "/customers": { title: "Customers", description: "A tenant-scoped customer view for contacts, conversation history, tags, and lead status." },
  "/products": { title: "Products", description: "Manage the products and services that approved AI answers can reference." },
  "/leads": { title: "Leads", description: "Capture and qualify customer intent from real conversations." },
  "/knowledge": { title: "Knowledge", description: "Create the approved business information that keeps every AI answer grounded." },
  "/orders": { title: "Orders", description: "Track order workflows without claiming payment or fulfillment events that have not happened." },
  "/analytics": { title: "Analytics", description: "Explore tenant-scoped conversation, AI, customer, lead, order, and usage metrics." },
  "/team": { title: "Team", description: "Invite staff and apply owner, admin, agent, and viewer permissions." },
  "/settings": { title: "Settings", description: "Configure business details, AI behavior, notifications, and integrations securely." },
};

function WorkspaceRoute({ modulePath }: { modulePath?: string }) {
  const module = modulePath ? workspaceModules[modulePath] : undefined;
  return <ProtectedRoute requireBusiness><AppShell>{module ? <ModulePlaceholder {...module} /> : <Index />}</AppShell></ProtectedRoute>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<WorkspaceRoute />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/onboarding" element={<Onboarding />} />
              </Route>
              <Route path="/dashboard" element={<WorkspaceRoute />} />
              {Object.keys(workspaceModules).map((path) => <Route key={path} path={path} element={<WorkspaceRoute modulePath={path} />} />)}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
