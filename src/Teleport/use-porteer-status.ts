import { AssetId, ChainId, chains } from "@/api"
import { useEffect, useState } from "react"
import { PorteerStatus } from "@/api/types.ts"
export const usePorteerStatus = (chain: ChainId, asset: AssetId) => {
  const [status, setStatus] = useState<PorteerStatus | null>(null)
  useEffect(() => {
    if (chain !== "itp" && chain !== "itk") {
      setStatus(null)
      return
    }
    const watchPorteerStatus = chains
      .get(chain)!
      .get("TEER")!
      .watchPorteerStatus
    if (!watchPorteerStatus) {
      setStatus(null)
      return
    }
    const subscription = watchPorteerStatus().subscribe(setStatus)
    return () => subscription.unsubscribe()
  }, [chain, asset])

  return status
}
