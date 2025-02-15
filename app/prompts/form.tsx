"use client"

import { NavBar } from "@/components/nav-bar"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Divider } from "@/components/ui/divider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/use-toast"
import { FormState } from "@/types/forms"
import { Prompt } from "@prisma/client"
import Link from "next/link"
import { useActionState } from "react"
import { deletePromptAction, submitPromptAction } from "./server"

interface PromptFormProps {
  prompt?: Prompt
}

export function PromptForm({ prompt }: PromptFormProps) {
  const [status, formAction] = useActionState<FormState | null, FormData>(
    submitPromptAction,
    null,
  )
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Prompts", href: "/prompts" },
    ...(prompt?.id
      ? [{ title: prompt.name || "New Prompt", href: `/prompts/${prompt.id}` }]
      : [{ title: "New Prompt", href: "/prompts/new" }]),
  ]

  if (status && !status.success) {
    toast({
      title: status.statusTitle || "Error",
      description: status.statusDescription || "An error occurred",
      variant: "error",
    })
  }

  return (
    <div className="flex flex-col pb-4">
      <NavBar
        breadcrumbs={breadcrumbs}
        actions={
          <>
            {prompt?.id && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Prompt</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this prompt? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <form action={() => deletePromptAction(prompt.id)}>
                      <Button variant="destructive">Delete</Button>
                    </form>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </>
        }
      />

      <form action={formAction}>
        <input type="hidden" name="id" value={prompt?.id} />
        <div>
          <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Prompt Information
              </h2>
              <p className="mt-1 text-sm/6 text-zinc-500 dark:text-zinc-500">
                {prompt
                  ? "Edit your prompt configuration."
                  : "Create a new prompt to use for post-processing stories and content."}
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-4">
                <div className="gap-2 flex flex-col">
                  <Label htmlFor="name" className="font-medium">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={prompt?.name || "New Prompt"}
                    placeholder="Prompt"
                    maxLength={100}
                  />
                </div>
                <div className="gap-2 flex flex-col">
                  <Label htmlFor="description" className="font-medium">
                    Description
                  </Label>
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    defaultValue={prompt?.description || ""}
                    placeholder="What does this prompt do?"
                    maxLength={100}
                  />
                </div>
                <div className="gap-2 flex flex-col">
                  <Label htmlFor="text" className="font-medium">
                    Prompt Text
                  </Label>
                  <Textarea
                    id="text"
                    name="text"
                    defaultValue={prompt?.text || ""}
                    className="mt-2 min-h-[200px]"
                    placeholder="Enter the prompt text that will be used for post-processing"
                  />
                </div>
              </div>
            </div>
          </div>
          <Divider />
          <div className="flex items-center justify-end gap-2 p-4">
            <Link href="/prompts">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <SubmitButton
              defaultLabel={prompt ? "Save Changes" : "Create Prompt"}
              submittingLabel="Saving..."
            />
          </div>
        </div>
      </form>
    </div>
  )
}
