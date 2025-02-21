"use server"

import { db } from "@/prisma"
import { ReporterStatus } from "@prisma/client"
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
  strategy: z.enum(["exa-search", "hn-best-stories"]),
  status: z.nativeEnum(ReporterStatus).optional(),
  promptId: z.string().nullable().optional(),
  scheduleIds: z.array(z.string()).optional(),
  metadata: z
    .union([
      z.object({ query: z.string(), storyCount: z.number() }),
      z.object({ domain: z.string() }),
      z.object({ bestStoryCount: z.number() }),
    ])
    .optional(),
})

export async function upsertReporter({
  id,
  name,
  description,
  strategy,
  status,
  promptId,
  scheduleIds,
  metadata,
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
      metadata,
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
        metadata: validatedData.metadata,
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
      metadata,
    })

    return db.$transaction(async (tx) => {
      const reporter = await tx.reporter.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          strategy: validatedData.strategy || "exa-search",
          promptId: validatedData.promptId,
          creatorId: user.id,
          metadata: validatedData.metadata,
        },
      })

      if (validatedData.scheduleIds?.length) {
        await tx.scheduledReporter.createMany({
          data: validatedData.scheduleIds.map((scheduleId) => ({
            scheduleId,
            reporterId: reporter.id,
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

export async function getReporters() {
  const user = await getCurrentUser()
  return db.reporter.findMany({
    where: {
      creatorId: user.id,
      deletedAt: null,
    },
    include: {
      prompt: true,
      _count: {
        select: {
          issues: {
            where: {
              deletedAt: null,
            },
          },
          subscriptions: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getReporter(id: string) {
  const user = await getCurrentUser()
  const validatedId = z.string().min(1, "Reporter ID is required").parse(id)

  const reporter = await db.reporter.findUnique({
    where: { id: validatedId },
    include: {
      prompt: true,
      issues: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
        include: {
          stories: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
    },
  })

  if (!reporter || reporter.creatorId !== user.id) {
    notFound()
  }

  return reporter
}
