"use cache"

import { getPrompts } from "@/app/actions/prompts"
import { PromptsTable } from "./table"

export default async function PromptsPage() {
  const prompts = await getPrompts()

  return <PromptsTable initialPrompts={prompts || []} />
}
