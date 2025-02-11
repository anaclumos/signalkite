import {
  createNotificationChannel,
  deleteNotificationChannel,
  getNotificationChannel,
  getNotificationChannels,
  updateNotificationChannel,
} from "@/app/actions/notification-channels"
import { db } from "@/prisma"
import { NotificationChannelType } from "@prisma/client"
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
    const channel = await createNotificationChannel({
      name: "My Email Channel",
      type: NotificationChannelType.EMAIL,
      settings: { email: "test@example.com" },
    })

    expect(channel).toHaveProperty("id")
    expect(channel.name).toBe("My Email Channel")
    expect(channel.type).toBe(NotificationChannelType.EMAIL)
    expect(channel.settings).toEqual({ email: "test@example.com" })
    expect(channel.userId).toBe(testUserId)
  })

  it("updates a notification channel", async () => {
    const channel = await db.notificationChannel.create({
      data: {
        name: "Temp Channel",
        type: NotificationChannelType.TEXT,
        settings: { phone: "+123456789" },
        userId: testUserId,
      },
    })

    const updated = await updateNotificationChannel({
      id: channel.id,
      name: "Updated Channel",
      settings: { phone: "+987654321" },
    })

    expect(updated.name).toBe("Updated Channel")
    expect(updated.settings).toMatchObject({ phone: "+987654321" })
  })

  it("deletes a notification channel (soft-delete)", async () => {
    const channel = await db.notificationChannel.create({
      data: {
        name: "Channel to delete",
        type: NotificationChannelType.EMAIL,
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
        type: NotificationChannelType.SLACK,
        settings: {},
        userId: testUserId,
      },
    })

    const ch2 = await db.notificationChannel.create({
      data: {
        name: "Channel B",
        type: NotificationChannelType.EMAIL,
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
        type: NotificationChannelType.EMAIL,
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
        type: NotificationChannelType.TEXT,
        settings: {},
        userId: otherUser.id,
      },
    })

    await expect(
      updateNotificationChannel({
        id: channel.id,
        name: "Should fail",
      }),
    ).rejects.toThrow()

    await db.notificationChannel.deleteMany({ where: { userId: otherUser.id } })
    await db.user.delete({ where: { id: otherUser.id } })
  })
})
