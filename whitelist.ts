import {
  DotAhWhitelistEntry,
  DotWhitelistEntry,
} from "@polkadot-api/descriptors"

const dotWhitelist: DotWhitelistEntry[] = [
  "tx.XcmPallet.transfer_assets",
  "query.System.Account",
  "const.Balances.ExistentialDeposit",
]

const ahWhitelist: DotAhWhitelistEntry[] = [
  "tx.PolkadotXcm.transfer_assets",
  "query.ForeignAssets.Account",
  "const.Balances.ExistentialDeposit",
]

export const whitelist = [...dotWhitelist, ...ahWhitelist]
