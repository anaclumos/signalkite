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

    // {
    //   "dueSchedules": [
    //     {
    //       "id": "01JMFBF8Z7TKBQZ6WRBJT1ZEBG",
    //       "cron": "* * * * *",
    //       "name": "New Schedule",
    //       "paused": false,
    //       "ownerId": "01JMFBD0WEG3H3661J4A2R8N7C",
    //       "timezone": "Asia/Seoul",
    //       "createdAt": "2025-02-19T14:58:26.407Z",
    //       "deletedAt": null,
    //       "lastRunAt": null,
    //       "nextRunAt": "2025-02-19T14:59:00.000Z",
    //       "updatedAt": "2025-02-19T14:58:36.024Z",
    //       "scheduledReporters": [
    //         {
    //           "id": "01JMFBFYYNQ7WW0HYX44ZAH2WE",
    //           "reporterId": "01JMFBFYYK4R4NCTG6PW99BJ9Q",
    //           "scheduleId": "01JMFBF8Z7TKBQZ6WRBJT1ZEBG",
    //           "reporter": {
    //             "id": "01JMFBFYYK4R4NCTG6PW99BJ9Q",
    //             "name": "My HN",
    //             "status": "ACTIVE",
    //             "metadata": null,
    //             "promptId": null,
    //             "strategy": "HN_BEST_STORIES",
    //             "createdAt": "2025-02-19T14:58:48.915Z",
    //             "creatorId": "01JMFBD0WEG3H3661J4A2R8N7C",
    //             "deletedAt": null,
    //             "updatedAt": "2025-02-19T14:58:48.915Z",
    //             "description": ""
    //           }
    //         }
    //       ]
    //     }
    //   ]
    // }
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

    // {
    //   "reporters": [
    //     {
    //       "id": "01JMFBFYYK4R4NCTG6PW99BJ9Q",
    //       "name": "My HN",
    //       "status": "ACTIVE",
    //       "strategy": "HN_BEST_STORIES"
    //     }
    //   ]
    // }
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
      if (subscription?.notificationChannel?.type === "EMAIL") {
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
