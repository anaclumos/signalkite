// Chart utility functions and color definitions for Tremor charts

// Type for different color utility classes (background, stroke, fill, text)
export type ColorUtility = "bg" | "stroke" | "fill" | "text"

// Color definitions for chart elements with light/dark mode variants
export const chartColors = {
  blue: {
    bg: "bg-blue-500 dark:bg-blue-500", // Background color
    stroke: "stroke-blue-500 dark:stroke-blue-500", // Border/line color
    fill: "fill-blue-500 dark:fill-blue-500", // Fill color
    text: "text-blue-500 dark:text-blue-500", // Text color
  },
  lightBlue: {
    bg: "bg-blue-300/50 dark:bg-blue-800/50",
    stroke: "stroke-blue-300/50 dark:stroke-blue-800/50",
    fill: "fill-blue-300/50 dark:fill-blue-800/50",
    text: "text-blue-300/50 dark:text-blue-800/50",
  },
  emerald: {
    bg: "bg-emerald-500 dark:bg-emerald-500",
    stroke: "stroke-emerald-500 dark:stroke-emerald-500",
    fill: "fill-emerald-500 dark:fill-emerald-500",
    text: "text-emerald-500 dark:text-emerald-500",
  },
  lightEmerald: {
    bg: "bg-emerald-300/50 dark:bg-emerald-800/50",
    stroke: "stroke-emerald-300/50 dark:stroke-emerald-800/50",
    fill: "fill-emerald-300/50 dark:fill-emerald-800/50",
    text: "text-emerald-300/50 dark:text-emerald-800/50",
  },
  violet: {
    bg: "bg-violet-500 dark:bg-violet-500",
    stroke: "stroke-violet-500 dark:stroke-violet-500",
    fill: "fill-violet-500 dark:fill-violet-500",
    text: "text-violet-500 dark:text-violet-500",
  },
  amber: {
    bg: "bg-amber-500 dark:bg-amber-500",
    stroke: "stroke-amber-500 dark:stroke-amber-500",
    fill: "fill-amber-500 dark:fill-amber-500",
    text: "text-amber-500 dark:text-amber-500",
  },
  gray: {
    bg: "bg-zinc-400 dark:bg-zinc-600",
    stroke: "stroke-zinc-400 dark:stroke-zinc-600",
    fill: "fill-zinc-400 dark:fill-zinc-600",
    text: "text-zinc-400 dark:text-zinc-600",
  },
  rose: {
    bg: "bg-rose-600 dark:bg-rose-500",
    stroke: "stroke-rose-600 dark:stroke-rose-500",
    fill: "fill-rose-600 dark:fill-rose-500",
    text: "text-rose-600 dark:text-rose-500",
  },
  sky: {
    bg: "bg-sky-500 dark:bg-sky-500",
    stroke: "stroke-sky-500 dark:stroke-sky-500",
    fill: "fill-sky-500 dark:fill-sky-500",
    text: "text-sky-500 dark:text-sky-500",
  },
  cyan: {
    bg: "bg-cyan-500 dark:bg-cyan-500",
    stroke: "stroke-cyan-500 dark:stroke-cyan-500",
    fill: "fill-cyan-500 dark:fill-cyan-500",
    text: "text-cyan-500 dark:text-cyan-500",
  },
  indigo: {
    bg: "bg-indigo-600 dark:bg-indigo-500",
    stroke: "stroke-indigo-600 dark:stroke-indigo-500",
    fill: "fill-indigo-600 dark:fill-indigo-500",
    text: "text-indigo-600 dark:text-indigo-500",
  },
  orange: {
    bg: "bg-orange-500 dark:bg-orange-400",
    stroke: "stroke-orange-500 dark:stroke-orange-400",
    fill: "fill-orange-500 dark:fill-orange-400",
    text: "text-orange-500 dark:text-orange-400",
  },
  pink: {
    bg: "bg-pink-500 dark:bg-pink-500",
    stroke: "stroke-pink-500 dark:stroke-pink-500",
    fill: "fill-pink-500 dark:fill-pink-500",
    text: "text-pink-500 dark:text-pink-500",
  },
  red: {
    bg: "bg-red-500 dark:bg-red-500",
    stroke: "stroke-red-500 dark:stroke-red-500",
    fill: "fill-red-500 dark:fill-red-500",
    text: "text-red-500 dark:text-red-500",
  },
  lightGray: {
    bg: "bg-zinc-300 dark:bg-zinc-700",
    stroke: "stroke-zinc-300 dark:stroke-zinc-700",
    fill: "fill-zinc-300 dark:fill-zinc-700",
    text: "text-zinc-300 dark:text-zinc-700",
  },
} as const satisfies {
  [color: string]: {
    [key in ColorUtility]: string
  }
}

// Type for available chart color keys
export type AvailableChartColorsKeys = keyof typeof chartColors

// Gradient color definitions for charts with light/dark mode variants
export const chartGradientColors = {
  blue: "from-blue-200 to-blue-500 dark:from-blue-200/10 dark:to-blue-400",
  lightBlue: "from-blue-200 to-blue-500 dark:from-blue-200/10 dark:to-blue-400",
  emerald:
    "from-emerald-200 to-emerald-500 dark:from-emerald-200/10 dark:to-emerald-400",
  lightEmerald:
    "from-emerald-200 to-emerald-500 dark:from-emerald-200/10 dark:to-emerald-400",
  violet:
    "from-violet-200 to-violet-500 dark:from-violet-200/10 dark:to-violet-400",
  amber: "from-amber-200 to-amber-500 dark:from-amber-200/10 dark:to-amber-400",
  gray: "from-zinc-200 to-zinc-500 dark:from-zinc-200/10 dark:to-zinc-400",
  lightGray: "from-zinc-200 to-zinc-500 dark:from-zinc-200/10 dark:to-zinc-400",
  rose: "from-rose-200 to-rose-500 dark:from-rose-200/10 dark:to-rose-400",
  sky: "from-sky-200 to-sky-500 dark:from-sky-200/10 dark:to-sky-400",
  cyan: "from-cyan-200 to-cyan-500 dark:from-cyan-200/10 dark:to-cyan-400",
  indigo:
    "from-indigo-200 to-indigo-500 dark:from-indigo-200/10 dark:to-indigo-400",
  orange:
    "from-orange-200 to-orange-500 dark:from-orange-200/10 dark:to-orange-400",
  pink: "from-pink-200 to-pink-500 dark:from-pink-200/10 dark:to-pink-400",
  red: "from-red-200 to-red-500 dark:from-red-200/10 dark:to-red-400",
} as const satisfies Record<string, string>

// Conditional color definitions based on value ranges (low, medium, high, critical)
export const chartConditionalColors = {
  blue: {
    low: "fill-blue-200 dark:fill-blue-300", // For values <= 0.25
    medium: "fill-blue-300 dark:fill-blue-400", // For values <= 0.50
    high: "fill-blue-400 dark:fill-blue-500", // For values <= 0.75
    critical: "fill-blue-500 dark:fill-blue-600", // For values > 0.75
  },
  lightBlue: {
    low: "fill-blue-200 dark:fill-blue-300",
    medium: "fill-blue-300 dark:fill-blue-400",
    high: "fill-blue-400 dark:fill-blue-500",
    critical: "fill-blue-500 dark:fill-blue-600",
  },
  emerald: {
    low: "fill-emerald-200 dark:fill-emerald-300",
    medium: "fill-emerald-300 dark:fill-emerald-400",
    high: "fill-emerald-400 dark:fill-emerald-500",
    critical: "fill-emerald-500 dark:fill-emerald-600",
  },
  lightEmerald: {
    low: "fill-emerald-200 dark:fill-emerald-300",
    medium: "fill-emerald-300 dark:fill-emerald-400",
    high: "fill-emerald-400 dark:fill-emerald-500",
    critical: "fill-emerald-500 dark:fill-emerald-600",
  },
  violet: {
    low: "fill-violet-200 dark:fill-violet-300",
    medium: "fill-violet-300 dark:fill-violet-400",
    high: "fill-violet-400 dark:fill-violet-500",
    critical: "fill-violet-500 dark:fill-violet-600",
  },
  amber: {
    low: "fill-amber-200 dark:fill-amber-300",
    medium: "fill-amber-300 dark:fill-amber-400",
    high: "fill-amber-400 dark:fill-amber-500",
    critical: "fill-amber-500 dark:fill-amber-600",
  },
  gray: {
    low: "fill-zinc-200 dark:fill-zinc-300",
    medium: "fill-zinc-300 dark:fill-zinc-400",
    high: "fill-zinc-400 dark:fill-zinc-500",
    critical: "fill-zinc-500 dark:fill-zinc-600",
  },
  rose: {
    low: "fill-rose-200 dark:fill-rose-300",
    medium: "fill-rose-300 dark:fill-rose-400",
    high: "fill-rose-400 dark:fill-rose-500",
    critical: "fill-rose-500 dark:fill-rose-600",
  },
  sky: {
    low: "fill-sky-200 dark:fill-sky-300",
    medium: "fill-sky-300 dark:fill-sky-400",
    high: "fill-sky-400 dark:fill-sky-500",
    critical: "fill-sky-500 dark:fill-sky-600",
  },
  cyan: {
    low: "fill-cyan-200 dark:fill-cyan-300",
    medium: "fill-cyan-300 dark:fill-cyan-400",
    high: "fill-cyan-400 dark:fill-cyan-500",
    critical: "fill-cyan-500 dark:fill-cyan-600",
  },
  indigo: {
    low: "fill-indigo-200 dark:fill-indigo-300",
    medium: "fill-indigo-300 dark:fill-indigo-400",
    high: "fill-indigo-400 dark:fill-indigo-500",
    critical: "fill-indigo-500 dark:fill-indigo-600",
  },
  orange: {
    low: "fill-orange-200 dark:fill-orange-300",
    medium: "fill-orange-300 dark:fill-orange-400",
    high: "fill-orange-400 dark:fill-orange-500",
    critical: "fill-orange-500 dark:fill-orange-600",
  },
  pink: {
    low: "fill-pink-200 dark:fill-pink-300",
    medium: "fill-pink-300 dark:fill-pink-400",
    high: "fill-pink-400 dark:fill-pink-500",
    critical: "fill-pink-500 dark:fill-pink-600",
  },
  red: {
    low: "fill-red-200 dark:fill-red-300",
    medium: "fill-red-300 dark:fill-red-400",
    high: "fill-red-400 dark:fill-red-500",
    critical: "fill-red-500 dark:fill-red-600",
  },
  lightGray: {
    low: "fill-zinc-200 dark:fill-zinc-300",
    medium: "fill-zinc-300 dark:fill-zinc-400",
    high: "fill-zinc-400 dark:fill-zinc-500",
    critical: "fill-zinc-500 dark:fill-zinc-600",
  },
} as const

// Type for conditional color keys
export type AvailableChartConditionalColorsKeys = keyof typeof chartColors

// Array of all available chart color keys
export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
  chartColors,
) as Array<AvailableChartColorsKeys>

/**
 * Maps categories to colors in a cyclic manner
 * @param categories - Array of category names
 * @param colors - Array of available colors
 * @returns Map of category to color assignments
 */
export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[],
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>()
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length])
  })
  return categoryColors
}

/**
 * Gets the CSS class name for a specific color and utility type
 * @param color - The color key
 * @param type - The utility type (bg, stroke, fill, text)
 * @returns CSS class name string
 */
export const getColorClassName = (
  color: AvailableChartColorsKeys,
  type: ColorUtility,
): string => {
  const fallbackColor = {
    bg: "bg-zinc-500",
    stroke: "stroke-zinc-500",
    fill: "fill-zinc-500",
    text: "text-zinc-500",
  }
  return chartColors[color]?.[type] ?? fallbackColor[type]
}

/**
 * Gets the gradient color class name for a color
 * @param color - The color key
 * @returns Gradient CSS class name string
 */
export const getGradientColorClassName = (
  color: AvailableChartColorsKeys,
): string => {
  return chartGradientColors[color]
}

/**
 * Gets conditional color class name based on value
 * @param value - Numeric value between 0 and 1
 * @param color - The color key
 * @returns CSS class name for the appropriate color level
 */
export const getConditionalColorClassName = (
  value: number,
  color: AvailableChartConditionalColorsKeys,
) => {
  const fallbackColors = {
    low: "fill-zinc-300 dark:fill-zinc-400",
    medium: "fill-zinc-400 dark:fill-zinc-500",
    high: "fill-zinc-500 dark:fill-zinc-600",
    critical: "fill-zinc-600 dark:fill-zinc-700",
  }

  const classes = chartConditionalColors[color] ?? fallbackColors

  if (value <= 0.25) return classes.low
  if (value <= 0.5) return classes.medium
  if (value <= 0.75) return classes.high
  return classes.critical
}

/**
 * Determines Y-axis domain for charts
 * @param autoMinValue - Whether to auto-calculate minimum value
 * @param minValue - Optional minimum value
 * @param maxValue - Optional maximum value
 * @returns Array containing min and max domain values
 */
export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined,
) => {
  const minDomain = autoMinValue ? "auto" : (minValue ?? 0)
  const maxDomain = maxValue ?? "auto"
  return [minDomain, maxDomain]
}

/**
 * Checks if an array of objects has only one unique value for a specific key
 * @param array - Array of objects to check
 * @param keyToCheck - Key to check for unique values
 * @returns Boolean indicating if only one unique value exists
 */
export function hasOnlyOneValueForKey(
  array: any[],
  keyToCheck: string,
): boolean {
  const val: any[] = []

  for (const obj of array) {
    if (Object.prototype.hasOwnProperty.call(obj, keyToCheck)) {
      val.push(obj[keyToCheck])
      if (val.length > 1) {
        return false
      }
    }
  }

  return true
}
