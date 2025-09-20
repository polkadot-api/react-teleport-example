import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAccounts } from "@reactive-dot/react"
import { PolkadotIdenticon } from "dot-identicon/react.js"
import React, { PropsWithChildren, useMemo, useState } from "react"
import { SelectedAccountCtx } from "./accountCtx"

export const AccountProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const accounts = useAccounts()
  const [selectedAccountId, setSelectedAccountId] = useState<string>()
  const selectedAccount = useMemo(
    () =>
      accounts.find(
        (account) => account.wallet.id + account.address === selectedAccountId,
      ),
    [accounts, selectedAccountId],
  )

  return (
    <>
      <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
        <SelectTrigger>
          <SelectValue placeholder="Select an account" />
        </SelectTrigger>
        <SelectContent>
          {accounts.map((account, index) => (
            <SelectItem key={index} value={account.wallet.id + account.address}>
              <div className="flex items-center gap-1">
                <PolkadotIdenticon address={account.address} />
                {account.name ?? account.address}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedAccount && (
        <SelectedAccountCtx.Provider value={selectedAccount}>
          {children}
        </SelectedAccountCtx.Provider>
      )}
    </>
  )
}
