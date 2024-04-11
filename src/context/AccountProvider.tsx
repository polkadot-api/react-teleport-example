import {
  InjectedExtension,
  InjectedPolkadotAccount,
} from "polkadot-api/pjs-signer"
import React, {
  PropsWithChildren,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react"
import { useSelectedExtensions } from "./extensionCtx"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectedAccountCtx } from "./accountCtx"

export const Accounts: React.FC<{ extension: InjectedExtension }> = ({
  extension,
}) => {
  const accounts = useSyncExternalStore(
    extension.subscribe,
    extension.getAccounts,
  )

  return (
    <SelectGroup>
      <SelectLabel>{extension.name}</SelectLabel>
      {accounts.map((account) => (
        <SelectItem
          key={account.address}
          value={account.address + "-" + extension.name}
        >
          {account.name ?? account.address}
        </SelectItem>
      ))}
    </SelectGroup>
  )
}

const SignerCtx: React.FC<PropsWithChildren<{ account: string | null }>> = ({
  account,
  children,
}) => {
  const extensions = useSelectedExtensions()
  const [injectedPolkadotAccount, setInjectedPolkadotAccount] =
    useState<InjectedPolkadotAccount | null>(null)

  useEffect(() => {
    if (!account) {
      setInjectedPolkadotAccount(null)
      return
    }

    const separator = account.indexOf("-")
    const address = account.slice(0, separator)
    const extensionName = account.slice(separator + 1)

    setInjectedPolkadotAccount(
      extensions
        .find((x) => x.name === extensionName)
        ?.getAccounts()
        .find((account) => account.address === address) ?? null,
    )
  }, [extensions, account])

  return (
    injectedPolkadotAccount && (
      <SelectedAccountCtx.Provider value={injectedPolkadotAccount}>
        {children}
      </SelectedAccountCtx.Provider>
    )
  )
}

export const AccountProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedAccount, setSelectedAcount] = useState<string | null>(null)
  const extensions = useSelectedExtensions()

  return (
    <>
      <Select onValueChange={setSelectedAcount}>
        <SelectTrigger>
          <SelectValue placeholder="Select an account" />
        </SelectTrigger>
        <SelectContent>
          {extensions.map((extension) => (
            <Accounts key={extension.name} {...{ extension }} />
          ))}
        </SelectContent>
      </Select>
      <SignerCtx account={selectedAccount}>{children}</SignerCtx>
    </>
  )
}
