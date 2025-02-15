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
import { Schedule } from "@prisma/client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import cronstrue from "cronstrue"
import Link from "next/link"
import { useMemo } from "react"

interface SchedulesTableProps {
  initialSchedules: Schedule[]
}

export function SchedulesTable({ initialSchedules }: SchedulesTableProps) {
  const columns = useMemo<ColumnDef<Schedule>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableSorting: true,
        cell: ({ row }) => row.original.name,
      },
      {
        header: "Schedule",
        accessorKey: "cron",
        enableSorting: false,
        cell: ({ row }) => cronstrue.toString(row.original.cron),
      },
      {
        header: "Timezone",
        accessorKey: "timezone",
        enableSorting: false,
      },
      {
        header: "Status",
        accessorKey: "paused",
        enableSorting: true,
        cell: ({ getValue }) => {
          const isPaused = getValue<boolean>()
          return (
            <Badge variant={isPaused ? "default" : "success"}>
              {isPaused ? "Paused" : "Active"}
            </Badge>
          )
        },
      },
      {
        header: "Linked Reporters",
        accessorKey: "ScheduleReporters",
        enableSorting: false,
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

  const table = useReactTable<Schedule>({
    data: initialSchedules,
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
          { title: "Reporters", href: "/reporters" },
        ]}
        actions={
          <Link href="/reporters/new">
            <Button>Create</Button>
          </Link>
        }
      />

      {initialSchedules.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No schedules found. Create your first schedule to get started.
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

            <TableBody className="divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <Link href={`/schedules/${row.original.id}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Link>
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
