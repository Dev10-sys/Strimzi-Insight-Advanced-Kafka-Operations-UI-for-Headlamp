import { KafkaTopic } from '../types/crds';
import { useResourceList, useResourceItem } from './useResource';
import { apiFactory } from '../api/factory';

const client = apiFactory.getTopicClient();

export const useKafkaTopicList = () => {
  return useResourceList<KafkaTopic>(client);
};

export const useKafkaTopicDetails = (namespace: string, name: string) => {
  return useResourceItem<KafkaTopic>(client, namespace, name);
};
