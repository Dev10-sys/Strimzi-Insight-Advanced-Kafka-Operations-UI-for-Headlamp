export const STRIMZI_GROUP = 'kafka.strimzi.io';
export const STRIMZI_VERSION = 'v1beta2';

export const CRD_METADATA = {
  KAFKA: {
    group: STRIMZI_GROUP,
    version: STRIMZI_VERSION,
    plural: 'kafkas',
    kind: 'Kafka',
    namespaced: true,
  },
  KAFKA_TOPIC: {
    group: STRIMZI_GROUP,
    version: STRIMZI_VERSION,
    plural: 'kafkatopics',
    kind: 'KafkaTopic',
    namespaced: true,
  },
  KAFKA_USER: {
    group: STRIMZI_GROUP,
    version: STRIMZI_VERSION,
    plural: 'kafkausers',
    kind: 'KafkaUser',
    namespaced: true,
  },
  KAFKA_CONNECT: {
    group: STRIMZI_GROUP,
    version: STRIMZI_VERSION,
    plural: 'kafkaconnects',
    kind: 'KafkaConnect',
    namespaced: true,
  },
  KAFKA_CONNECTOR: {
    group: STRIMZI_GROUP,
    version: STRIMZI_VERSION,
    plural: 'kafkaconnectors',
    kind: 'KafkaConnector',
    namespaced: true,
  },
} as const;

export const CONDITION_TYPES = {
  READY: 'Ready',
  NOT_READY: 'NotReady',
} as const;

export const CONNECTOR_STATES = {
  RUNNING: 'RUNNING',
  FAILED: 'FAILED',
  PAUSED: 'PAUSED',
  STOPPED: 'STOPPED',
  UNASSIGNED: 'UNASSIGNED',
} as const;

export const AUTHENTICATION_TYPES = {
  TLS: 'tls',
  SCRAM_SHA_512: 'scram-sha-512',
  OAUTH: 'oauth',
} as const;

export const LISTENER_TYPES = {
  INTERNAL: 'internal',
  ROUTE: 'route',
  LOADBALANCER: 'loadbalancer',
  NODEPORT: 'nodeport',
  INGRESS: 'ingress',
} as const;

export const STORAGE_TYPES = {
  EPHEMERAL: 'ephemeral',
  PERSISTENT_CLAIM: 'persistent-claim',
  JBOD: 'jbod',
} as const;
