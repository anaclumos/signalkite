import {
  createSchedule,
  deleteSchedule,
  getSchedule,
  getSchedules,
  updateSchedule,
} from "@/app/actions/schedules"
import { db } from "@/prisma"
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
    await db.scheduleReporter.deleteMany({
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
    await db.scheduleReporter.deleteMany({
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

    const schedule = await createSchedule({
      name: "Midnight schedule",
      cron: "0 0 * * *",
      reporterIds: [reporter1.id, reporter2.id],
    })

    expect(schedule).toHaveProperty("id")
    const sr = await db.scheduleReporter.findMany({
      where: { scheduleId: schedule.id },
    })
    expect(sr.length).toBe(2)
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
        ownerId: testUserId,
        ScheduleReporters: {
          create: [{ reporterId: reporter1.id }],
        },
      },
    })

    const updated = await updateSchedule({
      id: schedule.id,
      name: "Updated schedule",
      reporterIds: [reporter2.id],
    })

    expect(updated.name).toBe("Updated schedule")

    const sr = await db.scheduleReporter.findMany({
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
        ownerId: testUserId,
      },
    })

    const found = await getSchedule(schedule.id)
    expect(found).toBeDefined()
    expect(found.id).toBe(schedule.id)
    expect(Array.isArray(found.ScheduleReporters)).toBe(true)
    expect(Array.isArray(found.Runs)).toBe(true)
  })

  it("gets schedules for a user (excluding deleted)", async () => {
    const s1 = await db.schedule.create({
      data: {
        name: "Sched 1",
        cron: "* * * * *",
        ownerId: testUserId,
      },
    })
    const s2 = await db.schedule.create({
      data: {
        name: "Sched 2",
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
})
