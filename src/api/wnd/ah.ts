import {
  XcmV3Junction,
  XcmV3JunctionNetworkId,
  XcmV3Junctions,
  XcmV3MultiassetFungibility,
  XcmVersionedAssets,
  XcmVersionedLocation,
  wndAssethub as descriptors,
} from "@polkadot-api/descriptors"
import { wndAhClient } from "@/api/clients"
import { AssetInChain } from "../types"
import {
  fromAssetHubToForeign,
  fromAssetHubToRelay,
  getNativeAsset,
  watchAccoutFreeBalance,
  watchForeingAssetAccoutFreeBalance,
} from "../common"

const api = wndAhClient.getTypedApi(descriptors)

const wnd: AssetInChain = {
  chain: "wndAh",
  symbol: "WND",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    wnd: (...args) =>
      api.tx.PolkadotXcm.transfer_assets(fromAssetHubToRelay(...args)),
    rocAh: (from, amount, to) =>
      api.tx.PolkadotXcm.transfer_assets(
        fromAssetHubToForeign(
          XcmV3JunctionNetworkId.Rococo(),
          1000,
          getNativeAsset(1, amount),
          from,
          to,
        ),
      ),
  },
}

const rocInWndAh: Parameters<typeof XcmVersionedLocation.V4>[0] = {
  parents: 2,
  interior: XcmV3Junctions.X1(
    XcmV3Junction.GlobalConsensus(XcmV3JunctionNetworkId.Rococo()),
  ),
}

const roc: AssetInChain = {
  chain: "wndAh",
  symbol: "ROC",
  watchFreeBalance: watchForeingAssetAccoutFreeBalance(api, rocInWndAh),
  teleport: {
    rocAh: (from, amount, to) =>
      api.tx.PolkadotXcm.transfer_assets(
        fromAssetHubToForeign(
          XcmV3JunctionNetworkId.Rococo(),
          1000,
          XcmVersionedAssets.V4([
            {
              id: rocInWndAh,
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
