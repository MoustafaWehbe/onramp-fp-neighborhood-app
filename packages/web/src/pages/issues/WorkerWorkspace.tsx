import { Link } from "react-router-dom";
import { useApp } from "../../lib/app-state";
import { Badge } from "../../components/ui/badge";
import { statusColor } from "../../lib/mock-data";

export function WorkerWorkspace() {
  const { issues } = useApp();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Worker Workspace</h2>
      <p className="text-sm text-muted-foreground">
        All reported issues across neighborhoods
      </p>

      <div className="space-y-2">
        {issues.map((issue) => (
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
      </div>
    </div>
  );
}