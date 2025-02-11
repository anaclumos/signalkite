"use cache"

import { getSchedule } from "@/app/actions/schedules"
import { ScheduleForm } from "@/app/schedules/form"
import { notFound } from "next/navigation"

export default async function SchedulesPage({
  params,
}: {
  params: Promise<{ scheduleId: string }>
}) {
  const { scheduleId } = await params
  const schedule = await getSchedule(scheduleId)

  if (!schedule) {
    notFound()
  }

  return <ScheduleForm schedule={schedule} />
}
