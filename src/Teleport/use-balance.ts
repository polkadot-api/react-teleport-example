import { AssetId, ChainId, chains } from "@/api"
import { useSelectedAccount } from "@/context"
import { useEffect, useState } from "react"

export const useBalance = (chain: ChainId, asset: AssetId) => {
  const account = useSelectedAccount()
  const [balance, setBalance] = useState<bigint | null>(null)

  useEffect(() => {
    setBalance(null)

    const subscription = chains
      .get(chain)!
      .get(asset)!
      .watchFreeBalance(account.address)
      .subscribe(setBalance)

    return () => {
      subscription.unsubscribe()
    }
  }, [account, chain, asset])

  return balance
}
