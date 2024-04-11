import { AccountId, PolkadotSigner, TypedApi } from "polkadot-api"
import {
  DotXcmV3Junctions,
  DotXcmV3MultiassetAssetId,
  XcmV3Junction,
  XcmV3JunctionNetworkId,
  XcmV3MultiassetFungibility,
  XcmV3WeightLimit,
  XcmVersionedMultiAssets,
  XcmVersionedMultiLocation,
  dotAh,
} from "@polkadot-api/descriptors"
import { Binary, Enum, SS58String } from "polkadot-api"
import { map } from "rxjs"

const encodeAccount = AccountId().enc

export const getBeneficiary = (address: SS58String | Uint8Array) =>
  XcmVersionedMultiLocation.V3({
    parents: 0,
    interior: DotXcmV3Junctions.X1(
      XcmV3Junction.AccountId32({
        network: undefined,
        id: Binary.fromBytes(
          address instanceof Uint8Array ? address : encodeAccount(address),
        ),
      }),
    ),
  })

export const getNativeAsset = (parents: number, amount: bigint) =>
  XcmVersionedMultiAssets.V3([
    {
      id: DotXcmV3MultiassetAssetId.Concrete({
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
  dest: XcmVersionedMultiLocation.V3({
    parents: 0,
    interior: DotXcmV3Junctions.X1(XcmV3Junction.Parachain(1000)),
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
  dest: XcmVersionedMultiLocation.V3({
    parents: 1,
    interior: DotXcmV3Junctions.Here(),
  }),
  beneficiary: getBeneficiary(to ?? from.publicKey),
  assets: getNativeAsset(1, amount),
  fee_asset_item: 0,
  weight_limit: XcmV3WeightLimit.Unlimited(),
})

export const fromAssetHubToForeign = (
  network: XcmV3JunctionNetworkId,
  parachainId: number,
  assets: XcmVersionedMultiAssets,
  from: PolkadotSigner,
  to?: SS58String,
) => ({
  dest: XcmVersionedMultiLocation.V3({
    parents: 2,
    interior: DotXcmV3Junctions.X2([
      XcmV3Junction.GlobalConsensus(network),
      XcmV3Junction.Parachain(parachainId),
    ]),
  }),
  beneficiary: getBeneficiary(to ?? from.publicKey),
  assets,
  fee_asset_item: 0,
  weight_limit: XcmV3WeightLimit.Unlimited(),
})

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
    asset: { parents: number; interior: DotXcmV3Junctions },
  ) =>
  (account: SS58String) =>
    api.query.ForeignAssets.Account.watchValue(asset, account, "best").pipe(
      map((data) => (data?.status.is("Liquid") ? data.balance : 0n)),
    )
