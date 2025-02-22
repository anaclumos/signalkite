// Utility functions for handling cron expressions and scheduling

import { parseExpression } from "cron-parser"

// Constants for days of the week with their labels and indices
export const DAYS_OF_WEEK = [
  { id: "SUN", label: "Sunday", index: 0 },
  { id: "MON", label: "Monday", index: 1 },
  { id: "TUE", label: "Tuesday", index: 2 },
  { id: "WED", label: "Wednesday", index: 3 },
  { id: "THU", label: "Thursday", index: 4 },
  { id: "FRI", label: "Friday", index: 5 },
  { id: "SAT", label: "Saturday", index: 6 },
] as const

// Builds a cron expression from minute, hour, and day parameters
export function buildCron({
  minute,
  hour,
  day,
}: {
  minute: number[] | "*" // Array of minutes or "*" for every minute
  hour: number[] | "*" // Array of hours or "*" for every hour
  day: number[] | "*" // Array of days or "*" for every day
}): string {
  // Validate input arrays are not empty
  if (Array.isArray(minute) && minute.length === 0) {
    throw new Error("Minute array cannot be empty")
  }
  if (Array.isArray(hour) && hour.length === 0) {
    throw new Error("Hour array cannot be empty")
  }
  if (Array.isArray(day) && day.length === 0) {
    throw new Error("Day array cannot be empty")
  }

  // Format minute part of cron expression
  const minutePart =
    minute === "*" || (Array.isArray(minute) && minute.length === 60)
      ? "*"
      : formatConsecutiveNumbers(minute)

  // Format hour part of cron expression
  const hourPart =
    hour === "*" || (Array.isArray(hour) && hour.length === 24)
      ? "*"
      : formatConsecutiveNumbers(hour)

  // Format day part of cron expression
  const dayPart =
    day === "*" || (Array.isArray(day) && day.length === 7)
      ? "*"
      : formatConsecutiveNumbers(day)

  // Return complete cron expression (minute hour * * day)
  return `${minutePart} ${hourPart} * * ${dayPart}`
}

// Formats an array of numbers into a cron-compatible string with ranges
function formatConsecutiveNumbers(numbers: number[]): string {
  if (numbers.length === 0) return ""

  // Sort numbers for processing consecutive runs
  const sorted = [...numbers].sort((a, b) => a - b)

  const ranges: string[] = []
  let rangeStart = sorted[0]
  let rangeEnd = rangeStart

  // Process each number to build ranges
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i]
    // If current number continues the sequence
    if (current === rangeEnd + 1) {
      rangeEnd = current
    } else {
      // Add the completed range
      ranges.push(
        rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`,
      )
      // Start new range
      rangeStart = current
      rangeEnd = current
    }
  }

  // Add the final range
  ranges.push(
    rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`,
  )

  // Join ranges with commas
  return ranges.join(",")
}

// Parses a cron expression into its component parts
export function parseCron(
  cronExpression: string,
  tz?: string,
): {
  minute: number[] // Array of minutes
  hour: number[] // Array of hours
  days: number[] // Array of days
  timezone: string // Timezone string
} {
  try {
    // Parse the cron expression using cron-parser
    const interval = parseExpression(cronExpression, {
      currentDate: new Date(),
      tz: tz || Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    const { hour, minute, dayOfWeek } = interval.fields

    // Return parsed components
    return {
      minute: Array.from(minute.values()),
      hour: Array.from(hour.values()),
      days: Array.from(dayOfWeek.values()).filter((day) => day !== 7), // Filter out 7 as it's equivalent to 0 (Sunday)
      timezone: tz || Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  } catch {
    // Return default values if parsing fails
    return {
      minute: [0],
      hour: [8],
      days: [0, 1, 2, 3, 4, 5, 6],
      timezone: tz || Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  }
}
