import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  ClipboardList,
  MapPin,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

const residentNav = [
  { title: "Community Feed", url: "/", icon: LayoutDashboard },
  { title: "Report an Issue", url: "/report-issue", icon: PlusCircle },
  { title: "My Reports", url: "/my-reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

const authorityNav = [
  { title: "Community Feed", url: "/", icon: LayoutDashboard },
  { title: "Worker Workspace", url: "/worker-workspace", icon: ClipboardList },
  { title: "Settings", url: "/settings", icon: Settings },
];

const adminNav = [
  { title: "Community Feed", url: "/", icon: LayoutDashboard },
  { title: "Worker Workspace", url: "/worker-workspace", icon: ClipboardList },
  { title: "Settings", url: "/settings", icon: Settings },
];

function formatRole(role?: string) {
  if (!role) return "Resident";

  switch (role) {
    case "resident":
      return "Resident";
    case "moderator":
    case "admin":
      return "Authority Representative";
    case "platform_admin":
      return "Platform Admin";
    default:
      return role;
  }
}

export function AppSidebar() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const role = user?.role ?? "resident";

  const nav =
    role === "resident"
      ? residentNav
      : role === "platform_admin"
        ? adminNav
        : authorityNav;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-soft">
            <MapPin className="h-5 w-5" />
          </div>

          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-display text-base font-semibold text-sidebar-foreground">
              CivicWave
            </span>
            <span className="text-xs text-sidebar-foreground/60">
              Community tracker
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Neighborhood</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-sidebar-foreground/80 group-data-[collapsible=icon]:hidden">
              <MapPin className="h-4 w-4 text-sidebar-primary" />
              <span>All neighborhoods</span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="space-y-2 px-1 py-2 group-data-[collapsible=icon]:hidden">
          <div className="px-2 text-xs text-sidebar-foreground/60">
            Signed in as
          </div>

          <div className="px-2 text-sm font-medium text-sidebar-foreground">
            {user?.name ?? "Unknown user"}
          </div>

          <div className="px-2 text-xs text-sidebar-foreground/60 truncate">
            {user?.email}
          </div>

          <div className="mx-2 rounded-md bg-sidebar-accent/70 px-2 py-1 text-xs font-medium text-sidebar-foreground">
            {formatRole(role)}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
