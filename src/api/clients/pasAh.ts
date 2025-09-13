import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"
import { pasRelayChain } from "./pas"
import { withLogsRecorder } from "polkadot-api/logs-provider"

const smoldotParaChain = Promise.all([
  pasRelayChain,
  import("polkadot-api/chains/paseo_asset_hub"),
]).then(([relayChain, { chainSpec }]) =>
  smoldot.addChain({ chainSpec, potentialRelayChains: [relayChain] }),
)

export const pasAhClient = createClient(
  withLogsRecorder((l) => {
    console.log(l)
  }, getSmProvider(smoldotParaChain)),
)
