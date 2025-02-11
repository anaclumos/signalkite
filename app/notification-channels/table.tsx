"use client"

import { NavBar } from "@/components/nav-bar"
import { Badge } from "@/components/ui/badge"
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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { LayoutGrid, List } from "lucide-react"
import React, { useMemo, useState } from "react"
import { NotificationChannelWithRelations } from "./types"

interface NotificationChannelsTableProps {
  initialChannels: NotificationChannelWithRelations[]
}

export function NotificationChannelsTable({
  initialChannels,
}: NotificationChannelsTableProps) {
  const [channels] =
    React.useState<NotificationChannelWithRelations[]>(initialChannels)
  const [activeView, setActiveView] = useState<"grid" | "list">("grid")

  const columns = useMemo<ColumnDef<NotificationChannelWithRelations>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableSorting: true,
        cell: ({ row }) => row.original.name || "-",
      },
      {
        header: "Type",
        accessorKey: "type",
        enableSorting: true,
        cell: ({ row }) => row.original.type,
      },
      {
        header: "Settings",
        accessorKey: "settings",
        enableSorting: false,
        cell: ({ row }) => {
          const settings = row.original.settings as Record<string, unknown>
          return Object.keys(settings).length > 0
            ? "Configured"
            : "Not Configured"
        },
      },
      {
        header: "Subscriptions",
        accessorKey: "Subscription",
        enableSorting: false,
        cell: ({ row }) => row.original.Subscription?.length || 0,
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

  const table = useReactTable<NotificationChannelWithRelations>({
    data: channels,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (originalRow) => originalRow.id,
  })

  return (
    <div>
      <NavBar
        breadcrumbs={[
          { title: "Home", href: "/" },
          { title: "Notification Channels", href: "/notification-channels" },
        ]}
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
                  <h3 className="font-medium">{channel.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    <Badge variant="default">{channel.type}</Badge>
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="text-xs text-gray-500">
                      {channel.Subscription?.length || 0} Subscriptions
                    </span>
                    <span className="text-xs text-gray-500">
                      {Object.keys(channel.settings as Record<string, unknown>)
                        .length > 0
                        ? "Configured"
                        : "Not Configured"}
                    </span>
                  </div>
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
