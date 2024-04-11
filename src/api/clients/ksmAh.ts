import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"
import { ksmRelayChain } from "./ksm"

const smoldotParaChain = Promise.all([
  ksmRelayChain,
  import("polkadot-api/chains/ksmcc3_asset_hub"),
]).then(([relayChain, { chainSpec }]) =>
  smoldot.addChain({ chainSpec, potentialRelayChains: [relayChain] }),
)

export const ksmAhClient = createClient(getSmProvider(smoldotParaChain))
