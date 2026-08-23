import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../lib/api-client";

export interface ApiIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  neighborhood: string;
  address: string;
  status: "Reported" | "Acknowledged" | "In Progress" | "Resolved";
  reportedById: string;
  aiRoutingNote?: string | null;
  createdAt: string;
  progressLogs?: {
    id: string;
    fromStatus: string;
    toStatus: string;
    note: string;
    createdAt: string;
  }[];
  comments?: { id: string }[];
  upvotes?: number;
  reporterName?: string;
}

interface UseIssuesFilters {
  neighborhood?: string;
  status?: string;
  category?: string;
  page?: number;
  dateFrom?: string;
  dateTo?: string;
  enabled?: boolean;
}

export function useIssues(filters: UseIssuesFilters = {}) {
  const [issues, setIssues] = useState<ApiIssue[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = useCallback(async () => {
    if (filters.enabled === false) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.neighborhood) params.set("neighborhood", filters.neighborhood);
      if (filters.status) params.set("status", filters.status);
      if (filters.category) params.set("category", filters.category);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);
      if (filters.page) params.set("page", String(filters.page));

      const res = await apiClient.get(`/issues?${params.toString()}`);
      setIssues(res.data.data.issues);
      setTotal(res.data.data.total);
      setError(null);
    } catch {
      setError("Failed to load issues");
    } finally {
      setLoading(false);
    }
  }, [
    filters.neighborhood,
    filters.status,
    filters.category,
    filters.dateFrom,
    filters.dateTo,
    filters.page,
    filters.enabled,
  ]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return { issues, total, loading, error, refetch: fetchIssues };
}

// Semantic search — calls GET /issues/search?q=, debounced so we're not
// hitting the embeddings API on every keystroke.
export function useIssueSearch(query: string, debounceMs = 350) {
  const [results, setResults] = useState<ApiIssue[]>([]);
  // Populated only when `results` comes back empty — the closest issues
  // to the query even though none cleared the relevance threshold.
  const [suggestions, setSuggestions] = useState<ApiIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    let ignore = false;
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const res = await apiClient.get("/issues/search", {
          params: { q: trimmed },
        });
        if (!ignore) {
          setResults(res.data.data.issues);
          setSuggestions(res.data.data.suggestions ?? []);
          setError(null);
        }
      } catch {
        if (!ignore) {
          setError("Search failed");
          setSuggestions([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }, debounceMs);

    return () => {
      ignore = true;
      clearTimeout(timeout);
    };
  }, [query, debounceMs]);

  return { results, suggestions, loading, error };
}

export function useIssue(id: string | undefined) {
  const [issue, setIssue] = useState<ApiIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let ignore = false;
    async function fetchIssue() {
      try {
        setLoading(true);
        const res = await apiClient.get(`/issues/${id}`);
        if (!ignore) {
          setIssue(res.data.data);
          setError(null);
        }
      } catch {
        if (!ignore) setError("Issue not found");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchIssue();
    return () => { ignore = true; };
  }, [id]);

  return { issue, loading, error };
}

export interface ApiComment {
  id: string;
  issueId: string;
  authorId: string;
  body: string;
  createdAt: string;
  author?: { id: string; name: string };
}

export function useComments(issueId: string | undefined) {
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchComments(id: string) {
    try {
      const res = await apiClient.get(`/issues/${id}/comments`, {
        params: { _t: Date.now() },
      });
      setComments(res.data.data);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!issueId) return;
    let ignore = false;
    async function fetch() {
      try {
        const res = await apiClient.get(`/issues/${issueId}/comments`, {
          params: { _t: Date.now() },
        });
        if (!ignore) setComments(res.data.data);
      } catch {
        if (!ignore) setComments([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetch();
    return () => { ignore = true; };
  }, [issueId]);

  function refetch() {
    if (issueId) fetchComments(issueId);
  }

  return { comments, loading, refetch };
}

export function useSearch() {
  const [results, setResults] = useState<ApiIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function doSearch(query: string) {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get(`/issues/search?q=${encodeURIComponent(query)}`);
      setResults(res.data.data);
    } catch {
      setError("Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setResults([]);
    setError(null);
  }

  return { results, loading, error, doSearch, clear };
}