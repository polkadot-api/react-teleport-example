import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";


export const itkClient = createClient(withPolkadotSdkCompat(
  //getWsProvider("wss://kusama.api.integritee.network")
  getWsProvider("ws://localhost:8001")
))
