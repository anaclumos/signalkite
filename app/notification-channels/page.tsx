import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { db } from "@/prisma"
import { UserProfile } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { NotificationChannelsTable } from "./table"
import { NotificationChannelWithRelations } from "./types"

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
        type: "SMS",
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
  const channels = (await db.notificationChannel.findMany({
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
  })) as NotificationChannelWithRelations[]

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notification Channels</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Edit Email & Phone</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl p-0 sm:p-0">
            <UserProfile />
          </DialogContent>
        </Dialog>
      </div>
      <div className="mb-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
        <p>
          Notification channels are automatically synced with your Clerk
          profile. Click the &quot;Edit Email & Phone&quot; button to manage
          your email and phone settings.
        </p>
      </div>
      <NotificationChannelsTable initialChannels={channels} />
    </div>
  )
}
