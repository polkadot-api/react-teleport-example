import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { KSM_WS_URL } from "@/config";

// export const ksmRelayChain = import("polkadot-api/chains/ksmcc3").then(
//   ({ chainSpec }) => smoldot.addChain({ chainSpec }),
// )

//export const ksmClient = createClient(getSmProvider(ksmRelayChain))

export const ksmClient = createClient(withPolkadotSdkCompat(
  getWsProvider(KSM_WS_URL)
))
