import dot from "./dot"
import ksm from "./ksm"
import wnd from "./wnd"
import roc from "./roc"
import { AssetId, AssetInChain, ChainId } from "./types"

const assetsInChains = [...dot, ...ksm, ...wnd, ...roc]

export const chains = new Map<ChainId, Map<AssetId, AssetInChain>>()

assetsInChains.forEach((assetinChain) => {
  const { chain, symbol } = assetinChain
  if (!chains.has(chain)) chains.set(chain, new Map())

  chains.get(chain)!.set(symbol, assetinChain)
})

export const ASSET_DECIMALS: Record<AssetId, number> = {
  DOT: 10,
  KSM: 12,
  WND: 12,
  ROC: 12,
}

export const CHAIN_NAMES: Record<ChainId, string> = {
  dot: "Polkadot RelayChain",
  dotAh: "Polkadot AssetHub",
  ksm: "Kusama RelayChain",
  ksmAh: "Kusama AssetHub",
  wnd: "Westend RelayChain",
  wndAh: "Westend AssetHub",
  roc: "Rococo RelayChain",
  rocAh: "Rococo AssetHub",
}
