import { db } from "@/prisma"
import { getCurrentUser } from "./auth"

export async function createSubscription({
  reporterId,
  notificationChannelId,
}: {
  reporterId: string
  notificationChannelId?: string
}) {
  const user = await getCurrentUser()

  // Check if notification channel belongs to user if provided
  if (notificationChannelId) {
    const channel = await db.notificationChannel.findUnique({
      where: { id: notificationChannelId },
    })

    if (!channel || channel.userId !== user.id) {
      throw new Error("Invalid notification channel")
    }
  }

  // Check if reporter exists and is not archived
  const reporter = await db.reporter.findUnique({
    where: {
      id: reporterId,
      deletedAt: null,
    },
  })

  if (!reporter) {
    throw new Error("Reporter not found")
  }

  // Create subscription
  return db.subscription.create({
    data: {
      userId: user.id,
      reporterId,
      notificationChannelId,
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
}: {
  reporterId: string
  notificationChannelId?: string | null
}) {
  const user = await getCurrentUser()

  // Check if subscription exists
  const subscription = await db.subscription.findUnique({
    where: {
      userId_reporterId: {
        userId: user.id,
        reporterId,
      },
    },
  })

  if (!subscription) {
    throw new Error("Subscription not found")
  }

  // Check if notification channel belongs to user if provided
  if (notificationChannelId) {
    const channel = await db.notificationChannel.findUnique({
      where: { id: notificationChannelId },
    })

    if (!channel || channel.userId !== user.id) {
      throw new Error("Invalid notification channel")
    }
  }

  return db.subscription.update({
    where: {
      userId_reporterId: {
        userId: user.id,
        reporterId,
      },
    },
    data: {
      notificationChannelId,
    },
    include: {
      reporter: true,
      notificationChannel: true,
    },
  })
}

export async function deleteSubscription(reporterId: string) {
  const user = await getCurrentUser()

  const subscription = await db.subscription.findUnique({
    where: {
      userId_reporterId: {
        userId: user.id,
        reporterId,
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
        reporterId,
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
