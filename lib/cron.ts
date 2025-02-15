import { parseExpression } from "cron-parser"

export const DAYS_OF_WEEK = [
  { id: "SUN", label: "Sunday", index: 0 },
  { id: "MON", label: "Monday", index: 1 },
  { id: "TUE", label: "Tuesday", index: 2 },
  { id: "WED", label: "Wednesday", index: 3 },
  { id: "THU", label: "Thursday", index: 4 },
  { id: "FRI", label: "Friday", index: 5 },
  { id: "SAT", label: "Saturday", index: 6 },
] as const

export function buildCron({
  minute,
  hour,
  day,
}: {
  minute: number[] | "*"
  hour: number[] | "*"
  day: number[] | "*"
}): string {
  if (Array.isArray(minute) && minute.length === 0) {
    throw new Error("Minute array cannot be empty")
  }
  if (Array.isArray(hour) && hour.length === 0) {
    throw new Error("Hour array cannot be empty")
  }

  if (Array.isArray(day) && day.length === 0) {
    throw new Error("Day array cannot be empty")
  }

  const minutePart =
    minute === "*" || (Array.isArray(minute) && minute.length === 60)
      ? "*"
      : formatConsecutiveNumbers(minute)

  const hourPart =
    hour === "*" || (Array.isArray(hour) && hour.length === 24)
      ? "*"
      : formatConsecutiveNumbers(hour)

  const dayPart =
    day === "*" || (Array.isArray(day) && day.length === 7)
      ? "*"
      : formatConsecutiveNumbers(day)

  return `${minutePart} ${hourPart} * * ${dayPart}`
}

function formatConsecutiveNumbers(numbers: number[]): string {
  if (numbers.length === 0) return ""

  // Sort the numbers to ensure consecutive runs are in order
  const sorted = [...numbers].sort((a, b) => a - b)

  const ranges: string[] = []
  let rangeStart = sorted[0]
  let rangeEnd = rangeStart

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i]
    // If current continues the consecutive run, move the end
    if (current === rangeEnd + 1) {
      rangeEnd = current
    } else {
      // Push the previous run/range
      ranges.push(
        rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`,
      )
      // Reset range start and end
      rangeStart = current
      rangeEnd = current
    }
  }

  // Push the final run/range
  ranges.push(
    rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`,
  )

  return ranges.join(",")
}

export function parseCron(
  cronExpression: string,
  tz?: string,
): {
  minute: number[]
  hour: number[]
  days: number[]
  timezone: string
} {
  try {
    const interval = parseExpression(cronExpression, {
      currentDate: new Date(),
      tz: tz || Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    const { hour, minute, dayOfWeek } = interval.fields
    return {
      minute: Array.from(minute.values()),
      hour: Array.from(hour.values()),
      days: Array.from(dayOfWeek.values()).filter((day) => day !== 7),
      timezone: tz || Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  } catch {
    return {
      minute: [0],
      hour: [8],
      days: [0, 1, 2, 3, 4, 5, 6],
      timezone: tz || Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  }
}
