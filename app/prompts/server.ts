"use server"

import { deletePrompt, upsertPrompt } from "@/app/actions/prompts"
import { FormState } from "@/types/forms"
import { redirect } from "next/navigation"

export async function deletePromptAction(id: string): Promise<void> {
  await deletePrompt(id)
  redirect("/prompts")
}

export async function submitPromptAction(
  prevState: FormState | null,
  formData: FormData,
): Promise<FormState | null> {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const text = formData.get("text") as string

  if (!name?.trim()) {
    return {
      success: false,
      statusTitle: "Validation Error",
      statusDescription: "Name is required",
    }
  }

  if (!text?.trim()) {
    return {
      success: false,
      statusTitle: "Validation Error",
      statusDescription: "Prompt text is required",
    }
  }

  await upsertPrompt({
    id,
    name,
    description,
    text,
  })

  redirect("/prompts")
  return {
    success: true,
  }
}
