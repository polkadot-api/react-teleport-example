import {
  ksmEnc,
} from "@polkadot-api/descriptors"
import { ksmEncClient } from "@/api/clients"
import { AssetInChain } from "../types"
import {
  fromSystemToSibling,
  fromEncointerToRelay,
  getNativeAsset,
  watchAccoutFreeBalance,
} from "../common"

const api = ksmEncClient.getTypedApi(ksmEnc)

const ksm: AssetInChain = {
  chain: "ksmEnc",
  symbol: "KSM",
  watchFreeBalance: watchAccoutFreeBalance(api),
  watchPorteerStatus: null,
  teleport: {
    ksm: (...args) =>
      api.tx.PolkadotXcm.limited_teleport_assets(fromEncointerToRelay(...args)),
    ksmAh: (from, amount, to) =>
      api.tx.PolkadotXcm.limited_teleport_assets(
        fromSystemToSibling(
          1000,
          getNativeAsset(1, amount),
          from,
          to,
        ),
      ),
  },
}

export default [ksm]
