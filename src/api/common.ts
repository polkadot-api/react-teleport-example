import { AccountId, PolkadotSigner, TypedApi } from "polkadot-api"
import {
  itk, dotAh,
  XcmV5Junction,
  XcmV5NetworkId,
  XcmV5Junctions,
  XcmV3MultiassetFungibility,
  XcmV3WeightLimit,
  XcmVersionedAssets,
  XcmVersionedLocation,
} from "@polkadot-api/descriptors"
import { Binary, Enum, SS58String } from "polkadot-api"
import { combineLatest, from, map } from "rxjs"

const encodeAccount = AccountId().enc

export const getBeneficiary = (address: SS58String | Uint8Array) =>
  XcmVersionedLocation.V5({
    parents: 0,
    interior: XcmV5Junctions.X1(
      XcmV5Junction.AccountId32({
        network: undefined,
        id: Binary.fromBytes(
          address instanceof Uint8Array ? address : encodeAccount(address),
        ),
      }),
    ),
  })

export const getNativeAsset = (parents: number, amount: bigint) =>
  XcmVersionedAssets.V5([
    {
      id: {
        parents,
        interior: XcmV5Junctions.Here(),
      },
      fun: XcmV3MultiassetFungibility.Fungible(amount),
    },
  ])

export const fromRelayToAssetHub = (
  from: PolkadotSigner,
  amount: bigint,
  to?: SS58String,
) => fromRelayToParachain(1000, from, amount, to)

export const fromRelayToEncointer = (
  from: PolkadotSigner,
  amount: bigint,
  to?: SS58String,
) => fromRelayToParachain(1001, from, amount, to)

export const fromRelayToParachain = (
  paraId: number,
  from: PolkadotSigner,
  amount: bigint,
  to?: SS58String,
) => ({
  dest: XcmVersionedLocation.V5({
    parents: 0,
    interior: XcmV5Junctions.X1(XcmV5Junction.Parachain(paraId)),
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
  dest: XcmVersionedLocation.V5({
    parents: 1,
    interior: XcmV5Junctions.Here(),
  }),
  beneficiary: getBeneficiary(to ?? from.publicKey),
  assets: getNativeAsset(1, amount),
  fee_asset_item: 0,
  weight_limit: XcmV3WeightLimit.Unlimited(),
})

export const fromEncointerToRelay = (
  from: PolkadotSigner,
  amount: bigint,
  to?: SS58String,
) => ({
  dest: {
    type: "V5" as const,
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
  network: XcmV5NetworkId,
  parachainId: number,
  assets: XcmVersionedAssets,
  from: PolkadotSigner,
  to?: SS58String,
) => ({
  dest: XcmVersionedLocation.V5({
    parents: 2,
    interior: XcmV5Junctions.X2([
      XcmV5Junction.GlobalConsensus(network),
      XcmV5Junction.Parachain(parachainId),
    ]),
  }),
  beneficiary: getBeneficiary(to ?? from.publicKey),
  assets,
  fee_asset_item: 0,
  weight_limit: XcmV3WeightLimit.Unlimited(),
})

export const fromSystemToSibling = (
  parachainId: number,
  assets: XcmVersionedAssets,
  from: PolkadotSigner,
  to?: SS58String,
) => ({
  dest: XcmVersionedLocation.V5({
    parents: 1,
    interior: XcmV5Junctions.X1(
      XcmV5Junction.Parachain(parachainId),
    ),
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
  dest: XcmVersionedMultiLocation.V5({
    parents: 1,
    interior: DotXcmV5Junctions.Here(),
  }),
  beneficiary: getBeneficiary(to ?? from.publicKey),
  assets: getNativeAsset(1, amount),
  fee_asset_item: 0,
  weight_limit: XcmV3WeightLimit.Unlimited(),
})
*/

type GenericApi = TypedApi<typeof dotAh>
type IntegriteeApi = TypedApi<typeof itk>

export const watchAccoutFreeBalance = (api: {
  constants: {
    Balances: {
      ExistentialDeposit: () => Promise<bigint>
    }
  }
  query: {
    System: {
      Account: {
        watchValue: GenericApi["query"]["System"]["Account"]["watchValue"]
      }
    }
  }
}) => {
  const edPromise = api.constants.Balances.ExistentialDeposit()
  return (account: SS58String) =>
    combineLatest([
      from(edPromise),
      api.query.System.Account.watchValue(account, "best"),
    ]).pipe(
      map(([ed, { data }]) => {
        const spendableBalance =
          data.free -
          (data.frozen - data.reserved > ed ? data.frozen - data.reserved : ed)
        return spendableBalance > 0n ? spendableBalance : 0n
      }),
    )
}

export const watchForeingAssetAccoutFreeBalance =
  <
    A,
    T extends {
      balance: bigint
      status: Enum<{
        Liquid: undefined
        Frozen: undefined
        Blocked: undefined
      }>
    },
  >(
    api: {
      query: {
        ForeignAssets: {
          Account: {
            watchValue: (
              asset: A,
              account: SS58String,
              at: "best",
            ) => Observable<T | undefined>
          }
        }
      }
    },
    asset: A,
  ) =>
  (account: SS58String) =>
    api.query.ForeignAssets.Account.watchValue(asset, account, "best").pipe(
      map((data) =>
        data?.status && Enum.is(data.status, "Liquid") ? data.balance : 0n,
      ),
    )


export const watchPorteerStatus = (api: {
  query: {
    Porteer: {
      LastHeartBeat: {
        watchValue: IntegriteeApi["query"]["Porteer"]["LastHeartBeat"]["watchValue"]
      },
      PorteerConfigValue: {
        watchValue: IntegriteeApi["query"]["Porteer"]["PorteerConfigValue"]["watchValue"]
      },
      XcmFeeConfig: {
        watchValue: IntegriteeApi["query"]["Porteer"]["XcmFeeConfig"]["watchValue"]
      }
    }
  }
}) => {
  return () =>
    combineLatest([
      api.query.Porteer.LastHeartBeat.watchValue("best"),
      api.query.Porteer.PorteerConfigValue.watchValue("best"),
      api.query.Porteer.XcmFeeConfig.watchValue("best"),
    ]).pipe(
      map(([heartbeat, config, fees]) => {
        console.log("heartbeat: ", heartbeat)
        console.log("config: ", config)
        console.log("fees: ", fees)
        return { heartbeat, config, fees }
      }),
    )
}
