import { KafkaClient } from './resources/kafka';
import { KafkaTopicClient } from './resources/topic';
import { KafkaUserClient } from './resources/user';
import { KafkaConnectClient } from './resources/connect';
import { KafkaConnectorClient } from './resources/connector';

/**
 * Service factory for singleton API clients.
 * Ensures consistent configuration and stable references across the plugin.
 */
class ApiFactory {
  private static instance: ApiFactory;
  
  private clients: Record<string, object> = {};

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): ApiFactory {
    if (!ApiFactory.instance) {
      ApiFactory.instance = new ApiFactory();
    }
    return ApiFactory.instance;
  }

  public getKafkaClient(): KafkaClient {
    if (!this.clients.kafka) {
      this.clients.kafka = new KafkaClient();
    }
    return this.clients.kafka as KafkaClient;
  }

  public getTopicClient(): KafkaTopicClient {
    if (!this.clients.topic) {
      this.clients.topic = new KafkaTopicClient();
    }
    return this.clients.topic as KafkaTopicClient;
  }

  public getUserClient(): KafkaUserClient {
    if (!this.clients.user) {
      this.clients.user = new KafkaUserClient();
    }
    return this.clients.user as KafkaUserClient;
  }

  public getConnectClient(): KafkaConnectClient {
    if (!this.clients.connect) {
      this.clients.connect = new KafkaConnectClient();
    }
    return this.clients.connect as KafkaConnectClient;
  }

  public getConnectorClient(): KafkaConnectorClient {
    if (!this.clients.connector) {
      this.clients.connector = new KafkaConnectorClient();
    }
    return this.clients.connector as KafkaConnectorClient;
  }
}

export const apiFactory = ApiFactory.getInstance();
