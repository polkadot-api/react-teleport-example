import { ksmEnc } from "@polkadot-api/descriptors"
import { ksmEncClient } from "@/api/clients"
import { AssetInChain } from "../types"
import {
  fromParaToRelay,
  fromSystemToSibling,
  getNativeAsset,
  watchAccoutFreeBalance,
} from "../common"

const api = ksmEncClient.getTypedApi(ksmEnc)

const ksm: AssetInChain = {
  chain: "ksmEnc",
  symbol: "KSM",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    ksm: (...args) =>
      api.tx.PolkadotXcm.transfer_assets(fromParaToRelay(...args)),
    ksmAh: (from, amount, to) =>
      api.tx.PolkadotXcm.transfer_assets(
        fromSystemToSibling(1000, getNativeAsset(1, amount), from, to),
      ),
  },
}

export default [ksm]
