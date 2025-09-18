import {
  DotAhWhitelistEntry,
  DotWhitelistEntry,
  ItkWhitelistEntry,
  ItpWhitelistEntry
} from "@polkadot-api/descriptors"

const dotWhitelist: DotWhitelistEntry[] = [
  "tx.XcmPallet.transfer_assets",
  "query.System.Account",
  "const.Balances.ExistentialDeposit",
]

// Porteer module descriptors for Integritee Polkadot
const itpWhitelist: ItpWhitelistEntry[] = [
  "tx.Porteer.port_tokens",
  "query.Porteer.LastHeartBeat",
  "query.Porteer.PorteerConfigValue", 
  "query.Porteer.XcmFeeConfig",
  "event.Porteer.MintedPortedTokens",
  "event.Porteer.ForwardedPortedTokens",
  "event.Porteer.PortedTokens",
]

// Porteer module descriptors for Integritee Kusama
const itkWhitelist: ItkWhitelistEntry[] = [
  "tx.Porteer.port_tokens",
  "query.Porteer.LastHeartBeat",
  "query.Porteer.PorteerConfigValue", 
  "query.Porteer.XcmFeeConfig",
  "event.Porteer.MintedPortedTokens",
  "event.Porteer.ForwardedPortedTokens",
  "event.Porteer.PortedTokens",
]

const ahWhitelist: DotAhWhitelistEntry[] = [
  "tx.PolkadotXcm.transfer_assets",
  "query.ForeignAssets.Account",
  "const.Balances.ExistentialDeposit",
  "event.ForeignAssets.Issued",
]

export const whitelist = [...dotWhitelist, ...ahWhitelist, ...itpWhitelist, ...itkWhitelist]
