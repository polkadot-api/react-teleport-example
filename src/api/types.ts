import type { Observable } from "rxjs"
import type { PolkadotSigner, SS58String, Transaction } from "polkadot-api"

export type ChainId =
  | "dot"
  | "dotAh"
  | "wnd"
  | "wndAh"
  | "ksm"
  | "ksmAh"
  | "pas"
  | "pasAh"
export type AssetId = "DOT" | "KSM" | "WND" | "PAS"

export type TeleportAsset = (
  from: PolkadotSigner,
  amount: bigint,
  to?: SS58String,
) => Transaction<any, any, any, any>

export interface AssetInChain {
  chain: ChainId
  symbol: AssetId
  watchFreeBalance: (from: SS58String) => Observable<bigint>
  teleport: Partial<Record<ChainId, TeleportAsset>>
}
