import { ksm as descriptors } from "@polkadot-api/descriptors"
import { ksmClient } from "@/api/clients"
import { AssetInChain } from "../types"
import { fromRelayToAssetHub, watchAccoutFreeBalance } from "../common"

const api = ksmClient.getTypedApi(descriptors)

const ksm: AssetInChain = {
  chain: "ksm",
  symbol: "KSM",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    ksmAh: (...args) =>
      api.tx.XcmPallet.transfer_assets(fromRelayToAssetHub(...args)),
  },
}

export default [ksm]
