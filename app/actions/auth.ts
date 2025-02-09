import { db } from "@/prisma/db"
import { auth } from "@clerk/nextjs/server"

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const user = await db.user.findUnique({
    where: {
      authProviderUid: userId,
    },
  })

  if (!user) {
    throw new Error("User not found")
  }

  return user
}
