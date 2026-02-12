# Strimzi-Insight-Advanced-Kafka-Operations-UI-for-Headlamp

[![CI](https://github.com/Dev10-sys/Strimzi-Insight-Advanced-Kafka-Operations-UI-for-Headlamp/actions/workflows/deploy.yml/badge.svg)](https://github.com/Dev10-sys/Strimzi-Insight-Advanced-Kafka-Operations-UI-for-Headlamp/actions/workflows/deploy.yml)
[![Version](https://img.shields.io/github/v/release/Dev10-sys/Strimzi-Insight-Advanced-Kafka-Operations-UI-for-Headlamp)](https://github.com/Dev10-sys/Strimzi-Insight-Advanced-Kafka-Operations-UI-for-Headlamp/releases)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Strimzi Insight is a production-grade [Headlamp](https://kinvolk.github.io/headlamp/) plugin designed for deep visualization and operational management of Strimzi-managed Kafka clusters on Kubernetes. It transforms raw Custom Resource Definitions (CRDs) into a structured, SRE-focused control plane.

## Key Features

- **Kafka Clusters**: Full overview of broker topology, versions, and listener endpoints including bootstrap servers.
- **KafkaTopics**: Real-time partition and replication monitoring with configuration override tracking.
- **KafkaUsers**: Security identity management including credential rotation and ACL matrix visualization.
- **KafkaConnect**: Comprehensive cluster health, plugin discovery, and connector task lifecycle management (Pause/Resume).
- **Relational Discovery**: Smart linking between clusters, topics, and users via label-based identity resolution.
- **Actionable UI**: Directly trigger operational tasks like Strimzi credential rotation from the dashboard.

## Installation

### Prerequisites

- A running Kubernetes cluster with [Strimzi Operator](https://strimzi.io/) installed.
- A functional [Headlamp](https://github.com/headlamp-k8s/headlamp) installation.

### Manual Installation (Sideloading)

1. Clone this repository into your Headlamp plugins directory or any local folder:
   ```bash
   git clone https://github.com/Dev10-sys/Strimzi-Insight-Advanced-Kafka-Operations-UI-for-Headlamp.git
   ```
2. Build the plugin:
   ```bash
   npm install --legacy-peer-deps
   npm run build
   ```
3. Load the `dist/` folder into your Headlamp instance.

## Architecture

The plugin is built with type-safety and performance in mind:

- **Type Factory**: Formal TypeScript specifications for `v1beta2` Strimzi CRDs.
- **Status Engine**: Deterministic normalization that processes complex operator conditions into a consistent health matrix.
- **API Client**: Robust Kubernetes API client with built-in Headlamp proxy support.

## Compatibility

- **Strimzi**: v0.28.0+ (API `v1beta2`)
- **Headlamp**: v0.7.0+

---

Licensed under the Apache License, version 2.0.
