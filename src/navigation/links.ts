import { ROUTES } from './routes';

export interface RouteParams {
  namespace: string;
  name: string;
}

export function makeKafkaUrl(namespace: string, name: string): string {
  return ROUTES.KAFKA.DETAILS.replace(':namespace', namespace).replace(':name', name);
}

export function makeTopicUrl(namespace: string, name: string): string {
  // Assuming a future topic details route
  return `/kafka-topics/${namespace}/${name}`;
}

export function makeUserUrl(namespace: string, name: string): string {
  return `/kafka-users/${namespace}/${name}`;
}

export function makeConnectUrl(namespace: string, name: string): string {
  return `/kafka-connect/${namespace}/${name}`;
}

export function makeConnectorUrl(namespace: string, name: string): string {
  return `/kafka-connectors/${namespace}/${name}`;
}

/**
 * Infers the parent cluster name from labels.
 * Strimzi resources usually have 'strimzi.io/cluster' label.
 */
export function getParentClusterName(labels?: Record<string, string>): string | undefined {
  return labels?.['strimzi.io/cluster'];
}
