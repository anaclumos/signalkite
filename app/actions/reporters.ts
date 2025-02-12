"use server"

import { db } from "@/prisma"
import { ReporterStatus, ReporterStrategyType } from "@prisma/client"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

const reporterUpsertSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z.string().optional(),
  strategy: z.nativeEnum(ReporterStrategyType).optional(),
  status: z.nativeEnum(ReporterStatus).optional(),
  promptId: z.string().nullable().optional(),
  scheduleIds: z.array(z.string()).optional(),
  notificationChannelIds: z.array(z.string()).optional(),
})

export async function upsertReporter({
  id,
  name,
  description,
  strategy,
  status,
  promptId,
  scheduleIds,
  notificationChannelIds,
}: z.infer<typeof reporterUpsertSchema>) {
  const user = await getCurrentUser()

  if (id && id.length > 0) {
    // Validate input for update
    const validatedData = reporterUpsertSchema.parse({
      id,
      name,
      description,
      strategy,
      status,
      promptId,
    })

    const reporter = await db.reporter.findUnique({
      where: { id: validatedData.id },
    })

    if (!reporter || reporter.creatorId !== user.id) {
      notFound()
    }

    return db.reporter.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        strategy: validatedData.strategy,
        status: validatedData.status,
        promptId: validatedData.promptId,
      },
    })
  } else {
    // Validate input for create
    const validatedData = reporterUpsertSchema.parse({
      name,
      description,
      strategy,
      promptId,
      scheduleIds,
      notificationChannelIds,
    })

    return db.$transaction(async (tx) => {
      const reporter = await tx.reporter.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          strategy: validatedData.strategy || ReporterStrategyType.EXA_SEARCH,
          promptId: validatedData.promptId,
          creatorId: user.id,
        },
      })

      if (validatedData.scheduleIds?.length) {
        await tx.scheduleReporter.createMany({
          data: validatedData.scheduleIds.map((scheduleId) => ({
            scheduleId,
            reporterId: reporter.id,
          })),
        })
      }

      if (validatedData.notificationChannelIds?.length) {
        await tx.subscription.createMany({
          data: validatedData.notificationChannelIds.map((channelId) => ({
            notificationChannelId: channelId,
            reporterId: reporter.id,
            userId: user.id,
          })),
        })
      }

      return reporter
    })
  }
}

export async function deleteReporter(id: string) {
  // Validate input
  const validatedId = z.string().min(1, "Reporter ID is required").parse(id)

  const user = await getCurrentUser()

  const reporter = await db.reporter.findUnique({
    where: { id: validatedId },
  })

  if (!reporter || reporter.creatorId !== user.id) {
    notFound()
  }

  return db.reporter.update({
    where: { id: validatedId },
    data: {
      deletedAt: new Date(),
      status: ReporterStatus.ARCHIVED,
    },
  })
}

async function _getReporters(userId: string) {
  return db.reporter.findMany({
    where: {
      creatorId: userId,
      deletedAt: null,
    },
    include: {
      Prompt: true,
      Stories: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      _count: {
        select: {
          Stories: {
            where: {
              deletedAt: null,
            },
          },
          Issues: {
            where: {
              deletedAt: null,
            },
          },
          Subscriptions: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getReporters() {
  const user = await getCurrentUser()
  return _getReporters(user.id)
}

async function _getReporter(id: string, userId: string) {
  const validatedId = z.string().min(1, "Reporter ID is required").parse(id)

  const reporter = await db.reporter.findUnique({
    where: { id: validatedId },
    include: {
      Prompt: true,
      Stories: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
      Issues: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (
    !reporter ||
    (reporter.creatorId !== userId &&
      reporter.status === ReporterStatus.ARCHIVED)
  ) {
    notFound()
  }

  return reporter
}

export async function getReporter(id: string) {
  const user = await getCurrentUser()
  return _getReporter(id, user.id)
}
