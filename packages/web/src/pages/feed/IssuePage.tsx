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
import { MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react";
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
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [statusError, setStatusError] = useState(false);

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2 text-muted-foreground">
        <Clock className="h-4 w-4 animate-spin" />
        Loading issue...
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="p-6 flex items-center gap-2 text-destructive">
        <AlertCircle className="h-4 w-4" />
        Issue not found.
      </div>
    );
  }

  const isCityWorker =
    user?.role === "moderator" || user?.roles?.includes("moderator");

  async function handleUpdateStatus() {
    if (!newStatus || !note.trim() || updatingStatus) return;
    try {
      setUpdatingStatus(true);
      setStatusError(false);
      await apiClient.patch(`/issues/${id}/status`, {
        status: newStatus,
        note,
      });
      setNewStatus("");
      setNote("");
      setStatusSuccess(true);
      setTimeout(() => {
        setStatusSuccess(false);
        window.location.reload();
      }, 1500);
    } catch {
      setStatusError(true);
      setTimeout(() => setStatusError(false), 3000);
    } finally {
      setUpdatingStatus(false);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">

      {/* Issue header card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={statusColor(issue.status)}>
            {issue.status}
          </Badge>
          <Badge variant="secondary">{issue.category}</Badge>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">{issue.title}</h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">{issue.description}</p>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{issue.neighborhood} · {issue.address}</span>
        </div>
      </div>

      {/* Status update for workers */}
      {isCityWorker && (
        <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4 shadow-sm">
          <h3 className="font-semibold text-base">Update Status</h3>

          {statusSuccess && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              Status updated successfully!
            </div>
          )}

          {statusError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              Failed to update status. Please try again.
            </div>
          )}

          <Select
            value={newStatus}
            onValueChange={(v) => setNewStatus(v as Status)}
          >
            <SelectTrigger className="rounded-xl">
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
            className="rounded-xl resize-none"
          />

          <Button
            onClick={handleUpdateStatus}
            disabled={updatingStatus || !newStatus || !note.trim()}
            className="rounded-xl"
          >
            {updatingStatus ? "Updating..." : "Update status"}
          </Button>
        </div>
      )}

      {/* Status History / Progress Log */}
      {issue.progressLogs && issue.progressLogs.length > 0 && (
        <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4 shadow-sm">
          <h3 className="font-semibold text-base">Status History</h3>
          <div className="space-y-3">
            {issue.progressLogs.map((log: any, index: number) => (
              <div key={log.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                  {index < issue.progressLogs!.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-1" />
                  )}
                </div>
                <div className="pb-3 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {log.fromStatus} → {log.toStatus}
                  </p>
                  {log.note && (
                    <p className="text-sm text-muted-foreground mt-0.5">{log.note}</p>
                  )}
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <CommentSection
        issue={issue}
        comments={comments}
        onCommentPosted={refetch}
      />
    </div>
  );
}