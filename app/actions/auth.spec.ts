import { getCurrentUser } from "@/app/actions/auth"
import { db } from "@/prisma"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => ({
    userId: "test-uid-123",
  }),
}))

const uniqueUid = "test-uid-123"

describe("getCurrentUser", () => {
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
    await db.user.delete({
      where: {
        authProviderUid: uniqueUid,
      },
    })
    vi.restoreAllMocks()
  })

  it("returns the user if userId is provided", async () => {
    const user = await getCurrentUser()
    expect(user).toBeDefined()
    expect(user?.authProviderUid).toBe(uniqueUid)
  })
})
