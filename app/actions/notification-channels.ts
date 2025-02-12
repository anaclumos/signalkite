"use server"

import { db } from "@/prisma"
import { NotificationChannelType } from "@prisma/client"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

const channelUpsertSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z.string().optional(),
  type: z.nativeEnum(NotificationChannelType),
  settings: z.record(z.string(), z.any()),
})

export async function upsertNotificationChannel({
  id,
  name,
  description,
  type,
  settings,
}: z.infer<typeof channelUpsertSchema>) {
  const user = await getCurrentUser()

  if (id && id.length > 0) {
    // Validate input for update
    const validatedData = channelUpsertSchema.parse({
      id,
      name,
      description,
      type,
      settings,
    })

    const channel = await db.notificationChannel.findUnique({
      where: { id: validatedData.id },
    })

    if (!channel || channel.userId !== user.id) {
      notFound()
    }

    return db.notificationChannel.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        settings: {
          ...(channel.settings as Record<string, any>),
          ...validatedData.settings,
        },
      },
    })
  } else {
    // Validate input for create
    if (!type) {
      throw new Error("Type is required when creating a notification channel")
    }
    const validatedData = channelUpsertSchema.parse({ name, type, settings })

    return db.notificationChannel.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        type: validatedData.type,
        settings: validatedData.settings,
        userId: user.id,
      },
    })
  }
}

export async function deleteNotificationChannel(id: string) {
  // Validate input
  const validatedId = z.string().min(1, "Channel ID is required").parse(id)

  const user = await getCurrentUser()

  const channel = await db.notificationChannel.findUnique({
    where: { id: validatedId },
  })

  if (!channel || channel.userId !== user.id) {
    notFound()
  }

  return db.notificationChannel.update({
    where: { id: validatedId },
    data: {
      deletedAt: new Date(),
    },
  })
}

async function _getNotificationChannels(userId: string) {
  return db.notificationChannel.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getNotificationChannels() {
  const user = await getCurrentUser()
  return _getNotificationChannels(user.id)
}

async function _getNotificationChannel(id: string, userId: string) {
  const validatedId = z.string().min(1, "Channel ID is required").parse(id)

  const channel = await db.notificationChannel.findUnique({
    where: { id: validatedId },
  })

  if (!channel || channel.userId !== userId) {
    notFound()
  }

  return channel
}

export async function getNotificationChannel(id: string) {
  const user = await getCurrentUser()
  return _getNotificationChannel(id, user.id)
}
