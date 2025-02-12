"use client"

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
import { toast } from "@/lib/use-toast"
import { FormSection, FormState } from "@/types/forms"
import Link from "next/link"
import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"

interface EntityFormProps {
  title: string
  entityId?: string
  entityName?: string
  backUrl: string
  sections: FormSection[]
  onDelete?: (id: string) => Promise<void>
  onSubmit: (
    prevState: FormState | null,
    formData: FormData,
  ) => Promise<FormState | null>
  submitLabel: string
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  )
}

export function EntityForm({
  title,
  entityId,
  entityName,
  backUrl,
  sections,
  onDelete,
  onSubmit,
  submitLabel,
}: EntityFormProps) {
  const [status, formAction] = useActionState<FormState | null, FormData>(
    onSubmit,
    null,
  )
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title, href: backUrl },
  ]

  if (entityId && entityName) {
    breadcrumbs.push({
      title: entityName,
      href: `${backUrl}/${entityId}`,
    })
  }

  useEffect(() => {
    if (status && !status.success) {
      toast({
        title: status.statusTitle || "Error",
        description: status.statusDescription || "An error occurred",
        variant: "error",
      })
    }
  }, [status])

  return (
    <div className="flex flex-col pb-4">
      <NavBar
        breadcrumbs={breadcrumbs}
        actions={
          <>
            {entityId && onDelete && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete {title}</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this {title.toLowerCase()}
                      ? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <form action={() => onDelete(entityId)}>
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
        <input type="hidden" name="id" value={entityId} />
        {sections.map((section, index) => (
          <div key={section.title}>
            <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-gray-50">
                  {section.title}
                </h2>
                <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
                  {section.description}
                </p>
              </div>
              <div className="md:col-span-2">{section.children}</div>
            </div>
            {index < sections.length - 1 && <Divider />}
          </div>
        ))}
        <Divider />
        <div className="flex items-center justify-end gap-2 p-4">
          <Link href={backUrl}>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </Link>
          <SubmitButton label={submitLabel} />
        </div>
      </form>
    </div>
  )
}
