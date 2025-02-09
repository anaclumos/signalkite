"use server"

import { db } from "@/prisma"
import { NotificationChannelType } from "@prisma/client"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

// Validation schemas
const channelIdSchema = z.string().min(1, "Channel ID is required")

const channelInputSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  type: z.nativeEnum(NotificationChannelType),
  settings: z.record(z.string(), z.any()),
})

const channelUpdateSchema = z.object({
  id: channelIdSchema,
  name: z.string().max(100, "Name must be 100 characters or less").optional(),
  settings: z.record(z.string(), z.any()).optional(),
})

export async function createNotificationChannel({
  name,
  type,
  settings,
}: z.infer<typeof channelInputSchema>) {
  // Validate input
  const validatedData = channelInputSchema.parse({
    name,
    type,
    settings,
  })

  const user = await getCurrentUser()

  return db.notificationChannel.create({
    data: {
      name: validatedData.name,
      type: validatedData.type,
      settings: validatedData.settings,
      userId: user.id,
    },
  })
}

export async function updateNotificationChannel({
  id,
  name,
  settings,
}: z.infer<typeof channelUpdateSchema>) {
  // Validate input
  const validatedData = channelUpdateSchema.parse({
    id,
    name,
    settings,
  })

  const user = await getCurrentUser()

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
      settings: validatedData.settings
        ? {
            ...(channel.settings as Record<string, any>),
            ...validatedData.settings,
          }
        : undefined,
    },
  })
}

export async function deleteNotificationChannel(id: string) {
  // Validate input
  const validatedId = channelIdSchema.parse(id)

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
  // Validate input
  const validatedId = channelIdSchema.parse(id)

  const user = await getCurrentUser()

  const channel = await db.notificationChannel.findUnique({
    where: { id: validatedId },
  })

  if (!channel || channel.userId !== user.id) {
    notFound()
  }

  return channel
}
