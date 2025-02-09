import { db } from "@/prisma"
import { NotificationChannelType } from "@prisma/client"
import { getCurrentUser } from "./auth"

export async function createNotificationChannel({
  name,
  type,
  settings,
}: {
  name: string
  type: NotificationChannelType
  settings: Record<string, any>
}) {
  const user = await getCurrentUser()

  return db.notificationChannel.create({
    data: {
      name,
      type,
      settings,
      userId: user.id,
    },
  })
}

export async function updateNotificationChannel({
  id,
  name,
  settings,
}: {
  id: string
  name?: string
  settings?: Record<string, any>
}) {
  const user = await getCurrentUser()

  const channel = await db.notificationChannel.findUnique({
    where: { id },
  })

  if (!channel || channel.userId !== user.id) {
    throw new Error("Unauthorized or channel not found")
  }

  return db.notificationChannel.update({
    where: { id },
    data: {
      name,
      settings: settings
        ? { ...(channel.settings as Record<string, any>), ...settings }
        : undefined,
    },
  })
}

export async function deleteNotificationChannel(id: string) {
  const user = await getCurrentUser()

  const channel = await db.notificationChannel.findUnique({
    where: { id },
  })

  if (!channel || channel.userId !== user.id) {
    throw new Error("Unauthorized or channel not found")
  }

  return db.notificationChannel.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}

export async function getNotificationChannels() {
  const user = await getCurrentUser()

  return db.notificationChannel.findMany({
    where: {
      userId: user.id,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getNotificationChannel(id: string) {
  const user = await getCurrentUser()

  const channel = await db.notificationChannel.findUnique({
    where: { id },
  })

  if (!channel || channel.userId !== user.id) {
    throw new Error("Channel not found or access denied")
  }

  return channel
}
