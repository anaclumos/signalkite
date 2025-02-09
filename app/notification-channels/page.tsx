import { getNotificationChannels } from "@/app/actions/notification-channels"
import { NotificationChannelsTable } from "./table"

export default async function NotificationChannelsPage() {
  const channels = await getNotificationChannels()

  return <NotificationChannelsTable initialChannels={channels || []} />
}
