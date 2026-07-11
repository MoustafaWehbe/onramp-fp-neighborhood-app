import { useState, useEffect } from "react";
import { apiClient } from "../lib/api-client";

export interface ApiNeighborhood {
  id: string;
  name: string;
  slug: string;
  city: string;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
}

export function useNeighborhoods() {
  const [neighborhoods, setNeighborhoods] = useState<ApiNeighborhood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    apiClient
      .get<{ data: ApiNeighborhood[] }>("/neighborhoods")
      .then((res) => {
        if (!ignore) setNeighborhoods(res.data.data);
      })
      .catch(() => {
        if (!ignore) setNeighborhoods([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return { neighborhoods, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    apiClient
      .get<{ data: ApiCategory[] }>("/categories")
      .then((res) => {
        if (!ignore) setCategories(res.data.data);
      })
      .catch(() => {
        if (!ignore) setCategories([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return { categories, loading };
}
