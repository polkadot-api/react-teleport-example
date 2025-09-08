import {
  itp, XcmV3Junctions, XcmVersionedLocation, XcmV3Junction
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
    dotAh: (from, amount, to) =>
      api.tx.PolkadotXcm.transfer_assets(
        fromSystemToSibling(
          1000,
          getNativeAsset(0, amount),
          from,
          to,
        ),
      ),
    itk: (from, amount, _to) =>
      api.tx.Porteer.port_tokens({
        amount: amount,
      }),
    ksmAh: (from, amount, _to) =>
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

export default [teerP]
