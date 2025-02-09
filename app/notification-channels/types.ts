import { NotificationChannel, Subscription } from "@prisma/client"

export type NotificationChannelWithRelations = NotificationChannel & {
  Subscription?: Subscription[]
}
