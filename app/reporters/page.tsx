"use cache"

import { getReporters } from "@/app/actions/reporters"
import { ReportersTable } from "./table"

export default async function ReportersPage() {
  const reporters = await getReporters()

  return <ReportersTable initialReporters={reporters || []} />
}
