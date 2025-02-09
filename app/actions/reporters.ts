"use server"

import { db } from "@/prisma"
import { ReporterStatus, ReporterStrategyType } from "@prisma/client"
import { getCurrentUser } from "./auth"

export async function createReporter({
  name,
  description,
  strategy,
  promptId,
}: {
  name: string
  description?: string
  strategy?: ReporterStrategyType
  promptId?: string
}) {
  const user = await getCurrentUser()

  return db.reporter.create({
    data: {
      name,
      description,
      strategy: strategy || ReporterStrategyType.EXA_SEARCH,
      creatorId: user.id,
      promptId,
    },
  })
}

export async function updateReporter({
  id,
  name,
  description,
  strategy,
  status,
  promptId,
}: {
  id: string
  name?: string
  description?: string
  strategy?: ReporterStrategyType
  status?: ReporterStatus
  promptId?: string | null
}) {
  const user = await getCurrentUser()

  const reporter = await db.reporter.findUnique({
    where: { id },
  })

  if (!reporter || reporter.creatorId !== user.id) {
    throw new Error("Unauthorized or reporter not found")
  }

  return db.reporter.update({
    where: { id },
    data: {
      name,
      description,
      strategy,
      status,
      promptId,
    },
  })
}

export async function deleteReporter(id: string) {
  const user = await getCurrentUser()

  const reporter = await db.reporter.findUnique({
    where: { id },
  })

  if (!reporter || reporter.creatorId !== user.id) {
    throw new Error("Unauthorized or reporter not found")
  }

  return db.reporter.update({
    where: { id },
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
  const user = await getCurrentUser()

  const reporter = await db.reporter.findUnique({
    where: { id },
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
        take: 5,
      },
    },
  })

  if (
    !reporter ||
    (reporter.creatorId !== user.id &&
      reporter.status === ReporterStatus.ARCHIVED)
  ) {
    throw new Error("Reporter not found or access denied")
  }

  return reporter
}
