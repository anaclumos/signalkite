"use server"

import { deleteSchedule, upsertSchedule } from "@/app/actions/schedules"
import { generateCronString } from "@/lib/cron"
import { redirect } from "next/navigation"

export async function deleteScheduleAction(scheduleId: string) {
  await deleteSchedule(scheduleId)
  redirect("/schedules")
}

export async function submit(formData: FormData) {
  const name = formData.get("name") as string
  const selectedDays = formData.getAll("selectedDays") as string[]

  if (selectedDays.length === 0) {
    throw new Error("At least one day must be selected")
  }

  const cron = generateCronString(
    formData.get("minute") as string,
    formData.get("hour") as string,
    new Set(selectedDays),
  )
  const timezone = formData.get("timezone") as string
  const scheduleId = formData.get("id") as string

  await upsertSchedule({
    id: scheduleId,
    name,
    cron,
    timezone,
  })

  redirect("/schedules")
}
