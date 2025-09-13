import {
  XcmV5Junction,
  XcmV5NetworkId,
  XcmV5Junctions,
  XcmVersionedLocation,
  XcmVersionedAssets,
  XcmV3MultiassetFungibility,
  dotAh,
} from "@polkadot-api/descriptors"
import { dotAhClient } from "@/api/clients"
import { AssetInChain } from "../types"
import {
  fromAssetHubToRelay,
  fromAssetHubToForeign,
  getNativeAsset,
  watchAccoutFreeBalance,
  watchForeingAssetAccoutFreeBalance, fromSystemToSibling,
} from "../common"

const api = dotAhClient.getTypedApi(dotAh)

const dot: AssetInChain = {
  chain: "dotAh",
  symbol: "DOT",
  watchFreeBalance: watchAccoutFreeBalance(api),
  watchPorteerStatus: null,
  teleport: {
    dot: (...args) =>
      api.tx.PolkadotXcm.transfer_assets(fromAssetHubToRelay(...args)),
    ksmAh: (from, amount, to) =>
      api.tx.PolkadotXcm.transfer_assets(
        fromAssetHubToForeign(
          XcmV5NetworkId.Kusama(),
          1000,
          getNativeAsset(1, amount),
          from,
          to,
        ),
      ),
  },
}

const ksmInDotAh: Parameters<typeof XcmVersionedLocation.V5>[0] = {
  parents: 2,
  interior: XcmV5Junctions.X1(
    XcmV5Junction.GlobalConsensus(XcmV5NetworkId.Kusama()),
  ),
}

const ksm: AssetInChain = {
  chain: "dotAh",
  symbol: "KSM",
  watchFreeBalance: watchForeingAssetAccoutFreeBalance(api, ksmInDotAh),
  watchPorteerStatus: null,
  teleport: {
    /*
    ksmAh: (from, amount, to) =>
      api.tx.PolkadotXcm.limited_reserve_transfer_assets(
        fromAssetHubToForeign(
          XcmV4JunctionNetworkId.Kusama(),
          1000,
          XcmVersionedAssets.V5([
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

const teerInDotAh: Parameters<typeof XcmVersionedLocation.V5>[0] = {
  parents: 1,
  interior: XcmV5Junctions.X1(
    XcmV5Junction.Parachain(2039),
  ),
}

const teer: AssetInChain = {
  chain: "dotAh",
  symbol: "TEER",
  watchFreeBalance: watchForeingAssetAccoutFreeBalance(api, teerInDotAh),
  watchPorteerStatus: null,
  teleport: {
    itp: (from, amount, to) =>
      api.tx.PolkadotXcm.transfer_assets(
        fromSystemToSibling(
          2039,
          XcmVersionedAssets.V5([
            {
              id: teerInDotAh,
              fun: XcmV3MultiassetFungibility.Fungible(amount),
            },
          ]),
          from,
          to,
        ),
      ),
  },
}

export default [teer, dot, ksm]
