import { ApiProxy, K8s } from '@kinvolk/headlamp-plugin/lib';

type KubeObjectInterface = K8s.cluster.KubeObjectInterface;
import {
  ApiResponse,
  ApiError,
  ListResponse,
  QueryOptions,
  CreateOptions,
  UpdateOptions,
  DeleteOptions,
  PatchOptions,
  ResourceClientConfig,
} from '../types/api';

export class KubernetesApiClient<T extends KubeObjectInterface> {
  protected group: string;
  protected version: string;
  protected plural: string;
  protected cluster?: string;

  constructor(group: string, version: string, plural: string, config?: ResourceClientConfig) {
    this.group = group;
    this.version = version;
    this.plural = plural;
    this.cluster = config?.cluster;
  }

  protected buildUrl(namespace?: string, name?: string): string {
    const parts = ['/apis', this.group, this.version];

    if (namespace) {
      parts.push('namespaces', namespace);
    }

    parts.push(this.plural);

    if (name) {
      parts.push(name);
    }

    return parts.join('/');
  }

  protected buildQueryString(options?: QueryOptions): string {
    if (!options) return '';

    const params = new URLSearchParams();

    if (options.labelSelector) {
      params.append('labelSelector', options.labelSelector);
    }

    if (options.fieldSelector) {
      params.append('fieldSelector', options.fieldSelector);
    }

    if (options.limit) {
      params.append('limit', options.limit.toString());
    }

    if (options.continue) {
      params.append('continue', options.continue);
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  }

  protected async request<R>(
    method: string,
    url: string,
    body?: unknown
  ): Promise<ApiResponse<R>> {
    try {
      const response = await ApiProxy.request(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        cluster: this.cluster,
      });

      return {
        data: response as R,
      };
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      };

      return {
        data: {} as R,
        error: apiError,
      };
    }
  }

  async list(options?: QueryOptions): Promise<ApiResponse<ListResponse<T>>> {
    const namespace = options?.namespace;
    const url = this.buildUrl(namespace) + this.buildQueryString(options);
    return this.request<ListResponse<T>>('GET', url);
  }

  async get(namespace: string, name: string): Promise<ApiResponse<T>> {
    const url = this.buildUrl(namespace, name);
    return this.request<T>('GET', url);
  }

  async create(resource: T, options: CreateOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(options.namespace);
    return this.request<T>('POST', url, resource);
  }

  async update(resource: T, options: UpdateOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(options.namespace, options.name);
    return this.request<T>('PUT', url, resource);
  }

  async delete(options: DeleteOptions): Promise<ApiResponse<void>> {
    const url = this.buildUrl(options.namespace, options.name);
    const body = options.propagationPolicy
      ? { propagationPolicy: options.propagationPolicy }
      : undefined;
    return this.request<void>('DELETE', url, body);
  }

  async patch(patch: object | unknown[], options: PatchOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(options.namespace, options.name);
    const headers = {
      'Content-Type': options.patchType || 'application/merge-patch+json',
    };

    try {
      const response = await ApiProxy.request(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(patch),
        cluster: this.cluster,
      });

      return {
        data: response as T,
      };
    } catch (error) {
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error,
      };

      return {
        data: {} as T,
        error: apiError,
      };
    }
  }
}
