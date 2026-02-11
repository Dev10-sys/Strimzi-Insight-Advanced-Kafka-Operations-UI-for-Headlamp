import React from 'react';
import { K8s } from "@kinvolk/headlamp-plugin/lib";

type KubeObjectInterface = K8s.cluster.KubeObjectInterface;
import { KubernetesApiClient } from '../api/client';
import { ApiResponse, QueryOptions } from '../types/api';

export interface UseResourceReturn<T> {
  items: T[] | null;
  error: Error | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export interface UseSingleResourceReturn<T> {
  item: T | null;
  error: Error | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useResourceList<T extends KubeObjectInterface>(
  client: KubernetesApiClient<T>,
  options?: QueryOptions
): UseResourceReturn<T> {
  const [items, setItems] = React.useState<T[] | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse<{ items: T[] }> = await client.list(options);
      if (response.error) {
        throw new Error(response.error.message || 'Unknown error fetching resources');
      }
      setItems(response.data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [client, options]); // Dependencies should be stable references if possible

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { items, error, loading, refresh: fetchData };
}

export function useResourceItem<T extends KubeObjectInterface>(
  client: KubernetesApiClient<T>,
  namespace: string,
  name: string
): UseSingleResourceReturn<T> {
  const [item, setItem] = React.useState<T | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.get(namespace, name);
      if (response.error) {
        throw new Error(response.error.message || `Error fetching resource ${namespace}/${name}`);
      }
      setItem(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [client, namespace, name]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { item, error, loading, refresh: fetchData };
}
