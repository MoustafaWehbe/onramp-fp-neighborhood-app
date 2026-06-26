import { useApp } from "../../lib/app-state";
import { IssueCard } from "../../components/issue-card";

export function Feed() {
  const { issues } = useApp();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Community Feed</h2>
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
}