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
import { FeesAndSubmit } from "./FeesAndSumit"

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
const getToChains = (from: ChainId, asset: AssetId): ChainId[] =>
  Object.keys(chains.get(from)!.get(asset)!.teleport) as ChainId[]

const teleportReducer: Reducer<
  { from: ChainId; to: ChainId; asset: AssetId },
  { type: "from" | "to"; value: ChainId } | { type: "asset"; value: AssetId }
> = (state, event) => {
  if (event.type === "to") return { ...state, to: event.value }

  const from = event.type === "from" ? event.value : state.from
  const asset =
    event.type === "asset" ? event.value : [...chains.get(from)!.keys()][0]
  const to = Object.keys(chains.get(from)!.get(asset)!.teleport)[0] as ChainId

  return { from, asset, to }
}

export const Teleport: React.FC = () => {
  const [{ from, to, asset }, dispatch] = useReducer(teleportReducer, {
    from: "dot",
    to: "dotAh",
    asset: "DOT",
  })
  const [amount, setAmount] = useState<number | null>(null)
  const fromBalance = useBalance(from, asset)

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
          value={asset}
          onChange={(value) =>
            dispatch({ type: "asset", value: value as AssetId })
          }
          values={[...chains.get(from)!.keys()].map((key) => ({
            key,
            display: key,
          }))}
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="name">To Chain:</Label>
        <Selector
          value={to}
          onChange={(value) =>
            dispatch({ type: "to", value: value as ChainId })
          }
          values={getToChains(from, asset).map(chainToSelectorValue)}
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
              <FormattedToken asset={asset} value={fromBalance} />
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-muted-foreground">{CHAIN_NAMES[to]}</span>
            <span>
              <FormattedToken asset={asset} value={useBalance(to, asset)} />
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
      <FeesAndSubmit from={from} to={to} asset={asset} amount={amount} />
    </>
  )
}
