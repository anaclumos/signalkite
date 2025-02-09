"use client"

import {
  createNotificationChannel,
  deleteNotificationChannel,
  updateNotificationChannel,
} from "@/app/actions/notification-channels"
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
import { NotificationChannelType } from "@prisma/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { NotificationChannelWithRelations } from "../types"

interface NotificationChannelFormProps {
  channel?: NotificationChannelWithRelations
  mode: "create" | "edit"
}

export function NotificationChannelForm({
  channel,
  mode,
}: NotificationChannelFormProps) {
  const router = useRouter()
  const [type, setType] = useState<NotificationChannelType>(
    channel?.type || NotificationChannelType.EMAIL,
  )

  async function handleDelete() {
    if (channel) {
      await deleteNotificationChannel(channel.id)
      router.push("/notification-channels")
    }
  }

  async function handleSubmit(formData: FormData) {
    const name = formData.get("name") as string
    const settingsStr = formData.get("settings") as string
    let settings = {}

    try {
      settings = JSON.parse(settingsStr)
    } catch (error) {
      console.error("Invalid JSON settings:", error)
      return
    }

    if (mode === "edit" && channel) {
      await updateNotificationChannel({
        id: channel.id,
        name,
        settings,
      })
    } else {
      await createNotificationChannel({
        name,
        type,
        settings,
      })
    }

    router.push("/notification-channels")
  }

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Notification Channels", href: "/notification-channels" },
  ]

  if (mode === "edit" && channel) {
    breadcrumbs.push({
      title: channel.name,
      href: `/notification-channels/${channel.id}`,
    })
  }

  return (
    <>
      <NavBar
        breadcrumbs={breadcrumbs}
        actions={
          channel && (
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
                  <form action={handleDelete}>
                    <Button variant="destructive">Delete</Button>
                  </form>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      />

      <form action={handleSubmit}>
        <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-3 md:p-8">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">
              Channel Information
            </h2>
            <p className="mt-1 text-sm/6 text-gray-500 dark:text-gray-500">
              {mode === "create"
                ? "Create a new notification channel to deliver updates."
                : "Edit your notification channel configuration."}
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
                  defaultValue={channel?.name || ""}
                  className="mt-2"
                  placeholder="A descriptive name for this channel"
                  required
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
                  disabled={mode === "edit"}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a channel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NotificationChannelType.EMAIL}>
                      Email
                    </SelectItem>
                    <SelectItem value={NotificationChannelType.SMS}>
                      SMS
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
                  required
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

        <div className="flex items-center justify-end space-x-4 p-4 md:p-8">
          <Link href="/notification-channels">
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit">
            {mode === "create" ? "Create Channel" : "Save Changes"}
          </Button>
        </div>
      </form>
    </>
  )
}
