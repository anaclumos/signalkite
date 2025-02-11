import { getPrompt } from "@/app/actions/prompts"
import { PromptForm } from "@/app/prompts/form"
import { notFound } from "next/navigation"
export default async function PromptsPage({
  params,
}: {
  params: Promise<{ promptId: string }>
}) {
  const { promptId } = await params
  const prompt = await getPrompt(promptId)

  if (!prompt) {
    notFound()
  }

  return <PromptForm prompt={prompt} />
}
