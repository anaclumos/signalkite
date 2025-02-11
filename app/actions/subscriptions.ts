"use server"

import { db } from "@/prisma"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

const subscriptionUpsertSchema = z.object({
  reporterId: z.string().min(1, "Reporter ID is required"),
  notificationChannelId: z.string().nullable().optional(),
})

export async function upsertSubscription({
  reporterId,
  notificationChannelId,
}: z.infer<typeof subscriptionUpsertSchema>) {
  const validatedData = subscriptionUpsertSchema.parse({
    reporterId,
    notificationChannelId,
  })

  const user = await getCurrentUser()

  // Check if notification channel exists and belongs to user
  if (validatedData.notificationChannelId) {
    const channel = await db.notificationChannel.findUnique({
      where: { id: validatedData.notificationChannelId },
    })
    if (!channel || channel.userId !== user.id) {
      notFound()
    }
  }

  // Check if reporter exists
  const reporter = await db.reporter.findUnique({
    where: {
      id: validatedData.reporterId,
      deletedAt: null,
    },
  })

  if (!reporter) {
    notFound()
  }

  // Check if subscription exists
  const existingSubscription = await db.subscription.findUnique({
    where: {
      userId_reporterId: {
        userId: user.id,
        reporterId: validatedData.reporterId,
      },
    },
  })

  if (existingSubscription) {
    // Update
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
        reporter: true,
        notificationChannel: true,
      },
    })
  } else {
    // Create
    return db.subscription.create({
      data: {
        userId: user.id,
        reporterId: validatedData.reporterId,
        notificationChannelId: validatedData.notificationChannelId,
      },
      include: {
        reporter: true,
        notificationChannel: true,
      },
    })
  }
}

export async function deleteSubscription(reporterId: string) {
  // Validate input
  const validatedReporterId = z
    .string()
    .min(1, "Reporter ID is required")
    .parse(reporterId)

  const user = await getCurrentUser()

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

  return db.subscription.delete({
    where: {
      userId_reporterId: {
        userId: user.id,
        reporterId: validatedReporterId,
      },
    },
  })
}

async function _getSubscriptions(userId: string) {
  return db.subscription.findMany({
    where: {
      userId,
    },
    include: {
      reporter: true,
      notificationChannel: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getSubscriptions() {
  const user = await getCurrentUser()
  return _getSubscriptions(user.id)
}
