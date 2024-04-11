import { AssetId, ASSET_DECIMALS } from "@/api"
import { formatCurrency } from "@/lib/utils"

export const FormattedToken: React.FC<{
  asset: AssetId
  value: bigint | null
}> = ({ asset, value }) => {
  const decimals = ASSET_DECIMALS[asset]

  return (
    <>
      {value === null
        ? "Loading..."
        : formatCurrency(value, decimals, {
            nDecimals: 4,
          }) +
          " " +
          asset}
    </>
  )
}
