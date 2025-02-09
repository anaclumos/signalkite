"use server"

import { db } from "@/prisma"
import { z } from "zod"
import { getCurrentUser } from "./auth"

// Validation schemas
const subscriptionInputSchema = z.object({
  reporterId: z.string().min(1, "Reporter ID is required"),
  notificationChannelId: z.string().optional(),
})

const subscriptionUpdateSchema = z.object({
  reporterId: z.string().min(1, "Reporter ID is required"),
  notificationChannelId: z.string().nullable().optional(),
})

export async function createSubscription({
  reporterId,
  notificationChannelId,
}: z.infer<typeof subscriptionInputSchema>) {
  // Validate input
  const validatedData = subscriptionInputSchema.parse({
    reporterId,
    notificationChannelId,
  })

  const user = await getCurrentUser()

  if (validatedData.notificationChannelId) {
    const channel = await db.notificationChannel.findUnique({
      where: { id: validatedData.notificationChannelId },
    })
    if (!channel || channel.userId !== user.id) {
      throw new Error("Invalid notification channel")
    }
  }

  const reporter = await db.reporter.findUnique({
    where: {
      id: validatedData.reporterId,
      deletedAt: null,
    },
  })

  if (!reporter) {
    throw new Error("Reporter not found")
  }

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

export async function updateSubscription({
  reporterId,
  notificationChannelId,
}: z.infer<typeof subscriptionUpdateSchema>) {
  // Validate input
  const validatedData = subscriptionUpdateSchema.parse({
    reporterId,
    notificationChannelId,
  })

  const user = await getCurrentUser()

  const subscription = await db.subscription.findUnique({
    where: {
      userId_reporterId: {
        userId: user.id,
        reporterId: validatedData.reporterId,
      },
    },
  })
  if (!subscription) {
    throw new Error("Subscription not found")
  }

  if (validatedData.notificationChannelId) {
    const channel = await db.notificationChannel.findUnique({
      where: { id: validatedData.notificationChannelId },
    })
    if (!channel || channel.userId !== user.id) {
      throw new Error("Invalid notification channel")
    }
  }

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
    throw new Error("Subscription not found")
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

export async function getSubscriptions() {
  const user = await getCurrentUser()

  return db.subscription.findMany({
    where: {
      userId: user.id,
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
