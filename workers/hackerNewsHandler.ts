// Import required dependencies
import type { Reporter } from "@prisma/client"
import { logger, schedules } from "@trigger.dev/sdk/v3"
import { Resend } from "resend"
import { db } from "../prisma"

// Initialize email service with API key
const resend = new Resend(process.env.RESEND_API_KEY || "")

/**
 * Scheduled task for handling Hacker News content distribution
 * This worker:
 * 1. Finds due schedules and their reporters
 * 2. Filters for active Hacker News reporters
 * 3. Retrieves associated subscriptions
 * 4. Sends notifications via configured channels
 */
export const hackerNewsHandler = schedules.task({
  // Unique task identifier
  id: "hacker-news-handler",

  // Run every 5 minutes
  // */5 = At every 5th minute
  cron: "*/5 * * * *",

  // Maximum execution time (5 minutes)
  maxDuration: 300,

  /**
   * Task execution function
   * Processes Hacker News content and sends notifications
   */
  run: async () => {
    // Find schedules that are:
    // - Not paused
    // - Due to run (nextRunAt <= current time)
    // Include their associated reporters
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

    // Extract and filter reporters:
    // - Must use Hacker News strategy
    // - Must be active status
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

    // Remove duplicate reporters
    // A reporter might be scheduled multiple times
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

    // Find active subscriptions for filtered reporters
    // Include notification channel details for delivery
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

    // Process email notifications
    // Iterate through subscriptions and send emails
    // where notification channel type is 'email'
    for (const subscription of subscriptions) {
      // Skip if no notification channel configured
      if (!subscription?.notificationChannel) continue

      // Handle email notifications
      if (subscription?.notificationChannel?.type === "email") {
        try {
          // Extract email from channel settings
          const metadata = subscription.notificationChannel.settings as {
            email: string
          }

          // Send email notification
          await resend.emails.send({
            from: "Every.news <notifications@updates.every.news>",
            to: metadata.email,
            subject: "Hello World",
            text: "Hello World",
          })

          // Log successful email delivery
          logger.log("Sent email successfully", {
            subscriptionId: subscription.id,
            email: metadata.email,
          })
        } catch (error) {
          // Log email delivery failures
          logger.error("Failed to send email", {
            subscriptionId: subscription.id,
            error,
          })
        }
      }
    }
  },
})
