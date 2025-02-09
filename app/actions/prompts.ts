import { db } from "@/prisma"
import { getCurrentUser } from "./auth"

export async function createPrompt({
  description,
  text,
}: {
  description?: string
  text?: string
}) {
  const user = await getCurrentUser()

  return db.prompt.create({
    data: {
      description,
      text,
      creatorId: user.id,
    },
  })
}

export async function updatePrompt({
  id,
  description,
  text,
}: {
  id: string
  description?: string
  text?: string
}) {
  const user = await getCurrentUser()

  const prompt = await db.prompt.findUnique({
    where: { id },
  })

  if (!prompt || prompt.creatorId !== user.id) {
    throw new Error("Unauthorized or prompt not found")
  }

  return db.prompt.update({
    where: { id },
    data: {
      description,
      text,
    },
  })
}

export async function deletePrompt(id: string) {
  const user = await getCurrentUser()

  const prompt = await db.prompt.findUnique({
    where: { id },
  })

  if (!prompt || prompt.creatorId !== user.id) {
    throw new Error("Unauthorized or prompt not found")
  }

  return db.prompt.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}
