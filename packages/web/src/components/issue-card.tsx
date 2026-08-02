import { Link } from "react-router-dom";
import { MapPin, MessageSquare, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { statusColor, timeAgo } from "@/lib/mock-data";
import type { ApiIssue } from "@/hooks/useIssues";

const categoryColors: Record<string, string> = {
  Roads: "bg-orange-50 text-orange-700 border-orange-200",
  Lighting: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Utilities: "bg-blue-50 text-blue-700 border-blue-200",
  Sanitation: "bg-green-50 text-green-700 border-green-200",
  Noise: "bg-purple-50 text-purple-700 border-purple-200",
  Parks: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Safety: "bg-red-50 text-red-700 border-red-200",
};

export function IssueCard({ issue }: { issue: ApiIssue }) {
  const categoryStyle = categoryColors[issue.category] ?? "bg-muted/70 text-foreground/70";

  return (
    <Card className="group relative overflow-hidden border-border/70 transition-all hover:border-ocean-teal/40 hover:shadow-lift">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-ocean opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex gap-4 p-5">

        {/* Left column - status indicator */}
        <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
          <div className={`h-2.5 w-2.5 rounded-full ${
            issue.status === "Resolved" ? "bg-green-500" :
            issue.status === "In Progress" ? "bg-blue-500" :
            issue.status === "Acknowledged" ? "bg-yellow-500" :
            "bg-orange-400"
          }`} />
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={statusColor(issue.status)}>
              {issue.status}
            </Badge>
            <Badge
              variant="outline"
              className={categoryStyle}
            >
              {issue.category}
            </Badge>
          </div>

          <Link
            to={`/issue/${issue.id}`}
            className="mt-2 block font-display text-lg font-semibold text-foreground hover:text-ocean-mid transition-colors"
          >
            {issue.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {issue.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {issue.neighborhood} · {issue.address}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {issue.comments?.length ?? 0} comments
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {timeAgo(issue.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}