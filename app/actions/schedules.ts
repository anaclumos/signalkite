"use server"

// Import required dependencies
import { db } from "@/prisma"
import { parseExpression } from "cron-parser"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

// Zod schema for validating schedule creation/update data
const scheduleUpsertSchema = z.object({
  id: z.string().optional(), // Optional for updates
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  cron: z.string().max(100, "Cron expression must be 100 characters or less"), // Cron timing expression
  timezone: z
    .string()
    .min(1, "Timezone is required")
    .max(100, "Timezone must be 100 characters or less"), // Schedule timezone
  paused: z.boolean().optional(), // Optional pause state
  reporterIds: z.array(z.string()).optional(), // Optional reporter assignments
})

/**
 * Creates or updates a schedule with reporter assignments
 * @param id - Schedule ID (optional, for updates)
 * @param name - Schedule name
 * @param cron - Cron expression for timing
 * @param timezone - Schedule timezone
 * @param paused - Whether schedule is paused
 * @param reporterIds - Associated reporter IDs
 * @returns Created or updated schedule
 * @throws {notFound} If schedule doesn't exist or belong to user
 */
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
    // Update existing schedule
    const validatedData = scheduleUpsertSchema.parse({
      id,
      name,
      cron,
      timezone,
      paused,
      reporterIds,
    })

    // Calculate next run time based on cron expression
    const updateInterval = parseExpression(validatedData.cron, {
      tz: validatedData.timezone,
    })
    const updateNextRunAt = updateInterval.next().toDate()

    // Verify schedule exists and belongs to user
    const schedule = await db.schedule.findUnique({
      where: { id: validatedData.id },
      include: {
        scheduledReporters: true,
      },
    })

    if (!schedule || schedule.ownerId !== user.id) {
      notFound()
    }

    // Update schedule and reporter assignments in transaction
    return db.$transaction(async (tx: any) => {
      // Update schedule details
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

      // Update reporter assignments if provided
      if (validatedData.reporterIds) {
        // Remove existing assignments
        await tx.scheduledReporter.deleteMany({
          where: { scheduleId: validatedData.id },
        })
        // Create new assignments
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
    // Create new schedule
    const validatedData = scheduleUpsertSchema.parse({
      name,
      cron,
      timezone,
      reporterIds,
    })

    // Calculate initial next run time
    const interval = parseExpression(validatedData.cron, {
      tz: validatedData.timezone,
    })
    const nextRunAt = interval.next().toDate()

    // Create schedule and reporter assignments in transaction
    return db.$transaction(async (tx: any) => {
      // Create schedule
      const schedule = await tx.schedule.create({
        data: {
          name: validatedData.name,
          cron: validatedData.cron,
          timezone: validatedData.timezone,
          ownerId: user.id,
          nextRunAt,
        },
      })

      // Create reporter assignments if provided
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

/**
 * Soft deletes a schedule
 * @param id - Schedule ID to delete
 * @returns Updated schedule with deletedAt timestamp
 * @throws {notFound} If schedule doesn't exist or belong to user
 */
export async function deleteSchedule(id: string) {
  const validatedId = z.string().min(1, "Schedule ID is required").parse(id)
  const user = await getCurrentUser()

  // Verify schedule exists and belongs to user
  const schedule = await db.schedule.findUnique({
    where: { id: validatedId },
  })

  if (!schedule || schedule.ownerId !== user.id) {
    notFound()
  }

  // Soft delete by setting deletedAt timestamp
  return db.schedule.update({
    where: { id: validatedId },
    data: {
      deletedAt: new Date(),
    },
  })
}

/**
 * Retrieves a specific schedule with its reporter assignments
 * @param id - Schedule ID to retrieve
 * @returns Schedule with scheduled reporters if found
 * @throws {notFound} If schedule doesn't exist or belong to user
 */
export async function getSchedule(id: string) {
  const user = await getCurrentUser()
  const validatedId = z.string().min(1, "Schedule ID is required").parse(id)

  // Get schedule with reporter relationships
  const schedule = await db.schedule.findUnique({
    where: { id: validatedId },
    include: {
      scheduledReporters: {
        include: {
          reporter: true, // Include full reporter details
        },
      },
    },
  })

  if (!schedule || schedule.ownerId !== user.id) {
    notFound()
  }

  return schedule
}

/**
 * Retrieves all active schedules for current user
 * @returns Array of schedules with reporter assignments
 */
export async function getSchedules() {
  const user = await getCurrentUser()
  return db.schedule.findMany({
    where: {
      ownerId: user.id,
      deletedAt: null, // Only return active schedules
    },
    include: {
      scheduledReporters: {
        include: {
          reporter: true, // Include full reporter details
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Most recent first
    },
  })
}
