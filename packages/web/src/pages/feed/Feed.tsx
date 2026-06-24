import { useState, useMemo } from "react";
import { useApp } from "../../lib/app-state";
import { IssueCard } from "../../components/issue-card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  CATEGORIES,
  NEIGHBORHOODS,
  type Status,
  type Category,
} from "../../lib/mock-data";

const STATUSES: Status[] = [
  "Reported",
  "Acknowledged",
  "In Progress",
  "Resolved",
];

export function Feed() {
  const { issues } = useApp();

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

  return (
    <div className="flex flex-col h-full">
      {/* search bar */}
      <div className="px-6 pt-5 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues by title or description..."
            className="pl-9 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      {/* filter bar */}
      <div className="px-6 py-3 space-y-3">
        {/* status filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Status
          </span>
          {["All", ...STATUSES].map((s) => (
            <Badge
              key={s}
              variant={activeStatus === s ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => setActiveStatus(s as Status | "All")}
            >
              {s}
            </Badge>
          ))}
        </div>

        {/* category filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground shrink-0 w-[72px]">
            Category
          </span>
          {["All", ...CATEGORIES].map((c) => (
            <Badge
              key={c}
              variant={activeCategory === c ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => setActiveCategory(c as Category | "All")}
            >
              {c}
            </Badge>
          ))}
        </div>

        {/* neighborhood filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground shrink-0 w-[72px]">
            Area
          </span>
          {["All", ...NEIGHBORHOODS].map((n) => (
            <Badge
              key={n}
              variant={activeNeighborhood === n ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => setActiveNeighborhood(n)}
            >
              {n}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* results count */}
      <div className="px-6 py-2">
        <p className="text-xs text-muted-foreground">
          {filtered.length} issue{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* issue list */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="space-y-4 pt-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-8 w-8 text-muted-foreground/40 mb-3" />
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
