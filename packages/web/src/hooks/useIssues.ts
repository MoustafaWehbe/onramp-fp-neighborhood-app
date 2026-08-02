import { useState, useEffect } from "react";
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
  comments?: { id: string }[];
  progressLogs?: {
    id: string;
    fromStatus: string;
    toStatus: string;
    note: string;
    createdAt: string;
  }[];
}

interface UseIssuesFilters {
  neighborhood?: string;
  status?: string;
  category?: string;
  page?: number;
  dateFrom?: string;
  dateTo?: string;
}

export function useIssues(filters: UseIssuesFilters = {}) {
  const [issues, setIssues] = useState<ApiIssue[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchIssues() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.neighborhood)
          params.set("neighborhood", filters.neighborhood);
        if (filters.status) params.set("status", filters.status);
        if (filters.category) params.set("category", filters.category);
        if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
        if (filters.dateTo) params.set("dateTo", filters.dateTo);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
        if (filters.dateTo) params.set("dateTo", filters.dateTo);

        const res = await apiClient.get(`/issues?${params.toString()}`);
        if (!ignore) {
          setIssues(res.data.data.issues);
          setTotal(res.data.data.total);
          setError(null);
        }
      } catch {
        if (!ignore) setError("Failed to load issues");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchIssues();
    return () => {
      ignore = true;
    };
  }, [
    filters.neighborhood,
    filters.status,
    filters.category,
    filters.dateFrom,
    filters.dateTo,
    filters.page,
    filters.dateFrom,
    filters.dateTo,
  ]);

  return { issues, total, loading, error };
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
    return () => {
      ignore = true;
    };
  }, [id]);

  return { issue, loading, error };
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
    return () => {
      ignore = true;
    };
  }, [issueId]);

  function refetch() {
    if (issueId) fetchComments(issueId);
  }

  return { comments, loading, refetch };
}

export interface ApiComment {
  id: string;
  issueId: string;
  authorId: string;
  body: string;
  createdAt: string;
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
      const res = await apiClient.get(
        `/issues/search?q=${encodeURIComponent(query)}`,
      );
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
