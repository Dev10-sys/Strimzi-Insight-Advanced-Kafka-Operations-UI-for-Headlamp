import React from 'react';
import { ROUTES } from './routes';
import { 
  KafkaList, 
  KafkaDetails,
  KafkaTopicList,
  KafkaTopicDetails,
  KafkaTopicCreate,
  KafkaUserList,
  KafkaUserDetails,
  KafkaConnectList,
  KafkaConnectDetails,
  KafkaConnectorList,
  KafkaConnectorDetails
} from '../components/resources';

export interface RouteConfigItem {
  path: string;
  exact?: boolean;
  component: React.ComponentType<any>;
  sidebar?: string;
}

export const routeConfig: RouteConfigItem[] = [
  // Kafka Clusters
  {
    path: ROUTES.KAFKA.LIST,
    exact: true,
    component: KafkaList,
    sidebar: 'Kafka Clusters',
  },
  {
    path: ROUTES.KAFKA.DETAILS,
    exact: true,
    component: KafkaDetails,
  },
  
  // Topics
  {
    path: ROUTES.KAFKA_TOPIC.LIST,
    exact: true,
    component: KafkaTopicList,
    sidebar: 'Kafka Topics',
  },
  {
    path: ROUTES.KAFKA_TOPIC.DETAILS,
    exact: true,
    component: KafkaTopicDetails,
  },
  {
    path: ROUTES.KAFKA_TOPIC.CREATE,
    exact: true,
    component: KafkaTopicCreate,
  },
  
  // Users
  {
    path: ROUTES.KAFKA_USER.LIST,
    exact: true,
    component: KafkaUserList,
    sidebar: 'Kafka Users',
  },
  {
    path: ROUTES.KAFKA_USER.DETAILS,
    exact: true,
    component: KafkaUserDetails,
  },
  
  // Connect
  {
    path: ROUTES.KAFKA_CONNECT.LIST,
    exact: true,
    component: KafkaConnectList,
    sidebar: 'Kafka Connect',
  },
  {
    path: ROUTES.KAFKA_CONNECT.DETAILS,
    exact: true,
    component: KafkaConnectDetails,
  },
  
  // Connectors
  {
    path: ROUTES.KAFKA_CONNECTOR.LIST,
    exact: true,
    component: KafkaConnectorList,
    sidebar: 'Connectors',
  },
  {
    path: ROUTES.KAFKA_CONNECTOR.DETAILS,
    exact: true,
    component: KafkaConnectorDetails,
  },
];
