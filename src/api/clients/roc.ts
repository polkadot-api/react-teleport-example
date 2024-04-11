import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"

export const rocRelayChain = import("polkadot-api/chains/rococo_v2_2").then(
  ({ chainSpec }) => smoldot.addChain({ chainSpec }),
)

export const rocClient = createClient(getSmProvider(rocRelayChain))
