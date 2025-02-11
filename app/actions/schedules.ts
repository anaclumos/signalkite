"use server"

import { db } from "@/prisma"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

const scheduleUpsertSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  cron: z
    .string()
    .min(1, "Cron expression is required")
    .max(100, "Cron expression must be 100 characters or less"),
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
    // Validate input for update
    const validatedData = scheduleUpsertSchema.parse({
      id,
      name,
      cron,
      timezone,
      paused,
      reporterIds,
    })

    const schedule = await db.schedule.findUnique({
      where: { id: validatedData.id },
      include: {
        ScheduleReporters: true,
      },
    })

    if (!schedule || schedule.ownerId !== user.id) {
      notFound()
    }

    return db.$transaction(async (tx) => {
      const updatedSchedule = await tx.schedule.update({
        where: { id: validatedData.id },
        data: {
          name: validatedData.name,
          cron: validatedData.cron,
          timezone: validatedData.timezone,
          paused: validatedData.paused,
        },
      })

      if (validatedData.reporterIds) {
        await tx.scheduleReporter.deleteMany({
          where: { scheduleId: validatedData.id },
        })
        if (validatedData.reporterIds.length > 0) {
          await tx.scheduleReporter.createMany({
            data: validatedData.reporterIds.map((reporterId) => ({
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

    return db.$transaction(async (tx) => {
      const schedule = await tx.schedule.create({
        data: {
          name: validatedData.name,
          cron: validatedData.cron,
          timezone: validatedData.timezone,
          ownerId: user.id,
        },
      })

      if (validatedData.reporterIds?.length) {
        await tx.scheduleReporter.createMany({
          data: validatedData.reporterIds.map((reporterId) => ({
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
  // Validate input
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

async function _getSchedule(id: string, userId: string) {
  "use cache"
  const validatedId = z.string().min(1, "Schedule ID is required").parse(id)

  const schedule = await db.schedule.findUnique({
    where: { id: validatedId },
    include: {
      ScheduleReporters: {
        include: {
          reporter: true,
        },
      },
      Runs: {
        where: {
          completedAt: {
            not: null,
          },
        },
        orderBy: {
          startedAt: "desc",
        },
      },
    },
  })

  if (!schedule || schedule.ownerId !== userId) {
    notFound()
  }

  return schedule
}

export async function getSchedule(id: string) {
  const user = await getCurrentUser()
  return _getSchedule(id, user.id)
}

async function _getSchedules(userId: string) {
  "use cache"
  return db.schedule.findMany({
    where: {
      ownerId: userId,
      deletedAt: null,
    },
    include: {
      ScheduleReporters: {
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

export async function getSchedules() {
  const user = await getCurrentUser()
  return _getSchedules(user.id)
}
