"use cache"

import { db } from "@/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function OnboardingPage() {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    redirect("/")
  }

  const dbUser = await db.user.findUnique({
    where: {
      authProviderUid: userId,
    },
  })

  if (!dbUser) {
    await db.user.create({
      data: {
        authProviderUid: userId,
      },
    })
  }

  redirect("/dashboard")
}
