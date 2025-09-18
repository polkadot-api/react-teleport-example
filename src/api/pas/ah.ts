import { pasAh as descriptors } from "@polkadot-api/descriptors"
import { pasAhClient } from "@/api/clients"
import { AssetInChain } from "../types"
import { fromParaToRelay, watchAccoutFreeBalance } from "../common"

const api = pasAhClient.getTypedApi(descriptors)

const chain = "pasAh"
const pas: AssetInChain = {
  chain,
  symbol: "PAS",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    pas: (...args) =>
      api.tx.PolkadotXcm.transfer_assets(fromParaToRelay(...args)),
  },
}

export default [pas]
