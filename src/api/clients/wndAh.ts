import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"
import { wndRelayChain } from "./wnd"

const smoldotParaChain = Promise.all([
  wndRelayChain,
  import("polkadot-api/chains/westend2_asset_hub"),
]).then(([relayChain, { chainSpec }]) =>
  smoldot.addChain({ chainSpec, potentialRelayChains: [relayChain] }),
)

export const wndAhClient = createClient(getSmProvider(smoldotParaChain))
