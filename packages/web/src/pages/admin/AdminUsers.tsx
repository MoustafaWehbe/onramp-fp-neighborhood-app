import { useState } from "react";
import { Shield, UserCog, CheckCircle, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roles = [
  { value: "resident", label: "Resident" },
  { value: "moderator", label: "Authority Representative" },
  { value: "admin", label: "Admin" },
  { value: "platform_admin", label: "Platform Admin" },
];

export function AdminUsers() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("resident");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setSuccess(null);
      setError(null);

      await apiClient.patch(`/admin/users/${userId}/role`, { role });

      setSuccess("User role updated successfully.");
    } catch {
      setError(
        "Failed to update user role. Check the user ID and your permissions."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Shield className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Admin User Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Assign platform roles to existing users.
          </p>
        </div>
      </div>

      <div className="grid max-w-3xl gap-6">
        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              <CardTitle>Update user role</CardTitle>
            </div>
            <CardDescription>
              Enter the user ID and choose the role to assign. Only platform
              admins should have access to this action.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {success && (
                <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2.5 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {success}
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  placeholder="Paste user UUID here"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be replaced with a user search/table once the user
                  listing endpoint is available.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !userId.trim()}
                className="w-full sm:w-auto">
                {isSubmitting ? "Updating..." : "Update role"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
