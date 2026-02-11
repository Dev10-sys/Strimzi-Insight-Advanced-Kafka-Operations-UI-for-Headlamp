# Strimzi Insight Architecture Specification

This specification details the architectural decisions and engineering patterns implemented in Strimzi Insight.

## 1. Service Factory Pattern

To ensure predictable data access and prevent resource leakage, the plugin implements a **Centralized Service Factory** (`src/api/factory.ts`).

### Decision Rationale

Direct instantiation of Kubernetes clients within React components leads to:

- Multiple redundant API client instances.
- Fragile reference stability causing unnecessary hook re-renders.
- Inconsistent configuration (e.g., target clusters) across the UI.

The `apiFactory` singleton provides deterministic access to specialized resource clients (Kafka, Topic, User, etc.), guaranteeing that the entire application subscribes to the same API endpoint configuration and client state.

## 2. Status Parsing & Normalization

The core logic of the plugin revolves around the **Deterministic Status Engine** (`src/utils/status.ts`).

### Logic Flow

1. **Primary Key**: The engine searches for the `Ready` condition type.
2. **Terminal Analysis**: It distinguishes between transient reconciliation (Ready: False + ReconciliationInProgress) and terminal faults (Ready: False + InvalidResourceException).
3. **Reason Hierarchy**: Status is derived from a priority matrix (Failed > Degraded > Pending > Healthy).

This ensures that "Healthy" is never reported deceptively during a failing reconciliation loop.

## 3. Identity-Based Relational Discovery

Relational linking (e.g., linking a KafkaTopic to its parent Kafka cluster) is performed via **Identity Mapping** rather than name inference.

### Implementation

We utilize the `strimzi.io/cluster` label index to filter and resolve parent-child relationships. This prevents "Dead Links" that occur when multiple clusters with similar names exist across different namespaces or when resources are renamed but labels remain consistent.

## 4. Managed Null-Safety

The plugin implements **Exhaustive Optional Chaining** across all data-view mappings.

### Why it Matters

Strimzi resources often transition through states where the `status` block is entirely missing or the `spec` is being updated by the operator. By guarding every field access (Spec, Status, Metadata), we prevent the "White Screen of Death" during critical cluster bootstrap scenarios, allowing the SRE to monitor the progress of a cluster even before it reports its first condition.

## 5. Performance Preservation

Performance is maintained through three primary strategies:

- **Memoized Options**: Label selectors and namespace filters are memoized to prevent infinite `useEffect` loops.
- **Lazy Details**: High-cost configuration data (RAW YAML) is only rendered on-demand.
- **Virtualized Lists**: Standard Headlamp table patterns are used to ensure smooth scrolling even with 1000+ Kafka topics.

## 6. SRE Design Discipline

The UI follows a monochrome-centric density model. We avoid "soft" UI elements in favor of monospaced fonts and high-contrast status dots, ensuring that critical data remains the focus during incident response.
