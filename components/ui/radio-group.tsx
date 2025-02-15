// Tremor RadioGroup [v0.0.2]

import * as RadioGroupPrimitives from "@radix-ui/react-radio-group"
import React from "react"

import { cx, focusRing } from "../../lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Root>
>(({ className, ...props }, forwardedRef) => {
  return (
    <RadioGroupPrimitives.Root
      ref={forwardedRef}
      className={cx("grid gap-2", className)}
      tremor-id="tremor-raw"
      {...props}
    />
  )
})

RadioGroup.displayName = "RadioGroup"

const RadioGroupIndicator = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Indicator>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Indicator>
>(({ className, ...props }, forwardedRef) => {
  return (
    <RadioGroupPrimitives.Indicator
      ref={forwardedRef}
      className={cx("flex items-center justify-center", className)}
      {...props}
    >
      <div
        className={cx(
          // base
          "size-1.5 shrink-0 rounded-full",
          // indicator
          "bg-white",
          // disabled
          "group-data-disabled:bg-zinc-400 dark:group-data-disabled:bg-zinc-500",
        )}
      />
    </RadioGroupPrimitives.Indicator>
  )
})

RadioGroupIndicator.displayName = "RadioGroupIndicator"

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Item>
>(({ className, ...props }, forwardedRef) => {
  return (
    <RadioGroupPrimitives.Item
      ref={forwardedRef}
      className={cx(
        "group relative flex size-4 appearance-none items-center justify-center outline-hidden",
        className,
      )}
      {...props}
    >
      <div
        className={cx(
          // base
          "flex size-4 shrink-0 items-center justify-center rounded-full border shadow-xs",
          // border color
          "border-zinc-300 dark:border-zinc-800",
          // background color
          "bg-white dark:bg-zinc-950",
          // checked
          "group-data-[state=checked]:border-0 group-data-[state=checked]:border-transparent group-data-[state=checked]:bg-blue-500",
          // disabled
          "group-data-disabled:border",
          "group-data-disabled:border-zinc-300 group-data-disabled:bg-zinc-100 group-data-disabled:text-zinc-400",
          "dark:group-data-disabled:border-zinc-700 dark:group-data-disabled:bg-zinc-800",
          // focus
          focusRing,
        )}
      >
        <RadioGroupIndicator />
      </div>
    </RadioGroupPrimitives.Item>
  )
})

RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
