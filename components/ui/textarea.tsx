// Tremor Textarea [v0.0.2]

import React from "react"

import { cx, focusInput, hasErrorInput } from "../../lib/utils"

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }: TextareaProps, forwardedRef) => {
    return (
      <textarea
        ref={forwardedRef}
        className={cx(
          // base
          "flex min-h-[4rem] w-full rounded-md border px-3 py-1.5 shadow-xs transition-colors outline-hidden sm:text-sm",
          // text color
          "text-zinc-900 dark:text-zinc-50",
          // border color
          "border-zinc-300 dark:border-zinc-800",
          // background color
          "bg-white dark:bg-zinc-950",
          // placeholder color
          "placeholder-zinc-400 dark:placeholder-zinc-500",
          // disabled
          "disabled:border-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-300",
          "dark:disabled:border-zinc-700 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500",
          // focus
          focusInput,
          // error
          hasError ? hasErrorInput : "",
          // invalid (optional)
          "dark:aria-invalid:ring-red-400/20 aria-invalid:ring-2 aria-invalid:ring-red-200 aria-invalid:border-red-500 invalid:ring-2 invalid:ring-red-200 invalid:border-red-500",
          className,
        )}
        tremor-id="tremor-raw"
        {...props}
      />
    )
  },
)

Textarea.displayName = "Textarea"

export { Textarea, type TextareaProps }
