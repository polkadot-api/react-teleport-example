import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import { ITP_WS_URL } from "@/config";
// to refresh types: papi add itp -w wss://polkadot.api.integritee.network
export const itpClient = createClient(withPolkadotSdkCompat(
  getWsProvider(ITP_WS_URL)
))
