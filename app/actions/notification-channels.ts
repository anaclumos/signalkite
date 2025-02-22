"use server"

// Import required dependencies
import { db } from "@/prisma"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

// Zod schema for validating notification channel data
const channelUpsertSchema = z.object({
  id: z.string().optional(), // Optional for updates
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z.string().optional(), // Optional channel description
  type: z.enum(["email", "slack", "text"]), // Supported notification types
  settings: z.record(z.string(), z.any()), // Channel-specific settings
})

/**
 * Creates or updates a notification channel
 * @param id - Channel ID (optional, for updates)
 * @param name - Channel name
 * @param description - Channel description
 * @param type - Channel type (email/slack/text)
 * @param settings - Channel configuration
 * @returns Created or updated notification channel
 */
export async function upsertNotificationChannel({
  id,
  name,
  description,
  type,
  settings,
}: z.infer<typeof channelUpsertSchema>) {
  const user = await getCurrentUser()

  if (id && id.length > 0) {
    // Update existing channel
    const validatedData = channelUpsertSchema.parse({
      id,
      name,
      description,
      type,
      settings,
    })

    // Verify channel exists and belongs to user
    const channel = await db.notificationChannel.findUnique({
      where: { id: validatedData.id },
    })

    if (!channel || channel.userId !== user.id) {
      notFound()
    }

    // Update channel with merged settings
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
    // Create new channel
    if (!type) {
      throw new Error("Type is required when creating a notification channel")
    }
    const validatedData = channelUpsertSchema.parse({ name, type, settings })

    // Create channel with validated data
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

/**
 * Soft deletes a notification channel
 * @param id - Channel ID to delete
 * @returns Updated channel with deletedAt timestamp
 * @throws {notFound} If channel doesn't exist or belong to user
 */
export async function deleteNotificationChannel(id: string) {
  // Validate input
  const validatedId = z.string().min(1, "Channel ID is required").parse(id)

  const user = await getCurrentUser()

  // Verify channel exists and belongs to user
  const channel = await db.notificationChannel.findUnique({
    where: { id: validatedId },
  })

  if (!channel || channel.userId !== user.id) {
    notFound()
  }

  // Soft delete by setting deletedAt timestamp
  return db.notificationChannel.update({
    where: { id: validatedId },
    data: {
      deletedAt: new Date(),
    },
  })
}

/**
 * Retrieves all active notification channels for current user
 * @returns Array of notification channels
 */
export async function getNotificationChannels() {
  const user = await getCurrentUser()
  return db.notificationChannel.findMany({
    where: {
      userId: user.id,
      deletedAt: null, // Only return active channels
    },
    orderBy: {
      createdAt: "desc", // Most recent first
    },
  })
}

/**
 * Retrieves a specific notification channel
 * @param id - Channel ID to retrieve
 * @returns Notification channel if found
 * @throws {notFound} If channel doesn't exist or belong to user
 */
export async function getNotificationChannel(id: string) {
  const user = await getCurrentUser()
  const validatedId = z.string().min(1, "Channel ID is required").parse(id)

  // Verify channel exists and belongs to user
  const channel = await db.notificationChannel.findUnique({
    where: { id: validatedId },
  })

  if (!channel || channel.userId !== user.id) {
    notFound()
  }

  return channel
}
