import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { useIssues } from "../../hooks/useIssues";
import { Badge } from "../../components/ui/badge";
import { statusColor, timeAgo } from "../../lib/mock-data";

const STATUS_TABS = ["All", "Reported", "Acknowledged", "In Progress", "Resolved"] as const;
type StatusTab = typeof STATUS_TABS[number];

export function WorkQueue() {
  const [activeTab, setActiveTab] = useState<StatusTab>("All");
  const [neighborhood, setNeighborhood] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    apiClient.get("/auth/me").then((res) => {
      setNeighborhood(res.data.data.assignedNeighborhood ?? null);
    }).catch(() => setNeighborhood(null));
  }, []);

  const { issues, loading, error } = useIssues(
    neighborhood === undefined
      ? { enabled: false }
      : {
          neighborhood: neighborhood ?? undefined,
          status: activeTab === "All" ? undefined : activeTab,
        }
  );

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Work Queue</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {neighborhood ? `Issues in ${neighborhood}` : "All city reports"}
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 border-b border-border">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      {(loading || neighborhood === undefined) && (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>
      )}

      {error && (
        <p className="text-sm text-red-500 py-8 text-center">{error}</p>
      )}

      {!loading && neighborhood !== undefined && !error && (
        <div className="rounded-xl border border-border/60 overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-6 bg-muted/40 px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <span>ID</span>
            <span className="col-span-2">Title</span>
            <span>Category</span>
            <span>Neighborhood</span>
            <span>Status</span>
          </div>

          {/* Table rows */}
          {issues.length === 0 ? (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">
              No issues found
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {issues.map((issue) => (
                <Link
                  key={issue.id}
                  to={`/issue/${issue.id}`}
                  className="grid grid-cols-6 px-4 py-3 hover:bg-muted/20 transition-colors items-center"
                >
                  <span className="text-xs text-muted-foreground font-mono truncate">
                    {issue.id.slice(0, 8)}...
                  </span>
                  <span className="col-span-2 text-sm font-medium truncate pr-4">
                    {issue.title}
                  </span>
                  <span className="text-sm text-muted-foreground">{issue.category}</span>
                  <span className="text-sm text-muted-foreground">{issue.neighborhood}</span>
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className={statusColor(issue.status)}>
                      {issue.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {timeAgo(issue.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}