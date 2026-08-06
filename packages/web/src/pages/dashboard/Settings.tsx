import { UserCog, Settings as SettingsIcon, Shield, MapPin, Mail, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

function formatRole(role?: string) {
  if (!role) return "Resident";
  switch (role) {
    case "platform_admin": return "Platform Admin";
    case "admin": return "Admin";
    case "moderator": return "Authority Representative";
    default: return "Resident";
  }
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
      <span className="text-2xl font-bold text-primary">{initials}</span>
    </div>
  );
}

export function Settings() {
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <SettingsIcon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account settings.</p>
        </div>
      </div>

      <div className="grid max-w-2xl gap-6">
        {/* Profile card */}
        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Avatar + name */}
            <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-muted/30 border border-border/40">
              <Avatar name={user?.name ?? "U"} />
              <div>
                <p className="text-lg font-semibold">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <Badge variant="outline" className="mt-1.5 text-xs">
                  {formatRole(user?.role)}
                </Badge>
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Full name</p>
                  <p className="text-sm font-medium">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Email address</p>
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm font-medium">{formatRole(user?.role)}</p>
                </div>
              </div>

              {user?.assignedNeighborhood && (
                <div className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Assigned neighborhood</p>
                    <p className="text-sm font-medium">{user.assignedNeighborhood}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}