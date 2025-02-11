"use server"

import { db } from "@/prisma"
import { ReporterStatus, ReporterStrategyType } from "@prisma/client"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

// Validation schemas
const reporterIdSchema = z.string().min(1, "Reporter ID is required")

const reporterInputSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z.string().optional(),
  strategy: z.nativeEnum(ReporterStrategyType).optional(),
  promptId: z.string().optional(),
  scheduleIds: z.array(z.string()).optional(),
  notificationChannelIds: z.array(z.string()).optional(),
})

const reporterUpdateSchema = z.object({
  id: reporterIdSchema,
  name: z.string().max(100, "Name must be 100 characters or less").optional(),
  description: z.string().optional(),
  strategy: z.nativeEnum(ReporterStrategyType).optional(),
  status: z.nativeEnum(ReporterStatus).optional(),
  promptId: z.string().nullable().optional(),
})

export async function createReporter({
  name,
  description,
  strategy,
  promptId,
  scheduleIds,
  notificationChannelIds,
}: z.infer<typeof reporterInputSchema>) {
  // Validate input
  const validatedData = reporterInputSchema.parse({
    name,
    description,
    strategy,
    promptId,
    scheduleIds,
    notificationChannelIds,
  })

  const user = await getCurrentUser()

  return db.$transaction(async (tx) => {
    const reporter = await tx.reporter.create({
      data: {
        ...validatedData,
        strategy: validatedData.strategy || ReporterStrategyType.EXA_SEARCH,
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

export async function updateReporter({
  id,
  name,
  description,
  strategy,
  status,
  promptId,
}: z.infer<typeof reporterUpdateSchema>) {
  // Validate input
  const validatedData = reporterUpdateSchema.parse({
    id,
    name,
    description,
    strategy,
    status,
    promptId,
  })

  const user = await getCurrentUser()

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
}

export async function deleteReporter(id: string) {
  // Validate input
  const validatedId = reporterIdSchema.parse(id)

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

export async function getReporters() {
  const user = await getCurrentUser()

  return db.reporter.findMany({
    where: {
      creatorId: user.id,
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
          News: {
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

export async function getReporter(id: string) {
  // Validate input
  const validatedId = reporterIdSchema.parse(id)

  const user = await getCurrentUser()

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
      News: {
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
    (reporter.creatorId !== user.id &&
      reporter.status === ReporterStatus.ARCHIVED)
  ) {
    notFound()
  }

  return reporter
}
