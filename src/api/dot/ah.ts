import {
  DotXcmV3Junctions,
  DotXcmV3MultiassetAssetId,
  XcmV3Junction,
  XcmV3JunctionNetworkId,
  XcmV3MultiassetFungibility,
  XcmVersionedMultiAssets,
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
      api.tx.PolkadotXcm.limited_teleport_assets(fromAssetHubToRelay(...args)),
    ksmAh: (from, amount, to) =>
      api.tx.PolkadotXcm.limited_reserve_transfer_assets(
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

const ksmInDotAh: Parameters<typeof DotXcmV3MultiassetAssetId.Concrete>[0] = {
  parents: 2,
  interior: DotXcmV3Junctions.X1(
    XcmV3Junction.GlobalConsensus(XcmV3JunctionNetworkId.Kusama()),
  ),
}

const ksm: AssetInChain = {
  chain: "dotAh",
  symbol: "KSM",
  watchFreeBalance: watchForeingAssetAccoutFreeBalance(api, ksmInDotAh),
  teleport: {
    ksmAh: (from, amount, to) =>
      api.tx.PolkadotXcm.limited_reserve_transfer_assets(
        fromAssetHubToForeign(
          XcmV3JunctionNetworkId.Kusama(),
          1000,
          XcmVersionedMultiAssets.V3([
            {
              id: DotXcmV3MultiassetAssetId.Concrete(ksmInDotAh),
              fun: XcmV3MultiassetFungibility.Fungible(amount),
            },
          ]),
          from,
          to,
        ),
      ),
  },
}

export default [dot, ksm]
