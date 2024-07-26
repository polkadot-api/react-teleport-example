import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"
import { pasRelayChain } from "./pas"

const smoldotParaChain = Promise.all([
  pasRelayChain,
  import("polkadot-api/chains/paseo_asset_hub"),
]).then(([relayChain, { chainSpec }]) =>
  smoldot.addChain({ chainSpec, potentialRelayChains: [relayChain] }),
)

export const pasAhClient = createClient(getSmProvider(smoldotParaChain))
