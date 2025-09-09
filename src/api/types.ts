import type { Observable } from "rxjs"
import type { PolkadotSigner, SS58String, Transaction } from "polkadot-api"

export type ChainId =
  | "dot"
  | "dotAh"
  | "wnd"
  | "wndAh"
  | "ksm"
  | "ksmAh"
  | "ksmEnc"
  | "pas"
  | "pasAh"
  | "passet"
  | "itk"
  | "itp"
export type AssetId = "DOT" | "KSM" | "WND" | "PAS" | "TEER" | "ITK" | "ITP"

export type TeleportAsset = (
  from: PolkadotSigner,
  amount: bigint,
  to?: SS58String,
) => Transaction<any, any, any, any>

export type PorteerStatus = {
  heartbeat: bigint,
  config: { send_enabled: boolean; receive_enabled: boolean; },
  fees: { local_equivalent_sum: bigint; hop1: bigint; hop2: bigint; hop3: bigint; }
}
export interface AssetInChain {
  chain: ChainId
  symbol: AssetId
  watchFreeBalance: (from: SS58String) => Observable<bigint>
  watchPorteerStatus: (() => Observable<PorteerStatus>) | null
  teleport: Partial<Record<ChainId, TeleportAsset>>
}
