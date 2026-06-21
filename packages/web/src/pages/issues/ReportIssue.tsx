import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function ReportIssue() {
  const [title, setTitle] = useState("");

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">Report an Issue</h2>

      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Pothole on Elm Street"
        />
      </div>
    </div>
  );
}