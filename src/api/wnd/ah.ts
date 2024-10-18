import { wndAssethub as descriptors } from "@polkadot-api/descriptors"
import { wndAhClient } from "@/api/clients"
import { AssetInChain } from "../types"
import { fromAssetHubToRelay, watchAccoutFreeBalance } from "../common"

const api = wndAhClient.getTypedApi(descriptors)

const wnd: AssetInChain = {
  chain: "wndAh",
  symbol: "WND",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    wnd: (...args) =>
      api.tx.PolkadotXcm.transfer_assets(fromAssetHubToRelay(...args)),
  },
}

export default [wnd]
