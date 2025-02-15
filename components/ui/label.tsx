// Tremor Label [v0.0.2]

import * as LabelPrimitives from "@radix-ui/react-label"
import React from "react"

import { cx } from "../../lib/utils"

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitives.Root> {
  disabled?: boolean
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitives.Root>,
  LabelProps
>(({ className, disabled, ...props }, forwardedRef) => (
  <LabelPrimitives.Root
    ref={forwardedRef}
    className={cx(
      // base
      "text-sm leading-none p-1",
      // text color
      "text-zinc-900 dark:text-zinc-50",
      // disabled
      {
        "text-zinc-400 dark:text-zinc-600": disabled,
      },
      className,
    )}
    aria-disabled={disabled}
    tremor-id="tremor-raw"
    {...props}
  />
))

Label.displayName = "Label"

export { Label }
