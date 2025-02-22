"use server"

import { upsertReporter } from "@/app/actions/reporters"
import { FormState } from "@/types/forms"
import { redirect } from "next/navigation"

export async function submitReporterAction(
  prevState: FormState | null,
  formData: FormData,
): Promise<FormState | null> {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const strategy = formData.get("strategy") as string
  const scheduleIds = formData.getAll("schedules") as string[]
  let promptId = formData.get("prompt") as string | null
  if (promptId === "") {
    promptId = null
  }

  if (!name?.trim()) {
    return {
      success: false,
      statusTitle: "Name Required",
      statusDescription: "Please enter a name for the reporter.",
    }
  }

  if (!strategy) {
    return {
      success: false,
      statusTitle: "Strategy Required",
      statusDescription: "Please select a strategy for the reporter.",
    }
  }

  await upsertReporter({
    id,
    name,
    description,
    strategy: strategy as "exa-search" | "hn-best-stories",
    scheduleIds,
    promptId,
  })

  redirect("/reporters")
}
