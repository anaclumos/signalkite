"use server"

import { db } from "@/prisma"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

// Validation schemas
const scheduleIdSchema = z.string().min(1, "Schedule ID is required")

const scheduleInputSchema = z.object({
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
  reporterIds: z.array(z.string()).optional(),
})

const scheduleUpdateSchema = z.object({
  id: scheduleIdSchema,
  name: z.string().max(100, "Name must be 100 characters or less").optional(),
  cron: z
    .string()
    .max(100, "Cron expression must be 100 characters or less")
    .optional(),
  paused: z.boolean().optional(),
  timezone: z
    .string()
    .max(100, "Timezone must be 100 characters or less")
    .optional(),
  reporterIds: z.array(z.string()).optional(),
})

export async function createSchedule({
  name,
  cron,
  timezone,
  reporterIds,
}: z.infer<typeof scheduleInputSchema>) {
  const validatedData = scheduleInputSchema.parse({
    name,
    cron,
    timezone,
    reporterIds,
  })

  const user = await getCurrentUser()

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

export async function updateSchedule({
  id,
  name,
  cron,
  paused,
  timezone,
  reporterIds,
}: z.infer<typeof scheduleUpdateSchema>) {
  // Validate input
  const validatedData = scheduleUpdateSchema.parse({
    id,
    name,
    cron,
    paused,
    reporterIds,
  })

  const user = await getCurrentUser()

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
            scheduleId: validatedData.id,
            reporterId,
          })),
        })
      }
    }

    return updatedSchedule
  })
}

export async function deleteSchedule(id: string) {
  // Validate input
  const validatedId = scheduleIdSchema.parse(id)

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
  // Validate input
  const validatedId = scheduleIdSchema.parse(id)

  const user = await getCurrentUser()

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
