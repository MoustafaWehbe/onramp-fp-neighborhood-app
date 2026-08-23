import { useEffect, useState } from "react";
import { Shield, UserCog, CheckCircle, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
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

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  roles: string[];
  emailVerified: boolean;
  createdAt: string;
  assignedNeighborhood?: string | null;
}

interface AssignableRole {
  value: string;
  label: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<AssignableRole[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [assigningNeighborhood, setAssigningNeighborhood] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setIsLoading(true);
    setError(null);

    try {
      const [usersResponse, rolesResponse, neighborhoodsResponse] = await Promise.all([
        apiClient.get<{ data: AdminUser[] }>("/admin/users"),
        apiClient.get<{ data: AssignableRole[] }>("/admin/roles"),
        apiClient.get<{ data: { id: string; name: string }[] }>("/admin/neighborhoods"),
      ]);

      setUsers(usersResponse.data.data);
      setRoles(rolesResponse.data.data);
      setNeighborhoods(neighborhoodsResponse.data.data.map((n) => n.name));

      const initialRoles: Record<string, string> = {};
      const initialNeighborhoods: Record<string, string> = {};
      for (const user of usersResponse.data.data) {
        initialRoles[user.id] = user.role;
        initialNeighborhoods[user.id] = user.assignedNeighborhood ?? "";
      }
      setSelectedRoles(initialRoles);
      setSelectedNeighborhoods(initialNeighborhoods);
    } catch (err) {
      console.error("AdminUsers loadData error:", err);
      setError("Failed to load admin users.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function updateRole(userId: string) {
    const role = selectedRoles[userId];
    if (!role) return;

    try {
      setUpdatingUserId(userId);
      setSuccess(null);
      setError(null);

      await apiClient.patch(`/admin/users/${userId}/role`, { role });

      setSuccess("User role updated successfully.");
      await loadData();
    } catch {
      setError("Failed to update user role. Check your permissions.");
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function assignNeighborhood(userId: string) {
    const neighborhood = selectedNeighborhoods[userId] || null;
    try {
      setAssigningNeighborhood(userId);
      setSuccess(null);
      setError(null);
      await apiClient.patch(`/admin/users/${userId}/neighborhood`, { neighborhood });
      setSuccess("Neighborhood assigned successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to assign neighborhood.");
    } finally {
      setAssigningNeighborhood(null);
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
            Manage assignable roles for existing users.
          </p>
        </div>
      </div>

      <div className="grid max-w-5xl gap-6">
        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              <CardTitle>Users</CardTitle>
            </div>
            <CardDescription>
              Platform admins can manage all roles. Admins can manage authority representatives and residents only.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
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

            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users found.</p>
            ) : (
              <div className="space-y-3">
                {users
                  .filter((user) => user.role !== "platform_admin")
                  .map((user) => {
                    const isPlatformAdmin = user.role === "platform_admin";
                    const selectedRole = selectedRoles[user.id] ?? user.role;
                    const isUpdating = updatingUserId === user.id;
                    const isModerator = selectedRole === "moderator" || user.role === "moderator";

                    return (
                      <div
                        key={user.id}
                        className="flex flex-col gap-4 rounded-xl border border-border/60 p-4"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">
                              {user.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Current role:{" "}
                              <span className="font-medium">{user.role}</span>
                              {user.assignedNeighborhood && (
                                <span className="ml-2 text-accent">
                                  · {user.assignedNeighborhood}
                                </span>
                              )}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Select
                              value={selectedRole}
                              onValueChange={(value) =>
                                setSelectedRoles((current) => ({
                                  ...current,
                                  [user.id]: value,
                                }))
                              }
                              disabled={isPlatformAdmin}
                            >
                              <SelectTrigger className="w-56">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {roles.map((role) => (
                                  <SelectItem key={role.value} value={role.value}>
                                    {role.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Button
                              type="button"
                              disabled={
                                isPlatformAdmin ||
                                isUpdating ||
                                selectedRole === user.role
                              }
                              onClick={() => updateRole(user.id)}
                            >
                              {isUpdating ? "Updating..." : "Update"}
                            </Button>
                          </div>
                        </div>

                        {/* Neighborhood assignment — only for moderators */}
                        {isModerator && (
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center border-t border-border/40 pt-3">
                            <p className="text-xs text-muted-foreground w-32 shrink-0">
                              Assigned area:
                            </p>
                            <Select
                              value={selectedNeighborhoods[user.id] ?? ""}
                              onValueChange={(value) =>
                                setSelectedNeighborhoods((current) => ({
                                  ...current,
                                  [user.id]: value,
                                }))
                              }
                            >
                              <SelectTrigger className="w-56">
                                <SelectValue placeholder="All neighborhoods" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All neighborhoods</SelectItem>
                                {neighborhoods.map((n) => (
                                  <SelectItem key={n} value={n}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="outline"
                              disabled={assigningNeighborhood === user.id}
                              onClick={() => assignNeighborhood(user.id)}
                            >
                              {assigningNeighborhood === user.id ? "Saving..." : "Save"}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}