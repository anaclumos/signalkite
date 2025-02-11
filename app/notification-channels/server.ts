"use server"

import {
  deleteNotificationChannel,
  upsertNotificationChannel,
} from "@/app/actions/notification-channels"
import { NotificationChannelType } from "@prisma/client"
import { redirect } from "next/navigation"

export async function deleteChannelAction(channelId: string) {
  await deleteNotificationChannel(channelId)
  redirect("/notification-channels")
}

export async function submitChannelAction(
  formData: FormData,
  channelId?: string,
  type?: NotificationChannelType,
) {
  const name = formData.get("name") as string
  const settingsStr = formData.get("settings") as string
  let settings = {}

  try {
    settings = JSON.parse(settingsStr)
  } catch (error) {
    console.error("Invalid JSON settings:", error)
    return
  }

  await upsertNotificationChannel({
    id: channelId,
    name,
    type: type || NotificationChannelType.EMAIL,
    settings,
  })
  redirect("/notification-channels")
}
