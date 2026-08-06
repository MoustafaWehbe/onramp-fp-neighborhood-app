import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useIssues } from "../../hooks/useIssues";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  MapPin,
  PlusCircle,
  ClipboardList,
  TrendingUp,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { issues, loading } = useIssues();

  const openCount = issues.filter(
    (i) => i.status === "Reported" || i.status === "Acknowledged"
  ).length;
  const inProgressCount = issues.filter((i) => i.status === "In Progress").length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;

  const isWorker = user?.roles?.includes("moderator");
  const isAdmin = user?.roles?.includes("platform_admin") || user?.roles?.includes("admin");

  return (
    <div className="p-6 space-y-8">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-100 to-teal-50 border border-border/40 p-8">
        <div className="flex items-center gap-2 text-sm text-accent font-medium mb-3">
          <Sparkles className="h-4 w-4" />
          CivicWave
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          {isAdmin
            ? "Manage your platform, neighborhoods, and users from the Admin Console."
            : isWorker
            ? "Review and update issues assigned to your neighborhood."
            : "Track local issues in your neighborhood and stay informed."}
        </p>
        <div className="flex gap-3 mt-6">
          {!isWorker && !isAdmin && (
            <Button className="rounded-xl gap-2" onClick={() => navigate("/report-issue")}>
              <PlusCircle className="h-4 w-4" />
              Report an issue
            </Button>
          )}
          <Button
            variant="outline"
            className="rounded-xl gap-2"
            onClick={() => navigate(isWorker ? "/worker-workspace" : isAdmin ? "/admin" : "/")}
          >
            <ClipboardList className="h-4 w-4" />
            {isAdmin ? "Admin Console" : isWorker ? "Authority Workspace" : "View Feed"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      {!loading && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Community overview
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <Card className="border border-border/60 rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Open</p>
                    <p className="text-4xl font-bold mt-1">{openCount}</p>
                  </div>
                  <div className="h-11 w-11 rounded-full bg-orange-50 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60 rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">In Progress</p>
                    <p className="text-4xl font-bold mt-1">{inProgressCount}</p>
                  </div>
                  <div className="h-11 w-11 rounded-full bg-teal-50 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-teal-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60 rounded-2xl">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Resolved</p>
                    <p className="text-4xl font-bold mt-1">{resolvedCount}</p>
                  </div>
                  <div className="h-11 w-11 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}