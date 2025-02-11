import { db } from "@/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NotificationChannelType } from "@prisma/client"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { NotificationChannelWithRelations } from "./types"

// Mock Clerk's currentUser
vi.mock("@clerk/nextjs/server", () => ({
  currentUser: vi.fn(),
}))

// Mock Prisma client
vi.mock("@/prisma", () => ({
  db: {
    notificationChannel: {
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
    user: {
      upsert: vi.fn(),
    },
  },
}))

describe("NotificationChannelsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should sync email notification channel from Clerk", async () => {
    // Create a partial mock of the User type with only the properties we need
    const mockUser = {
      id: "user_123",
      emailAddresses: [
        {
          id: "email_123",
          emailAddress: "test@example.com",
        },
      ],
      phoneNumbers: [],
      primaryEmailAddressId: "email_123",
    }

    // Mock currentUser to return our test user
    vi.mocked(currentUser).mockResolvedValue(mockUser as any)

    // Mock successful user upsert
    vi.mocked(db.user.upsert).mockResolvedValue({
      id: "db_user_123",
      authProviderUid: "user_123",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      lastLogin: null,
    })

    // Mock successful channel upsert
    vi.mocked(db.notificationChannel.upsert).mockResolvedValue({
      id: "channel_123",
      name: "Email - test@example.com",
      type: NotificationChannelType.EMAIL,
      settings: { email: "test@example.com" },
      clerkId: "email_123",
      userId: "db_user_123",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })

    // Mock findMany to return the created channel
    vi.mocked(db.notificationChannel.findMany).mockResolvedValue([
      {
        id: "channel_123",
        name: "Email - test@example.com",
        type: NotificationChannelType.EMAIL,
        settings: { email: "test@example.com" },
        clerkId: "email_123",
        userId: "db_user_123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        Subscription: [],
      } as NotificationChannelWithRelations,
    ])

    // Import and render the page
    const { default: NotificationChannelsPage } = await import("./page")
    await NotificationChannelsPage()

    // Verify user was created/updated
    expect(db.user.upsert).toHaveBeenCalledWith({
      where: { authProviderUid: "user_123" },
      create: {
        authProviderUid: "user_123",
      },
      update: {},
    })

    // Verify channel was created/updated
    expect(db.notificationChannel.upsert).toHaveBeenCalledWith({
      where: { clerkId: "email_123" },
      create: {
        name: "Email - test@example.com",
        type: "EMAIL",
        settings: { email: "test@example.com" },
        clerkId: "email_123",
        user: {
          connect: {
            authProviderUid: "user_123",
          },
        },
      },
      update: {
        settings: { email: "test@example.com" },
      },
    })
  })

  it("should sync SMS notification channel from Clerk", async () => {
    // Create a partial mock of the User type with only the properties we need
    const mockUser = {
      id: "user_123",
      emailAddresses: [],
      phoneNumbers: [
        {
          id: "phone_123",
          phoneNumber: "+1234567890",
        },
      ],
      primaryPhoneNumberId: "phone_123",
    }

    // Mock currentUser to return our test user
    vi.mocked(currentUser).mockResolvedValue(mockUser as any)

    // Mock successful user upsert
    vi.mocked(db.user.upsert).mockResolvedValue({
      id: "db_user_123",
      authProviderUid: "user_123",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      lastLogin: null,
    })

    // Mock successful channel upsert
    vi.mocked(db.notificationChannel.upsert).mockResolvedValue({
      id: "channel_456",
      name: "SMS - +1234567890",
      type: NotificationChannelType.SMS,
      settings: { phone: "+1234567890" },
      clerkId: "phone_123",
      userId: "db_user_123",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })

    // Mock findMany to return the created channel
    vi.mocked(db.notificationChannel.findMany).mockResolvedValue([
      {
        id: "channel_456",
        name: "SMS - +1234567890",
        type: NotificationChannelType.SMS,
        settings: { phone: "+1234567890" },
        clerkId: "phone_123",
        userId: "db_user_123",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        Subscription: [],
      } as NotificationChannelWithRelations,
    ])

    // Import and render the page
    const { default: NotificationChannelsPage } = await import("./page")
    await NotificationChannelsPage()

    // Verify user was created/updated
    expect(db.user.upsert).toHaveBeenCalledWith({
      where: { authProviderUid: "user_123" },
      create: {
        authProviderUid: "user_123",
      },
      update: {},
    })

    // Verify channel was created/updated
    expect(db.notificationChannel.upsert).toHaveBeenCalledWith({
      where: { clerkId: "phone_123" },
      create: {
        name: "SMS - +1234567890",
        type: "SMS",
        settings: { phone: "+1234567890" },
        clerkId: "phone_123",
        user: {
          connect: {
            authProviderUid: "user_123",
          },
        },
      },
      update: {
        settings: { phone: "+1234567890" },
      },
    })
  })

  it("should handle user not found", async () => {
    // Mock currentUser to return null
    vi.mocked(currentUser).mockResolvedValue(null)

    // Import and render the page
    const { default: NotificationChannelsPage } = await import("./page")
    const result = await NotificationChannelsPage()

    // Verify the page returns null when no user is found
    expect(result).toBeNull()
    expect(db.user.upsert).not.toHaveBeenCalled()
    expect(db.notificationChannel.upsert).not.toHaveBeenCalled()
    expect(db.notificationChannel.findMany).not.toHaveBeenCalled()
  })
})
