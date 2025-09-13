import {
  XcmV5Junction,
  XcmV5Junctions,
  XcmV5NetworkId,
  XcmVersionedLocation,
  ksmAh,
} from "@polkadot-api/descriptors"
import { ksmAhClient } from "@/api/clients"
import { AssetInChain } from "../types"
import {
  fromAssetHubToForeign,
  fromAssetHubToRelay, fromSystemToSibling,
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
      api.tx.PolkadotXcm.transfer_assets(fromAssetHubToRelay(...args)),
    ksmEnc: (from, amount, to) =>
      api.tx.PolkadotXcm.limited_teleport_assets(
        fromSystemToSibling(
          1001,
          getNativeAsset(1, amount),
          from,
          to,
        ),
      ),
    dotAh: (from, amount, to) =>
      api.tx.PolkadotXcm.transfer_assets(
        fromAssetHubToForeign(
          XcmV5NetworkId.Polkadot(),
          1000,
          getNativeAsset(1, amount),
          from,
          to,
        ),
      ),
  },
}

const dotInKsmAh: Parameters<typeof XcmVersionedLocation.V5>[0] = {
  parents: 2,
  interior: XcmV5Junctions.X1(
    XcmV5Junction.GlobalConsensus(XcmV5NetworkId.Polkadot()),
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
          XcmVersionedAssets.V4([
            {
              id: dotInKsmAh,
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
