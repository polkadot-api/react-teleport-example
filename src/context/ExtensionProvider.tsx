import { useConnectedWallets, useWallets } from "@reactive-dot/react"
import { ConnectionButton } from "dot-connect/react.js"
import { PropsWithChildren, Suspense } from "react"

export const ExtensionProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const availableWallets = useWallets()
  const connectedWallets = useConnectedWallets()

  if (availableWallets.length === 0)
    return <div>No extension provider detected</div>

  return (
    <>
      <ConnectionButton className="w-full" />
      <Suspense>{connectedWallets.length ? children : null}</Suspense>
    </>
  )
}
