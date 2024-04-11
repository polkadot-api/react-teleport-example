import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"

export const ksmRelayChain = import("polkadot-api/chains/ksmcc3").then(
  ({ chainSpec }) => smoldot.addChain({ chainSpec }),
)

export const ksmClient = createClient(getSmProvider(ksmRelayChain))
