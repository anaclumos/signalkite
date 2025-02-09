import {
  createSubscription,
  deleteSubscription,
  getSubscriptions,
  updateSubscription,
} from "@/app/actions/subscriptions"
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

describe("Subscription Actions", () => {
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
    await db.subscription.deleteMany({ where: { userId: testUserId } })
    await db.notificationChannel.deleteMany({ where: { userId: testUserId } })
    await db.reporter.deleteMany({ where: { creatorId: testUserId } })
    await db.user.delete({ where: { authProviderUid: uniqueUid } })
  })

  afterEach(async () => {
    await db.subscription.deleteMany({ where: { userId: testUserId } })
    await db.notificationChannel.deleteMany({ where: { userId: testUserId } })
    await db.reporter.deleteMany({ where: { creatorId: testUserId } })
  })

  it("creates a subscription", async () => {
    const reporterOwner = await db.user.create({
      data: {
        authProviderUid: "owner-uid" + Math.random(),
      },
    })

    const reporter = await db.reporter.create({
      data: {
        name: "Subscribable Reporter",
        creatorId: reporterOwner.id,
      },
    })

    const subscription = await createSubscription({
      reporterId: reporter.id,
    })

    expect(subscription).toHaveProperty("id")
    expect(subscription.userId).toBe(testUserId)
    expect(subscription.reporterId).toBe(reporter.id)

    await db.subscription.deleteMany({ where: { reporterId: reporter.id } })
    await db.reporter.deleteMany({ where: { creatorId: reporterOwner.id } })
    await db.user.delete({ where: { id: reporterOwner.id } })
  })

  it("creates a subscription with a channel", async () => {
    const channel = await db.notificationChannel.create({
      data: {
        name: "Test Channel",
        type: "EMAIL",
        settings: {},
        userId: testUserId,
      },
    })

    const reporter = await db.reporter.create({
      data: {
        name: "Another Reporter",
        creatorId: testUserId,
      },
    })

    const subscription = await createSubscription({
      reporterId: reporter.id,
      notificationChannelId: channel.id,
    })

    expect(subscription.notificationChannelId).toBe(channel.id)
    expect(subscription.notificationChannel).toBeDefined()
    expect(subscription.notificationChannel?.name).toBe("Test Channel")
  })

  it("updates a subscription's notification channel", async () => {
    const reporter = await db.reporter.create({
      data: {
        name: "Reporter to subscribe",
        creatorId: testUserId,
      },
    })

    await createSubscription({ reporterId: reporter.id })

    const channel = await db.notificationChannel.create({
      data: {
        name: "New Channel",
        type: "EMAIL",
        settings: {},
        userId: testUserId,
      },
    })

    const updated = await updateSubscription({
      reporterId: reporter.id,
      notificationChannelId: channel.id,
    })

    expect(updated.notificationChannelId).toBe(channel.id)
    expect(updated.notificationChannel!.name).toBe("New Channel")
  })

  it("deletes a subscription", async () => {
    const reporter = await db.reporter.create({
      data: { name: "Reporter sub", creatorId: testUserId },
    })

    await createSubscription({ reporterId: reporter.id })
    const subsBefore = await getSubscriptions()
    expect(subsBefore.length).toBe(1)

    await deleteSubscription(reporter.id)
    const subsAfter = await getSubscriptions()
    expect(subsAfter.length).toBe(0)
  })

  it("throws if subscription not found on delete", async () => {
    await expect(deleteSubscription("non-existent-reporter")).rejects.toThrow()
  })
})
