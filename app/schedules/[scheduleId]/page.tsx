import { ScheduleForm } from "@/app/(settings)/schedules/components/schedule-form"
import { getSchedule } from "@/app/actions/schedules"

export default async function SchedulesPage({
  params,
}: {
  params: Promise<{ scheduleId: string }>
}) {
  const { scheduleId } = await params
  const schedule = await getSchedule(scheduleId)

  return <ScheduleForm schedule={schedule} mode="edit" />
}
