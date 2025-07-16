import { passet as descriptors } from "@polkadot-api/descriptors"
import { AssetInChain } from "../types"
import { fromAssetHubToRelay, watchAccoutFreeBalance } from "../common"
import { passetClient } from "../clients"

const api = passetClient.getTypedApi(descriptors)

const chain = "passet"
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
