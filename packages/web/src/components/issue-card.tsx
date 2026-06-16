import { Link } from "@tanstack/react-router";
import { ArrowUp, MapPin, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { statusColor, timeAgo, type Issue } from "@/lib/mock-data";
import { useApp } from "@/lib/app-state";

export function IssueCard({ issue }: { issue: Issue }) {
  const { upvote } = useApp();
  return (
    <Card className="group relative overflow-hidden border-border/70 transition-all hover:border-ocean-teal/40 hover:shadow-lift">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-ocean opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex gap-4 p-5">
        <button
          onClick={(e) => {
            e.preventDefault();
            upvote(issue.id);
          }}
          className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-muted/40 transition-colors hover:border-ocean-teal hover:bg-ocean-teal/10"
          aria-label="Upvote"
        >
          <ArrowUp className="h-4 w-4 text-ocean-teal" />
          <span className="font-display text-sm font-semibold text-foreground">{issue.upvotes}</span>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={statusColor(issue.status)}>
              {issue.status}
            </Badge>
            <Badge variant="secondary" className="bg-muted/70 text-foreground/70">
              {issue.category}
            </Badge>
            <span className="text-xs text-muted-foreground">{issue.id}</span>
          </div>

          <Link
            to="/issue/$id"
            params={{ id: issue.id }}
            className="mt-2 block font-display text-lg font-semibold text-foreground hover:text-ocean-mid"
          >
            {issue.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{issue.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {issue.neighborhood} · {issue.address}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" /> {issue.comments.length}
            </span>
            <span>by {issue.reporter} · {timeAgo(issue.createdAt)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
