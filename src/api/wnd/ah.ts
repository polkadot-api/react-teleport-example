import {
  XcmV3Junctions,
  XcmV3MultiassetAssetId,
  XcmV3MultiassetFungibility,
  XcmV4Junction,
  XcmV4JunctionNetworkId,
  XcmVersionedAssets,
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
      api.tx.PolkadotXcm.limited_teleport_assets(fromAssetHubToRelay(...args)),
    rocAh: (from, amount, to) =>
      api.tx.PolkadotXcm.limited_reserve_transfer_assets(
        fromAssetHubToForeign(
          XcmV4JunctionNetworkId.Rococo(),
          1000,
          getNativeAsset(1, amount),
          from,
          to,
        ),
      ),
  },
}

const rocInWndAh: Parameters<typeof XcmV3MultiassetAssetId.Concrete>[0] = {
  parents: 2,
  interior: XcmV3Junctions.X1(
    XcmV4Junction.GlobalConsensus(XcmV4JunctionNetworkId.Rococo()),
  ),
}

const roc: AssetInChain = {
  chain: "wndAh",
  symbol: "ROC",
  watchFreeBalance: watchForeingAssetAccoutFreeBalance(api, rocInWndAh),
  teleport: {
    rocAh: (from, amount, to) =>
      api.tx.PolkadotXcm.limited_reserve_transfer_assets(
        fromAssetHubToForeign(
          XcmV4JunctionNetworkId.Rococo(),
          1000,
          XcmVersionedAssets.V3([
            {
              id: XcmV3MultiassetAssetId.Concrete(rocInWndAh),
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
