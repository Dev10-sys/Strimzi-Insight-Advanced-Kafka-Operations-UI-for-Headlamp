import { KafkaConnect } from '../types/crds';
import { useResourceList, useResourceItem } from './useResource';
import { apiFactory } from '../api/factory';

const client = apiFactory.getConnectClient();

export const useKafkaConnectList = () => {
  return useResourceList<KafkaConnect>(client);
};

export const useKafkaConnectDetails = (namespace: string, name: string) => {
  return useResourceItem<KafkaConnect>(client, namespace, name);
};
