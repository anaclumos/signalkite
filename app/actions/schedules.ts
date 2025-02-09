import { db } from "@/prisma"
import { getCurrentUser } from "./auth"

export async function createSchedule({
  name,
  cron,
  reporterIds,
}: {
  name: string
  cron: string
  reporterIds?: string[]
}) {
  const user = await getCurrentUser()

  return db.$transaction(async (tx) => {
    const schedule = await tx.schedule.create({
      data: {
        name,
        cron,
        ownerId: user.id,
      },
    })

    if (reporterIds?.length) {
      await tx.scheduleReporter.createMany({
        data: reporterIds.map((reporterId) => ({
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
  reporterIds,
}: {
  id: string
  name?: string
  cron?: string
  paused?: boolean
  reporterIds?: string[]
}) {
  const user = await getCurrentUser()

  const schedule = await db.schedule.findUnique({
    where: { id },
    include: {
      ScheduleReporters: true,
    },
  })

  if (!schedule || schedule.ownerId !== user.id) {
    throw new Error("Unauthorized or schedule not found")
  }

  return db.$transaction(async (tx) => {
    // Update schedule details
    const updatedSchedule = await tx.schedule.update({
      where: { id },
      data: {
        name,
        cron,
        paused,
      },
    })

    // If reporterIds is provided, update reporter associations
    if (reporterIds) {
      // Delete existing associations
      await tx.scheduleReporter.deleteMany({
        where: {
          scheduleId: id,
        },
      })

      // Create new associations
      if (reporterIds.length > 0) {
        await tx.scheduleReporter.createMany({
          data: reporterIds.map((reporterId) => ({
            scheduleId: id,
            reporterId,
          })),
        })
      }
    }

    return updatedSchedule
  })
}

export async function deleteSchedule(id: string) {
  const user = await getCurrentUser()

  const schedule = await db.schedule.findUnique({
    where: { id },
  })

  if (!schedule || schedule.ownerId !== user.id) {
    throw new Error("Unauthorized or schedule not found")
  }

  return db.schedule.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}

export async function getSchedule(id: string) {
  const user = await getCurrentUser()

  const schedule = await db.schedule.findUnique({
    where: { id },
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
        take: 5,
      },
    },
  })

  if (!schedule || schedule.ownerId !== user.id) {
    throw new Error("Schedule not found or access denied")
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
