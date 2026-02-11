export const ROUTES = {
  KAFKA: {
    LIST: '/kafka',
    DETAILS: '/kafka/:namespace/:name',
  },
  KAFKA_TOPIC: {
    LIST: '/kafka-topics',
    DETAILS: '/kafka-topics/:namespace/:name',
    CREATE: '/kafka-topics/create',
  },
  KAFKA_USER: {
    LIST: '/kafka-users',
    DETAILS: '/kafka-users/:namespace/:name',
  },
  KAFKA_CONNECT: {
    LIST: '/kafka-connect',
    DETAILS: '/kafka-connect/:namespace/:name',
  },
  KAFKA_CONNECTOR: {
    LIST: '/kafka-connectors',
    DETAILS: '/kafka-connectors/:namespace/:name',
  },
} as const;
