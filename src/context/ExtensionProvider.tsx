import {
  InjectedExtension,
  connectInjectedExtension,
} from "polkadot-api/pjs-signer"
import { PropsWithChildren, useSyncExternalStore } from "react"
import { extensionCtx, useAvailableExtensions } from "./extensionCtx"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

const getExtensionsStore = () => {
  let connectedExtensions = new Map<string, InjectedExtension>()
  const getSnapshot = () => connectedExtensions

  const listeners = new Set<() => void>()
  const update = () => {
    connectedExtensions = new Map(connectedExtensions)
    listeners.forEach((cb) => {
      cb()
    })
  }
  const subscribe = (cb: () => void) => {
    listeners.add(cb)
    return () => {
      listeners.delete(cb)
    }
  }

  let isRunning = false
  const onToggleExtension = (name: string) => {
    if (isRunning) return

    if (connectedExtensions.has(name)) {
      connectedExtensions.delete(name)
      return update()
    }

    isRunning = true
    connectInjectedExtension(name)
      .then(
        (extension) => {
          connectedExtensions.set(name, extension)
          update()
        },
        () => {},
      )
      .finally(() => {
        isRunning = false
      })
  }

  return {
    subscribe,
    getSnapshot,
    onToggleExtension,
  }
}

const extensionsStore = getExtensionsStore()
extensionsStore.subscribe(Function.prototype as any)

export const ExtensionProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const availableExtensions = useAvailableExtensions()
  const selectedExtensions = useSyncExternalStore(
    extensionsStore.subscribe,
    extensionsStore.getSnapshot,
  )

  if (availableExtensions.length === 0)
    return <div>No extension provider detected</div>

  return (
    <>
      <Label>Click on the extension name to (dis)connect it:</Label>
      <TabsList>
        {availableExtensions.map((extensionName) => (
          <TabsTrigger
            className="mx-1"
            onClick={() => {
              extensionsStore.onToggleExtension(extensionName)
            }}
            active={selectedExtensions.has(extensionName)}
            key={extensionName}
          >
            {extensionName}
          </TabsTrigger>
        ))}
      </TabsList>
      <extensionCtx.Provider value={[...selectedExtensions.values()]}>
        {selectedExtensions.size ? children : null}
      </extensionCtx.Provider>
    </>
  )
}
