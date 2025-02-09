import { getSchedules } from "@/app/actions/schedules"
import { SchedulesTable } from "./table"

export default async function SchedulesPage() {
  const schedules = await getSchedules()

  return <SchedulesTable initialSchedules={schedules || []} />
}
