// Tremor Button [v0.2.0]

import { Slot } from "@radix-ui/react-slot"
import { RiLoader2Fill } from "@remixicon/react"
import React from "react"
import { type VariantProps, tv } from "tailwind-variants"

import { cx, focusRing } from "../../lib/utils"

const buttonVariants = tv({
  base: [
    // base
    "relative inline-flex items-center justify-center rounded-md border px-3 py-2 text-center text-sm font-medium whitespace-nowrap shadow-xs transition-all duration-100 ease-in-out",
    // disabled
    "disabled:pointer-events-none disabled:shadow-none",
    // focus
    focusRing,
  ],
  variants: {
    variant: {
      primary: [
        // border
        "border-transparent",
        // text color
        "text-white dark:text-white",
        // border color
        "border-blue-700 dark:border-blue-500",
        // background color
        "bg-blue-600 dark:bg-blue-700",
        // shadow
        "shadow-blue-500/20 dark:shadow-blue-500/20",
        // hover color
        "hover:bg-blue-600 dark:hover:bg-blue-600",
        // disabled
        "disabled:bg-blue-300 disabled:text-white",
        "dark:disabled:bg-blue-800 dark:disabled:text-blue-400",
      ],
      secondary: [
        // border
        "border-zinc-300 dark:border-zinc-800",
        // text color
        "text-zinc-900 dark:text-zinc-50",
        // border color
        "border-slate-300 dark:border-slate-800",
        // background color
        "bg-slate-200 dark:bg-slate-900",
        // shadow
        "shadow-slate-300/20 dark:shadow-slate-800/20",
        // hover color
        "hover:bg-zinc-300/70 dark:hover:bg-zinc-800/80",
        // disabled
        "disabled:text-zinc-400",
        "dark:disabled:text-zinc-600",
      ],
      light: [
        // base
        "shadow-none",
        // border
        "border-transparent",
        // text color
        "text-zinc-900 dark:text-zinc-50",
        // background color
        // border color
        "border-zinc-300 dark:border-zinc-800",
        // background color
        "bg-zinc-200 dark:bg-zinc-900",
        // shadow
        "shadow-zinc-300/20 dark:shadow-zinc-800/20",
        // hover color
        "hover:bg-zinc-300/70 dark:hover:bg-zinc-800/80",
        // disabled
        "disabled:bg-zinc-100 disabled:text-zinc-400",
        "dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600",
      ],
      ghost: [
        // base
        "shadow-none",
        // border
        "border-transparent",
        // text color
        "text-zinc-900 dark:text-zinc-50",
        // hover color
        "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/80",
        // disabled
        "disabled:text-zinc-400",
        "dark:disabled:text-zinc-600",
      ],
      destructive: [
        // text color
        "text-white",
        // border
        "border-transparent",
        // border color
        "border-red-700 dark:border-red-500",
        // background color
        "bg-red-600 dark:bg-red-700",
        // shadow
        "shadow-red-500/20 dark:shadow-red-500/20",
        // hover color
        "hover:bg-red-700 dark:hover:bg-red-600",
        // disabled
        "disabled:bg-red-300 disabled:text-white",
        "dark:disabled:bg-red-950 dark:disabled:text-red-400",
        // when focused with keyboard, it should be red not blue
        "focus:outline-red-500 dark:focus:outline-red-500",
      ],
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})

interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild,
      isLoading = false,
      loadingText,
      className,
      disabled,
      variant,
      children,
      ...props
    }: ButtonProps,
    forwardedRef,
  ) => {
    const Component = asChild ? Slot : "button"
    return (
      <Component
        ref={forwardedRef}
        className={cx(buttonVariants({ variant }), className)}
        disabled={disabled || isLoading}
        tremor-id="tremor-raw"
        {...props}
      >
        {isLoading ? (
          <span className="pointer-events-none flex shrink-0 items-center justify-center gap-1.5">
            <RiLoader2Fill
              className="size-4 shrink-0 animate-spin"
              aria-hidden="true"
            />
            <span className="sr-only">
              {loadingText ? loadingText : "Loading"}
            </span>
            {loadingText ? loadingText : children}
          </span>
        ) : (
          children
        )}
      </Component>
    )
  },
)

Button.displayName = "Button"

export { Button, buttonVariants, type ButtonProps }
