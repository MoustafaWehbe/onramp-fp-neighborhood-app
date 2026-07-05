import { useState } from "react";

import { timeAgo } from "../lib/mock-data";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { apiClient } from "../lib/api-client";
export function CommentSection({ issue, comments = [] }: { issue: any; comments?: any[] }) {
  const [text, setText] = useState("");

  async function handleSubmit() {
    if (text.trim() === "") return;
    try {
      await apiClient.post(`/issues/${issue.id}/comments`, { body: text });
      setText("");
      window.location.reload();
    } catch {
      alert("Failed to post comment.");
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
            <span className="font-medium">{comment.author}</span>
            <Badge variant="outline">{comment.role}</Badge>
            <span className="text-muted-foreground">{timeAgo(comment.createdAt)}</span>
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
        <Button onClick={handleSubmit}>Post comment</Button>
      </div>
    </div>
  );
}
