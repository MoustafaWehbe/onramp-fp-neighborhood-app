import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { MapPin, Clock, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { statusColor, STATUS_FLOW, type Status } from "../../lib/mock-data";
import { CommentSection } from "../../components/CommentSection";
import { useIssue, useComments } from "../../hooks/useIssues";
import { apiClient } from "../../lib/api-client";

export function IssuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { issue, loading, error } = useIssue(id);
  const { comments, refetch } = useComments(id);

  const [newStatus, setNewStatus] = useState<Status | "">("");
  const [note, setNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [statusError, setStatusError] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const canDelete =
    user?.id === issue.reportedById ||
    user?.roles?.includes("moderator") ||
    user?.roles?.includes("platform_admin") ||
    user?.roles?.includes("admin");

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

  async function handleDelete() {
    if (
      !confirm(
        "Are you sure you want to delete this issue? This cannot be undone.",
      )
    )
      return;
    try {
      setDeleting(true);
      await apiClient.delete(`/issues/${id}`);
      navigate("/");
    } catch {
      alert("Failed to delete issue.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 flex gap-6 items-start">
      {/* Left column — main content */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Issue header card */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={statusColor(issue.status)}>
                {issue.status}
              </Badge>
              <Badge variant="secondary">{issue.category}</Badge>
            </div>

            {canDelete && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 rounded-xl gap-2 shrink-0"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">{issue.title}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {issue.description}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {issue.neighborhood} · {issue.address}
            </span>
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

        {/* Status Pipeline */}
<div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
  <h3 className="font-semibold text-base mb-4">Status Pipeline</h3>
  <div className="flex items-center gap-0">
    {(["Reported", "Acknowledged", "In Progress", "Resolved"] as const).map((step, index) => {
      const statuses = ["Reported", "Acknowledged", "In Progress", "Resolved"];
      const currentIndex = statuses.indexOf(issue.status);
      const stepIndex = statuses.indexOf(step);
      const isCompleted = stepIndex < currentIndex;
      const isCurrent = stepIndex === currentIndex;
      const isPending = stepIndex > currentIndex;

      return (
        <div key={step} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            {/* Circle */}
            <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${
              isCompleted
                ? "bg-green-500 border-green-500 text-white"
                : isCurrent
                ? `border-current ${statusColor(step)} bg-white`
                : "border-border bg-muted/30 text-muted-foreground/40"
            }`}>
              {isCompleted ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <div className={`h-2.5 w-2.5 rounded-full ${
                  isCurrent ? statusColor(step).split(" ")[1] : "bg-muted-foreground/20"
                }`} />
              )}
            </div>
            {/* Label */}
            <p className={`text-xs mt-2 font-medium text-center ${
              isPending ? "text-muted-foreground/40" : "text-foreground"
            }`}>
              {step}
            </p>
          </div>

          {/* Connector line */}
          {index < 3 && (
            <div className={`h-0.5 w-full -mt-5 ${
              isCompleted ? "bg-green-500" : "bg-border"
            }`} />
          )}
        </div>
      );
    })}
  </div>
</div>

        {/* Status History */}
        {issue.progressLogs && issue.progressLogs.length > 0 && (
          <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4 shadow-sm">
            <h3 className="font-semibold text-base">Progress Log</h3>
            <div className="space-y-3">
              {issue.progressLogs.map((log: any, index: number) => (
                <div
                  key={log.id}
                  className="pb-4 border-b border-border/40 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(log.toStatus as any)}`}
                    >
                      {log.toStatus}
                    </span>
                  </div>
                  {log.note && (
                    <p className="text-sm text-muted-foreground mt-1.5">
                      {log.note}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
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
      {/* Right column — issue info */}
      <div className="w-64 shrink-0 space-y-4 sticky top-6">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Issue info
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Reported by</p>
              <p className="text-sm font-medium mt-0.5">
                {(issue as any).reporter?.name ?? "Community member"}
              </p>
            </div>

            <div className="border-t border-border/40 pt-3">
              <p className="text-xs text-muted-foreground">Upvotes</p>
              <p className="text-3xl font-bold text-primary mt-0.5">
                {(issue as any).upvotes ?? 0}
              </p>
            </div>

            <div className="border-t border-border/40 pt-3">
              <p className="text-xs text-muted-foreground">Submitted</p>
              <p className="text-sm font-medium mt-0.5">
                {new Date(issue.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
