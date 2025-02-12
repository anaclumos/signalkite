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
      statusTitle: "Name Required",
      statusDescription: "Please enter a name for the prompt.",
    }
  }

  if (!text?.trim()) {
    return {
      success: false,
      statusTitle: "Prompt Text Required",
      statusDescription: "Please enter a prompt text.",
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
