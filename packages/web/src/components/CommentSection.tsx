import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { timeAgo } from "../lib/mock-data";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { apiClient } from "../lib/api-client";
import { MessageCircle, Send } from "lucide-react";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <span className="text-xs font-semibold text-primary">{initials}</span>
    </div>
  );
}

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
    if (text.trim() === "" || submitting) return;
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

  const authorName = (comment: any) =>
    comment.authorId === user?.id
      ? "You"
      : (comment.author?.name ?? "Community member");

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-semibold text-base">
          Comments
          {comments.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({comments.length})
            </span>
          )}
        </h3>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No comments yet. Be the first to comment.
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment: any) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar name={authorName(comment)} />
              <div className="flex-1 min-w-0">
                <div className="rounded-xl bg-muted/40 px-4 py-3">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-medium text-foreground">
                      {authorName(comment)}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {comment.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add comment */}
      <div className="space-y-3 pt-2 border-t border-border/40">
        <div className="flex gap-3">
          <Avatar name={user?.name ?? "U"} />
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            className="rounded-xl resize-none flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit();
              }
            }}
          />
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={submitting || !text.trim()}
            size="sm"
            className="rounded-xl gap-2"
          >
            <Send className="h-3.5 w-3.5" />
            {submitting ? "Posting..." : "Post comment"}
          </Button>
        </div>
      </div>
    </div>
  );
}