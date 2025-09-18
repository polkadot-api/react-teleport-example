import { wnd as descriptors } from "@polkadot-api/descriptors"
import { wndClient } from "@/api/clients"
import { AssetInChain } from "../types"
import { fromRelayToParachain, watchAccoutFreeBalance } from "../common"

const api = wndClient.getTypedApi(descriptors)

const wnd: AssetInChain = {
  chain: "wnd",
  symbol: "WND",
  watchFreeBalance: watchAccoutFreeBalance(api),
  teleport: {
    wndAh: (...args) =>
      api.tx.XcmPallet.transfer_assets(fromRelayToParachain(1000, ...args)),
  },
}

export default [wnd]
