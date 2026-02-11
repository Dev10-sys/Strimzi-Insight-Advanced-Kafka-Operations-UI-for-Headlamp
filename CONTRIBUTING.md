# Contributing to Strimzi Insight

Thank you for your interest in improving Strimzi Insight. This project aims to provide a professional-grade control plane for Strimzi-managed Kafka clusters within Headlamp.

## Developer Workflow

### Prerequisites

- Node.js (v16+)
- npm
- A running Kubernetes cluster with Strimzi Operator installed
- [Headlamp](https://kinvolk.github.io/headlamp/)

### Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To run the plugin in development mode within Headlamp:

```bash
npm start
```

This will compile the plugin and watch for changes.

### Build

To create a production build:

```bash
npm run build
```

## Standards

### Code Architecture

We follow strict architectural patterns to ensure stability:

- **Service Factory**: All API clients must be instantiated via `apiFactory`.
- **Type Safety**: All Strimzi CRDs must have exhaustive TypeScript definitions in `src/types/crds.ts`.
- **Status Normalization**: Use `parseResourceStatus` for all health reporting to ensure consistency.

### Pull Request Process

1. Ensure the code builds and passes linting:
   ```bash
   npm run build
   && npm run lint
   ```
2. Update documentation if you are changing user-facing features or internal architecture.
3. Provide screenshots for any UI changes.

## License

By contributing, you agree that your contributions will be licensed under the Apache License, version 2.0.
