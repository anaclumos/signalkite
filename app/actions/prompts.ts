"use server"

import { db } from "@/prisma"
import { z } from "zod"
import { getCurrentUser } from "./auth"

// Validation schemas
const promptIdSchema = z.string().min(1, "Prompt ID is required")

const promptInputSchema = z.object({
  description: z.string().optional(),
  text: z.string().optional(),
})

const promptUpdateSchema = z.object({
  id: promptIdSchema,
  description: z.string().optional(),
  text: z.string().optional(),
})

export async function createPrompt({
  description,
  text,
}: z.infer<typeof promptInputSchema>) {
  // Validate input
  const validatedData = promptInputSchema.parse({ description, text })

  const user = await getCurrentUser()

  return db.prompt.create({
    data: {
      ...validatedData,
      creatorId: user.id,
    },
  })
}

export async function updatePrompt({
  id,
  description,
  text,
}: z.infer<typeof promptUpdateSchema>) {
  // Validate input
  const validatedData = promptUpdateSchema.parse({ id, description, text })

  const user = await getCurrentUser()

  const prompt = await db.prompt.findUnique({
    where: { id: validatedData.id },
  })

  if (!prompt || prompt.creatorId !== user.id) {
    throw new Error("Unauthorized or prompt not found")
  }

  return db.prompt.update({
    where: { id: validatedData.id },
    data: {
      description: validatedData.description,
      text: validatedData.text,
    },
  })
}

export async function deletePrompt(id: string) {
  // Validate input
  const validatedId = promptIdSchema.parse(id)

  const user = await getCurrentUser()

  const prompt = await db.prompt.findUnique({
    where: { id: validatedId },
  })

  if (!prompt || prompt.creatorId !== user.id) {
    throw new Error("Unauthorized or prompt not found")
  }

  return db.prompt.update({
    where: { id: validatedId },
    data: {
      deletedAt: new Date(),
    },
  })
}
