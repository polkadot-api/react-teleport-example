import {
  itp, XcmV5Junctions, XcmV5Junction
} from "@polkadot-api/descriptors"
import { itpClient } from "@/api/clients"
import { AssetInChain } from "../types.ts"
import {
  fromSystemToSibling,
  getNativeAsset,
  watchAccoutFreeBalance, watchPorteerStatus,
} from "../common.ts"

const api = itpClient.getTypedApi(itp)

const teerP: AssetInChain = {
  chain: "itp",
  symbol: "TEER",
  watchFreeBalance: watchAccoutFreeBalance(api),
  watchPorteerStatus: watchPorteerStatus(api),
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
    itk: (_from, amount, _to) =>
      api.tx.Porteer.port_tokens({
        amount: amount,
        forward_tokens_to_location: undefined
      }),
    ksmAh: (_from, amount, _to) =>
      api.tx.Porteer.port_tokens({
        amount: amount,
        forward_tokens_to_location: {
          parents: 1,
          interior: XcmV5Junctions.X1(
            XcmV5Junction.Parachain(1000),
          ),
        }
      }),
  },
}

export default [teerP]
