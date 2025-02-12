"use server"

import { deleteSchedule, upsertSchedule } from "@/app/actions/schedules"
import { generateCronString } from "@/lib/cron"
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
      statusTitle: "Validation Error",
      statusDescription: "Name is required",
    }
  }

  if (selectedDays.length === 0) {
    return {
      success: false,
      statusTitle: "Validation Error",
      statusDescription: "At least one day must be selected",
    }
  }

  const timezone = formData.get("timezone") as string
  const scheduleId = formData.get("id") as string

  if (!timezone) {
    return {
      success: false,
      statusTitle: "Validation Error",
      statusDescription: "Timezone is required",
    }
  }

  const cron = generateCronString(
    formData.get("minute") as string,
    formData.get("hour") as string,
    new Set(selectedDays),
  )

  await upsertSchedule({
    id: scheduleId,
    name,
    cron,
    timezone,
  })

  redirect("/schedules")
  return {
    success: true,
  }
}
