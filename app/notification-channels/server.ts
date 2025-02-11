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

export async function submitChannelAction(formData: FormData) {
  const id = formData.get("id") as string
  const name = formData.get("name") as string
  const type = formData.get("type") as NotificationChannelType
  const settingsStr = formData.get("settings") as string
  let settings = {}

  if (!name?.trim()) {
    throw new Error("Name is required")
  }

  try {
    settings = JSON.parse(settingsStr)
  } catch (error) {
    console.error("Invalid JSON settings:", error)
    throw new Error("Invalid JSON settings")
  }

  try {
    await upsertNotificationChannel({
      id,
      name,
      type,
      settings,
    })
    redirect("/notification-channels")
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to save notification channel")
  }
}
