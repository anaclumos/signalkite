import { db } from "@/prisma"
import { describe, expect, it, vi } from "vitest"
import { getCurrentUser } from "./auth"
import { deletePrompt, getPrompt, upsertPrompt } from "./prompts"

vi.mock("@/prisma", () => ({
  db: {
    prompt: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
  },
}))

vi.mock("./auth", () => ({
  getCurrentUser: vi.fn(),
}))

describe("upsertPrompt", () => {
  const mockUser = {
    id: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    authProviderUid: "auth-1",
    lastLogin: new Date(),
  }

  it("should create a new prompt when no id is provided", async () => {
    const mockPrompt = {
      id: "prompt-1",
      name: "New Prompt",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      creatorId: "user-1",
      description: "New Prompt",
      text: "New text",
    }

    vi.mocked(getCurrentUser).mockResolvedValue(mockUser)
    vi.mocked(db.prompt.create).mockResolvedValue(mockPrompt)

    const result = await upsertPrompt({
      name: "New Prompt",
      description: "New Prompt",
      text: "New text",
    })

    expect(result).toEqual(mockPrompt)
    expect(db.prompt.create).toHaveBeenCalledWith({
      data: {
        name: "New Prompt",
        description: "New Prompt",
        text: "New text",
        creatorId: "user-1",
      },
    })
  })

  it("should update an existing prompt when id is provided", async () => {
    const existingPrompt = {
      id: "prompt-1",
      name: "Old Prompt",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      creatorId: "user-1",
      description: "Old Prompt",
      text: "Old text",
    }

    const updatedPrompt = {
      ...existingPrompt,
      name: "Updated Prompt",
      description: "Updated Prompt",
      text: "Updated text",
    }

    vi.mocked(getCurrentUser).mockResolvedValue(mockUser)
    vi.mocked(db.prompt.findUnique).mockResolvedValue(existingPrompt)
    vi.mocked(db.prompt.update).mockResolvedValue(updatedPrompt)

    const result = await upsertPrompt({
      id: "prompt-1",
      name: "Updated Prompt",
      description: "Updated Prompt",
      text: "Updated text",
    })

    expect(result).toEqual(updatedPrompt)
    expect(db.prompt.update).toHaveBeenCalledWith({
      where: { id: "prompt-1" },
      data: {
        name: "Updated Prompt",
        description: "Updated Prompt",
        text: "Updated text",
      },
    })
  })

  it("should throw notFound when updating non-existent prompt", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(mockUser)
    vi.mocked(db.prompt.findUnique).mockResolvedValue(null)

    await expect(
      upsertPrompt({
        id: "non-existent",
        name: "Updated Prompt",
        description: "Updated Prompt",
        text: "Updated text",
      }),
    ).rejects.toThrow()
  })

  it("should throw notFound when updating prompt owned by different user", async () => {
    const existingPrompt = {
      id: "prompt-1",
      name: "Old Prompt",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      creatorId: "different-user",
      description: "Old Prompt",
      text: "Old text",
    }

    vi.mocked(getCurrentUser).mockResolvedValue(mockUser)
    vi.mocked(db.prompt.findUnique).mockResolvedValue(existingPrompt)

    await expect(
      upsertPrompt({
        id: "prompt-1",
        name: "Updated Prompt",
        description: "Updated Prompt",
        text: "Updated text",
      }),
    ).rejects.toThrow()
  })
})

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
      name: "Test Prompt",
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
      name: "Test Prompt",
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
      name: "Test Prompt",
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
      name: "Test Prompt",
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
