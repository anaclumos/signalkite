import { getSchedules } from "@/app/actions/schedules"
import { ReporterForm } from "../form"

export default async function NewReporter() {
  const schedules = await getSchedules()
  return <ReporterForm schedules={schedules} />
}
