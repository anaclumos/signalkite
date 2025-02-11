import { db } from "@/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { NotificationChannelsTable } from "./table"

export default async function NotificationChannelsPage() {
  const user = await currentUser()

  if (!user) {
    return null
  }

  // Ensure user exists in our database
  await db.user.upsert({
    where: { authProviderUid: user.id },
    create: {
      authProviderUid: user.id,
    },
    update: {},
  })

  const emails = user.emailAddresses.map((email) => ({
    id: email.id,
    email: email.emailAddress,
  }))
  const phones = user.phoneNumbers.map((phone) => ({
    id: phone.id,
    phone: phone.phoneNumber,
  }))

  emails.forEach(async (email) => {
    await db.notificationChannel.upsert({
      where: { clerkId: email.id },
      create: {
        name: `${email.email}`,
        type: "EMAIL",
        settings: { email: email.email },
        clerkId: email.id,
        user: {
          connect: {
            authProviderUid: user.id,
          },
        },
      },
      update: {
        settings: { email: email.email },
      },
    })
  })

  phones.forEach(async (phone) => {
    await db.notificationChannel.upsert({
      where: { clerkId: phone.id },
      create: {
        name: `${phone.phone}`,
        type: "TEXT",
        settings: { phone: phone.phone },
        clerkId: phone.id,
        user: {
          connect: {
            authProviderUid: user.id,
          },
        },
      },
      update: {
        settings: { phone: phone.phone },
      },
    })
  })

  // Get all channels for this user with relations
  const channels = await db.notificationChannel.findMany({
    where: {
      user: {
        authProviderUid: user.id,
      },
      deletedAt: null,
    },
    include: {
      Subscription: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return <NotificationChannelsTable initialChannels={channels} />
}
