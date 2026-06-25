import { useNavigate } from "react-router-dom";
import { useApp } from "../../lib/app-state";
import { IssueCard } from "../../components/issue-card";
import { Button } from "../../components/ui/button";
import { FileText, PlusCircle } from "lucide-react";

export function MyReports() {
  const { issues, user } = useApp();
  const navigate = useNavigate();

  const myIssues = issues.filter((i) => i.reporter === user);

  return (
    <div className="p-6 space-y-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your submissions</h2>
          <p className="text-sm text-muted-foreground">
            {myIssues.length} report{myIssues.length !== 1 ? "s" : ""}
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

      {/* issue list */}
      {myIssues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            No reports yet
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Click "New report" to submit your first issue
          </p>
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
