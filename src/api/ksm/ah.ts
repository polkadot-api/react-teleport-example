import {
  XcmV3Junctions,
  XcmV3MultiassetAssetId,
  XcmV4Junction,
  XcmV4JunctionNetworkId,
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
          XcmV4JunctionNetworkId.Polkadot(),
          1000,
          getNativeAsset(1, amount),
          from,
          to,
        ),
      ),
  },
}

const dotInKsmAh: Parameters<typeof XcmV3MultiassetAssetId.Concrete>[0] = {
  parents: 2,
  interior: XcmV3Junctions.X1(
    XcmV4Junction.GlobalConsensus(XcmV4JunctionNetworkId.Polkadot()),
  ),
}

const dot: AssetInChain = {
  chain: "ksmAh",
  symbol: "DOT",
  watchFreeBalance: watchForeingAssetAccoutFreeBalance(api, dotInKsmAh),
  teleport: {
    /*
    dotAh: (from, amount, to) =>
      api.tx.PolkadotXcm.limited_reserve_transfer_assets(
        fromAssetHubToForeign(
          XcmV4JunctionNetworkId.Polkadot(),
          1000,
          XcmVersionedAssets.V3([
            {
              id: XcmV3MultiassetAssetId.Concrete(dotInKsmAh),
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
