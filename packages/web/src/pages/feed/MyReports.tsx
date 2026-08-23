import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useIssues } from "../../hooks/useIssues";
import { IssueCard } from "../../components/issue-card";
import { Button } from "../../components/ui/button";
import { FileText, PlusCircle, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";

export function MyReports() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { issues, loading, error } = useIssues();

  const myIssues = issues.filter((i) => i.reportedById === user?.id);
  const openCount = myIssues.filter(i => i.status === "Reported" || i.status === "Acknowledged").length;
  const inProgressCount = myIssues.filter(i => i.status === "In Progress").length;
  const resolvedCount = myIssues.filter(i => i.status === "Resolved").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Reports</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Loading..." : `${myIssues.length} report${myIssues.length !== 1 ? "s" : ""} submitted`}
          </p>
        </div>
        <Button
          className="rounded-xl gap-2"
          onClick={() => navigate("/report-issue")}
        >
          <PlusCircle className="h-4 w-4" />
          New report
        </Button>
      </div>

      {/* Stats — only show when there are issues */}
      {!loading && myIssues.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="border border-border/60 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Open</p>
                  <p className="text-3xl font-bold mt-1">{openCount}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-orange-50 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border/60 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">In Progress</p>
                  <p className="text-3xl font-bold mt-1">{inProgressCount}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-teal-50 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-teal-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border/60 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Resolved</p>
                  <p className="text-3xl font-bold mt-1">{resolvedCount}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center py-8">{error}</p>
      )}

      {/* Issue list */}
      {!loading && !error && myIssues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-base font-semibold text-muted-foreground">No reports yet</p>
          <p className="text-sm text-muted-foreground/60 mt-1 max-w-xs">
            See something that needs fixing? Submit your first issue and help improve your neighborhood.
          </p>
          <Button
            className="mt-6 rounded-xl gap-2"
            onClick={() => navigate("/report-issue")}
          >
            <PlusCircle className="h-4 w-4" />
            Submit your first report
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {myIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}