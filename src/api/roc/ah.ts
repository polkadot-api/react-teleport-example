import {
  XcmV3Junction,
  XcmV3JunctionNetworkId,
  XcmV3Junctions,
  XcmV3MultiassetFungibility,
  XcmVersionedAssets,
  XcmVersionedLocation,
  rocAh as descriptors,
} from "@polkadot-api/descriptors"
import { rocAhClient } from "@/api/clients"
import { AssetInChain } from "../types"
import {
  fromAssetHubToForeign,
  fromAssetHubToRelay,
  getNativeAsset,
  watchAccoutFreeBalance,
  watchForeingAssetAccoutFreeBalance,
} from "../common"

const api = rocAhClient.getTypedApi(descriptors)

const chain = "rocAh"
const roc: AssetInChain = {
  chain,
  symbol: "ROC",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    roc: (...args) =>
      api.tx.PolkadotXcm.transfer_assets(fromAssetHubToRelay(...args)),
    wndAh: (from, amount, to) =>
      api.tx.PolkadotXcm.transfer_assets(
        fromAssetHubToForeign(
          XcmV3JunctionNetworkId.Westend(),
          1000,
          getNativeAsset(1, amount),
          from,
          to,
        ),
      ),
  },
}

const wndInRocAh: Parameters<typeof XcmVersionedLocation.V4>[0] = {
  parents: 2,
  interior: XcmV3Junctions.X1(
    XcmV3Junction.GlobalConsensus(XcmV3JunctionNetworkId.Westend()),
  ),
}

const wnd: AssetInChain = {
  chain,
  symbol: "WND",
  watchFreeBalance: watchForeingAssetAccoutFreeBalance(api, wndInRocAh),
  teleport: {
    wndAh: (from, amount, to) =>
      api.tx.PolkadotXcm.transfer_assets(
        fromAssetHubToForeign(
          XcmV3JunctionNetworkId.Westend(),
          1000,
          XcmVersionedAssets.V4([
            {
              id: wndInRocAh,
              fun: XcmV3MultiassetFungibility.Fungible(amount),
            },
          ]),
          from,
          to,
        ),
      ),
  },
}

export default [wnd, roc]
