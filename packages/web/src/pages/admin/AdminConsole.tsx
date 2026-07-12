import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Tag, Users, Plus, ShieldAlert } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  city: string;
}

interface CategoryTag {
  id: string;
  name: string;
  slug: string;
}

interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ADMIN_ROLES = ["admin", "platform_admin"];

export function AdminConsole() {
  const { user } = useAuth();
  const isAdmin = !!user && ADMIN_ROLES.includes(user.role);

  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [categories, setCategories] = useState<CategoryTag[]>([]);
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [newNeighborhood, setNewNeighborhood] = useState("");
  const [addingNeighborhood, setAddingNeighborhood] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadAll() {
    setLoading(true);
    try {
      const [neighborhoodsRes, categoriesRes, usersRes] = await Promise.all([
        apiClient.get<{ data: Neighborhood[] }>("/admin/neighborhoods"),
        apiClient.get<{ data: CategoryTag[] }>("/admin/categories"),
        apiClient.get<{ data: AdminUserSummary[] }>("/admin/users"),
      ]);
      setNeighborhoods(neighborhoodsRes.data.data);
      setCategories(categoriesRes.data.data);
      setUsers(usersRes.data.data);
    } catch {
      setError("Failed to load admin console data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) void loadAll();
    else setLoading(false);
  }, [isAdmin]);

  async function addNeighborhood() {
    if (!newNeighborhood.trim()) return;
    try {
      setAddingNeighborhood(true);
      setError(null);
      await apiClient.post("/admin/neighborhoods", { name: newNeighborhood.trim() });
      setNewNeighborhood("");
      await loadAll();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to add neighborhood.");
    } finally {
      setAddingNeighborhood(false);
    }
  }

  async function addCategory() {
    if (!newCategory.trim()) return;
    try {
      setAddingCategory(true);
      setError(null);
      await apiClient.post("/admin/categories", { name: newCategory.trim() });
      setNewCategory("");
      await loadAll();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to add category.");
    } finally {
      setAddingCategory(false);
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-foreground">
          You don't have access to the Admin Console
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          This area is limited to admins and the platform admin.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-sm text-muted-foreground">
            Manage neighborhoods, categories, and users.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 max-w-5xl rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* stats */}
      <div className="grid max-w-5xl gap-4 sm:grid-cols-3 mb-6">
        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Neighborhoods
                </p>
                <p className="text-4xl font-bold mt-1">
                  {loading ? "–" : neighborhoods.length}
                </p>
              </div>
              <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Categories
                </p>
                <p className="text-4xl font-bold mt-1">
                  {loading ? "–" : categories.length}
                </p>
              </div>
              <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                <Tag className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Active users
                </p>
                <p className="text-4xl font-bold mt-1">
                  {loading ? "–" : users.length}
                </p>
              </div>
              <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* neighborhoods + categories */}
      <div className="grid max-w-5xl gap-6 lg:grid-cols-2 mb-6">
        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>Neighborhoods</CardTitle>
            </div>
            <CardDescription>Add new areas residents can report from.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g. North Heights"
                value={newNeighborhood}
                onChange={(e) => setNewNeighborhood(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNeighborhood()}
              />
              <Button
                type="button"
                size="icon"
                className="shrink-0"
                disabled={addingNeighborhood || !newNeighborhood.trim()}
                onClick={addNeighborhood}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : neighborhoods.length === 0 ? (
                <p className="text-sm text-muted-foreground">No neighborhoods yet.</p>
              ) : (
                neighborhoods.map((n) => (
                  <Badge key={n.id} variant="secondary" className="rounded-full px-3 py-1">
                    {n.name}
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <CardTitle>Category tags</CardTitle>
            </div>
            <CardDescription>Official categories the AI will choose from.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Transit"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
              />
              <Button
                type="button"
                size="icon"
                className="shrink-0"
                disabled={addingCategory || !newCategory.trim()}
                onClick={addCategory}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">No categories yet.</p>
              ) : (
                categories.map((c) => (
                  <Badge key={c.id} variant="secondary" className="rounded-full px-3 py-1">
                    {c.name}
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* users */}
      <div className="max-w-5xl">
        <Card className="rounded-2xl border border-border/60 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Users</CardTitle>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/users">Manage roles</Link>
              </Button>
            </div>
            <CardDescription>Residents and reps active on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users found.</p>
            ) : (
              <div className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between rounded-xl border border-border/60 p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 capitalize">
                      {u.role.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
