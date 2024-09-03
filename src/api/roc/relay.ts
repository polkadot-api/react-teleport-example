import { roc as descriptors } from "@polkadot-api/descriptors"
import { rocClient } from "@/api/clients"
import { AssetInChain } from "../types"
import { fromRelayToAssetHub, watchAccoutFreeBalance } from "../common"

const api = rocClient.getTypedApi(descriptors)

const roc: AssetInChain = {
  chain: "roc",
  symbol: "ROC",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    rocAh: (...args) =>
      api.tx.XcmPallet.transfer_assets(fromRelayToAssetHub(...args)),
  },
}

export default [roc]
