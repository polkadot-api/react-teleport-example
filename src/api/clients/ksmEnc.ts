import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"
import { ksmRelayChain } from "./ksm"

const smoldotParaChain = Promise.all([
  ksmRelayChain,
  import("polkadot-api/chains/ksmcc3_encointer"),
]).then(([relayChain, { chainSpec }]) =>
  smoldot.addChain({ chainSpec, potentialRelayChains: [relayChain] }),
)

export const ksmEncClient = createClient(getSmProvider(smoldotParaChain))
