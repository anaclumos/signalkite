import { getNotificationChannel } from "@/app/actions/notification-channels"
import { NotificationChannelForm } from "@/app/notification-channels/form"
import { notFound } from "next/navigation"

export default async function NotificationChannelPage({
  params,
}: {
  params: Promise<{ channelId: string }>
}) {
  const { channelId } = await params
  const channel = await getNotificationChannel(channelId)

  if (!channel) {
    notFound()
  }

  return <NotificationChannelForm channel={channel} mode="edit" />
}
