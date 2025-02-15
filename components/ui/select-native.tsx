// Tremor SelectNative [v0.0.1]

import React from "react"
import { type VariantProps, tv } from "tailwind-variants"

import { cx, focusInput, hasErrorInput } from "../../lib/utils"

const selectNativeStyles = tv({
  base: [
    // base
    "peer w-full cursor-pointer appearance-none truncate rounded-md border py-2 pr-7 pl-3 shadow-xs transition-all outline-hidden sm:text-sm",
    // background color
    "bg-white dark:bg-zinc-950",
    // border color
    "border-zinc-300 dark:border-zinc-800",
    // text color
    "text-zinc-900 dark:text-zinc-50",
    // placeholder color
    "placeholder-zinc-400 dark:placeholder-zinc-500",
    // hover
    "hover:bg-zinc-50 dark:hover:bg-zinc-950/50",
    // disabled
    "disabled:pointer-events-none",
    "disabled:bg-zinc-100 disabled:text-zinc-400",
    "dark:disabled:border-zinc-700 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500",
    // focus
    focusInput,
    // invalid (optional)
    "dark:aria-invalid:ring-red-400/20 aria-invalid:ring-2 aria-invalid:ring-red-200 aria-invalid:border-red-500 invalid:ring-2 invalid:ring-red-200 invalid:border-red-500",
  ],
  variants: {
    hasError: {
      true: hasErrorInput,
    },
  },
})

interface SelectNativeProps
  extends React.InputHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectNativeStyles> {}

const SelectNative = React.forwardRef<HTMLSelectElement, SelectNativeProps>(
  ({ className, hasError, ...props }: SelectNativeProps, forwardedRef) => {
    return (
      <select
        ref={forwardedRef}
        className={cx(selectNativeStyles({ hasError }), className)}
        tremor-id="tremor-raw"
        {...props}
      />
    )
  },
)

SelectNative.displayName = "SelectNative"

export { SelectNative, selectNativeStyles, type SelectNativeProps }
