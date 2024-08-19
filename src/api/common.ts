import { AccountId, PolkadotSigner, TypedApi } from "polkadot-api"
import {
  XcmV3Junction,
  XcmV3JunctionNetworkId,
  XcmV3Junctions,
  XcmV3MultiassetAssetId,
  XcmV3MultiassetFungibility,
  XcmV3WeightLimit,
  XcmVersionedAssets,
  XcmVersionedLocation,
  dotAh,
} from "@polkadot-api/descriptors"
import { Binary, Enum, SS58String } from "polkadot-api"
import { map } from "rxjs"

const encodeAccount = AccountId().enc

export const getBeneficiary = (address: SS58String | Uint8Array) => ({
  type: "V3" as const,
  value: {
    parents: 0,
    interior: {
      type: "X1" as const,
      value: {
        type: "AccountId32" as const,
        value: {
          network: undefined,
          id: Binary.fromBytes(
            address instanceof Uint8Array ? address : encodeAccount(address),
          ),
        },
      },
    },
  },
})

export const getNativeAsset = (parents: number, amount: bigint) =>
  XcmVersionedAssets.V3([
    {
      id: XcmV3MultiassetAssetId.Concrete({
        parents,
        interior: Enum("Here"),
      }),
      fun: XcmV3MultiassetFungibility.Fungible(amount),
    },
  ])

export const fromRelayToAssetHub = (
  from: PolkadotSigner,
  amount: bigint,
  to?: SS58String,
) => ({
  dest: XcmVersionedLocation.V3({
    parents: 0,
    interior: XcmV3Junctions.X1(XcmV3Junction.Parachain(1000)),
  }),
  beneficiary: getBeneficiary(to ?? from.publicKey),
  assets: getNativeAsset(0, amount),
  fee_asset_item: 0,
  weight_limit: XcmV3WeightLimit.Unlimited(),
})

export const fromAssetHubToRelay = (
  from: PolkadotSigner,
  amount: bigint,
  to?: SS58String,
) => ({
  dest: {
    type: "V3" as const,
    value: {
      parents: 1,
      interior: {
        type: "Here" as const,
        value: undefined,
      },
    },
  },
  beneficiary: getBeneficiary(to ?? from.publicKey),
  assets: getNativeAsset(1, amount),
  fee_asset_item: 0,
  weight_limit: XcmV3WeightLimit.Unlimited(),
})

export const fromAssetHubToForeign = (
  network: XcmV3JunctionNetworkId,
  parachainId: number,
  assets: XcmVersionedAssets,
  from: PolkadotSigner,
  to?: SS58String,
) => ({
  dest: XcmVersionedLocation.V3({
    parents: 2,
    interior: XcmV3Junctions.X2([
      XcmV3Junction.GlobalConsensus(network),
      XcmV3Junction.Parachain(parachainId),
    ]),
  }),
  beneficiary: getBeneficiary(to ?? from.publicKey),
  assets,
  fee_asset_item: 0,
  weight_limit: XcmV3WeightLimit.Unlimited(),
})

/*
export const toAssetHub = (
  from: PolkadotSigner,
  amount: bigint,
  to?: SS58String,
) => ({
  dest: XcmVersionedMultiLocation.V3({
    parents: 1,
    interior: DotXcmV3Junctions.Here(),
  }),
  beneficiary: getBeneficiary(to ?? from.publicKey),
  assets: getNativeAsset(1, amount),
  fee_asset_item: 0,
  weight_limit: XcmV3WeightLimit.Unlimited(),
})
*/

type GenericApi = TypedApi<typeof dotAh>

export const watchAccoutFreeBalance =
  (api: {
    query: {
      System: {
        Account: {
          watchValue: GenericApi["query"]["System"]["Account"]["watchValue"]
        }
      }
    }
  }) =>
  (account: SS58String) =>
    api.query.System.Account.watchValue(account, "best").pipe(
      map(({ data }) => data.free - data.frozen),
    )

export const watchForeingAssetAccoutFreeBalance =
  (
    api: {
      query: {
        ForeignAssets: {
          Account: {
            watchValue: GenericApi["query"]["ForeignAssets"]["Account"]["watchValue"]
          }
        }
      }
    },
    asset: { parents: number; interior: XcmV3Junctions },
  ) =>
  (account: SS58String) =>
    api.query.ForeignAssets.Account.watchValue(asset, account, "best").pipe(
      map((data) =>
        data?.status && Enum.is(data.status, "Liquid") ? data.balance : 0n,
      ),
    )
