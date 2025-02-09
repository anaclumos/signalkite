import { getSchedule } from "@/app/actions/schedules"
import { ScheduleForm } from "./form"

export default async function SchedulesPage({
  params,
}: {
  params: Promise<{ scheduleId: string }>
}) {
  const { scheduleId } = await params
  const schedule = await getSchedule(scheduleId)

  return <ScheduleForm schedule={schedule} />
}
