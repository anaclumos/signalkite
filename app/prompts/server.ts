"use server"

import { deletePrompt, upsertPrompt } from "@/app/actions/prompts"
import { redirect } from "next/navigation"

export async function deletePromptAction(id: string) {
  await deletePrompt(id)
  redirect("/prompts")
}

export async function submitPromptAction(formData: FormData) {
  const id = formData.get("id") as string
  const description = formData.get("description") as string
  const text = formData.get("text") as string

  await upsertPrompt({
    id,
    description,
    text,
  })

  redirect("/prompts")
}
