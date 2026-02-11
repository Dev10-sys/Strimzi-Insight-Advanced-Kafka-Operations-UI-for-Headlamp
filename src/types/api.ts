export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
}

export interface ApiError {
  message: string;
  code?: number;
  reason?: string;
  details?: unknown;
}

export interface ListResponse<T> {
  apiVersion: string;
  kind: string;
  metadata: {
    resourceVersion: string;
    continue?: string;
    remainingItemCount?: number;
  };
  items: T[];
}

export interface WatchEvent<T> {
  type: 'ADDED' | 'MODIFIED' | 'DELETED' | 'ERROR';
  object: T;
}

export interface ResourceClientConfig {
  cluster?: string;
  namespace?: string;
}

export interface QueryOptions {
  namespace?: string;
  labelSelector?: string;
  fieldSelector?: string;
  limit?: number;
  continue?: string;
}

export interface CreateOptions {
  namespace: string;
}

export interface UpdateOptions {
  namespace: string;
  name: string;
}

export interface DeleteOptions {
  namespace: string;
  name: string;
  propagationPolicy?: 'Foreground' | 'Background' | 'Orphan';
}

export interface PatchOptions {
  namespace: string;
  name: string;
  patchType?: 'application/json-patch+json' | 'application/merge-patch+json' | 'application/strategic-merge-patch+json';
}
