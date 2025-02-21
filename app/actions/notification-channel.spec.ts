import {
  deleteNotificationChannel,
  getNotificationChannel,
  getNotificationChannels,
  upsertNotificationChannel,
} from "@/app/actions/notification-channels"
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

describe("Notification Channel Actions", () => {
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
    await db.notificationChannel.deleteMany({ where: { userId: testUserId } })
    await db.user.delete({ where: { id: testUserId } })
    vi.restoreAllMocks()
  })

  afterEach(async () => {
    await db.notificationChannel.deleteMany({
      where: { userId: testUserId },
    })
    vi.restoreAllMocks()
  })

  it("creates a notification channel", async () => {
    const channel = await upsertNotificationChannel({
      name: "My Email Channel",
      description: "My Email Channel",
      type: "EMAIL",
      settings: { email: "test@example.com" },
    })

    expect(channel).toHaveProperty("id")
    expect(channel.name).toBe("My Email Channel")
    expect(channel.type).toBe("EMAIL")
    expect(channel.settings).toEqual({ email: "test@example.com" })
    expect(channel.userId).toBe(testUserId)
  })

  it("updates a notification channel", async () => {
    const channel = await db.notificationChannel.create({
      data: {
        name: "Temp Channel",
        description: "Temp Channel",
        type: "EMAIL",
        settings: { email: "test@example.com" },
        userId: testUserId,
      },
    })

    const updated = await upsertNotificationChannel({
      id: channel.id,
      name: "Updated Channel",
      description: "Updated Channel",
      type: "EMAIL",
      settings: { email: "test@example.com" },
    })

    expect(updated.name).toBe("Updated Channel")
    expect(updated.settings).toMatchObject({ email: "test@example.com" })
  })

  it("deletes a notification channel (soft-delete)", async () => {
    const channel = await db.notificationChannel.create({
      data: {
        name: "Channel to delete",
        type: "EMAIL",
        settings: {},
        userId: testUserId,
      },
    })

    const deleted = await deleteNotificationChannel(channel.id)
    expect(deleted.deletedAt).toBeInstanceOf(Date)
  })

  it("gets notification channels (excluding soft-deleted)", async () => {
    const ch1 = await db.notificationChannel.create({
      data: {
        name: "Channel A",
        type: "SLACK",
        settings: {},
        userId: testUserId,
      },
    })

    await db.notificationChannel.create({
      data: {
        name: "Channel B",
        type: "EMAIL",
        settings: {},
        userId: testUserId,
      },
    })

    await deleteNotificationChannel(ch1.id)

    const channels = await getNotificationChannels()
    expect(channels.length).toBe(1)
    expect(channels[0].name).toBe("Channel B")
  })

  it("gets a single channel", async () => {
    const channel = await db.notificationChannel.create({
      data: {
        name: "Single Channel",
        type: "EMAIL",
        settings: { email: "hi@example.com" },
        userId: testUserId,
      },
    })

    const found = await getNotificationChannel(channel.id)
    expect(found).toBeDefined()
    expect(found.id).toBe(channel.id)
    expect(found.settings).toEqual({ email: "hi@example.com" })
  })

  it("throws when trying to update someone else's channel", async () => {
    const otherUser = await db.user.create({
      data: {
        authProviderUid: "not-the-same-user" + Math.random(),
      },
    })

    const channel = await db.notificationChannel.create({
      data: {
        name: "Other's channel",
        type: "EMAIL",
        settings: {},
        userId: otherUser.id,
      },
    })

    await expect(
      upsertNotificationChannel({
        id: channel.id,
        name: "Should fail",
        description: "Should fail",
        type: "EMAIL",
        settings: {},
      }),
    ).rejects.toThrow()

    await db.notificationChannel.deleteMany({ where: { userId: otherUser.id } })
    await db.user.delete({ where: { id: otherUser.id } })
  })
})
