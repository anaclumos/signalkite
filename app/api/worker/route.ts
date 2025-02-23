import { db } from "@/prisma"
import { Reporter } from "@prisma/client"
import { Resend } from "resend"

export async function GET(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY || "")

  const dueSchedules = await db.schedule.findMany({
    where: {
      paused: false,
      // nextRunAt: { lte: new Date() },
    },
    include: {
      scheduledReporters: {
        include: { reporter: true },
      },
    },
  })

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

  console.log("Retrieved Hacker News reporters", {
    reporters: uniqueHackersReporters.map((r) => ({
      id: r.id,
      name: r.name,
      status: r.status,
      strategy: r.strategy,
    })),
  })

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
  console.log("Retrieved subscriptions", {
    subscriptions: subscriptions.map((s) => ({
      id: s.id,
      reporterId: s.reporterId,
      notificationChannelId: s.notificationChannelId,
    })),
  })

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
        console.log("Sent email successfully", {
          subscriptionId: subscription.id,
          email: metadata.email,
        })
      } catch (error) {
        console.error("Failed to send email", {
          subscriptionId: subscription.id,
          error,
        })
      }
    }
  }

  return new Response("Worker executed successfully", { status: 200 })
}
