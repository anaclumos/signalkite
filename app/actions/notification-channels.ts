"use server"

// Import required dependencies
import { db } from "@/prisma"
import { clerkClient } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

/**
 * Syncs notification channels from Clerk user profile
 * @returns Array of created/updated notification channels
 */
export async function syncNotificationChannelsFromClerk() {
  const user = await getCurrentUser()
  const clerk = await clerkClient()
  const clerkUser = await clerk.users.getUser(user.authProviderUid)

  const channels = []

  // Sync email channels
  for (const email of clerkUser.emailAddresses) {
    if (email.verification?.status === "verified") {
      channels.push({
        name: email.emailAddress,
        type: "EMAIL",
        settings: { email: email.emailAddress },
      })
    }
  }

  // Sync phone channels
  for (const phone of clerkUser.phoneNumbers) {
    if (phone.verification?.status === "verified") {
      channels.push({
        name: phone.phoneNumber,
        type: "TEXT",
        settings: { phone: phone.phoneNumber },
      })
    }
  }

  // Upsert each channel
  const results = await Promise.all(
    channels.map(async (channel) => {
      // Check if channel already exists
      const existing = await db.notificationChannel.findFirst({
        where: {
          userId: user.id,
          name: channel.name,
          deletedAt: null,
        },
      })

      if (existing) {
        return db.notificationChannel.update({
          where: { id: existing.id },
          data: {
            settings: channel.settings,
          },
        })
      }

      return db.notificationChannel.create({
        data: {
          ...channel,
          userId: user.id,
        },
      })
    }),
  )

  return results
}

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
