import { ASSET_DECIMALS, AssetId, CHAIN_NAMES, ChainId, chains } from "@/api"
import {
  itk, itp, ksmAh, dotAh
} from "@polkadot-api/descriptors"
import {
  getSs58AddressInfo
} from "@polkadot-api/substrate-bindings"
import { itkClient, itpClient, ksmAhClient, dotAhClient } from "@/api/clients"
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
import { Label } from "@/components/ui/label.tsx"

const itkApi = itkClient.getTypedApi(itk)
const itpApi = itpClient.getTypedApi(itp)
const ksmAhApi = ksmAhClient.getTypedApi(ksmAh)
const dotAhApi = dotAhClient.getTypedApi(dotAh)

type PorteerQueueElement = {
  time_included: Date
  time_arrived_other_side?: Date
  time_arrived_destination?: Date
  who: string,
  amount: bigint,
  source_nonce: number,
  destination: ChainId,
  hasArrivedOnOtherSide: boolean
  hasArrivedOnDestination: boolean
}
const SubmitDialog: React.FC<
  PropsWithChildren<{
    signer: PolkadotSigner
    signSubmitAndWatch: RefObject<
      Transaction<any, any, any, any>["signSubmitAndWatch"] | undefined
    >
    to: ChainId
    disabled?: boolean
  }>
> = ({ signer, signSubmitAndWatch, to, disabled, children }) => {
  const [dialogText, setDialogText] = useState<string>()
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [porteerQueue, setPorteerQueue] = useState<PorteerQueueElement[]>([])
  const porteerQueueRef = useRef(porteerQueue);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("A new item was added (or changed) to porteerQueue:", porteerQueue[porteerQueue.length - 1]);
    porteerQueueRef.current = porteerQueue;
  }, [porteerQueue]);
  useEffect(() => {
    let subscriptions: any[] = [];
    console.log("[ITP] Setting up subscription to Porteer.MintedPortedTokens");
    subscriptions.push(itpApi.event.Porteer.MintedPortedTokens.watch((  ) => true)
      .forEach((event) => {
        console.log("[ITP] Detected MintedPortedTokens event: who", event.payload.who?.toString(), " nonce:", event.payload.source_nonce, "of amount", event.payload.amount);
        const prev = porteerQueueRef.current;
        const index = prev.findIndex(item => ["itp", "dotAh"].includes(item.destination) && item.source_nonce === Number(event.payload.source_nonce));
        if (index !== -1) {
          console.log("[ITP] found match:", prev[index]);
          const newQueue = [...prev];
          newQueue[index].hasArrivedOnOtherSide = true;
          if (newQueue[index].destination === "itp") {
            newQueue[index].hasArrivedOnDestination = true;
            newQueue[index].time_arrived_destination = new Date();
          }
          setPorteerQueue(newQueue);
        }
      })
    );
    console.log("[ITP] Setting up subscription to Porteer.ForwardedPortedTokens");
    subscriptions.push(itpApi.event.Porteer.ForwardedPortedTokens.watch((  ) => true)
      .forEach((event) => {
        console.log("[ITP] Detected ForwardedPortedTokens event: who", event.payload.who?.toString(), " nonce:", event.payload.source_nonce, "of amount", event.payload.amount);
        const prev = porteerQueueRef.current;
        const index = prev.findIndex(item => item.destination === "dotAh" && item.source_nonce === Number(event.payload.source_nonce));
        if (index !== -1) {
          console.log("[ITP] found match:", prev[index]);
          const newQueue = [...prev];
          newQueue[index].hasArrivedOnOtherSide = true;
          newQueue[index].time_arrived_other_side = new Date();
          setPorteerQueue(newQueue);
        }
      })
    );

    console.log("[ITK] Setting up subscription to Porteer.MintedPortedTokens");
    subscriptions.push(itkApi.event.Porteer.MintedPortedTokens.watch((  ) => true)
      .forEach((event) => {
        console.log("[ITK] Detected MintedPortedTokens event: who", event.payload.who?.toString(), " nonce:", event.payload.source_nonce, "of amount", event.payload.amount);
        const prev = porteerQueueRef.current;
        const index = prev.findIndex(item => ["itk", "ksmAh"].includes(item.destination) && item.source_nonce === Number(event.payload.source_nonce));
        if (index !== -1) {
          console.log("[ITK] found match:", prev[index]);
          const newQueue = [...prev];
          newQueue[index].hasArrivedOnOtherSide = true;
          if (newQueue[index].destination === "itk") {
            newQueue[index].hasArrivedOnDestination = true;
            newQueue[index].time_arrived_destination = new Date();
          }
          setPorteerQueue(newQueue);
        }
      })
    );

    console.log("[ITK] Setting up subscription to Porteer.ForwardedPortedTokens");
    subscriptions.push(itkApi.event.Porteer.ForwardedPortedTokens.watch((  ) => true)
      .forEach((event) => {
        console.log("[ITK] Detected ForwardedPortedTokens event: who", event.payload.who?.toString(), " nonce:", event.payload.source_nonce, "of amount", event.payload.amount);
        const prev = porteerQueueRef.current;
        const index = prev.findIndex(item => item.destination === "ksmAh" && item.source_nonce === Number(event.payload.source_nonce));
        if (index !== -1) {
          console.log("[ITK] found match:", prev[index]);
          const newQueue = [...prev];
          newQueue[index].hasArrivedOnOtherSide = true;
          newQueue[index].time_arrived_other_side = new Date();
          setPorteerQueue(newQueue);
        }
      })
    );

    console.log("[dotAh] Setting up subscription to ForeignAssets.Issued");
    subscriptions.push(dotAhApi.event.ForeignAssets.Issued.watch(() => true)
      .forEach((event) => {
        console.log("[dotAh] Detected ForeignAssets.Issued event: to", event.payload.owner?.toString(), " amount", event.payload.amount, " asset: ", event.payload.asset_id.toString());
        const prev = porteerQueueRef.current;
        const index = prev.findIndex(item => item.destination === "dotAh" && addressesMatch(item.who, event.payload.owner));
        if (index !== -1) {
          console.log("[dotAh] found match:", prev[index]);
          const newQueue = [...prev];
          newQueue[index].hasArrivedOnDestination = true;
          newQueue[index].time_arrived_destination = new Date();
          setPorteerQueue(newQueue);
        }
      })
    );

    console.log("[ksmAh] Setting up subscription to ForeignAssets.Issued");
    subscriptions.push(ksmAhApi.event.ForeignAssets.Issued.watch(() => true)
      .forEach((event) => {
        console.log("[ksmAh] Detected ForeignAssets.Issued event: to", event.payload.owner?.toString(), " amount", event.payload.amount, " asset: ", event.payload.asset_id);
        const prev = porteerQueueRef.current;
        const index = prev.findIndex(item => item.destination === "ksmAh" && addressesMatch(item.who, event.payload.owner));
        if (index !== -1) {
          console.log("[ksmAh] found match:", prev[index]);
          const newQueue = [...prev];
          newQueue[index].hasArrivedOnDestination = true;
          newQueue[index].time_arrived_destination = new Date();
          setPorteerQueue(newQueue);
        }
      })
    );

    return () => {
      subscriptions.forEach(sub => {
        if (sub && typeof sub.unsubscribe === "function") {
          sub.unsubscribe();
        }
      });
    };
  }, []);

  // Helper function to truncate wallet addresses
  const truncateAddress = (address: string, maxLength: number = 15): string => {
    if (!address || address.length <= maxLength) return address;
    return `${address.substring(0, maxLength)}...`;
  };

  // Helper function to format token amounts
  const formatAmount = (amount: any): string => {
    try {
      // Convert to number and divide by 10^12
      const value = Number(amount) / 1_000_000_000_000;
      // Format with 4 decimal places
      return value.toFixed(4);
    } catch (e) {
      console.error("Error formatting amount:", e);
      return String(amount);
    }
  };

  return (
    <>
      <Dialog open={openDialog}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              setDialogText("Waiting for the transaction to be signed")
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
                      if (e.found) {
                        if (e.ok) {
                          setDialogText(`The transaction was found in a best block (${e.block.hash}[${e.block.index}]), and it's being successful! 🎉`)
                          console.log("events:", e.events)
                          // TODO this is a hack! we should not instantiate a new api of hardcoded type here, but it should work for both ITK and ITP
                          const filteredEvents = itkApi.event.Porteer.PortedTokens.filter(e.events);
                          console.log("filteredEvents:", filteredEvents);
                          if (filteredEvents.length > 0) {
                            // TODO: replace amount with source_nonce
                            const amount = filteredEvents[0].amount;
                            const who = filteredEvents[0].who.toString();
                            const source_nonce = Number(filteredEvents[0].source_nonce);
                            console.log("found PortedTokens Event with amount:", amount, ", who:", who, ", source_nonce:", source_nonce);
                            const newElement: PorteerQueueElement = {
                              time_included: new Date(),
                              who: who,
                              amount: amount,
                              destination: to,
                              hasArrivedOnOtherSide: false,
                              time_arrived_other_side: undefined,
                              hasArrivedOnDestination: false,
                              time_arrived_destination: undefined,
                              source_nonce: source_nonce
                            };
                            setPorteerQueue(prev => [...prev, newElement])
                          }
                        } else {
                          setDialogText(`The transaction was found in a best block (${e.block.hash}[${e.block.index}]), but it's failing... 😞`)
                        }
                      } else if (e.isValid) {
                        setDialogText("The transaction has been validated and broadcasted")
                      } else {
                        setDialogText("The transaction is not valid anymore in the latest known best block")
                      }
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
                setDialogText("An error occurred, please try again later.")
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
    
    {/* TEER bridge queue displayed below the dialog */}
    <div className="mt-6 text-left rounded-lg border border-border p-4 bg-card">
      <h3 className="text-lg font-bold mb-3">TEER Bridge Queue</h3>
      {porteerQueue.length === 0 ? (
        <div className="text-muted-foreground italic">No pending transactions</div>
      ) : (
        <ul className="space-y-4">
          {porteerQueue.map((item, idx) => (
            <li key={idx} className="border-b border-border pb-3 last:border-0 last:pb-0 relative">
              <div className="mb-2">
                {/* Status indicators moved down */}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">

              <div className="text-muted-foreground">Address:</div>
              <div>{truncateAddress(item.who)}</div>

                <div className="text-muted-foreground">Amount:</div>
                <div>{formatAmount(item.amount)}</div>
                
                <div className="text-muted-foreground">Nonce:</div>
                <div>{item.source_nonce}</div>
              </div>
              
              <div className="mt-2 text-xs">
                {!item.hasArrivedOnDestination && (
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Submitted {formatTimeAgo(BigInt(item.time_included.getTime()), now)}</div>
                    <div className="flex items-center px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                      Pending
                      <span className="ml-1.5 w-3 h-3 border-2 border-yellow-400 border-t-yellow-600 rounded-full animate-spin"></span>
                    </div>
                  </div>
                )}
                {item.hasArrivedOnOtherSide && !item.hasArrivedOnDestination && item.time_arrived_other_side && (
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Arrived on other side after {Math.round((item.time_arrived_other_side.getTime() - item.time_included.getTime()) / 1000)} seconds</div>
                    <div className="flex items-center px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      In Progress
                    </div>
                  </div>
                )}
                {item.hasArrivedOnDestination && item.time_arrived_destination && (
                  <div className="flex items-center justify-between">
                    <div className="text-muted-foreground">Completed after {Math.round((item.time_arrived_destination.getTime() - item.time_included.getTime()) / 1000)} seconds</div>
                    <div className="flex items-center px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      Completed
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
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
        to={to}
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

function addressesMatch(addressA: string, addressB: string) {
  const infoA = getSs58AddressInfo(addressA);
  const infoB = getSs58AddressInfo(addressB);
  return infoA.isValid &&
    infoB.isValid &&
    infoA.publicKey.length === infoB.publicKey.length &&
    infoA.publicKey.every((v, i) => v === infoB.publicKey[i])
}

function formatTimeAgo(epoch: bigint, now: number): string {
  const diff = Math.max(0, now - Number(epoch));
  //console.log("time ago: now: ", now, "last: ", Number(epoch), "diff: ", diff);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""} ago`;
}
