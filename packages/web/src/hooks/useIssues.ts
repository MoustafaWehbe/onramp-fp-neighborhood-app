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
}

export function useIssues(filters: UseIssuesFilters = {}) {
  const [issues, setIssues] = useState<ApiIssue[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIssues() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.neighborhood) params.set("neighborhood", filters.neighborhood);
        if (filters.status) params.set("status", filters.status);
        if (filters.category) params.set("category", filters.category);
        if (filters.page) params.set("page", String(filters.page));

        const res = await apiClient.get(`/issues?${params.toString()}`);
        setIssues(res.data.data.issues);
        setTotal(res.data.data.total);
        setError(null);
      } catch (err) {
        setError("Failed to load issues");
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, [filters.neighborhood, filters.status, filters.category, filters.page]);

  return { issues, total, loading, error };
}

export function useIssue(id: string | undefined) {
  const [issue, setIssue] = useState<ApiIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchIssue() {
      try {
        setLoading(true);
        const res = await apiClient.get(`/issues/${id}`);
        setIssue(res.data.data);
        setError(null);
      } catch {
        setError("Issue not found");
      } finally {
        setLoading(false);
      }
    }
    fetchIssue();
  }, [id]);

  return { issue, loading, error };
}