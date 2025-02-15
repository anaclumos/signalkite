"use client"

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
import Link from "next/link"
import { useMemo, useState } from "react"

import { DAYS_OF_WEEK, buildCron, parseCron } from "@/lib/cron"
import { FormState } from "@/types/forms"
import type { Schedule } from "@prisma/client"

import { SubmitButton } from "@/components/submit-button"
import { Callout } from "@/components/ui/callout"
import { parseExpression } from "cron-parser"
import cronstrue from "cronstrue"
import { useActionState } from "react"
import { deleteScheduleAction, submitScheduleAction } from "./server"

interface ScheduleFormProps {
  schedule?: Schedule
}

export function ScheduleForm({ schedule }: ScheduleFormProps) {
  const defaultCron = "0 8 * * *"
  const initialCron = schedule?.cron ?? defaultCron

  // Extract initial fields from the existing schedule (or default)
  const initialFields = parseCron(initialCron, schedule?.timezone)

  // Use a single state to hold all user-selected schedule fields.
  const [cronFields, setCronFields] = useState({
    minute: initialFields.minute,
    hour: initialFields.hour,
    days: initialFields.days,
    timezone: initialFields.timezone,
  })

  // A single memo to derive the cron expression, next run, and any errors.
  const { expression, nextRun, error } = useMemo(() => {
    try {
      const expr = buildCron({
        minute: cronFields.minute,
        hour: cronFields.hour,
        day: cronFields.days,
      })

      const interval = parseExpression(expr, {
        tz: cronFields.timezone,
      })

      return {
        expression: expr,
        nextRun: interval.next(),
        error: null,
      }
    } catch (err: any) {
      return {
        expression: null,
        nextRun: null,
        error: err.message || "Invalid cron expression",
      }
    }
  }, [cronFields])

  const [status, formAction] = useActionState<FormState | null, FormData>(
    submitScheduleAction,
    null,
  )

  if (status && !status.success) {
    toast({
      title: status.statusTitle || "Error",
      description: status.statusDescription || "An error occurred",
      variant: "error",
    })
  }

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

        {/* --- SCHEDULE INFORMATION --- */}
        <div>
          <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Schedule Information
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
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

          {/* --- TIME INFORMATION --- */}
          <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Time Information
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
                Configure when this schedule should run using the cron
                expression editor.
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
                {/* Hour */}
                <div className="col-span-full sm:col-span-2 gap-2 flex flex-col">
                  <Label className="font-medium">Hour</Label>
                  <Select
                    name="hour"
                    value={
                      cronFields.hour.length === 24
                        ? "*"
                        : cronFields.hour[0]?.toString()
                    }
                    defaultValue="*"
                    onValueChange={(val) => {
                      setCronFields((prev) => ({
                        ...prev,
                        hour:
                          val === "*"
                            ? Array.from({ length: 24 }, (_, i) => i)
                            : [Number(val)],
                      }))
                    }}
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
                          {option === 0
                            ? "12 AM"
                            : option < 12
                              ? `${option} AM`
                              : option === 12
                                ? "12 PM"
                                : `${option - 12} PM`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Minute */}
                <div className="col-span-full sm:col-span-2 gap-2 flex flex-col">
                  <Label className="font-medium">Minute</Label>
                  <Select
                    name="minute"
                    value={
                      cronFields.minute.length === 60
                        ? "*"
                        : cronFields.minute[0]?.toString()
                    }
                    onValueChange={(val) => {
                      setCronFields((prev) => ({
                        ...prev,
                        minute:
                          val === "*"
                            ? Array.from({ length: 60 }, (_, i) => i)
                            : [Number(val)],
                      }))
                    }}
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

                {/* Timezone */}
                <div className="col-span-full sm:col-span-2 gap-2 flex flex-col">
                  <Label className="font-medium">Timezone</Label>
                  <Select
                    name="timezone"
                    value={cronFields.timezone}
                    onValueChange={(val) =>
                      setCronFields((prev) => ({ ...prev, timezone: val }))
                    }
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

                {/* Days of Week */}
                <div className="col-span-full">
                  <fieldset className="mt-6">
                    <legend className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      Days of Week
                    </legend>
                    <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800">
                      {DAYS_OF_WEEK.map((day) => {
                        const dayNum = Number(day.index)
                        const checked = cronFields.days.includes(dayNum)
                        return (
                          <li
                            key={day.id}
                            className="flex items-center gap-x-3 py-3"
                          >
                            <Checkbox
                              id={`day-${day.id}`}
                              name="selectedDays"
                              value={dayNum.toString()}
                              checked={checked}
                              onCheckedChange={(isChecked) => {
                                setCronFields((prev) => {
                                  const newDays = isChecked
                                    ? [...prev.days, dayNum]
                                    : prev.days.filter((d) => d !== dayNum)
                                  return { ...prev, days: newDays }
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

                {/* Derived info: expression, nextRun, error */}
                {expression && !error && nextRun && (
                  <Callout
                    variant="default"
                    title={`Runs ${cronstrue.toString(expression)}`}
                    className="col-span-full"
                  >
                    Next run is at {nextRun.toDate().toLocaleString()}.
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

          {/* --- ACTIONS --- */}
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
