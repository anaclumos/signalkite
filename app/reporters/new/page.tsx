import { getPrompts } from "@/app/actions/prompts"
import { getSchedules } from "@/app/actions/schedules"
import { ReporterForm } from "../form"

export default async function NewReporter() {
  const [schedules, prompts] = await Promise.all([getSchedules(), getPrompts()])
  return <ReporterForm schedules={schedules} prompts={prompts} />
}
