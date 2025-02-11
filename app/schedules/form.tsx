"use client"

import { useState } from "react"

import { EntityForm } from "@/components/entity-form"
import { Checkbox } from "@/components/ui/checkbox"
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
import { getCronDescription } from "@/lib/cron"
import type { Schedule } from "@prisma/client"
import { deleteScheduleAction, submit } from "./server"

interface ScheduleFormProps {
  schedule?: Schedule
}

export function ScheduleForm({ schedule }: ScheduleFormProps) {
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

  return (
    <EntityForm
      title="Schedules"
      entityId={schedule?.id}
      entityName={schedule?.name}
      backUrl="/schedules"
      onDelete={schedule ? deleteScheduleAction : undefined}
      onSubmit={submit}
      submitLabel={schedule ? "Save Changes" : "Create Schedule"}
      sections={[
        {
          title: "Schedule Information",
          description: schedule
            ? "Edit your schedule configuration."
            : "Create a new schedule to run your reporters at specific times.",
          children: (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="col-span-full gap-2 flex flex-col">
                  <Label htmlFor="name" className="font-medium">
                    Name
                  </Label>
                  <Input
                    data-1p-ignore
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={schedule?.name || "My Morning Digest"}
                    maxLength={100}
                  />
                </div>
              </div>
            </>
          ),
        },
        {
          title: "Time Information",
          description:
            "Configure when this schedule should run using the cron expression editor.",
          children: (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <div className="col-span-full sm:col-span-2 gap-2 flex flex-col">
                <Label className="font-medium">Hour</Label>
                <Select
                  name="hour"
                  value={hour}
                  onValueChange={(val) => setHour(val)}
                >
                  <SelectTrigger>
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

              <div className="col-span-full sm:col-span-2 gap-2 flex flex-col">
                <Label className="font-medium">Minute</Label>
                <Select
                  name="minute"
                  value={minute}
                  onValueChange={(val) => setMinute(val)}
                >
                  <SelectTrigger>
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

              <div className="col-span-full sm:col-span-2 gap-2 flex flex-col">
                <Label className="font-medium">Timezone</Label>
                <Select
                  name="timezone"
                  value={timezone}
                  onValueChange={(val) => setTimezone(val)}
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
                          name="selectedDays"
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
                {getCronDescription({ minute, hour, selectedDays, timezone })}
              </div>
            </div>
          ),
        },
      ]}
    />
  )
}
