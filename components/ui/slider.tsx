// Tremor Slider [v0.1.0]

"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"

import { cx, focusRing } from "../../lib/utils"

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  ariaLabelThumb?: string
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, ariaLabelThumb, ...props }, forwardedRef) => {
  const value = props.value || props.defaultValue
  return (
    <SliderPrimitive.Root
      ref={forwardedRef}
      className={cx(
        // base
        "relative flex cursor-pointer touch-none select-none",
        // orientation
        "data-[orientation='horizontal']:w-full data-[orientation='horizontal']:items-center",
        "data-[orientation='vertical']:h-full data-[orientation='vertical']:w-fit data-[orientation='vertical']:justify-center",
        // disabled
        "data-disabled:pointer-events-none",
        className,
      )}
      tremor-id="tremor-raw"
      {...props}
    >
      <SliderPrimitive.Track
        className={cx(
          // base
          "relative grow overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800",
          // orientation
          "data-[orientation='horizontal']:h-1.5 data-[orientation='horizontal']:w-full",
          "data-[orientation='vertical']:h-full data-[orientation='vertical']:w-1.5",
        )}
      >
        <SliderPrimitive.Range
          className={cx(
            // base
            "absolute rounded-full bg-blue-500 dark:bg-blue-500",
            // orientation
            "data-[orientation='horizontal']:h-full",
            "data-[orientation='vertical']:w-full",
            // disabled
            "data-disabled:bg-zinc-300 dark:data-disabled:bg-zinc-700",
          )}
        />
      </SliderPrimitive.Track>
      {value?.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className={cx(
            // base
            "block size-[17px] shrink-0 rounded-full border shadow-sm transition-all",
            // boder color
            "border-zinc-400 dark:border-zinc-500",
            // background color
            "bg-white",
            // disabled
            "data-disabled:pointer-events-none data-disabled:bg-zinc-200 dark:data-disabled:border-zinc-800 dark:data-disabled:bg-zinc-600",
            focusRing,
            "outline-offset-0",
          )}
          aria-label={ariaLabelThumb}
        />
      ))}
    </SliderPrimitive.Root>
  )
})

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
