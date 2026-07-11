import { UserCog, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

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
          <p className="text-sm text-muted-foreground">
            Manage your account settings.
          </p>
        </div>
      </div>

      <div className="grid max-w-5xl gap-6">
        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col gap-4 rounded-xl border border-border/60 p-4 md:flex-row md:items-center md:justify-between">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="text-sm font-medium text-foreground">
                {user?.name}
              </span>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-border/60 p-4 md:flex-row md:items-center md:justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium text-foreground">
                {user?.email}
              </span>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-border/60 p-4 md:flex-row md:items-center md:justify-between">
              <span className="text-sm text-muted-foreground">Role</span>
              <span className="text-sm font-medium capitalize text-foreground">
                {user?.role}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
