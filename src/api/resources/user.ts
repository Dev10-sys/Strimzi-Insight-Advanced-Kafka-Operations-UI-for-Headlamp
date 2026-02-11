import { KubernetesApiClient } from '../client';
import { KafkaUser, StrimziCondition } from '../../types/crds';
import { ResourceClientConfig, ApiResponse } from '../../types/api';

export class KafkaUserClient extends KubernetesApiClient<KafkaUser> {
  constructor(config?: ResourceClientConfig) {
    super('kafka.strimzi.io', 'v1beta2', 'kafkausers', config);
  }

  getReadyCondition(user: KafkaUser): StrimziCondition | undefined {
    return user.status?.conditions?.find((c) => c.type === 'Ready');
  }

  isReady(user: KafkaUser): boolean {
    const condition = this.getReadyCondition(user);
    return condition?.status === 'True';
  }

  getUsername(user: KafkaUser): string {
    return user.status?.username || user.metadata?.name || 'unknown';
  }

  getSecretName(user: KafkaUser): string | undefined {
    return user.status?.secret;
  }

  getAuthenticationType(user: KafkaUser): string | undefined {
    return user.spec?.authentication?.type;
  }

  hasAuthorization(user: KafkaUser): boolean {
    return user.spec?.authorization !== undefined;
  }

  getAclCount(user: KafkaUser): number {
    return user.spec?.authorization?.acls?.length || 0;
  }

  hasQuotas(user: KafkaUser): boolean {
    return user.spec?.quotas !== undefined;
  }

  async updateQuotas(
    namespace: string,
    name: string,
    quotas: {
      producerByteRate?: number;
      consumerByteRate?: number;
      requestPercentage?: number;
    }
  ): Promise<ApiResponse<KafkaUser>> {
    const patch = {
      spec: {
        quotas,
      },
    };

    return this.patch(patch, { namespace, name });
  }

  async updateAcls(
    namespace: string,
    name: string,
    acls: Array<{
      resource: {
        type: 'topic' | 'group' | 'cluster' | 'transactionalId';
        name?: string;
        patternType?: 'literal' | 'prefix';
      };
      operation: string;
      host?: string;
    }>
  ): Promise<ApiResponse<KafkaUser>> {
    const patch = {
      spec: {
        authorization: {
          type: 'simple',
          acls,
        },
      },
    };

    return this.patch(patch, { namespace, name });
  }

  /**
   * Triggers credential regeneration by setting the Strimzi force-renew annotation.
   */
  async regenerateCredentials(namespace: string, name: string): Promise<ApiResponse<KafkaUser>> {
    const patch = {
      metadata: {
        annotations: {
          'strimzi.io/force-renew-credentials': 'true',
        },
      },
    };

    return this.patch(patch, { namespace, name });
  }
}
