"use server"

import { db } from "@/prisma"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

const promptUpsertSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z.string().optional(),
  text: z.string().optional(),
})

const promptDeleteSchema = z.object({
  id: z.string(),
})

export async function upsertPrompt({
  id,
  name,
  description,
  text,
}: z.infer<typeof promptUpsertSchema>) {
  const user = await getCurrentUser()

  if (id && id.length > 0) {
    // Validate input for update
    const validatedData = promptUpsertSchema.parse({
      id,
      name,
      description,
      text,
    })

    const prompt = await db.prompt.findUnique({
      where: { id: validatedData.id },
    })

    if (!prompt || prompt.creatorId !== user.id) {
      notFound()
    }

    return db.prompt.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        text: validatedData.text,
      },
    })
  } else {
    // Validate input for create
    const validatedData = promptUpsertSchema.parse({ name, description, text })

    return db.prompt.create({
      data: {
        ...validatedData,
        creatorId: user.id,
      },
    })
  }
}

export async function deletePrompt(id: string) {
  // Validate input
  const validatedId = promptDeleteSchema.parse({ id })

  const user = await getCurrentUser()

  const prompt = await db.prompt.findUnique({
    where: { id: validatedId.id },
  })

  if (!prompt || prompt.creatorId !== user.id) {
    notFound()
  }

  return db.prompt.update({
    where: { id: validatedId.id },
    data: {
      deletedAt: new Date(),
    },
  })
}

async function _getPrompts(userId: string) {
  return db.prompt.findMany({
    where: { creatorId: userId, deletedAt: null },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getPrompts() {
  const user = await getCurrentUser()
  return _getPrompts(user.id)
}

async function _getPrompt(id: string, userId: string) {
  const prompt = await db.prompt.findUnique({
    where: { id: id, creatorId: userId },
    include: {
      Reporters: true,
      Stories: true,
    },
  })

  if (!prompt || prompt.creatorId !== userId) {
    notFound()
  }

  return prompt
}

export async function getPrompt(id: string) {
  const user = await getCurrentUser()
  return _getPrompt(id, user.id)
}
