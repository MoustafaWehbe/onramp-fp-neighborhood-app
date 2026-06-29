import { useState } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../../lib/app-state";
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

export function IssuePage() {
  const { id } = useParams();
  const { issues, updateStatus } = useApp();
  const { user } = useAuth();
  const issue = issues.find((i) => i.id === id);

  const [newStatus, setNewStatus] = useState<Status | "">("");
  const [note, setNote] = useState("");

  if (!issue) {
    return <p className="p-6">Issue not found.</p>;
  }

  const isCityWorker = user?.role === "Authority";

  function handleUpdateStatus() {
    if (!issue) {
      return;
    }
    if (!newStatus || !note.trim()) {
      alert("Please select a status and add a note.");
      return;
    }
    updateStatus(issue.id, newStatus, note);
    setNewStatus("");
    setNote("");
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

          <Button onClick={handleUpdateStatus}>Update status</Button>
        </div>
      )}

      <CommentSection issue={issue} />
    </div>
  );
}
