import { StrimziCondition } from '../types/crds';

export type ResourceState = 'Healthy' | 'Degraded' | 'Pending' | 'Failed' | 'Unknown';

export interface StatusDetail {
  state: ResourceState;
  color: string;
  label: string;
  message?: string;
}

/**
 * Maps normalized states to professional, low-saturation color tokens.
 * Consistent with Headlamp's aesthetic.
 */
const STATE_MAP: Record<ResourceState, { color: string; label: string }> = {
  Healthy: { color: '#2e7d32', label: 'Healthy' },   // Emerald/Forest
  Degraded: { color: '#ed6c02', label: 'Degraded' }, // Amber/Orange
  Pending: { color: '#0288d1', label: 'Pending' },  // Sky/Blue
  Failed: { color: '#d32f2f', label: 'Failed' },    // Rose/Red
  Unknown: { color: '#757575', label: 'Unknown' },   // Slate/Grey
};

/**
 * Centralized parser for Strimzi CRD conditions.
 * Follows Strimzi's status reporting patterns where 'Ready' is the source of truth.
 */
export function parseResourceStatus(conditions?: StrimziCondition[]): StatusDetail {
  if (!conditions || conditions.length === 0) {
    return { ...STATE_MAP.Pending, state: 'Pending', message: 'Awaiting status reporting' };
  }

  const ready = conditions.find(c => c.type === 'Ready');

  if (!ready) {
    // If no Ready condition, check if there's a NotReady condition or Reconciling
    const reconciling = conditions.find(c => c.type === 'Reconciling');
    if (reconciling?.status === 'True') {
      return { ...STATE_MAP.Pending, state: 'Pending', message: reconciling.message || 'Reconciling' };
    }
    return { ...STATE_MAP.Pending, state: 'Pending', message: 'Initializing' };
  }

  const message = ready.message || ready.reason || 'No message provided';

  if (ready.status === 'True') {
    return { ...STATE_MAP.Healthy, state: 'Healthy', message };
  }

  if (ready.status === 'Unknown') {
    return { ...STATE_MAP.Pending, state: 'Pending', message };
  }

  // If Ready is False, determine if it's a transient Degraded state or a terminal Failed state.
  const terminalReasons = [
    'InvalidResourceException',
    'ClusterOperatorError',
    'ConfigMapNotFound',
    'SecretNotFound',
    'InvalidConfiguration',
    'ResourceNotFound'
  ];
  
  const isTerminal = terminalReasons.includes(ready.reason || '');

  return isTerminal
    ? { ...STATE_MAP.Failed, state: 'Failed', message }
    : { ...STATE_MAP.Degraded, state: 'Degraded', message };
}

/**
 * Helper to get a simple state string for filtering or basic display.
 */
export function getResourceStatus(conditions?: StrimziCondition[]): ResourceState {
  return parseResourceStatus(conditions).state;
}
