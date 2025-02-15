"use server"

import { deleteSchedule, upsertSchedule } from "@/app/actions/schedules"
import { buildCron } from "@/lib/cron"
import { FormState } from "@/types/forms"
import { redirect } from "next/navigation"

export async function deleteScheduleAction(scheduleId: string): Promise<void> {
  await deleteSchedule(scheduleId)
  redirect("/schedules")
}

export async function submitScheduleAction(
  prevState: FormState | null,
  formData: FormData,
): Promise<FormState | null> {
  const name = formData.get("name") as string
  const selectedDays = formData.getAll("selectedDays") as string[]

  if (!name?.trim()) {
    return {
      success: false,
      statusTitle: "Name Required",
      statusDescription: "Please enter a name for the schedule.",
    }
  }

  if (selectedDays.length === 0) {
    return {
      success: false,
      statusTitle: "At Least One Day Required",
      statusDescription: "Please select at least one day for the schedule.",
    }
  }

  const timezone = formData.get("timezone") as string
  const scheduleId = formData.get("id") as string

  if (!timezone) {
    return {
      success: false,
      statusTitle: "Timezone Required",
      statusDescription: "Please enter a timezone for the schedule.",
    }
  }

  const cron = buildCron({
    minute:
      formData.get("minute") === "*"
        ? "*"
        : [parseInt(formData.get("minute") as string)],
    hour:
      formData.get("hour") === "*"
        ? "*"
        : [parseInt(formData.get("hour") as string)],
    day: selectedDays.map((day) => parseInt(day)),
  })

  await upsertSchedule({
    id: scheduleId,
    name,
    cron,
    timezone,
  })

  redirect("/schedules")
}
