import { pas as descriptors } from "@polkadot-api/descriptors"
import { pasClient } from "@/api/clients"
import { AssetInChain } from "../types"
import { fromRelayToAssetHub, watchAccoutFreeBalance } from "../common"

const api = pasClient.getTypedApi(descriptors)

const pas: AssetInChain = {
  chain: "pas",
  symbol: "PAS",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    pasAh: (...args) =>
      api.tx.XcmPallet.transfer_assets(fromRelayToAssetHub(...args)),
  },
}

export default [pas]
