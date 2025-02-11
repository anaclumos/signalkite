import { NavBar } from "@/components/nav-bar"
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
import Link from "next/link"
import { deletePromptAction, submitPromptAction } from "./server"
import type { PromptWithRelations } from "./types"

interface PromptFormProps {
  prompt?: PromptWithRelations
  mode: "create" | "edit"
}

export function PromptForm({ prompt, mode }: PromptFormProps) {
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Prompts", href: "/prompts" },
  ]

  if (mode === "edit" && prompt) {
    breadcrumbs.push({
      title: prompt.description || "Untitled Prompt",
      href: `/prompts/${prompt.id}`,
    })
  }

  return (
    <>
      <NavBar
        breadcrumbs={breadcrumbs}
        actions={
          prompt && (
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
                  {prompt && (
                    <form action={deletePromptAction}>
                      <Button variant="destructive">Delete</Button>
                    </form>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      />

      <form action={submitPromptAction}>
        <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">
              Prompt Information
            </h2>
            <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
              {mode === "create"
                ? "Create a new prompt to use for post-processing stories and content."
                : "Edit your prompt configuration."}
            </p>
          </div>
          <div className="md:col-span-2">
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
          </div>
        </div>

        <Divider />

        <div className="flex items-center justify-end space-x-4 p-4 md:p-8">
          <Link href="/prompts">
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit">
            {mode === "create" ? "Create Prompt" : "Save Changes"}
          </Button>
        </div>
      </form>
    </>
  )
}
