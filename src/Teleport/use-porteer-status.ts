import { ChainId, chains } from "@/api"
import { useEffect, useState } from "react"
import { PorteerStatus } from "@/api/types.ts"
export const usePorteerStatus = (chain: ChainId) => {
  const [status, setStatus] = useState<PorteerStatus | null>(null)
  console.log("status step 0: ", chain)
  useEffect(() => {
    console.log("status step 1: ", chain)
    if (chain !== "itp" && chain !== "itk") {
      setStatus(null)
      return
    }
    console.log("status step 2: ", chain)
    const watchPorteerStatus = chains
      .get(chain)!
      .get("TEER")!
      .watchPorteerStatus
    console.log("status step 3: ", chain)
    if (!watchPorteerStatus) {
      setStatus(null)
      return
    }
    console.log("status step 4: ", chain)
    const subscription = watchPorteerStatus().subscribe(setStatus)
    console.log("status step 5: ", chain)
    return () => subscription.unsubscribe()
  }, [chain])

  return status
}
