"use client"

import { EntityTable } from "@/components/entity-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useClerk } from "@clerk/nextjs"
import { NotificationChannel } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { startCase } from "es-toolkit/string"
import parsePhoneNumber from "libphonenumber-js"
import { useMemo } from "react"

interface NotificationChannelsTableProps {
  initialChannels: NotificationChannel[]
}

export function NotificationChannelsTable({
  initialChannels,
}: NotificationChannelsTableProps) {
  const { openUserProfile } = useClerk()

  const columns = useMemo<ColumnDef<NotificationChannel>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableSorting: true,
        cell: ({ row }) => {
          const name = row.original.name
          if (!name) return "-"
          const phoneNumber = parsePhoneNumber(name)
          if (phoneNumber) {
            return phoneNumber.formatInternational()
          }
          return name
        },
      },
      {
        header: "Type",
        accessorKey: "type",
        enableSorting: true,
        cell: ({ row }) => (
          <Badge variant={row.original.type === "TEXT" ? "success" : "default"}>
            {startCase(row.original.type)}
          </Badge>
        ),
      },
      {
        header: "Source",
        accessorKey: "clerkId",
        enableSorting: false,
        cell: ({ row }) => {
          const clerkId = row.original.clerkId
          return clerkId ? "Synced from User Account" : "Manually Added"
        },
      },
      {
        header: "Created",
        accessorKey: "createdAt",
        enableSorting: true,
        cell: ({ getValue }) => {
          const date = getValue<Date>()
          if (!date) return "-"
          return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        },
      },
    ],
    [],
  )

  return (
    <EntityTable
      data={initialChannels}
      columns={columns}
      getRowId={(row) => row.id}
      basePath="/notification-channels"
      entityName="Notification Channels"
      renderCard={(channel) => ({
        title:
          channel.type === "TEXT"
            ? parsePhoneNumber(channel.name)?.formatInternational() ||
              channel.name
            : channel.name,
        description: channel.clerkId
          ? "Synced from User Account"
          : "Manually Added",
        badge: {
          label: startCase(channel.type),
          variant: "default",
        },
      })}
      actions={
        <Button onClick={() => openUserProfile()}>Edit Profile Contacts</Button>
      }
      emptyMessage='No notification channels found. Use the "Edit Email & Phone" button to add channels.'
    />
  )
}
