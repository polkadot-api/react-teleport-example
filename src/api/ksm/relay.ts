import { ksm as descriptors } from "@polkadot-api/descriptors"
import { ksmClient } from "@/api/clients"
import { AssetInChain } from "../types"
import { fromRelayToAssetHub, fromRelayToEncointer, watchAccoutFreeBalance } from "../common"

const api = ksmClient.getTypedApi(descriptors)

const ksm: AssetInChain = {
  chain: "ksm",
  symbol: "KSM",
  watchFreeBalance: watchAccoutFreeBalance(api),
  watchPorteerStatus: null,
  teleport: {
    ksmAh: (...args) =>
      api.tx.XcmPallet.transfer_assets(fromRelayToAssetHub(...args)),
    ksmEnc: (...args) =>
      api.tx.XcmPallet.transfer_assets(fromRelayToEncointer(...args)),
  },
}

export default [ksm]
