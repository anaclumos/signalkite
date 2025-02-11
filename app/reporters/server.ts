"use server"

import { createReporter } from "@/app/actions/reporters"
import { ReporterStrategyType } from "@prisma/client"
import { redirect } from "next/navigation"

export async function submitReporterAction(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const strategy = formData.get("strategy") as ReporterStrategyType
  const scheduleIds = formData.getAll("schedules") as string[]
  const notificationChannelIds = formData.getAll(
    "notificationChannels",
  ) as string[]

  await createReporter({
    name,
    description,
    strategy,
    scheduleIds,
    notificationChannelIds,
  })

  redirect("/reporters")
}
