import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";

// to refresh types: papi add itp -w wss://polkadot.api.integritee.network
export const itpClient = createClient(withPolkadotSdkCompat(
  //getWsProvider("wss://polkadot.api.integritee.network")
  //getWsProvider("ws://localhost:8003") // chopsticks
  getWsProvider("ws://localhost:9244") // zombienet
))
