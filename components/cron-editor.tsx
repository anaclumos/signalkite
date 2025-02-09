"use client"

import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

type CronField = "minute" | "hour" | "dayOfWeek"

const cronOptions = {
  minute: ["0", "15", "30", "45"],
  hour: [...Array.from({ length: 24 }, (_, i) => i.toString())],
  dayOfWeek: ["*", "0", "1", "2", "3", "4", "5", "6"],
}

const fieldLabels: Record<CronField, string> = {
  minute: "Minute",
  hour: "Hour",
  dayOfWeek: "Day of Week",
}

export function CronEditor() {
  const [cronExpression, setCronExpression] = useState<
    Record<CronField, string> & { timezone: string }
  >({
    minute: "0",
    hour: "*",
    dayOfWeek: "*",
    timezone: "UTC",
  })

  useEffect(() => {
    // Get user's timezone using Intl
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setCronExpression((prev) => ({ ...prev, timezone: userTimeZone }))
  }, [])

  const handleFieldChange = (field: CronField, value: string) => {
    setCronExpression((prev) => ({ ...prev, [field]: value }))
  }

  const handleTimezoneChange = (value: string) => {
    setCronExpression((prev) => ({ ...prev, timezone: value }))
  }

  const generateCronString = () => {
    return `${cronExpression.minute} ${cronExpression.hour} * * ${cronExpression.dayOfWeek} # ${cronExpression.timezone}`
  }

  const explainCronInEnglish = () => {
    const explanations: string[] = []

    if (cronExpression.minute !== "*")
      explanations.push(`at minute ${cronExpression.minute}`)
    if (cronExpression.hour !== "*")
      explanations.push(`at hour ${cronExpression.hour}`)
    if (cronExpression.dayOfWeek !== "*")
      explanations.push(
        `on day ${cronExpression.dayOfWeek} of the week (0 = Sunday)`,
      )

    const baseExplanation =
      explanations.length === 0
        ? "Every minute of every day"
        : `Runs ${explanations.join(", ")}`

    return `${baseExplanation} in the ${cronExpression.timezone} timezone`
  }

  return (
    <div className="p-4">
      <input type="hidden" name="cron" value={generateCronString()} />

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Time Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(cronOptions) as CronField[]).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {fieldLabels[field]}
              </label>
              <Select
                value={cronExpression[field]}
                onValueChange={(value) => handleFieldChange(field, value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cronOptions[field].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option === "*" ? "Every" : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Timezone
          </label>
          <Select
            value={cronExpression.timezone}
            onValueChange={handleTimezoneChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Intl.supportedValuesOf("timeZone").map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <code className="text-sm text-gray-600 dark:text-gray-400">
          {explainCronInEnglish()}
        </code>
      </div>
    </div>
  )
}
