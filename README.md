# Polkadot-API with React Teleporter: Proof of Concept

This project is a basic proof of concept demonstrating how to use the Polkadot API with React and
the light-client (smoldot) to create a multi-chain decentralized application. The DApp showcases the
ability to teleport (or bridge) assets between different chains.

### Important Notes

- **Not a Best-Practices Example**: This project is not intended to serve as an example of "best practices" for
using PAPI. Instead, it’s an illustration of what can be achieved with the API in a short period of time.

- **Development Context**: This project was developed over a weekend, shortly after the Polkadot <-> Kusama
bridge became operational. At that time, there were no user-friendly interfaces available for testing the bridge,
so this project aimed to fill that gap.

### Missing Features

- **XCM Fee Calculation**: The current version of this project lacks proper XCM fee calculation. This feature
will be added in the coming weeks.

### Future Improvements

We plan to continuously improve this project, gradually turning it into a useful starting template for React
developers interested in working with the Polkadot ecosystem.

## Get started

### Dev mode

If you want a development server with Hot Module Replacement (HRM):
```
corepack enable

pnpm install

pnpm dev
```

### Production mode

For testing the production build:
```
corepack enable

pnpm install

pnpm build

pnpm preview
```
