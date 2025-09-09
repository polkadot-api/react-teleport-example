import { pas as descriptors } from "@polkadot-api/descriptors"
import { pasClient } from "@/api/clients"
import { AssetInChain } from "../types"
import {
  fromRelayToAssetHub,
  fromRelayToParachain,
  watchAccoutFreeBalance,
} from "../common"

const api = pasClient.getTypedApi(descriptors)

const pas: AssetInChain = {
  chain: "pas",
  symbol: "PAS",
  watchFreeBalance: watchAccoutFreeBalance(api),
  watchPorteerStatus: null,
  teleport: {
    pasAh: (...args) =>
      api.tx.XcmPallet.transfer_assets(fromRelayToAssetHub(...args)),
    passet: (...args) =>
      api.tx.XcmPallet.transfer_assets(fromRelayToParachain(1111, ...args)),
  },
}

export default [pas]
