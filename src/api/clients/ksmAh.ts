import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"
import { ksmRelayChain } from "./ksm"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { KAH_WS_URL } from "@/config";

// const smoldotParaChain = Promise.all([
//   ksmRelayChain,
//   import("polkadot-api/chains/ksmcc3_asset_hub"),
// ]).then(([relayChain, { chainSpec }]) =>
//   smoldot.addChain({ chainSpec, potentialRelayChains: [relayChain] }),
// )

// export const ksmAhClient = createClient(getSmProvider(smoldotParaChain))

export const ksmAhClient = createClient(withPolkadotSdkCompat(
  getWsProvider(KAH_WS_URL)
))
