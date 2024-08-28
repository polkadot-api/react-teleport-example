import {
  DotAhWhitelistEntry,
  DotWhitelistEntry,
} from "@polkadot-api/descriptors"

const dotWhitelist: DotWhitelistEntry[] = [
  "tx.XcmPallet.limited_teleport_assets",
  "tx.XcmPallet.limited_reserve_transfer_assets",
  "query.System.Account",
  "const.Balances.ExistentialDeposit",
]

const ahWhitelist: DotAhWhitelistEntry[] = [
  "tx.PolkadotXcm.limited_teleport_assets",
  "tx.PolkadotXcm.limited_reserve_transfer_assets",
  "query.ForeignAssets.Account",
  "const.Balances.ExistentialDeposit",
]

export const whitelist = [...dotWhitelist, ...ahWhitelist]
