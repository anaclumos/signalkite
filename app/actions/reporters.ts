"use server"

// Import required dependencies
import { db } from "@/prisma"
import { ReporterStatus } from "@prisma/client"
import { notFound } from "next/navigation"
import { z } from "zod"
import { getCurrentUser } from "./auth"

// Zod schema for validating reporter creation/update data
const reporterUpsertSchema = z.object({
  id: z.string().optional(), // Optional for updates
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  description: z.string().optional(), // Optional reporter description
  strategy: z.enum(["exa-search", "hn-best-stories"]), // Content gathering strategy
  status: z.nativeEnum(ReporterStatus).optional(), // Reporter status (ACTIVE/PAUSED/ARCHIVED)
  promptId: z.string().nullable().optional(), // Optional AI prompt reference
  scheduleIds: z.array(z.string()).optional(), // Optional schedule assignments
  metadata: z // Strategy-specific configuration
    .union([
      z.object({ query: z.string(), storyCount: z.number() }), // For exa-search
      z.object({ domain: z.string() }), // For domain-specific search
      z.object({ bestStoryCount: z.number() }), // For HN best stories
    ])
    .optional(),
})

/**
 * Creates or updates a reporter
 * @param id - Reporter ID (optional, for updates)
 * @param name - Reporter name
 * @param description - Reporter description
 * @param strategy - Content gathering strategy
 * @param status - Reporter status
 * @param promptId - Associated prompt ID
 * @param scheduleIds - Associated schedule IDs
 * @param metadata - Strategy-specific configuration
 * @returns Created or updated reporter
 * @throws {notFound} If reporter doesn't exist or belong to user
 */
export async function upsertReporter({
  id,
  name,
  description,
  strategy,
  status,
  promptId,
  scheduleIds,
  metadata,
}: z.infer<typeof reporterUpsertSchema>) {
  const user = await getCurrentUser()

  if (id && id.length > 0) {
    // Update existing reporter
    const validatedData = reporterUpsertSchema.parse({
      id,
      name,
      description,
      strategy,
      status,
      promptId,
      metadata,
    })

    // Verify reporter exists and belongs to user
    const reporter = await db.reporter.findUnique({
      where: { id: validatedData.id },
    })

    if (!reporter || reporter.creatorId !== user.id) {
      notFound()
    }

    // Update reporter with validated data
    return db.reporter.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        strategy: validatedData.strategy,
        status: validatedData.status,
        promptId: validatedData.promptId,
        metadata: validatedData.metadata,
      },
    })
  } else {
    // Create new reporter
    const validatedData = reporterUpsertSchema.parse({
      name,
      description,
      strategy,
      promptId,
      scheduleIds,
      metadata,
    })

    // Create reporter and schedule associations in a transaction
    return db.$transaction(async (tx) => {
      // Create the reporter first
      const reporter = await tx.reporter.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          strategy: validatedData.strategy || "exa-search",
          promptId: validatedData.promptId,
          creatorId: user.id,
          metadata: validatedData.metadata,
        },
      })

      // Create schedule associations if provided
      if (validatedData.scheduleIds?.length) {
        await tx.scheduledReporter.createMany({
          data: validatedData.scheduleIds.map((scheduleId) => ({
            scheduleId,
            reporterId: reporter.id,
          })),
        })
      }

      return reporter
    })
  }
}

/**
 * Soft deletes a reporter and marks it as archived
 * @param id - Reporter ID to delete
 * @returns Updated reporter with deletedAt timestamp and ARCHIVED status
 * @throws {notFound} If reporter doesn't exist or belong to user
 */
export async function deleteReporter(id: string) {
  // Validate input
  const validatedId = z.string().min(1, "Reporter ID is required").parse(id)

  const user = await getCurrentUser()

  // Verify reporter exists and belongs to user
  const reporter = await db.reporter.findUnique({
    where: { id: validatedId },
  })

  if (!reporter || reporter.creatorId !== user.id) {
    notFound()
  }

  // Soft delete and archive the reporter
  return db.reporter.update({
    where: { id: validatedId },
    data: {
      deletedAt: new Date(),
      status: ReporterStatus.ARCHIVED,
    },
  })
}

/**
 * Retrieves all active reporters for current user
 * @returns Array of reporters ordered by creation date
 */
export async function getReporters() {
  const user = await getCurrentUser()
  return db.reporter.findMany({
    where: {
      creatorId: user.id,
      deletedAt: null, // Only return active reporters
    },
    orderBy: {
      createdAt: "desc", // Most recent first
    },
  })
}

/**
 * Retrieves a specific reporter with its relationships
 * @param id - Reporter ID to retrieve
 * @returns Reporter with prompt and recent issues/stories if found
 * @throws {notFound} If reporter doesn't exist or belong to user
 */
export async function getReporter(id: string) {
  const user = await getCurrentUser()
  const validatedId = z.string().min(1, "Reporter ID is required").parse(id)

  // Get reporter with related prompt and recent issues/stories
  const reporter = await db.reporter.findUnique({
    where: { id: validatedId },
    include: {
      prompt: true, // Include associated prompt
      issues: {
        where: {
          deletedAt: null, // Only active issues
        },
        orderBy: {
          createdAt: "desc", // Most recent first
        },
        take: 20, // Limit to 20 recent issues
        include: {
          stories: {
            where: {
              deletedAt: null, // Only active stories
            },
          },
        },
      },
    },
  })

  if (!reporter || reporter.creatorId !== user.id) {
    notFound()
  }

  return reporter
}
