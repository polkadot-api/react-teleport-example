import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { smoldot } from "./smoldot"
import { rocRelayChain } from "./roc"

const chainSpec = `{
  "name": "Rococo Asset Hub",
  "id": "asset-hub-rococo",
  "chainType": "Live",
  "bootNodes": [
    "/dns/rococo-asset-hub-bootnode-0.polkadot.io/tcp/443/wss/p2p/12D3KooWRrZMndHAopzao34uGsN7srjS3gh9nAjTGKLSyJeU31Lg"
  ],
  "telemetryEndpoints": null,
  "protocolId": null,
  "properties": {
    "tokenDecimals": 12,
    "tokenSymbol": "ROC"
  },
  "relay_chain": "rococo_v2_2",
  "para_id": 1000,
  "codeSubstitutes": {},
  "genesis": {
    "stateRootHash": "0xad0224198565f04f9f7a6120231d310f9280669ec3395b898dd2bb69e1deb87d"
  }
}`

const smoldotParaChain = rocRelayChain.then((relayChain) =>
  smoldot.addChain({ chainSpec, potentialRelayChains: [relayChain] }),
)

export const rocAhClient = createClient(getSmProvider(smoldotParaChain))
