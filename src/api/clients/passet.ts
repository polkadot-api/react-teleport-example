import { createClient } from "polkadot-api"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getWsProvider } from "polkadot-api/ws-provider/web"

// TODO: missing bootnodes, switch to smoldot
// const smoldotParaChain = Promise.all([
//   pasRelayChain,
//   import("./passetChainspec"),
// ]).then(([relayChain, { chainSpec }]) =>
//   smoldot.addChain({ chainSpec, potentialRelayChains: [relayChain] }),
// )

// export const passetClient = createClient(getSmProvider(smoldotParaChain))

export const passetClient = createClient(
  withPolkadotSdkCompat(getWsProvider("wss://testnet-passet-hub.polkadot.io")),
)
