"use client"

import { EntityForm } from "@/components/entity-form"
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
import { useState } from "react"
import { deleteChannelAction, submitChannelAction } from "./server"

interface NotificationChannelFormProps {
  channel?: NotificationChannel
}

export function NotificationChannelForm({
  channel,
}: NotificationChannelFormProps) {
  const [type, setType] = useState<NotificationChannelType>(
    channel?.type || NotificationChannelType.EMAIL,
  )

  return (
    <EntityForm
      title="Notification Channels"
      entityId={channel?.id}
      entityName={channel?.name}
      backUrl="/notification-channels"
      onDelete={channel ? deleteChannelAction : undefined}
      onSubmit={submitChannelAction}
      submitLabel={channel ? "Save Changes" : "Create Channel"}
      sections={[
        {
          title: "Channel Information",
          description: channel
            ? "Edit your notification channel configuration."
            : "Create a new notification channel to deliver updates.",
          children: (
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
                  disabled={Boolean(channel)}
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
          ),
        },
      ]}
    />
  )
}
