import { StrimziCondition } from '../types/crds';

export function formatConditionDate(isoString?: string): string {
  if (!isoString) return '-';
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}

export function sortConditions(conditions: StrimziCondition[]): StrimziCondition[] {
  // Sort by LastTransitionTime descending, then by Type
  return [...conditions].sort((a, b) => {
    const timeA = new Date(a.lastTransitionTime || 0).getTime();
    const timeB = new Date(b.lastTransitionTime || 0).getTime();
    if (timeA !== timeB) {
      return timeB - timeA;
    }
    return a.type.localeCompare(b.type);
  });
}

export function filterRecentConditions(conditions: StrimziCondition[], limit = 5): StrimziCondition[] {
  return sortConditions(conditions).slice(0, limit);
}
