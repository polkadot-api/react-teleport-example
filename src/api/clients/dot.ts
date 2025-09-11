import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getWsProvider } from "polkadot-api/ws-provider/web"

// export const dotRelayChain = import("polkadot-api/chains/polkadot").then(
//   ({ chainSpec }) => smoldot.addChain({ chainSpec }),
// )

//export const dotClient = createClient(getSmProvider(dotRelayChain))

export const dotClient = createClient(withPolkadotSdkCompat(
  getWsProvider("ws://localhost:9942") // zombienet
))
