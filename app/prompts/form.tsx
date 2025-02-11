import { EntityForm } from "@/components/entity-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Prompt } from "@prisma/client"
import { deletePromptAction, submitPromptAction } from "./server"

interface PromptFormProps {
  prompt?: Prompt
}

export function PromptForm({ prompt }: PromptFormProps) {
  return (
    <EntityForm
      title="Prompts"
      entityId={prompt?.id}
      entityName={prompt?.description || "Untitled Prompt"}
      backUrl="/prompts"
      onDelete={prompt ? deletePromptAction : undefined}
      onSubmit={submitPromptAction}
      submitLabel={prompt ? "Save Changes" : "Create Prompt"}
      sections={[
        {
          title: "Prompt Information",
          description: prompt
            ? "Edit your prompt configuration."
            : "Create a new prompt to use for post-processing stories and content.",
          children: (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="description" className="font-medium">
                  Description
                </Label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  defaultValue={prompt?.description || ""}
                  className="mt-2"
                  placeholder="A short description of what this prompt does"
                  required
                  maxLength={100}
                />
              </div>

              <div>
                <Label htmlFor="text" className="font-medium">
                  Prompt Text
                </Label>
                <Textarea
                  id="text"
                  name="text"
                  defaultValue={prompt?.text || ""}
                  className="mt-2 min-h-[200px]"
                  placeholder="Enter the prompt text that will be used for post-processing"
                  required
                />
              </div>
            </div>
          ),
        },
      ]}
    />
  )
}
