import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"

export const dotRelayChain = import("polkadot-api/chains/polkadot").then(
  ({ chainSpec }) => smoldot.addChain({ chainSpec }),
)

export const dotClient = createClient(getSmProvider(dotRelayChain))
