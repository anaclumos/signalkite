"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/lib/use-toast"
import { FormState } from "@/types/forms"
import { NotificationChannel, Reporter } from "@prisma/client"
import { useActionState, useEffect, useState } from "react"
import { subscribeToReporter } from "./server"

interface SubscribeButtonProps {
  reporter: Reporter
  notificationChannels: NotificationChannel[]
}

export function SubscribeButton({
  reporter,
  notificationChannels,
}: SubscribeButtonProps) {
  const [status, formAction] = useActionState<FormState | null, FormData>(
    subscribeToReporter,
    null,
  )
  const [selectedChannel, setSelectedChannel] = useState<string | undefined>(
    undefined,
  )

  useEffect(() => {
    if (status?.success) {
      toast({
        title: "Subscribed",
        description: "You have successfully subscribed to this reporter",
      })
    } else if (status && !status.success) {
      toast({
        title: status.statusTitle || "Error",
        description: status.statusDescription || "Failed to subscribe",
        variant: "error",
      })
    }
  }, [status])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="primary">Subscribe</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form action={formAction}>
          <input type="hidden" name="reporterId" value={reporter.id} />
          <Select
            name="notificationChannelId"
            onValueChange={setSelectedChannel}
            value={selectedChannel}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a notification channel" />
            </SelectTrigger>
            <SelectContent>
              {notificationChannels.map((channel) => (
                <SelectItem key={channel.id} value={channel.id}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="submit"
            className="mt-4 w-full"
            disabled={!selectedChannel}
          >
            Confirm Subscription
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}
