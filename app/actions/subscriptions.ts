"use server"

// Import required dependencies
import { db } from "@/prisma"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

// Zod schema for validating subscription creation/update data
const subscriptionUpsertSchema = z.object({
  reporterId: z.string().min(1, "Reporter ID is required"), // Required reporter reference
  notificationChannelId: z.string().nullable().optional(), // Optional notification channel
})

/**
 * Creates or updates a subscription to a reporter
 * @param reporterId - ID of reporter to subscribe to
 * @param notificationChannelId - Optional notification channel ID
 * @returns Created or updated subscription with related entities
 * @throws {notFound} If reporter or notification channel not found
 */
export async function upsertSubscription({
  reporterId,
  notificationChannelId,
}: z.infer<typeof subscriptionUpsertSchema>) {
  const validatedData = subscriptionUpsertSchema.parse({
    reporterId,
    notificationChannelId,
  })

  const user = await getCurrentUser()

  // Verify notification channel exists and belongs to user
  if (validatedData.notificationChannelId) {
    const channel = await db.notificationChannel.findUnique({
      where: { id: validatedData.notificationChannelId },
    })
    if (!channel || channel.userId !== user.id) {
      notFound()
    }
  }

  // Verify reporter exists and is active
  const reporter = await db.reporter.findUnique({
    where: {
      id: validatedData.reporterId,
      deletedAt: null,
    },
  })

  if (!reporter) {
    notFound()
  }

  // Check for existing subscription
  const existingSubscription = await db.subscription.findUnique({
    where: {
      userId_reporterId: {
        userId: user.id,
        reporterId: validatedData.reporterId,
      },
    },
  })

  if (existingSubscription) {
    // Update existing subscription
    return db.subscription.update({
      where: {
        userId_reporterId: {
          userId: user.id,
          reporterId: validatedData.reporterId,
        },
      },
      data: {
        notificationChannelId: validatedData.notificationChannelId,
      },
      include: {
        reporter: true, // Include reporter details
        notificationChannel: true, // Include channel details
      },
    })
  } else {
    // Create new subscription
    return db.subscription.create({
      data: {
        userId: user.id,
        reporterId: validatedData.reporterId,
        notificationChannelId: validatedData.notificationChannelId,
      },
      include: {
        reporter: true, // Include reporter details
        notificationChannel: true, // Include channel details
      },
    })
  }
}

/**
 * Soft deletes a subscription
 * @param reporterId - ID of reporter to unsubscribe from
 * @returns Updated subscription with deletedAt timestamp
 * @throws {notFound} If subscription not found
 */
export async function deleteSubscription(reporterId: string) {
  // Validate input
  const validatedReporterId = z
    .string()
    .min(1, "Reporter ID is required")
    .parse(reporterId)

  const user = await getCurrentUser()

  // Verify subscription exists
  const subscription = await db.subscription.findUnique({
    where: {
      userId_reporterId: {
        userId: user.id,
        reporterId: validatedReporterId,
      },
    },
  })

  if (!subscription) {
    notFound()
  }

  // Soft delete by setting deletedAt timestamp
  return db.subscription.update({
    where: {
      userId_reporterId: {
        userId: user.id,
        reporterId: validatedReporterId,
      },
    },
    data: {
      deletedAt: new Date(),
    },
  })
}

/**
 * Retrieves all active subscriptions for current user
 * @returns Array of subscriptions with related entities
 */
export async function getSubscriptions() {
  const user = await getCurrentUser()
  return db.subscription.findMany({
    where: {
      userId: user.id,
      deletedAt: null, // Only return active subscriptions
    },
    include: {
      reporter: true, // Include reporter details
      notificationChannel: true, // Include channel details
    },
    orderBy: {
      createdAt: "desc", // Most recent first
    },
  })
}
