import type { Reporter } from "@prisma/client"
import { logger, schedules } from "@trigger.dev/sdk/v3"
import { Resend } from "resend"
import { db } from "../prisma"

const resend = new Resend(process.env.RESEND_API_KEY || "")

export const hackerNewsHandler = schedules.task({
  id: "hacker-news-handler",
  cron: "*/5 * * * *",
  maxDuration: 300,
  run: async () => {
    // Query schedules that are due to run (not paused and nextRunAt is due)
    const dueSchedules = await db.schedule.findMany({
      where: {
        paused: false,
        nextRunAt: { lte: new Date() },
      },
      include: {
        scheduledReporters: {
          include: { reporter: true },
        },
      },
    })
    logger.log("Retrieved due schedules with reporters", { dueSchedules })

    // Aggregate reporters with Hacker News strategy from the due schedules
    let hackersReporters: Reporter[] = []
    for (const schedule of dueSchedules) {
      for (const sr of schedule.scheduledReporters) {
        const reporter = sr.reporter
        if (
          reporter.strategy === "HN_BEST_STORIES" &&
          reporter.status === "ACTIVE"
        ) {
          hackersReporters.push(reporter)
        }
      }
    }
    const uniqueHackersReporters = hackersReporters.reduce<Reporter[]>(
      (acc, reporter) => {
        if (!acc.find((r) => r.id === reporter.id)) {
          acc.push(reporter)
        }
        return acc
      },
      [],
    )
    logger.log("Retrieved Hacker News reporters", {
      reporters: uniqueHackersReporters.map((r) => ({
        id: r.id,
        name: r.name,
        status: r.status,
        strategy: r.strategy,
      })),
    })

    // Find all active subscriptions for these reporters
    const subscriptions = await db.subscription.findMany({
      where: {
        reporterId: {
          in: uniqueHackersReporters.map((r) => r.id),
        },
        deletedAt: null,
      },
      include: {
        notificationChannel: true,
      },
    })
    logger.log("Retrieved subscriptions", {
      subscriptions: subscriptions.map((s) => ({
        id: s.id,
        reporterId: s.reporterId,
        notificationChannelId: s.notificationChannelId,
      })),
    })

    // Send emails to all subscriptions with EMAIL notification channels
    for (const subscription of subscriptions) {
      if (!subscription?.notificationChannel) continue
      if (subscription?.notificationChannel?.type === "email") {
        try {
          const metadata = subscription.notificationChannel.settings as {
            email: string
          }
          await resend.emails.send({
            from: "Every.news <notifications@updates.every.news>",
            to: metadata.email,
            subject: "Hello World",
            text: "Hello World",
          })
          logger.log("Sent email successfully", {
            subscriptionId: subscription.id,
            email: metadata.email,
          })
        } catch (error) {
          logger.error("Failed to send email", {
            subscriptionId: subscription.id,
            error,
          })
        }
      }
    }
  },
})
