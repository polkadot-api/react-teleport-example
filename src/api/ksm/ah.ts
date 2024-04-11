import {
  DotXcmV3Junctions,
  DotXcmV3MultiassetAssetId,
  XcmV3Junction,
  XcmV3JunctionNetworkId,
  XcmV3MultiassetFungibility,
  XcmVersionedMultiAssets,
  ksmAh,
} from "@polkadot-api/descriptors"
import { ksmAhClient } from "@/api/clients"
import { AssetInChain } from "../types"
import {
  fromAssetHubToForeign,
  fromAssetHubToRelay,
  getNativeAsset,
  watchAccoutFreeBalance,
  watchForeingAssetAccoutFreeBalance,
} from "../common"

const api = ksmAhClient.getTypedApi(ksmAh)

const ksm: AssetInChain = {
  chain: "ksmAh",
  symbol: "KSM",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    ksm: (...args) =>
      api.tx.PolkadotXcm.limited_teleport_assets(fromAssetHubToRelay(...args)),
    dotAh: (from, amount, to) =>
      api.tx.PolkadotXcm.limited_reserve_transfer_assets(
        fromAssetHubToForeign(
          XcmV3JunctionNetworkId.Polkadot(),
          1000,
          getNativeAsset(1, amount),
          from,
          to,
        ),
      ),
  },
}

const dotInKsmAh: Parameters<typeof DotXcmV3MultiassetAssetId.Concrete>[0] = {
  parents: 2,
  interior: DotXcmV3Junctions.X1(
    XcmV3Junction.GlobalConsensus(XcmV3JunctionNetworkId.Polkadot()),
  ),
}

const dot: AssetInChain = {
  chain: "ksmAh",
  symbol: "DOT",
  watchFreeBalance: watchForeingAssetAccoutFreeBalance(api, dotInKsmAh),
  teleport: {
    dotAh: (from, amount, to) =>
      api.tx.PolkadotXcm.limited_reserve_transfer_assets(
        fromAssetHubToForeign(
          XcmV3JunctionNetworkId.Polkadot(),
          1000,
          XcmVersionedMultiAssets.V3([
            {
              id: DotXcmV3MultiassetAssetId.Concrete(dotInKsmAh),
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
