import {
  deleteReporter,
  getReporter,
  upsertReporter,
} from "@/app/actions/reporters"
import { db } from "@/prisma"
import { ReporterStatus, ReporterStrategyType } from "@prisma/client"
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
const otherUid = "test-uid-" + Math.random()

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => ({
    userId: uniqueUid,
  }),
}))

describe("Reporter Actions", () => {
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
    await db.reporter.deleteMany({ where: { creatorId: testUserId } })
    await db.user.delete({ where: { id: testUserId } })
  })

  afterEach(async () => {
    await db.reporter.deleteMany({ where: { creatorId: testUserId } })
  })

  it("creates a reporter", async () => {
    const reporter = await upsertReporter({
      id: "",
      name: "My new reporter",
      description: "It fetches data from somewhere",
    })

    expect(reporter).toHaveProperty("id")
    expect(reporter.name).toBe("My new reporter")
    expect(reporter.strategy).toBe(ReporterStrategyType.EXA_SEARCH)
    expect(reporter.creatorId).toBe(testUserId)
  })

  it("creates a reporter with a prompt", async () => {
    const prompt = await db.prompt.create({
      data: {
        name: "Test Prompt",
        text: "Test prompt text",
        creatorId: testUserId,
      },
    })

    const reporter = await upsertReporter({
      id: "",
      name: "Reporter with prompt",
      promptId: prompt.id,
    })

    expect(reporter).toHaveProperty("id")
    expect(reporter.promptId).toBe(prompt.id)

    await db.prompt.delete({ where: { id: prompt.id } })
  })

  it("updates a reporter", async () => {
    const r = await db.reporter.create({
      data: {
        name: "Old name",
        creatorId: testUserId,
      },
    })

    const updated = await upsertReporter({
      id: r.id,
      name: "Updated name",
      status: ReporterStatus.PAUSED,
    })

    expect(updated.name).toBe("Updated name")
    expect(updated.status).toBe(ReporterStatus.PAUSED)
  })

  it("soft-deletes a reporter", async () => {
    const r = await db.reporter.create({
      data: {
        name: "To delete",
        creatorId: testUserId,
      },
    })

    const deleted = await deleteReporter(r.id)
    expect(deleted.deletedAt).toBeInstanceOf(Date)
    expect(deleted.status).toBe(ReporterStatus.ARCHIVED)
  })

  it("gets a reporter (and includes relations) if user is owner or not archived", async () => {
    const r = await db.reporter.create({
      data: {
        name: "Test Reporter",
        creatorId: testUserId,
      },
    })

    const found = await getReporter(r.id)
    expect(found).toBeDefined()
    expect(found.id).toBe(r.id)
    expect(Array.isArray(found.issues)).toBe(true)
  })

  it("throws if reporter is archived and user is not the creator", async () => {
    const otherUser = await db.user.create({
      data: {
        authProviderUid: otherUid,
      },
    })

    const r = await db.reporter.create({
      data: {
        name: "Other archived reporter",
        creatorId: otherUser.id,
        status: ReporterStatus.ARCHIVED,
      },
    })

    await expect(getReporter(r.id)).rejects.toThrow()

    await db.reporter.deleteMany({ where: { creatorId: otherUser.id } })
    await db.user.delete({ where: { id: otherUser.id } })
  })
})
