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
import { NotificationChannel, NotificationChannelType } from "@prisma/client"
import Link from "next/link"
import { useState } from "react"
import { deleteChannelAction, submitChannelAction } from "./server"

interface NotificationChannelFormProps {
  channel?: NotificationChannel
  mode: "create" | "edit"
}

export function NotificationChannelForm({
  channel,
  mode,
}: NotificationChannelFormProps) {
  const [type, setType] = useState<NotificationChannelType>(
    channel?.type || NotificationChannelType.EMAIL,
  )

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
                  <form
                    action={() => channel && deleteChannelAction(channel.id)}
                  >
                    <Button variant="destructive">Delete</Button>
                  </form>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      />

      <form
        action={(formData) =>
          submitChannelAction(formData, mode, channel?.id, type)
        }
      >
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
