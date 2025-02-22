"use server"

// Import required dependencies
import { db } from "@/prisma"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

// Zod schema for validating prompt creation/update data
const promptUpsertSchema = z.object({
  id: z.string().optional(), // Optional for updates
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z.string().optional(), // Optional prompt description
  text: z.string().optional(), // Optional prompt text content
})

// Zod schema for validating prompt deletion
const promptDeleteSchema = z.object({
  id: z.string(), // Required prompt ID
})

/**
 * Creates or updates a prompt
 * @param id - Prompt ID (optional, for updates)
 * @param name - Prompt name
 * @param description - Prompt description
 * @param text - Prompt text content
 * @returns Created or updated prompt
 * @throws {notFound} If prompt doesn't exist or belong to user
 */
export async function upsertPrompt({
  id,
  name,
  description,
  text,
}: z.infer<typeof promptUpsertSchema>) {
  const user = await getCurrentUser()

  if (id && id.length > 0) {
    // Update existing prompt
    const validatedData = promptUpsertSchema.parse({
      id,
      name,
      description,
      text,
    })

    // Verify prompt exists and belongs to user
    const prompt = await db.prompt.findUnique({
      where: { id: validatedData.id },
    })

    if (!prompt || prompt.creatorId !== user.id) {
      notFound()
    }

    // Update prompt with validated data
    return db.prompt.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        text: validatedData.text,
      },
    })
  } else {
    // Create new prompt
    const validatedData = promptUpsertSchema.parse({ name, description, text })

    // Create prompt with validated data
    return db.prompt.create({
      data: {
        ...validatedData,
        creatorId: user.id,
      },
    })
  }
}

/**
 * Soft deletes a prompt
 * @param id - Prompt ID to delete
 * @returns Updated prompt with deletedAt timestamp
 * @throws {notFound} If prompt doesn't exist or belong to user
 */
export async function deletePrompt(id: string) {
  // Validate input
  const validatedId = promptDeleteSchema.parse({ id })

  const user = await getCurrentUser()

  // Verify prompt exists and belongs to user
  const prompt = await db.prompt.findUnique({
    where: { id: validatedId.id },
  })

  if (!prompt || prompt.creatorId !== user.id) {
    notFound()
  }

  // Soft delete by setting deletedAt timestamp
  return db.prompt.update({
    where: { id: validatedId.id },
    data: {
      deletedAt: new Date(),
    },
  })
}

/**
 * Retrieves all active prompts for current user
 * @returns Array of prompts ordered by creation date
 */
export async function getPrompts() {
  const user = await getCurrentUser()
  return db.prompt.findMany({
    where: {
      creatorId: user.id,
      deletedAt: null, // Only return active prompts
    },
    orderBy: {
      createdAt: "desc", // Most recent first
    },
  })
}

/**
 * Retrieves a specific prompt with its relationships
 * @param id - Prompt ID to retrieve
 * @returns Prompt with reporters and stories if found
 * @throws {notFound} If prompt doesn't exist or belong to user
 */
export async function getPrompt(id: string) {
  const user = await getCurrentUser()

  // Get prompt with related reporters and stories
  const prompt = await db.prompt.findUnique({
    where: {
      id: id,
      creatorId: user.id,
    },
    include: {
      reporters: true, // Include associated reporters
      stories: true, // Include associated stories
    },
  })

  if (!prompt || prompt.creatorId !== user.id) {
    notFound()
  }

  return prompt
}
