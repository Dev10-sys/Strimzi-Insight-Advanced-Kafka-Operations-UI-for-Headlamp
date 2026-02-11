import { K8s } from "@kinvolk/headlamp-plugin/lib";

type KubeObjectInterface = K8s.cluster.KubeObjectInterface;
type KubeCondition = K8s.cluster.KubeCondition;

export interface StrimziCondition extends KubeCondition {
  type: string;
  status: "True" | "False" | "Unknown";
  lastTransitionTime?: string;
  reason?: string;
  message?: string;
}

export interface KafkaListenerStatus {
  type: string;
  addresses: Array<{
    host: string;
    port: number;
  }>;
  bootstrapServers?: string;
  certificates?: string[];
}

export interface KafkaSpec {
  kafka: {
    version?: string;
    replicas?: number;
    listeners: Array<{
      name: string;
      port: number;
      type: "internal" | "route" | "loadbalancer" | "nodeport" | "ingress";
      tls: boolean;
      authentication?: {
        type: "tls" | "scram-sha-512" | "oauth" | "plain";
      };
      configuration?: Record<string, unknown>;
    }>;
    config?: Record<string, string | number>;
    storage: {
      type: "ephemeral" | "persistent-claim" | "jbod";
      size?: string;
      deleteClaim?: boolean;
      class?: string;
      volumes?: Array<{
        id: number;
        type: string;
        size: string;
        deleteClaim?: boolean;
      }>;
    };
    resources?: {
      requests?: {
        memory?: string;
        cpu?: string;
      };
      limits?: {
        memory?: string;
        cpu?: string;
      };
    };
    jvmOptions?: {
      "-Xms"?: string;
      "-Xmx"?: string;
      gcLoggingEnabled?: boolean;
    };
    metricsConfig?: {
      type: "jmxPrometheusExporter";
      valueFrom: {
        configMapKeyRef: {
          name: string;
          key: string;
        };
      };
    };
  };
  zookeeper?: {
    replicas?: number;
    storage?: {
      type: "ephemeral" | "persistent-claim";
      size?: string;
      deleteClaim?: boolean;
      class?: string;
    };
    resources?: {
      requests?: {
        memory?: string;
        cpu?: string;
      };
      limits?: {
        memory?: string;
        cpu?: string;
      };
    };
  };
  entityOperator?: {
    topicOperator?: Record<string, unknown>;
    userOperator?: Record<string, unknown>;
  };
  kafkaExporter?: {
    topicRegex?: string;
    groupRegex?: string;
  };
  cruiseControl?: {
    brokerCapacity?: {
      cpu?: string;
      inboundNetwork?: string;
      outboundNetwork?: string;
    };
    config?: Record<string, string>;
  };
}

export interface KafkaStatus {
  conditions?: StrimziCondition[];
  observedGeneration?: number;
  listeners?: KafkaListenerStatus[];
  clusterId?: string;
}

export interface Kafka extends KubeObjectInterface {
  spec?: KafkaSpec;
  status?: KafkaStatus;
}

export interface KafkaTopicSpec {
  partitions?: number;
  replicas?: number;
  config?: Record<string, string>;
  topicName?: string;
}

export interface KafkaTopicStatus {
  conditions?: StrimziCondition[];
  observedGeneration?: number;
  topicName?: string;
}

export interface KafkaTopic extends KubeObjectInterface {
  spec?: KafkaTopicSpec;
  status?: KafkaTopicStatus;
}

export interface KafkaUserSpec {
  authentication?: {
    type: "tls" | "scram-sha-512" | "oauth" | "scram-sha-256";
  };
  authorization?: {
    type: "simple" | "opa" | "custom";
    acls?: Array<{
      resource: {
        type: "topic" | "group" | "cluster" | "transactionalId";
        name?: string;
        patternType?: "literal" | "prefix";
      };
      operation:
        | "Read"
        | "Write"
        | "Create"
        | "Delete"
        | "Alter"
        | "Describe"
        | "ClusterAction"
        | "AlterConfigs"
        | "DescribeConfigs"
        | "IdempotentWrite"
        | "All";
      host?: string;
    }>;
  };
  quotas?: {
    producerByteRate?: number;
    consumerByteRate?: number;
    requestPercentage?: number;
    controllerMutationRate?: number;
  };
}

export interface KafkaUserStatus {
  conditions?: StrimziCondition[];
  observedGeneration?: number;
  username?: string;
  secret?: string;
}

export interface KafkaUser extends KubeObjectInterface {
  spec?: KafkaUserSpec;
  status?: KafkaUserStatus;
}

export interface KafkaConnectSpec {
  version?: string;
  replicas?: number;
  bootstrapServers?: string;
  tls?: {
    trustedCertificates?: Array<{
      secretName: string;
      certificate: string;
    }>;
  };
  authentication?: {
    type: "tls" | "scram-sha-512" | "oauth" | "plain";
    certificateAndKey?: {
      secretName: string;
      certificate: string;
      key: string;
    };
    username?: string;
    passwordSecret?: {
      secretName: string;
      password: string;
    };
  };
  config?: Record<string, string | number>;
  resources?: {
    requests?: {
      memory?: string;
      cpu?: string;
    };
    limits?: {
      memory?: string;
      cpu?: string;
    };
  };
  build?: {
    output: {
      type: "docker" | "imagestream";
      image: string;
    };
    plugins: Array<{
      name: string;
      artifacts: Array<{
        type: "tgz" | "jar" | "zip" | "maven";
        url?: string;
        sha512sum?: string;
      }>;
    }>;
  };
  externalConfiguration?: {
    env?: Array<{
      name: string;
      valueFrom: {
        secretKeyRef?: {
          name: string;
          key: string;
        };
        configMapKeyRef?: {
          name: string;
          key: string;
        };
      };
    }>;
    volumes?: Array<{
      name: string;
      secret?: {
        secretName: string;
      };
      configMap?: {
        name: string;
      };
    }>;
  };
}

export interface KafkaConnectStatus {
  conditions?: StrimziCondition[];
  observedGeneration?: number;
  url?: string;
  connectorPlugins?: KafkaConnectorPlugin[];
  labelSelector?: string;
  replicas?: number;
}

export interface KafkaConnectorPlugin {
  type: string;
  version: string;
  class: string;
}

export interface KafkaConnect extends KubeObjectInterface {
  spec?: KafkaConnectSpec;
  status?: KafkaConnectStatus;
}

export interface KafkaConnectorSpec {
  class?: string;
  tasksMax?: number;
  config?: Record<string, string | number | boolean>;
  pause?: boolean;
  autoRestart?: {
    enabled: boolean;
  };
}

export interface KafkaConnectorStatus {
  conditions?: StrimziCondition[];
  observedGeneration?: number;
  connectorStatus?: {
    name: string;
    connector: {
      state: "RUNNING" | "FAILED" | "PAUSED" | "STOPPED" | "UNASSIGNED";
      worker_id: string;
    };
    tasks: Array<{
      id: number;
      state: "RUNNING" | "FAILED" | "PAUSED" | "STOPPED" | "UNASSIGNED";
      worker_id: string;
      trace?: string;
    }>;
    type: "sink" | "source";
  };
  tasksMax?: number;
  topics?: string[];
}

export interface KafkaConnector extends KubeObjectInterface {
  spec?: KafkaConnectorSpec;
  status?: KafkaConnectorStatus;
}

export type StrimziResource =
  | Kafka
  | KafkaTopic
  | KafkaUser
  | KafkaConnect
  | KafkaConnector;
