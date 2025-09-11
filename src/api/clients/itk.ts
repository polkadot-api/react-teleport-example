import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import { ITK_WS_URL } from "@/config";
// to refresh types: papi add itk -w wss://kusama.api.integritee.network

export const itkClient = createClient(withPolkadotSdkCompat(
  getWsProvider(ITK_WS_URL)
))
