import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { statusColor, STATUS_FLOW, type Status } from "../../lib/mock-data";
import { CommentSection } from "../../components/CommentSection";
import { useIssue, useComments } from "../../hooks/useIssues";
import { apiClient } from "../../lib/api-client";

export function IssuePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { issue, loading, error } = useIssue(id);
  const { comments, refetch } = useComments(id);

  const [newStatus, setNewStatus] = useState<Status | "">("");
  const [note, setNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  if (loading) {
    return <p className="p-6 text-muted-foreground">Loading...</p>;
  }

  if (error || !issue) {
    return <p className="p-6">Issue not found.</p>;
  }

  const isCityWorker =
    user?.role === "moderator" || user?.roles?.includes("moderator");

  async function handleUpdateStatus() {
    if (!newStatus || !note.trim() || updatingStatus) return;
    try {
      setUpdatingStatus(true);
      await apiClient.patch(`/issues/${id}/status`, {
        status: newStatus,
        note,
      });
      setNewStatus("");
      setNote("");
      alert("Status updated successfully!");
      window.location.reload();
    } catch {
      alert("Failed to update status.");
    } finally {
      setUpdatingStatus(false);
    }
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
          {issue.neighborhood} · {issue.address}
        </p>
      </div>

      {isCityWorker && (
        <div className="border border-border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold">Update Status</h3>

          <Select
            value={newStatus}
            onValueChange={(v) => setNewStatus(v as Status)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FLOW.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Resolution note (e.g. 'Crew dispatched, repair scheduled for Friday')"
            rows={3}
          />

          <Button onClick={handleUpdateStatus} disabled={updatingStatus}>
            {updatingStatus ? "Updating..." : "Update status"}
          </Button>
        </div>
      )}
      {/* Progress Log */}
      {issue.progressLogs && issue.progressLogs.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Status History</h3>
          <div className="space-y-2">
            {issue.progressLogs.map((log: any) => (
              <div
                key={log.id}
                className="border-l-2 border-ocean-teal pl-3 py-1"
              >
                <p className="text-sm font-medium">
                  {log.fromStatus} → {log.toStatus}
                </p>
                <p className="text-xs text-muted-foreground">{log.note}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* comment section */}
      <CommentSection
        issue={issue}
        comments={comments}
        onCommentPosted={refetch}
      />
    </div>
  );
}
