import { KubernetesApiClient } from '../client';
import { KafkaTopic, StrimziCondition } from '../../types/crds';
import { ResourceClientConfig, ApiResponse } from '../../types/api';

export class KafkaTopicClient extends KubernetesApiClient<KafkaTopic> {
  constructor(config?: ResourceClientConfig) {
    super('kafka.strimzi.io', 'v1beta2', 'kafkatopics', config);
  }

  getReadyCondition(topic: KafkaTopic): StrimziCondition | undefined {
    return topic.status?.conditions?.find((c) => c.type === 'Ready');
  }

  isReady(topic: KafkaTopic): boolean {
    const condition = this.getReadyCondition(topic);
    return condition?.status === 'True';
  }

  getTopicName(topic: KafkaTopic): string {
    return topic.status?.topicName || topic.spec?.topicName || topic.metadata?.name || 'unknown';
  }

  getPartitions(topic: KafkaTopic): number {
    return topic.spec?.partitions || 0;
  }

  getReplicas(topic: KafkaTopic): number {
    return topic.spec?.replicas || 0;
  }

  getConfig(topic: KafkaTopic): Record<string, string> {
    return topic.spec?.config || {};
  }

  async updatePartitions(
    namespace: string,
    name: string,
    partitions: number
  ): Promise<ApiResponse<KafkaTopic>> {
    const patch = {
      spec: {
        partitions,
      },
    };

    return this.patch(patch, { namespace, name });
  }

  async updateConfig(
    namespace: string,
    name: string,
    config: Record<string, string>
  ): Promise<ApiResponse<KafkaTopic>> {
    const patch = {
      spec: {
        config,
      },
    };

    return this.patch(patch, { namespace, name });
  }
}
