import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../lib/app-state";
import { IssueCard } from "../../components/issue-card";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Clock, TrendingUp, CheckCircle, Search, Sparkles } from "lucide-react";
import {
  CATEGORIES,
  NEIGHBORHOODS,
  type Status,
  type Category,
} from "../../lib/mock-data";

export function Feed() {
  const { issues } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<Status | "All">("All");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [activeNeighborhood, setActiveNeighborhood] = useState<string>("All");

  const filtered = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch =
        search.trim() === "" ||
        issue.title.toLowerCase().includes(search.toLowerCase()) ||
        issue.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        activeStatus === "All" || issue.status === activeStatus;
      const matchesCategory =
        activeCategory === "All" || issue.category === activeCategory;
      const matchesNeighborhood =
        activeNeighborhood === "All" ||
        issue.neighborhood === activeNeighborhood;
      return (
        matchesSearch && matchesStatus && matchesCategory && matchesNeighborhood
      );
    });
  }, [issues, search, activeStatus, activeCategory, activeNeighborhood]);

  const openCount = issues.filter(
    (i) => i.status === "Reported" || i.status === "Acknowledged",
  ).length;
  const inProgressCount = issues.filter(
    (i) => i.status === "In Progress",
  ).length;
  const resolvedCount = issues.filter((i) => i.status === "Resolved").length;

  return (
    <div className="flex flex-col h-full">
      {/* hero banner */}
      <div className="mx-6 mt-5 rounded-2xl bg-gradient-to-br from-slate-100 to-teal-50 border border-border/40 p-8 flex items-center justify-between">
        <div className="space-y-3 max-w-lg">
          <div className="flex items-center gap-2 text-sm text-accent font-medium">
            <Sparkles className="h-4 w-4" />
            AI-routed to the right department
          </div>
          <h2 className="text-4xl font-bold text-foreground/10 leading-tight">
            Track what your city is fixing
            <br />
            <span className="text-foreground/20">
              and what still needs attention.
            </span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Report potholes, broken lights, noise, and more. Follow the status
            from reported to resolved.
          </p>
        </div>
        <Button
          className="rounded-xl px-6 py-5 text-base shrink-0"
          onClick={() => navigate("/report-issue")}
        >
          Report an issue
        </Button>
      </div>

      {/* stats cards */}
      <div className="px-6 pt-4 pb-2 grid grid-cols-3 gap-4">
        <Card className="border border-border/60 rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Open
                </p>
                <p className="text-4xl font-bold mt-1">{openCount}</p>
              </div>
              <div className="h-11 w-11 rounded-full bg-orange-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  In Progress
                </p>
                <p className="text-4xl font-bold mt-1">{inProgressCount}</p>
              </div>
              <div className="h-11 w-11 rounded-full bg-teal-50 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-teal-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Resolved
                </p>
                <p className="text-4xl font-bold mt-1">{resolvedCount}</p>
              </div>
              <div className="h-11 w-11 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* search + filter bar */}
      <div className="px-6 py-3 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={activeNeighborhood}
          onValueChange={setActiveNeighborhood}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All neighborhoods" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All neighborhoods</SelectItem>
            {NEIGHBORHOODS.map((n) => (
              <SelectItem key={n} value={n}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={activeCategory}
          onValueChange={(v) => setActiveCategory(v as Category | "All")}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={activeStatus}
          onValueChange={(v) => setActiveStatus(v as Status | "All")}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All statuses</SelectItem>
            <SelectItem value="Reported">Reported</SelectItem>
            <SelectItem value="Acknowledged">Acknowledged</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* results count */}
      <div className="px-6 py-1">
        <p className="text-xs text-muted-foreground">
          {filtered.length} issue{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* issue list */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="space-y-4 pt-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No issues found
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            filtered.map((issue) => <IssueCard key={issue.id} issue={issue} />)
          )}
        </div>
      </div>
    </div>
  );
}
