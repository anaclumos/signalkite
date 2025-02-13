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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/lib/use-toast"
import { FormState } from "@/types/forms"
import { NotificationChannel, NotificationChannelType } from "@prisma/client"
import Link from "next/link"
import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { deleteChannelAction, submitChannelAction } from "./server"

interface NotificationChannelFormProps {
  channel?: NotificationChannel
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : label}
    </Button>
  )
}

export function NotificationChannelForm({
  channel,
}: NotificationChannelFormProps) {
  const [type, setType] = useState<NotificationChannelType>(
    channel?.type || NotificationChannelType.EMAIL,
  )
  const [status, formAction] = useActionState<FormState | null, FormData>(
    submitChannelAction,
    null,
  )
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Notification Channels", href: "/notification-channels" },
    ...(channel?.id
      ? [
          {
            title: channel.name || "Untitled Channel",
            href: `/notification-channels/${channel.id}`,
          },
        ]
      : [{ title: "New Channel", href: "/notification-channels/new" }]),
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
            {channel?.id && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Notification Channel</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this notification channel?
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <form action={() => deleteChannelAction(channel.id)}>
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
        <input type="hidden" name="id" value={channel?.id} />
        <div>
          <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-50">
                Channel Information
              </h2>
              <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
                {channel
                  ? "Edit your notification channel configuration."
                  : "Create a new notification channel to deliver updates."}
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name" className="font-medium">
                    Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={channel?.name || "Untitled Channel"}
                    placeholder="A descriptive name for this channel"
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="type" className="font-medium">
                    Type
                  </Label>
                  <Select
                    name="type"
                    value={type}
                    onValueChange={(value) =>
                      setType(value as NotificationChannelType)
                    }
                    disabled={Boolean(channel)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a channel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NotificationChannelType.EMAIL}>
                        Email
                      </SelectItem>
                      <SelectItem value={NotificationChannelType.TEXT}>
                        TEXT
                      </SelectItem>
                      <SelectItem value={NotificationChannelType.SLACK}>
                        Slack
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="settings" className="font-medium">
                    Settings
                  </Label>
                  <Textarea
                    id="settings"
                    name="settings"
                    defaultValue={
                      channel ? JSON.stringify(channel.settings, null, 2) : "{}"
                    }
                    className="mt-2 min-h-[200px] font-mono"
                    placeholder="Enter the channel settings as JSON"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Configure the settings for your notification channel in JSON
                    format.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Divider />
          <div className="flex items-center justify-end gap-2 p-4">
            <Link href="/notification-channels">
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </Link>
            <SubmitButton label={channel ? "Save Changes" : "Create Channel"} />
          </div>
        </div>
      </form>
    </div>
  )
}
