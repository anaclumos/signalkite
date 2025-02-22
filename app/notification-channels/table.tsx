"use client"

import { NavBar } from "@/components/nav-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/ui/table"
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
    data: initialChannels,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
  })

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
      />

      {initialChannels.length === 0 ? (
        <div className="py-8 text-center text-zinc-500">
          No notification channels found. Use the &quot;Edit Email &amp;
          Phone&quot; button to add channels.
        </div>
      ) : (
        <TableRoot>
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

            <TableBody className="divide-y divide-zinc-200">
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
        </TableRoot>
      )}
    </div>
  )
}
