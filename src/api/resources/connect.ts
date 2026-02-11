import { KubernetesApiClient } from '../client';
import { KafkaConnect, StrimziCondition } from '../../types/crds';
import { ResourceClientConfig, ApiResponse } from '../../types/api';

export class KafkaConnectClient extends KubernetesApiClient<KafkaConnect> {
  constructor(config?: ResourceClientConfig) {
    super('kafka.strimzi.io', 'v1beta2', 'kafkaconnects', config);
  }

  getReadyCondition(connect: KafkaConnect): StrimziCondition | undefined {
    return connect.status?.conditions?.find((c) => c.type === 'Ready');
  }

  isReady(connect: KafkaConnect): boolean {
    const condition = this.getReadyCondition(connect);
    return condition?.status === 'True';
  }

  getUrl(connect: KafkaConnect): string | undefined {
    return connect.status?.url;
  }

  getReplicas(connect: KafkaConnect): number {
    return connect.spec?.replicas || 0;
  }

  getActualReplicas(connect: KafkaConnect): number | undefined {
    return connect.status?.replicas;
  }

  getBootstrapServers(connect: KafkaConnect): string {
    return connect.spec?.bootstrapServers || '';
  }

  getConnectorPlugins(connect: KafkaConnect): Array<{
    type: string;
    version: string;
    class: string;
  }> {
    return connect.status?.connectorPlugins || [];
  }

  hasBuild(connect: KafkaConnect): boolean {
    return connect.spec?.build !== undefined;
  }

  getBuildPlugins(connect: KafkaConnect): string[] {
    return connect.spec?.build?.plugins?.map((p) => p.name) || [];
  }

  async scale(
    namespace: string,
    name: string,
    replicas: number
  ): Promise<ApiResponse<KafkaConnect>> {
    const patch = {
      spec: {
        replicas,
      },
    };

    return this.patch(patch, { namespace, name });
  }

  async updateConfig(
    namespace: string,
    name: string,
    config: Record<string, string | number>
  ): Promise<ApiResponse<KafkaConnect>> {
    const patch = {
      spec: {
        config,
      },
    };

    return this.patch(patch, { namespace, name });
  }
}
