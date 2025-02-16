import type { Reporter } from "@prisma/client"
import { logger, schedules, wait } from "@trigger.dev/sdk/v3"
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

    // Deduplicate reporters by id
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
        strategy: r.strategy,
        status: r.status,
      })),
    })

    // Process each reporter (placeholder logic)
    for (const reporter of uniqueHackersReporters) {
      logger.log(`Processing reporter id: ${reporter.id}`)
      // TODO: Add fetching and processing logic for Hacker News stories
      await wait.for({ seconds: 1 })

      // Query subscriptions for this reporter including notification channel and user
      const subscriptions = await db.subscription.findMany({
        where: { reporterId: reporter.id },
        include: { notificationChannel: true, user: true },
      })

      // For each subscription, send an email if the channel type is EMAIL
      for (const subscription of subscriptions) {
        if (
          subscription.notificationChannel &&
          subscription.notificationChannel.type === "EMAIL"
        ) {
          const channelSettings = subscription.notificationChannel.settings as {
            from: string
          }
          const userEmail = (subscription.user as unknown as { email: string })
            .email
          try {
            await resend.emails.send({
              from: channelSettings.from,
              to: userEmail,
              subject: "Hacker News Update",
              html: `<p>New stories are available for Reporter ${reporter.name}.</p>`,
            })
            logger.log(`Email sent to ${userEmail} for reporter ${reporter.id}`)
          } catch (error) {
            console.error(
              `Failed to send email to ${userEmail} for reporter ${reporter.id}`,
              error as any,
            )
            logger.error(
              `Failed to send email to ${userEmail} for reporter ${reporter.id}`,
              error as any,
            )
          }
        }
      }
    }
  },
})
