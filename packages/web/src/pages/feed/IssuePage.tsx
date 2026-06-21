import { useParams } from "react-router-dom";
import { useApp } from "../../lib/app-state";
import { Badge } from "../../components/ui/badge";
import { statusColor } from "../../lib/mock-data";

export function IssuePage() {
  const { id } = useParams();
  const { issues } = useApp();
  const issue = issues.find((i) => i.id === id);

  if (!issue) {
    return <p className="p-6">Issue not found.</p>;
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="space-y-2">
        <div className="flex gap-2">
          <Badge variant="outline" className={statusColor(issue.status)}>
            {issue.status}
          </Badge>
          <Badge variant="secondary">{issue.category}</Badge>
        </div>
        <h2 className="text-xl font-semibold">{issue.title}</h2>
        <p className="text-muted-foreground">{issue.description}</p>
        <p className="text-sm text-muted-foreground">
          {issue.neighborhood} · {issue.address} · reported by {issue.reporter}
        </p>
      </div>
    </div>
  );
}