import {
  itk, XcmV5Junctions, XcmV5Junction
} from "@polkadot-api/descriptors"
import { itkClient } from "@/api/clients"
import { AssetInChain } from "../types"
import {
  fromSystemToSibling,
  getNativeAsset,
  watchAccoutFreeBalance, watchPorteerStatus,
} from "../common"

const api = itkClient.getTypedApi(itk)

const teerK: AssetInChain = {
  chain: "itk",
  symbol: "TEER",
  watchFreeBalance: watchAccoutFreeBalance(api),
  watchPorteerStatus: watchPorteerStatus(api),
  teleport: {
    dotAh: (_from, amount, _to) =>
      api.tx.Porteer.port_tokens({
        amount: amount,
        forward_tokens_to_location: {
          parents: 1,
          interior: XcmV5Junctions.X1(
            XcmV5Junction.Parachain(1000),
          ),
        }
      }),
    itp: (_from, amount, _to) =>
      api.tx.Porteer.port_tokens({
        amount: amount,
        forward_tokens_to_location: undefined
      }),
    ksmAh: (from, amount, to) =>
      api.tx.PolkadotXcm.transfer_assets(
        fromSystemToSibling(
          1000,
          getNativeAsset(0, amount),
          from,
          to,
        ),
      ),
  },
}

export default [teerK]
