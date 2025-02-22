// Utility functions for styling, form handling, and number formatting

// Import styling utilities
import clsx, { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Combines and merges Tailwind CSS classes using clsx and tailwind-merge
export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args))
}

// Focus state styles for input elements
export const focusInput = [
  // Base focus ring style
  "focus:ring-2",
  // Ring color for light and dark modes
  "focus:ring-blue-200 dark:focus:ring-blue-700/30",
  // Border color for light and dark modes
  "focus:border-blue-500 dark:focus:border-blue-700",
]

// Focus ring styles for interactive elements
export const focusRing = [
  // Base outline style with offset
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // Outline color for light and dark modes
  "outline-blue-500 dark:outline-blue-500",
]

// Error state styles for input elements
export const hasErrorInput = [
  // Base ring style
  "ring-2",
  // Error border color for light and dark modes
  "border-red-500 dark:border-red-700",
  // Error ring color for light and dark modes
  "ring-red-200 dark:ring-red-700/30",
]

// Type definitions for number formatting parameters
interface CurrencyParams {
  number: number
  maxFractionDigits?: number
  currency?: string
}

interface PercentageParams {
  number: number
  decimals?: number
}

interface MillionParams {
  number: number
  decimals?: number
}

// Type definition for number formatting functions
type FormatterFunctions = {
  currency: (params: CurrencyParams) => string
  unit: (number: number) => string
  percentage: (params: PercentageParams) => string
  million: (params: MillionParams) => string
}

// Type for form data values
type FormDataValue = string | string[] | null

// Retrieves a single value from FormData or object
export function getFormData(
  data: FormData | Record<string, any>,
  key: string,
): FormDataValue {
  if (data instanceof FormData) {
    const value = data.get(key)
    return value !== null ? value.toString() : null
  }
  return data[key] ?? null
}

// Retrieves all values for a key from FormData or object
export function getAllFormData(
  data: FormData | Record<string, any>,
  key: string,
): string[] {
  if (data instanceof FormData) {
    return data.getAll(key).map((value) => value.toString())
  }
  const value = data[key]
  return Array.isArray(value) ? value : value ? [value.toString()] : []
}

// Collection of number formatting functions
export const formatters: FormatterFunctions = {
  // Formats number as currency with specified options
  currency: ({
    number,
    maxFractionDigits = 2,
    currency = "USD",
  }: CurrencyParams): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: maxFractionDigits,
    }).format(number)
  },

  // Formats number with decimal style
  unit: (number: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
    }).format(number)
  },

  // Formats number as percentage with specified decimals
  percentage: ({ number, decimals = 1 }: PercentageParams): string => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number)
  },

  // Formats number in millions with specified decimals
  million: ({ number, decimals = 1 }: MillionParams): string => {
    return `${new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number / 1_000_000)}M`
  },
}
