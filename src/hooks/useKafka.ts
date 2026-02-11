import { Kafka } from '../types/crds';
import { useResourceList, useResourceItem } from './useResource';
import { apiFactory } from '../api/factory';

const client = apiFactory.getKafkaClient();

export const useKafkaList = () => {
  return useResourceList<Kafka>(client);
};

export const useKafkaDetails = (namespace: string, name: string) => {
  return useResourceItem<Kafka>(client, namespace, name);
};
