import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  ClipboardList,
  Shield,
  MapPin,
  Waves,
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
import { useApp, type Role } from "@/lib/app-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const residentNav = [
  { title: "Community Feed", url: "/", icon: LayoutDashboard },
  { title: "Report an Issue", url: "/report-issue", icon: PlusCircle },
  { title: "My Reports", url: "/my-reports", icon: FileText },
];

const authorityNav = [
  { title: "Community Feed", url: "/", icon: LayoutDashboard },
  { title: "Work Queue", url: "/queue", icon: ClipboardList },
];

const adminNav = [
  { title: "Community Feed", url: "/", icon: LayoutDashboard },
  { title: "Admin Console", url: "/admin", icon: Shield },
];

export function AppSidebar() {
  const { role, setRole, user } = useApp();
  const { pathname } = useLocation();
  const nav =
    role === "Resident"
      ? residentNav
      : role === "Authority"
        ? authorityNav
        : adminNav;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2.5 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-soft">
            <Waves className="h-5 w-5" />
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
                    tooltip={item.title}
                  >
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
            {user}
          </div>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="bg-sidebar-accent/60 border-sidebar-border text-sidebar-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Resident">Resident</SelectItem>
              <SelectItem value="Authority">Authority Rep</SelectItem>
              <SelectItem value="Admin">Platform Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
