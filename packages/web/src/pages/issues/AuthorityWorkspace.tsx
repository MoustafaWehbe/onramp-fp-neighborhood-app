import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { statusColor } from "../../lib/mock-data";
import { apiClient } from "@/lib/api-client";
import { useIssues } from "../../hooks/useIssues";

export function WorkerWorkspace() {
  const [neighborhood, setNeighborhood] = useState<string | null | undefined>(
    undefined,
  );

  useEffect(() => {
    apiClient
      .get("/auth/me")
      .then((res) => {
        setNeighborhood(res.data.data.assignedNeighborhood ?? null);
      })
      .catch(() => {
        setNeighborhood(null);
      });
  }, []);

  const { issues, loading, error } = useIssues(
    neighborhood === undefined
      ? { enabled: false }
      : neighborhood
        ? { neighborhood }
        : {},
  );

  return (
    <div className="p-6 space-y-4">
      
      <p className="text-sm text-muted-foreground">
        {neighborhood
          ? `Issues in: ${neighborhood}`
          : "All reported issues across neighborhoods"}
      </p>

      {(loading || neighborhood === undefined) && (
        <p className="text-sm text-muted-foreground">Loading issues...</p>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="space-y-2">
        {!loading &&
          neighborhood !== undefined &&
          !error &&
          issues.map((issue) => (
            <Link
              key={issue.id}
              to={`/issue/${issue.id}`}
              className="block border border-border rounded-lg p-4 hover:bg-muted"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{issue.title}</span>
                <Badge variant="outline" className={statusColor(issue.status)}>
                  {issue.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {issue.neighborhood} · {issue.category}
              </p>
            </Link>
          ))}

        {!loading &&
          neighborhood !== undefined &&
          !error &&
          issues.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No issues reported yet.
            </p>
          )}
      </div>
    </div>
  );
}
