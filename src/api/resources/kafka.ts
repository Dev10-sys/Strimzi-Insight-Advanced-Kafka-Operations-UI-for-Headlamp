import { KubernetesApiClient } from '../client';
import { Kafka, StrimziCondition } from '../../types/crds';
import { ResourceClientConfig, ApiResponse } from '../../types/api';

export class KafkaClient extends KubernetesApiClient<Kafka> {
  constructor(config?: ResourceClientConfig) {
    super('kafka.strimzi.io', 'v1beta2', 'kafkas', config);
  }

  getReadyCondition(kafka: Kafka): StrimziCondition | undefined {
    return kafka.status?.conditions?.find((c) => c.type === 'Ready');
  }

  isReady(kafka: Kafka): boolean {
    const condition = this.getReadyCondition(kafka);
    return condition?.status === 'True';
  }

  getBootstrapServers(kafka: Kafka): string | undefined {
    const plainListener = kafka.status?.listeners?.find(
      (l) => l.type === 'plain' || l.type === 'internal'
    );
    return plainListener?.bootstrapServers;
  }

  getListenersByType(kafka: Kafka, type: string): string[] {
    return (
      kafka.status?.listeners
        ?.filter((l) => l.type === type)
        .map((l) => l.bootstrapServers)
        .filter((bs): bs is string => bs !== undefined) || []
    );
  }

  getClusterId(kafka: Kafka): string | undefined {
    return kafka.status?.clusterId;
  }

  getReplicas(kafka: Kafka): number {
    return kafka.spec?.kafka?.replicas || 0;
  }

  getVersion(kafka: Kafka): string | undefined {
    return kafka.spec?.kafka?.version;
  }

  hasZookeeper(kafka: Kafka): boolean {
    return kafka.spec?.zookeeper !== undefined;
  }

  async scale(
    namespace: string,
    name: string,
    replicas: number
  ): Promise<ApiResponse<Kafka>> {
    const patch = {
      spec: {
        kafka: {
          replicas,
        },
      },
    };

    return this.patch(patch, { namespace, name });
  }

  async updateConfig(
    namespace: string,
    name: string,
    config: Record<string, string | number>
  ): Promise<ApiResponse<Kafka>> {
    const patch = {
      spec: {
        kafka: {
          config,
        },
      },
    };

    return this.patch(patch, { namespace, name });
  }
}
