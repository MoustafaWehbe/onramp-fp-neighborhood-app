import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DateRange } from "react-day-picker";
import { IssueCard } from "../../components/issue-card";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Clock,
  TrendingUp,
  CheckCircle,
  Search,
  Sparkles,
  SlidersHorizontal,
  CalendarRange,
  X,
} from "lucide-react";
import { type Status } from "../../lib/mock-data";
import { useIssues, useIssueSearch } from "../../hooks/useIssues";
import { useNeighborhoods, useCategories } from "../../hooks/useReferenceData";
import { Badge } from "../../components/ui/badge";

function toISODate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShort(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function Feed() {
  const navigate = useNavigate();
  const { neighborhoods } = useNeighborhoods();
  const { categories } = useCategories();

  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<Status | "All">("All");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeNeighborhood, setActiveNeighborhood] = useState<string>("All");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = [
    activeNeighborhood !== "All",
    activeCategory !== "All",
    activeStatus !== "All",
    Boolean(dateRange?.from),
  ].filter(Boolean).length;

  const { issues, loading, error } = useIssues({
    status: activeStatus === "All" ? undefined : activeStatus,
    category: activeCategory === "All" ? undefined : activeCategory,
    neighborhood: activeNeighborhood === "All" ? undefined : activeNeighborhood,
    dateFrom: dateRange?.from ? toISODate(dateRange.from) : undefined,
    dateTo: dateRange?.to ? toISODate(dateRange.to) : undefined,
  });

  // When there's a search query, use semantic search results (via
  // /issues/search) instead of the locally-fetched, filter-scoped list.
  const isSearching = search.trim() !== "";
  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
  } = useIssueSearch(search);

  const filtered = isSearching ? searchResults : issues;
  const listLoading = isSearching ? searchLoading : loading;
  const listError = isSearching ? searchError : error;

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
            Report potholes, broken lights, noise, and more.
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

      {/* search bar */}
      <div className="px-6 py-3 flex items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="rounded-xl gap-2 shrink-0"
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-0.5 h-5 min-w-5 justify-center px-1.5"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* filter panel — toggled open/closed, independent of the search bar */}
      {showFilters && (
        <div className="px-6 pb-3 flex items-center gap-3 flex-wrap">
          <Select
            value={activeNeighborhood}
            onValueChange={setActiveNeighborhood}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All neighborhoods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All neighborhoods</SelectItem>
              {neighborhoods.map((n) => (
                <SelectItem key={n.id} value={n.name}>
                  {n.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.name}>
                  {c.name}
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

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="gap-2 rounded-xl border-border/60 bg-muted/30 font-normal"
              >
                <CalendarRange className="h-4 w-4 text-muted-foreground" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {formatShort(dateRange.from)} – {formatShort(dateRange.to)}
                    </>
                  ) : (
                    formatShort(dateRange.from)
                  )
                ) : (
                  <span className="text-muted-foreground">Date range</span>
                )}
                {dateRange?.from && (
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label="Clear date range"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDateRange(undefined);
                    }}
                    className="ml-1 flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                defaultMonth={dateRange?.from}
              />
            </PopoverContent>
          </Popover>

          {activeFilterCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => {
                setActiveNeighborhood("All");
                setActiveCategory("All");
                setActiveStatus("All");
                setDateRange(undefined);
              }}
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* results */}
      <div className="px-6 py-1">
        <p className="text-xs text-muted-foreground">
          {listLoading
            ? "Loading..."
            : `${filtered.length} issue${filtered.length !== 1 ? "s" : ""} found`}
        </p>
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="space-y-4 pt-2">
          {listError && (
            <p className="text-sm text-red-500 text-center py-8">{listError}</p>
          )}
          {listLoading && (
            <p className="text-sm text-muted-foreground text-center py-8">
              {isSearching ? "Searching..." : "Loading issues..."}
            </p>
          )}
          {!listLoading && !listError && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No issues found
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {isSearching
                  ? "Try a different search"
                  : "Try adjusting your filters"}
              </p>
            </div>
          )}
          {!listLoading &&
            !listError &&
            filtered.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
        </div>
      </div>
    </div>
  );
}
