"use server"

import { db } from "@/prisma"
import { parseExpression } from "cron-parser"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

const scheduleUpsertSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  cron: z.string().max(100, "Cron expression must be 100 characters or less"),
  timezone: z
    .string()
    .min(1, "Timezone is required")
    .max(100, "Timezone must be 100 characters or less"),
  paused: z.boolean().optional(),
  reporterIds: z.array(z.string()).optional(),
})

export async function upsertSchedule({
  id,
  name,
  cron,
  timezone,
  paused,
  reporterIds,
}: z.infer<typeof scheduleUpsertSchema>) {
  const user = await getCurrentUser()

  if (id && id.length > 0) {
    const validatedData = scheduleUpsertSchema.parse({
      id,
      name,
      cron,
      timezone,
      paused,
      reporterIds,
    })

    const updateInterval = parseExpression(validatedData.cron, {
      tz: validatedData.timezone,
    })
    const updateNextRunAt = updateInterval.next().toDate()

    const schedule = await db.schedule.findUnique({
      where: { id: validatedData.id },
      include: {
        scheduledReporters: true,
      },
    })

    if (!schedule || schedule.ownerId !== user.id) {
      notFound()
    }

    return db.$transaction(async (tx: any) => {
      const updatedSchedule = await tx.schedule.update({
        where: { id: validatedData.id },
        data: {
          name: validatedData.name,
          cron: validatedData.cron,
          timezone: validatedData.timezone,
          paused: validatedData.paused,
          nextRunAt: updateNextRunAt,
        },
      })

      if (validatedData.reporterIds) {
        await tx.scheduledReporter.deleteMany({
          where: { scheduleId: validatedData.id },
        })
        if (validatedData.reporterIds.length > 0) {
          await tx.scheduledReporter.createMany({
            data: validatedData.reporterIds.map((reporterId: string) => ({
              scheduleId: schedule.id,
              reporterId,
            })),
          })
        }
      }

      return updatedSchedule
    })
  } else {
    // Validate input for create
    const validatedData = scheduleUpsertSchema.parse({
      name,
      cron,
      timezone,
      reporterIds,
    })

    const interval = parseExpression(validatedData.cron, {
      tz: validatedData.timezone,
    })

    const nextRunAt = interval.next().toDate()

    return db.$transaction(async (tx: any) => {
      const schedule = await tx.schedule.create({
        data: {
          name: validatedData.name,
          cron: validatedData.cron,
          timezone: validatedData.timezone,
          ownerId: user.id,
          nextRunAt,
        },
      })

      if (validatedData.reporterIds?.length) {
        await tx.scheduledReporter.createMany({
          data: validatedData.reporterIds.map((reporterId: string) => ({
            scheduleId: schedule.id,
            reporterId,
          })),
        })
      }

      return schedule
    })
  }
}

export async function deleteSchedule(id: string) {
  const validatedId = z.string().min(1, "Schedule ID is required").parse(id)
  const user = await getCurrentUser()

  const schedule = await db.schedule.findUnique({
    where: { id: validatedId },
  })

  if (!schedule || schedule.ownerId !== user.id) {
    notFound()
  }

  return db.schedule.update({
    where: { id: validatedId },
    data: {
      deletedAt: new Date(),
    },
  })
}

export async function getSchedule(id: string) {
  const user = await getCurrentUser()
  const validatedId = z.string().min(1, "Schedule ID is required").parse(id)

  const schedule = await db.schedule.findUnique({
    where: { id: validatedId },
    include: {
      scheduledReporters: {
        include: {
          reporter: true,
        },
      },
    },
  })

  if (!schedule || schedule.ownerId !== user.id) {
    notFound()
  }

  return schedule
}

export async function getSchedules() {
  const user = await getCurrentUser()
  return db.schedule.findMany({
    where: {
      ownerId: user.id,
      deletedAt: null,
    },
    include: {
      scheduledReporters: {
        include: {
          reporter: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}
