import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { timeAgo } from "../lib/mock-data";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { apiClient } from "../lib/api-client";
export function CommentSection({
  issue,
  comments = [],
  onCommentPosted,
}: {
  issue: any;
  comments?: any[];
  onCommentPosted: () => void;
}) {
  const [text, setText] = useState("");
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  async function handleSubmit() {
    if (text.trim() === "") return;
    try {
      setSubmitting(true);
      await apiClient.post(`/issues/${issue.id}/comments`, { body: text });
      setText("");
      onCommentPosted?.();
    } catch {
      alert("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>

      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      )}

      {comments.map((comment: any) => (
        <div key={comment.id} className="border-b border-border pb-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">
              {comment.authorId === user?.id ? "You" : "community member"}
            </span>
            <Badge variant="outline">{comment.role}</Badge>
            <span className="text-muted-foreground">
              {timeAgo(comment.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-sm">{comment.body}</p>
        </div>
      ))}

      <div className="space-y-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Posting..." : "Post comment"}
        </Button>
      </div>
    </div>
  );
}
