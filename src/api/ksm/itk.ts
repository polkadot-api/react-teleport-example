import {
  itk,
} from "@polkadot-api/descriptors"
import { itkClient } from "@/api/clients"
import { AssetInChain } from "../types"
import {
  fromSystemToSibling,
  getNativeAsset,
  watchAccoutFreeBalance,
} from "../common"

const api = itkClient.getTypedApi(itk)

const teerK: AssetInChain = {
  chain: "itk",
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

export default [teerK]
