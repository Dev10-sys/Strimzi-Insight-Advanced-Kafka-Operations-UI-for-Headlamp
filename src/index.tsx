import { Headlamp, Plugin, registerSidebarEntry, registerRoute } from '@kinvolk/headlamp-plugin/lib';
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

class StrimziInsightPlugin extends Plugin {
  initialize() {
    // Register sidebar items
    const sidebarItems = routeConfig.filter(route => route.sidebar);

    sidebarItems.forEach(route => {
      if (route.sidebar) {
        registerSidebarEntry({
          parent: 'cluster',
          name: route.sidebar,
          label: route.sidebar,
          url: route.path,
          icon: 'mdi:kafka', // Using standard format, assuming mdi bundle
        });
      }
    });

    // Register routes
    routeConfig.forEach((route) => {
      registerRoute({
        path: route.path,
        component: () => <route.component />,
        sidebar: route.sidebar || null,
        exact: route.exact,
      });
    });

    return true;
  }
}

Headlamp.registerPlugin('strimzi-insight', new StrimziInsightPlugin());
