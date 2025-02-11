"use client"

import { NavBar } from "@/components/nav-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useClerk } from "@clerk/nextjs"
import { NotificationChannel } from "@prisma/client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { startCase } from "es-toolkit/string"
import parsePhoneNumber from "libphonenumber-js"
import { LayoutGrid, List } from "lucide-react"
import React, { useMemo, useState } from "react"

interface NotificationChannelsTableProps {
  initialChannels: NotificationChannel[]
}

export function NotificationChannelsTable({
  initialChannels,
}: NotificationChannelsTableProps) {
  const [channels] = React.useState<NotificationChannel[]>(initialChannels)
  const [activeView, setActiveView] = useState<"grid" | "list">("grid")

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
          <Badge variant="neutral">{startCase(row.original.type)}</Badge>
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

  const table = useReactTable<NotificationChannel>({
    data: channels,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (originalRow) => originalRow.id,
  })

  const { openUserProfile } = useClerk()

  return (
    <div>
      <NavBar
        breadcrumbs={[
          { title: "Home", href: "/" },
          { title: "Notification Channels", href: "/notification-channels" },
        ]}
        actions={
          <Button onClick={() => openUserProfile()}>
            Edit Profile Contacts
          </Button>
        }
        viewToggle={{
          value: activeView,
          onChange: (value) => setActiveView(value as "grid" | "list"),
          options: [
            { value: "grid", icon: <LayoutGrid className="size-4" /> },
            { value: "list", icon: <List className="size-4" /> },
          ],
        }}
      />
      {channels.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No notification channels found. Use the &quot;Edit Email & Phone&quot;
          button to add channels.
        </div>
      ) : (
        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as "grid" | "list")}
          className="w-full"
        >
          <TabsContent value="grid">
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
              {channels.map((channel) => (
                <Card key={channel.id} className="p-4">
                  <h3 className="flex items-center justify-between gap-2 font-medium">
                    {channel.type === "TEXT"
                      ? parsePhoneNumber(channel.name)?.formatInternational()
                      : channel.name}
                    <Badge variant="neutral">{startCase(channel.type)}</Badge>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Synced from User Account
                  </p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <TableRoot>
              {channels.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No notification channels found. Use the &quot;Edit Email &
                  Phone&quot; button to add channels.
                </div>
              ) : (
                <Table>
                  <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHeaderCell key={header.id}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </TableHeaderCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableHead>

                  <TableBody className="divide-y divide-gray-200">
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableRoot>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
