# Strimzi Insight Plugin for Headlamp

[![CI](https://github.com/LOQ/headlamp-strimzi-insight/actions/workflows/ci.yml/badge.svg)](https://github.com/LOQ/headlamp-strimzi-insight/actions/workflows/ci.yml)
[![Version](https://img.shields.io/github/v/release/LOQ/headlamp-strimzi-insight)](https://github.com/LOQ/headlamp-strimzi-insight/releases)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Strimzi Insight is a production-grade [Headlamp](https://kinvolk.github.io/headlamp/) plugin designed for deep visualization and operational management of Strimzi-managed Kafka clusters on Kubernetes. It transforms raw Custom Resource Definitions (CRDs) into a structured, SRE-focused control plane.

## Why it Exists

Managing Kafka on Kubernetes via Strimzi often requires context-switching between CLI tools and raw YAML manifests. Strimzi Insight bridges this gap by providing a high-density, read-through interface that exposes the health, topology, and relational dependencies of Kafka infrastructure directly within the Headlamp dashboard.

## Supported CRDs

Strimzi Insight provides first-class support for the `v1beta2` API version of the following resources:

- **Kafka**: Cluster health, broker topology, storage configuration, and listener status.
- **KafkaTopic**: Partition/replica distribution and configuration.
- **KafkaUser**: Security identity management and ACL matrix visualization.
- **KafkaConnect**: Cluster status and connector plugin discovery.
- **KafkaConnector**: Task health tracking and operational controls (Pause/Resume).

## Architecture Overview

The plugin is built on an N-tier service architecture:

1. **Domain Layer**: Formal TypeScript specifications for all Strimzi types.
2. **Service Layer**: Singleton-based API factory ensuring stable Kubernetes clients.
3. **Hook Layer**: Memoized data fetchers with integrated error boundaries.
4. **Logic Layer**: Deterministic status normalization that maps 50+ operator conditions to a consistent health matrix.

## Data Flow Model

Data is retrieved via the Headlamp Proxy. The plugin utilizes an identity-based relational discovery model:

- **Relational Discovery**: Resources are linked via label selectors (e.g., `strimzi.io/cluster`) ensuring identity-based stability rather than fragile string-based mapping.
- **Status Normalization**: The `parseResourceStatus` engine analyzes the `Ready` condition and terminal reasons to provide a truthful representation of resource health, even during complex reconciliation cycles.

## Installation

### Prerequisites

- A running Kubernetes cluster with [Strimzi Operator](https://strimzi.io/) installed.
- A functional [Headlamp](https://github.com/headlamp-k8s/headlamp) installation.

### Plugin Sideloading (Dev Mode)

1. Clone this repository into your Headlamp plugins directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the plugin:
   ```bash
   npm start
   ```

## Compatibility

- **Strimzi**: Tested with Strimzi Operator v0.28.0+ (API `v1beta2`).
- **Headlamp**: Compatible with Headlamp v0.7.0+.

## Limitations

- **Read-Primary**: While the plugin supports some operational actions (credential rotation, connector pausing), it focuses primarily on visualization and health monitoring.
- **Namespaced Scoping**: Relational discovery is currently optimized for single-namespace clusters.

## Visual Proof

### Kafka Cluster List

[Kafka Cluster List screenshot placeholder]

### Kafka Detail View (Healthy)

[Kafka Detail View Healthy screenshot placeholder]

### User Detail View

[User Detail View screenshot placeholder]

---

Licensed under the Apache License, version 2.0.
