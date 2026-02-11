import { KafkaConnector } from '../types/crds';
import { useResourceList, useResourceItem } from './useResource';
import { apiFactory } from '../api/factory';

const client = apiFactory.getConnectorClient();

export const useKafkaConnectorList = () => {
  return useResourceList<KafkaConnector>(client);
};

export const useKafkaConnectorDetails = (namespace: string, name: string) => {
  return useResourceItem<KafkaConnector>(client, namespace, name);
};
