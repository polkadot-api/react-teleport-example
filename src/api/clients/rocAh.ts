import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"
import { rocRelayChain } from "./roc"

const smoldotParaChain = Promise.all([
  rocRelayChain,
  import("polkadot-api/chains/rococo_v2_2_asset_hub"),
]).then(([relayChain, { chainSpec }]) =>
  smoldot.addChain({ chainSpec, potentialRelayChains: [relayChain] }),
)

export const rocAhClient = createClient(getSmProvider(smoldotParaChain))
