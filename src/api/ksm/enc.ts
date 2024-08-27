import {
  XcmV3JunctionNetworkId,
  ksmEnc,
} from "@polkadot-api/descriptors"
import { ksmEncClient } from "@/api/clients"
import { AssetInChain } from "../types"
import {
  fromEncointerToForeign,
  fromEncointerToRelay,
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
      api.tx.PolkadotXcm.limited_teleport_assets(fromEncointerToRelay(...args)),
    dotAh: (from, amount, to) =>
      api.tx.PolkadotXcm.limited_reserve_transfer_assets(
        fromEncointerToForeign(
          XcmV3JunctionNetworkId.Polkadot(),
          1000,
          getNativeAsset(1, amount),
          from,
          to,
        ),
      ),
  },
}

export default [ksm]
