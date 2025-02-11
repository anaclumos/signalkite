"use server"

import { createPrompt, deletePrompt, updatePrompt } from "@/app/actions/prompts"
import { redirect } from "next/navigation"

export async function deletePromptAction(promptId: string) {
  await deletePrompt(promptId)
  redirect("/prompts")
}

export async function submitPromptAction(
  formData: FormData,
  mode: "create" | "edit",
  promptId?: string,
) {
  const description = formData.get("description") as string
  const text = formData.get("text") as string

  if (mode === "edit" && promptId) {
    await updatePrompt({
      id: promptId,
      description,
      text,
    })
  } else {
    await createPrompt({
      description,
      text,
    })
  }

  redirect("/prompts")
}
