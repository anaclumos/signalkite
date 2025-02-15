"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { toast } from "@/lib/use-toast"

import { DAYS_OF_WEEK, buildCronExpression } from "@/lib/cron"
import { FormState } from "@/types/forms"
import type { Schedule } from "@prisma/client"

import { SubmitButton } from "@/components/submit-button"
import { Callout } from "@/components/ui/callout"
import { CronDate, parseExpression } from "cron-parser"
import cronstrue from "cronstrue"
import { useActionState } from "react"
import { deleteScheduleAction, submitScheduleAction } from "./server"

interface ScheduleFormProps {
  schedule?: Schedule
}

function parseInitialFields(
  cronExpression: string,
  tz?: string,
): {
  initialMinute: number[]
  initialHour: number[]
  initialDays: number[]
  initialTimezone: string
  error: string | null
} {
  try {
    const interval = parseExpression(cronExpression, {
      currentDate: new Date(),
      tz: tz || Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
    const { hour, minute, dayOfWeek } = interval.fields
    return {
      initialMinute: Array.from(minute.values()),
      initialHour: Array.from(hour.values()),
      initialDays: Array.from(dayOfWeek.values()).filter((day) => day !== 7),
      initialTimezone: tz || Intl.DateTimeFormat().resolvedOptions().timeZone,
      error: null,
    }
  } catch (err: any) {
    return {
      initialMinute: [0],
      initialHour: [8],
      initialDays: [0, 1, 2, 3, 4, 5, 6],
      initialTimezone: tz || Intl.DateTimeFormat().resolvedOptions().timeZone,
      error: err.message || "Invalid cron expression",
    }
  }
}

export function ScheduleForm({ schedule }: ScheduleFormProps) {
  const defaultCron = "0 8 * * *"
  const initialCron = schedule?.cron ?? defaultCron

  const {
    initialMinute,
    initialHour,
    initialDays,
    initialTimezone,
    error: parseError,
  } = parseInitialFields(initialCron, schedule?.timezone)

  const [minute, setMinute] = useState<number[]>(initialMinute)
  const [hour, setHour] = useState<number[]>(initialHour)
  const [selectedDay, setSelectedDay] = useState<number[]>(initialDays)
  const [timezone, setTimezone] = useState(
    schedule?.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      "UTC",
  )

  const [status, formAction] = useActionState<FormState | null, FormData>(
    submitScheduleAction,
    null,
  )

  const [error, setError] = useState<string | null>(parseError)
  const [nextRun, setNextRun] = useState<CronDate | null>(null)
  const [expression, setExpression] = useState<string | null>(initialCron)

  useEffect(() => {
    try {
      const expression = buildCronExpression({ minute, hour, day: selectedDay })
      setExpression(expression)
      const interval = parseExpression(expression, {
        tz: timezone,
      })
      const next = interval.next()
      setNextRun(next)
      setError(null)
    } catch (err: any) {
      setNextRun(null)
      setError(err.message || "Invalid cron expression")
    }
  }, [minute, hour, selectedDay, timezone])

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Schedules", href: "/schedules" },
    ...(schedule?.id
      ? [
          {
            title: schedule.name || "Edit Schedule",
            href: `/schedules/${schedule.id}`,
          },
        ]
      : [{ title: "New Schedule", href: "/schedules/new" }]),
  ]

  if (status && !status.success) {
    toast({
      title: status.statusTitle || "Error",
      description: status.statusDescription || "An error occurred",
      variant: "error",
    })
  }

  return (
    <div className="flex flex-col pb-4">
      <NavBar
        breadcrumbs={breadcrumbs}
        actions={
          <>
            {schedule?.id && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Schedule</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this schedule? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <form action={() => deleteScheduleAction(schedule.id)}>
                      <Button variant="destructive">Delete</Button>
                    </form>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </>
        }
      />

      <form action={formAction}>
        <input type="hidden" name="id" value={schedule?.id} />

        <div>
          <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-50">
                Schedule Information
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                {schedule
                  ? "Edit your schedule configuration."
                  : "Create a new schedule to run your reports at specific times."}
              </p>
            </div>
            <div className="md:col-span-2">
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
                    defaultValue={schedule?.name || "New Schedule"}
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
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                Configure when this schedule should run using the cron
                expression editor.
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                <div className="col-span-full sm:col-span-2 gap-2 flex flex-col">
                  <Label className="font-medium">Hour</Label>
                  <Select
                    name="hour"
                    value={hour.length === 24 ? "*" : hour[0]?.toString()}
                    onValueChange={(val) =>
                      setHour(
                        val === "*"
                          ? Array.from({ length: 24 }, (_, i) => i)
                          : [Number(val)],
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="*" value="*">
                        Every
                      </SelectItem>
                      {Array.from({ length: 24 }, (_, i) => i).map((option) => (
                        <SelectItem key={option} value={option.toString()}>
                          {option > 12 ? option - 12 : option}{" "}
                          {option > 12 ? "PM" : "AM"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-full sm:col-span-2 gap-2 flex flex-col">
                  <Label className="font-medium">Minute</Label>
                  <Select
                    name="minute"
                    value={minute.length === 60 ? "*" : minute[0]?.toString()}
                    onValueChange={(val) =>
                      setMinute(
                        val === "*"
                          ? Array.from({ length: 60 }, (_, i) => i)
                          : [Number(val)],
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="*" value="*">
                        Every
                      </SelectItem>
                      <SelectItem key="0" value="0">
                        0
                      </SelectItem>
                      <SelectItem key="15" value="15">
                        15
                      </SelectItem>
                      <SelectItem key="30" value="30">
                        30
                      </SelectItem>
                      <SelectItem key="45" value="45">
                        45
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-full sm:col-span-2 gap-2 flex flex-col">
                  <Label className="font-medium">Timezone</Label>
                  <Select
                    name="timezone"
                    value={timezone}
                    defaultValue={initialTimezone}
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
                      {DAYS_OF_WEEK.map((day) => {
                        const dayNum = Number(day.index)
                        return (
                          <li
                            key={day.id}
                            className="flex items-center gap-x-3 py-3"
                          >
                            <Checkbox
                              id={`day-${day.id}`}
                              name="selectedDays"
                              value={dayNum.toString()}
                              checked={selectedDay.includes(dayNum)}
                              onCheckedChange={(checked) => {
                                setSelectedDay((prev) => {
                                  if (checked) {
                                    return Array.from(
                                      new Set([...prev, dayNum]),
                                    )
                                  } else {
                                    return prev.filter((d) => d !== dayNum)
                                  }
                                })
                              }}
                            />
                            <Label
                              htmlFor={`day-${day.id}`}
                              className="font-medium"
                            >
                              {day.label}
                            </Label>
                          </li>
                        )
                      })}
                    </ul>
                  </fieldset>
                </div>
                {nextRun && (
                  <Callout
                    variant="default"
                    title={`Runs ${expression ? cronstrue.toString(expression) : "Invalid cron expression"}`}
                    className="col-span-full"
                  >
                    Next run is at {nextRun?.toDate().toLocaleString()}.
                  </Callout>
                )}
                {error && (
                  <Callout
                    variant="error"
                    title="Error"
                    className="col-span-full"
                  >
                    {error}
                  </Callout>
                )}
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex items-center justify-end gap-2 p-4">
            <Link href="/schedules">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <SubmitButton
              defaultLabel={schedule ? "Save Changes" : "Create Schedule"}
              submittingLabel="Saving..."
            />
          </div>
        </div>
      </form>
    </div>
  )
}
