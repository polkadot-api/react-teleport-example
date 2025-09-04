import {
  itp
} from "@polkadot-api/descriptors"
import { itpClient } from "@/api/clients"
import { AssetInChain } from "../types.ts"
import {
  fromSystemToSibling,
  getNativeAsset,
  watchAccoutFreeBalance,
} from "../common.ts"

const api = itpClient.getTypedApi(itp)

const teerP: AssetInChain = {
  chain: "itp",
  symbol: "TEER",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    ksmAh: (from, amount, to) =>
      api.tx.PolkadotXcm.transfer_assets(
        fromSystemToSibling(
          1000,
          getNativeAsset(1, amount),
          from,
          to,
        ),
      ),
  },
}

export default [teerP]
