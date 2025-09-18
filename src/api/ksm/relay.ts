import { ksm as descriptors } from "@polkadot-api/descriptors"
import { ksmClient } from "@/api/clients"
import { AssetInChain } from "../types"
import { fromRelayToParachain, watchAccoutFreeBalance } from "../common"

const api = ksmClient.getTypedApi(descriptors)

const ksm: AssetInChain = {
  chain: "ksm",
  symbol: "KSM",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    ksmAh: (...args) =>
      api.tx.XcmPallet.transfer_assets(fromRelayToParachain(1000, ...args)),
    ksmEnc: (...args) =>
      api.tx.XcmPallet.transfer_assets(fromRelayToParachain(1001, ...args)),
  },
}

export default [ksm]
