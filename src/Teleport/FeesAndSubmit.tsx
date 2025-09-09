import { ASSET_DECIMALS, AssetId, CHAIN_NAMES, ChainId, chains } from "@/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSelectedAccount } from "@/context"
import { PolkadotSigner, Transaction } from "polkadot-api"
import React, {
  PropsWithChildren,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react"
import { FormattedToken } from "./FormattedToken"
import { cn, formatCurrency } from "@/lib/utils"

const SubmitDialog: React.FC<
  PropsWithChildren<{
    signer: PolkadotSigner
    signSubmitAndWatch: RefObject<
      Transaction<any, any, any, any>["signSubmitAndWatch"] | undefined
    >
    disabled?: boolean
  }>
> = ({ signer, signSubmitAndWatch, disabled, children }) => {
  const [dialogText, setDialogText] = useState<string>()
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  return (
    <Dialog open={openDialog}>
      <DialogTrigger>
        <Button
          onClick={() => {
            setDialogText("Wating for the transaction to be signed")
            setOpenDialog(true)
            signSubmitAndWatch.current!(signer).subscribe({
              next: (e) => {
                switch (e.type) {
                  case "signed": {
                    setDialogText("The transaction has been signed")
                    break
                  }
                  case "broadcasted": {
                    setDialogText(
                      "The transaction has been validated and broadcasted",
                    )
                    break
                  }
                  case "txBestBlocksState": {
                    e.found
                      ? setDialogText(
                          `The transaction was found in a best block (${e.block.hash}[${e.block.index}]), ${
                            e.ok
                              ? "and it's being successful! 🎉"
                              : "but it's failing... 😞"
                          }`,
                        )
                      : e.isValid
                        ? setDialogText(
                            "The transaction has been validated and broadcasted",
                          )
                        : setDialogText(
                            "The transaction is not valid anymore in the latest known best block",
                          )
                    break
                  }
                  case "finalized": {
                    setDialogText(
                      `The transaction is in a finalized block (${
                        e.block.hash
                      }[${e.block.index}]), ${
                        e.ok
                          ? "and it was successful! 🎉"
                          : "but it failed... 😞"
                      }`,
                    )
                    setTimeout(() => {
                      setOpenDialog(false)
                    }, 3_000)
                  }
                }
              },
              error: (e) => {
                setDialogText("An error ocurred, please try again later.")
                console.error(e)

                setTimeout(() => {
                  setOpenDialog(false)
                }, 3_000)
              },
            })
          }}
          className="w-full"
          disabled={disabled}
        >
          Teleport
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{children}</DialogTitle>
        <DialogDescription>{dialogText}</DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export const FeesAndSubmit: React.FC<{
  from: ChainId
  to: ChainId
  asset: AssetId
  amount: number | null
  bridgeFee?: bigint | null
  disabled?: boolean
}> = ({ from, to, asset, amount, bridgeFee, disabled }) => {
  const account = useSelectedAccount()
  const [fees, setFees] = useState<bigint | null>()
  const signSubmitAndWatch =
    useRef<Transaction<any, any, any, any>["signSubmitAndWatch"]>(undefined)

  const fixedAmount =
    amount !== null ? BigInt(amount * 10 ** ASSET_DECIMALS[asset]) : null

  useEffect(() => {
    setFees(null)
    if (fixedAmount === null) return

    let token: any = setTimeout(() => {
      const call = chains.get(from)!.get(asset)!.teleport[to]!(
        account.polkadotSigner,
        fixedAmount,
      )

      signSubmitAndWatch.current = call.signSubmitAndWatch
      call.getEstimatedFees(account.address).then((fees) => {
        if (token) setFees(fees + (bridgeFee ? bridgeFee : 0n) )
      })
    }, 50)

    return () => {
      signSubmitAndWatch.current = undefined
      clearTimeout(token)
      token = null
    }
  }, [from, to, asset, amount, disabled])

  return (
    <>
      <ul className="grid gap-3 m-1">
        <li className="flex items-center justify-between">
          <span
            className={cn(
              "text-muted-foreground",
              amount === null ? "invisible" : "",
            )}
          >
            Estimated fees
          </span>
          <span>
            {fees ? (
              <FormattedToken
                asset={asset}
                value={fees}
              />
            ) : (
              amount && "Loading"
            )}
          </span>
        </li>
      </ul>
      <SubmitDialog
        signSubmitAndWatch={signSubmitAndWatch}
        signer={account.polkadotSigner}
        disabled={disabled}
      >
        Teleporting{" "}
        {formatCurrency(fixedAmount, ASSET_DECIMALS[asset], {
          nDecimals: 4,
          padToDecimals: false,
        })}
        {asset} from {CHAIN_NAMES[from]} to {CHAIN_NAMES[to]}
      </SubmitDialog>
    </>
  )
}
