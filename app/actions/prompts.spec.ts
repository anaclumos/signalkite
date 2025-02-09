import { createPrompt, deletePrompt, updatePrompt } from "@/app/actions/prompts"
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
const otherUid = "test-uid-" + Math.random()

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => ({
    userId: uniqueUid,
  }),
}))

describe("Prompt Actions", () => {
  let testUserId: string
  let otherUserId: string

  beforeAll(async () => {
    const user = await db.user.create({
      data: {
        authProviderUid: uniqueUid,
      },
    })
    testUserId = user.id

    const otherUser = await db.user.create({
      data: {
        authProviderUid: otherUid,
      },
    })
    otherUserId = otherUser.id
  })

  afterAll(async () => {
    await db.prompt.deleteMany({ where: { creatorId: testUserId } })
    await db.prompt.deleteMany({ where: { creatorId: otherUserId } })
    await db.user.delete({ where: { id: testUserId } })
    await db.user.delete({ where: { id: otherUserId } })
    vi.restoreAllMocks()
  })

  afterEach(async () => {
    await db.prompt.deleteMany({
      where: { creatorId: testUserId },
    })
  })

  it("creates a prompt", async () => {
    const prompt = await createPrompt({
      description: "My test prompt",
      text: "Prompt content...",
    })
    expect(prompt).toHaveProperty("id")
    expect(prompt.creatorId).toBe(testUserId)
    expect(prompt.description).toBe("My test prompt")
    expect(prompt.text).toBe("Prompt content...")
  })

  it("updates a prompt", async () => {
    const existing = await db.prompt.create({
      data: {
        description: "Old desc",
        text: "Old text",
        creatorId: testUserId,
      },
    })

    const updated = await updatePrompt({
      id: existing.id,
      description: "New desc",
      text: "New text",
    })

    expect(updated.description).toBe("New desc")
    expect(updated.text).toBe("New text")
  })

  it("soft-deletes a prompt", async () => {
    const prompt = await db.prompt.create({
      data: {
        description: "Delete me",
        creatorId: testUserId,
      },
    })

    const deleted = await deletePrompt(prompt.id)
    expect(deleted.deletedAt).toBeInstanceOf(Date)
  })

  it("throws when updating a prompt from another user", async () => {
    const prompt = await db.prompt.create({
      data: {
        description: "Belongs to someone else",
        creatorId: otherUserId,
      },
    })

    await expect(
      updatePrompt({
        id: prompt.id,
        description: "Should fail",
      }),
    ).rejects.toThrow("Unauthorized or prompt not found")
  })
})
