import { db } from "@/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NotificationChannelsTable } from "./table"

export default async function NotificationChannelsPage() {
  const user = await currentUser()

  if (!user) {
    return null
  }

  const channels = await db.notificationChannel.findMany({
    where: {
      user: {
        authProviderUid: user.id,
      },
      deletedAt: null,
    },
    include: {
      subscriptions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return <NotificationChannelsTable initialChannels={channels} />
}
