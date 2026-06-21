import { useState } from "react";
import { useApp } from "../lib/app-state";
import { timeAgo, type Issue } from "../lib/mock-data";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";

export function CommentSection({ issue }: { issue: Issue }) {
  const { addComment } = useApp();
  const [text, setText] = useState("");

  function handleSubmit() {
    if (text.trim() === "") return;
    addComment(issue.id, text);
    setText("");
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>

      {issue.comments.length === 0 && (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      )}

      {issue.comments.map((comment) => (
        <div key={comment.id} className="border-b border-border pb-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{comment.author}</span>
            <Badge variant="outline">{comment.role}</Badge>
            <span className="text-muted-foreground">{timeAgo(comment.at)}</span>
          </div>
          <p className="mt-1 text-sm">{comment.text}</p>
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