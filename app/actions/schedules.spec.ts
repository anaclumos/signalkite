import {
  deleteSchedule,
  getSchedule,
  getSchedules,
  upsertSchedule,
} from "@/app/actions/schedules"
import { buildCron } from "@/lib/cron"
import { db } from "@/prisma"
import { parseExpression } from "cron-parser"
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest"

const uniqueUid = "test-uid-" + Math.random()

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => ({
    userId: uniqueUid,
  }),
}))

describe("Schedule Actions", () => {
  let testUserId: string

  beforeAll(async () => {
    const user = await db.user.create({
      data: {
        authProviderUid: uniqueUid,
      },
    })
    testUserId = user.id
  })

  afterAll(async () => {
    await db.scheduledReporter.deleteMany({
      where: {
        schedule: {
          ownerId: testUserId,
        },
      },
    })
    await db.schedule.deleteMany({ where: { ownerId: testUserId } })
    await db.reporter.deleteMany({ where: { creatorId: testUserId } })
    await db.prompt.deleteMany({ where: { creatorId: testUserId } })
    await db.user.delete({ where: { authProviderUid: uniqueUid } })
  })

  afterEach(async () => {
    await db.scheduledReporter.deleteMany({
      where: {
        schedule: {
          ownerId: testUserId,
        },
      },
    })
    await db.schedule.deleteMany({ where: { ownerId: testUserId } })
    await db.reporter.deleteMany({ where: { creatorId: testUserId } })
  })

  it("creates a schedule with reporter associations", async () => {
    const reporter1 = await db.reporter.create({
      data: { name: "Rep1", creatorId: testUserId },
    })
    const reporter2 = await db.reporter.create({
      data: { name: "Rep2", creatorId: testUserId },
    })

    const schedule = await upsertSchedule({
      id: "",
      name: "Midnight schedule",
      cron: "0 0 * * *",
      reporterIds: [reporter1.id, reporter2.id],
      timezone: "America/New_York",
    })

    expect(schedule).toHaveProperty("id")
    const sr = await db.scheduledReporter.findMany({
      where: { scheduleId: schedule.id },
    })
    expect(sr.length).toBe(2)

    const interval = parseExpression(schedule.cron, {
      tz: schedule.timezone,
    })
    const nextRunAt = interval.next().toDate()
    expect(schedule.nextRunAt).toStrictEqual(nextRunAt)
  })

  it("updates a schedule (including its reporter associations)", async () => {
    const reporter1 = await db.reporter.create({
      data: { name: "RepOne", creatorId: testUserId },
    })
    const reporter2 = await db.reporter.create({
      data: { name: "RepTwo", creatorId: testUserId },
    })

    const schedule = await db.schedule.create({
      data: {
        name: "My schedule",
        cron: "0 * * * *",
        timezone: "America/New_York",
        ownerId: testUserId,
        scheduledReporters: {
          create: [{ reporterId: reporter1.id }],
        },
      },
    })

    const updated = await upsertSchedule({
      id: schedule.id,
      name: "Updated schedule",
      cron: "0 * * * *",
      timezone: "America/New_York",
      reporterIds: [reporter2.id],
    })

    expect(updated.name).toBe("Updated schedule")

    const sr = await db.scheduledReporter.findMany({
      where: { scheduleId: schedule.id },
    })
    expect(sr.length).toBe(1)
    expect(sr[0].reporterId).toBe(reporter2.id)
  })

  it("soft-deletes a schedule", async () => {
    const schedule = await db.schedule.create({
      data: {
        name: "Delete me",
        cron: "* * * * *",
        timezone: "America/New_York",
        ownerId: testUserId,
      },
    })

    const deleted = await deleteSchedule(schedule.id)
    expect(deleted.deletedAt).toBeInstanceOf(Date)
  })

  it("gets a single schedule (with related reporters & runs)", async () => {
    const schedule = await db.schedule.create({
      data: {
        name: "Test schedule",
        cron: "* * * * *",
        timezone: "America/New_York",
        ownerId: testUserId,
      },
    })

    const found = await getSchedule(schedule.id)
    expect(found).toBeDefined()
    expect(found.id).toBe(schedule.id)
    expect(Array.isArray(found.scheduledReporters)).toBe(true)
    expect(Array.isArray(found.runs)).toBe(true)
  })

  it("generates correct cron string with all days selected", () => {
    const minute = [0]
    const hour = [9]
    const day = [1, 2, 3, 4, 5, 6, 0]
    const cron = buildCron({ minute, hour, day })
    expect(cron).toBe("0 9 * * *")
  })

  it("gets schedules for a user (excluding deleted)", async () => {
    const s1 = await db.schedule.create({
      data: {
        name: "Sched 1",
        timezone: "America/New_York",
        cron: "* * * * *",
        ownerId: testUserId,
      },
    })
    const s2 = await db.schedule.create({
      data: {
        name: "Sched 2",
        timezone: "America/New_York",
        cron: "* * * * *",
        ownerId: testUserId,
      },
    })

    await db.schedule.update({
      where: { id: s1.id },
      data: { deletedAt: new Date() },
    })

    const all = await getSchedules()
    expect(all.length).toBe(1)
    expect(all[0].id).toBe(s2.id)
  })

  // Additional test to verify nextRunAt gets updated when the schedule is updated
  it("updates nextRunAt when schedule cron is changed", async () => {
    const schedule = await db.schedule.create({
      data: {
        name: "Test nextRunAt",
        cron: "0 12 * * *",
        timezone: "America/New_York",
        ownerId: testUserId,
      },
    })

    // Store the current nextRunAt to compare
    const originalSchedule = await db.schedule.findUnique({
      where: { id: schedule.id },
    })
    expect(originalSchedule?.nextRunAt).toBeDefined()

    // Update to a new cron expression
    const updated = await upsertSchedule({
      id: schedule.id,
      name: "Updated for nextRunAt",
      cron: "30 13 * * *", // changed the time
      timezone: "America/Los_Angeles", // changed the timezone
    })

    expect(updated.nextRunAt).toBeDefined()
    expect(updated.nextRunAt).not.toBe(originalSchedule?.nextRunAt)
  })
})
