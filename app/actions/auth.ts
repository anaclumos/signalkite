"use server"

// Import required dependencies
import { db } from "@/prisma" // Database client
import { auth } from "@clerk/nextjs/server" // Clerk authentication
import { unauthorized } from "next/navigation" // Next.js unauthorized redirect

/**
 * Gets or creates the current user in the database
 * This function:
 * 1. Verifies authentication using Clerk
 * 2. Checks if user exists in our database
 * 3. Creates user record if it doesn't exist
 *
 * @throws {unauthorized} If no authenticated user is found
 * @returns {Promise<User>} The current user's database record
 */
export async function getCurrentUser() {
  // Get authenticated user ID from Clerk
  const { userId } = await auth()

  // If no authenticated user, throw unauthorized
  if (!userId) {
    unauthorized()
  }

  // Try to find existing user in database
  let dbUser = await db.user.findUnique({
    where: {
      authProviderUid: userId, // Match by Clerk user ID
    },
  })

  // If user doesn't exist, create new database record
  if (!dbUser) {
    dbUser = await db.user.create({
      data: {
        authProviderUid: userId, // Link to Clerk user ID
      },
    })
  }

  // Return user record
  return dbUser
}
