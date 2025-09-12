import * as React from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number | null
  onChange: (value: number | null) => void
  step?: number
  min?: number
  max?: number
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, step = 1, min, max, ...props }, ref) => {
    const handleIncrement = () => {
      if (value === null) {
        onChange(step)
      } else {
        const newValue = value + step
        if (max === undefined || newValue <= max) {
          onChange(newValue)
        }
      }
    }

    const handleDecrement = () => {
      if (value === null) {
        onChange(0)
      } else {
        const newValue = value - step
        if (min === undefined || newValue >= min) {
          onChange(newValue)
        }
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value === "" ? null : Number(e.target.value)
      if (newValue === null || !isNaN(newValue)) {
        onChange(newValue)
      }
    }

    return (
      <div className="relative flex items-center">
        <input
          type="text"
          inputMode="decimal"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          value={value === null ? "" : value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          {...props}
        />
        <div className="absolute right-0 flex flex-col h-full pr-1">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="h-1/2 w-6 rounded-none rounded-tr-md p-0"
            onClick={handleIncrement}
            tabIndex={-1}
          >
            <ChevronUp className="h-3 w-3" />
            <span className="sr-only">Increase</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className="h-1/2 w-6 rounded-none rounded-br-md p-0"
            onClick={handleDecrement}
            tabIndex={-1}
          >
            <ChevronDown className="h-3 w-3" />
            <span className="sr-only">Decrease</span>
          </Button>
        </div>
      </div>
    )
  }
)

NumberInput.displayName = "NumberInput"

export { NumberInput }
