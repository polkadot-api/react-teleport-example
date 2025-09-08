import {
  itk, XcmV3Junctions, XcmVersionedLocation, XcmV3Junction
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
          getNativeAsset(0, amount),
          from,
          to,
        ),
      ),
    itp: (from, amount, _to) =>
      api.tx.Porteer.port_tokens({
        amount: amount,
      }),
    dotAh: (from, amount, _to) =>
      api.tx.Porteer.port_tokens({
        amount: amount,
        forward_tokens_to_location: {
          parents: 1,
          interior: XcmV3Junctions.X1(
            XcmV3Junction.Parachain(1000),
          ),
        }
      }),
  },
}

export default [teerK]
