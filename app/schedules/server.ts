"use server"

import { deleteSchedule } from "@/app/actions/schedules"
import { generateCronString } from "@/lib/cron"
import { redirect } from "next/navigation"
import { createSchedule, updateSchedule } from "../actions/schedules"

export async function deleteScheduleAction(scheduleId: string) {
  await deleteSchedule(scheduleId)
  redirect("/schedules")
}

export async function submit(formData: FormData) {
  const name = formData.get("name") as string
  const cron = generateCronString(
    formData.get("minute") as string,
    formData.get("hour") as string,
    new Set(formData.getAll("selectedDays") as string[]),
  )
  const timezone = formData.get("timezone") as string
  const scheduleId = formData.get("id") as string | null
  if (scheduleId) {
    await updateSchedule({
      id: scheduleId,
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

  redirect("/schedules")
}
