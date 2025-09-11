import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"
import { dotRelayChain } from "./dot"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getWsProvider } from "polkadot-api/ws-provider/web";

// const smoldotParaChain = Promise.all([
//   dotRelayChain,
//   import("polkadot-api/chains/polkadot_asset_hub"),
// ]).then(([relayChain, { chainSpec }]) =>
//   smoldot.addChain({ chainSpec, potentialRelayChains: [relayChain] }),
// )

// export const dotAhClient = createClient(getSmProvider(smoldotParaChain))

export const dotAhClient = createClient(withPolkadotSdkCompat(
  //getWsProvider("ws://localhost:8002") // chopsticks
  getWsProvider("ws://localhost:9910") // zombienet
))
