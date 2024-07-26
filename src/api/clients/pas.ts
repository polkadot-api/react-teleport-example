import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"

export const pasRelayChain = import("polkadot-api/chains/paseo").then(
  ({ chainSpec }) => smoldot.addChain({ chainSpec }),
)

export const pasClient = createClient(getSmProvider(pasRelayChain))
