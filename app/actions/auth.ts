"use server"

import { db } from "@/prisma"
import { auth } from "@clerk/nextjs/server"
import { unauthorized } from "next/navigation"

export async function getCurrentUser() {
  const { userId } = await auth()

  if (!userId) {
    unauthorized()
  }

  let dbUser = await db.user.findUnique({
    where: {
      authProviderUid: userId,
    },
  })

  if (!dbUser) {
    dbUser = await db.user.create({
      data: {
        authProviderUid: userId,
      },
    })
  }

  return dbUser
}
