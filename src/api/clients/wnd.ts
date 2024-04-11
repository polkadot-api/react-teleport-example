import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"

export const wndRelayChain = import("polkadot-api/chains/westend2").then(
  ({ chainSpec }) => smoldot.addChain({ chainSpec }),
)

export const wndClient = createClient(getSmProvider(wndRelayChain))
