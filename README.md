# TEER CrossChain Tool

Simple helper to transfer TEER accross chains and consensus systems

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

## Chopsticks Testing

Beware that chopsticks does not yet emulate the bridge! Therefore, all attempts to bridge will fail (the extrinsic will succeed, but the funds will never arrive on the other side). Run zombienet if you need to test bridging behavior.

prepare chopsticks
```
git clone https://github.com/brenzi/chopsticks.git
cd chopsticks
git checkout ab/xcm-v5-debug
# get dev runtimes
wget https://pub-84166bba27804f48a67cf8cc4f3cd0a6.r2.dev/integritee_kusama_runtime-562-dev-sudo.compact.compressed.wasm
wget https://pub-84166bba27804f48a67cf8cc4f3cd0a6.r2.dev/integritee_polkadot_runtime-562-dev.compact.compressed.wasm
wget https://pub-84166bba27804f48a67cf8cc4f3cd0a6.r2.dev/asset_hub_kusama_runtime_1.7.1_debug.compact.compressed.wasm
wget https://pub-84166bba27804f48a67cf8cc4f3cd0a6.r2.dev/asset_hub_polkadot_runtime_1.7.1_debug.compact.compressed.wasm
```
run chopsticks in two terminals. call the kusama one first:
```
# first terminal, should listen on ports 8000 and 8001
npx @acala-network/chopsticks@latest xcm --p=./configs/kusama-asset-hub.yml --p=./configs/integritee-kusama.yml
# other terminal, should listen on ports 8002 and 8003
npx @acala-network/chopsticks@latest xcm --p=./configs/polkadot-asset-hub.yml --p=./configs/integritee-polkadot.yml
```

then you can point your browser to

* Integritee Network (Kusama) https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A8001#
* Integritee Network (Polkadot) https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A8003#
* Asset Hub Kusama https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A8000#
* Asset Hub Polkadot https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A8002#

Alice is now the watchdog account and you'll need to call `porteer.watchdogHeartbeat`
* https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A8001#/extrinsics/decode/0x3804
* https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A8003#/extrinsics/decode/0x3804
