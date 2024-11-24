import { dot as dotDescriptors } from "@polkadot-api/descriptors"
import { dotClient } from "@/api/clients"
import { AssetInChain } from "../types"
import { fromRelayToAssetHub, watchAccoutFreeBalance } from "../common"

const api = dotClient.getTypedApi(dotDescriptors)

const dot: AssetInChain = {
  chain: "dot",
  symbol: "DOT",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    dotAh: (...args) =>
      api.tx.XcmPallet.transfer_assets(fromRelayToAssetHub(...args)),
  },
}

export default [dot]
