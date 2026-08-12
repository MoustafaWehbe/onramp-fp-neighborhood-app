import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { statusColor } from "../../lib/mock-data";
import { useIssues } from "../../hooks/useIssues";
import { apiClient } from "@/lib/api-client";
import { Search, MapPin, ClipboardList } from "lucide-react";

export function AuthorityWorkspace() {
  const [neighborhood, setNeighborhood] = useState<string | null | undefined>(undefined);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiClient.get("/auth/me").then((res) => {
      setNeighborhood(res.data.data.assignedNeighborhood ?? null);
    }).catch(() => {
      setNeighborhood(null);
    });
  }, []);

  const { issues, loading, error } = useIssues(
    neighborhood === undefined
      ? { enabled: false }
      : neighborhood
        ? { neighborhood }
        : {}
  );

  const filtered = issues.filter((issue) => {
    if (!search.trim()) return true;
    return (
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.neighborhood.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Authority Workspace</h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {neighborhood
              ? `Showing issues in ${neighborhood}`
              : "All reported issues across neighborhoods"}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {filtered.length} issue{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search issues..."
          className="pl-9 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Issues list */}
      {(loading || neighborhood === undefined) && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <div className="text-center space-y-2">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm">Loading issues...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load issues. Please try again.
        </div>
      )}

      {!loading && neighborhood !== undefined && !error && (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ClipboardList className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No issues found</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {search ? "Try a different search term" : "No issues reported yet"}
              </p>
            </div>
          ) : (
            filtered.map((issue) => (
              <Link
                key={issue.id}
                to={`/issue/${issue.id}`}
                className="block rounded-xl border border-border/60 bg-card p-4 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">{issue.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {issue.neighborhood} · {issue.category}
                    </p>
                  </div>
                  <Badge variant="outline" className={`${statusColor(issue.status)} shrink-0`}>
                    {issue.status}
                  </Badge>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}