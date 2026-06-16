import { Outlet, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "@/lib/app-state";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";

function TopBar() {
  const { role } = useApp();
  const location = useLocation();

  const pathname = location.pathname;

  const title =
    pathname === "/"
      ? "Community Feed"
      : pathname === "/report"
        ? "Report an Issue"
        : pathname === "/my-reports"
          ? "My Reports"
          : pathname === "/queue"
            ? "Work Queue"
            : pathname === "/admin"
              ? "Admin Console"
              : pathname.startsWith("/issue/")
                ? "Issue Details"
                : "CivicWave";

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border/80 bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <div className="h-5 w-px bg-border" />
      <h1 className="font-display text-base font-semibold tracking-tight">
        {title}
      </h1>

      <div className="ml-auto flex items-center gap-2">
        <Badge variant="outline">{role} view</Badge>
      </div>
    </header>
  );
}

export function AppLayout() {
  return (
    <AppProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <TopBar />

            <main className="flex-1">
              <Outlet />
            </main>
          </div>
        </div>

        <Toaster />
      </SidebarProvider>
    </AppProvider>
  );
}
