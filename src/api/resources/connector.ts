import { KubernetesApiClient } from '../client';
import { KafkaConnector, StrimziCondition } from '../../types/crds';
import { ResourceClientConfig, ApiResponse } from '../../types/api';

export class KafkaConnectorClient extends KubernetesApiClient<KafkaConnector> {
  constructor(config?: ResourceClientConfig) {
    super('kafka.strimzi.io', 'v1beta2', 'kafkaconnectors', config);
  }

  getReadyCondition(connector: KafkaConnector): StrimziCondition | undefined {
    return connector.status?.conditions?.find((c) => c.type === 'Ready');
  }

  isReady(connector: KafkaConnector): boolean {
    const condition = this.getReadyCondition(connector);
    return condition?.status === 'True';
  }

  getConnectorClass(connector: KafkaConnector): string {
    return connector.spec?.class || 'unknown';
  }

  getTasksMax(connector: KafkaConnector): number {
    return connector.spec?.tasksMax || 0;
  }

  getActualTasksMax(connector: KafkaConnector): number | undefined {
    return connector.status?.tasksMax;
  }

  getState(connector: KafkaConnector): string | undefined {
    return connector.status?.connectorStatus?.connector?.state;
  }

  isRunning(connector: KafkaConnector): boolean {
    return this.getState(connector) === 'RUNNING';
  }

  isPaused(connector: KafkaConnector): boolean {
    return connector.spec?.pause === true || this.getState(connector) === 'PAUSED';
  }

  isFailed(connector: KafkaConnector): boolean {
    return this.getState(connector) === 'FAILED';
  }

  getType(connector: KafkaConnector): 'sink' | 'source' | undefined {
    return connector.status?.connectorStatus?.type;
  }

  getTopics(connector: KafkaConnector): string[] {
    return connector.status?.topics || [];
  }

  getTasks(connector: KafkaConnector): Array<{
    id: number;
    state: string;
    worker_id: string;
  }> {
    return connector.status?.connectorStatus?.tasks || [];
  }

  getRunningTasksCount(connector: KafkaConnector): number {
    return this.getTasks(connector).filter((t) => t.state === 'RUNNING').length;
  }

  getFailedTasksCount(connector: KafkaConnector): number {
    return this.getTasks(connector).filter((t) => t.state === 'FAILED').length;
  }

  async pause(namespace: string, name: string): Promise<ApiResponse<KafkaConnector>> {
    const patch = {
      spec: {
        pause: true,
      },
    };

    return this.patch(patch, { namespace, name });
  }

  async resume(namespace: string, name: string): Promise<ApiResponse<KafkaConnector>> {
    const patch = {
      spec: {
        pause: false,
      },
    };

    return this.patch(patch, { namespace, name });
  }

  async updateTasksMax(
    namespace: string,
    name: string,
    tasksMax: number
  ): Promise<ApiResponse<KafkaConnector>> {
    const patch = {
      spec: {
        tasksMax,
      },
    };

    return this.patch(patch, { namespace, name });
  }

  async updateConfig(
    namespace: string,
    name: string,
    config: Record<string, string | number | boolean>
  ): Promise<ApiResponse<KafkaConnector>> {
    const patch = {
      spec: {
        config,
      },
    };

    return this.patch(patch, { namespace, name });
  }
}
