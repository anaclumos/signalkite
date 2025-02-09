"use client"

import cronstrue from "cronstrue"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { createSchedule, updateSchedule } from "@/app/actions/schedules"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Divider } from "@/components/ui/divider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { daysOfWeek } from "@/lib/const"
import type { Schedule, ScheduleReporter } from "@prisma/client"

type ScheduleWithReporters = Schedule & {
  ScheduleReporters: ScheduleReporter[]
}

interface ScheduleFormProps {
  schedule?: ScheduleWithReporters
  mode: "create" | "edit"
}

export function ScheduleForm({ schedule, mode }: ScheduleFormProps) {
  const router = useRouter()

  // Parse initial cron expression or set defaults
  const initialCronParts = schedule?.cron.split(" ") || [
    "0",
    "8",
    "*",
    "*",
    "*",
  ]
  const [hour, setHour] = useState(initialCronParts[1])
  const [minute, setMinute] = useState(initialCronParts[0])
  const [timezone, setTimezone] = useState(
    schedule?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  )

  // Parse days from cron expression or set empty
  const initialDays = new Set<string>()
  if (schedule) {
    const daysPart = initialCronParts[4]
    if (daysPart !== "*") {
      if (daysPart.includes("-")) {
        // Handle range (e.g., MON-FRI)
        const [start, end] = daysPart.split("-")
        const startIndex = daysOfWeek.findIndex((d) => d.id === start)
        const endIndex = daysOfWeek.findIndex((d) => d.id === end)
        for (let i = startIndex; i <= endIndex; i++) {
          initialDays.add(daysOfWeek[i].id)
        }
      } else {
        // Handle comma-separated list
        daysPart.split(",").forEach((day) => initialDays.add(day))
      }
    }
  }
  const [selectedDays, setSelectedDays] = useState<Set<string>>(initialDays)

  function handleDayCheckedChange(dayId: string, checked: boolean) {
    setSelectedDays((prev) => {
      const newSet = new Set(prev)
      if (checked) {
        newSet.add(dayId)
      } else {
        newSet.delete(dayId)
      }
      return newSet
    })
  }

  function generateCronString() {
    const selectedDaysArray = Array.from(selectedDays).sort()
    let dayOfWeek = "*"

    if (selectedDaysArray.length > 0) {
      // Check if days are consecutive
      const isConsecutive = selectedDaysArray.every((day, index) => {
        if (index === 0) return true
        const prevDay = daysOfWeek.findIndex(
          (d) => d.id === selectedDaysArray[index - 1],
        )
        const currDay = daysOfWeek.findIndex((d) => d.id === day)
        return currDay - prevDay === 1
      })

      if (isConsecutive && selectedDaysArray.length > 1) {
        // Use range syntax (e.g., MON-FRI)
        dayOfWeek = `${selectedDaysArray[0]}-${selectedDaysArray[selectedDaysArray.length - 1]}`
      } else {
        // Use comma-separated list
        dayOfWeek = selectedDaysArray.join(",")
      }
    }

    return `${minute} ${hour} * * ${dayOfWeek}`
  }

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string
    const cron = generateCronString()

    if (mode === "edit" && schedule) {
      await updateSchedule({
        id: schedule.id,
        name,
        cron,
        timezone,
      })
    } else {
      await createSchedule({
        name,
        cron,
        timezone,
      })
    }

    router.push("/settings/schedules")
  }

  return (
    <>
      <form action={handleSubmit}>
        {/* Schedule Info Section */}
        <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">
              Schedule Information
            </h2>
            <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
              {mode === "create"
                ? "Create a new schedule to run your reporters at specific times."
                : "Edit your schedule configuration."}
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="col-span-full">
                <Label htmlFor="name" className="font-medium">
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={schedule?.name || "My Morning Digest"}
                  className="mt-2"
                  required
                  maxLength={100}
                />
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">
              Time Information
            </h2>
            <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
              Configure when this schedule should run using the cron expression
              editor.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="col-span-full sm:col-span-2">
                <Label className="font-medium">Hour</Label>
                <Select
                  name="hour"
                  value={hour}
                  onValueChange={(val) => setHour(val)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i.toString()).map(
                      (option) => (
                        <SelectItem key={option} value={option}>
                          {option === "*" ? "Every" : option}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-full sm:col-span-2">
                <Label className="font-medium">Minute</Label>
                <Select
                  name="minute"
                  value={minute}
                  onValueChange={(val) => setMinute(val)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["0", "15", "30", "45"].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option === "*" ? "Every" : option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-full sm:col-span-2">
                <Label className="font-medium">Timezone</Label>
                <Select
                  name="timezone"
                  value={timezone}
                  onValueChange={(val) => setTimezone(val)}
                >
                  <SelectTrigger className="mt-2">
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

              <div className="col-span-full">
                <fieldset className="mt-6">
                  <legend className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Days of Week
                  </legend>
                  <ul className="mt-4 divide-y divide-gray-200 dark:divide-gray-800">
                    {daysOfWeek.map((day) => (
                      <li
                        key={day.id}
                        className="flex items-center gap-x-3 py-3"
                      >
                        <Checkbox
                          id={`day-${day.id}`}
                          name="days[]"
                          value={day.id}
                          checked={selectedDays.has(day.id)}
                          onCheckedChange={(checked) =>
                            handleDayCheckedChange(day.id, !!checked)
                          }
                        />
                        <Label
                          htmlFor={`day-${day.id}`}
                          className="font-medium"
                        >
                          {day.label}
                        </Label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              </div>

              <div className="col-span-full text-sm text-gray-600 dark:text-gray-400">
                {cronstrue.toString(generateCronString())},{" "}
                {timezone.split("/").pop()} time.
              </div>
            </div>
          </div>
        </div>

        <Divider />

        <div className="flex items-center justify-end space-x-4 p-4 md:p-8">
          <Button
            variant="secondary"
            onClick={() => router.push("/settings/schedules")}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit">
            {mode === "create" ? "Create Schedule" : "Save Changes"}
          </Button>
        </div>
      </form>
    </>
  )
}
