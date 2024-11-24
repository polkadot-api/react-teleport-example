import { pasAh as descriptors } from "@polkadot-api/descriptors"
import { pasAhClient } from "@/api/clients"
import { AssetInChain } from "../types"
import { fromAssetHubToRelay, watchAccoutFreeBalance } from "../common"

const api = pasAhClient.getTypedApi(descriptors)

const chain = "pasAh"
const pas: AssetInChain = {
  chain,
  symbol: "PAS",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    pas: (...args) =>
      api.tx.PolkadotXcm.transfer_assets(fromAssetHubToRelay(...args)),
  },
}

export default [pas]
