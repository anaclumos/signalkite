import { getSchedule } from "@/app/actions/schedules"
import { ScheduleForm } from "./form"

export default async function SchedulesPage({
  params,
}: {
  params: { scheduleId: string }
}) {
  const schedule = await getSchedule(params.scheduleId)

  return <ScheduleForm schedule={schedule} />
}
