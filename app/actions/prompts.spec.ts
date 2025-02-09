import { db } from "@/prisma"
import { describe, expect, it, vi } from "vitest"
import { getCurrentUser } from "./auth"
import { deletePrompt, getPrompt } from "./prompts"

vi.mock("@/prisma", () => ({
  db: {
    prompt: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock("./auth", () => ({
  getCurrentUser: vi.fn(),
}))

describe("getPrompt", () => {
  it("should return prompt with relations", async () => {
    const mockUser = {
      id: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      authProviderUid: "auth-1",
      lastLogin: new Date(),
    }
    const mockPrompt = {
      id: "prompt-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      creatorId: "user-1",
      description: "Test Prompt",
      text: "Test text",
      Reporters: [],
      Stories: [],
    }

    vi.mocked(getCurrentUser).mockResolvedValue(mockUser)
    vi.mocked(db.prompt.findUnique).mockResolvedValue(mockPrompt)

    const result = await getPrompt("prompt-1")

    expect(result).toEqual(mockPrompt)
    expect(db.prompt.findUnique).toHaveBeenCalledWith({
      where: { id: "prompt-1", creatorId: "user-1" },
      include: {
        Reporters: true,
        Stories: true,
      },
    })
  })

  it("should throw notFound for non-existent prompt", async () => {
    const mockUser = {
      id: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      authProviderUid: "auth-1",
      lastLogin: new Date(),
    }

    vi.mocked(getCurrentUser).mockResolvedValue(mockUser)
    vi.mocked(db.prompt.findUnique).mockResolvedValue(null)

    await expect(getPrompt("non-existent")).rejects.toThrow()
  })

  it("should return null for prompt owned by different user", async () => {
    const mockUser = {
      id: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      authProviderUid: "auth-1",
      lastLogin: new Date(),
    }
    const mockPrompt = {
      id: "prompt-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      creatorId: "different-user",
      description: "Test Prompt",
      text: "Test text",
      Reporters: [],
      Stories: [],
    }

    vi.mocked(getCurrentUser).mockResolvedValue(mockUser)
    vi.mocked(db.prompt.findUnique).mockResolvedValue(mockPrompt)

    await expect(getPrompt("prompt-1")).rejects.toThrow()
  })
})

describe("deletePrompt", () => {
  it("should soft delete prompt", async () => {
    const mockUser = {
      id: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      authProviderUid: "auth-1",
      lastLogin: new Date(),
    }
    const mockPrompt = {
      id: "prompt-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      creatorId: "user-1",
      description: "Test Prompt",
      text: "Test text",
    }

    vi.mocked(getCurrentUser).mockResolvedValue(mockUser)
    vi.mocked(db.prompt.findUnique).mockResolvedValue(mockPrompt)
    vi.mocked(db.prompt.update).mockResolvedValue({
      ...mockPrompt,
      deletedAt: new Date(),
    })

    await deletePrompt("prompt-1")

    expect(db.prompt.update).toHaveBeenCalledWith({
      where: { id: "prompt-1" },
      data: {
        deletedAt: expect.any(Date),
      },
    })
  })

  it("should throw notFound for non-existent prompt", async () => {
    const mockUser = {
      id: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      authProviderUid: "auth-1",
      lastLogin: new Date(),
    }

    vi.mocked(getCurrentUser).mockResolvedValue(mockUser)
    vi.mocked(db.prompt.findUnique).mockResolvedValue(null)

    await expect(deletePrompt("non-existent")).rejects.toThrow()
  })

  it("should throw notFound for prompt owned by different user", async () => {
    const mockUser = {
      id: "user-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      authProviderUid: "auth-1",
      lastLogin: new Date(),
    }
    const mockPrompt = {
      id: "prompt-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      creatorId: "different-user",
      description: "Test Prompt",
      text: "Test text",
    }

    vi.mocked(getCurrentUser).mockResolvedValue(mockUser)
    vi.mocked(db.prompt.findUnique).mockResolvedValue(mockPrompt)

    await expect(deletePrompt("prompt-1")).rejects.toThrow()
  })
})
