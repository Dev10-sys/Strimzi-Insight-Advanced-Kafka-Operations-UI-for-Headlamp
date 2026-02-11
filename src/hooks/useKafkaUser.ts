import { KafkaUser } from '../types/crds';
import { useResourceList, useResourceItem } from './useResource';
import { apiFactory } from '../api/factory';

const client = apiFactory.getUserClient();

export const useKafkaUserList = () => {
  return useResourceList<KafkaUser>(client);
};

export const useKafkaUserDetails = (namespace: string, name: string) => {
  return useResourceItem<KafkaUser>(client, namespace, name);
};
