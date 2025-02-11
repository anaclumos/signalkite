import { db } from "@/prisma"
import { NotificationChannelType } from "@prisma/client"
import { Webhook } from "svix"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// Mock Prisma client
vi.mock("@/prisma", () => ({
  db: {
    notificationChannel: {
      upsert: vi.fn(),
    },
    user: {
      upsert: vi.fn(),
    },
  },
}))

// Mock Svix
vi.mock("svix", () => ({
  Webhook: vi.fn(() => ({
    verify: vi.fn(),
    key: "test_key",
    sign: vi.fn(),
    verifyTimestamp: vi.fn(),
  })),
}))

describe("Webhook Handler", () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...OLD_ENV, SIGNING_SECRET: "test_signing_secret" }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  it("should handle user.created event with email", async () => {
    // Mock Svix verify
    const mockWebhook = new Webhook("test_signing_secret")
    vi.mocked(mockWebhook.verify).mockReturnValue({
      type: "user.created",
      data: {
        id: "user_123",
        email_addresses: [
          {
            id: "email_123",
            email_address: "test@example.com",
          },
        ],
        phone_numbers: [],
        primary_email_address_id: "email_123",
      },
    })
    vi.mocked(Webhook).mockImplementation(() => mockWebhook)

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

    // Import and call the webhook handler
    const { POST } = await import("./route")
    const response = await POST(
      new Request("http://localhost:3000/api/webhooks", {
        method: "POST",
        headers: {
          "svix-id": "msg_123",
          "svix-timestamp": "1234567890",
          "svix-signature": "test_signature",
        },
        body: JSON.stringify({
          type: "user.created",
          data: {
            id: "user_123",
            email_addresses: [
              {
                id: "email_123",
                email_address: "test@example.com",
              },
            ],
            phone_numbers: [],
            primary_email_address_id: "email_123",
          },
        }),
      }),
    )

    // Verify response
    expect(response.status).toBe(200)
    expect(await response.text()).toBe("Webhook processed")

    // Verify Svix was initialized with signing secret
    expect(Webhook).toHaveBeenCalledWith("test_signing_secret")

    // Verify user was created
    expect(db.user.upsert).toHaveBeenCalledWith({
      where: { authProviderUid: "user_123" },
      create: {
        authProviderUid: "user_123",
      },
      update: {},
    })

    // Verify notification channel was created
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

  it("should handle user.updated event with phone", async () => {
    // Mock Svix verify
    const mockWebhook = new Webhook("test_signing_secret")
    vi.mocked(mockWebhook.verify).mockReturnValue({
      type: "user.updated",
      data: {
        id: "user_123",
        email_addresses: [],
        phone_numbers: [
          {
            id: "phone_123",
            phone_number: "+1234567890",
          },
        ],
        primary_phone_number_id: "phone_123",
      },
    })
    vi.mocked(Webhook).mockImplementation(() => mockWebhook)

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
      name: "TEXT - +1234567890",
      type: NotificationChannelType.TEXT,
      settings: { phone: "+1234567890" },
      clerkId: "phone_123",
      userId: "db_user_123",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })

    // Import and call the webhook handler
    const { POST } = await import("./route")
    const response = await POST(
      new Request("http://localhost:3000/api/webhooks", {
        method: "POST",
        headers: {
          "svix-id": "msg_123",
          "svix-timestamp": "1234567890",
          "svix-signature": "test_signature",
        },
        body: JSON.stringify({
          type: "user.updated",
          data: {
            id: "user_123",
            email_addresses: [],
            phone_numbers: [
              {
                id: "phone_123",
                phone_number: "+1234567890",
              },
            ],
            primary_phone_number_id: "phone_123",
          },
        }),
      }),
    )

    // Verify response
    expect(response.status).toBe(200)
    expect(await response.text()).toBe("Webhook processed")

    // Verify user was updated
    expect(db.user.upsert).toHaveBeenCalledWith({
      where: { authProviderUid: "user_123" },
      create: {
        authProviderUid: "user_123",
      },
      update: {},
    })

    // Verify notification channel was created
    expect(db.notificationChannel.upsert).toHaveBeenCalledWith({
      where: { clerkId: "phone_123" },
      create: {
        name: "TEXT - +1234567890",
        type: "TEXT",
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

  it("should handle missing Svix headers", async () => {
    const { POST } = await import("./route")
    const response = await POST(
      new Request("http://localhost:3000/api/webhooks", {
        method: "POST",
        body: JSON.stringify({}),
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe("Error: Missing Svix headers")
  })

  it("should handle invalid webhook signature", async () => {
    // Mock Svix verify to throw
    const mockWebhook = new Webhook("test_signing_secret")
    vi.mocked(mockWebhook.verify).mockImplementation(() => {
      throw new Error("Invalid signature")
    })
    vi.mocked(Webhook).mockImplementation(() => mockWebhook)

    const { POST } = await import("./route")
    const response = await POST(
      new Request("http://localhost:3000/api/webhooks", {
        method: "POST",
        headers: {
          "svix-id": "msg_123",
          "svix-timestamp": "1234567890",
          "svix-signature": "invalid_signature",
        },
        body: JSON.stringify({}),
      }),
    )

    expect(response.status).toBe(400)
    expect(await response.text()).toBe("Error: Verification error")
  })
})
