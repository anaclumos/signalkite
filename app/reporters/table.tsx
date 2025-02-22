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
import { getStrategyLabel } from "@/lib/strategy"
import { Reporter, ReporterStatus } from "@prisma/client"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { startCase } from "es-toolkit/string"
import Link from "next/link"
import { useMemo } from "react"

interface ReportersTableProps {
  initialReporters: Reporter[]
}

export function ReportersTable({ initialReporters }: ReportersTableProps) {
  const columns = useMemo<ColumnDef<Reporter>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableSorting: true,
        cell: ({ row }) => row.original.name,
      },
      {
        header: "Strategy",
        accessorKey: "strategy",
        enableSorting: true,
        cell: ({ row }) => getStrategyLabel(row.original.strategy),
      },
      {
        header: "Issues",
        accessorKey: "_count.issues",
        enableSorting: true,
      },
      {
        header: "Stories",
        accessorKey: "_count.stories",
        enableSorting: true,
      },
      {
        header: "Status",
        accessorKey: "status",
        enableSorting: true,
        cell: ({ getValue }) => {
          const status = getValue<ReporterStatus>()
          return (
            <Badge
              variant={
                status === ReporterStatus.ACTIVE
                  ? "success"
                  : status === ReporterStatus.PAUSED
                    ? "warning"
                    : "default"
              }
            >
              {startCase(status)}
            </Badge>
          )
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

  const table = useReactTable<Reporter>({
    data: initialReporters,
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

      {initialReporters.length === 0 ? (
        <div className="py-8 text-center text-zinc-500">
          No reporters found. Create your first reporter to get started.
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
                      <Link href={`/reporters/${row.id}`}>
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
