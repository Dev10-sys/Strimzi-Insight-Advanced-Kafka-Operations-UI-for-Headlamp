import { registerPlugin } from '@kinvolk/headlamp-plugin/lib';
import { routeConfig } from './navigation/config';

/**
 * Strimzi Insight - Production-grade Kafka Operator Management
 * 
 * This plugin registers a specialized management interface for Strimzi CRDs.
 * It uses a layered architecture:
 * 1. API Client Layer (src/api)
 * 2. Typed Data Layer (src/types)
 * 3. Reactive Hook Layer (src/hooks)
 * 4. Presentation Layer (src/components)
 */

const sidebarItems = routeConfig
  .filter(route => route.sidebar)
  .map(route => ({
    name: route.sidebar || '',
    path: route.path,
    icon: 'mdi-kafka', // Default icon for the suite
  }));

registerPlugin({
  name: 'strimzi-insight',
  displayName: 'Strimzi Insight',
  version: '0.1.0',
  components: {
    sidebarItems,
    routes: routeConfig.map(({ path, component, exact }) => ({
      path,
      component,
      exact,
    })),
  },
});
