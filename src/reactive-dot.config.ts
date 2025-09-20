import { defineConfig } from "@reactive-dot/core"
import { InjectedWalletProvider } from "@reactive-dot/core/wallets.js"
// import { WalletConnect } from "@reactive-dot/wallet-walletconnect"
import { LedgerWallet } from "@reactive-dot/wallet-ledger"
import { MimirWalletProvider } from "@reactive-dot/wallet-mimir"
import { registerDotConnect } from "dot-connect"

declare module "@reactive-dot/core" {
  export interface Register {
    config: typeof config
  }
}

export const config = defineConfig({
  chains: {},
  wallets: [
    new InjectedWalletProvider(),
    // TODO: Create WalletConnect project and fill in ID
    // new WalletConnect({
    //   projectId: "YOUR_PROJECT_ID",
    //   optionalChainIds: [
    //     "polkadot:91b171bb158e2d3848fa23a9f1c25182", // Polkadot
    //     "polkadot:b0a8d493285c2df73290dfb7e61f870f", // Kusama
    //     "polkadot:0x77afd6190f1554ad45fd0d31aee62a", // Paseo
    //     "polkadot:e143f23803ac50e8f6f8e62695d1ce9e", // Westend
    //   ],
    //   providerOptions: {
    //     metadata: {
    //       name: "Polkadot-API Teleporter",
    //       description: "Example teleporter dApp using Polkadot-API",
    //       url: "https://teleporter.papi.how",
    //       icons: [],
    //     },
    //   },
    // }),
    new LedgerWallet(),
    new MimirWalletProvider(),
  ],
})

registerDotConnect({ wallets: config.wallets ?? [] })
