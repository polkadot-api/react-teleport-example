import React, { Reducer, useReducer, useState } from "react"
import { useBalance } from "./use-balance"
import { Label } from "@/components/ui/label"
import { AssetId, CHAIN_NAMES, ChainId, chains } from "@/api"
import {
  SelectTrigger,
  SelectValue,
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Card, CardHeader } from "@/components/ui/card"
import { FormattedToken } from "./FormattedToken"
import { Input } from "@/components/ui/input"
import { FeesAndSubmit } from "./FeesAndSubmit"

const Selector: React.FC<{
  value: string
  onChange: (value: string) => void
  values: Array<{ key: string; display: string }>
}> = ({ onChange, values, value }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {values.map(({ key, display }) => (
        <SelectItem key={key} value={key}>
          {display}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

const fromChains = [...chains.keys()]
const chainToSelectorValue = (chain: ChainId) => ({
  key: chain,
  display: CHAIN_NAMES[chain],
})

interface TeleporterState {
  from: ChainId
  to: { options: ChainId[]; selected: ChainId }
  asset: { options: AssetId[]; selected: AssetId }
}
const teleportReducer: Reducer<
  TeleporterState,
  { type: "from" | "to"; value: ChainId } | { type: "asset"; value: AssetId }
> = (state, event) => {
  if (event.type === "to")
    return { ...state, to: { ...state.to, selected: event.value } }

  const from = event.type === "from" ? event.value : state.from

  let asset = state.asset
  if (event.type === "asset") asset.selected = event.value
  else {
    asset.options = [...chains.get(from)!.keys()].filter(
      (x) => Object.keys(chains.get(from)!.get(x)!.teleport).length,
    )
    asset.selected = asset.options[0]
  }

  const toOptions = Object.keys(
    chains.get(from)!.get(asset.selected)!.teleport,
  ) as ChainId[]
  const to = { options: toOptions, selected: toOptions[0] }

  return { from, asset, to }
}

const initialState = teleportReducer({ asset: {} } as TeleporterState, {
  type: "from",
  value: "dot",
})

export const Teleport: React.FC = () => {
  const [{ from, to, asset }, dispatch] = useReducer(
    teleportReducer,
    initialState,
  )
  const [amount, setAmount] = useState<number | null>(null)
  const fromBalance = useBalance(from, asset.selected)

  return (
    <>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="name">From Chain:</Label>
        <Selector
          value={from}
          onChange={(value) =>
            dispatch({ type: "from", value: value as ChainId })
          }
          values={fromChains.map(chainToSelectorValue)}
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="name">Asset:</Label>
        <Selector
          value={asset.selected}
          onChange={(value) =>
            dispatch({ type: "asset", value: value as AssetId })
          }
          values={asset.options.map((key) => ({
            key,
            display: key,
          }))}
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="name">To Chain:</Label>
        <Selector
          value={to.selected}
          onChange={(value) =>
            dispatch({ type: "to", value: value as ChainId })
          }
          values={to.options.map(chainToSelectorValue)}
        />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader className="m-0 p-2 text-center">
          Transferable Balances
        </CardHeader>
        <ul className="grid gap-3 m-2">
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">{CHAIN_NAMES[from]}</span>
            <span>
              <FormattedToken asset={asset.selected} value={fromBalance} />
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {CHAIN_NAMES[to.selected]}
            </span>
            <span>
              <FormattedToken
                asset={asset.selected}
                value={useBalance(to.selected, asset.selected)}
              />
            </span>
          </li>
        </ul>
      </Card>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="amount">Amount</Label>
        <Input
          value={amount?.toString() ?? ""}
          onChange={({ target: { value } }) => {
            const amount = Number(value)
            setAmount(isNaN(amount) ? null : amount)
          }}
          type="number"
          id="amount"
          placeholder="Amount to teleport"
        />
      </div>
      <FeesAndSubmit
        from={from}
        to={to.selected}
        asset={asset.selected}
        amount={amount}
      />
    </>
  )
}
