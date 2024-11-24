import {
  XcmV3Junction,
  XcmV3JunctionNetworkId,
  XcmV3Junctions,
  XcmVersionedLocation,
  dotAh,
} from "@polkadot-api/descriptors"
import { dotAhClient } from "@/api/clients"
import { AssetInChain } from "../types"
import {
  fromAssetHubToRelay,
  fromAssetHubToForeign,
  getNativeAsset,
  watchAccoutFreeBalance,
  watchForeingAssetAccoutFreeBalance,
} from "../common"

const api = dotAhClient.getTypedApi(dotAh)

const dot: AssetInChain = {
  chain: "dotAh",
  symbol: "DOT",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    dot: (...args) =>
      api.tx.PolkadotXcm.transfer_assets(fromAssetHubToRelay(...args)),
    ksmAh: (from, amount, to) =>
      api.tx.PolkadotXcm.transfer_assets(
        fromAssetHubToForeign(
          XcmV3JunctionNetworkId.Kusama(),
          1000,
          getNativeAsset(1, amount),
          from,
          to,
        ),
      ),
  },
}

const ksmInDotAh: Parameters<typeof XcmVersionedLocation.V4>[0] = {
  parents: 2,
  interior: XcmV3Junctions.X1(
    XcmV3Junction.GlobalConsensus(XcmV3JunctionNetworkId.Kusama()),
  ),
}

const ksm: AssetInChain = {
  chain: "dotAh",
  symbol: "KSM",
  watchFreeBalance: watchForeingAssetAccoutFreeBalance(api, ksmInDotAh),
  teleport: {
    /*
    ksmAh: (from, amount, to) =>
      api.tx.PolkadotXcm.limited_reserve_transfer_assets(
        fromAssetHubToForeign(
          XcmV4JunctionNetworkId.Kusama(),
          1000,
          XcmVersionedAssets.V4([
            {
              id: ksmInDotAh,
              fun: XcmV3MultiassetFungibility.Fungible(amount),
            },
          ]),
          from,
          to,
        ),
      ),
    */
  },
}

export default [dot, ksm]
